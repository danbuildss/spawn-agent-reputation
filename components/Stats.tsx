'use client'

import { motion } from 'framer-motion'
import { useAgentsContext } from './AgentsProvider'
import { ETH_PRICE } from '@/lib/agents-data'

export default function Stats() {
  const { agents, verifiedCount, totalVouched, loading } = useAgentsContext()
  
  const totalUSD = totalVouched * ETH_PRICE
  
  const formatUSD = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
    return `$${val.toFixed(0)}`
  }

  const stats = [
    { label: 'Total Agents', value: loading ? '...' : agents.length.toString() },
    { label: 'Verified', value: loading ? '...' : verifiedCount.toString() },
    { label: 'Trust Value', value: loading ? '...' : `${totalVouched.toFixed(1)}`, sub: 'ETH' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="px-4 md:px-6 relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-12 md:gap-16 py-6 border-t border-b border-white/10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1">
                <span className="stat-number text-2xl md:text-3xl font-normal text-blue-400">
                  {stat.value}
                </span>
                {stat.sub && (
                  <span className="text-xs text-muted uppercase tracking-wider">{stat.sub}</span>
                )}
              </div>
              <span className="text-[10px] tracking-[2px] uppercase text-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
