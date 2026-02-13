// Base Ecosystem AI Agents Database
// Source: Bankr ecosystem, Virtuals, Clanker, and Base AI agent scene
// Last updated: 2026-02-13

// ETH price for calculations (would be fetched from API in production)
export const ETH_PRICE = 2800

export interface Agent {
  id: string
  name: string
  handle: string
  token: string
  category: 'Infrastructure' | 'DeFi' | 'Social' | 'Analytics' | 'Creative' | 'Trading' | 'Gaming' | 'Security'
  description: string
  score: number
  status: 'verified' | 'pending' | 'unverified'
  vouched: number // ETH vouched
  reviews: number
  contract?: string
  website?: string
  twitter?: string
  logo: string
  gradient: string
  featured?: boolean
  recentlyAdded?: boolean
  launchPlatform?: 'bankr' | 'clanker' | 'virtuals' | 'other'
  imageUrl?: string | null
  priceUsd?: string
  liquidity?: number
  volume24h?: number
  marketCap?: number
  priceChange24h?: number
}

// Format vouched amount with USD value
export const formatVouched = (eth: number) => {
  const usd = eth * ETH_PRICE
  if (usd >= 1000000) {
    return `${eth} ETH / $${(usd / 1000000).toFixed(1)}M`
  } else if (usd >= 1000) {
    return `${eth} ETH / $${(usd / 1000).toFixed(0)}K`
  }
  return `${eth} ETH / $${usd.toFixed(0)}`
}

// Short format for tables
export const formatVouchedShort = (eth: number) => {
  const usd = eth * ETH_PRICE
  if (usd >= 1000000) {
    return { eth: `${eth} ETH`, usd: `$${(usd / 1000000).toFixed(1)}M` }
  } else if (usd >= 1000) {
    return { eth: `${eth} ETH`, usd: `$${(usd / 1000).toFixed(0)}K` }
  }
  return { eth: `${eth} ETH`, usd: `$${usd.toFixed(0)}` }
}

export const agents: Agent[] = [
  // Tier 1: Core Infrastructure
  {
    id: 'bankr',
    name: 'Bankr',
    handle: '@bankrbot',
    token: '$BNKR',
    category: 'Infrastructure',
    description: 'Core AI crypto bank for wallets, trading, and token launches on Base.',
    score: 96,
    status: 'verified',
    vouched: 24.5,
    reviews: 89,
    contract: '0x22aF33FE49fD1Fa80c7149773dDe5890D3c76F3b',
    twitter: 'bankrbot',
    logo: 'B',
    gradient: 'from-green-500 to-emerald-500',
    featured: true,
    launchPlatform: 'bankr'
  },
  {
    id: 'clanker',
    name: 'Clanker',
    handle: '@clanker_world',
    token: '$CLANKER',
    category: 'Infrastructure',
    description: 'Token issuance infrastructure for autonomous agent deployments.',
    score: 94,
    status: 'verified',
    vouched: 18.2,
    reviews: 67,
    contract: '0x1bc0c42215582d5A085795F3E8d98e39f4e9D6b0',
    twitter: 'clanker_world',
    logo: 'C',
    gradient: 'from-purple-500 to-pink-500',
    featured: true,
    launchPlatform: 'clanker'
  },
  {
    id: 'virtuals',
    name: 'Virtuals Protocol',
    handle: '@virtuals_io',
    token: '$VIRTUAL',
    category: 'Infrastructure',
    description: 'Tokenized AI agent platform with co-ownership model.',
    score: 93,
    status: 'verified',
    vouched: 31.0,
    reviews: 124,
    contract: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
    twitter: 'virtuals_io',
    logo: 'V',
    gradient: 'from-blue-500 to-cyan-500',
    featured: true,
    launchPlatform: 'virtuals'
  },
  {
    id: 'clawdbot',
    name: 'Clawdbot',
    handle: '@clawdbotatg',
    token: '$CLAWD',
    category: 'Infrastructure',
    description: 'Multi-agent system for on-chain apps and tools.',
    score: 91,
    status: 'verified',
    vouched: 12.8,
    reviews: 56,
    contract: '0xCb95a02A4D4D89b9A4D2F1D08A05A5F8C3C4Ab5D',
    twitter: 'clawdbotatg',
    logo: 'CL',
    gradient: 'from-orange-500 to-red-500',
    launchPlatform: 'other'
  },
  {
    id: 'elsa',
    name: 'Hey Elsa AI',
    handle: '@HeyElsaAI',
    token: '$ELSA',
    category: 'DeFi',
    description: 'DeFi copilot for staking and lending automation.',
    score: 88,
    status: 'verified',
    vouched: 8.4,
    reviews: 42,
    twitter: 'HeyElsaAI',
    logo: 'E',
    gradient: 'from-pink-500 to-rose-500',
    recentlyAdded: true,
    launchPlatform: 'bankr'
  },
  {
    id: 'wach',
    name: 'Wach AI',
    handle: '@Wach_AI',
    token: '$WACH',
    category: 'Analytics',
    description: 'DeFi risk analytics and monitoring tools.',
    score: 85,
    status: 'verified',
    vouched: 5.2,
    reviews: 31,
    twitter: 'Wach_AI',
    logo: 'W',
    gradient: 'from-yellow-500 to-orange-500',
    launchPlatform: 'bankr'
  },
  {
    id: 'aixbt',
    name: 'AIXBT Agent',
    handle: '@aixbt_agent',
    token: '$AIXBT',
    category: 'Analytics',
    description: 'AI market analysis and crypto insights agent.',
    score: 87,
    status: 'verified',
    vouched: 9.1,
    reviews: 58,
    twitter: 'aixbt_agent',
    logo: 'AI',
    gradient: 'from-indigo-500 to-blue-500',
    launchPlatform: 'other'
  },
  {
    id: 'moltbook',
    name: 'Moltbook',
    handle: '@moltbook',
    token: '$MOLT',
    category: 'Social',
    description: 'Social network and forum for AI agents.',
    score: 82,
    status: 'verified',
    vouched: 6.7,
    reviews: 38,
    twitter: 'moltbook',
    logo: 'M',
    gradient: 'from-teal-500 to-green-500',
    launchPlatform: 'bankr'
  },
  {
    id: 'freysa',
    name: 'Freysa AI',
    handle: '@freysa_ai',
    token: '$FREYSA',
    category: 'Infrastructure',
    description: 'Sovereign AI agent integration platform.',
    score: 84,
    status: 'verified',
    vouched: 7.3,
    reviews: 29,
    twitter: 'freysa_ai',
    logo: 'F',
    gradient: 'from-violet-500 to-purple-500',
    recentlyAdded: true,
    launchPlatform: 'other'
  },
  {
    id: 'zerebro',
    name: '0xZerebro',
    handle: '@0xzerebro',
    token: '$ZEREBRO',
    category: 'Creative',
    description: 'Cross-chain artist and content creation agent.',
    score: 81,
    status: 'verified',
    vouched: 4.8,
    reviews: 35,
    twitter: '0xzerebro',
    logo: 'Z',
    gradient: 'from-red-500 to-pink-500',
    launchPlatform: 'other'
  },
  {
    id: 'louder',
    name: 'Louder on Base',
    handle: '@louderonbase',
    token: '$LOUDER',
    category: 'Creative',
    description: 'On-chain musician AI agent.',
    score: 76,
    status: 'pending',
    vouched: 2.1,
    reviews: 18,
    twitter: 'louderonbase',
    logo: 'L',
    gradient: 'from-amber-500 to-yellow-500',
    recentlyAdded: true,
    launchPlatform: 'bankr'
  },
  {
    id: 'starkbot',
    name: 'StarkBot AI',
    handle: '@starkbotai',
    token: '$STARK',
    category: 'Infrastructure',
    description: 'Autonomous agents and payments infrastructure.',
    score: 83,
    status: 'verified',
    vouched: 5.9,
    reviews: 27,
    twitter: 'starkbotai',
    logo: 'S',
    gradient: 'from-slate-500 to-gray-500',
    launchPlatform: 'bankr'
  },
  {
    id: 'clawnch',
    name: 'Clawnch Bot',
    handle: '@Clawnch_Bot',
    token: '$CLAWNCH',
    category: 'Infrastructure',
    description: 'Agent-only token launch platform.',
    score: 79,
    status: 'verified',
    vouched: 3.4,
    reviews: 22,
    twitter: 'Clawnch_Bot',
    logo: 'CW',
    gradient: 'from-emerald-500 to-teal-500',
    launchPlatform: 'other'
  },
  {
    id: 'lobsterxbt',
    name: 'LobsterXBT AI',
    handle: '@LOBSTERXBTAI',
    token: '$LOBSTER',
    category: 'Analytics',
    description: 'Market tracking and on-chain data agent.',
    score: 77,
    status: 'pending',
    vouched: 2.8,
    reviews: 19,
    twitter: 'LOBSTERXBTAI',
    logo: 'LX',
    gradient: 'from-red-600 to-orange-500',
    launchPlatform: 'bankr'
  },
  {
    id: 'simulacrum',
    name: 'Simulacrum',
    handle: '@SimulacrumIO',
    token: '$SIM',
    category: 'Infrastructure',
    description: 'Tweet-to-agent deployment platform.',
    score: 74,
    status: 'pending',
    vouched: 1.9,
    reviews: 14,
    twitter: 'SimulacrumIO',
    logo: 'SI',
    gradient: 'from-cyan-500 to-blue-500',
    recentlyAdded: true,
    launchPlatform: 'other'
  },
  {
    id: 'cookie',
    name: 'Cookie.fun',
    handle: '@cookiedotfun',
    token: '$COOKIE',
    category: 'Analytics',
    description: 'AI agent data and indexing platform.',
    score: 80,
    status: 'verified',
    vouched: 4.2,
    reviews: 25,
    twitter: 'cookiedotfun',
    logo: 'CO',
    gradient: 'from-yellow-600 to-amber-500',
    launchPlatform: 'other'
  },
  {
    id: 'kudai',
    name: 'Kudai',
    handle: '@Kudai_IO',
    token: '$KUDAI',
    category: 'DeFi',
    description: 'Real-yield focused automation agent.',
    score: 73,
    status: 'pending',
    vouched: 1.5,
    reviews: 11,
    twitter: 'Kudai_IO',
    logo: 'K',
    gradient: 'from-lime-500 to-green-500',
    launchPlatform: 'bankr'
  },
  {
    id: 'holoworld',
    name: 'HoloWorld AI',
    handle: '@HoloworldAI',
    token: '$HOLO',
    category: 'Creative',
    description: 'Character and storytelling AI engine.',
    score: 71,
    status: 'pending',
    vouched: 1.2,
    reviews: 9,
    twitter: 'HoloworldAI',
    logo: 'H',
    gradient: 'from-fuchsia-500 to-pink-500',
    recentlyAdded: true,
    launchPlatform: 'bankr'
  },
  {
    id: 'almanax',
    name: 'Almanax AI',
    handle: '@AlmanaxAI',
    token: '$ALMANAX',
    category: 'Security',
    description: 'Blockchain vulnerability-finding agent.',
    score: 78,
    status: 'verified',
    vouched: 3.1,
    reviews: 16,
    twitter: 'AlmanaxAI',
    logo: 'A',
    gradient: 'from-rose-500 to-red-500',
    launchPlatform: 'bankr'
  },
  {
    id: 'morpheus',
    name: 'Morpheus AIs',
    handle: '@MorpheusAIs',
    token: '$MOR',
    category: 'Infrastructure',
    description: 'Decentralized AI infrastructure network.',
    score: 82,
    status: 'verified',
    vouched: 5.5,
    reviews: 33,
    twitter: 'MorpheusAIs',
    logo: 'MO',
    gradient: 'from-green-600 to-emerald-500',
    launchPlatform: 'other'
  },
]

// Helper functions
export const getFeaturedAgents = () => agents.filter(a => a.featured)
export const getRecentlyAdded = () => agents.filter(a => a.recentlyAdded)
export const getVerifiedAgents = () => agents.filter(a => a.status === 'verified')
export const getAgentsByCategory = (cat: string) => agents.filter(a => a.category === cat)
export const getAgentById = (id: string) => agents.find(a => a.id === id)
export const getTotalVouched = () => agents.reduce((sum, a) => sum + a.vouched, 0)
export const getTotalVouchedUSD = () => getTotalVouched() * ETH_PRICE
export const getVerifiedCount = () => agents.filter(a => a.status === 'verified').length
// Rebuild 1771022520
