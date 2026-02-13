'use client'

import { motion } from 'framer-motion'

const stats = [
  { label: 'Agents Indexed', value: '2,847' },
  { label: 'Verified', value: '342' },
  { label: 'Value Protected', value: '$4.2M' },
]

export default function Stats() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="py-6 px-6 border-y border-white/5"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-8 md:gap-16 text-sm">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="text-white font-semibold">{stat.value}</span>
            <span className="text-gray-500">{stat.label}</span>
            {i < stats.length - 1 && <span className="text-gray-700 ml-6 hidden md:inline">|</span>}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
