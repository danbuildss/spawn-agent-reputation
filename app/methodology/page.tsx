import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Methodology — Spawn',
  description: 'How Spawn scores are computed inside EigenLayer verified TEEs.',
}

export default function MethodologyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'rgb(8,8,8)', padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgb(70,70,80)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
          ← Back
        </Link>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgb(0,82,255)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Methodology</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgb(240,240,240)', margin: '0 0 16px' }}>How Spawn Scores Work</h1>
        <p style={{ fontSize: 16, color: 'rgb(120,120,130)', lineHeight: 1.7, margin: '0 0 48px' }}>All scores are computed inside EigenLayer Verified Trusted Execution Environments (TEEs). The methodology is fully public.</p>

        {[
          { name: 'Contract Age', weight: 20, color: 'rgb(0,82,255)', desc: 'Older contracts have had more time to demonstrate reliability. New contracts (&lt;7 days) score 0. Contracts &gt;90 days score full points.' },
          { name: 'Liquidity Depth', weight: 25, color: 'rgb(0,214,143)', desc: 'Total liquidity depth on-chain from DexScreener. &lt;$10K = 0pts, &gt;$500K = full 25pts. Deep liquidity reduces rug risk.' },
          { name: 'Holder Count', weight: 15, color: '#4D8EFF', desc: 'Number of unique holders from BaseScan. More distributed ownership = lower manipulation risk.' },
          { name: 'LP Stability', weight: 20, color: 'rgb(255,184,0)', desc: 'Checks if liquidity is locked and for how long. Locked LP = full points. Unlocked LP is a significant risk signal.' },
          { name: 'Volume Pattern', weight: 10, color: '#A78BFA', desc: 'Healthy, consistent volume over time vs. spike-and-drop patterns. Bots and wash trading are flagged.' },
          { name: 'Creator Reputation', weight: 10, color: 'rgb(255,59,59)', desc: 'Creator wallet history: previous rug pulls, successful projects, Ethos Network score.' },
        ].map(({ name, weight, color, desc }) => (
          <div key={name} style={{ background: 'rgb(14,14,14)', border: '1px solid rgb(28,28,28)', borderRadius: 12, padding: '20px 24px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'rgb(240,240,240)' }}>{name}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color }}>{weight} pts</div>
            </div>
            <div style={{ background: 'rgb(28,28,28)', borderRadius: 4, height: 4, marginBottom: 12 }}>
              <div style={{ height: '100%', width: `${weight}%`, background: color, borderRadius: 4 }} />
            </div>
            <p style={{ fontSize: 14, color: 'rgb(120,120,130)', lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={{ __html: desc }} />
          </div>
        ))}

        <div style={{ marginTop: 40, background: 'rgba(0,82,255,0.06)', border: '1px solid rgba(0,82,255,0.2)', borderRadius: 12, padding: '24px' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgb(240,240,240)', marginBottom: 8 }}>EigenLayer TEE Verification</div>
          <p style={{ fontSize: 14, color: 'rgb(120,120,130)', lineHeight: 1.6, margin: 0 }}>Every Spawn score is computed inside an EigenLayer Verified TEE — a hardware-secured enclave where the computation is cryptographically attested. This means no one, including the Spawn team, can manipulate a score output. The result is tamper-proof and verifiable on-chain.</p>
        </div>
      </div>
    </div>
  )
}
