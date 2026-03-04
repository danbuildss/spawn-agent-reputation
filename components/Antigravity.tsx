'use client'
import { useEffect, useRef, useCallback } from 'react'

interface AntigravityProps {
  count?: number
  magnetRadius?: number
  ringRadius?: number
  waveSpeed?: number
  waveAmplitude?: number
  particleSize?: number
  lerpSpeed?: number
  color?: string
  autoAnimate?: boolean
  particleVariance?: number
  rotationSpeed?: number
  depthFactor?: number
  pulseSpeed?: number
  particleShape?: 'capsule' | 'circle' | 'square'
  fieldStrength?: number
  className?: string
  style?: React.CSSProperties
}

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  depth: number
  angle: number
  speed: number
  phase: number
  ring: number
}

export default function Antigravity({
  count = 300,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = '#5227FF',
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10,
  className,
  style,
}: AntigravityProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 82, g: 39, b: 255 }
  }, [])

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = []
    const cx = w / 2
    const cy = h / 2
    const numRings = Math.max(3, Math.floor(ringRadius))
    const baseRingR = Math.min(w, h) * 0.12

    for (let i = 0; i < count; i++) {
      const ring = Math.floor(Math.random() * numRings)
      const r = baseRingR * (ring + 1) * (0.8 + Math.random() * 0.4)
      const angle = Math.random() * Math.PI * 2
      const depth = 0.3 + Math.random() * 0.7
      const variance = 1 + (Math.random() - 0.5) * particleVariance * 0.5

      particles.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        baseX: cx + Math.cos(angle) * r,
        baseY: cy + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        size: particleSize * variance * depth,
        depth,
        angle,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        ring,
      })
    }

    particlesRef.current = particles
  }, [count, ringRadius, particleSize, particleVariance])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      canvas.width = rect?.width || canvas.offsetWidth
      canvas.height = rect?.height || canvas.offsetHeight
      initParticles(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const rgb = hexToRgb(color)

    const drawCapsule = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) => {
      const len = size * 2.5
      const r = size * 0.7
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.roundRect(-len / 2, -r, len, r * 2, r)
      ctx.fill()
      ctx.restore()
    }

    const animate = () => {
      if (!canvas) return
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2

      ctx.clearRect(0, 0, w, h)

      timeRef.current += 0.016

      const t = timeRef.current
      const pulse = 1 + Math.sin(t * pulseSpeed) * 0.08
      const rotation = rotationSpeed * t

      const particles = particlesRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const magR = magnetRadius * 20

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Wave offset
        const waveX = Math.cos(t * waveSpeed + p.phase) * waveAmplitude * 6
        const waveY = Math.sin(t * waveSpeed * 0.7 + p.phase) * waveAmplitude * 4

        // Rotation
        if (rotationSpeed !== 0) {
          const dx = p.baseX - cx
          const dy = p.baseY - cy
          const r = Math.sqrt(dx * dx + dy * dy)
          const a = Math.atan2(dy, dx) + rotation * p.speed
          p.baseX = cx + Math.cos(a) * r
          p.baseY = cy + Math.sin(a) * r
        }

        // Pulse — scale ring radius
        const targetX = p.baseX * pulse + (1 - pulse) * cx + waveX
        const targetY = p.baseY * pulse + (1 - pulse) * cy + waveY

        // Magnetic repulsion from mouse
        const dxm = p.x - mx
        const dym = p.y - my
        const distM = Math.sqrt(dxm * dxm + dym * dym)

        if (distM < magR) {
          const force = (1 - distM / magR) * fieldStrength
          p.vx += (dxm / distM) * force
          p.vy += (dym / distM) * force
        }

        // Spring back to base + wave
        p.vx += (targetX - p.x) * lerpSpeed
        p.vy += (targetY - p.y) * lerpSpeed

        // Damping
        p.vx *= 0.88
        p.vy *= 0.88

        p.x += p.vx
        p.y += p.vy

        // Depth-based opacity + size
        const depthScale = 0.4 + p.depth * depthFactor * 0.6
        const alpha = 0.2 + p.depth * 0.8

        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`

        const sz = p.size * depthScale

        if (particleShape === 'capsule') {
          const angle = Math.atan2(p.vy, p.vx) || p.phase
          drawCapsule(ctx, p.x, p.y, sz, angle)
        } else if (particleShape === 'square') {
          ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, sz, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    if (autoAnimate) {
      frameRef.current = requestAnimationFrame(animate)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [color, autoAnimate, magnetRadius, ringRadius, waveSpeed, waveAmplitude, particleSize, lerpSpeed, particleVariance, rotationSpeed, depthFactor, pulseSpeed, particleShape, fieldStrength, hexToRgb, initParticles])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    />
  )
}
