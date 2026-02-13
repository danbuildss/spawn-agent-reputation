'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { getRecentlyAdded } from '@/lib/agents-data'

export default function RecentlyAdded() {
  const recentAgents = getRecentlyAdded()

  return (
    <section className="py-6 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Recently Added</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {recentAgents.slice(0, 4).map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link 
                href={`/agent/${agent.id}`}
                className="block p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-accent/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px] font-medium">NEW</span>
                  <span className="text-xs text-gray-600">{agent.token}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {agent.logo.slice(0, 1)}
                  </div>
                  <span className="font-medium text-sm text-white group-hover:text-accent transition-colors truncate">
                    {agent.name}
                  </span>
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
