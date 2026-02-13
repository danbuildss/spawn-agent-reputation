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
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section ref={ref} className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              className="glass-card p-5 text-center hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl font-bold mb-1 text-white">
                {stat.value}
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
