import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit'

async function verifyUsdcPayment(txHash: string): Promise<{ valid: boolean; amount?: number; error?: string }> {
  const BASESCAN_KEY = process.env.BASESCAN_API_KEY
  const PAYMENT_ADDRESS = '0xdbefd1adb7af527a63037cc6ab14ff545c407b27'
  const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
  const MIN_AMOUNT = 28 // $28 minimum (allow slight slippage)

  try {
    // Get tx receipt from BaseScan
    const res = await fetch(
      `https://api.basescan.org/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${BASESCAN_KEY}`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    if (data.result?.status !== '1') return { valid: false, error: 'Transaction failed or not found' }

    // Check ERC-20 token transfers for USDC to payment address
    const logsRes = await fetch(
      `https://api.basescan.org/api?module=account&action=tokentx&contractaddress=${USDC_CONTRACT}&address=${PAYMENT_ADDRESS}&txhash=${txHash}&apikey=${BASESCAN_KEY}`,
      { signal: AbortSignal.timeout(8000) }
    )
    const logsData = await logsRes.json()
    const transfers = (logsData.result || []).filter((t: any) =>
      t.to?.toLowerCase() === PAYMENT_ADDRESS.toLowerCase() &&
      t.contractAddress?.toLowerCase() === USDC_CONTRACT.toLowerCase()
    )

    if (!transfers.length) return { valid: false, error: 'No USDC transfer to payment address found in this tx' }

    // USDC has 6 decimals
    const amount = parseInt(transfers[0].value) / 1_000_000
    if (amount < MIN_AMOUNT) return { valid: false, error: `Amount too low: $${amount.toFixed(2)} (minimum $${MIN_AMOUNT})` }

    return { valid: true, amount }
  } catch (e: any) {
    return { valid: false, error: e.message }
  }
}

export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    return NextResponse.json(
      { error: 'Submissions are temporarily disabled. Please try again later.' },
      { status: 503 }
    )
  }

  // Rate limiting: 5 submissions per minute per IP (stricter)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'anonymous'
  const rateLimitResult = rateLimit(`submit:${ip}`, { windowMs: 60000, max: 5 })
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many submissions. Try again later.' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    )
  }

  try {
    const body = await request.json()
    
    // Check payload size (10KB max)
    if (JSON.stringify(body).length > 10000) {
      return NextResponse.json(
        { error: 'Request payload too large' },
        { status: 413 }
      )
    }
    
    const { contractAddress, name, description, category, twitter, submitterTwitter, paymentTx, website, applicantTwitter } = body

    // Validate required fields
    if (!contractAddress) {
      return NextResponse.json(
        { error: 'Contract address is required' },
        { status: 400 }
      )
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      return NextResponse.json(
        { error: 'Invalid contract address format' },
        { status: 400 }
      )
    }
    
    // Validate optional fields
    if (name && (typeof name !== 'string' || name.length > 100)) {
      return NextResponse.json(
        { error: 'Name must be a string under 100 characters' },
        { status: 400 }
      )
    }
    
    if (submitterTwitter && !/^@?[a-zA-Z0-9_]{1,15}$/.test(submitterTwitter)) {
      return NextResponse.json(
        { error: 'Invalid Twitter handle format' },
        { status: 400 }
      )
    }

    // Check if already submitted or exists
    const { data: existing } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('contract_address', contractAddress.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'This agent is already indexed', agentId: existing.id },
        { status: 409 }
      )
    }

    // Check pending submissions
    const { data: pendingSubmission } = await supabaseAdmin
      .from('submissions')
      .select('id')
      .eq('contract_address', contractAddress.toLowerCase())
      .eq('status', 'pending')
      .single()

    if (pendingSubmission) {
      return NextResponse.json(
        { error: 'This agent is already pending review', submissionId: pendingSubmission.id },
        { status: 409 }
      )
    }

    // Auto-verify payment on-chain if paymentTx provided
    let paymentVerified = false
    let paymentAmount: number | undefined
    let paymentWarning: string | undefined
    let autoApproved = false

    if (paymentTx) {
      const verification = await verifyUsdcPayment(paymentTx)
      if (verification.valid) {
        paymentVerified = true
        paymentAmount = verification.amount
      } else {
        paymentWarning = verification.error
      }
    }

    const submissionStatus = paymentVerified ? 'approved' : 'pending'

    // Create submission (matches actual schema)
    const { data: submission, error } = await supabaseAdmin
      .from('submissions')
      .insert({
        contract_address: contractAddress.toLowerCase(),
        name: name || null,
        submitter_twitter: submitterTwitter || null,
        payment_tx: paymentTx || null,
        payment_verified: paymentVerified,
        payment_amount_usdc: paymentAmount || null,
        website: website || null,
        applicant_twitter: applicantTwitter || null,
        status: submissionStatus
      })
      .select()
      .single()

    if (error) {
      console.error('Submission error:', error)
      return NextResponse.json(
        { error: 'Failed to submit agent' },
        { status: 500 }
      )
    }

    // If auto-approved, upsert into agents table
    if (paymentVerified && submission) {
      await supabaseAdmin.from('agents').upsert({
        contract_address: contractAddress.toLowerCase(),
        name: name || 'Unknown',
        token: '',
        description: null,
        twitter: submitterTwitter || applicantTwitter || null,
        website: website || null,
        status: 'verified',
        verified_at: new Date().toISOString(),
        score: 0,
        grade: 'F',
      }, { onConflict: 'contract_address' })
      autoApproved = true
    }

    const message = autoApproved
      ? 'Payment verified on-chain. Your agent has been auto-approved and is now in the directory.'
      : paymentWarning
        ? `Application submitted. Payment could not be verified: ${paymentWarning}. Review within 48 hours.`
        : 'Application submitted. Review within 48 hours.'

    return NextResponse.json({
      success: true,
      paymentVerified,
      autoApproved,
      message,
      submissionId: submission.id,
      status: submissionStatus
    })

  } catch (error) {
    console.error('Submit API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
