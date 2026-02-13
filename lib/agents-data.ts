// Base Ecosystem AI Agents Database
// Source: Bankr ecosystem, Virtuals, Clanker, and Base AI agent scene
// Last updated: 2026-02-13

export interface Agent {
  id: string
  name: string
  handle: string
  token: string
  category: 'Infrastructure' | 'DeFi' | 'Social' | 'Analytics' | 'Creative' | 'Trading' | 'Gaming' | 'Security'
  description: string
  score: number // Trust score 0-100
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
}

export const agents: Agent[] = [
  // Tier 1: Core Infrastructure
  {
    id: 'bankr',
    name: 'Bankr',
    handle: '@bankrbot',
    token: '$BNKR',
    category: 'Infrastructure',
    description: 'Core AI crypto bank/agent for wallets, trading, and token launches on Base. Powers self-sustaining agents through trading fees.',
    score: 96,
    status: 'verified',
    vouched: 24.5,
    reviews: 89,
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
    description: 'Token issuance infrastructure for agents. Powers rapid, autonomous token deployments on Base.',
    score: 94,
    status: 'verified',
    vouched: 18.2,
    reviews: 67,
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
    token: 'Various',
    category: 'Infrastructure',
    description: 'Tokenized AI agent platform with co-ownership model. High agentic GDP and ecosystem activity.',
    score: 93,
    status: 'verified',
    vouched: 31.0,
    reviews: 124,
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
    description: 'Multi-agent system for on-chain apps, bounties, and tools. Open-source agent framework.',
    score: 91,
    status: 'verified',
    vouched: 12.8,
    reviews: 56,
    twitter: 'clawdbotatg',
    logo: 'CL',
    gradient: 'from-orange-500 to-red-500',
    launchPlatform: 'other'
  },
  
  // Tier 2: DeFi & Analytics Agents
  {
    id: 'elsa',
    name: 'Hey Elsa AI',
    handle: '@HeyElsaAI',
    token: '$ELSA',
    category: 'DeFi',
    description: 'DeFi copilot agent for staking and lending. Supports micropayments and automated strategies.',
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
    description: 'DeFi risk analytics and mandate tools. Real-time monitoring and alerts.',
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
    description: 'AI market analysis agent. Top mindshare KOL-style agent for crypto insights.',
    score: 87,
    status: 'verified',
    vouched: 9.1,
    reviews: 58,
    twitter: 'aixbt_agent',
    logo: 'AI',
    gradient: 'from-indigo-500 to-blue-500',
    launchPlatform: 'other'
  },
  
  // Tier 3: Social & Creative
  {
    id: 'moltbook',
    name: 'Moltbook',
    handle: '@moltbook',
    token: '$MOLT',
    category: 'Social',
    description: 'Social network and forum for AI agents. Massive scale agent interaction platform.',
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
    description: 'Sovereign AI agent platform. Integration and sovereignty for autonomous agents.',
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
    description: 'Cross-chain artist and content creation agent. Autonomous creative AI.',
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
    description: 'On-chain musician AI agent. Creates and distributes music autonomously.',
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
  
  // Tier 4: Specialized Agents
  {
    id: 'starkbot',
    name: 'StarkBot AI',
    handle: '@starkbotai',
    token: '$STARK',
    category: 'Infrastructure',
    description: 'Infrastructure for autonomous agents and payments. Agent-to-agent transactions.',
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
    description: 'Agent-only token launch platform. High volume autonomous deployments.',
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
    description: 'Market tracking and on-chain data agent. Real-time analytics and alerts.',
    score: 77,
    status: 'pending',
    vouched: 2.8,
    reviews: 19,
    twitter: 'LOBSTERXBTAI',
    logo: '🦞',
    gradient: 'from-red-600 to-orange-500',
    launchPlatform: 'bankr'
  },
  {
    id: 'simulacrum',
    name: 'Simulacrum',
    handle: '@SimulacrumIO',
    token: '$SIM',
    category: 'Infrastructure',
    description: 'Natural language AI agent launches from X. Tweet-to-agent deployment.',
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
    description: 'AI agent data and indexing platform. Tracks agent metrics and performance.',
    score: 80,
    status: 'verified',
    vouched: 4.2,
    reviews: 25,
    twitter: 'cookiedotfun',
    logo: '🍪',
    gradient: 'from-yellow-600 to-amber-500',
    launchPlatform: 'other'
  },
  {
    id: 'kudai',
    name: 'Kudai',
    handle: '@Kudai_IO',
    token: '$KUDAI',
    category: 'DeFi',
    description: 'Real-yield focused agent. Automated yield optimization strategies.',
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
    description: 'Character and storytelling engine. Creates interactive AI narratives.',
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
    description: 'Blockchain vulnerability-finding agent. Automated security audits.',
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
    description: 'Network for capital, code, and compute agents. Decentralized AI infrastructure.',
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
export const getVerifiedCount = () => agents.filter(a => a.status === 'verified').length
