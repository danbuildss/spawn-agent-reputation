import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

dotenv.config()

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const API_URL = process.env.API_URL || 'https://agentspawn.xyz'

if (!BOT_TOKEN) {
  console.error('Missing TELEGRAM_BOT_TOKEN in .env')
  process.exit(1)
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

// Rate limiting
const userRateLimits = new Map()
function checkRateLimit(userId) {
  const now = Date.now()
  const recent = (userRateLimits.get(userId) || []).filter(t => now - t < 60000)
  if (recent.length >= 10) return false
  userRateLimits.set(userId, [...recent, now])
  return true
}
setInterval(() => {
  const now = Date.now()
  for (const [id, times] of userRateLimits.entries()) {
    const r = times.filter(t => now - t < 60000)
    r.length ? userRateLimits.set(id, r) : userRateLimits.delete(id)
  }
}, 5 * 60 * 1000)

// Grade helpers
function gradeBar(score) {
  const filled = Math.round(score / 10)
  return '█'.repeat(filled) + '░'.repeat(10 - filled)
}

function gradeEmoji(grade) {
  return { A: '🟢', B: '🟡', C: '🟠', D: '🔴', F: '🔴' }[grade] || '⚪'
}

// Bot commands menu
bot.setMyCommands([
  { command: 'check', description: 'Check agent score — /check 0x...' },
  { command: 'top', description: 'Top 10 verified agents' },
  { command: 'alert', description: 'Watch an agent for score changes — /alert 0x...' },
  { command: 'verify', description: 'Get your agent verified on Spawn' },
  { command: 'stats', description: 'Platform statistics' },
  { command: 'help', description: 'How scoring works' },
])

console.log('Spawn Bot started — polling...')

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, `*Spawn — Trust Layer for AI Agents*\n\nCheck the reputation score of any AI agent token on Base before you trade.\n\n*Commands:*\n/check \\<address\\> — Score any contract\n/alert \\<address\\> — Get notified on score changes\n/verify — Get your agent verified\n/top — Top verified agents\n/stats — Platform stats\n\nOr just paste a contract address directly.\n\nBuilt by @danbuildss`, { parse_mode: 'MarkdownV2', disable_web_page_preview: true })
})

// /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  const msg_text = `*How Spawn Scores Work*\n\nScores are computed inside EigenLayer Verified TEEs — tamper\\-proof and cryptographically attested\\.\n\n*Factors:*\n├ Contract Age \\— 20 pts\n├ Liquidity Depth \\— 25 pts\n├ Holder Count \\— 15 pts\n├ LP Stability \\— 20 pts\n├ Volume Pattern \\— 10 pts\n└ Creator Reputation \\— 10 pts\n\n*Grades:*\n🟢 A \\= 85\\-100 High Trust\n🟡 B \\= 70\\-84 Good\n🟠 C \\= 55\\-69 Moderate\n🔴 D\\+F \\= \\<55 Low Risk\n\n[Full methodology](${API_URL}/methodology)`
  bot.sendMessage(chatId, msg_text, { parse_mode: 'MarkdownV2', disable_web_page_preview: true })
})

// /verify
bot.onText(/\/verify/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId,
    `*Verify Your Agent*\n\nGet the verified badge on your Spawn profile\\.\n\n*What you get:*\n✅ Green verified badge in the directory\n✅ Priority placement in search\n✅ Score breakdown displayed publicly\n\n*Cost:* \\$29 USDC one\\-time \\(refundable if rejected\\)\n\n[Start Verification](${API_URL}/verify)`,
    { parse_mode: 'MarkdownV2', disable_web_page_preview: false }
  )
})

// Core check logic — reused by /check and direct address
async function checkAddress(chatId, address, loadingMsgId) {
  try {
    const res = await fetch(`${API_URL}/api/reputation?address=${address}`)
    const data = await res.json()

    if (data.error) {
      const errText = `❌ *Error*\n\n${data.error}`
      if (loadingMsgId) {
        await bot.editMessageText(errText, { chat_id: chatId, message_id: loadingMsgId, parse_mode: 'Markdown' })
      } else {
        bot.sendMessage(chatId, errText, { parse_mode: 'Markdown' })
      }
      return
    }

    const name = data.name || 'Unknown Token'
    const token = data.token ? ` ${data.token}` : ''
    const score = data.score || 0
    const grade = data.grade || 'F'
    const emoji = gradeEmoji(grade)
    const bar = gradeBar(score)

    // Score card header
    let card = `${emoji} *${escMd(name)}${escMd(token)}*\n`
    card += `\`${bar}\`\n`
    card += `*${grade}* · ${score}/100\n\n`

    // Recommendation
    if (data.recommendation) {
      card += `_${escMd(data.recommendation)}_\n\n`
    }

    // Breakdown
    if (data.breakdown) {
      const b = data.breakdown
      const rows = [
        ['Contract Age', b.contractAge],
        ['Liquidity', b.liquidity],
        ['Holders', b.holders],
        ['LP Stability', b.lpLocked],
        ['Volume', b.volume],
        ['Creator Rep', b.creatorReputation || b.creatorHistory],
      ]
      card += `*Score Breakdown:*\n`
      rows.forEach(([label, factor], i) => {
        if (!factor) return
        const prefix = i === rows.length - 1 ? '└' : '├'
        const detail = factor.detail ? ` · ${factor.detail}` : ''
        card += `${prefix} ${escMd(label)}: ${factor.score}/${factor.max}${escMd(detail)}\n`
      })
      card += '\n'
    }

    // Flags
    if (data.flags?.length) {
      card += `*Signals:*\n`
      data.flags.slice(0, 4).forEach(f => { card += `• ${escMd(f)}\n` })
      card += '\n'
    }

    // TEE source
    const sourceTag = data.source === 'tee' && data.verified
      ? '🛡️ TEE Verified'
      : data.source === 'onchain'
      ? '📡 On\\-chain data'
      : '📋 Indexed'
    card += `${sourceTag} · [Full Report](${API_URL}/agent/${address})`

    const opts = { parse_mode: 'MarkdownV2', disable_web_page_preview: true }
    if (loadingMsgId) {
      await bot.editMessageText(card, { chat_id: chatId, message_id: loadingMsgId, ...opts })
    } else {
      bot.sendMessage(chatId, card, opts)
    }

  } catch (err) {
    console.error('Check error:', err)
    const errText = '❌ Failed to fetch score\\. Try again later\\.'
    if (loadingMsgId) {
      bot.editMessageText(errText, { chat_id: chatId, message_id: loadingMsgId, parse_mode: 'MarkdownV2' })
    } else {
      bot.sendMessage(chatId, errText, { parse_mode: 'MarkdownV2' })
    }
  }
}

function escMd(text) {
  if (!text) return ''
  return String(text).replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1')
}

// /check command
bot.onText(/\/check(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id
  const userId = msg.from?.id || chatId
  if (!checkRateLimit(userId)) {
    bot.sendMessage(chatId, '⏳ Rate limited. Wait a minute.')
    return
  }
  const address = match[1]?.trim()
  if (!address) {
    bot.sendMessage(chatId, '❌ Provide a contract address.\n\nExample:\n`/check 0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b`', { parse_mode: 'Markdown' })
    return
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    bot.sendMessage(chatId, '❌ Invalid address format.')
    return
  }
  const loading = await bot.sendMessage(chatId, '🔍 Checking reputation...')
  await checkAddress(chatId, address, loading.message_id)
})

// /top command
bot.onText(/\/top/, async (msg) => {
  const chatId = msg.chat.id
  try {
    const res = await fetch(`${API_URL}/api/agents`)
    const data = await res.json()
    const agents = (data.agents || [])
      .filter(a => a.status === 'verified')
      .sort((a, b) => (b.score || b.trust_score || 0) - (a.score || a.trust_score || 0))
      .slice(0, 10)

    if (!agents.length) {
      bot.sendMessage(chatId, 'No verified agents yet.')
      return
    }

    let text = '*Top 10 Verified Agents*\n\n'
    agents.forEach((a, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}\\.`
      const score = a.score || a.trust_score || 0
      const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F'
      text += `${medal} *${escMd(a.name)}* ${escMd(a.token || '')}\n`
      text += `   ${gradeEmoji(grade)} ${score}/100\n\n`
    })
    bot.sendMessage(chatId, text, { parse_mode: 'MarkdownV2' })
  } catch {
    bot.sendMessage(chatId, '❌ Failed to fetch top agents.')
  }
})

// /stats command
bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id
  try {
    const res = await fetch(`${API_URL}/api/agents`)
    const data = await res.json()
    const agents = data.agents || []
    const verified = agents.filter(a => a.status === 'verified').length
    const text = `*Spawn Stats*\n\n├ Agents indexed: ${agents.length}\n├ Verified: ${verified}\n└ Pending: ${agents.length - verified}\n\n[agentspawn\\.xyz](${API_URL})`
    bot.sendMessage(chatId, text, { parse_mode: 'MarkdownV2', disable_web_page_preview: true })
  } catch {
    bot.sendMessage(chatId, '❌ Failed to fetch stats.')
  }
})

// /alert command
bot.onText(/\/alert(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id
  const address = match[1]?.trim()
  if (!address) {
    bot.sendMessage(chatId, '❌ Provide a contract address.\n\nExample:\n`/alert 0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b`', { parse_mode: 'Markdown' })
    return
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    bot.sendMessage(chatId, '❌ Invalid address format.')
    return
  }
  const loading = await bot.sendMessage(chatId, `⏳ Setting up alert for ${address.slice(0, 8)}...`)
  try {
    const [scoreRes, watchRes] = await Promise.all([
      fetch(`${API_URL}/api/reputation?address=${address}`).then(r => r.json()),
      fetch(`${API_URL}/api/alerts/watch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, telegramChatId: chatId.toString(), currentScore: 0 }),
      }).then(r => r.json()),
    ])
    const score = scoreRes.score || 0
    const grade = scoreRes.grade || 'F'
    if (watchRes.success) {
      bot.editMessageText(
        `✅ *Alert set*\n\nWatching: \`${address.slice(0, 10)}...${address.slice(-6)}\`\nCurrent score: *${score}/100 \\(${escMd(grade)}\\)*\n\nYou'll be notified when the score changes by 5\\+ points\\.`,
        { chat_id: chatId, message_id: loading.message_id, parse_mode: 'MarkdownV2' }
      )
    } else {
      bot.editMessageText('❌ Failed to set alert. Try again later.', { chat_id: chatId, message_id: loading.message_id })
    }
  } catch {
    bot.editMessageText('❌ Error setting alert.', { chat_id: chatId, message_id: loading.message_id })
  }
})

// Direct address paste
bot.on('message', async (msg) => {
  const text = msg.text?.trim()
  if (!text || text.startsWith('/')) return
  if (/^0x[a-fA-F0-9]{40}$/.test(text)) {
    const userId = msg.from?.id || msg.chat.id
    if (!checkRateLimit(userId)) {
      bot.sendMessage(msg.chat.id, '⏳ Rate limited. Wait a minute.')
      return
    }
    const loading = await bot.sendMessage(msg.chat.id, '🔍 Checking reputation...')
    await checkAddress(msg.chat.id, text, loading.message_id)
  }
})

bot.on('polling_error', (err) => console.error('Polling error:', err.message))
console.log(`Bot connected to ${API_URL}`)
