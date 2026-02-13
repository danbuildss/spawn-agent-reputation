'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Shield, ExternalLink, Copy, Check, Clock, 
  TrendingUp, Users, Droplets, FileCode, Twitter, Globe,
  AlertTriangle, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

// Mock data - would come from API
const agentData = {
  name: 'Luna Protocol',
  contract: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
  category: 'DeFi',
  description: 'Advanced DeFi automation with multi-chain yield optimization. Luna Protocol leverages AI to find the best yield farming opportunities across multiple chains.',
  score: 94,
  status: 'verified',
  vouched: 12.5,
  vouchCount: 47,
  reviewCount: 23,
  logo: 'L',
  gradient: 'from-blue-500 to-cyan-500',
  
  // Score breakdown
  breakdown: {
    contractAge: { score: 18, max: 20, label: 'Contract Age', detail: '147 days' },
    audit: { score: 15, max: 15, label: 'Audit Status', detail: 'Audited by Certik' },
    liquidity: { score: 18, max: 20, label: 'Liquidity', detail: '$2.4M locked' },
    holders: { score: 14, max: 15, label: 'Holder Count', detail: '3,847 holders' },
    lpLocked: { score: 12, max: 15, label: 'LP Locked', detail: '95% for 12 months' },
    creator: { score: 12, max: 15, label: 'Creator Rep', detail: 'Ethos: 1,847' },
  },
  
  // On-chain data
  onchain: {
    deployedAt: '2024-09-18',
    chain: 'Base',
    txCount: 48293,
    verified: true,
  },
  
  // Token data
  token: {
    symbol: '$LUNA',
    price: '$0.0847',
    marketCap: '$8.4M',
    liquidity: '$2.4M',
    holders: 3847,
    lpLocked: true,
  },
  
  // Creator
  creator: {
    address: '0xabcd...ef12',
    ethosScore: 1847,
    otherAgents: 2,
  },
  
  // Links
  links: {
    website: 'https://lunaprotocol.xyz',
    twitter: 'https://twitter.com/lunaprotocol',
    basescan: 'https://basescan.org/address/0x1a2b...',
  }
}

export default function AgentPage({ params }: { params: { address: string } }) {
  const [copied, setCopied] = useState(false)
  const agent = agentData // Would fetch based on params.address
  
  const copyAddress = () => {
    navigator.clipboard.writeText(agent.contract)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const totalScore = Object.values(agent.breakdown).reduce((a, b) => a + b.score, 0)
  const maxScore = Object.values(agent.breakdown).reduce((a, b) => a + b.max, 0)

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo & Basic Info */}
            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-3xl font-bold text-white flex-shrink-0`}>
              {agent.logo}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                {agent.status === 'verified' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
                <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">{agent.category}</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{agent.description}</p>
              
              {/* Contract address */}
              <div className="flex items-center gap-2">
                <code className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">
                  {agent.contract.slice(0, 10)}...{agent.contract.slice(-8)}
                </code>
                <button onClick={copyAddress} className="p-1 hover:bg-white/10 rounded transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
                <a href={agent.links.basescan} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white/10 rounded transition-colors">
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </a>
              </div>
            </div>
            
            {/* Trust Score */}
            <div className="text-center md:text-right">
              <div className={`text-5xl font-bold mb-1 ${
                agent.score >= 90 ? 'text-green-400' :
                agent.score >= 80 ? 'text-yellow-400' :
                'text-orange-400'
              }`}>
                {agent.score}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Trust Score</div>
              <div className="flex items-center justify-center md:justify-end gap-4 mt-3 text-sm">
                <span className="text-gray-400">{agent.vouched} ETH vouched</span>
                <span className="text-gray-400">{agent.reviewCount} reviews</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Score Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Score Breakdown</h2>
            <div className="space-y-4">
              {Object.entries(agent.breakdown).map(([key, data]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">{data.label}</span>
                    <span className="text-white">{data.score}/{data.max}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          data.score / data.max >= 0.8 ? 'bg-green-500' :
                          data.score / data.max >= 0.6 ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${(data.score / data.max) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-32 text-right">{data.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Token Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Token Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Symbol</span>
                  <span className="text-white font-medium">{agent.token.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="text-white">{agent.token.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Market Cap</span>
                  <span className="text-white">{agent.token.marketCap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Liquidity</span>
                  <span className="text-green-400">{agent.token.liquidity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">LP Locked</span>
                  <span className="text-green-400">✓ Yes</span>
                </div>
              </div>
            </div>
            
            {/* On-Chain */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">On-Chain Data</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Deployed</span>
                  <span className="text-white">{agent.onchain.deployedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chain</span>
                  <span className="text-white">{agent.onchain.chain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transactions</span>
                  <span className="text-white">{agent.onchain.txCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract Verified</span>
                  <span className="text-green-400">✓ Yes</span>
                </div>
              </div>
            </div>
            
            {/* Links */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Links</h3>
              <div className="space-y-2">
                <a href={agent.links.website} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-4 h-4" /> Website <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
                <a href={agent.links.twitter} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" /> Twitter <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
                <a href={agent.links.basescan} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <FileCode className="w-4 h-4" /> Basescan <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Creator Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mt-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Creator</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-gray-400">
                {agent.creator.address.slice(2, 4).toUpperCase()}
              </div>
              <div>
                <code className="text-sm text-white">{agent.creator.address}</code>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span>Ethos Score: <span className="text-accent">{agent.creator.ethosScore}</span></span>
                  <span>{agent.creator.otherAgents} other agents</span>
                </div>
              </div>
            </div>
            <a href="#" className="flex items-center gap-1 text-sm text-accent hover:underline">
              View on Ethos <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-6"
        >
          <button className="flex-1 py-3 px-6 bg-accent/20 border border-accent/30 rounded-lg text-accent font-medium hover:bg-accent/30 transition-colors">
            Vouch for this Agent
          </button>
          <button className="flex-1 py-3 px-6 bg-white/5 border border-white/10 rounded-lg text-white font-medium hover:bg-white/10 transition-colors">
            Write a Review
          </button>
          <button className="py-3 px-6 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10 transition-colors">
            <AlertTriangle className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </main>
  )
}
