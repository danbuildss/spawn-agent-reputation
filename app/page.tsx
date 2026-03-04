import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spawn — Trust Layer for AI Agents',
  description: 'Know before you ape. Verified reputation scores for AI agent tokens on Base, computed inside EigenLayer TEEs.',
}

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'rgb(8,8,8)' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #4D8EFF; }
          50% { opacity: 0.5; box-shadow: 0 0 4px #4D8EFF; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-fadeup { animation: fadeUp 0.7s ease forwards; }
        .animate-fadein { animation: fadeIn 0.8s ease forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0 24px', height: 60,
        background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgb(28,28,28)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/logo-new.jpg" alt="Spawn" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500, color: 'rgb(240,240,240)', letterSpacing: '-0.01em' }}>spawn</span>
          </Link>
          <div style={{ display: 'flex', gap: 24, fontSize: 13, fontWeight: 500, color: 'rgb(120,120,130)' }}>
            <Link href="/app" style={{ color: 'inherit', textDecoration: 'none' }}>App</Link>
            <Link href="/app#agents" style={{ color: 'inherit', textDecoration: 'none' }}>Agents</Link>
            <Link href="/methodology" style={{ color: 'inherit', textDecoration: 'none' }}>Methodology</Link>
            <Link href="/verify" style={{ color: 'inherit', textDecoration: 'none' }}>Verify</Link>
          </div>
        </div>
        <Link href="/app" style={{
          background: 'rgb(0,82,255)', color: '#fff', fontSize: 13, fontWeight: 600,
          padding: '7px 16px', borderRadius: 7, textDecoration: 'none',
          transition: 'opacity 0.15s',
        }}>
          Check Score
        </Link>
      </nav>

      {/* HERO */}
      <section style={{ padding: '140px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(0,82,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Hero logo */}
          <img src="/logo-new.jpg" alt="Spawn" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', marginBottom: 24 }} />

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,82,255,0.1)', border: '1px solid rgba(0,82,255,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 32, fontSize: 12, fontWeight: 600, color: '#4D8EFF', fontFamily: 'JetBrains Mono, monospace', animation: 'fadeUp 0.5s ease forwards' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4D8EFF', boxShadow: '0 0 8px #4D8EFF', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            EigenLayer Verified TEEs · Base
          </div>

          {/* H1 */}
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em', color: 'rgb(240,240,240)', margin: '0 0 24px', animation: 'fadeUp 0.6s ease 0.1s both' }}>
            Trust Layer for<br />
            <span style={{ color: 'rgb(0,82,255)' }}>AI Agents</span>
          </h1>

          <p style={{ fontSize: 18, color: 'rgb(120,120,130)', fontWeight: 400, lineHeight: 1.6, margin: '0 auto 40px', maxWidth: 520, animation: 'fadeUp 0.6s ease 0.2s both' }}>
            Know before you ape. Reputation scores for every AI agent token on Base, computed inside tamper-proof EigenLayer TEEs.
          </p>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.6s ease 0.3s both' }}>
            <Link href="/app" style={{ background: 'rgb(0,82,255)', color: '#fff', fontSize: 14, fontWeight: 600, padding: '12px 28px', borderRadius: 8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Check Agent Score
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            </Link>
            <a href="https://t.me/agentspawn_bot" target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: 'rgb(120,120,130)', fontSize: 14, fontWeight: 500, padding: '12px 24px', borderRadius: 8, textDecoration: 'none', border: '1px solid rgb(28,28,28)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Telegram Bot
            </a>
          </div>
        </div>
      </section>

      {/* LIVE STATS BAR */}
      <section style={{ borderTop: '1px solid rgb(28,28,28)', borderBottom: '1px solid rgb(28,28,28)', padding: '16px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
          {[
            { label: 'Agents Indexed', value: '247+' },
            { label: 'Scores Computed', value: '1.2K+' },
            { label: 'Average Score', value: '61 / 100' },
            { label: 'Verified Agents', value: '18' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700, color: 'rgb(240,240,240)' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'rgb(120,120,130)', fontWeight: 500, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'rgb(0,82,255)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>How It Works</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: 0 }}>Scores you can trust</h2>
            <p style={{ fontSize: 15, color: 'rgb(120,120,130)', marginTop: 12, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>Every score is computed inside an EigenLayer verified TEE. Tamper-proof, transparent, autonomous.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              {
                step: '01',
                title: 'On-Chain Data Pulled',
                desc: 'Contract age, holder counts, LP stability, volume, and creator history fetched from Base and DexScreener.',
                color: 'rgb(0,82,255)',
              },
              {
                step: '02',
                title: 'Scored Inside TEE',
                desc: 'All inputs run through our scoring model inside an EigenLayer Verified TEE. No one, including us, can manipulate the output.',
                color: 'rgb(0,214,143)',
              },
              {
                step: '03',
                title: 'Grade Assigned',
                desc: 'A to F grade assigned based on weighted score. Methodology is fully public on /methodology.',
                color: '#4D8EFF',
              },
              {
                step: '04',
                title: 'Continuously Updated',
                desc: 'Scores update as on-chain data changes. Get alerted via Telegram when a score drops.',
                color: 'rgb(255,184,0)',
              },
            ].map(({ step, title, desc, color }, i) => (
              <div key={step} style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '24px', animation: `fadeUp 0.6s ease ${0.1 + i * 0.1}s both` }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color, fontWeight: 700, marginBottom: 12, letterSpacing: '0.08em' }}>{step}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'rgb(240,240,240)', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 14, color: 'rgb(120,120,130)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EIGEN TEE CALLOUT */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(0,82,255,0.08) 0%, rgba(139,92,246,0.06) 100%)', border: '1px solid rgba(0,82,255,0.2)', borderRadius: 16, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', animation: 'fadeIn 0.8s ease 0.3s both' }}>
            <div style={{ maxWidth: 520 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'rgb(139,92,246)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>EigenLayer Integration</div>
              <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 12px' }}>Verified Trusted Execution Environments</h3>
              <p style={{ fontSize: 15, color: 'rgb(120,120,130)', lineHeight: 1.6, margin: 0 }}>Spawn scoring runs inside EigenLayer verified TEEs. A cryptographically secured enclave where computation is provable. No one can manipulate a score: not the team, not a bad actor, not anyone.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }}>
              {['Tamper-proof scoring', 'Cryptographic attestation', 'Autonomous execution', 'Verifiable on-chain'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500, color: 'rgb(240,240,240)' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,214,143,0.15)', border: '1px solid rgba(0,214,143,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="rgb(0,214,143)" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GRADE SYSTEM */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'rgb(0,82,255)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Grading System</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: 0 }}>Read the signal instantly</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {[
              { grade: 'A', label: 'High Trust', range: '85–100', color: 'rgb(0,214,143)', desc: 'Strong signals across all factors' },
              { grade: 'B', label: 'Good', range: '70–84', color: '#4D8EFF', desc: 'Solid with minor gaps' },
              { grade: 'C', label: 'Moderate', range: '55–69', color: 'rgb(255,184,0)', desc: 'Review carefully before interacting' },
              { grade: 'D', label: 'Low', range: '40–54', color: '#FF8C00', desc: 'Significant risk signals present' },
              { grade: 'F', label: 'Very Low', range: '<40', color: 'rgb(255,59,59)', desc: 'High risk. Proceed with caution.' },
            ].map(({ grade, label, range, color, desc }, i) => (
              <div key={grade} style={{ background: 'rgb(14,14,14)', border: `1px solid ${color}25`, borderRadius: 12, padding: '20px 16px', textAlign: 'center', animation: `fadeUp 0.5s ease ${i * 0.08}s both` }}>
                <div style={{ fontSize: 40, fontWeight: 900, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1, marginBottom: 8 }}>{grade}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgb(240,240,240)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color, marginBottom: 8 }}>{range}</div>
                <div style={{ fontSize: 11, color: 'rgb(120,120,130)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 16, padding: '56px 40px' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 16px' }}>Know before you ape.</h2>
          <p style={{ fontSize: 16, color: 'rgb(120,120,130)', margin: '0 0 32px', lineHeight: 1.6 }}>Check any AI agent token on Base before you trade. Free, instant, and verifiable.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/app" style={{ background: 'rgb(0,82,255)', color: '#fff', fontSize: 14, fontWeight: 600, padding: '12px 28px', borderRadius: 8, textDecoration: 'none' }}>
              Check a Score
            </Link>
            <a href="https://t.me/agentspawn_bot" target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: 'rgb(120,120,130)', fontSize: 14, fontWeight: 500, padding: '12px 24px', borderRadius: 8, textDecoration: 'none', border: '1px solid rgb(28,28,28)' }}>
              Open Telegram Bot
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgb(28,28,28)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgb(70,70,80)' }}>spawn · trust layer for AI agents</span>
          <span style={{ fontSize: 12, color: 'rgb(50,50,60)' }}>·</span>
          <a href="https://twitter.com/danbuildss" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'rgb(70,70,80)', textDecoration: 'none' }}>Built by @danbuildss</a>
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'rgb(70,70,80)' }}>
          <Link href="/methodology" style={{ color: 'inherit', textDecoration: 'none' }}>Methodology</Link>
          <Link href="/verify" style={{ color: 'inherit', textDecoration: 'none' }}>Verify Agent</Link>
          <a href="https://t.me/agentspawn_bot" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Telegram</a>
          <a href="https://github.com/danbuildss/spawn-agent-reputation" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a>
        </div>
      </footer>
    </main>
  )
}
