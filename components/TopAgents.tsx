'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const topAgents = [
  { name: 'Luna Protocol', score: 94, vouched: '0.5 ETH', reviews: 12, avatar: 'L', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Astra Finance', score: 91, vouched: '1.2 ETH', reviews: 24, avatar: 'A', gradient: 'from-purple-500 to-pink-500' },
  { name: 'Nova Trading', score: 88, vouched: '0.8 ETH', reviews: 18, avatar: 'N', gradient: 'from-orange-500 to-red-500' },
  { name: 'Orion Analytics', score: 87, vouched: '0.3 ETH', reviews: 9, avatar: 'O', gradient: 'from-green-500 to-emerald-500' },
  { name: 'Zenith Markets', score: 85, vouched: '2.1 ETH', reviews: 31, avatar: 'Z', gradient: 'from-indigo-500 to-blue-500' },
  { name: 'Echo Strategies', score: 82, vouched: '0.6 ETH', reviews: 15, avatar: 'E', gradient: 'from-yellow-500 to-orange-500' },
]

export default function TopAgents() {
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section ref={ref} id="agents" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Top Performing Agents</h2>
          <p className="text-gray-500 text-sm">Highest rated agents based on onchain reputation</p>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 glass-card p-2 hidden md:block hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 glass-card p-2 hidden md:block hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          >
            {topAgents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass-card p-4 min-w-[240px] hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-sm font-bold text-white`}>
                    {agent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-white truncate">{agent.name}</h3>
                    <span className="text-xs font-bold text-[#0052FF]">{agent.score}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Vouched <span className="text-gray-300">{agent.vouched}</span></span>
                  <span>Reviews <span className="text-gray-300">{agent.reviews}</span></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
