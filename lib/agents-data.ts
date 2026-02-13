// Base Ecosystem AI Agents Database
// Source: Bankr AI verification + DexScreener live data
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

// Top 20 AI Agents verified by Bankr AI + additional ecosystem agents
export const agents: Agent[] = [
  // === TOP 20 FROM BANKR AI (Verified Contract Addresses) ===
  {
    id: 'virtuals',
    name: 'Virtual Protocol',
    handle: '@virtuals_io',
    token: '$VIRTUAL',
    category: 'Infrastructure',
    description: 'Tokenized AI agent platform with co-ownership model. Leading infrastructure for AI agents on Base.',
    score: 98,
    status: 'verified',
    vouched: 45.0,
    reviews: 156,
    contract: '0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b',
    twitter: 'virtuals_io',
    logo: 'V',
    gradient: 'from-blue-500 to-cyan-500',
    featured: true,
    launchPlatform: 'virtuals'
  },
  {
    id: 'bankr',
    name: 'Bankr',
    handle: '@bankrbot',
    token: '$BNKR',
    category: 'Infrastructure',
    description: 'Core AI crypto bank for wallets, trading, and token launches on Base.',
    score: 96,
    status: 'verified',
    vouched: 32.5,
    reviews: 124,
    contract: '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b',
    twitter: 'bankrbot',
    logo: 'B',
    gradient: 'from-green-500 to-emerald-500',
    featured: true,
    launchPlatform: 'bankr'
  },
  {
    id: 'aixbt',
    name: 'AIXBT by Virtuals',
    handle: '@aixbt_agent',
    token: '$AIXBT',
    category: 'Analytics',
    description: 'AI market analysis and crypto insights agent by Virtuals.',
    score: 95,
    status: 'verified',
    vouched: 28.5,
    reviews: 98,
    contract: '0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825',
    twitter: 'aixbt_agent',
    logo: 'AI',
    gradient: 'from-indigo-500 to-blue-500',
    featured: true,
    launchPlatform: 'virtuals'
  },
  {
    id: 'luna',
    name: 'Luna by Virtuals',
    handle: '@luna_virtuals',
    token: '$LUNA',
    category: 'Social',
    description: 'Social AI agent with personality and community engagement.',
    score: 94,
    status: 'verified',
    vouched: 22.0,
    reviews: 87,
    contract: '0x55cd6469f597452b5a7536e2cd98fde4c1247ee4',
    twitter: 'luna_virtuals',
    logo: 'LU',
    gradient: 'from-pink-500 to-rose-500',
    featured: true,
    launchPlatform: 'virtuals'
  },
  {
    id: 'game',
    name: 'GAME by Virtuals',
    handle: '@game_virtuals',
    token: '$GAME',
    category: 'Gaming',
    description: 'Gaming AI agent and ecosystem by Virtuals Protocol.',
    score: 93,
    status: 'verified',
    vouched: 36.0,
    reviews: 76,
    contract: '0x1c4cca7c5db003824208adda61bd749e55f463a3',
    twitter: 'game_virtuals',
    logo: 'GA',
    gradient: 'from-purple-500 to-pink-500',
    featured: true,
    launchPlatform: 'virtuals'
  },
  {
    id: 'heyanon',
    name: 'HeyAnon',
    handle: '@heyanon_ai',
    token: '$ANON',
    category: 'Social',
    description: 'Anonymous AI social agent for private interactions.',
    score: 91,
    status: 'verified',
    vouched: 15.5,
    reviews: 64,
    contract: '0x79bbf4508b1391af3a0f4b30bb5fc4aa9ab0e07c',
    twitter: 'heyanon_ai',
    logo: 'AN',
    gradient: 'from-gray-500 to-slate-500',
    launchPlatform: 'other'
  },
  {
    id: 'recall',
    name: 'Recall',
    handle: '@recall_ai',
    token: '$RECALL',
    category: 'Analytics',
    description: 'Memory and recall AI agent for on-chain data.',
    score: 89,
    status: 'verified',
    vouched: 12.0,
    reviews: 52,
    contract: '0x1f16e03c1a5908818f47f6ee7bb16690b40d0671',
    twitter: 'recall_ai',
    logo: 'RE',
    gradient: 'from-teal-500 to-green-500',
    launchPlatform: 'other'
  },
  {
    id: 'cookie',
    name: 'Cookie',
    handle: '@cookiedotfun',
    token: '$COOKIE',
    category: 'Analytics',
    description: 'AI agent data and indexing platform.',
    score: 88,
    status: 'verified',
    vouched: 10.5,
    reviews: 45,
    contract: '0xc0041ef357b183448b235a8ea73ce4e4ec8c265f',
    twitter: 'cookiedotfun',
    logo: 'CO',
    gradient: 'from-yellow-600 to-amber-500',
    launchPlatform: 'other'
  },
  {
    id: 'kellyclaude',
    name: 'KellyClaude',
    handle: '@kellyclaude',
    token: '$KELLYCLAUDE',
    category: 'Social',
    description: 'Claude-based AI agent with unique personality.',
    score: 87,
    status: 'verified',
    vouched: 8.0,
    reviews: 38,
    contract: '0x50d2280441372486beecdd328c1854743ebacb07',
    twitter: 'kellyclaude',
    logo: 'KC',
    gradient: 'from-orange-500 to-red-500',
    recentlyAdded: true,
    launchPlatform: 'other'
  },
  {
    id: 'elsa',
    name: 'Elsa Chain',
    handle: '@HeyElsaAI',
    token: '$ELSA',
    category: 'DeFi',
    description: 'DeFi copilot for staking and lending automation.',
    score: 86,
    status: 'verified',
    vouched: 9.5,
    reviews: 42,
    contract: '0x80f994e39286c2c624ee9f647365c7dc1f4e3fbf',
    twitter: 'HeyElsaAI',
    logo: 'E',
    gradient: 'from-pink-500 to-rose-500',
    launchPlatform: 'bankr'
  },
  {
    id: 'aion',
    name: 'AION 5100',
    handle: '@aion5100',
    token: '$AION',
    category: 'Infrastructure',
    description: 'Advanced AI infrastructure agent.',
    score: 85,
    status: 'verified',
    vouched: 7.5,
    reviews: 34,
    contract: '0xfc48314ad4ad5bd36a84e8307b86a68a01d95d9c',
    twitter: 'aion5100',
    logo: 'AI',
    gradient: 'from-violet-500 to-purple-500',
    launchPlatform: 'other'
  },
  {
    id: 'wayfinder',
    name: 'Wayfinder',
    handle: '@wayfinder_ai',
    token: '$PROMPT',
    category: 'Infrastructure',
    description: 'AI agent navigation and prompt routing.',
    score: 84,
    status: 'verified',
    vouched: 11.0,
    reviews: 48,
    contract: '0x30c7235866872213f68cb1f08c37cb9eccb93452',
    twitter: 'wayfinder_ai',
    logo: 'WF',
    gradient: 'from-cyan-500 to-blue-500',
    launchPlatform: 'other'
  },
  {
    id: 'openserv',
    name: 'OpenServ',
    handle: '@openserv_ai',
    token: '$SERV',
    category: 'Infrastructure',
    description: 'Open service infrastructure for AI agents.',
    score: 83,
    status: 'verified',
    vouched: 6.5,
    reviews: 29,
    contract: '0x5576d6ed9181f2225aff5282ac0ed29f755437ea',
    twitter: 'openserv_ai',
    logo: 'OS',
    gradient: 'from-emerald-500 to-teal-500',
    launchPlatform: 'other'
  },
  {
    id: 'antihunter',
    name: 'AntiHunter',
    handle: '@antihunter_ai',
    token: '$ANTIHUNTER',
    category: 'Security',
    description: 'Anti-bot and security AI agent.',
    score: 82,
    status: 'verified',
    vouched: 5.0,
    reviews: 22,
    contract: '0xe2f3fae4bc62e21826018364aa30ae45d430bb07',
    twitter: 'antihunter_ai',
    logo: 'AH',
    gradient: 'from-red-500 to-orange-500',
    recentlyAdded: true,
    launchPlatform: 'other'
  },
  {
    id: 'mamo',
    name: 'Mamo',
    handle: '@mamo_ai',
    token: '$MAMO',
    category: 'Social',
    description: 'Social AI agent with memory capabilities.',
    score: 81,
    status: 'verified',
    vouched: 4.5,
    reviews: 19,
    contract: '0x7300b37dfdfab110d83290a29dfb31b1740219fe',
    twitter: 'mamo_ai',
    logo: 'MA',
    gradient: 'from-lime-500 to-green-500',
    recentlyAdded: true,
    launchPlatform: 'other'
  },
  {
    id: 'fai',
    name: 'FAI',
    handle: '@fai_agent',
    token: '$FAI',
    category: 'DeFi',
    description: 'Financial AI agent for DeFi operations.',
    score: 80,
    status: 'verified',
    vouched: 4.0,
    reviews: 17,
    contract: '0xb33ff54b9f7242ef1593d2c9bcd8f9df46c77935',
    twitter: 'fai_agent',
    logo: 'FA',
    gradient: 'from-blue-600 to-indigo-500',
    launchPlatform: 'other'
  },
  {
    id: 'ava',
    name: 'Ava AI',
    handle: '@ava_ai',
    token: '$AVA',
    category: 'Social',
    description: 'Conversational AI agent with advanced capabilities.',
    score: 79,
    status: 'verified',
    vouched: 3.5,
    reviews: 15,
    contract: '0x80ca9edce4583b8043351a1046f18244b24ef869',
    twitter: 'ava_ai',
    logo: 'AV',
    gradient: 'from-fuchsia-500 to-pink-500',
    recentlyAdded: true,
    launchPlatform: 'other'
  },
  {
    id: 'gaix',
    name: 'GAIX',
    handle: '@gaix_ai',
    token: '$GAIX',
    category: 'Analytics',
    description: 'Gaming and analytics AI infrastructure.',
    score: 78,
    status: 'verified',
    vouched: 3.0,
    reviews: 13,
    contract: '0x07279154860356839e33f59123d25b857b07eb07',
    twitter: 'gaix_ai',
    logo: 'GX',
    gradient: 'from-purple-600 to-violet-500',
    launchPlatform: 'other'
  },
  {
    id: 'rain',
    name: 'Rain Coin',
    handle: '@rain_ai',
    token: '$RAIN',
    category: 'DeFi',
    description: 'DeFi yield and rain distribution agent.',
    score: 77,
    status: 'verified',
    vouched: 2.5,
    reviews: 11,
    contract: '0x4e21eabf4fc4cf66f10a93395e4b0e2438de81a6',
    twitter: 'rain_ai',
    logo: 'RA',
    gradient: 'from-sky-500 to-blue-500',
    recentlyAdded: true,
    launchPlatform: 'other'
  },
  {
    id: 'pippin',
    name: 'Pippin',
    handle: '@pippin_ai',
    token: '$PIPPIN',
    category: 'Social',
    description: 'Friendly AI companion agent.',
    score: 76,
    status: 'verified',
    vouched: 2.0,
    reviews: 9,
    contract: '0xfd106b77a299bd3b85de8ca4395306965dbfa4c5',
    twitter: 'pippin_ai',
    logo: 'PI',
    gradient: 'from-amber-500 to-yellow-500',
    recentlyAdded: true,
    launchPlatform: 'other'
  },
  
  // === ADDITIONAL ECOSYSTEM AGENTS ===
  {
    id: 'clanker',
    name: 'Clanker',
    handle: '@clanker_world',
    token: '$CLANKER',
    category: 'Infrastructure',
    description: 'Token issuance infrastructure for autonomous agent deployments.',
    score: 92,
    status: 'verified',
    vouched: 18.2,
    reviews: 67,
    contract: '0x1bc0c42215582d5a085795f3e8d98e39f4e9d6b0',
    twitter: 'clanker_world',
    logo: 'C',
    gradient: 'from-purple-500 to-pink-500',
    featured: true,
    launchPlatform: 'clanker'
  },
  {
    id: 'clawdbot',
    name: 'Clawdbot',
    handle: '@clawdbotatg',
    token: '$CLAWD',
    category: 'Infrastructure',
    description: 'Multi-agent system for on-chain apps and tools.',
    score: 90,
    status: 'verified',
    vouched: 12.8,
    reviews: 56,
    contract: '0xcb95a02a4d4d89b9a4d2f1d08a05a5f8c3c4ab5d',
    twitter: 'clawdbotatg',
    logo: 'CL',
    gradient: 'from-orange-500 to-red-500',
    launchPlatform: 'other'
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
