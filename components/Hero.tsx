'use client'

import { motion } from 'framer-motion'
import { Search, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-28 pb-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-accent" />
            <p className="text-accent text-sm font-medium tracking-wider uppercase">
              Agent Reputation Platform
            </p>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Trust Scores for <span className="text-accent">AI Agents</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Verify agent reputation before you interact. Real scores based on on-chain activity, community trust, and performance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents by name or contract..."
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
