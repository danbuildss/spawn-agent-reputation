import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!supabaseAdmin) return NextResponse.json({ submissions: [] })
  const { data } = await supabaseAdmin.from('submissions').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ submissions: data || [] })
}
