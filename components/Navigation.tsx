'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function Navigation() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-full" />
            </div>
            <span className="text-xl font-bold">Spawn</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm">
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
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
          <button className="glass-button text-sm font-medium">
            Launch App
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
