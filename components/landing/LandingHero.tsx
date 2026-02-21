'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LandingHero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow orbs - same as app */}
      <div className="glow-orb w-[600px] h-[600px] bg-blue-500 top-1/4 left-1/2 -translate-x-1/2" />
      <div className="glow-orb w-[400px] h-[400px] bg-purple-500 bottom-1/4 right-1/4" />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-accent">Live on Base</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-5xl md:text-7xl font-normal leading-[1.1] mb-6"
        >
          Trust scores for<br />
          <span className="text-accent-gradient">AI agents.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-dim max-w-md mx-auto mb-10"
        >
          Verify any agent before you ape. On-chain data. TEE-verified. No trust required.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center justify-center gap-3"
        >
          <Link
            href="/app"
            className="px-6 py-3 bg-accent hover:bg-accent-dim text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/25"
          >
            Check an Agent →
          </Link>
          <Link
            href="https://t.me/agentspawn_bot"
            target="_blank"
            className="glass-button"
          >
            Telegram Bot
          </Link>
        </motion.div>

        {/* Mini stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center justify-center gap-8 mt-16 text-sm text-muted"
        >
          <div className="text-center">
            <div className="stat-number text-2xl text-foreground">100+</div>
            <div>Agents Indexed</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="stat-number text-2xl text-foreground">TEE</div>
            <div>Verified</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="stat-number text-2xl text-foreground">Base</div>
            <div>Native</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
