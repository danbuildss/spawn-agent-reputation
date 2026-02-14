'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { useAgentsContext } from './AgentsProvider'
import { getScoreTier, formatScore } from '@/lib/score-utils'

export default function RecentlyAdded() {
  const { recentAgents, loading } = useAgentsContext()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      })
    }
  }

  if (loading || recentAgents.length === 0) {
    return null // Hide if no recent agents
  }

  return (
    <section className="py-6 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recently Added</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="p-1.5 rounded-lg hover:bg-card transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={() => scroll('right')} className="p-1.5 rounded-lg hover:bg-card transition-colors">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recentAgents.map((agent, i) => {
            const tier = getScoreTier(agent.score)
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex-shrink-0 w-[180px]"
              >
                <Link 
                  href={`/agent/${agent.id}`}
                  className="block p-3 bg-card border border-border rounded-xl hover:bg-accent/5 hover:border-accent/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded font-medium">NEW</span>
                    <span className="text-[10px] text-muted-foreground">{agent.token}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 rounded bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
                      {agent.logo.slice(0, 1)}
                    </div>
                    <span className="font-medium text-sm text-foreground group-hover:text-accent transition-colors truncate">
                      {agent.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{agent.category}</span>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${tier.color}`}>
                        {formatScore(agent.score)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
