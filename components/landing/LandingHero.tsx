'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Zap } from 'lucide-react'

export default function LandingHero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent" />
      <div className="glow-orb w-[800px] h-[800px] bg-blue-600 -top-[300px] left-1/2 -translate-x-1/2 opacity-30" />
      <div className="glow-orb w-[600px] h-[600px] bg-purple-600 bottom-[100px] -right-[200px] opacity-20" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-blue-400">Powered by EigenLayer TEE</span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-8"
        >
          <Image src="/logo.png" alt="Spawn" fill className="object-contain" priority />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] mb-6"
        >
          Trust Layer for<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500">
            AI Agents
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-dim text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Cryptographically verified reputation scores for AI agents. 
          Built on EigenLayer with Ethos Network integration.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/app"
            className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-base font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 flex items-center gap-2"
          >
            Launch App
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://docs.agentspawn.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground text-base font-medium rounded-xl transition-all duration-200"
          >
            Read Docs
          </a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-16 text-sm text-muted"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>TEE Verified</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Real-time Scores</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-blue-500">◆</span>
            <span>Built on Base</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
