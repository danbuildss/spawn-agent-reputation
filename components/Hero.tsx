'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const agentNodes = [
  { name: 'Luna', score: 94, angle: 0, distance: 180 },
  { name: 'Astra', score: 72, angle: 60, distance: 200 },
  { name: 'Nova', score: 88, angle: 120, distance: 170 },
  { name: 'Orion', score: 91, angle: 180, distance: 190 },
  { name: 'Zenith', score: 85, angle: 240, distance: 175 },
  { name: 'Echo', score: 79, angle: 300, distance: 185 },
]

export default function Hero() {
  return (
    <section className="pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Agent Reputation,{' '}
            <span className="text-gradient">OnChain</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Trust scores for AI agents. Rug-proof your portfolio.
          </p>
        </motion.div>

        {/* Central Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[500px] mb-16 flex items-center justify-center"
        >
          {/* Central Glowing Orb */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-32 h-32 rounded-full bg-accent/30 blur-3xl"
            />
            <div className="absolute w-24 h-24 rounded-full border-2 border-accent/50 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-purple-600 animate-pulse-glow" />
            </div>
          </div>

          {/* SVG for connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0, 82, 255, 0)" />
                <stop offset="50%" stopColor="rgba(0, 82, 255, 0.3)" />
                <stop offset="100%" stopColor="rgba(0, 82, 255, 0)" />
              </linearGradient>
              <radialGradient id="nodeGlow">
                <stop offset="0%" stopColor="rgba(0, 82, 255, 0.4)" />
                <stop offset="100%" stopColor="rgba(0, 82, 255, 0)" />
              </radialGradient>
            </defs>
            {agentNodes.map((node, i) => {
              const centerX = 250
              const centerY = 250
              const x = centerX + Math.cos((node.angle * Math.PI) / 180) * node.distance
              const y = centerY + Math.sin((node.angle * Math.PI) / 180) * node.distance
              return (
                <g key={i}>
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                  />
                  <motion.circle
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="url(#nodeGlow)"
                  />
                </g>
              )
            })}
          </svg>

          {/* Floating Agent Nodes */}
          {agentNodes.map((node, index) => {
            const x = Math.cos((node.angle * Math.PI) / 180) * node.distance
            const y = Math.sin((node.angle * Math.PI) / 180) * node.distance
            
            return (
              <motion.div
                key={node.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${node.score >= 90 ? 'bg-green-500' : node.score >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`} />
                  <span className="text-sm font-medium">{node.name}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-sm font-bold text-accent">{node.score}</span>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agent name or contract address..."
              className="glass-input pl-14 text-sm"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
