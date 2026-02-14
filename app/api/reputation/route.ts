import { NextResponse } from 'next/server'

const DEXSCREENER_API = 'https://api.dexscreener.com'
const BASESCAN_API = 'https://api.basescan.org/api'
const BASESCAN_KEY = process.env.BASESCAN_API_KEY || ''
const ETHOS_API = 'https://api.ethos.network/api/v2'

interface ReputationScore {
  address: string
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
  timestamp: string
}

// Get token info from DexScreener
async function getDexScreenerData(address: string) {
  try {
    const res = await fetch(`${DEXSCREENER_API}/latest/dex/tokens/${address}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.pairs?.find((p: any) => p.chainId === 'base') || null
  } catch {
    return null
  }
}

// Get contract creation date from BaseScan
async function getContractAge(address: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${BASESCAN_API}?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${BASESCAN_KEY}`
    )
    if (!res.ok) return null
    const data = await res.json()
    if (data.result?.[0]?.txHash) {
      // Get transaction timestamp
      const txRes = await fetch(
        `${BASESCAN_API}?module=proxy&action=eth_getTransactionByHash&txhash=${data.result[0].txHash}&apikey=${BASESCAN_KEY}`
      )
      if (txRes.ok) {
        const txData = await txRes.json()
        // For simplicity, estimate age from pair creation if available
        return null
      }
    }
    return null
  } catch {
    return null
  }
}

// Get creator reputation from Ethos Network
interface EthosScore {
  score: number
  level: string
}

async function getEthosScore(address: string): Promise<EthosScore | null> {
  try {
    const res = await fetch(
      `${ETHOS_API}/score/address?address=${address}`,
      {
        headers: {
          'X-Ethos-Client': 'spawn-reputation'
        }
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      score: data.score || 0,
      level: data.level || 'unknown'
    }
  } catch {
    return null
  }
}

// Get contract deployer address from BaseScan
async function getContractDeployer(address: string): Promise<string | null> {
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

// Calculate reputation score
async function calculateReputation(pair: any, contractAddress: string): Promise<ReputationScore> {
  const address = pair?.baseToken?.address || 'unknown'
  const breakdown = {
    contractAge: { score: 0, max: 20, detail: 'Unknown' },
    liquidity: { score: 0, max: 25, detail: '$0' },
    holders: { score: 0, max: 15, detail: '0' },
    lpLocked: { score: 0, max: 20, detail: 'Unknown' },
    volume: { score: 0, max: 10, detail: '$0' },
    creatorHistory: { score: 0, max: 10, detail: 'Unknown' },
  }
  const flags: string[] = []

  // Contract Age (0-20 points)
  if (pair?.pairCreatedAt) {
    const ageMs = Date.now() - pair.pairCreatedAt
    const ageDays = ageMs / (1000 * 60 * 60 * 24)
    if (ageDays >= 180) {
      breakdown.contractAge = { score: 20, max: 20, detail: `${Math.floor(ageDays)} days (6+ months)` }
    } else if (ageDays >= 90) {
      breakdown.contractAge = { score: 15, max: 20, detail: `${Math.floor(ageDays)} days (3+ months)` }
    } else if (ageDays >= 30) {
      breakdown.contractAge = { score: 10, max: 20, detail: `${Math.floor(ageDays)} days (1+ month)` }
    } else if (ageDays >= 7) {
      breakdown.contractAge = { score: 5, max: 20, detail: `${Math.floor(ageDays)} days (1+ week)` }
    } else {
      breakdown.contractAge = { score: 2, max: 20, detail: `${Math.floor(ageDays)} days (very new)` }
      flags.push('⚠️ Contract is less than 7 days old')
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
    flags.push('⚠️ Low liquidity (under $10K)')
  }

  // Holder estimate based on transactions (0-15 points)
  const txns24h = (pair?.txns?.h24?.buys || 0) + (pair?.txns?.h24?.sells || 0)
  const estimatedHolders = Math.max(txns24h * 5, 100) // Rough estimate
  if (estimatedHolders >= 5000) {
    breakdown.holders = { score: 15, max: 15, detail: `~${(estimatedHolders / 1000).toFixed(1)}K+ holders` }
  } else if (estimatedHolders >= 1000) {
    breakdown.holders = { score: 12, max: 15, detail: `~${(estimatedHolders / 1000).toFixed(1)}K holders` }
  } else if (estimatedHolders >= 500) {
    breakdown.holders = { score: 8, max: 15, detail: `~${estimatedHolders} holders` }
  } else if (estimatedHolders >= 100) {
    breakdown.holders = { score: 4, max: 15, detail: `~${estimatedHolders} holders` }
  } else {
    breakdown.holders = { score: 0, max: 15, detail: `<100 holders` }
    flags.push('⚠️ Very few holders')
  }

  // LP Locked estimate (0-20 points) - Would need actual LP lock check
  // For now, use liquidity stability as proxy
  if (liquidity >= 500000) {
    breakdown.lpLocked = { score: 15, max: 20, detail: 'High liquidity (likely stable)' }
  } else if (liquidity >= 100000) {
    breakdown.lpLocked = { score: 10, max: 20, detail: 'Moderate liquidity' }
  } else {
    breakdown.lpLocked = { score: 5, max: 20, detail: 'Unable to verify LP lock' }
    flags.push('⚠️ LP lock status unknown')
  }

  // Volume (0-10 points)
  const volume24h = pair?.volume?.h24 || 0
  if (volume24h >= 500000) {
    breakdown.volume = { score: 10, max: 10, detail: `$${(volume24h / 1000000).toFixed(2)}M (24h)` }
  } else if (volume24h >= 100000) {
    breakdown.volume = { score: 8, max: 10, detail: `$${(volume24h / 1000).toFixed(0)}K (24h)` }
  } else if (volume24h >= 10000) {
    breakdown.volume = { score: 5, max: 10, detail: `$${(volume24h / 1000).toFixed(0)}K (24h)` }
  } else {
    breakdown.volume = { score: 2, max: 10, detail: `$${volume24h.toFixed(0)} (24h)` }
  }

  // Creator History (0-10 points) - Using Ethos Network
  try {
    // Get deployer address
    const deployer = await getContractDeployer(contractAddress)
    if (deployer) {
      const ethosScore = await getEthosScore(deployer)
      if (ethosScore) {
        // Ethos scores range from 0-2000+, normalize to 0-10
        const normalizedScore = Math.min(10, Math.round(ethosScore.score / 200))
        let detail = `Ethos: ${ethosScore.score} (${ethosScore.level})`
        
        if (ethosScore.score >= 1500) {
          breakdown.creatorHistory = { score: 10, max: 10, detail: `${detail} - Excellent` }
        } else if (ethosScore.score >= 1000) {
          breakdown.creatorHistory = { score: 8, max: 10, detail: `${detail} - Good` }
        } else if (ethosScore.score >= 500) {
          breakdown.creatorHistory = { score: 5, max: 10, detail: `${detail} - Moderate` }
        } else if (ethosScore.score > 0) {
          breakdown.creatorHistory = { score: 3, max: 10, detail: `${detail} - Low` }
          flags.push('⚠️ Creator has low Ethos reputation')
        } else {
          breakdown.creatorHistory = { score: 1, max: 10, detail: 'Ethos: No score' }
          flags.push('⚠️ Creator has no Ethos reputation')
        }
      } else {
        breakdown.creatorHistory = { score: 3, max: 10, detail: 'Creator not on Ethos' }
      }
    } else {
      breakdown.creatorHistory = { score: 3, max: 10, detail: 'Deployer unknown' }
    }
  } catch {
    breakdown.creatorHistory = { score: 3, max: 10, detail: 'Unable to check Ethos' }
  }

  // Calculate total score
  const totalScore = Object.values(breakdown).reduce((sum, b) => sum + b.score, 0)
  
  // Determine grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F'
  if (totalScore >= 85) grade = 'A'
  else if (totalScore >= 70) grade = 'B'
  else if (totalScore >= 55) grade = 'C'
  else if (totalScore >= 40) grade = 'D'
  else grade = 'F'

  // Generate recommendation
  let recommendation: string
  if (totalScore >= 85) {
    recommendation = '✅ High trust. Safe to interact with.'
  } else if (totalScore >= 70) {
    recommendation = '✅ Good reputation. Proceed with normal caution.'
  } else if (totalScore >= 55) {
    recommendation = '⚠️ Moderate trust. Do additional research.'
  } else if (totalScore >= 40) {
    recommendation = '⚠️ Low trust. Exercise caution.'
  } else {
    recommendation = '🚨 Very low trust. High risk - avoid or investigate thoroughly.'
  }

  return {
    address,
    score: totalScore,
    grade,
    breakdown,
    flags,
    recommendation,
    timestamp: new Date().toISOString(),
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json(
      { error: 'Missing address parameter. Usage: /api/reputation?address=0x...' },
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
    // Get DexScreener data
    const pair = await getDexScreenerData(address)
    
    if (!pair) {
      return NextResponse.json({
        address,
        score: 0,
        grade: 'F',
        breakdown: null,
        flags: ['❌ Token not found on DexScreener'],
        recommendation: '🚨 Cannot verify. Token may not exist or has no liquidity.',
        timestamp: new Date().toISOString(),
        error: 'Token not found on Base chain'
      })
    }

    // Calculate reputation
    const reputation = await calculateReputation(pair, address)

    return NextResponse.json(reputation)
  } catch (error) {
    console.error('Reputation API error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate reputation', details: String(error) },
      { status: 500 }
    )
  }
}
