'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { getFeaturedAgents, formatVouchedShort } from '@/lib/agents-data'

export default function FeaturedAgents() {
  const featuredAgents = getFeaturedAgents()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="py-6 px-4 md:px-6 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Featured</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="p-1.5 rounded-lg hover:bg-card transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={() => scroll('right')} className="p-1.5 rounded-lg hover:bg-card transition-colors">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <Link href="/featured" className="text-xs text-accent hover:underline ml-2">
              Get Featured →
            </Link>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredAgents.map((agent, i) => {
            const vouched = formatVouchedShort(agent.vouched)
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex-shrink-0 w-[280px]"
              >
                <Link 
                  href={`/agent/${agent.id}`}
                  className="block p-4 bg-gradient-to-br from-accent/10 via-purple-500/5 to-transparent border border-accent/20 rounded-xl hover:border-accent/40 transition-all group h-full"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                      {agent.logo.slice(0, 2)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors text-sm truncate">
                          {agent.name}
                        </h4>
                        {agent.status === 'verified' && <Shield className="w-3 h-3 text-green-400 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {agent.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            agent.score >= 90 ? 'text-green-400' : 'text-yellow-400'
                          }`}>{agent.score}</span>
                          <span className="text-muted">•</span>
                          <span className="text-muted-foreground">{agent.token}</span>
                        </div>
                        <span className="text-muted-foreground">{vouched.usd}</span>
                      </div>
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
