'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, BarChart3, ShieldCheck } from 'lucide-react'

const steps = [
  { icon: Search, title: 'Search', description: 'Enter any agent name or contract address', delay: 0 },
  { icon: BarChart3, title: 'Score', description: 'Get instant trust scores based on onchain data', delay: 0.1 },
  { icon: ShieldCheck, title: 'Verify', description: 'Make informed decisions with transparent data', delay: 0.2 },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section ref={ref} id="verify" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-gray-500 text-sm">Three steps to verify any agent's reputation</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="glass-card p-5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0052FF]/10 border border-[#0052FF]/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#0052FF]" />
                  </div>
                  <span className="text-2xl font-bold text-gray-700">0{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
