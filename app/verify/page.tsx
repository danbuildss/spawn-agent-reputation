'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function VerifyPage() {
  const [form, setForm] = useState({ name: '', address: '', website: '', twitter: '', description: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {}
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'rgb(8,8,8)' }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 24px', height: 60, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(28,28,28)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo-new.jpg" alt="Spawn" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500, color: 'rgb(240,240,240)', letterSpacing: '-0.01em' }}>spawn</span>
        </Link>
        <Link href="/app" style={{ background: 'rgb(0,82,255)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 7, textDecoration: 'none' }}>Check Score</Link>
      </nav>

      <div style={{ paddingTop: 100, padding: '100px 24px 80px', maxWidth: 560, margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgb(70,70,80)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>← Back</Link>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Verification</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 12px' }}>Verify Your Agent</h1>
        <p style={{ fontSize: 15, color: 'rgb(120,120,130)', margin: '0 0 20px', lineHeight: 1.6 }}>Get the verified badge on your Spawn profile. Manual review by the team within 48 hours.</p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.25)', borderRadius: 8, padding: '8px 14px', marginBottom: 36, fontSize: 13, fontWeight: 600, color: 'rgb(0,214,143)' }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          $29 USDC one-time · Refundable if rejected
        </div>

        {submitted ? (
          <div style={{ background: 'rgba(0,214,143,0.06)', border: '1px solid rgba(0,214,143,0.2)', borderRadius: 14, padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,214,143,0.15)', border: '1px solid rgba(0,214,143,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="rgb(0,214,143)" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'rgb(240,240,240)', marginBottom: 8 }}>Application received</div>
            <div style={{ fontSize: 14, color: 'rgb(120,120,130)', lineHeight: 1.6 }}>We review within 48 hours. Payment instructions will be sent to your Twitter DM.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'name', label: 'Agent Name', placeholder: 'Your AI agent name' },
              { key: 'address', label: 'Contract Address', placeholder: '0x...' },
              { key: 'website', label: 'Website', placeholder: 'https://' },
              { key: 'twitter', label: 'Twitter / X Handle', placeholder: '@handle' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgb(120,120,130)', marginBottom: 6 }}>{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  style={{ width: '100%', background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'rgb(240,240,240)', outline: 'none', fontFamily: 'JetBrains Mono, monospace', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgb(120,120,130)', marginBottom: 6 }}>Description</label>
              <textarea
                placeholder="What does your agent do? What problem does it solve?"
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                style={{ width: '100%', background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'rgb(240,240,240)', outline: 'none', resize: 'vertical', minHeight: 100, fontFamily: 'Space Grotesk, sans-serif', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ background: 'rgb(0,82,255)', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, marginTop: 4 }}
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </form>
        )}

        {/* What you get */}
        <div style={{ marginTop: 40, background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgb(120,120,130)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace' }}>What you get</div>
          {[
            'Green "Verified" badge on your agent profile',
            'Priority placement in the Spawn directory',
            'Score breakdown displayed publicly',
            'Listed in our weekly verified agents update',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 14, color: 'rgb(200,200,200)', lineHeight: 1.5 }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgb(0,214,143)" strokeWidth={2.5} style={{ marginTop: 2, flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
