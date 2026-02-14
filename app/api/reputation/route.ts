import { NextResponse } from 'next/server'
import { agents, getAgentById } from '@/lib/agents-data'

const DEXSCREENER_API = 'https://api.dexscreener.com'
const BASESCAN_API = 'https://api.basescan.org/api'
const BASESCAN_KEY = process.env.BASESCAN_API_KEY || ''

interface ReputationScore {
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
  }
  flags: string[]
  recommendation: string
  source: 'database' | 'live'
  timestamp: string
}

// Check if address matches any known agent
function findKnownAgent(address: string) {
  const lowerAddress = address.toLowerCase()
  return agents.find(a => a.contract?.toLowerCase() === lowerAddress)
}

// Get token info from DexScreener
async function getDexScreenerData(address: string) {
  try {
    const res = await fetch(`${DEXSCREENER_API}/latest/dex/tokens/${address}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    })
    if (!res.ok) return null
    const data = await res.json()
    // Find Base chain pair, prefer highest liquidity
    const basePairs = data.pairs?.filter((p: any) => p.chainId === 'base') || []
    if (basePairs.length === 0) return null
    return basePairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0]
  } catch {
    return null
  }
}

// Get contract deployer from BaseScan
async function getContractDeployer(address: string): Promise<string | null> {
  if (!BASESCAN_KEY) return null
  try {
    const res = await fetch(
      `${BASESCAN_API}?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${BASESCAN_KEY}`
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.result?.[0]?.contractCreator || null
  } catch {
    return null
  }
}

// Build reputation from known agent data
function buildFromKnownAgent(agent: typeof agents[0]): ReputationScore {
  const grade = agent.score >= 85 ? 'A' : agent.score >= 70 ? 'B' : agent.score >= 55 ? 'C' : agent.score >= 40 ? 'D' : 'F'
  
  return {
    address: agent.contract || agent.id,
    name: agent.name,
    token: agent.token,
    score: agent.score,
    grade,
    breakdown: {
      contractAge: { score: Math.round(agent.score * 0.20), max: 20, detail: 'Indexed agent' },
      liquidity: { score: Math.round(agent.score * 0.25), max: 25, detail: `${agent.vouched} ETH vouched` },
      holders: { score: Math.round(agent.score * 0.15), max: 15, detail: `${agent.reviews} reviews` },
      lpLocked: { score: Math.round(agent.score * 0.20), max: 20, detail: agent.status === 'verified' ? 'Verified' : 'Pending' },
      volume: { score: Math.round(agent.score * 0.10), max: 10, detail: agent.launchPlatform || 'Unknown' },
      creatorHistory: { score: Math.round(agent.score * 0.10), max: 10, detail: agent.twitter ? `@${agent.twitter}` : 'Unknown' },
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
    timestamp: new Date().toISOString(),
  }
}

// Calculate live reputation from DexScreener data
async function calculateLiveReputation(pair: any, contractAddress: string): Promise<ReputationScore> {
  const breakdown = {
    contractAge: { score: 0, max: 20, detail: 'Unknown' },
    liquidity: { score: 0, max: 25, detail: '$0' },
    holders: { score: 0, max: 15, detail: '0' },
    lpLocked: { score: 0, max: 20, detail: 'Unknown' },
    volume: { score: 0, max: 10, detail: '$0' },
    creatorHistory: { score: 3, max: 10, detail: 'Not indexed' },
  }
  const flags: string[] = []

  // Contract Age (0-20 points)
  if (pair?.pairCreatedAt) {
    const ageMs = Date.now() - pair.pairCreatedAt
    const ageDays = ageMs / (1000 * 60 * 60 * 24)
    if (ageDays >= 180) {
      breakdown.contractAge = { score: 20, max: 20, detail: `${Math.floor(ageDays)} days` }
    } else if (ageDays >= 90) {
      breakdown.contractAge = { score: 15, max: 20, detail: `${Math.floor(ageDays)} days` }
    } else if (ageDays >= 30) {
      breakdown.contractAge = { score: 10, max: 20, detail: `${Math.floor(ageDays)} days` }
    } else if (ageDays >= 7) {
      breakdown.contractAge = { score: 5, max: 20, detail: `${Math.floor(ageDays)} days` }
      flags.push('⚠️ Less than 30 days old')
    } else {
      breakdown.contractAge = { score: 2, max: 20, detail: `${Math.floor(ageDays)} days` }
      flags.push('🚨 Very new contract (<7 days)')
    }
  }

  // Liquidity (0-25 points)
  const liquidity = pair?.liquidity?.usd || 0
  if (liquidity >= 1000000) {
    breakdown.liquidity = { score: 25, max: 25, detail: `$${(liquidity / 1000000).toFixed(2)}M` }
  } else if (liquidity >= 500000) {
    breakdown.liquidity = { score: 20, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` }
  } else if (liquidity >= 100000) {
    breakdown.liquidity = { score: 15, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` }
  } else if (liquidity >= 50000) {
    breakdown.liquidity = { score: 10, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` }
  } else if (liquidity >= 10000) {
    breakdown.liquidity = { score: 5, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` }
  } else {
    breakdown.liquidity = { score: 0, max: 25, detail: `$${liquidity.toFixed(0)}` }
    flags.push('🚨 Very low liquidity (<$10K)')
  }

  // Holders estimate (0-15 points)
  const txns24h = (pair?.txns?.h24?.buys || 0) + (pair?.txns?.h24?.sells || 0)
  const estimatedHolders = Math.max(txns24h * 5, 50)
  if (estimatedHolders >= 5000) {
    breakdown.holders = { score: 15, max: 15, detail: `~${(estimatedHolders / 1000).toFixed(1)}K+` }
  } else if (estimatedHolders >= 1000) {
    breakdown.holders = { score: 12, max: 15, detail: `~${(estimatedHolders / 1000).toFixed(1)}K` }
  } else if (estimatedHolders >= 500) {
    breakdown.holders = { score: 8, max: 15, detail: `~${estimatedHolders}` }
  } else if (estimatedHolders >= 100) {
    breakdown.holders = { score: 4, max: 15, detail: `~${estimatedHolders}` }
  } else {
    breakdown.holders = { score: 1, max: 15, detail: `<100` }
    flags.push('⚠️ Low holder count')
  }

  // LP stability proxy (0-20 points)
  const priceChange24h = Math.abs(pair?.priceChange?.h24 || 0)
  if (liquidity >= 500000 && priceChange24h < 20) {
    breakdown.lpLocked = { score: 18, max: 20, detail: 'Stable liquidity' }
  } else if (liquidity >= 100000 && priceChange24h < 50) {
    breakdown.lpLocked = { score: 12, max: 20, detail: 'Moderate stability' }
  } else if (liquidity >= 10000) {
    breakdown.lpLocked = { score: 6, max: 20, detail: 'Low stability' }
  } else {
    breakdown.lpLocked = { score: 2, max: 20, detail: 'Unstable' }
    flags.push('⚠️ Price volatility concern')
  }

  // Volume (0-10 points)
  const volume24h = pair?.volume?.h24 || 0
  if (volume24h >= 500000) {
    breakdown.volume = { score: 10, max: 10, detail: `$${(volume24h / 1000000).toFixed(2)}M` }
  } else if (volume24h >= 100000) {
    breakdown.volume = { score: 8, max: 10, detail: `$${(volume24h / 1000).toFixed(0)}K` }
  } else if (volume24h >= 10000) {
    breakdown.volume = { score: 5, max: 10, detail: `$${(volume24h / 1000).toFixed(0)}K` }
  } else {
    breakdown.volume = { score: 2, max: 10, detail: `$${volume24h.toFixed(0)}` }
  }

  // Not in our database
  flags.push('ℹ️ Not indexed on Spawn - submit for verification')

  // Calculate total
  const totalScore = Object.values(breakdown).reduce((sum, b) => sum + b.score, 0)
  
  const grade = totalScore >= 85 ? 'A' : totalScore >= 70 ? 'B' : totalScore >= 55 ? 'C' : totalScore >= 40 ? 'D' : 'F'

  const recommendation = totalScore >= 85 
    ? '✅ High trust. Safe to interact with.'
    : totalScore >= 70 
      ? '✅ Good reputation. Proceed with normal caution.'
      : totalScore >= 55
        ? '⚠️ Moderate trust. Do additional research.'
        : totalScore >= 40
          ? '⚠️ Low trust. Exercise caution.'
          : '🚨 Very low trust. High risk.'

  return {
    address: pair?.baseToken?.address || contractAddress,
    name: pair?.baseToken?.name,
    token: pair?.baseToken?.symbol ? `$${pair.baseToken.symbol}` : undefined,
    score: totalScore,
    grade,
    breakdown,
    flags,
    recommendation,
    source: 'live',
    timestamp: new Date().toISOString(),
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json(
      { 
        error: 'Missing address parameter',
        usage: '/api/reputation?address=0x...',
        example: '/api/reputation?address=0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b'
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
    // First check our database
    const knownAgent = findKnownAgent(address)
    if (knownAgent) {
      return NextResponse.json(buildFromKnownAgent(knownAgent))
    }

    // Not in database, query DexScreener
    const pair = await getDexScreenerData(address)
    
    if (!pair) {
      return NextResponse.json({
        address,
        score: 0,
        grade: 'F',
        breakdown: null,
        flags: [
          '❌ Token not found on DexScreener',
          '❌ No liquidity pool on Base',
          'ℹ️ Submit to Spawn for manual review'
        ],
        recommendation: '🚨 Cannot verify. Token may not exist or has no liquidity on Base.',
        source: 'none',
        timestamp: new Date().toISOString(),
      })
    }

    // Calculate live reputation
    const reputation = await calculateLiveReputation(pair, address)
    return NextResponse.json(reputation)
    
  } catch (error) {
    console.error('Reputation API error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate reputation', details: String(error) },
      { status: 500 }
    )
  }
}
