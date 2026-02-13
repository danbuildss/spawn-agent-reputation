'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const topAgents = [
  { 
    name: 'Luna Protocol', 
    score: 94, 
    vouched: '0.5 ETH', 
    reviews: 12,
    avatar: 'L',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    name: 'Astra Finance', 
    score: 91, 
    vouched: '1.2 ETH', 
    reviews: 24,
    avatar: 'A',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'Nova Trading', 
    score: 88, 
    vouched: '0.8 ETH', 
    reviews: 18,
    avatar: 'N',
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    name: 'Orion Analytics', 
    score: 87, 
    vouched: '0.3 ETH', 
    reviews: 9,
    avatar: 'O',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    name: 'Zenith Markets', 
    score: 85, 
    vouched: '2.1 ETH', 
    reviews: 31,
    avatar: 'Z',
    gradient: 'from-indigo-500 to-blue-500'
  },
  { 
    name: 'Echo Strategies', 
    score: 82, 
    vouched: '0.6 ETH', 
    reviews: 15,
    avatar: 'E',
    gradient: 'from-yellow-500 to-orange-500'
  },
]

export default function TopAgents() {
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top Performing Agents
          </h2>
          <p className="text-gray-400">
            Highest rated agents based on onchain reputation
          </p>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 glass-button p-3 hidden md:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 glass-button p-3 hidden md:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {topAgents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 min-w-[300px] hover:bg-white/10 transition-all duration-300 group cursor-pointer flex-shrink-0"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xl font-bold flex-shrink-0`}>
                    {agent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {agent.name}
                    </h3>
                    <div className="trust-score text-sm group-hover:scale-105 transition-transform duration-300 inline-block">
                      {agent.score}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Vouched</span>
                    <span className="text-white font-medium">{agent.vouched}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Reviews</span>
                    <span className="text-white font-medium">{agent.reviews}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
