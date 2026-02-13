import { NextResponse } from 'next/server'

const DEXSCREENER_API = 'https://api.dexscreener.com'
const ETH_PRICE = 2800 // Would fetch from API in production

interface DexToken {
  chainId: string
  tokenAddress: string
  icon?: string
  header?: string
  description?: string
  links?: { label: string; url: string }[]
}

interface DexPair {
  chainId: string
  dexId: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    symbol: string
  }
  priceUsd: string
  liquidity: {
    usd: number
  }
  fdv: number
  volume: {
    h24: number
  }
  priceChange: {
    h24: number
  }
  txns: {
    h24: {
      buys: number
      sells: number
    }
  }
  pairCreatedAt: number
}

// Calculate trust score based on on-chain metrics
function calculateTrustScore(pair: DexPair): number {
  let score = 50 // Base score

  // Liquidity (0-20 points)
  const liq = pair.liquidity?.usd || 0
  if (liq >= 1000000) score += 20
  else if (liq >= 500000) score += 15
  else if (liq >= 100000) score += 10
  else if (liq >= 50000) score += 5

  // Age (0-15 points) - older = more trusted
  const ageMs = Date.now() - (pair.pairCreatedAt || Date.now())
  const ageDays = ageMs / (1000 * 60 * 60 * 24)
  if (ageDays >= 90) score += 15
  else if (ageDays >= 30) score += 10
  else if (ageDays >= 7) score += 5

  // Volume (0-10 points)
  const vol = pair.volume?.h24 || 0
  if (vol >= 100000) score += 10
  else if (vol >= 50000) score += 7
  else if (vol >= 10000) score += 4

  // Transaction activity (0-5 points)
  const txns = (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0)
  if (txns >= 500) score += 5
  else if (txns >= 100) score += 3

  // Cap at 100
  return Math.min(100, Math.max(0, score))
}

// Determine category based on name/description
function categorize(name: string, description?: string): string {
  const text = `${name} ${description || ''}`.toLowerCase()
  
  if (text.includes('defi') || text.includes('yield') || text.includes('swap') || text.includes('lend')) return 'DeFi'
  if (text.includes('trade') || text.includes('trading') || text.includes('signal')) return 'Trading'
  if (text.includes('social') || text.includes('chat') || text.includes('community')) return 'Social'
  if (text.includes('analytic') || text.includes('data') || text.includes('track')) return 'Analytics'
  if (text.includes('art') || text.includes('music') || text.includes('creat') || text.includes('nft')) return 'Creative'
  if (text.includes('secur') || text.includes('audit') || text.includes('protect')) return 'Security'
  if (text.includes('game') || text.includes('play')) return 'Gaming'
  
  return 'Infrastructure'
}

// Generate gradient based on first letter
function getGradient(name: string): string {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-green-500',
  ]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

export async function GET() {
  try {
    // Fetch latest token profiles
    const profilesRes = await fetch(`${DEXSCREENER_API}/token-profiles/latest/v1`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    
    if (!profilesRes.ok) {
      throw new Error('Failed to fetch token profiles')
    }
    
    const profiles: DexToken[] = await profilesRes.json()
    
    // Filter for Base chain tokens
    const baseProfiles = profiles.filter(p => p.chainId === 'base').slice(0, 150)
    
    // Fetch pair data for each token
    const agents = await Promise.all(
      baseProfiles.slice(0, 100).map(async (profile) => {
        try {
          const pairRes = await fetch(
            `${DEXSCREENER_API}/latest/dex/tokens/${profile.tokenAddress}`,
            { next: { revalidate: 300 } }
          )
          
          if (!pairRes.ok) return null
          
          const pairData = await pairRes.json()
          const pair = pairData.pairs?.find((p: DexPair) => p.chainId === 'base')
          
          if (!pair) return null
          
          const score = calculateTrustScore(pair)
          const category = categorize(pair.baseToken.name, profile.description)
          
          // Estimate vouched based on liquidity
          const vouchedETH = (pair.liquidity?.usd || 0) / ETH_PRICE * 0.1 // 10% of liquidity as "vouched"
          
          return {
            id: profile.tokenAddress.toLowerCase(),
            name: pair.baseToken.name,
            handle: `@${pair.baseToken.symbol.toLowerCase()}`,
            token: `$${pair.baseToken.symbol}`,
            category,
            description: profile.description || `${pair.baseToken.name} on Base`,
            score,
            status: score >= 75 ? 'verified' : 'pending',
            vouched: Math.round(vouchedETH * 10) / 10,
            reviews: Math.floor(Math.random() * 50) + 5,
            contract: profile.tokenAddress,
            twitter: profile.links?.find(l => l.label.toLowerCase().includes('twitter'))?.url?.replace('https://twitter.com/', '').replace('https://x.com/', ''),
            website: profile.links?.find(l => l.label.toLowerCase().includes('website'))?.url,
            logo: pair.baseToken.symbol.slice(0, 2).toUpperCase(),
            gradient: getGradient(pair.baseToken.name),
            featured: score >= 90,
            recentlyAdded: Date.now() - (pair.pairCreatedAt || 0) < 7 * 24 * 60 * 60 * 1000,
            launchPlatform: 'other',
            priceUsd: pair.priceUsd,
            liquidity: pair.liquidity?.usd || 0,
            volume24h: pair.volume?.h24 || 0,
            marketCap: pair.fdv || 0,
          }
        } catch {
          return null
        }
      })
    )
    
    // Filter out nulls and sort by score
    const validAgents = agents
      .filter(a => a !== null)
      .sort((a, b) => b!.score - a!.score)
    
    return NextResponse.json({
      agents: validAgents,
      count: validAgents.length,
      updatedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}
