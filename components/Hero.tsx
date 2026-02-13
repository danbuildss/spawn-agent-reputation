'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const agentNodes = [
  { name: 'Luna', score: 94, angle: 0, distance: 120 },
  { name: 'Astra', score: 72, angle: 60, distance: 130 },
  { name: 'Nova', score: 88, angle: 120, distance: 115 },
  { name: 'Orion', score: 91, angle: 180, distance: 125 },
  { name: 'Zenith', score: 85, angle: 240, distance: 118 },
  { name: 'Echo', score: 79, angle: 300, distance: 122 },
]

export default function Hero() {
  return (
    <section className="pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Agent Reputation, <span className="text-[#0052FF]">On-Chain</span>
          </h1>
          <p className="text-base text-gray-400 max-w-xl mx-auto">
            Trust scores for AI agents. Rug-proof your portfolio.
          </p>
        </motion.div>

        {/* Central Visualization - Compact */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[320px] mb-10 flex items-center justify-center"
        >
          {/* Central Orb - Static glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#0052FF]/20 blur-2xl" />
            <div className="absolute w-16 h-16 rounded-full border border-[#0052FF]/40 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0052FF] to-purple-600 opacity-80" />
            </div>
          </div>

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0, 82, 255, 0)" />
                <stop offset="50%" stopColor="rgba(0, 82, 255, 0.2)" />
                <stop offset="100%" stopColor="rgba(0, 82, 255, 0)" />
              </linearGradient>
            </defs>
            {agentNodes.map((node, i) => {
              const centerX = 200
              const centerY = 160
              const x = centerX + Math.cos((node.angle * Math.PI) / 180) * node.distance
              const y = centerY + Math.sin((node.angle * Math.PI) / 180) * node.distance
              return (
                <motion.line
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                />
              )
            })}
          </svg>

          {/* Agent Nodes - No floating animation */}
          {agentNodes.map((node, index) => {
            const x = Math.cos((node.angle * Math.PI) / 180) * node.distance
            const y = Math.sin((node.angle * Math.PI) / 180) * node.distance
            
            return (
              <motion.div
                key={node.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <div className="glass-card px-3 py-1.5 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className={`w-1.5 h-1.5 rounded-full ${node.score >= 90 ? 'bg-green-500' : node.score >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`} />
                  <span className="text-xs font-medium text-white">{node.name}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs font-bold text-[#0052FF]">{node.score}</span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search agent name or contract address..."
              className="glass-input pl-11 py-3 text-sm text-white placeholder-gray-500"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
