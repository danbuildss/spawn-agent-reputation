'use client'

import { motion } from 'framer-motion'
import { agents, getVerifiedCount, getTotalVouched, getTotalVouchedUSD } from '@/lib/agents-data'

export default function Stats() {
  const totalVouched = getTotalVouched()
  const totalUSD = getTotalVouchedUSD()
  
  const formatUSD = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
    return `$${val.toFixed(0)}`
  }

  const stats = [
    { label: 'Agents', value: agents.length.toString() },
    { label: 'Verified', value: getVerifiedCount().toString() },
    { label: 'Vouched', value: `${totalVouched.toFixed(1)} ETH`, sub: formatUSD(totalUSD) },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="py-4 px-4 md:px-6 border-y border-white/5"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-6 md:gap-12 text-sm">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-1.5 md:gap-2">
            <div className="text-center md:text-left">
              <span className="text-white font-semibold">{stat.value}</span>
              {stat.sub && <span className="text-gray-500 text-xs ml-1">/ {stat.sub}</span>}
            </div>
            <span className="text-gray-500 text-xs md:text-sm">{stat.label}</span>
            {i < stats.length - 1 && <span className="text-gray-700 ml-4 hidden md:inline">|</span>}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
