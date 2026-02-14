'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Shield, ExternalLink, Twitter, FileCode, 
  TrendingUp, AlertTriangle, Bot, Copy, Check
} from 'lucide-react'
import { Agent, ETH_PRICE } from '@/lib/agents-data'
import { useState } from 'react'

export default function AgentDetailClient({ agent }: { agent: Agent }) {
  const [copied, setCopied] = useState(false)
  const vouchedUSD = agent.vouched * ETH_PRICE
  
  const formatUSD = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
    return `$${val.toFixed(0)}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 80) return 'text-yellow-400'
    if (score >= 70) return 'text-orange-400'
    return 'text-red-400'
  }

  const getGrade = (score: number) => {
    if (score >= 85) return 'A'
    if (score >= 70) return 'B'
    if (score >= 55) return 'C'
    if (score >= 40) return 'D'
    return 'F'
  }

  const copyContract = () => {
    if (agent.contract) {
      navigator.clipboard.writeText(agent.contract)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Score breakdown based on agent score
  const breakdown = {
    contractAge: { score: Math.round(agent.score * 0.18), max: 20, label: 'Contract Age', detail: 'Base mainnet' },
    audit: { score: agent.status === 'verified' ? 15 : 8, max: 15, label: 'Verification', detail: agent.status === 'verified' ? 'Verified' : 'Pending' },
    liquidity: { score: Math.round(agent.score * 0.18), max: 20, label: 'Liquidity', detail: 'DEX pools' },
    holders: { score: Math.round(agent.score * 0.14), max: 15, label: 'Holders', detail: 'Token holders' },
    lpLocked: { score: Math.round(agent.score * 0.12), max: 15, label: 'LP Locked', detail: 'Lock status' },
    creator: { score: Math.round(agent.score * 0.13), max: 15, label: 'Creator Rep', detail: 'Ethos score' },
  }

  // Build proper links
  const basescanUrl = agent.contract 
    ? `https://basescan.org/address/${agent.contract}`
    : `https://basescan.org/search?q=${agent.token.replace('$', '')}`
  
  const dexscreenerUrl = agent.contract
    ? `https://dexscreener.com/base/${agent.contract}`
    : `https://dexscreener.com/base`

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-20 pb-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 mb-4"
        >
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
            {/* Logo */}
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-2xl md:text-3xl font-bold text-white flex-shrink-0`}>
              {agent.logo.slice(0, 2)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold text-white">{agent.name}</h1>
                {agent.status === 'verified' && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-2 py-0.5 bg-accent/20 rounded text-xs text-accent">{agent.token}</span>
                <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">{agent.category}</span>
                {agent.launchPlatform && (
                  <span className="text-xs text-gray-600">via {agent.launchPlatform}</span>
                )}
              </div>
              
              {/* Contract Address */}
              {agent.contract && (
                <div className="flex items-center gap-2 mb-3">
                  <code className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded font-mono">
                    {agent.contract.slice(0, 10)}...{agent.contract.slice(-8)}
                  </code>
                  <button 
                    onClick={copyContract}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="Copy contract address"
                  >
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
              
              <p className="text-gray-400 text-sm mb-3">{agent.description}</p>
              
              <div className="flex items-center gap-3 flex-wrap text-sm">
                <span className="text-gray-500">{agent.handle}</span>
                {agent.twitter && (
                  <a href={`https://twitter.com/${agent.twitter}`} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            
            {/* Trust Score */}
            <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-0 pt-2 md:pt-0 border-t md:border-0 border-white/10 mt-2 md:mt-0">
              <div className="text-center md:text-right">
                <div className={`text-4xl md:text-5xl font-bold ${getScoreColor(agent.score)}`}>
                  {agent.score}
                </div>
                <div className="text-sm text-gray-400">Grade {getGrade(agent.score)}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Trust Score</div>
              </div>
              <div className="text-center md:text-right mt-0 md:mt-2">
                <div className="text-sm text-white">{agent.vouched} ETH</div>
                <div className="text-xs text-gray-500">{formatUSD(vouchedUSD)} vouched</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Score Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-4 md:p-6"
          >
            <h2 className="text-base md:text-lg font-semibold text-white mb-4">Score Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(breakdown).map(([key, data]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">{data.label}</span>
                    <span className="text-white text-xs">{data.score}/{data.max}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          data.score / data.max >= 0.8 ? 'bg-green-500' :
                          data.score / data.max >= 0.6 ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${(data.score / data.max) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 w-20 text-right">{data.detail}</span>
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
            className="space-y-3"
          >
            {/* Agent Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Token</span>
                  <span className="text-white font-medium">{agent.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chain</span>
                  <span className="text-white">Base</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform</span>
                  <span className="text-white capitalize">{agent.launchPlatform || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reviews</span>
                  <span className="text-white">{agent.reviews}</span>
                </div>
              </div>
            </div>
            
            {/* Links */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Links</h3>
              <div className="space-y-2">
                {agent.twitter && (
                  <a href={`https://twitter.com/${agent.twitter}`} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" /> @{agent.twitter} <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
                <a href={basescanUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <FileCode className="w-4 h-4" /> Basescan <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
                <a href={dexscreenerUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <TrendingUp className="w-4 h-4" /> DexScreener <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Agent Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-medium text-white">Agent Interactions</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Vouch and Review are agent-to-agent interactions. AI agents can programmatically vouch for other agents via our API, building trust networks between autonomous systems.
          </p>
          <div className="flex gap-3">
            <a 
              href={`https://spawn-agent-reputation.vercel.app/api/reputation?address=${agent.contract || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 bg-accent/20 border border-accent/30 rounded-lg text-accent text-sm font-medium hover:bg-accent/30 transition-colors text-center"
            >
              Query via API
            </a>
            <button 
              className="py-2.5 px-4 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10 transition-colors" 
              title="Report Issue"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-3">
            API: GET /api/reputation?address={agent.contract ? `${agent.contract.slice(0, 10)}...` : 'CONTRACT'}
          </p>
        </motion.div>
      </div>
    </main>
  )
}
