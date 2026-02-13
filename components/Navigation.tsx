'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="text-lg font-semibold text-foreground">spawn</Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/#agents" className="text-muted-foreground hover:text-foreground transition-colors">
              Agents
            </Link>
            <Link href="/featured" className="text-muted-foreground hover:text-foreground transition-colors">
              Get Featured
            </Link>
            <Link href="#api" className="text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link 
            href="/submit"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-accent/20 text-accent border border-accent/30 rounded-lg hover:bg-accent/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Submit Agent</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
