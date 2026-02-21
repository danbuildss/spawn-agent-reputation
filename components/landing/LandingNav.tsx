'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function LandingNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/logo.png" alt="Spawn" fill className="object-contain" />
          </div>
          <span className="font-light tracking-wider text-foreground lowercase text-lg">spawn</span>
        </Link>

        <div className="flex items-center gap-6">
          <a 
            href="https://docs.agentspawn.xyz" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-dim hover:text-foreground transition-colors hidden md:block"
          >
            Docs
          </a>
          <a 
            href="https://twitter.com/agentspawn_xyz" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-dim hover:text-foreground transition-colors hidden md:block"
          >
            Twitter
          </a>
          <Link
            href="/app"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/25"
          >
            Launch App
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
