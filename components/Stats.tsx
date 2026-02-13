'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const stats = [
  { label: 'Agents Indexed', value: '2,400+', delay: 0 },
  { label: 'Avg Trust Score', value: '94.2%', delay: 0.1 },
  { label: 'Value Protected', value: '$2.1M', delay: 0.2 },
]

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: stat.delay }}
              className="glass-card p-8 text-center hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="text-4xl md:text-5xl font-bold mb-3 text-gradient group-hover:scale-110 transition-transform duration-300 inline-block">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
