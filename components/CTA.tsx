'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, ArrowRight } from 'lucide-react'

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section ref={ref} className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0052FF]/5 via-purple-600/5 to-transparent" />
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Check Any Agent Now
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Don't get rugged. Verify agent reputation before you invest.
            </p>

            <div className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search agent or contract..."
                    className="glass-input pl-11 py-3 text-sm text-white placeholder-gray-500"
                  />
                </div>
                <button className="glass-button px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10">
                  Verify Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
