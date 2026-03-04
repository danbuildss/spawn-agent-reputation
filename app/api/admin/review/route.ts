import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const { id, action, adminKey } = await req.json()
  if (adminKey !== 'spawn2026') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabaseAdmin) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const status = action === 'approve' ? 'approved' : 'rejected'
  const { error } = await supabaseAdmin
    .from('submissions')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If approved, upsert into agents table
  if (action === 'approve') {
    const { data: sub } = await supabaseAdmin.from('submissions').select('*').eq('id', id).single()
    if (sub) {
      await supabaseAdmin.from('agents').upsert({
        contract_address: sub.contract_address,
        name: sub.name || 'Unknown',
        token: sub.token || '',
        description: sub.description,
        twitter: sub.twitter,
        website: sub.website,
        status: 'verified',
        verified_at: new Date().toISOString(),
        score: 0,
        grade: 'F',
      }, { onConflict: 'contract_address' })
    }
  }

  return NextResponse.json({ message: `Submission ${status}` })
}
