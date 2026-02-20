'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const agentsSection = document.getElementById('agents')
      if (agentsSection) {
        agentsSection.scrollIntoView({ behavior: 'smooth' })
      }
      window.dispatchEvent(new CustomEvent('agent-search', { detail: searchQuery.trim() }))
    }
  }

  // Letter animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8 + i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  }

  const spawnLetters = ['s', 'p', 'a', 'w', 'n']

  return (
    <section className="pt-24 pb-8 px-4 md:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        {/* Small logo icon with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-12 h-12 md:w-16 md:h-16 mx-auto mb-6"
        >
          {/* Subtle glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Logo */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 120,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Image
              src="/logo.png"
              alt="Spawn"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Animated "spawn" text */}
        <div className="flex items-center justify-center gap-0.5 mb-3">
          {spawnLetters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-6xl font-extralight tracking-[0.15em] text-white lowercase"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Tagline with fade in */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-blue-400/80 text-sm md:text-base font-light tracking-[0.3em] uppercase mb-8"
        >
          Trust Layer for AI Agents
        </motion.p>

        {/* Animated line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-8"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="text-gray-400 text-sm md:text-base mb-8 max-w-lg mx-auto font-light"
        >
          Verify agent reputation before you interact. Real scores based on on-chain data.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents or paste contract..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all duration-300"
              />
            </div>
          </form>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="flex items-center justify-center gap-8 mt-10 text-xs text-gray-500"
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Live Scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">◆</span>
            <span>Base Network</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
