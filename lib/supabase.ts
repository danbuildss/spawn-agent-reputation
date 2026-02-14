import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (for admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)

// Types
export interface Agent {
  id: string
  contract_address: string
  name: string
  token: string
  description: string
  category: string
  twitter?: string
  website?: string
  logo_url?: string
  launch_platform?: string
  score: number
  grade: string
  status: 'pending' | 'verified' | 'flagged'
  vouched_eth: number
  review_count: number
  created_at: string
  updated_at: string
  verified_at?: string
}

export interface Submission {
  id: string
  contract_address: string
  submitter_address?: string
  submitter_twitter?: string
  name?: string
  description?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_at?: string
  review_notes?: string
}

export interface Vouch {
  id: string
  agent_id: string
  voucher_address: string
  amount_eth: number
  tx_hash?: string
  created_at: string
}
