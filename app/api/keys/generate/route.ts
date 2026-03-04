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
  const { walletAddress } = await req.json()

  if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress.trim())) {
    return NextResponse.json({ error: 'Valid wallet address required (0x...)' }, { status: 400 })
  }

  const address = walletAddress.trim().toLowerCase()

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  }

  // Check if wallet already has a key
  const { data: existing } = await supabaseAdmin
    .from('api_keys')
    .select('api_key')
    .eq('wallet_address', address)
    .single()

  if (existing) {
    return NextResponse.json({ key: existing.api_key, existing: true, xmtpSent: false })
  }

  // Generate key: spwn_live_xxxxx
  const key = 'spwn_' + randomBytes(20).toString('hex')

  const { error } = await supabaseAdmin.from('api_keys').insert({
    wallet_address: address,
    api_key: key,
    tier: 'free',
    calls_today: 0,
    calls_limit: 500,
    created_at: new Date().toISOString(),
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send via XMTP
  const xmtpMessage = `Your Spawn API key is ready.

Key: ${key}

Free tier: 500 calls/day
Usage: GET https://agentspawn.xyz/api/reputation?address=0x...
Header: X-API-Key: your-key

Upgrade to Pro ($19/month) at agentspawn.xyz/app

— Spawn`

  const xmtpSent = await sendViaXmtp(walletAddress.trim(), xmtpMessage)

  return NextResponse.json({ key, existing: false, xmtpSent })
}
