import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== 'Bearer spawn2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!supabaseAdmin) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { data: watches } = await supabaseAdmin.from('watches').select('*')
  if (!watches?.length) return NextResponse.json({ checked: 0 })

  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  let notified = 0

  for (const watch of watches) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://agentspawn.xyz'}/api/reputation?address=${watch.address}`
      )
      const data = await res.json()
      const newScore = data.score || 0
      const diff = Math.abs(newScore - watch.last_score)

      if (diff >= 5 && TELEGRAM_TOKEN) {
        const direction = newScore > watch.last_score ? 'rose' : 'dropped'
        const msg = `Score alert for ${watch.address.slice(0, 8)}...\n\nScore ${direction} from ${watch.last_score} to ${newScore} (${data.grade})\n\nView: https://agentspawn.xyz/agent/${watch.address}`
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: watch.telegram_chat_id, text: msg }),
        })
        notified++
      }

      await supabaseAdmin
        .from('watches')
        .update({ last_score: newScore, last_checked_at: new Date().toISOString() })
        .eq('id', watch.id)
    } catch {}
  }

  return NextResponse.json({ checked: watches.length, notified })
}
