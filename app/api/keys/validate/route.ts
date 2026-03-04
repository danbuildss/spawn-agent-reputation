import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { key } = await req.json()

  if (!key || !supabaseAdmin) {
    return NextResponse.json({ valid: false })
  }

  const { data } = await supabaseAdmin
    .from('api_keys')
    .select('*')
    .eq('api_key', key)
    .single()

  if (!data) {
    return NextResponse.json({ valid: false })
  }

  // Daily reset
  const today = new Date().toISOString().split('T')[0]
  if (data.last_reset_date !== today) {
    await supabaseAdmin
      .from('api_keys')
      .update({ calls_today: 0, last_reset_date: today })
      .eq('api_key', key)
    return NextResponse.json({ valid: true, tier: data.tier, remaining: data.calls_limit })
  }

  // Rate limit check
  if (data.calls_today >= data.calls_limit) {
    return NextResponse.json({ valid: false, reason: 'rate_limit', tier: data.tier })
  }

  // Increment usage
  await supabaseAdmin
    .from('api_keys')
    .update({ calls_today: data.calls_today + 1 })
    .eq('api_key', key)

  return NextResponse.json({
    valid: true,
    tier: data.tier,
    remaining: data.calls_limit - data.calls_today - 1,
  })
}
