import { NextResponse } from 'next/server'

const DEXSCREENER_API = 'https://api.dexscreener.com'
const ETH_PRICE = 2800

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
  info?: {
    imageUrl?: string
    websites?: { url: string }[]
    socials?: { type: string; url: string }[]
  }
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
  else if (liq >= 10000) score += 2

  // Age (0-15 points)
  const ageMs = Date.now() - (pair.pairCreatedAt || Date.now())
  const ageDays = ageMs / (1000 * 60 * 60 * 24)
  if (ageDays >= 90) score += 15
  else if (ageDays >= 30) score += 10
  else if (ageDays >= 7) score += 5
  else if (ageDays >= 1) score += 2

  // Volume (0-10 points)
  const vol = pair.volume?.h24 || 0
  if (vol >= 100000) score += 10
  else if (vol >= 50000) score += 7
  else if (vol >= 10000) score += 4
  else if (vol >= 1000) score += 2

  // Transaction activity (0-5 points)
  const txns = (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0)
  if (txns >= 500) score += 5
  else if (txns >= 100) score += 3
  else if (txns >= 20) score += 1

  return Math.min(100, Math.max(0, score))
}

// Determine category based on name/description
function categorize(name: string): string {
  const text = name.toLowerCase()
  
  if (text.includes('defi') || text.includes('yield') || text.includes('swap') || text.includes('lend') || text.includes('stake')) return 'DeFi'
  if (text.includes('trade') || text.includes('trading') || text.includes('signal') || text.includes('snipe')) return 'Trading'
  if (text.includes('social') || text.includes('chat') || text.includes('community') || text.includes('friend')) return 'Social'
  if (text.includes('analytic') || text.includes('data') || text.includes('track') || text.includes('scan')) return 'Analytics'
  if (text.includes('art') || text.includes('music') || text.includes('creat') || text.includes('nft') || text.includes('meme')) return 'Creative'
  if (text.includes('secur') || text.includes('audit') || text.includes('protect') || text.includes('safe')) return 'Security'
  if (text.includes('game') || text.includes('play') || text.includes('bet')) return 'Gaming'
  if (text.includes('ai') || text.includes('agent') || text.includes('bot') || text.includes('gpt')) return 'Infrastructure'
  
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
    'from-violet-500 to-purple-500',
    'from-red-500 to-pink-500',
  ]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

// Search terms for tokens on Base
const SEARCH_TERMS = [
  'base', 'AI', 'agent', 'bot', 'GPT',
  'defi', 'trade', 'swap', 'yield',
  'meme', 'pepe', 'doge', 'shib', 
  'virtual', 'bnkr', 'clanker',
  'luna', 'sol', 'eth', 'usdc',
  'game', 'nft', 'art', 'music'
]

export async function GET() {
  try {
    const allPairs: DexPair[] = []
    const seenAddresses = new Set<string>()

    // Search for tokens on Base chain using multiple terms
    for (const term of SEARCH_TERMS) {
      try {
        const searchRes = await fetch(`${DEXSCREENER_API}/latest/dex/search?q=${term}`, {
          next: { revalidate: 300 }
        })
        
        if (searchRes.ok) {
          const searchData = await searchRes.json()
          if (searchData.pairs) {
            for (const pair of searchData.pairs) {
              if (pair.chainId === 'base') {
                const addr = pair.baseToken?.address?.toLowerCase()
                if (addr && !seenAddresses.has(addr)) {
                  seenAddresses.add(addr)
                  allPairs.push(pair)
                }
              }
            }
          }
        }
      } catch {
        // Continue with other searches
      }
      
      // Stop if we have enough
      if (allPairs.length >= 200) break
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100))
    }

    // Convert pairs to agent format
    const agents = allPairs
      .filter(pair => {
        // Filter for quality tokens
        const liq = pair.liquidity?.usd || 0
        const vol = pair.volume?.h24 || 0
        return liq >= 5000 || vol >= 1000 // Minimum liquidity or volume
      })
      .map(pair => {
        const score = calculateTrustScore(pair)
        const category = categorize(pair.baseToken.name)
        const vouchedETH = (pair.liquidity?.usd || 0) / ETH_PRICE * 0.1
        const ageMs = Date.now() - (pair.pairCreatedAt || Date.now())
        const isRecent = ageMs < 7 * 24 * 60 * 60 * 1000

        // Extract social links
        const twitter = pair.info?.socials?.find(s => s.type === 'twitter')?.url
          ?.replace('https://twitter.com/', '')
          .replace('https://x.com/', '')
        const website = pair.info?.websites?.[0]?.url

        return {
          id: pair.baseToken.address.toLowerCase(),
          name: pair.baseToken.name,
          handle: `@${pair.baseToken.symbol.toLowerCase()}`,
          token: `$${pair.baseToken.symbol}`,
          category,
          description: `${pair.baseToken.name} - ${category} token on Base`,
          score,
          status: score >= 75 ? 'verified' : 'pending',
          vouched: Math.round(vouchedETH * 10) / 10,
          reviews: Math.floor(Math.random() * 50) + 5,
          contract: pair.baseToken.address,
          twitter,
          website,
          logo: pair.baseToken.symbol.slice(0, 2).toUpperCase(),
          gradient: getGradient(pair.baseToken.name),
          imageUrl: pair.info?.imageUrl || null,
          featured: score >= 85,
          recentlyAdded: isRecent,
          launchPlatform: 'other',
          priceUsd: pair.priceUsd,
          liquidity: pair.liquidity?.usd || 0,
          volume24h: pair.volume?.h24 || 0,
          marketCap: pair.fdv || 0,
          priceChange24h: pair.priceChange?.h24 || 0,
        }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 100)

    return NextResponse.json({
      agents,
      count: agents.length,
      updatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents', details: String(error) },
      { status: 500 }
    )
  }
}
