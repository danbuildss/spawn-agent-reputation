'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Agent, ETH_PRICE } from '@/lib/agents-data'

interface Props {
  agent: Agent | null
  address: string
}

const GRADE_COLORS: Record<string, string> = {
  A: 'rgb(0,214,143)',
  B: '#4D8EFF',
  C: 'rgb(255,184,0)',
  D: '#FF8C00',
  F: 'rgb(255,59,59)',
}

function getGrade(score: number): string {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

export default function AgentDetailClient({ agent: initialAgent, address }: Props) {
  const [agent, setAgent] = useState<Agent | null>(initialAgent)
  const [loading, setLoading] = useState(!initialAgent)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!initialAgent && address) {
      setLoading(true)
      fetch(`/api/reputation?address=${address}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error)
          } else {
            setAgent({
              id: address,
              name: data.name || 'Unknown',
              token: data.token || '',
              handle: '',
              description: data.recommendation || 'No description available',
              score: data.score || 0,
              vouched: 0,
              reviews: 0,
              category: 'Infrastructure',
              status: data.grade === 'A' ? 'verified' : 'pending',
              gradient: 'from-gray-500 to-gray-700',
              logo: data.name?.slice(0, 2) || '??',
              contract: address,
              twitter: data.twitter,
              breakdown: data.breakdown,
            } as unknown as Agent)
          }
          setLoading(false)
        })
        .catch(() => {
          setError('Failed to fetch agent data')
          setLoading(false)
        })
    }
  }, [initialAgent, address])

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'rgb(8,8,8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '2px solid rgb(0,82,255)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgb(120,120,130)', fontSize: 14 }}>Checking reputation...</p>
        </div>
      </main>
    )
  }

  if (error || !agent) {
    return (
      <main style={{ minHeight: '100vh', background: 'rgb(8,8,8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠</div>
          <p style={{ color: 'rgb(240,240,240)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Agent Not Found</p>
          <p style={{ color: 'rgb(120,120,130)', fontSize: 14, marginBottom: 20 }}>{error || 'Could not find data for this address'}</p>
          <Link href="/" style={{ color: 'rgb(0,82,255)', textDecoration: 'none', fontSize: 14 }}>← Back to directory</Link>
        </div>
      </main>
    )
  }

  const grade = getGrade(agent.score)
  const gradeColor = GRADE_COLORS[grade]
  const vouchedUSD = agent.vouched * ETH_PRICE

  const formatUSD = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
    return `$${val.toFixed(0)}`
  }

  const copyContract = () => {
    if (agent.contract) {
      navigator.clipboard.writeText(agent.contract)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const apiBreakdown = (agent as any).breakdown
  const breakdown = apiBreakdown ? {
    contractAge: { score: apiBreakdown.contractAge?.score || 0, max: apiBreakdown.contractAge?.max || 20, label: 'Contract Age', detail: 'Base mainnet' },
    liquidity: { score: apiBreakdown.liquidity?.score || 0, max: apiBreakdown.liquidity?.max || 25, label: 'Liquidity', detail: 'DEX pools' },
    holders: { score: apiBreakdown.holders?.score || 0, max: apiBreakdown.holders?.max || 15, label: 'Holders', detail: 'Token holders' },
    lpLocked: { score: apiBreakdown.lpLocked?.score || 0, max: apiBreakdown.lpLocked?.max || 20, label: 'LP Locked', detail: 'Lock status' },
    volume: { score: apiBreakdown.volume?.score || 0, max: apiBreakdown.volume?.max || 10, label: 'Volume', detail: '24h activity' },
    creator: { score: apiBreakdown.creatorHistory?.score || 0, max: apiBreakdown.creatorHistory?.max || 10, label: 'Creator Rep', detail: 'Ethos score' },
  } : {
    contractAge: { score: Math.round(agent.score * 0.18), max: 20, label: 'Contract Age', detail: 'Base mainnet' },
    liquidity: { score: Math.round(agent.score * 0.22), max: 25, label: 'Liquidity', detail: 'DEX pools' },
    holders: { score: Math.round(agent.score * 0.14), max: 15, label: 'Holders', detail: 'Token holders' },
    lpLocked: { score: Math.round(agent.score * 0.18), max: 20, label: 'LP Locked', detail: 'Lock status' },
    volume: { score: Math.round(agent.score * 0.09), max: 10, label: 'Volume', detail: '24h activity' },
    creator: { score: Math.round(agent.score * 0.09), max: 10, label: 'Creator Rep', detail: 'Ethos score' },
  }

  const basescanUrl = agent.contract
    ? `https://basescan.org/address/${agent.contract}`
    : `https://basescan.org/search?q=${agent.token.replace('$', '')}`

  const dexscreenerUrl = agent.contract
    ? `https://dexscreener.com/base/${agent.contract}`
    : `https://dexscreener.com/base`

  return (
    <main style={{ minHeight: '100vh', background: 'rgb(8,8,8)', paddingTop: 80, paddingBottom: 60, paddingLeft: 24, paddingRight: 24 }}>
      {/* Inline spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 24px', height: 60, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(28,28,28)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: 'rgb(0,82,255)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="8" cy="8" r="2" fill="white"/></svg>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500, color: 'rgb(240,240,240)' }}>spawn</span>
        </Link>
        <Link href="/app" style={{ fontSize: 13, color: 'rgb(120,120,130)', textDecoration: 'none' }}>← Directory</Link>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Back */}
        <Link href="/app" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgb(70,70,80)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          ← Back
        </Link>

        {/* Header card */}
        <div style={{ background: 'rgb(14,14,14)', border: `1px solid ${gradeColor}25`, borderRadius: 14, padding: '28px 32px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            {/* Logo */}
            <div style={{ width: 64, height: 64, borderRadius: 12, background: 'rgb(28,28,28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'rgb(240,240,240)', flexShrink: 0 }}>
              {agent.logo?.slice(0, 2) || '??'}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: 'rgb(240,240,240)', margin: 0 }}>{agent.name}</h1>
                {agent.status === 'verified' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.3)', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: 'rgb(0,214,143)' }}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Verified
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ background: 'rgba(0,82,255,0.12)', color: '#4D8EFF', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{agent.token}</span>
                <span style={{ background: 'rgb(28,28,28)', color: 'rgb(120,120,130)', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>{agent.category}</span>
              </div>

              {agent.contract && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgb(120,120,130)', background: 'rgb(20,20,20)', padding: '4px 10px', borderRadius: 6 }}>
                    {agent.contract.slice(0, 10)}...{agent.contract.slice(-8)}
                  </code>
                  <button onClick={copyContract} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? 'rgb(0,214,143)' : 'rgb(70,70,80)', fontSize: 12, padding: 0 }}>
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              )}

              <p style={{ fontSize: 14, color: 'rgb(120,120,130)', lineHeight: 1.6, margin: 0 }}>{agent.description}</p>
            </div>

            {/* Grade */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 64, fontWeight: 900, color: gradeColor, lineHeight: 1 }}>{grade}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(240,240,240)', marginTop: 4 }}>{agent.score}</div>
              <div style={{ fontSize: 11, color: 'rgb(120,120,130)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Trust Score</div>
              {agent.vouched > 0 && (
                <div style={{ marginTop: 8, fontSize: 13, color: 'rgb(120,120,130)' }}>
                  {agent.vouched} ETH · {formatUSD(vouchedUSD)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
          {/* Score breakdown */}
          <div style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 14, padding: '24px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'rgb(240,240,240)', margin: '0 0 20px' }}>Score Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.entries(breakdown).map(([key, data]) => {
                const pct = (data.score / data.max) * 100
                const barColor = pct >= 80 ? 'rgb(0,214,143)' : pct >= 60 ? 'rgb(255,184,0)' : '#FF8C00'
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: 'rgb(120,120,130)' }}>{data.label}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgb(240,240,240)', fontSize: 12 }}>{data.score}/{data.max}</span>
                    </div>
                    <div style={{ background: 'rgb(28,28,28)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 4, transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'rgb(70,70,80)', marginTop: 4 }}>{data.detail}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Info */}
            <div style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '18px' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'rgb(120,120,130)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgb(70,70,80)' }}>Token</span>
                  <span style={{ color: 'rgb(240,240,240)', fontWeight: 600 }}>{agent.token}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgb(70,70,80)' }}>Chain</span>
                  <span style={{ color: 'rgb(240,240,240)' }}>Base</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgb(70,70,80)' }}>Platform</span>
                  <span style={{ color: 'rgb(240,240,240)', textTransform: 'capitalize' }}>{(agent as any).launchPlatform || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgb(70,70,80)' }}>Reviews</span>
                  <span style={{ color: 'rgb(240,240,240)' }}>{agent.reviews}</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '18px' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'rgb(120,120,130)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {agent.twitter && (
                  <a href={`https://twitter.com/${agent.twitter}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgb(120,120,130)', textDecoration: 'none' }}>
                    <span>@{agent.twitter}</span>
                    <span style={{ fontSize: 11 }}>↗</span>
                  </a>
                )}
                <a href={basescanUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgb(120,120,130)', textDecoration: 'none' }}>
                  <span>Basescan</span>
                  <span style={{ fontSize: 11 }}>↗</span>
                </a>
                <a href={dexscreenerUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgb(120,120,130)', textDecoration: 'none' }}>
                  <span>DexScreener</span>
                  <span style={{ fontSize: 11 }}>↗</span>
                </a>
              </div>
            </div>

            {/* API */}
            <div style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '18px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgb(240,240,240)', marginBottom: 8 }}>Agent API</div>
              <p style={{ fontSize: 12, color: 'rgb(120,120,130)', lineHeight: 1.6, margin: '0 0 12px' }}>Query this agent programmatically via the Spawn API.</p>
              <a
                href={`/api/reputation?address=${agent.contract || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', background: 'rgba(0,82,255,0.12)', border: '1px solid rgba(0,82,255,0.25)', color: '#4D8EFF', borderRadius: 7, padding: '9px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              >
                Query via API
              </a>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgb(70,70,80)', marginTop: 8, wordBreak: 'break-all' }}>
                GET /api/reputation?address={agent.contract ? `${agent.contract.slice(0, 10)}...` : 'CONTRACT'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
