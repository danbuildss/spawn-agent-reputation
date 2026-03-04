import AgentDetailClient from './AgentDetailClient'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

async function getAgentFromDB(address: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  try {
    const supabase = createClient(url, key)
    const { data } = await supabase
      .from('agents')
      .select('*')
      .ilike('contract_address', address)
      .single()
    return data || null
  } catch { return null }
}

export default async function AgentPage({ params }: { params: { address: string } }) {
  const dbAgent = await getAgentFromDB(params.address)
  return <AgentDetailClient agent={dbAgent} address={params.address} />
}
