'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function Navigation() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="max-w-6xl mx-auto glass-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Minimal text logo */}
          <span className="text-lg font-medium text-white tracking-tight">spawn</span>
          
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#agents" className="text-gray-400 hover:text-white transition-colors">
              Agents
            </a>
            <a href="#verify" className="text-gray-400 hover:text-white transition-colors">
              Verify
            </a>
            <a href="#docs" className="text-gray-400 hover:text-white transition-colors">
              Docs
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Search className="w-4 h-4 text-gray-400" />
          </button>
          <button className="glass-button text-sm font-medium px-4 py-2">
            Launch App
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
