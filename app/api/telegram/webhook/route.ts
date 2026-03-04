import { NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const API_URL = 'https://agentspawn.xyz'
const GRADE_LABELS = { A: 'A (High Trust)', B: 'B (Good)', C: 'C (Moderate)', D: 'D (Caution)', F: 'F (High Risk)' } as const

function escMd(text: string) {
  return String(text || '').replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1')
}

function gradeBar(score: number) {
  const filled = Math.round(score / 10)
  return '█'.repeat(filled) + '░'.repeat(10 - filled)
}

async function sendMsg(chatId: number | string, text: string) {
  if (!BOT_TOKEN) return
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'MarkdownV2', disable_web_page_preview: true }),
  })
}

async function handleUpdate(update: any) {
  const msg = update.message || update.edited_message
  if (!msg) return

  const chatId = msg.chat.id
  const text: string = msg.text?.trim() || ''
  if (!text) return

  // /start or /help
  if (text.startsWith('/start') || text.startsWith('/help')) {
    await sendMsg(chatId,
      `*Spawn — Trust Layer for AI Agents*\n\n` +
      `Check reputation scores for any AI agent token on Base before you trade\\.\n\n` +
      `*Commands:*\n` +
      `/check \\<address\\> — Score any contract\n` +
      `/verify — Get your agent verified\n` +
      `/top — Top verified agents\n` +
      `/stats — Platform stats\n\n` +
      `Or just paste a contract address directly\\.\n\n` +
      `Built by @danbuildss`
    )
    return
  }

  // /verify
  if (text.startsWith('/verify')) {
    await sendMsg(chatId,
      `*Verify Your Agent*\n\n` +
      `Get the verified badge on Spawn\\.\n\n` +
      `✅ Verified badge in the directory\n` +
      `✅ Priority placement in search\n` +
      `✅ Score breakdown displayed publicly\n\n` +
      `*Cost:* \\$29 USDC one\\-time on Base\n\n` +
      `[Start Verification](${API_URL}/verify)`
    )
    return
  }

  // /top
  if (text.startsWith('/top')) {
    try {
      const res = await fetch(`${API_URL}/api/agents`)
      const data = await res.json()
      const agents = (data.agents || [])
        .filter((a: any) => a.status === 'verified')
        .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
        .slice(0, 10)
      if (!agents.length) { await sendMsg(chatId, 'No verified agents yet\\.'); return }
      let out = '*Top Verified Agents*\n\n'
      agents.forEach((a: any, i: number) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}\\.`
        out += `${medal} *${escMd(a.name)}* ${escMd(a.token || '')}\n   ${a.score || 0}/100\n\n`
      })
      await sendMsg(chatId, out)
    } catch { await sendMsg(chatId, '❌ Failed to fetch top agents\\.') }
    return
  }

  // /stats
  if (text.startsWith('/stats')) {
    try {
      const res = await fetch(`${API_URL}/api/agents`)
      const data = await res.json()
      const agents = data.agents || []
      const verified = agents.filter((a: any) => a.status === 'verified').length
      await sendMsg(chatId,
        `*Spawn Stats*\n\n` +
        `├ Agents indexed: ${agents.length}\n` +
        `├ Verified: ${verified}\n` +
        `└ Pending: ${agents.length - verified}\n\n` +
        `[agentspawn\\.xyz](${API_URL})`
      )
    } catch { await sendMsg(chatId, '❌ Failed to fetch stats\\.') }
    return
  }

  // /check <address> or direct address paste
  let address: string | null = null
  if (text.startsWith('/check')) {
    address = text.replace('/check', '').trim()
  } else if (/^0x[a-fA-F0-9]{40}$/.test(text)) {
    address = text
  }

  if (address) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      await sendMsg(chatId, '❌ Invalid address format\\. Example:\n`/check 0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b`')
      return
    }
    // Send loading message
    let loadingMsgId: number | null = null
    if (BOT_TOKEN) {
      const lr = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: '🔍 Checking reputation\\.\\.\\.', parse_mode: 'MarkdownV2' }),
      })
      const ld = await lr.json()
      loadingMsgId = ld?.result?.message_id
    }

    try {
      const res = await fetch(`${API_URL}/api/reputation?address=${address}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const score = data.score || 0
      const grade = data.grade || 'F'
      const bar = gradeBar(score)
      const name = data.name || 'Unknown Agent'
      const token = data.token ? ` ${data.token}` : ''

      let card = `*${escMd(name)}${escMd(token)}*\n`
      card += `\`${bar}\`\n`
      card += `*${grade}* · ${score}/100\n\n`
      if (data.recommendation) card += `_${escMd(data.recommendation)}_\n\n`
      if (data.flags?.length) {
        card += `*Signals:*\n`
        data.flags.slice(0, 3).forEach((f: string) => { card += `• ${escMd(f)}\n` })
        card += '\n'
      }
      const src = data.source === 'tee' && data.verified ? '🛡️ TEE Verified' : '📡 On\\-chain'
      card += `${src} · [Full Report](${API_URL}/agent/${address})`

      if (BOT_TOKEN && loadingMsgId) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, message_id: loadingMsgId, text: card, parse_mode: 'MarkdownV2', disable_web_page_preview: true }),
        })
      } else {
        await sendMsg(chatId, card)
      }
    } catch (err: any) {
      const errMsg = `❌ ${escMd(err?.message || 'Failed to fetch score')}`
      if (BOT_TOKEN && loadingMsgId) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, message_id: loadingMsgId, text: errMsg, parse_mode: 'MarkdownV2' }),
        })
      } else {
        await sendMsg(chatId, errMsg)
      }
    }
    return
  }
}

export async function POST(req: Request) {
  try {
    const update = await req.json()
    // Don't await — return 200 fast, process async
    handleUpdate(update).catch(console.error)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Spawn Telegram webhook active' })
}
