import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { randomBytes } from 'crypto'

async function sendViaXmtp(toAddress: string, message: string): Promise<boolean> {
  const privateKey = process.env.SPAWN_XMTP_PRIVATE_KEY
  if (!privateKey) return false
  try {
    const { Wallet } = await import('ethers')
    const { Client } = await import('@xmtp/xmtp-js')
    const wallet = new Wallet(privateKey)
    const xmtp = await Client.create(wallet, { env: 'production' })
    const canMessage = await xmtp.canMessage(toAddress)
    if (!canMessage) return false
    const conversation = await xmtp.conversations.newConversation(toAddress)
    await conversation.send(message)
    return true
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const { walletAddress, email } = body

  // Validate: need either a valid wallet address or email
  const isWallet = walletAddress && /^0x[a-fA-F0-9]{40}$/.test(walletAddress.trim())
  const isEmail = email && email.includes('@') && email.includes('.')

  if (!isWallet && !isEmail) {
    return NextResponse.json({ error: 'Provide a wallet address (0x...) or email' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  }

  const identifier = isWallet ? walletAddress.trim().toLowerCase() : email.trim().toLowerCase()
  const identifierField = isWallet ? 'wallet_address' : 'email'

  // Check if already has a key
  const { data: existing } = await supabaseAdmin
    .from('api_keys')
    .select('api_key')
    .eq(identifierField, identifier)
    .single()

  if (existing) {
    return NextResponse.json({ key: existing.api_key, existing: true, xmtpSent: false })
  }

  // Generate key
  const key = 'spwn_' + randomBytes(20).toString('hex')

  const { error } = await supabaseAdmin.from('api_keys').insert({
    wallet_address: isWallet ? identifier : null,
    email: isEmail ? identifier : null,
    api_key: key,
    tier: 'free',
    calls_today: 0,
    calls_limit: 500,
    created_at: new Date().toISOString(),
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const xmtpMessage = `Your Spawn API key is ready.

Key: ${key}

Free tier: 500 calls/day
Usage: GET https://agentspawn.xyz/api/reputation?address=0x...
Header: X-API-Key: your-key

Upgrade to Pro ($19/month) at agentspawn.xyz/app

— Spawn`

  // Send via XMTP if wallet was provided
  let xmtpSent = false
  if (isWallet) {
    xmtpSent = await sendViaXmtp(walletAddress.trim(), xmtpMessage)
  }

  return NextResponse.json({ key, existing: false, xmtpSent, method: isWallet ? 'wallet' : 'email' })
}
