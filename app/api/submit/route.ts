import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contractAddress, name, description, category, twitter, submitterTwitter } = body

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

    // Create submission (matches actual schema)
    const { data: submission, error } = await supabaseAdmin
      .from('submissions')
      .insert({
        contract_address: contractAddress.toLowerCase(),
        name: name || null,
        submitter_twitter: submitterTwitter || null,
        status: 'pending'
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

    return NextResponse.json({
      success: true,
      message: 'Agent submitted for review',
      submissionId: submission.id,
      status: 'pending'
    })

  } catch (error) {
    console.error('Submit API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
