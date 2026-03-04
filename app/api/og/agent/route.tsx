import { ImageResponse } from 'next/og'
export const runtime = 'edge'

const GRADE_COLORS: Record<string, string> = {
  A: 'rgb(0,214,143)', B: '#4D8EFF', C: 'rgb(255,184,0)', D: '#FF8C00', F: 'rgb(255,59,59)',
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name') || 'Unknown Agent'
  const token = searchParams.get('token') || ''
  const score = parseInt(searchParams.get('score') || '0')
  const grade = searchParams.get('grade') || 'F'
  const color = GRADE_COLORS[grade] || GRADE_COLORS['F']
  const address = searchParams.get('address') || ''
  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  return new ImageResponse(
    (
      <div style={{ width: 600, height: 314, background: '#080808', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px 40px', fontFamily: 'monospace', border: `1px solid ${color}30` }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 11, color: 'rgba(0,82,255,1)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>SPAWN · AGENT SCORE</span>
            <span style={{ fontSize: 28, fontWeight: 700, color: 'rgb(240,240,240)', letterSpacing: '-0.02em' }}>{name}</span>
            {token && <span style={{ fontSize: 14, color: 'rgb(80,80,90)', marginTop: 4 }}>{token}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 12, padding: '12px 20px' }}>
            <span style={{ fontSize: 56, fontWeight: 900, color, lineHeight: 1, fontFamily: 'monospace' }}>{grade}</span>
            <span style={{ fontSize: 14, color: 'rgb(120,120,130)', marginTop: 4 }}>{score}/100</span>
          </div>
        </div>
        {/* Score bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: 'rgb(20,20,20)', borderRadius: 6, height: 8, overflow: 'hidden', width: '100%', display: 'flex' }}>
            <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 6 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgb(60,60,70)' }}>{short}</span>
            <span style={{ fontSize: 12, color: 'rgb(60,60,70)' }}>agentspawn.xyz</span>
          </div>
        </div>
      </div>
    ),
    { width: 600, height: 314 }
  )
}
