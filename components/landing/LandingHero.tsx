'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingHero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-6 relative overflow-hidden">
      {/* Glow orbs - matching main app */}
      <div className="glow-orb w-[600px] h-[600px] bg-blue-500 -top-[200px] right-[10%]" />
      <div className="glow-orb w-[500px] h-[500px] bg-purple-500 bottom-[10%] -left-[100px]" />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-8"
        >
          <Image
            src="/logo.png"
            alt="Spawn"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-white/10 rounded-full mb-8"
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-dim font-mono">Live on Base</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-serif text-5xl md:text-7xl font-normal leading-[1.1] mb-6"
        >
          Trust Layer for<br />
          <em className="italic text-accent-gradient">AI Agents</em>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-dim text-base md:text-lg max-w-lg mx-auto mb-10 font-light leading-relaxed"
        >
          Verify any agent before you ape. On-chain data. TEE-verified. No trust required.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <Link
            href="/app"
            className="group relative px-6 py-3 font-mono text-sm font-medium"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300" />
            <div className="relative px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors">
              Check an Agent →
            </div>
          </Link>
          <Link
            href="https://t.me/agentspawn_bot"
            target="_blank"
            className="px-6 py-3 bg-surface border border-white/10 hover:border-blue-500/30 text-foreground rounded-lg transition-all duration-300 text-sm font-medium font-mono"
          >
            Telegram Bot
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-center justify-center gap-8 mt-16 text-sm text-muted font-mono"
        >
          <div className="text-center">
            <div className="stat-number text-2xl text-foreground">100+</div>
            <div className="text-xs">Agents Indexed</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="stat-number text-2xl text-foreground">TEE</div>
            <div className="text-xs">Verified</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="stat-number text-2xl text-foreground">Base</div>
            <div className="text-xs">Native</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
