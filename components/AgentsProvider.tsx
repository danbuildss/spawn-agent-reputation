'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAgents } from '@/lib/use-agents'
import { Agent } from '@/lib/agents-data'

interface AgentsContextType {
  agents: Agent[]
  featuredAgents: Agent[]
  recentAgents: Agent[]
  loading: boolean
  error: string | null
  totalVouched: number
  verifiedCount: number
}

const AgentsContext = createContext<AgentsContextType | null>(null)

export function AgentsProvider({ children }: { children: ReactNode }) {
  const data = useAgents()
  
  return (
    <AgentsContext.Provider value={data}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgentsContext() {
  const context = useContext(AgentsContext)
  if (!context) {
    throw new Error('useAgentsContext must be used within AgentsProvider')
  }
  return context
}
