import { agents, getAgentById } from '@/lib/agents-data'
import { notFound } from 'next/navigation'
import AgentDetailClient from './AgentDetailClient'

// Generate static params for all agents
export function generateStaticParams() {
  return agents.map((agent) => ({
    address: agent.id,
  }))
}

export default function AgentPage({ params }: { params: { address: string } }) {
  const agent = getAgentById(params.address)
  
  if (!agent) {
    notFound()
  }
  
  return <AgentDetailClient agent={agent} />
}
