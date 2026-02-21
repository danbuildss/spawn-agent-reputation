import { NextResponse } from 'next/server'
import { agents } from '@/lib/agents-data'
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit'

// TEE Verifier endpoint (EigenCloud)
const TEE_VERIFIER_URL = process.env.TEE_VERIFIER_URL || 'http://34.83.73.29:3001'

interface TEEAttestation {
  message: string
  messageHash: string
  signature: string
  signer: string
  verifiable: boolean
}

interface TEEReputationResponse {
  address: string
  name?: string
  token?: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  breakdown: {
    contractAge: { score: number; max: number; detail: string }
    liquidity: { score: number; max: number; detail: string }
    holders: { score: number; max: number; detail: string }
    lpLocked: { score: number; max: number; detail: string }
    volume: { score: number; max: number; detail: string }
    creatorHistory: { score: number; max: number; detail: string }
  } | null
  flags: string[]
  recommendation: string
  timestamp: string
  attestation?: TEEAttestation
}

interface ReputationResponse extends TEEReputationResponse {
  source: 'tee' | 'database' | 'fallback'
  verified: boolean
  teeAttestation?: TEEAttestation
}

// Check if address matches any known agent
function findKnownAgent(address: string) {
  const lowerAddress = address.toLowerCase()
  return agents.find(a => a.contract?.toLowerCase() === lowerAddress)
}

// Build reputation from known agent data
function buildFromKnownAgent(agent: typeof agents[0]): ReputationResponse {
  const grade = agent.score >= 85 ? 'A' : agent.score >= 70 ? 'B' : agent.score >= 55 ? 'C' : agent.score >= 40 ? 'D' : 'F'
  
  return {
    address: agent.contract || agent.id,
    name: agent.name,
    token: agent.token,
    score: agent.score,
    grade,
    breakdown: {
      contractAge: { score: Math.round(agent.score * 0.15), max: 15, detail: 'Indexed agent' },
      liquidity: { score: Math.round(agent.score * 0.25), max: 25, detail: `${agent.vouched} ETH vouched` },
      holders: { score: Math.round(agent.score * 0.15), max: 15, detail: `${agent.reviews} reviews` },
      lpLocked: { score: Math.round(agent.score * 0.15), max: 15, detail: agent.status === 'verified' ? 'Verified' : 'Pending' },
      volume: { score: Math.round(agent.score * 0.15), max: 15, detail: agent.launchPlatform || 'Unknown' },
      creatorHistory: { score: Math.round(agent.score * 0.15), max: 15, detail: agent.twitter ? `@${agent.twitter}` : 'Unknown' },
    },
    flags: agent.status !== 'verified' ? ['⚠️ Not yet verified on Spawn'] : [],
    recommendation: agent.score >= 85 
      ? '✅ High trust. Safe to interact with.'
      : agent.score >= 70 
        ? '✅ Good reputation. Proceed with normal caution.'
        : agent.score >= 55
          ? '⚠️ Moderate trust. Do additional research.'
          : '⚠️ Low trust. Exercise caution.',
    source: 'database',
    verified: false, // Database entries aren't TEE-verified
    timestamp: new Date().toISOString(),
  }
}

// Call TEE Verifier for cryptographically signed reputation
async function getTEEReputation(address: string): Promise<TEEReputationResponse | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
    
    const res = await fetch(`${TEE_VERIFIER_URL}/reputation?address=${address}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    })
    
    clearTimeout(timeoutId)
    
    if (!res.ok) {
      console.error('TEE verifier error:', res.status, res.statusText)
      return null
    }
    
    return await res.json()
  } catch (error) {
    console.error('TEE verifier unreachable:', error)
    return null
  }
}

export async function GET(request: Request) {
  // Rate limiting: 30 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'anonymous'
  const rateLimitResult = rateLimit(`reputation:${ip}`, { windowMs: 60000, max: 30 })
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    )
  }

  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json(
      { 
        error: 'Missing address parameter',
        usage: '/api/reputation?address=0x...',
        example: '/api/reputation?address=0x532f27101965dd16442e59d40670faf5ebb142e4'
      },
      { status: 400 }
    )
  }

  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: 'Invalid address format. Must be a valid Ethereum address (0x...)' },
      { status: 400 }
    )
  }

  try {
    // First check our database for known agents
    const knownAgent = findKnownAgent(address)
    if (knownAgent) {
      // For known agents, still try to get TEE attestation for the score
      const teeData = await getTEEReputation(address)
      if (teeData?.attestation) {
        // Merge database info with TEE attestation
        const dbResult = buildFromKnownAgent(knownAgent)
        return NextResponse.json({
          ...dbResult,
          // Use TEE score if available
          score: teeData.score,
          grade: teeData.grade,
          breakdown: teeData.breakdown || dbResult.breakdown,
          verified: true,
          source: 'tee',
          teeAttestation: teeData.attestation,
        })
      }
      // Fallback to database only
      return NextResponse.json(buildFromKnownAgent(knownAgent))
    }

    // Not in database - call TEE Verifier
    const teeData = await getTEEReputation(address)
    
    if (teeData) {
      // TEE response received - this is the golden path
      const response: ReputationResponse = {
        ...teeData,
        source: 'tee',
        verified: !!teeData.attestation,
        teeAttestation: teeData.attestation,
      }
      
      // Add flag if not in our database
      if (!response.flags.some(f => f.includes('Spawn'))) {
        response.flags = [...response.flags, 'ℹ️ Not indexed on Spawn - submit for verification']
      }
      
      return NextResponse.json(response)
    }
    
    // TEE unavailable - return error (don't fallback to unverified local calc)
    return NextResponse.json({
      address,
      score: 0,
      grade: 'F' as const,
      breakdown: null,
      flags: [
        '⚠️ TEE verifier temporarily unavailable',
        'ℹ️ Try again in a moment'
      ],
      recommendation: '⚠️ Could not verify score. Please try again.',
      source: 'fallback',
      verified: false,
      timestamp: new Date().toISOString(),
    })
    
  } catch (error) {
    console.error('Reputation API error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate reputation', details: String(error) },
      { status: 500 }
    )
  }
}
