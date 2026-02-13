'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

export default function Navigation() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="text-lg font-semibold text-white">spawn</a>
          
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
            <a href="#api" className="text-gray-400 hover:text-white transition-colors">
              API
            </a>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent/20 text-accent border border-accent/30 rounded-lg hover:bg-accent/30 transition-colors">
          <Plus className="w-4 h-4" />
          Submit Agent
        </button>
      </div>
    </motion.nav>
  )
}
