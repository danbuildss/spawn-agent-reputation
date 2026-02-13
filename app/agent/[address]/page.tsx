'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Shield, ExternalLink, Copy, Check, Clock, 
  TrendingUp, Users, Droplets, FileCode, Twitter, Globe,
  AlertTriangle, ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { agents, getAgentById } from '@/lib/agents-data'
import { notFound } from 'next/navigation'

// Generate static params for all agents
export function generateStaticParams() {
  return agents.map((agent) => ({
    address: agent.id,
  }))
}

export default function AgentPage({ params }: { params: { address: string } }) {
  const [copied, setCopied] = useState(false)
  const agent = getAgentById(params.address)
  
  if (!agent) {
    notFound()
  }
  
  const copyAddress = () => {
    navigator.clipboard.writeText(agent.contract || agent.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Mock score breakdown based on agent score
  const breakdown = {
    contractAge: { score: Math.round(agent.score * 0.18), max: 20, label: 'Contract Age', detail: 'Deployed on Base' },
    audit: { score: agent.status === 'verified' ? 15 : 8, max: 15, label: 'Audit Status', detail: agent.status === 'verified' ? 'Verified' : 'Pending' },
    liquidity: { score: Math.round(agent.score * 0.18), max: 20, label: 'Liquidity', detail: 'DEX liquidity' },
    holders: { score: Math.round(agent.score * 0.14), max: 15, label: 'Holder Count', detail: 'Token holders' },
    lpLocked: { score: Math.round(agent.score * 0.12), max: 15, label: 'LP Locked', detail: 'Liquidity locked' },
    creator: { score: Math.round(agent.score * 0.13), max: 15, label: 'Creator Rep', detail: 'Based on activity' },
  }

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
              {agent.logo.slice(0, 2)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                {agent.status === 'verified' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
                <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">{agent.category}</span>
                <span className="px-2 py-1 bg-accent/20 rounded text-xs text-accent">{agent.token}</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{agent.description}</p>
              
              {/* Handle & Links */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm text-gray-500">{agent.handle}</span>
                {agent.twitter && (
                  <a href={`https://twitter.com/${agent.twitter}`} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {agent.launchPlatform && (
                  <span className="text-xs text-gray-600">via {agent.launchPlatform}</span>
                )}
              </div>
            </div>
            
            {/* Trust Score */}
            <div className="text-center md:text-right">
              <div className={`text-5xl font-bold mb-1 ${
                agent.score >= 90 ? 'text-green-400' :
                agent.score >= 80 ? 'text-yellow-400' :
                agent.score >= 70 ? 'text-orange-400' :
                'text-red-400'
              }`}>
                {agent.score}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Trust Score</div>
              <div className="flex items-center justify-center md:justify-end gap-4 mt-3 text-sm">
                <span className="text-gray-400">{agent.vouched} ETH vouched</span>
                <span className="text-gray-400">{agent.reviews} reviews</span>
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
              {Object.entries(breakdown).map(([key, data]) => (
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
                    <span className="text-xs text-gray-500 w-28 text-right">{data.detail}</span>
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
            {/* Agent Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Agent Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Token</span>
                  <span className="text-white font-medium">{agent.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="text-white">{agent.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chain</span>
                  <span className="text-white">Base</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Launch Platform</span>
                  <span className="text-white capitalize">{agent.launchPlatform || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={agent.status === 'verified' ? 'text-green-400' : 'text-yellow-400'}>
                    {agent.status === 'verified' ? '✓ Verified' : '○ Pending'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Community Stats */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Community</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ETH Vouched</span>
                  <span className="text-green-400 font-medium">{agent.vouched} ETH</span>
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
                <a href={`https://basescan.org/search?q=${agent.token}`} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <FileCode className="w-4 h-4" /> Basescan <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
                <a href={`https://dexscreener.com/base/${agent.id}`} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <TrendingUp className="w-4 h-4" /> DexScreener <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
        
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
          <button className="py-3 px-6 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10 transition-colors" title="Report">
            <AlertTriangle className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </main>
  )
}
