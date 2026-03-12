import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!supabaseAdmin) return NextResponse.json({ agents: [] })
  const { data } = await supabaseAdmin
    .from('agents')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  return NextResponse.json({ agents: data || [] })
}
