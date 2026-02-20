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

  return (
    <section className="pt-32 pb-12 px-4 md:px-6 overflow-hidden relative z-10">
      {/* Glow orbs */}
      <div className="glow-orb w-[600px] h-[600px] bg-blue-500 -top-[200px] -right-[100px]" />
      <div className="glow-orb w-[500px] h-[500px] bg-purple-500 -bottom-[200px] -left-[100px]" />
      
      <div className="max-w-6xl mx-auto">
        {/* Small logo icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-12 h-12 md:w-14 md:h-14 mb-8"
        >
          <Image
            src="/logo.png"
            alt="Spawn"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.1] mb-6"
        >
          Trust Layer for<br />
          <em className="italic text-accent-gradient">AI Agents</em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-dim text-sm md:text-base max-w-xl mb-10 font-light leading-relaxed"
        >
          Verify agent reputation before you interact. Real scores based on on-chain data, 
          contract analysis, and community trust signals.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="max-w-md"
        >
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents or paste contract..."
                className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-foreground text-sm placeholder-muted focus:outline-none focus:border-blue-500/50 transition-all duration-300 font-mono"
              />
            </div>
          </form>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-center gap-8 mt-10 text-xs text-muted"
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
