'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [submissions, setSubmissions] = useState<any[]>([])
  const [pendingAgents, setPendingAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'submissions' | 'indexed'>('indexed')

  const login = () => {
    if (password === 'spawn2026') { setAuthed(true); loadAll() }
    else alert('Wrong password')
  }

  const loadAll = async () => {
    setLoading(true)
    const [subRes, pendingRes] = await Promise.all([
      fetch('/api/admin/submissions'),
      fetch('/api/admin/pending-agents'),
    ])
    const subData = await subRes.json()
    const pendingData = await pendingRes.json()
    setSubmissions(subData.submissions || [])
    setPendingAgents(pendingData.agents || [])
    setLoading(false)
  }

  const take = async (id: string, action: 'approve' | 'reject') => {
    const res = await fetch('/api/admin/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action, adminKey: 'spawn2026' }),
    })
    const data = await res.json()
    setActionMsg(data.message || data.error)
    loadAll()
    setTimeout(() => setActionMsg(''), 3000)
  }

  const approveAgent = async (contract_address: string, action: 'approve' | 'reject') => {
    const res = await fetch('/api/admin/approve-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contract_address, action, adminKey: 'spawn2026' }),
    })
    const data = await res.json()
    setActionMsg(data.message || data.error)
    loadAll()
    setTimeout(() => setActionMsg(''), 3000)
  }

  const featureAgent = async (contractAddress: string) => {
    const res = await fetch('/api/admin/feature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractAddress, adminKey: 'spawn2026', durationDays: 30 }),
    })
    const data = await res.json()
    setActionMsg(data.success ? `Featured until ${new Date(data.featuredUntil).toLocaleDateString()}` : data.error)
    loadAll()
    setTimeout(() => setActionMsg(''), 4000)
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: 'rgb(255,184,0)', approved: 'rgb(0,214,143)', rejected: 'rgb(255,59,59)',
    active: 'rgb(0,214,143)', verified: 'rgb(0,82,255)',
  }

  const SOURCE_COLORS: Record<string, string> = {
    virtuals: 'rgb(139,92,246)',
    clanker: 'rgb(249,115,22)',
    manual: 'rgb(120,120,130)',
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'rgb(8,8,8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 360, background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 14, padding: '40px 32px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>spawn admin</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'rgb(240,240,240)', margin: '0 0 24px' }}>Review Dashboard</h1>
          <input type="password" placeholder="Admin password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ width: '100%', background: 'rgb(8,8,8)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'rgb(240,240,240)', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
          <button onClick={login} style={{ width: '100%', background: 'rgb(0,82,255)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Enter</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'rgb(8,8,8)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Admin</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'rgb(240,240,240)', margin: 0 }}>Review Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {actionMsg && <span style={{ fontSize: 13, color: 'rgb(0,214,143)' }}>{actionMsg}</span>}
            {activeTab === 'indexed' && pendingAgents.length > 0 && (
              <button onClick={async () => {
                if (!confirm(`Approve all ${pendingAgents.length} pending agents?`)) return
                for (const a of pendingAgents) await approveAgent(a.contract_address, 'approve')
              }} style={{ background: 'rgba(0,214,143,0.12)', border: '1px solid rgba(0,214,143,0.3)', color: 'rgb(0,214,143)', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Approve All ({pendingAgents.length})
              </button>
            )}
            <button onClick={loadAll} style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', color: 'rgb(120,120,130)', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>Refresh</button>
            <Link href="/" style={{ background: 'rgb(28,28,28)', color: 'rgb(120,120,130)', borderRadius: 8, padding: '8px 16px', fontSize: 13, textDecoration: 'none' }}>Exit</Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid rgb(28,28,28)' }}>
          {[
            { key: 'indexed', label: 'Auto-Indexed', count: pendingAgents.length },
            { key: 'submissions', label: 'Verify Submissions', count: submissions.filter(s => s.status === 'pending').length },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === tab.key ? '2px solid rgb(0,82,255)' : '2px solid transparent', color: activeTab === tab.key ? 'rgb(240,240,240)' : 'rgb(80,80,90)', padding: '10px 20px', fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400, cursor: 'pointer', marginBottom: -1 }}>
              {tab.label} {tab.count > 0 && <span style={{ background: 'rgb(0,82,255)', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 11, marginLeft: 6 }}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgb(70,70,80)', padding: '60px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>Loading...</div>
        ) : activeTab === 'indexed' ? (
          // Auto-Indexed Pending Queue
          pendingAgents.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgb(70,70,80)', padding: '60px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>No pending auto-indexed agents.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, color: 'rgb(80,80,90)', marginBottom: 4 }}>
                {pendingAgents.length} agents discovered by the auto-indexer. Approve to publish to directory, reject to remove.
              </div>
              {pendingAgents.map(agent => (
                <div key={agent.id} style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {agent.logo_url ? (
                      <img src={agent.logo_url} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: 'rgb(28,28,28)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgb(28,28,28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'rgb(120,120,130)' }}>
                        {(agent.name || '?').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: 'rgb(220,220,230)' }}>{agent.name}</span>
                        <span style={{ fontSize: 10, color: SOURCE_COLORS[agent.source] || 'rgb(120,120,130)', background: `${SOURCE_COLORS[agent.source] || 'rgb(120,120,130)'}18`, border: `1px solid ${SOURCE_COLORS[agent.source] || 'rgb(120,120,130)'}30`, borderRadius: 4, padding: '1px 7px', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace' }}>
                          {agent.source || 'manual'}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: agent.grade === 'A' ? 'rgb(0,214,143)' : agent.grade === 'B' ? 'rgb(100,200,255)' : agent.grade === 'F' ? 'rgb(255,59,59)' : 'rgb(255,184,0)' }}>
                          Score {agent.score} ({agent.grade})
                        </span>
                      </div>
                      <code style={{ fontSize: 11, color: 'rgb(80,80,90)', fontFamily: 'JetBrains Mono, monospace' }}>{agent.contract_address}</code>
                      {agent.twitter && <span style={{ fontSize: 12, color: 'rgb(100,100,110)', marginLeft: 10 }}>@{agent.twitter}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`https://basescan.org/address/${agent.contract_address}`} target="_blank" rel="noopener noreferrer"
                      style={{ background: 'rgb(28,28,28)', color: 'rgb(120,120,130)', border: '1px solid rgb(40,40,50)', borderRadius: 7, padding: '7px 12px', fontSize: 12, cursor: 'pointer', textDecoration: 'none' }}>
                      BaseScan ↗
                    </a>
                    <button onClick={() => approveAgent(agent.contract_address, 'approve')}
                      style={{ background: 'rgba(0,214,143,0.12)', border: '1px solid rgba(0,214,143,0.3)', color: 'rgb(0,214,143)', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Approve
                    </button>
                    <button onClick={() => approveAgent(agent.contract_address, 'reject')}
                      style={{ background: 'rgba(255,59,59,0.08)', border: '1px solid rgba(255,59,59,0.2)', color: 'rgb(255,59,59)', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // Verification Submissions
          submissions.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgb(70,70,80)', padding: '60px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>No submissions yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {submissions.map(sub => (
                <div key={sub.id} style={{ background: 'rgb(14,14,14)', border: `1px solid ${STATUS_COLORS[sub.status] || 'rgb(28,28,28)'}25`, borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'rgb(240,240,240)', marginBottom: 4 }}>{sub.name || 'Unnamed'}</div>
                      <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgb(120,120,130)' }}>{sub.contract_address}</code>
                      {sub.twitter && <div style={{ fontSize: 13, color: 'rgb(120,120,130)', marginTop: 4 }}>@{sub.twitter}</div>}
                      {sub.website && <a href={sub.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#4D8EFF', display: 'block', marginTop: 2 }}>{sub.website}</a>}
                      {sub.description && <p style={{ fontSize: 13, color: 'rgb(100,100,110)', marginTop: 8, lineHeight: 1.5, maxWidth: 500 }}>{sub.description}</p>}
                      {sub.payment_tx && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, color: 'rgb(0,214,143)', fontFamily: 'JetBrains Mono, monospace' }}>TX: {sub.payment_tx.slice(0, 12)}...</span>
                          <a href={`https://basescan.org/tx/${sub.payment_tx}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#4D8EFF' }}>View ↗</a>
                        </div>
                      )}
                      <div style={{ marginTop: 6, fontSize: 11, color: 'rgb(60,60,70)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {new Date(sub.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLORS[sub.status], background: `${STATUS_COLORS[sub.status]}15`, border: `1px solid ${STATUS_COLORS[sub.status]}30`, borderRadius: 6, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {sub.status}
                      </span>
                      {sub.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => take(sub.id, 'approve')} style={{ background: 'rgba(0,214,143,0.15)', border: '1px solid rgba(0,214,143,0.3)', color: 'rgb(0,214,143)', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                            Approve
                          </button>
                          <button onClick={() => take(sub.id, 'reject')} style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.25)', color: 'rgb(255,59,59)', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                            Reject
                          </button>
                        </div>
                      )}
                      {(sub.status === 'approved' || sub.status === 'verified') && sub.contract_address && (
                        <button onClick={() => featureAgent(sub.contract_address)} style={{ background: 'rgba(255,184,0,0.12)', border: '1px solid rgba(255,184,0,0.3)', color: 'rgb(255,184,0)', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          Feature (30d)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
