import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  // If Supabase isn't configured, return empty array
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({
      agents: [],
      totalAgents: 0,
      verifiedCount: 0,
      totalVouched: 0,
      _note: 'Database not configured'
    })
  }

  try {
    // Fetch all agents from Supabase — featured agents first, then by score
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('featured', { ascending: false })
      .order('score', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      // Fallback to empty array if DB fails
      return NextResponse.json({
        agents: [],
        totalAgents: 0,
        verifiedCount: 0,
        totalVouched: 0
      })
    }

    const verifiedAgents = agents?.filter(a => a.status === 'verified') || []
    const totalVouched = agents?.reduce((sum, a) => sum + (parseFloat(a.vouched_eth) || 0), 0) || 0

    // Transform to match expected format
    const formattedAgents = agents?.map(agent => ({
      id: agent.contract_address,
      name: agent.name,
      token: agent.token,
      handle: agent.twitter ? `@${agent.twitter}` : '',
      description: agent.description || '',
      score: agent.score,
      vouched: parseFloat(agent.vouched_eth) || 0,
      reviews: 0,
      category: agent.category || 'Infrastructure',
      status: agent.status,
      gradient: getGradient(agent.category),
      logo: agent.name?.slice(0, 2) || '??',
      contract: agent.contract_address,
      twitter: agent.twitter,
      launchPlatform: 'virtuals',
      // Use unavatar.io to get profile pics from Twitter handles
      imageUrl: agent.twitter 
        ? `https://unavatar.io/twitter/${agent.twitter}` 
        : null,
      featured: agent.featured || false,
      featured_until: agent.featured_until || null,
    })) || []

    return NextResponse.json({
      agents: formattedAgents,
      totalAgents: agents?.length || 0,
      verifiedCount: verifiedAgents.length,
      totalVouched
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

function getGradient(category: string): string {
  const gradients: Record<string, string> = {
    'Infrastructure': 'from-blue-500 to-purple-600',
    'DeFi': 'from-green-500 to-emerald-600',
    'Social': 'from-pink-500 to-rose-600',
    'Analytics': 'from-cyan-500 to-blue-600',
    'Creative': 'from-orange-500 to-red-600',
    'Trading': 'from-yellow-500 to-orange-600',
    'Gaming': 'from-purple-500 to-indigo-600',
    'Security': 'from-red-500 to-pink-600'
  }
  return gradients[category] || 'from-gray-500 to-gray-700'
}
