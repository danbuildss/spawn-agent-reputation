import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const { address, telegramChatId, currentScore } = await req.json()
  if (!address || !telegramChatId) {
    return NextResponse.json({ error: 'address and telegramChatId required' }, { status: 400 })
  }
  if (!supabaseAdmin) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { error } = await supabaseAdmin.from('watches').upsert(
    {
      address: address.toLowerCase(),
      telegram_chat_id: telegramChatId.toString(),
      last_score: currentScore || 0,
      last_checked_at: new Date().toISOString(),
    },
    { onConflict: 'address,telegram_chat_id' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, message: `Watching ${address}` })
}
