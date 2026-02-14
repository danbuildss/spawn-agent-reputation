'use client'

import { motion } from 'framer-motion'
import { Search, Shield, Zap, Users, BarChart3 } from 'lucide-react'

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
              Agent Reputation Layer for Base
            </p>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            <span className="text-accent">Ethos Scores</span> for AI Agents
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-2xl mx-auto">
            The trust layer for AI agents on Base. Verify reputation before you interact, partner, or trade. Real scores based on on-chain activity, community trust, and creator history.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Real-time API</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-blue-500" />
            <span>60+ Agents Indexed</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="w-4 h-4 text-green-500" />
            <span>Ethos Score (0-2800)</span>
          </div>
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

        {/* What We've Built */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          <div className="p-4 bg-card border border-border rounded-xl text-left">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold text-foreground text-sm mb-1">Reputation API</h3>
            <p className="text-xs text-muted-foreground">
              Query any agent's trust score via REST API. Get detailed breakdowns of contract age, liquidity, holders, and creator history.
            </p>
          </div>
          <div className="p-4 bg-card border border-border rounded-xl text-left">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-foreground text-sm mb-1">Ethos Integration</h3>
            <p className="text-xs text-muted-foreground">
              Powered by Ethos Network's Creator Score system (0-2800). From "Untrust" to "Renowned" — know who you're dealing with.
            </p>
          </div>
          <div className="p-4 bg-card border border-border rounded-xl text-left">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold text-foreground text-sm mb-1">Agent Directory</h3>
            <p className="text-xs text-muted-foreground">
              Browse 60+ AI agents on Base. Filter by category, sort by score or trust value. Get verified and featured.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
