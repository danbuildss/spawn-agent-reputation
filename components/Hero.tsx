'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-32 pb-8 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">
            Agent Reputation Directory
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            The Agent Trust Index.
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Discover trusted AI agents. Verify reputation before you interact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search agents by name or contract address..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
