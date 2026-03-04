import { NextResponse } from 'next/server'
import { agents } from '@/lib/agents-data'
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const TEE_VERIFIER_URL = process.env.TEE_VERIFIER_URL || 'http://35.230.48.129:3001'
const BASESCAN_KEY = process.env.BASESCAN_API_KEY || ''
const BANKR_KEY = process.env.BANKR_API_KEY || ''
const ETHOS_API = 'https://api.ethos.network/api/v2'

// ── Ethos reputation ──────────────────────────────────────────────
async function getEthosScore(address: string) {
  try {
    const res = await fetch(`${ETHOS_API}/score/address?address=${address}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

function ethosToSpawnScore(ethosScore: number) {
  if (ethosScore >= 2240) return { score: 10, detail: `Exemplary (${ethosScore})` }
  if (ethosScore >= 1680) return { score: 8, detail: `Reputable (${ethosScore})` }
  if (ethosScore >= 1120) return { score: 5, detail: `Neutral (${ethosScore})` }
  if (ethosScore >= 560)  return { score: 2, detail: `Suspicious (${ethosScore})` }
  return { score: 0, detail: `Untrusted (${ethosScore})` }
}

// ── BaseScan helpers ──────────────────────────────────────────────
async function getContractInfo(address: string) {
  try {
    const [creation, holders] = await Promise.all([
      fetch(`https://api.basescan.org/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${BASESCAN_KEY}`, { signal: AbortSignal.timeout(6000) })
        .then(r => r.json()).catch(() => null),
      fetch(`https://api.basescan.org/api?module=token&action=tokenholdercount&contractaddress=${address}&apikey=${BASESCAN_KEY}`, { signal: AbortSignal.timeout(6000) })
        .then(r => r.json()).catch(() => null),
    ])

    const deployedAt = creation?.result?.[0]?.timestamp
      ? new Date(parseInt(creation.result[0].timestamp) * 1000)
      : null
    const deployer = creation?.result?.[0]?.contractCreator || null
    const holderCount = parseInt(holders?.result || '0') || 0
    const ageInDays = deployedAt ? (Date.now() - deployedAt.getTime()) / 86400000 : 0

    return { deployedAt, deployer, holderCount, ageInDays }
  } catch { return { deployedAt: null, deployer: null, holderCount: 0, ageInDays: 0 } }
}

// ── DexScreener helper ────────────────────────────────────────────
async function getDexData(address: string) {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`, {
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const pairs = (data.pairs || []).filter((p: any) => p.chainId === 'base')
    if (!pairs.length) return null

    const best = pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0]
    return {
      name: best.baseToken?.name || null,
      symbol: best.baseToken?.symbol || null,
      liquidity: best.liquidity?.usd || 0,
      volume24h: best.volume?.h24 || 0,
      priceChange24h: best.priceChange?.h24 || 0,
      txns24h: (best.txns?.h24?.buys || 0) + (best.txns?.h24?.sells || 0),
      pairCreatedAt: best.pairCreatedAt ? new Date(best.pairCreatedAt) : null,
    }
  } catch { return null }
}

// ── Bankr agent enrichment ────────────────────────────────────────
async function getBankrData(address: string) {
  try {
    const res = await fetch(`https://api.bankr.bot/agents/${address}`, {
      headers: { 'X-API-Key': BANKR_KEY, Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

// ── Virtuals Protocol enrichment ──────────────────────────────────
async function getVirtualsData(address: string) {
  try {
    // Search by token address
    const res = await fetch(
      `https://api.virtuals.io/api/virtuals?filters[tokenAddress]=${address}&limit=1`,
      { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return null
    const data = await res.json()
    const agent = data?.data?.[0]
    if (!agent) return null
    return {
      name: agent.name || null,
      symbol: agent.symbol || null,
      description: agent.description || agent.aidesc || null,
      imageUrl: agent.image || null,
      holderCount: agent.holderCount || 0,
      liquidityUsd: agent.liquidityUsd || 0,
      volume24h: Math.abs(agent.netVolume24h || agent.volume24h || 0),
      isVerified: agent.isVerified || false,
      top10HolderPct: agent.top10HolderPercentage || null,
      twitter: agent.socials?.TWITTER?.replace('https://twitter.com/', '').replace('https://x.com/', '').replace('@', '') || null,
    }
  } catch { return null }
}

// ── Score computation (used when TEE unavailable) ─────────────────
function computeScore(contractAge: number, holderCount: number, liquidity: number, volume24h: number, creatorScore: number) {
  // Contract age (max 20)
  let contractAgeScore = 0
  let contractAgeDetail = ''
  if (contractAge >= 90) { contractAgeScore = 20; contractAgeDetail = `${Math.floor(contractAge)}d old` }
  else if (contractAge >= 30) { contractAgeScore = 14; contractAgeDetail = `${Math.floor(contractAge)}d old` }
  else if (contractAge >= 14) { contractAgeScore = 10; contractAgeDetail = `${Math.floor(contractAge)}d old` }
  else if (contractAge >= 7)  { contractAgeScore = 5;  contractAgeDetail = `${Math.floor(contractAge)}d old` }
  else { contractAgeScore = 1; contractAgeDetail = `${Math.floor(contractAge)}d old — new contract` }

  // Liquidity (max 25)
  let liquidityScore = 0
  let liquidityDetail = ''
  if (liquidity >= 500000) { liquidityScore = 25; liquidityDetail = `$${(liquidity/1000).toFixed(0)}K` }
  else if (liquidity >= 100000) { liquidityScore = 18; liquidityDetail = `$${(liquidity/1000).toFixed(0)}K` }
  else if (liquidity >= 50000)  { liquidityScore = 13; liquidityDetail = `$${(liquidity/1000).toFixed(0)}K` }
  else if (liquidity >= 10000)  { liquidityScore = 7;  liquidityDetail = `$${(liquidity/1000).toFixed(0)}K` }
  else if (liquidity > 0)       { liquidityScore = 2;  liquidityDetail = `$${liquidity.toFixed(0)} — very low` }
  else { liquidityScore = 0; liquidityDetail = 'No liquidity found' }

  // Holders (max 15)
  let holdersScore = 0
  let holdersDetail = ''
  if (holderCount >= 1000) { holdersScore = 15; holdersDetail = `${holderCount.toLocaleString()} holders` }
  else if (holderCount >= 500) { holdersScore = 11; holdersDetail = `${holderCount} holders` }
  else if (holderCount >= 100) { holdersScore = 7;  holdersDetail = `${holderCount} holders` }
  else if (holderCount >= 10)  { holdersScore = 3;  holdersDetail = `${holderCount} holders — low distribution` }
  else { holdersScore = 0; holdersDetail = `${holderCount} holders — concentrated` }

  // LP stability (max 20) — infer from volume/liquidity ratio
  let lpScore = 0
  let lpDetail = ''
  const volLiqRatio = liquidity > 0 ? volume24h / liquidity : 0
  if (liquidity > 50000 && volLiqRatio < 2) { lpScore = 16; lpDetail = 'Stable LP ratio' }
  else if (liquidity > 10000 && volLiqRatio < 5) { lpScore = 10; lpDetail = 'Moderate LP stability' }
  else if (liquidity > 0) { lpScore = 4; lpDetail = 'High vol/liq ratio — unstable' }
  else { lpScore = 0; lpDetail = 'No LP detected' }

  // Volume (max 10)
  let volumeScore = 0
  let volumeDetail = ''
  if (volume24h >= 500000) { volumeScore = 10; volumeDetail = `$${(volume24h/1000).toFixed(0)}K 24h` }
  else if (volume24h >= 100000) { volumeScore = 8; volumeDetail = `$${(volume24h/1000).toFixed(0)}K 24h` }
  else if (volume24h >= 10000)  { volumeScore = 5; volumeDetail = `$${(volume24h/1000).toFixed(0)}K 24h` }
  else if (volume24h > 0) { volumeScore = 2; volumeDetail = `$${volume24h.toFixed(0)} 24h — low activity` }
  else { volumeScore = 0; volumeDetail = 'No volume' }

  const total = contractAgeScore + liquidityScore + holdersScore + lpScore + volumeScore + creatorScore

  return {
    score: total,
    grade: total >= 85 ? 'A' : total >= 70 ? 'B' : total >= 55 ? 'C' : total >= 40 ? 'D' : 'F',
    breakdown: {
      contractAge:       { score: contractAgeScore, max: 20, detail: contractAgeDetail },
      liquidity:         { score: liquidityScore,   max: 25, detail: liquidityDetail },
      holders:           { score: holdersScore,     max: 15, detail: holdersDetail },
      lpLocked:          { score: lpScore,          max: 20, detail: lpDetail },
      volume:            { score: volumeScore,      max: 10, detail: volumeDetail },
      creatorReputation: { score: creatorScore,     max: 10, detail: 'On-chain history' },
    },
  }
}

// ── TEE call ──────────────────────────────────────────────────────
async function getTEEReputation(address: string) {
  try {
    const res = await fetch(`${TEE_VERIFIER_URL}/reputation?address=${address}`, {
      signal: AbortSignal.timeout(10000),
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

function findKnownAgent(address: string) {
  return agents.find(a => a.contract?.toLowerCase() === address.toLowerCase())
}

// ── API key check (for authenticated builder requests) ─────────────
async function checkApiKey(key: string): Promise<{ valid: boolean; reason?: string }> {
  const { supabaseAdmin } = await import('@/lib/supabase')
  if (!supabaseAdmin) return { valid: true } // DB unavailable — allow through

  const { data } = await supabaseAdmin
    .from('api_keys')
    .select('*')
    .eq('api_key', key)
    .single()

  if (!data) return { valid: false, reason: 'invalid_key' }

  const today = new Date().toISOString().split('T')[0]
  if (data.last_reset_date !== today) {
    await supabaseAdmin
      .from('api_keys')
      .update({ calls_today: 0, last_reset_date: today })
      .eq('api_key', key)
    return { valid: true }
  }

  if (data.calls_today >= data.calls_limit) {
    return { valid: false, reason: 'rate_limit' }
  }

  await supabaseAdmin
    .from('api_keys')
    .update({ calls_today: data.calls_today + 1 })
    .eq('api_key', key)

  return { valid: true }
}

// ── Main handler ──────────────────────────────────────────────────
export async function GET(request: Request) {
  // If X-API-Key header present, validate it — invalid/rate-limited keys get 429
  const apiKey = request.headers.get('x-api-key')
  if (apiKey) {
    const keyResult = await checkApiKey(apiKey)
    if (!keyResult.valid) {
      const msg = keyResult.reason === 'rate_limit'
        ? 'Daily rate limit exceeded. Upgrade to Pro at agentspawn.xyz/app'
        : 'Invalid API key.'
      return NextResponse.json({ error: msg }, { status: 429 })
    }
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous'
  const rl = rateLimit(`reputation:${ip}`, { windowMs: 60000, max: 30 })
  if (!rl.success) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429, headers: getRateLimitHeaders(rl) })
  }

  const address = new URL(request.url).searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Missing address parameter', usage: '/api/reputation?address=0x...' }, { status: 400 })
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address format.' }, { status: 400 })
  }

  try {
    const knownAgent = findKnownAgent(address)

    // Try TEE first (golden path)
    const teeData = await getTEEReputation(address)

    if (teeData) {
      let flags = [...(teeData.flags || [])]
      let response = {
        ...teeData,
        name: knownAgent?.name || teeData.name,
        token: knownAgent?.token || teeData.token,
        source: 'tee' as const,
        verified: !!teeData.attestation,
        teeAttestation: teeData.attestation,
        spawnIndexed: !!knownAgent,
        spawnVerified: knownAgent?.status === 'verified',
      }

      if (knownAgent) {
        flags = flags.filter(f => !f.includes('Not indexed'))
        flags = knownAgent.status === 'verified'
          ? ['Verified on Spawn', ...flags]
          : ['Indexed on Spawn (pending verification)', ...flags]

        if (knownAgent.teamWallet && response.breakdown) {
          const ethosData = await getEthosScore(knownAgent.teamWallet)
          if (ethosData) {
            const er = ethosToSpawnScore(ethosData.score)
            response.breakdown.creatorReputation = { score: er.score, max: 10, detail: er.detail }
            const newTotal = Object.values(response.breakdown).reduce((s: number, b: any) => s + b.score, 0)
            response.score = newTotal
            response.grade = newTotal >= 85 ? 'A' : newTotal >= 70 ? 'B' : newTotal >= 55 ? 'C' : newTotal >= 40 ? 'D' : 'F'
          }
        }
      }

      response.flags = flags
      return NextResponse.json(response)
    }

    // ── TEE unavailable — compute score from real on-chain data ──
    const [contractInfo, dexData, bankrData, virtualsData] = await Promise.all([
      getContractInfo(address),
      getDexData(address),
      getBankrData(address),
      getVirtualsData(address),
    ])

    // Creator reputation via Ethos
    let creatorScore = 5
    let creatorDetail = 'Unknown deployer'
    if (contractInfo.deployer) {
      const ethosData = await getEthosScore(contractInfo.deployer)
      if (ethosData) {
        const er = ethosToSpawnScore(ethosData.score)
        creatorScore = er.score
        creatorDetail = er.detail
      }
    }

    // Prefer Virtuals data when available (more accurate for Virtuals-native agents)
    const effectiveLiquidity = virtualsData?.liquidityUsd || dexData?.liquidity || 0
    const effectiveHolders = virtualsData?.holderCount || contractInfo.holderCount
    const effectiveVolume = virtualsData?.volume24h || dexData?.volume24h || 0
    // Virtuals verified adds bonus to creator score
    if (virtualsData?.isVerified && creatorScore < 8) creatorScore = Math.max(creatorScore, 8)

    const scored = computeScore(
      contractInfo.ageInDays,
      effectiveHolders,
      effectiveLiquidity,
      effectiveVolume,
      creatorScore,
    )

    // Build flags
    const flags: string[] = []
    if (knownAgent?.status === 'verified') flags.push('Verified on Spawn')
    if (virtualsData?.isVerified) flags.push('Verified on Virtuals Protocol')
    if (contractInfo.ageInDays < 7) flags.push('New contract — less than 7 days old')
    if ((dexData?.liquidity || 0) < 10000) flags.push('Low liquidity — exercise caution')
    if (contractInfo.holderCount < 10) flags.push('Highly concentrated ownership')

    // Recommendation
    let recommendation = ''
    if (scored.grade === 'A') recommendation = 'Strong trust signals. Well-established contract with healthy liquidity and distribution.'
    else if (scored.grade === 'B') recommendation = 'Good signals overall. Minor gaps but generally trustworthy.'
    else if (scored.grade === 'C') recommendation = 'Mixed signals. Review the breakdown carefully before interacting.'
    else if (scored.grade === 'D') recommendation = 'Significant risk signals present. Proceed with caution.'
    else recommendation = 'High risk. Multiple negative signals detected. Do your own research.'

    return NextResponse.json({
      address,
      name: virtualsData?.name || bankrData?.name || knownAgent?.name || dexData?.name || null,
      token: virtualsData?.symbol ? `$${virtualsData.symbol}` : (bankrData?.symbol || knownAgent?.token || dexData?.symbol || null),
      description: virtualsData?.description || null,
      imageUrl: virtualsData?.imageUrl || null,
      twitter: virtualsData?.twitter || knownAgent?.twitter || null,
      source_platforms: [...(virtualsData ? ['virtuals'] : []), 'onchain'],
      score: scored.score,
      grade: scored.grade,
      breakdown: scored.breakdown,
      creator: contractInfo.deployer ? { address: contractInfo.deployer } : undefined,
      flags,
      recommendation,
      source: 'onchain',
      verified: false,
      spawnIndexed: !!knownAgent,
      spawnVerified: knownAgent?.status === 'verified',
      timestamp: new Date().toISOString(),
      _note: 'TEE verifier offline — scored from on-chain data directly',
    })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate reputation', details: String(error) }, { status: 500 })
  }
}
