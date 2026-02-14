import { getAgentById } from '@/lib/agents-data'
import AgentDetailClient from './AgentDetailClient'

// Force dynamic rendering for any address
export const dynamic = 'force-dynamic'

export default function AgentPage({ params }: { params: { address: string } }) {
  const agent = getAgentById(params.address)
  
  // Pass agent if found, otherwise pass the address for live lookup
  return <AgentDetailClient agent={agent || null} address={params.address} />
}
