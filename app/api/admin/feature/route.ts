import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const { contractAddress, adminKey, durationDays = 30 } = await req.json()
  if (adminKey !== 'spawn2026') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabaseAdmin) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const until = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
  const { error } = await supabaseAdmin.from('agents').update({ featured: true, featured_until: until }).eq('contract_address', contractAddress)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, featuredUntil: until })
}
