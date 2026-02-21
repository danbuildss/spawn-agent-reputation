'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '100+', label: 'Agents Indexed' },
  { value: '24/7', label: 'Live Scoring' },
  { value: 'TEE', label: 'Verified' },
  { value: 'Base', label: 'Network' },
]

export default function LandingStats() {
  return (
    <section className="py-16 px-4 md:px-6 border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-mono text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-dim">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
