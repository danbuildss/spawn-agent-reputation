import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 min timeout

const VIRTUALS_API = 'https://api.virtuals.io/api/virtuals'

function mapVirtualsToAgent(v: any) {
  const score = computeScore(v)
  const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F'

  // Extract twitter from socials
  const socials = v.socials || {}
  const twitter =
    socials.TWITTER?.replace('https://twitter.com/', '')
      .replace('https://x.com/', '')
      .replace('@', '') || null

  return {
    contract_address: (v.tokenAddress || '').toLowerCase(),
    name: v.name || 'Unknown',
    token: v.symbol ? `$${v.symbol}` : '',
    description: v.description || v.aidesc || '',
    category: mapCategory(v.category, v.role),
    twitter,
    score,
    grade,
    status: 'pending', // Spawn verified badge requires $29 payment — never auto-grant
    logo_url: v.image || null,
    vouched_eth: 0,
  }
}

function computeScore(v: any): number {
  let score = 0

  // Liquidity (0–25)
  const liq = v.liquidityUsd || 0
  if (liq >= 500000) score += 25
  else if (liq >= 100000) score += 20
  else if (liq >= 50000) score += 15
  else if (liq >= 10000) score += 8
  else if (liq >= 1000) score += 4

  // Holders (0–15)
  const holders = v.holderCount || 0
  if (holders >= 5000) score += 15
  else if (holders >= 1000) score += 12
  else if (holders >= 500) score += 9
  else if (holders >= 100) score += 6
  else if (holders >= 20) score += 3

  // Age / launchedAt (0–20)
  if (v.lpCreatedAt || v.launchedAt || v.createdAt) {
    const created = new Date(v.lpCreatedAt || v.launchedAt || v.createdAt).getTime()
    const ageDays = (Date.now() - created) / (1000 * 60 * 60 * 24)
    if (ageDays >= 180) score += 20
    else if (ageDays >= 90) score += 16
    else if (ageDays >= 30) score += 12
    else if (ageDays >= 7) score += 8
    else if (ageDays >= 1) score += 4
  }

  // Volume 24h (0–10)
  const vol = Math.abs(v.netVolume24h || v.volume24h || 0)
  if (vol >= 500000) score += 10
  else if (vol >= 100000) score += 8
  else if (vol >= 10000) score += 5
  else if (vol >= 1000) score += 2

  // Top 10 holder concentration (0–15): lower = better
  const top10 = v.top10HolderPercentage || 100
  if (top10 <= 20) score += 15
  else if (top10 <= 35) score += 11
  else if (top10 <= 50) score += 7
  else if (top10 <= 70) score += 3

  // Verified on Virtuals (0–10)
  if (v.isVerified) score += 10
  else if (v.isDevCommitted) score += 5

  // Has socials (0–5)
  const s = v.socials || {}
  const hasSocials = s.TWITTER || s.TELEGRAM || s.DISCORD || s.WEBSITE
  if (hasSocials) score += 5

  return Math.min(Math.max(score, 0), 100)
}

function mapCategory(category: string, role: string): string {
  const c = (category || '').toUpperCase()
  const r = (role || '').toUpperCase()
  if (c.includes('DEFI') || r.includes('DEFI') || r.includes('TRADE') || r.includes('YIELD')) return 'DeFi'
  if (
    c.includes('SOCIAL') ||
    r.includes('SOCIAL') ||
    r.includes('ENTERTAINMENT') ||
    r.includes('INFLUENC')
  )
    return 'Social'
  if (
    c.includes('ANALYTICS') ||
    r.includes('ANALYTIC') ||
    r.includes('DATA') ||
    r.includes('RESEARCH')
  )
    return 'Analytics'
  if (c.includes('GAMING') || r.includes('GAMING') || r.includes('GAME')) return 'Gaming'
  if (c.includes('SECURITY') || r.includes('SECURITY')) return 'Security'
  if (c.includes('TRADING') || r.includes('TRADING') || r.includes('ALPHA')) return 'Trading'
  return 'Infrastructure'
}

export async function GET(req: Request) {
  // Simple auth: require ?secret=spawn2026
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  if (secret !== 'spawn2026') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!supabaseAdmin) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  let synced = 0
  let page = 1
  const pageSize = 100
  const maxPages = 200 // up to 20,000 agents

  const startPage = parseInt(url.searchParams.get('page') || '1')
  const endPage = parseInt(url.searchParams.get('endPage') || String(maxPages))

  for (page = startPage; page <= endPage; page++) {
    try {
      const res = await fetch(
        `${VIRTUALS_API}?limit=${pageSize}&page=${page}&filters[status]=AVAILABLE`,
        {
          headers: { Accept: 'application/json' },
          next: { revalidate: 0 },
        }
      )
      if (!res.ok) break
      const data = await res.json()
      const agents = data.data || []
      if (!agents.length) break

      // Filter: must have a token address
      const valid = agents.filter(
        (a: any) => a.tokenAddress && a.tokenAddress.startsWith('0x')
      )

      // Map to DB shape
      const rows = valid
        .map(mapVirtualsToAgent)
        .filter((r: any) => r.contract_address && r.contract_address !== '0x')

      if (!rows.length) continue

      // Upsert in batches of 50
      for (let i = 0; i < rows.length; i += 50) {
        const batch = rows.slice(i, i + 50)
        const { error } = await supabaseAdmin
          .from('agents')
          .upsert(batch, { onConflict: 'contract_address' })
        if (!error) synced += batch.length
      }

      // Small delay to be respectful
      await new Promise(r => setTimeout(r, 200))
    } catch (err) {
      console.error(`Page ${page} error:`, err)
      break
    }
  }

  return NextResponse.json({ synced, pages: page - startPage, source: 'virtuals' })
}
