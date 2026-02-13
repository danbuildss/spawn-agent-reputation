'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const recentAgents = [
  { name: 'Quantum AI', score: 78, category: 'Trading', addedAgo: '2h', contract: '0xabc1' },
  { name: 'Nebula Protocol', score: 82, category: 'DeFi', addedAgo: '5h', contract: '0xabc2' },
  { name: 'Vertex Bot', score: 71, category: 'Analytics', addedAgo: '8h', contract: '0xabc3' },
  { name: 'Flux Agent', score: 85, category: 'Social', addedAgo: '12h', contract: '0xabc4' },
]

export default function RecentlyAdded() {
  return (
    <section className="py-6 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Recently Added</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {recentAgents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link 
                href={`/agent/${agent.contract}`}
                className="block p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-accent/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px] font-medium">NEW</span>
                  <span className="text-xs text-gray-600">{agent.addedAgo} ago</span>
                </div>
                <div className="font-medium text-sm text-white group-hover:text-accent transition-colors truncate">
                  {agent.name}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{agent.category}</span>
                  <span className={`text-xs font-bold ${
                    agent.score >= 80 ? 'text-green-400' : 'text-yellow-400'
                  }`}>{agent.score}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
