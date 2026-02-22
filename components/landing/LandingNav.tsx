'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 bg-[rgb(10,10,12)]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-6 h-6">
            <Image
              src="/logo.png"
              alt="Spawn"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg font-light tracking-wider text-foreground lowercase font-mono">spawn</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <a 
            href="https://docs.agentspawn.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:block text-sm text-dim hover:text-foreground transition-colors font-mono"
          >
            Docs
          </a>
          <Link
            href="/app"
            className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-300 text-sm font-medium font-mono"
          >
            Launch App
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
