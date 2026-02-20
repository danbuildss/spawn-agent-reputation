import { NextResponse } from 'next/server'
import { agents, getAgentById } from '@/lib/agents-data'
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit'

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
  /*
   * SPAWN SCORING ALGORITHM v2.0
   * 
   * Total: 100 points
   * - Contract Age:    15 pts (longevity = battle-tested)
   * - Liquidity:       25 pts (depth = can't rug easily)
   * - Holders:         15 pts (distribution = healthier)
   * - LP Stability:    15 pts (locked/stable = committed)
   * - Volume:          15 pts (active market = real usage)
   * - Creator/Social:  15 pts (reputation signals)
   */
  
  const breakdown = {
    contractAge: { score: 0, max: 15, detail: 'Unknown' },
    liquidity: { score: 0, max: 25, detail: '$0' },
    holders: { score: 0, max: 15, detail: '0' },
    lpLocked: { score: 0, max: 15, detail: 'Unknown' },
    volume: { score: 0, max: 15, detail: '$0' },
    creatorHistory: { score: 0, max: 15, detail: 'Unknown' },
  }
  const flags: string[] = []

  // === CONTRACT AGE (0-15 points) ===
  // Older contracts have survived longer, more battle-tested
  if (pair?.pairCreatedAt) {
    const ageMs = Date.now() - pair.pairCreatedAt
    const ageDays = ageMs / (1000 * 60 * 60 * 24)
    if (ageDays >= 365) {
      breakdown.contractAge = { score: 15, max: 15, detail: `${Math.floor(ageDays)} days (1yr+)` }
    } else if (ageDays >= 180) {
      breakdown.contractAge = { score: 13, max: 15, detail: `${Math.floor(ageDays)} days` }
    } else if (ageDays >= 90) {
      breakdown.contractAge = { score: 10, max: 15, detail: `${Math.floor(ageDays)} days` }
    } else if (ageDays >= 30) {
      breakdown.contractAge = { score: 7, max: 15, detail: `${Math.floor(ageDays)} days` }
    } else if (ageDays >= 14) {
      breakdown.contractAge = { score: 4, max: 15, detail: `${Math.floor(ageDays)} days` }
      flags.push('⚠️ Less than 30 days old')
    } else if (ageDays >= 3) {
      breakdown.contractAge = { score: 2, max: 15, detail: `${Math.floor(ageDays)} days` }
      flags.push('🚨 Very new (<14 days)')
    } else {
      breakdown.contractAge = { score: 0, max: 15, detail: `${Math.floor(ageDays)} days` }
      flags.push('🚨 Extremely new (<3 days) - HIGH RISK')
    }
  }

  // === LIQUIDITY (0-25 points) ===
  // Higher liquidity = harder to rug, more stable trading
  const liquidity = pair?.liquidity?.usd || 0
  if (liquidity >= 5000000) {
    breakdown.liquidity = { score: 25, max: 25, detail: `$${(liquidity / 1000000).toFixed(1)}M` }
  } else if (liquidity >= 1000000) {
    breakdown.liquidity = { score: 22, max: 25, detail: `$${(liquidity / 1000000).toFixed(2)}M` }
  } else if (liquidity >= 500000) {
    breakdown.liquidity = { score: 18, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` }
  } else if (liquidity >= 100000) {
    breakdown.liquidity = { score: 14, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` }
  } else if (liquidity >= 50000) {
    breakdown.liquidity = { score: 10, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` }
  } else if (liquidity >= 25000) {
    breakdown.liquidity = { score: 6, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` }
  } else if (liquidity >= 10000) {
    breakdown.liquidity = { score: 3, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` }
    flags.push('⚠️ Low liquidity (<$25K)')
  } else {
    breakdown.liquidity = { score: 0, max: 25, detail: `$${liquidity.toFixed(0)}` }
    flags.push('🚨 Very low liquidity (<$10K) - RUG RISK')
  }

  // === HOLDERS (0-15 points) ===
  // More distributed = healthier, less manipulation
  const txns24h = (pair?.txns?.h24?.buys || 0) + (pair?.txns?.h24?.sells || 0)
  const txns6h = (pair?.txns?.h6?.buys || 0) + (pair?.txns?.h6?.sells || 0)
  // Estimate holders based on transaction patterns
  const estimatedHolders = Math.max(txns24h * 3, txns6h * 10, 20)
  if (estimatedHolders >= 10000) {
    breakdown.holders = { score: 15, max: 15, detail: `~${(estimatedHolders / 1000).toFixed(0)}K+` }
  } else if (estimatedHolders >= 5000) {
    breakdown.holders = { score: 13, max: 15, detail: `~${(estimatedHolders / 1000).toFixed(1)}K` }
  } else if (estimatedHolders >= 1000) {
    breakdown.holders = { score: 10, max: 15, detail: `~${(estimatedHolders / 1000).toFixed(1)}K` }
  } else if (estimatedHolders >= 500) {
    breakdown.holders = { score: 7, max: 15, detail: `~${estimatedHolders}` }
  } else if (estimatedHolders >= 100) {
    breakdown.holders = { score: 4, max: 15, detail: `~${estimatedHolders}` }
  } else {
    breakdown.holders = { score: 1, max: 15, detail: `<100` }
    flags.push('⚠️ Low holder count - concentration risk')
  }

  // === LP STABILITY (0-15 points) ===
  // Stable price + good liquidity = locked or committed LP
  const priceChange24h = Math.abs(pair?.priceChange?.h24 || 0)
  const priceChange6h = Math.abs(pair?.priceChange?.h6 || 0)
  const avgVolatility = (priceChange24h + priceChange6h * 2) / 3
  
  if (liquidity >= 500000 && avgVolatility < 15) {
    breakdown.lpLocked = { score: 15, max: 15, detail: 'Very stable' }
  } else if (liquidity >= 200000 && avgVolatility < 25) {
    breakdown.lpLocked = { score: 12, max: 15, detail: 'Stable' }
  } else if (liquidity >= 100000 && avgVolatility < 40) {
    breakdown.lpLocked = { score: 9, max: 15, detail: 'Moderate' }
  } else if (liquidity >= 50000 && avgVolatility < 60) {
    breakdown.lpLocked = { score: 6, max: 15, detail: 'Some volatility' }
  } else if (avgVolatility < 80) {
    breakdown.lpLocked = { score: 3, max: 15, detail: 'Volatile' }
    flags.push('⚠️ High price volatility')
  } else {
    breakdown.lpLocked = { score: 0, max: 15, detail: 'Very volatile' }
    flags.push('🚨 Extreme volatility - possible manipulation')
  }

  // === VOLUME (0-15 points) ===
  // Active trading = real usage, not dead project
  const volume24h = pair?.volume?.h24 || 0
  const volumeToLiqRatio = liquidity > 0 ? volume24h / liquidity : 0
  
  if (volume24h >= 1000000) {
    breakdown.volume = { score: 15, max: 15, detail: `$${(volume24h / 1000000).toFixed(1)}M` }
  } else if (volume24h >= 500000) {
    breakdown.volume = { score: 13, max: 15, detail: `$${(volume24h / 1000).toFixed(0)}K` }
  } else if (volume24h >= 100000) {
    breakdown.volume = { score: 10, max: 15, detail: `$${(volume24h / 1000).toFixed(0)}K` }
  } else if (volume24h >= 50000) {
    breakdown.volume = { score: 7, max: 15, detail: `$${(volume24h / 1000).toFixed(0)}K` }
  } else if (volume24h >= 10000) {
    breakdown.volume = { score: 4, max: 15, detail: `$${(volume24h / 1000).toFixed(0)}K` }
  } else {
    breakdown.volume = { score: 1, max: 15, detail: `$${volume24h.toFixed(0)}` }
    flags.push('⚠️ Low trading volume')
  }
  
  // Flag suspicious volume patterns
  if (volumeToLiqRatio > 10) {
    flags.push('⚠️ Unusually high volume/liquidity ratio - possible wash trading')
  }

  // === CREATOR/SOCIAL (0-15 points) ===
  // Base points for having any data, bonus for verified info
  let socialScore = 2 // Base: token exists and has data
  
  // Has website
  if (pair?.info?.websites?.length > 0) {
    socialScore += 3
  }
  
  // Has socials (Twitter, Telegram, etc)
  if (pair?.info?.socials?.length > 0) {
    socialScore += 3
    const hasTwitter = pair.info.socials.some((s: any) => s.type === 'twitter')
    const hasTelegram = pair.info.socials.some((s: any) => s.type === 'telegram')
    if (hasTwitter) socialScore += 2
    if (hasTelegram) socialScore += 1
  }
  
  // Has description/image (more effort = more legitimate)
  if (pair?.info?.imageUrl) socialScore += 2
  if (pair?.baseToken?.name && pair.baseToken.name.length > 3) socialScore += 2
  
  breakdown.creatorHistory = { 
    score: Math.min(socialScore, 15), 
    max: 15, 
    detail: socialScore >= 10 ? 'Good presence' : socialScore >= 5 ? 'Some presence' : 'Limited info'
  }
  
  if (socialScore < 5) {
    flags.push('⚠️ Limited project information')
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
