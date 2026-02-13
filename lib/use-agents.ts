'use client'

import { useState, useEffect } from 'react'
import { agents as staticAgents, Agent, ETH_PRICE } from './agents-data'

interface UseAgentsReturn {
  agents: Agent[]
  featuredAgents: Agent[]
  recentAgents: Agent[]
  loading: boolean
  error: string | null
  totalVouched: number
  verifiedCount: number
}

export function useAgents(): UseAgentsReturn {
  // Use only verified static agents - no external API
  // Other agents can pay to get verified and added
  const [agents] = useState<Agent[]>(staticAgents)
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    // Simulate brief loading for UX
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const featuredAgents = agents.filter(a => a.featured || a.score >= 90).slice(0, 6)
  const recentAgents = agents.filter(a => a.recentlyAdded).slice(0, 8)
  const totalVouched = agents.reduce((sum, a) => sum + a.vouched, 0)
  const verifiedCount = agents.filter(a => a.status === 'verified').length

  return {
    agents,
    featuredAgents,
    recentAgents,
    loading,
    error,
    totalVouched,
    verifiedCount
  }
}

// Format helpers
export const formatVouched = (eth: number) => {
  const usd = eth * ETH_PRICE
  if (usd >= 1000000) return `${eth.toFixed(1)} ETH / $${(usd / 1000000).toFixed(1)}M`
  if (usd >= 1000) return `${eth.toFixed(1)} ETH / $${(usd / 1000).toFixed(0)}K`
  return `${eth.toFixed(1)} ETH / $${usd.toFixed(0)}`
}

export const formatUSD = (val: number) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
  return `$${val.toFixed(0)}`
}
