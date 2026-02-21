import { NextResponse } from 'next/server'
import { agents } from '@/lib/agents-data'
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit'

// TEE Verifier endpoint (EigenCloud) - with Ethos integration
const TEE_VERIFIER_URL = process.env.TEE_VERIFIER_URL || 'http://35.230.48.129:3001'

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
    creatorReputation: { score: number; max: number; detail: string }
  } | null
  creator?: {
    address: string
    ethosScore?: number
    ethosLevel?: string
  }
  flags: string[]
  recommendation: string
  timestamp: string
  attestation?: TEEAttestation
}

interface ReputationResponse extends TEEReputationResponse {
  source: 'tee' | 'database' | 'fallback'
  verified: boolean
  teeAttestation?: TEEAttestation
  spawnIndexed?: boolean
  spawnVerified?: boolean
}

// Check if address matches any known agent
function findKnownAgent(address: string) {
  const lowerAddress = address.toLowerCase()
  return agents.find(a => a.contract?.toLowerCase() === lowerAddress)
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
    // Check if agent is in our database (for enrichment)
    const knownAgent = findKnownAgent(address)
    
    // ALWAYS call TEE Verifier first - this is the source of truth
    const teeData = await getTEEReputation(address)
    
    if (teeData) {
      // TEE response received - this is the golden path
      const response: ReputationResponse = {
        ...teeData,
        // Override name/token if we have better info from database
        name: knownAgent?.name || teeData.name,
        token: knownAgent?.token || teeData.token,
        source: 'tee',
        verified: !!teeData.attestation,
        teeAttestation: teeData.attestation,
        // Add Spawn database status
        spawnIndexed: !!knownAgent,
        spawnVerified: knownAgent?.status === 'verified',
      }
      
      // Update flags based on Spawn status
      let flags = [...(teeData.flags || [])]
      
      // Remove the "not indexed" flag if it's in our database
      if (knownAgent) {
        flags = flags.filter(f => !f.includes('Not indexed on Spawn'))
        if (knownAgent.status === 'verified') {
          flags = ['✅ Verified on Spawn', ...flags]
        } else {
          flags = ['📋 Indexed on Spawn (pending verification)', ...flags]
        }
      }
      
      response.flags = flags
      
      return NextResponse.json(response)
    }
    
    // TEE unavailable - return error (don't serve unverified scores)
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
      spawnIndexed: !!knownAgent,
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
