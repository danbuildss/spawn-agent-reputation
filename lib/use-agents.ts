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
  const [agents, setAgents] = useState<Agent[]>(staticAgents)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch('/api/agents')
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        
        if (data.agents && data.agents.length > 0) {
          // Merge API agents with static agents, preferring static for known agents
          const staticIds = new Set(staticAgents.map(a => a.id))
          const apiAgents = data.agents.filter((a: Agent) => !staticIds.has(a.id))
          
          // Combine: static agents first (higher quality data), then API agents
          const combined = [...staticAgents, ...apiAgents]
            .sort((a, b) => b.score - a.score)
            .slice(0, 100)
          
          setAgents(combined)
        }
      } catch (err) {
        console.error('Failed to fetch agents:', err)
        setError('Using cached data')
        // Keep using static agents as fallback
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
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
