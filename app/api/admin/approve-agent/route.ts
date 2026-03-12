import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { contract_address, action, adminKey } = await req.json()
  if (adminKey !== 'spawn2026') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabaseAdmin) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  if (action === 'approve') {
    const { error } = await supabaseAdmin
      .from('agents')
      .update({ status: 'active', last_synced_at: new Date().toISOString() })
      .eq('contract_address', contract_address)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ message: 'Agent approved and published' })
  }

  if (action === 'reject') {
    const { error } = await supabaseAdmin
      .from('agents')
      .delete()
      .eq('contract_address', contract_address)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ message: 'Agent rejected and removed' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
