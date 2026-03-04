'use client'
import { useState } from 'react'
import Link from 'next/link'

const PAYMENT_ADDRESS = '0xdbefd1adb7af527a63037cc6ab14ff545c407b27'
const PAYMENT_AMOUNT = '$29 USDC'

type Step = 1 | 2 | 3 | 'done'

export default function VerifyPage() {
  const [step, setStep] = useState<Step>(1)
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

  // Shared nav
  const Nav = () => (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 24px', height: 60, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(28,28,28)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src="/logo-new.jpg" alt="Spawn" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500, color: 'rgb(240,240,240)' }}>spawn</span>
      </Link>
      <Link href="/app" style={{ background: 'rgb(0,82,255)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 7, textDecoration: 'none' }}>Check Score</Link>
    </nav>
  )

  // Step indicator
  const Steps = ({ current }: { current: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
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
    <div style={{ minHeight: '100vh', background: 'rgb(8,8,8)' }}>
      <Nav />
      <div style={{ paddingTop: 100, padding: '100px 24px 80px', maxWidth: 560, margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgb(70,70,80)', textDecoration: 'none', marginBottom: 32, display: 'inline-block' }}>← Back</Link>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Verification</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 28px' }}>Verify Your Agent</h1>

        {step === 'done' ? (
          <div style={{ background: 'rgba(0,214,143,0.06)', border: '1px solid rgba(0,214,143,0.2)', borderRadius: 14, padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,214,143,0.15)', border: '1px solid rgba(0,214,143,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="rgb(0,214,143)" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(240,240,240)', marginBottom: 10 }}>Submitted</div>
            <p style={{ fontSize: 14, color: 'rgb(120,120,130)', lineHeight: 1.6, margin: '0 0 24px' }}>Payment verified and application received. Review takes up to 48 hours. We will DM you on Twitter when approved.</p>
            <Link href="/app" style={{ display: 'inline-block', background: 'rgb(0,82,255)', color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 24px', borderRadius: 8, textDecoration: 'none' }}>Back to Directory</Link>
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
                    Make sure you are on the Base network. USDC only. Sending on any other chain will not be detected.
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
                <p style={{ fontSize: 14, color: 'rgb(120,120,130)', marginBottom: 20, lineHeight: 1.6 }}>Paste your transaction hash from the USDC transfer. We will verify it on-chain before reviewing your application.</p>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgb(120,120,130)', marginBottom: 6 }}>Transaction Hash</label>
                  <input type="text" placeholder="0x..." value={txHash} onChange={e => setTxHash(e.target.value)}
                    style={{ width: '100%', background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'rgb(240,240,240)', outline: 'none', fontFamily: 'JetBrains Mono, monospace', boxSizing: 'border-box' }} />
                  <a href={`https://basescan.org/address/${PAYMENT_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 6, fontSize: 12, color: 'rgb(70,70,80)', textDecoration: 'none' }}>Confirm your tx on Basescan ↗</a>
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
    </div>
  )
}
