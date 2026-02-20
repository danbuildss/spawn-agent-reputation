'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'

export default function Navigation() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 bg-[rgb(10,10,12)]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
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
          
          <div className="hidden md:flex items-center gap-6 text-sm font-mono">
            <Link href="/#agents" className="text-dim hover:text-foreground transition-colors">
              Agents
            </Link>
            <Link href="/featured" className="text-dim hover:text-foreground transition-colors">
              Featured
            </Link>
            <a 
              href="https://docs.agentspawn.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dim hover:text-foreground transition-colors"
            >
              Docs
            </a>
            <a 
              href="https://t.me/agentspawn_bot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dim hover:text-foreground transition-colors"
            >
              Bot
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/submit"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-300 font-mono"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Submit</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
