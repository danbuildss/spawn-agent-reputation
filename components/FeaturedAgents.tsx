'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, ExternalLink, Shield } from 'lucide-react'
import { getFeaturedAgents } from '@/lib/agents-data'

export default function FeaturedAgents() {
  const featuredAgents = getFeaturedAgents()

  return (
    <section className="py-6 px-6 border-b border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Featured Agents</h3>
          <Link href="/featured" className="ml-auto text-xs text-accent hover:underline">
            Get Featured →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link 
                href={`/agent/${agent.id}`}
                className="block p-4 bg-gradient-to-br from-accent/10 via-purple-500/5 to-transparent border border-accent/20 rounded-lg hover:border-accent/40 transition-all group relative overflow-hidden"
              >
                {/* Featured badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-[10px] font-medium text-yellow-500">
                  <Star className="w-3 h-3" fill="currentColor" /> FEATURED
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                    {agent.logo}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white group-hover:text-accent transition-colors text-sm">
                        {agent.name}
                      </h4>
                      {agent.status === 'verified' && <Shield className="w-3 h-3 text-green-400" />}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                      {agent.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-400 font-bold">{agent.score}</span>
                      <span className="text-gray-500">{agent.token}</span>
                      <span className="text-gray-600">{agent.vouched} ETH</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
