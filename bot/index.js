import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

dotenv.config()

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const API_URL = process.env.API_URL || 'https://spawn-agent-reputation.vercel.app'

if (!BOT_TOKEN) {
  console.error('❌ Missing TELEGRAM_BOT_TOKEN in .env')
  process.exit(1)
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

// Set bot commands for autocomplete menu
bot.setMyCommands([
  { command: 'check', description: 'Check agent reputation by contract address' },
  { command: 'top', description: 'Show top 10 verified agents' },
  { command: 'stats', description: 'Platform statistics' },
  { command: 'help', description: 'Show help & how scoring works' }
])

console.log('🤖 Spawn Bot started!')

// Helper to format score with emoji
function getScoreEmoji(score) {
  if (score >= 85) return '🟢'
  if (score >= 70) return '🟡'
  if (score >= 55) return '🟠'
  return '🔴'
}

// Helper to format grade
function formatGrade(grade, score) {
  const emoji = getScoreEmoji(score)
  return `${emoji} ${score}/100 (Grade ${grade})`
}

// /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  const welcome = `
🛡️ *Spawn - Agent Reputation Bot*

Check trust scores for any AI agent on Base.

*Commands:*
/check <address> - Check reputation by contract
/top - Show top verified agents
/help - Show this message

*Example:*
\`/check 0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b\`

Built by @danbuildss
`
  bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown' })
})

// /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  const help = `
🛡️ *Spawn Bot Commands*

/check <address> - Check agent reputation
/top - Top 10 verified agents
/stats - Platform statistics

*How scoring works:*
• Contract Age (20 pts)
• Liquidity (25 pts)
• Holders (15 pts)
• LP Stability (20 pts)
• Volume (10 pts)
• Creator Rep (10 pts)

*Grades:*
🟢 A = 85-100 (High Trust)
🟡 B = 70-84 (Good)
🟠 C = 55-69 (Moderate)
🔴 D/F = <55 (Low/Very Low)

Website: ${API_URL}
`
  bot.sendMessage(chatId, help, { parse_mode: 'Markdown' })
})

// /check command
bot.onText(/\/check(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id
  const address = match[1]?.trim()

  if (!address) {
    bot.sendMessage(chatId, '❌ Please provide a contract address.\n\nExample: `/check 0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b`', { parse_mode: 'Markdown' })
    return
  }

  // Validate address
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    bot.sendMessage(chatId, '❌ Invalid address format. Must be a valid Ethereum address (0x...)')
    return
  }

  // Send loading message
  const loadingMsg = await bot.sendMessage(chatId, '🔍 Checking reputation...')

  try {
    const res = await fetch(`${API_URL}/api/reputation?address=${address}`)
    const data = await res.json()

    if (data.error) {
      await bot.editMessageText(`❌ Error: ${data.error}`, {
        chat_id: chatId,
        message_id: loadingMsg.message_id
      })
      return
    }

    // Format response
    const name = data.name || 'Unknown Token'
    const token = data.token || ''
    const score = data.score || 0
    const grade = data.grade || 'F'
    const recommendation = data.recommendation || ''
    const source = data.source === 'database' ? '✅ Indexed on Spawn' : '📡 Live data'
    
    let breakdown = ''
    if (data.breakdown) {
      const b = data.breakdown
      breakdown = `
*Breakdown:*
├ Contract Age: ${b.contractAge?.score || 0}/${b.contractAge?.max || 20}
├ Liquidity: ${b.liquidity?.score || 0}/${b.liquidity?.max || 25}
├ Holders: ${b.holders?.score || 0}/${b.holders?.max || 15}
├ LP Stability: ${b.lpLocked?.score || 0}/${b.lpLocked?.max || 20}
├ Volume: ${b.volume?.score || 0}/${b.volume?.max || 10}
└ Creator: ${b.creatorHistory?.score || 0}/${b.creatorHistory?.max || 10}
`
    }

    const flags = data.flags?.length > 0 
      ? `\n*Flags:*\n${data.flags.map(f => `• ${f}`).join('\n')}\n` 
      : ''

    const response = `
🛡️ *${name}* ${token}

${formatGrade(grade, score)}

${recommendation}
${breakdown}${flags}
📊 Source: ${source}
🔗 [View on Spawn](${API_URL}/agent/${address})
`

    await bot.editMessageText(response, {
      chat_id: chatId,
      message_id: loadingMsg.message_id,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    })

  } catch (error) {
    console.error('Check error:', error)
    await bot.editMessageText(`❌ Failed to check reputation. Try again later.`, {
      chat_id: chatId,
      message_id: loadingMsg.message_id
    })
  }
})

// /top command
bot.onText(/\/top/, async (msg) => {
  const chatId = msg.chat.id

  try {
    const res = await fetch(`${API_URL}/api/agents`)
    const data = await res.json()

    const top10 = data.agents
      .filter(a => a.status === 'verified')
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    let response = '🏆 *Top 10 Verified Agents*\n\n'
    
    top10.forEach((agent, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`
      response += `${medal} *${agent.name}* ${agent.token}\n`
      response += `   ${getScoreEmoji(agent.score)} ${agent.score}/100 • ${agent.vouched} ETH\n\n`
    })

    response += `\n📊 ${data.verifiedCount} verified agents on Spawn`

    bot.sendMessage(chatId, response, { parse_mode: 'Markdown' })

  } catch (error) {
    console.error('Top error:', error)
    bot.sendMessage(chatId, '❌ Failed to fetch top agents. Try again later.')
  }
})

// /stats command
bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id

  try {
    const res = await fetch(`${API_URL}/api/agents`)
    const data = await res.json()

    const totalAgents = data.agents.length
    const verified = data.verifiedCount
    const totalVouched = data.agents.reduce((sum, a) => sum + a.vouched, 0)
    
    const categories = {}
    data.agents.forEach(a => {
      categories[a.category] = (categories[a.category] || 0) + 1
    })

    const response = `
📊 *Spawn Statistics*

*Agents:*
├ Total Indexed: ${totalAgents}
├ Verified: ${verified}
└ Pending: ${totalAgents - verified}

*Trust Value:*
└ ${totalVouched.toFixed(1)} ETH (~$${(totalVouched * 2800 / 1000000).toFixed(1)}M)

*Categories:*
${Object.entries(categories).map(([k, v]) => `├ ${k}: ${v}`).join('\n')}

🔗 ${API_URL}
`

    bot.sendMessage(chatId, response, { parse_mode: 'Markdown' })

  } catch (error) {
    console.error('Stats error:', error)
    bot.sendMessage(chatId, '❌ Failed to fetch stats. Try again later.')
  }
})

// Handle direct contract address (without /check)
bot.on('message', async (msg) => {
  const text = msg.text?.trim()
  
  // Skip commands
  if (!text || text.startsWith('/')) return
  
  // Check if it's an address
  if (/^0x[a-fA-F0-9]{40}$/.test(text)) {
    // Trigger check
    bot.emit('text', msg, [null, text])
  }
})

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message)
})

console.log(`🚀 Bot connected to ${API_URL}`)
