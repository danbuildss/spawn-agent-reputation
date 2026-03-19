import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''

// ── Score delta rules ─────────────────────────────────────────────
// Each verdict shifts the agent's score by a small amount.
// Confidence modulates the magnitude.
function computeScoreDelta(verdict: 'approve' | 'reject' | 'review', confidence: number): number {
  const magnitude = Math.round(confidence * 4) // 0–4 pts based on confidence
  if (verdict === 'approve') return Math.max(1, magnitude)
  if (verdict === 'reject')  return -Math.max(1, magnitude)
  return 0 // 'review' — neutral, needs human judgment
}

// ── Fetch current agent score from DB or reputation API ──────────
async function getAgentScore(agentAddress: string): Promise<number | null> {
  if (!supabaseAdmin) return null
  const { data } = await supabaseAdmin
    .from('agents')
    .select('score')
    .eq('contract_address', agentAddress.toLowerCase())
    .single()
  return data?.score ?? null
}

// ── Apply score delta to agents table ────────────────────────────
async function applyScoreDelta(
  agentAddress: string,
  delta: number,
  scoreBefore: number
): Promise<number> {
  const newScore = Math.max(0, Math.min(100, scoreBefore + delta))
  if (!supabaseAdmin || delta === 0) return newScore

  await supabaseAdmin
    .from('agents')
    .update({
      score: newScore,
      grade: newScore >= 85 ? 'A' : newScore >= 70 ? 'B' : newScore >= 55 ? 'C' : newScore >= 40 ? 'D' : 'F',
      updated_at: new Date().toISOString(),
    })
    .eq('contract_address', agentAddress.toLowerCase())

  return newScore
}

// ── LLM evaluator ─────────────────────────────────────────────────
async function evaluateWithClaude(
  jobDescription: string,
  submission: string,
  jobType: string,
  qualityThreshold: number
): Promise<{
  verdict: 'approve' | 'reject' | 'review'
  confidence: number
  reasoning: string
}> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

  const systemPrompt = `You are SPAWN's Verdict Engine — an objective evaluator of AI agent job submissions.

Your role: Determine whether an agent's submission adequately fulfills a job description.

Evaluation criteria vary by job type:
- content: accuracy, relevance, completeness, clarity
- api_output: correct format, complete data, no errors
- code: correctness, runs without errors, meets spec
- analysis: depth, accuracy, actionable insights

Quality threshold for approval: ${qualityThreshold} (0-1 scale, where 1.0 = perfect)

Respond ONLY with valid JSON in this exact format:
{
  "verdict": "approve" | "reject" | "review",
  "confidence": <float 0.0–1.0>,
  "reasoning": "<1-2 sentence explanation>"
}

Rules:
- "approve" = submission clearly fulfills the job
- "reject" = submission fails to meet requirements
- "review" = borderline, requires human judgment
- confidence reflects how certain you are of the verdict
- reasoning must be specific, not generic`

  const userPrompt = `Job Type: ${jobType}

Job Description:
${jobDescription}

Agent Submission:
${submission}

Evaluate this submission and return your verdict as JSON.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  // Parse JSON — strip markdown fences if present
  const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const result = JSON.parse(jsonStr)

  if (!['approve', 'reject', 'review'].includes(result.verdict)) {
    throw new Error(`Invalid verdict: ${result.verdict}`)
  }

  return {
    verdict: result.verdict as 'approve' | 'reject' | 'review',
    confidence: Math.max(0, Math.min(1, parseFloat(result.confidence))),
    reasoning: String(result.reasoning).slice(0, 500),
  }
}

// ── Main handler ──────────────────────────────────────────────────
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous'
  const rl = rateLimit(`evaluate-job:${ip}`, { windowMs: 60000, max: 20 })
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 20 evaluations per minute.' },
      { status: 429, headers: getRateLimitHeaders(rl) }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const {
    job_id,
    agent_address,
    job_description,
    submission,
    context = {},
  } = body as Record<string, any>

  // ── Input validation ─────────────────────────────────────────────
  if (!job_id || typeof job_id !== 'string' || job_id.length > 128) {
    return NextResponse.json({ error: 'job_id is required (max 128 chars).' }, { status: 400 })
  }
  if (!agent_address || !/^0x[a-fA-F0-9]{40}$/.test(agent_address)) {
    return NextResponse.json({ error: 'agent_address must be a valid 0x address.' }, { status: 400 })
  }
  if (!job_description || typeof job_description !== 'string' || job_description.trim().length < 10) {
    return NextResponse.json({ error: 'job_description must be at least 10 characters.' }, { status: 400 })
  }
  if (!submission || typeof submission !== 'string' || submission.trim().length < 1) {
    return NextResponse.json({ error: 'submission is required.' }, { status: 400 })
  }
  if (job_description.length > 4000) {
    return NextResponse.json({ error: 'job_description exceeds 4000 character limit.' }, { status: 400 })
  }
  if (submission.length > 8000) {
    return NextResponse.json({ error: 'submission exceeds 8000 character limit.' }, { status: 400 })
  }

  const validJobTypes = ['content', 'api_output', 'code', 'analysis']
  const jobType: string = validJobTypes.includes(context.job_type) ? context.job_type : 'content'
  const qualityThreshold: number =
    typeof context.quality_threshold === 'number'
      ? Math.max(0, Math.min(1, context.quality_threshold))
      : 0.7

  const normalizedAddress = agent_address.toLowerCase()

  try {
    // ── Run LLM evaluation ───────────────────────────────────────
    const evaluation = await evaluateWithClaude(
      job_description.trim(),
      submission.trim(),
      jobType,
      qualityThreshold
    )

    // ── Fetch current score ──────────────────────────────────────
    const scoreBefore = (await getAgentScore(normalizedAddress)) ?? 50

    // ── Compute score delta ──────────────────────────────────────
    const scoreDelta = computeScoreDelta(evaluation.verdict, evaluation.confidence)
    const scoreAfter = await applyScoreDelta(normalizedAddress, scoreDelta, scoreBefore)

    // ── Persist to Job Memory ────────────────────────────────────
    if (supabaseAdmin) {
      await supabaseAdmin.from('job_evaluations').upsert({
        job_id,
        agent_address: normalizedAddress,
        job_type: jobType,
        job_description: job_description.trim(),
        submission: submission.trim(),
        verdict: evaluation.verdict,
        confidence: evaluation.confidence,
        reasoning: evaluation.reasoning,
        score_before: scoreBefore,
        score_after: scoreAfter,
        score_delta: scoreDelta,
        evaluator_version: 'claude-sonnet-4-6',
      }, { onConflict: 'job_id' })
    }

    return NextResponse.json({
      job_id,
      agent_address: normalizedAddress,
      verdict: evaluation.verdict,
      confidence: evaluation.confidence,
      reasoning: evaluation.reasoning,
      score_before: scoreBefore,
      score_delta: scoreDelta,
      score_after: scoreAfter,
      job_type: jobType,
      evaluated_at: new Date().toISOString(),
    })

  } catch (error) {
    const msg = String(error)
    if (msg.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json(
        { error: 'Evaluator not configured. Set ANTHROPIC_API_KEY.' },
        { status: 503 }
      )
    }
    if (msg.includes('JSON') || msg.includes('verdict')) {
      return NextResponse.json(
        { error: 'Evaluator returned unexpected response. Try again.' },
        { status: 502 }
      )
    }
    console.error('[evaluate-job]', error)
    return NextResponse.json({ error: 'Evaluation failed.', details: msg }, { status: 500 })
  }
}

// ── GET: fetch evaluation history for an agent ────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Valid address required.' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  }

  const [historyRes, statsRes] = await Promise.all([
    supabaseAdmin
      .from('job_evaluations')
      .select('job_id, job_type, verdict, confidence, score_delta, created_at')
      .eq('agent_address', address.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(limit),
    supabaseAdmin
      .from('agent_outcome_stats')
      .select('*')
      .eq('agent_address', address.toLowerCase())
      .single(),
  ])

  return NextResponse.json({
    agent_address: address.toLowerCase(),
    stats: statsRes.data ?? null,
    evaluations: historyRes.data ?? [],
  })
}
