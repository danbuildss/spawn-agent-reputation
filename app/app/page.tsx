'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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

function ScoreCard({ agent }: { agent: any }) {
  const grade = getGrade(agent.score || agent.trust_score || 0)
  const score = agent.score || agent.trust_score || 0
  const color = GRADE_COLORS[grade]
  return (
    <div
      style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '20px', transition: 'border-color 0.15s, transform 0.15s', cursor: 'pointer' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgb(28,28,28)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
      onClick={() => { window.location.href = `/agent/${agent.address || agent.contract_address}` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgb(240,240,240)', marginBottom: 2 }}>{agent.name || 'Unknown Agent'}</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(70,70,80)' }}>
            {(agent.address || agent.contract_address || '').slice(0, 6)}...{(agent.address || agent.contract_address || '').slice(-4)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>{grade}</div>
          <div style={{ fontSize: 11, color: 'rgb(120,120,130)', marginTop: 2 }}>{score}/100</div>
        </div>
      </div>
      <div style={{ background: 'rgb(8,8,8)', borderRadius: 6, height: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 6, transition: 'width 0.6s ease' }} />
      </div>
      {agent.verified && (
        <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.25)', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: 'rgb(0,214,143)' }}>
          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          Verified
        </div>
      )}
    </div>
  )
}

export default function AppPage() {
  const [query, setQuery] = useState('')
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<any>(null)
  const [checkError, setCheckError] = useState('')
  const [filter, setFilter] = useState<'all' | 'verified' | 'a' | 'f'>('all')

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(d => setAgents(d.agents || d || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const checkScore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setChecking(true)
    setCheckResult(null)
    setCheckError('')
    try {
      const res = await fetch(`/api/reputation?address=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (data.error) setCheckError(data.error)
      else setCheckResult(data)
    } catch {
      setCheckError('Failed to fetch score. Check the address and try again.')
    }
    setChecking(false)
  }

  const filtered = agents.filter(a => {
    if (filter === 'verified') return a.verified
    if (filter === 'a') return (a.score || a.trust_score || 0) >= 85
    if (filter === 'f') return (a.score || a.trust_score || 0) < 40
    return true
  })

  const grade = checkResult ? getGrade(checkResult.score || checkResult.trustScore || 0) : null
  const gradeColor = grade ? GRADE_COLORS[grade] : '#4D8EFF'

  return (
    <div style={{ minHeight: '100vh', background: 'rgb(8,8,8)' }}>
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 24px', height: 60, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(28,28,28)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: 'rgb(0,82,255)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="8" cy="8" r="2" fill="white"/></svg>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500, color: 'rgb(240,240,240)' }}>spawn</span>
        </Link>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'rgb(120,120,130)' }}>
          <Link href="/methodology" style={{ color: 'inherit', textDecoration: 'none' }}>Methodology</Link>
          <Link href="/verify" style={{ color: 'inherit', textDecoration: 'none' }}>Verify Agent</Link>
          <a href="https://t.me/agentspawn_bot" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Telegram Bot</a>
        </div>
      </nav>

      <div style={{ padding: '80px 24px 60px', maxWidth: 960, margin: '0 auto' }}>
        {/* Search hero */}
        <div style={{ textAlign: 'center', marginBottom: 48, paddingTop: 20 }}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 8px' }}>Check any AI agent</h1>
          <p style={{ fontSize: 15, color: 'rgb(120,120,130)', margin: '0 0 28px' }}>Paste a contract address to get an instant Spawn score</p>
          <form onSubmit={checkScore} style={{ display: 'flex', gap: 10, maxWidth: 560, margin: '0 auto' }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="0x... contract address"
              style={{ flex: 1, background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '12px 16px', fontSize: 14, color: 'rgb(240,240,240)', outline: 'none', fontFamily: 'JetBrains Mono, monospace' }}
            />
            <button
              type="submit"
              disabled={checking}
              style={{ background: 'rgb(0,82,255)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: checking ? 'not-allowed' : 'pointer', opacity: checking ? 0.6 : 1, whiteSpace: 'nowrap' }}
            >
              {checking ? 'Checking...' : 'Get Score'}
            </button>
          </form>
        </div>

        {/* Check result error */}
        {checkError && (
          <div style={{ maxWidth: 560, margin: '0 auto 32px', background: 'rgba(255,59,59,0.08)', border: '1px solid rgba(255,59,59,0.25)', borderRadius: 10, padding: '14px 16px', fontSize: 14, color: '#FF8080', textAlign: 'center' }}>
            {checkError}
          </div>
        )}

        {/* Check result card */}
        {checkResult && grade && (
          <div style={{ maxWidth: 560, margin: '0 auto 48px', background: 'rgb(14,14,14)', border: `1px solid ${gradeColor}30`, borderRadius: 14, padding: '28px 32px', boxShadow: `0 0 40px ${gradeColor}10` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'rgb(240,240,240)' }}>{checkResult.name || 'Unknown Agent'}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(70,70,80)', marginTop: 2 }}>{query.slice(0, 8)}...{query.slice(-6)}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 56, fontWeight: 900, color: gradeColor, lineHeight: 1 }}>{grade}</div>
                <div style={{ fontSize: 13, color: 'rgb(120,120,130)' }}>{checkResult.score || checkResult.trustScore || 0} / 100</div>
              </div>
            </div>
            {/* Factor bars */}
            {checkResult.factors && Object.entries(checkResult.factors).map(([key, val]: [string, any]) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgb(120,120,130)', marginBottom: 4 }}>
                  <span style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgb(240,240,240)' }}>{val}</span>
                </div>
                <div style={{ background: 'rgb(28,28,28)', borderRadius: 4, height: 4 }}>
                  <div style={{ height: '100%', width: `${Math.min((val / 25) * 100, 100)}%`, background: gradeColor, borderRadius: 4 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <Link href={`/agent/${query}`} style={{ flex: 1, background: `${gradeColor}15`, border: `1px solid ${gradeColor}30`, color: gradeColor, borderRadius: 7, padding: '9px', fontSize: 13, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                Full Report
              </Link>
              <button
                onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/agent/${query}`) }}
                style={{ background: 'rgb(20,20,20)', border: '1px solid rgb(28,28,28)', color: 'rgb(120,120,130)', borderRadius: 7, padding: '9px 16px', fontSize: 13, cursor: 'pointer' }}
              >
                Share
              </button>
            </div>
          </div>
        )}

        {/* Agent Directory */}
        <div id="agents" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'rgb(240,240,240)', margin: 0 }}>Agent Directory</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all', 'verified', 'a', 'f'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{ background: filter === f ? 'rgb(0,82,255)' : 'rgb(14,14,14)', color: filter === f ? '#fff' : 'rgb(120,120,130)', border: `1px solid ${filter === f ? 'transparent' : 'rgb(28,28,28)'}`, borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                {f === 'all' ? 'All' : f === 'verified' ? 'Verified' : f === 'a' ? 'Grade A' : 'Grade F'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgb(70,70,80)', padding: '60px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>Loading agents...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {filtered.map((agent, i) => <ScoreCard key={i} agent={agent} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgb(70,70,80)', padding: '60px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>No agents found.</div>
        )}
      </div>
    </div>
  )
}
