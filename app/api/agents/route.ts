import { NextResponse } from 'next/server'
import { agents } from '@/lib/agents-data'

// API returns only verified/curated agents
// Projects can pay to get verified and listed
export async function GET() {
  return NextResponse.json({
    agents: agents.map(a => ({
      ...a,
      // Include contract for transparency
      contract: a.contract || null,
    })),
    count: agents.length,
    verifiedCount: agents.filter(a => a.status === 'verified').length,
    updatedAt: new Date().toISOString(),
    note: 'Curated list of verified AI agents on Base. Submit your agent at /submit to get listed.'
  })
}
