'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// ── Types ─────────────────────────────────────────────────────────
type TabKey = 'directory' | 'api' | 'verify' | 'methodology'
type FilterType = 'all' | 'verified' | 'a' | 'f'
type VerifyStep = 1 | 2 | 3 | 'done'

// ── Constants ─────────────────────────────────────────────────────
const GRADE_COLORS: Record<string, string> = {
  A: 'rgb(0,214,143)', B: '#4D8EFF', C: 'rgb(255,184,0)', D: '#FF8C00', F: 'rgb(255,59,59)',
}
const PAYMENT_ADDRESS = '0xdbefd1adb7af527a63037cc6ab14ff545c407b27'
const PAYMENT_AMOUNT = '$29 USDC'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'directory', label: 'Directory' },
  { key: 'api', label: 'API' },
  { key: 'verify', label: 'Verify' },
  { key: 'methodology', label: 'Methodology' },
]

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'verified', label: 'Verified' },
  { key: 'a', label: 'Grade A' },
  { key: 'f', label: 'Grade F' },
]

// ── Helpers ───────────────────────────────────────────────────────
function getGrade(score: number): string {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

// ── AgentAvatar ───────────────────────────────────────────────────
function AgentAvatar({ name, twitter, logoUrl, size = 40 }: { name: string; twitter?: string; logoUrl?: string; size?: number }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [twitterFailed, setTwitterFailed] = useState(false)
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['#0052FF', '#4D8EFF', 'rgb(0,214,143)', 'rgb(255,184,0)', '#A855F7']
  const colorIdx = name.charCodeAt(0) % colors.length
  const bg = colors[colorIdx]

  const imgSrc = !imgFailed && logoUrl ? logoUrl
    : !twitterFailed && twitter ? `https://unavatar.io/twitter/${twitter.replace('@', '')}`
    : null

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={name}
        width={size} height={size}
        onError={() => {
          if (!imgFailed && logoUrl) setImgFailed(true)
          else setTwitterFailed(true)
        }}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    )
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 700, color: '#fff', flexShrink: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
      {initials}
    </div>
  )
}

// ── AgentCard ─────────────────────────────────────────────────────
function AgentCard({ agent, onClick }: { agent: any; onClick: () => void }) {
  const score = agent.score || agent.trust_score || 0
  const grade = agent.grade || getGrade(score)
  const color = GRADE_COLORS[grade] || GRADE_COLORS['F']
  const isVerified = agent.status === 'verified'

  return (
    <div
      onClick={onClick}
      style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s, transform 0.15s' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = `${color}40`; el.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgb(28,28,28)'; el.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <AgentAvatar name={agent.name || 'Agent'} twitter={agent.twitter} logoUrl={agent.logo_url} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgb(240,240,240)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name || 'Unknown Agent'}</span>
            {isVerified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="12" fill="rgb(0,214,143)" fillOpacity="0.15"/>
                <path d="M7 13l3 3 7-7" stroke="rgb(0,214,143)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(60,60,70)', marginTop: 1 }}>{agent.token || ''}</div>
        </div>
        <div style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 8, padding: '6px 10px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{grade}</div>
          <div style={{ fontSize: 10, color: 'rgb(100,100,110)', marginTop: 2 }}>{score}/100</div>
        </div>
      </div>
      <div style={{ background: 'rgb(8,8,8)', borderRadius: 4, height: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 4 }} />
      </div>
      {agent.category && (
        <div style={{ marginTop: 10, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgb(60,60,70)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{agent.category}</div>
      )}
    </div>
  )
}

// ── Tab: Directory ────────────────────────────────────────────────
function DirectoryTab() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<any>(null)
  const [checkError, setCheckError] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(d => setAgents(d.agents || d || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const isAddress = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s.trim())

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    if (!q || !isAddress(q)) return
    setChecking(true)
    setCheckResult(null)
    setCheckError('')
    try {
      const res = await fetch(`/api/reputation?address=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.error) setCheckError(data.error)
      else setCheckResult(data)
    } catch { setCheckError('Failed to fetch score.') }
    setChecking(false)
  }, [search])

  const filtered = agents.filter(a => {
    const score = a.score || a.trust_score || 0
    const grade = a.grade || getGrade(score)
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'verified' ? a.status === 'verified' :
      filter === 'a' ? grade === 'A' :
      filter === 'f' ? grade === 'F' : true
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || isAddress(q) ? true :
      (a.name || '').toLowerCase().includes(q) ||
      (a.token || '').toLowerCase().includes(q) ||
      (a.category || '').toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  const checkGrade = checkResult ? getGrade(checkResult.score || checkResult.trustScore || 0) : null
  const checkColor = checkGrade ? GRADE_COLORS[checkGrade] : '#4D8EFF'

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Score Check</div>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 6px' }}>Check any AI agent</h2>
        <p style={{ fontSize: 13, color: 'rgb(80,80,90)', margin: '0 0 18px' }}>Paste a contract address for an instant Spawn score, or search the directory below.</p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, maxWidth: 540 }}>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); if (!e.target.value) { setCheckResult(null); setCheckError('') } }}
            placeholder="0x... address or agent name"
            style={{ flex: 1, background: 'rgb(12,12,12)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '11px 16px', fontSize: 14, color: 'rgb(220,220,220)', outline: 'none', fontFamily: 'JetBrains Mono, monospace' }}
          />
          <button type="submit" disabled={checking}
            style={{ background: 'rgb(0,82,255)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: checking ? 'not-allowed' : 'pointer', opacity: checking ? 0.6 : 1, whiteSpace: 'nowrap' }}>
            {checking ? 'Checking...' : 'Get Score'}
          </button>
        </form>
      </div>

      {checkError && (
        <div style={{ maxWidth: 540, marginBottom: 28, background: 'rgba(255,59,59,0.06)', border: '1px solid rgba(255,59,59,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#FF8080' }}>{checkError}</div>
      )}

      {checkResult && checkGrade && (
        <div style={{ maxWidth: 540, marginBottom: 40, background: 'rgb(12,12,12)', border: `1px solid ${checkColor}25`, borderRadius: 14, padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <AgentAvatar name={checkResult.name || 'Agent'} twitter={checkResult.twitter} logoUrl={checkResult.logo_url} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: 'rgb(240,240,240)' }}>{checkResult.name || 'Unknown Agent'}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(60,60,70)', marginTop: 2 }}>{search.slice(0, 8)}...{search.slice(-6)}</div>
            </div>
            <div style={{ background: `${checkColor}12`, border: `1px solid ${checkColor}30`, borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 40, fontWeight: 900, color: checkColor, lineHeight: 1 }}>{checkGrade}</div>
              <div style={{ fontSize: 12, color: 'rgb(100,100,110)', marginTop: 2 }}>{checkResult.score || 0}/100</div>
            </div>
          </div>
          <div style={{ background: 'rgb(20,20,20)', borderRadius: 4, height: 4, marginBottom: 16 }}>
            <div style={{ height: '100%', width: `${checkResult.score || 0}%`, background: checkColor, borderRadius: 4, transition: 'width 0.6s ease' }} />
          </div>
          {checkResult.recommendation && (
            <p style={{ fontSize: 13, color: 'rgb(120,120,130)', margin: '0 0 16px', lineHeight: 1.5 }}>{checkResult.recommendation}</p>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => router.push(`/agent/${search.trim()}`)}
              style={{ flex: 1, background: `${checkColor}12`, border: `1px solid ${checkColor}25`, color: checkColor, borderRadius: 7, padding: '9px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Full Report
            </button>
            <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/agent/${search.trim()}`)}
              style={{ background: 'rgb(18,18,18)', border: '1px solid rgb(28,28,28)', color: 'rgb(100,100,110)', borderRadius: 7, padding: '9px 16px', fontSize: 13, cursor: 'pointer' }}>
              Share
            </button>
          </div>
        </div>
      )}

      {/* Directory header + filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgb(240,240,240)' }}>Directory</div>
          <div style={{ fontSize: 12, color: 'rgb(60,60,70)', marginTop: 2 }}>{filtered.length} agents</div>
        </div>
        <div style={{ display: 'flex', background: 'rgb(12,12,12)', border: '1px solid rgb(22,22,22)', borderRadius: 10, padding: 3, gap: 2 }}>
          {FILTERS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              style={{ padding: '6px 14px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: filter === key ? 'rgb(0,82,255)' : 'transparent', color: filter === key ? '#fff' : 'rgb(80,80,90)', boxShadow: filter === key ? '0 1px 6px rgba(0,82,255,0.4)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'rgb(60,60,70)', padding: '80px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>Loading agents...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'rgb(60,60,70)', padding: '80px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>No agents found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 10 }}>
          {filtered.map((agent, i) => (
            <AgentCard key={agent.id || i} agent={agent}
              onClick={() => router.push(`/agent/${agent.contract_address || agent.address}`)} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tab: API ──────────────────────────────────────────────────────
function ApiTab() {
  const [inputMode, setInputMode] = useState<'wallet' | 'email'>('wallet')
  const [walletAddress, setWalletAddress] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ key: string; existing: boolean; xmtpSent: boolean; method?: string } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  const codeExample = `GET https://agentspawn.xyz/api/reputation?address=0x...
Headers: X-API-Key: your-key-here`

  const responseExample = `{
  "address": "0x...",
  "name": "Agent Name",
  "score": 74,
  "grade": "B",
  "breakdown": {
    "contractAge": { "score": 14, "max": 20 },
    "liquidity":   { "score": 18, "max": 25 },
    "holders":     { "score": 11, "max": 15 },
    "lpLocked":    { "score": 10, "max": 20 },
    "volume":      { "score": 8,  "max": 10 },
    "creatorReputation": { "score": 8, "max": 10 }
  },
  "flags": [],
  "recommendation": "Good signals overall.",
  "source": "tee",
  "verified": true
}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (inputMode === 'wallet') {
      const addr = walletAddress.trim()
      if (!addr || !/^0x[a-fA-F0-9]{40}$/.test(addr)) {
        setError('Enter a valid Ethereum wallet address (0x...)')
        return
      }
    } else {
      const em = email.trim()
      if (!em || !em.includes('@') || !em.includes('.')) {
        setError('Enter a valid email address')
        return
      }
    }
    setLoading(true)
    setResult(null)
    try {
      const body = inputMode === 'wallet'
        ? { walletAddress: walletAddress.trim() }
        : { email: email.trim() }
      const res = await fetch('/api/keys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return }
      setResult(data)
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  const copyKey = () => {
    if (result?.key) navigator.clipboard.writeText(result.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Developer API</div>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 8px' }}>Integrate Spawn scores into your app</h2>
        <p style={{ fontSize: 13, color: 'rgb(80,80,90)', margin: 0, lineHeight: 1.6 }}>Query reputation scores programmatically. Free tier for builders, Pro for production.</p>
      </div>

      {/* Pricing cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 40 }}>
        <div style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,214,143)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Free</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'rgb(240,240,240)', marginBottom: 4 }}>$0</div>
          <div style={{ fontSize: 12, color: 'rgb(80,80,90)', marginBottom: 14 }}>No card required</div>
          <div style={{ fontSize: 13, color: 'rgb(160,160,170)', lineHeight: 1.7 }}>
            500 calls / day<br />
            Full score + breakdown<br />
            TEE attestation data
          </div>
        </div>
        <div style={{ background: 'rgb(14,14,14)', border: '1px solid rgba(0,82,255,0.35)', borderRadius: 12, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, rgb(0,82,255), #4D8EFF)' }} />
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#4D8EFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Pro</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'rgb(240,240,240)', marginBottom: 4 }}>$19<span style={{ fontSize: 14, fontWeight: 400, color: 'rgb(80,80,90)' }}>/mo</span></div>
          <div style={{ fontSize: 12, color: 'rgb(80,80,90)', marginBottom: 14 }}>Priority support</div>
          <div style={{ fontSize: 13, color: 'rgb(160,160,170)', lineHeight: 1.7 }}>
            10,000 calls / day<br />
            Webhook alerts<br />
            Bulk lookups
          </div>
        </div>
      </div>

      {/* Key generation form */}
      {!result ? (
        <div style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 14, padding: '28px 28px', marginBottom: 40 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgb(240,240,240)', marginBottom: 4 }}>Get your free API key</div>
          <p style={{ fontSize: 13, color: 'rgb(80,80,90)', margin: '0 0 18px', lineHeight: 1.5 }}>Wallet address: key delivered via XMTP. Email: key shown on screen.</p>
          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'rgb(8,8,8)', border: '1px solid rgb(24,24,24)', borderRadius: 8, padding: 3, gap: 3, marginBottom: 16, width: 'fit-content' }}>
            {(['wallet', 'email'] as const).map(mode => (
              <button key={mode} onClick={() => { setInputMode(mode); setError('') }}
                style={{ padding: '6px 16px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: inputMode === mode ? 'rgb(0,82,255)' : 'transparent', color: inputMode === mode ? '#fff' : 'rgb(80,80,90)', transition: 'all 0.15s' }}>
                {mode === 'wallet' ? 'Wallet (XMTP)' : 'Email'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgb(120,120,130)', marginBottom: 6 }}>
              {inputMode === 'wallet' ? 'Your wallet address' : 'Your email address'}
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {inputMode === 'wallet' ? (
                <input type="text" value={walletAddress} onChange={e => setWalletAddress(e.target.value)}
                  placeholder="0x..." autoComplete="off"
                  style={{ flex: 1, background: 'rgb(8,8,8)', border: '1px solid rgb(32,32,32)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'rgb(220,220,220)', outline: 'none', fontFamily: 'JetBrains Mono, monospace' }} />
              ) : (
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ flex: 1, background: 'rgb(8,8,8)', border: '1px solid rgb(32,32,32)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'rgb(220,220,220)', outline: 'none', fontFamily: 'Space Grotesk, sans-serif' }} />
              )}
              <button type="submit" disabled={loading}
                style={{ background: 'rgb(0,82,255)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                {loading ? 'Generating...' : 'Get Free API Key'}
              </button>
            </div>
            {error && <p style={{ color: '#FF8080', fontSize: 13, margin: '10px 0 0' }}>{error}</p>}
          </form>
        </div>
      ) : (
        <div style={{ marginBottom: 40 }}>
          {result.xmtpSent ? (
            <div style={{ background: 'rgba(0,214,143,0.06)', border: '1px solid rgba(0,214,143,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 13, color: 'rgb(0,214,143)', lineHeight: 1.5 }}>
              Key sent to your wallet via XMTP and shown below.
            </div>
          ) : result.existing ? (
            <div style={{ background: 'rgba(77,142,255,0.06)', border: '1px solid rgba(77,142,255,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 13, color: '#4D8EFF', lineHeight: 1.5 }}>
              You already have a key — it's shown below.
            </div>
          ) : (
            <div style={{ background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 13, color: 'rgb(255,184,0)', lineHeight: 1.5 }}>
              {result.method === 'email' ? 'Key generated — save it now, it will not be shown again.' : 'Your wallet is not on XMTP yet — save your key now, it will not be shown again.'}
            </div>
          )}
          <div style={{ background: 'rgb(12,12,12)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgb(100,100,110)', marginBottom: 10 }}>Your API Key</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgb(8,8,8)', borderRadius: 8, padding: '12px 14px' }}>
              <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'rgb(0,214,143)', flex: 1, wordBreak: 'break-all' }}>{result.key}</code>
              <button onClick={copyKey}
                style={{ background: 'none', border: '1px solid rgb(40,40,40)', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: copied ? 'rgb(0,214,143)' : 'rgb(120,120,130)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <button onClick={() => { setResult(null); setWalletAddress('') }}
            style={{ marginTop: 12, background: 'transparent', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: 'rgb(80,80,90)', cursor: 'pointer' }}>
            Generate another key
          </button>
        </div>
      )}

      {/* Code example */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgb(200,200,210)', marginBottom: 12 }}>Request example</div>
        <div style={{ background: 'rgb(10,10,10)', border: '1px solid rgb(28,28,28)', borderRadius: 10, padding: '18px 20px', position: 'relative' }}>
          <button onClick={copyCode}
            style={{ position: 'absolute', top: 12, right: 12, background: 'rgb(22,22,22)', border: '1px solid rgb(36,36,36)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: codeCopied ? 'rgb(0,214,143)' : 'rgb(100,100,110)', cursor: 'pointer' }}>
            {codeCopied ? 'Copied' : 'Copy'}
          </button>
          <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgb(180,180,190)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{codeExample}</pre>
        </div>
      </div>

      {/* Response example */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgb(200,200,210)', marginBottom: 12 }}>Response</div>
        <div style={{ background: 'rgb(10,10,10)', border: '1px solid rgb(28,28,28)', borderRadius: 10, padding: '18px 20px', overflow: 'auto' }}>
          <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgb(140,140,160)', margin: 0, lineHeight: 1.6 }}>{responseExample}</pre>
        </div>
      </div>

      {/* Rate limits */}
      <div style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '20px 22px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgb(200,200,210)', marginBottom: 14 }}>Rate limits</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { tier: 'No key (public)', limit: '30 req/min (IP-based)', color: 'rgb(80,80,90)' },
            { tier: 'Free key', limit: '500 calls/day', color: 'rgb(0,214,143)' },
            { tier: 'Pro key', limit: '10,000 calls/day + webhooks', color: '#4D8EFF' },
          ].map(({ tier, limit, color }) => (
            <div key={tier} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgb(22,22,22)' }}>
              <span style={{ fontSize: 13, color: 'rgb(160,160,170)' }}>{tier}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color }}>{limit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Tab: Verify ───────────────────────────────────────────────────
function VerifyTab() {
  const [step, setStep] = useState<VerifyStep>(1)
  const [form, setForm] = useState({ name: '', address: '', website: '', twitter: '', description: '' })
  const [txHash, setTxHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(PAYMENT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!txHash.trim()) { setError('Please paste your transaction hash'); return }
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash.trim())) { setError('Invalid tx hash format'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractAddress: form.address,
          name: form.name,
          website: form.website,
          twitter: form.twitter,
          applicantTwitter: form.twitter,
          description: form.description,
          paymentTx: txHash.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Submission failed'); setSubmitting(false); return }
      setStep('done')
    } catch { setError('Network error. Please try again.') }
    setSubmitting(false)
  }

  const Steps = ({ current }: { current: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
      {[1, 2, 3].map(s => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: s <= current ? 'rgb(0,82,255)' : 'rgb(28,28,28)', border: `1px solid ${s <= current ? 'rgb(0,82,255)' : 'rgb(40,40,40)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: s <= current ? '#fff' : 'rgb(70,70,80)' }}>
            {s < current ? '✓' : s}
          </div>
          <span style={{ fontSize: 12, color: s === current ? 'rgb(240,240,240)' : 'rgb(70,70,80)', fontWeight: s === current ? 600 : 400 }}>
            {s === 1 ? 'Details' : s === 2 ? 'Payment' : 'Confirm'}
          </span>
          {s < 3 && <div style={{ width: 24, height: 1, background: 'rgb(28,28,28)' }} />}
        </div>
      ))}
    </div>
  )

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Verification</div>
      <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 28px' }}>Verify Your Agent</h2>

      {step === 'done' ? (
        <div style={{ background: 'rgba(0,214,143,0.06)', border: '1px solid rgba(0,214,143,0.2)', borderRadius: 14, padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,214,143,0.15)', border: '1px solid rgba(0,214,143,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="rgb(0,214,143)" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(240,240,240)', marginBottom: 10 }}>Submitted</div>
          <p style={{ fontSize: 14, color: 'rgb(120,120,130)', lineHeight: 1.6, margin: '0 0 24px' }}>Payment verified and application received. Review takes up to 48 hours. We will DM you on Twitter when approved.</p>
          <button onClick={() => { setStep(1); setForm({ name: '', address: '', website: '', twitter: '', description: '' }); setTxHash('') }}
            style={{ background: 'rgb(0,82,255)', color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 24px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            Submit Another
          </button>
        </div>
      ) : (
        <>
          <Steps current={typeof step === 'number' ? step : 3} />

          {step === 1 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {([
                  { key: 'name', label: 'Agent Name', placeholder: 'Your AI agent name' },
                  { key: 'address', label: 'Contract Address', placeholder: '0x...' },
                  { key: 'website', label: 'Website', placeholder: 'https://' },
                  { key: 'twitter', label: 'Twitter / X Handle', placeholder: '@handle' },
                ] as const).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgb(120,120,130)', marginBottom: 6 }}>{label}</label>
                    <input type="text" placeholder={placeholder} value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ width: '100%', background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'rgb(240,240,240)', outline: 'none', fontFamily: 'JetBrains Mono, monospace', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgb(120,120,130)', marginBottom: 6 }}>Description</label>
                  <textarea placeholder="What does your agent do?" value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    style={{ width: '100%', background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'rgb(240,240,240)', outline: 'none', resize: 'vertical', minHeight: 90, fontFamily: 'Space Grotesk, sans-serif', boxSizing: 'border-box' }} />
                </div>
              </div>
              <button onClick={() => { if (!form.name || !form.address) { setError('Name and contract address are required'); return } setError(''); setStep(2) }}
                style={{ marginTop: 20, width: '100%', background: 'rgb(0,82,255)', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Continue to Payment
              </button>
              {error && <p style={{ color: '#FF8080', fontSize: 13, marginTop: 10 }}>{error}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ background: 'rgb(14,14,14)', border: '1px solid rgba(0,82,255,0.25)', borderRadius: 12, padding: '24px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgb(120,120,130)', marginBottom: 4 }}>Send exactly</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'rgb(0,214,143)', marginBottom: 20 }}>{PAYMENT_AMOUNT}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgb(120,120,130)', marginBottom: 8 }}>USDC on Base network to:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgb(8,8,8)', borderRadius: 8, padding: '10px 12px' }}>
                  <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgb(240,240,240)', flex: 1, wordBreak: 'break-all' }}>{PAYMENT_ADDRESS}</code>
                  <button onClick={copyAddress} style={{ background: 'none', border: '1px solid rgb(28,28,28)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: copied ? 'rgb(0,214,143)' : 'rgb(120,120,130)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.2)', borderRadius: 8, fontSize: 12, color: 'rgb(255,184,0)', lineHeight: 1.6 }}>
                  Make sure you are on the Base network. USDC only.
                </div>
              </div>
              <button onClick={() => setStep(3)} style={{ marginTop: 16, width: '100%', background: 'rgb(0,82,255)', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                I have sent the payment
              </button>
              <button onClick={() => setStep(1)} style={{ marginTop: 8, width: '100%', background: 'transparent', color: 'rgb(120,120,130)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '10px', fontSize: 13, cursor: 'pointer' }}>
                Back
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <p style={{ fontSize: 14, color: 'rgb(120,120,130)', marginBottom: 20, lineHeight: 1.6 }}>Paste your transaction hash from the USDC transfer. We verify it on-chain before reviewing your application.</p>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgb(120,120,130)', marginBottom: 6 }}>Transaction Hash</label>
                <input type="text" placeholder="0x..." value={txHash} onChange={e => setTxHash(e.target.value)}
                  style={{ width: '100%', background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'rgb(240,240,240)', outline: 'none', fontFamily: 'JetBrains Mono, monospace', boxSizing: 'border-box' }} />
                <a href={`https://basescan.org/address/${PAYMENT_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 6, fontSize: 12, color: 'rgb(70,70,80)', textDecoration: 'none' }}>Confirm your tx on Basescan →</a>
              </div>
              {error && <p style={{ color: '#FF8080', fontSize: 13, marginTop: 10 }}>{error}</p>}
              <button onClick={handleSubmit} disabled={submitting}
                style={{ marginTop: 20, width: '100%', background: 'rgb(0,82,255)', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Verifying payment...' : 'Submit Application'}
              </button>
              <button onClick={() => setStep(2)} style={{ marginTop: 8, width: '100%', background: 'transparent', color: 'rgb(120,120,130)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '10px', fontSize: 13, cursor: 'pointer' }}>
                Back
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Tab: Methodology ──────────────────────────────────────────────
function MethodologyTab() {
  const factors = [
    { name: 'Contract Age', points: 20, desc: 'Older contracts = more stable' },
    { name: 'Liquidity Depth', points: 25, desc: 'Higher liquidity = harder to manipulate' },
    { name: 'Holder Distribution', points: 15, desc: 'More unique holders = decentralized' },
    { name: 'LP Stability', points: 20, desc: 'Locked LP = less rug risk' },
    { name: 'Volume Pattern', points: 10, desc: 'Organic volume vs wash trading' },
    { name: 'Creator Reputation', points: 10, desc: "Deployer's Ethos credibility score" },
  ]

  const grades = [
    { grade: 'A', range: '85–100', label: 'High Trust', color: 'rgb(0,214,143)' },
    { grade: 'B', range: '70–84', label: 'Good', color: '#4D8EFF' },
    { grade: 'C', range: '55–69', label: 'Moderate', color: 'rgb(255,184,0)' },
    { grade: 'D', range: '40–54', label: 'Caution', color: '#FF8C00' },
    { grade: 'F', range: '<40', label: 'High Risk', color: 'rgb(255,59,59)' },
  ]

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Scoring Model</div>
      <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 12px' }}>How scores are computed</h2>
      <p style={{ fontSize: 14, color: 'rgb(120,120,130)', margin: '0 0 40px', lineHeight: 1.7, maxWidth: 580 }}>
        Spawn scores are computed inside EigenLayer Verified TEEs — tamper-proof and cryptographically attested. No one, including the Spawn team, can manipulate a score after computation begins.
      </p>

      {/* Factor table */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgb(200,200,210)', marginBottom: 16 }}>Scoring factors</div>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: 12, padding: '8px 16px', marginBottom: 4 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(60,60,70)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Factor</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(60,60,70)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Points</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(60,60,70)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Signal</span>
        </div>
        <div style={{ background: 'rgb(12,12,12)', border: '1px solid rgb(22,22,22)', borderRadius: 12, overflow: 'hidden' }}>
          {factors.map((f, i) => (
            <div key={f.name} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: 12, padding: '14px 16px', borderBottom: i < factors.length - 1 ? '1px solid rgb(20,20,20)' : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgb(210,210,220)' }}>{f.name}</span>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'rgb(0,82,255)', fontWeight: 700 }}>{f.points}</span>
              </div>
              <span style={{ fontSize: 13, color: 'rgb(120,120,130)' }}>{f.desc}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(0,82,255,0.06)', border: '1px solid rgba(0,82,255,0.15)', borderRadius: 8, fontSize: 12, color: 'rgb(80,80,100)' }}>
          Total: 100 points across 6 factors. Each factor is independently verifiable.
        </div>
      </div>

      {/* Grade table */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgb(200,200,210)', marginBottom: 16 }}>Grade thresholds</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {grades.map(({ grade, range, label, color }) => (
            <div key={grade} style={{ flex: '1 1 100px', background: 'rgb(12,12,12)', border: `1px solid ${color}25`, borderRadius: 10, padding: '16px 14px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 32, fontWeight: 900, color, lineHeight: 1, marginBottom: 6 }}>{grade}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color, marginBottom: 4 }}>{range}</div>
              <div style={{ fontSize: 11, color: 'rgb(120,120,130)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TEE section */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,82,255,0.07) 0%, rgba(139,92,246,0.05) 100%)', border: '1px solid rgba(0,82,255,0.2)', borderRadius: 14, padding: '28px 32px' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(139,92,246)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>EigenLayer TEE</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'rgb(240,240,240)', marginBottom: 10 }}>Verified Trusted Execution Environments</div>
        <p style={{ fontSize: 13, color: 'rgb(120,120,130)', lineHeight: 1.7, margin: 0 }}>
          All scoring runs inside EigenLayer Verified TEEs — cryptographically secured enclaves where computation is provable. The enclave signs every score with an attestation key, anchoring the result on-chain. No one can tamper with inputs or outputs after execution begins.
        </p>
        <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['Tamper-proof scoring', 'Cryptographic attestation', 'Autonomous execution', 'Verifiable on-chain'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 500, color: 'rgb(200,200,210)' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,214,143,0.15)', border: '1px solid rgba(0,214,143,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="rgb(0,214,143)" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Tab reader from URL params ────────────────────────────────────
function TabReader({ onTab }: { onTab: (t: TabKey) => void }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    const t = searchParams.get('tab') as TabKey | null
    if (t && ['directory', 'api', 'verify', 'methodology'].includes(t)) {
      onTab(t)
    }
  }, [searchParams, onTab])
  return null
}

// ── Main page ─────────────────────────────────────────────────────
export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('directory')

  return (
    <div style={{ minHeight: '100vh', background: 'rgb(8,8,8)' }}>
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 24px', height: 60, background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(20,20,20)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo-new.jpg" alt="Spawn" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 600, color: 'rgb(240,240,240)' }}>spawn</span>
        </Link>
        <a href="https://t.me/agentspawn_bot" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: 'rgb(0,82,255)', textDecoration: 'none', padding: '6px 14px', borderRadius: 7 }}>
          Telegram Bot
        </a>
      </nav>

      {/* Suspend tab reader so searchParams don't block SSR */}
      <Suspense fallback={null}>
        <TabReader onTab={setActiveTab} />
      </Suspense>

      <div style={{ padding: '72px 24px 80px', maxWidth: 980, margin: '0 auto' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 40, paddingTop: 20, borderBottom: '1px solid rgb(20,20,20)', paddingBottom: 0 }}>
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px 8px 0 0',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: isActive ? 'rgb(0,82,255)' : 'transparent',
                  color: isActive ? '#fff' : 'rgb(70,70,80)',
                  marginBottom: -1,
                  borderBottom: isActive ? '1px solid rgb(0,82,255)' : '1px solid transparent',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'directory' && <DirectoryTab />}
        {activeTab === 'api' && <ApiTab />}
        {activeTab === 'verify' && <VerifyTab />}
        {activeTab === 'methodology' && <MethodologyTab />}
      </div>
    </div>
  )
}
