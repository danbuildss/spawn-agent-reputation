'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState('')

  const login = () => {
    if (password === 'spawn2026') { setAuthed(true); loadSubmissions() }
    else alert('Wrong password')
  }

  const loadSubmissions = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/submissions')
    const data = await res.json()
    setSubmissions(data.submissions || [])
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
    loadSubmissions()
    setTimeout(() => setActionMsg(''), 3000)
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: 'rgb(255,184,0)', approved: 'rgb(0,214,143)', rejected: 'rgb(255,59,59)',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Admin</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'rgb(240,240,240)', margin: 0 }}>Verification Queue</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {actionMsg && <span style={{ fontSize: 13, color: 'rgb(0,214,143)', alignSelf: 'center' }}>{actionMsg}</span>}
            <button onClick={loadSubmissions} style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', color: 'rgb(120,120,130)', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>Refresh</button>
            <Link href="/" style={{ background: 'rgb(28,28,28)', color: 'rgb(120,120,130)', borderRadius: 8, padding: '8px 16px', fontSize: 13, textDecoration: 'none' }}>Exit</Link>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgb(70,70,80)', padding: '60px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>Loading submissions...</div>
        ) : submissions.length === 0 ? (
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
