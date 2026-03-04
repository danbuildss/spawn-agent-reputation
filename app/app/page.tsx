'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const GRADE_COLORS: Record<string, string> = {
  A: 'rgb(0,214,143)', B: '#4D8EFF', C: 'rgb(255,184,0)', D: '#FF8C00', F: 'rgb(255,59,59)',
}

function getGrade(score: number): string {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

function AgentAvatar({ name, twitter, size = 40 }: { name: string; twitter?: string; size?: number }) {
  const [imgFailed, setImgFailed] = useState(false)
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['#0052FF', '#4D8EFF', 'rgb(0,214,143)', 'rgb(255,184,0)', '#A855F7']
  const colorIdx = name.charCodeAt(0) % colors.length
  const bg = colors[colorIdx]

  if (twitter && !imgFailed) {
    return (
      <img
        src={`https://unavatar.io/twitter/${twitter.replace('@', '')}`}
        alt={name}
        width={size} height={size}
        onError={() => setImgFailed(true)}
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
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <AgentAvatar name={agent.name || 'Agent'} twitter={agent.twitter} size={40} />
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
        {/* Grade badge */}
        <div style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 8, padding: '6px 10px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{grade}</div>
          <div style={{ fontSize: 10, color: 'rgb(100,100,110)', marginTop: 2 }}>{score}/100</div>
        </div>
      </div>
      {/* Score bar */}
      <div style={{ background: 'rgb(8,8,8)', borderRadius: 4, height: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 4 }} />
      </div>
      {/* Category */}
      {agent.category && (
        <div style={{ marginTop: 10, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgb(60,60,70)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{agent.category}</div>
      )}
    </div>
  )
}

type FilterType = 'all' | 'verified' | 'a' | 'f'

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'verified', label: 'Verified' },
  { key: 'a', label: 'Grade A' },
  { key: 'f', label: 'Grade F' },
]

export default function AppPage() {
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
    if (!q) return
    if (isAddress(q)) {
      // Check score directly
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
    }
    // else: filter by name in directory below
  }, [search])

  // Filter agents
  const filtered = agents.filter(a => {
    const score = a.score || a.trust_score || 0
    const grade = a.grade || getGrade(score)
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'verified' ? a.status === 'verified' :
      filter === 'a' ? grade === 'A' :
      filter === 'f' ? grade === 'F' :
      true
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
    <div style={{ minHeight: '100vh', background: 'rgb(8,8,8)' }}>
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 24px', height: 60, background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(20,20,20)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo-new.jpg" alt="Spawn" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 600, color: 'rgb(240,240,240)' }}>spawn</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/methodology" style={{ fontSize: 13, color: 'rgb(100,100,110)', textDecoration: 'none', padding: '5px 10px' }}>Methodology</Link>
          <Link href="/verify" style={{ fontSize: 13, color: 'rgb(100,100,110)', textDecoration: 'none', padding: '5px 10px' }}>Verify</Link>
          <a href="https://t.me/agentspawn_bot" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: 'rgb(0,82,255)', textDecoration: 'none', padding: '6px 14px', borderRadius: 7 }}>
            Telegram Bot
          </a>
        </div>
      </nav>

      <div style={{ padding: '80px 24px 80px', maxWidth: 980, margin: '0 auto' }}>
        {/* Search section */}
        <div style={{ paddingTop: 24, marginBottom: 48 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Score Check</div>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 6px' }}>Check any AI agent</h1>
          <p style={{ fontSize: 14, color: 'rgb(80,80,90)', margin: '0 0 22px' }}>Paste a contract address for an instant Spawn score, or search the directory below.</p>
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

        {/* Error */}
        {checkError && (
          <div style={{ maxWidth: 540, marginBottom: 32, background: 'rgba(255,59,59,0.06)', border: '1px solid rgba(255,59,59,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#FF8080' }}>
            {checkError}
          </div>
        )}

        {/* Score result card */}
        {checkResult && checkGrade && (
          <div style={{ maxWidth: 540, marginBottom: 48, background: 'rgb(12,12,12)', border: `1px solid ${checkColor}25`, borderRadius: 14, padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <AgentAvatar name={checkResult.name || 'Agent'} twitter={checkResult.twitter} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'rgb(240,240,240)' }}>{checkResult.name || 'Unknown Agent'}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(60,60,70)', marginTop: 2 }}>{search.slice(0, 8)}...{search.slice(-6)}</div>
              </div>
              <div style={{ background: `${checkColor}12`, border: `1px solid ${checkColor}30`, borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 40, fontWeight: 900, color: checkColor, lineHeight: 1 }}>{checkGrade}</div>
                <div style={{ fontSize: 12, color: 'rgb(100,100,110)', marginTop: 2 }}>{checkResult.score || 0}/100</div>
              </div>
            </div>
            {/* Score bar */}
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
            <div style={{ fontSize: 16, fontWeight: 600, color: 'rgb(240,240,240)' }}>Directory</div>
            <div style={{ fontSize: 12, color: 'rgb(60,60,70)', marginTop: 2 }}>{filtered.length} agents</div>
          </div>
          {/* Filter tabs */}
          <div style={{ display: 'flex', background: 'rgb(12,12,12)', border: '1px solid rgb(22,22,22)', borderRadius: 10, padding: 3, gap: 2 }}>
            {FILTERS.map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 7,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: filter === key ? 'rgb(0,82,255)' : 'transparent',
                  color: filter === key ? '#fff' : 'rgb(80,80,90)',
                  boxShadow: filter === key ? '0 1px 6px rgba(0,82,255,0.4)' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Agent grid */}
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
    </div>
  )
}
