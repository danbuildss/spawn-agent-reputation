import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create clients if URL is configured
const isConfigured = supabaseUrl && supabaseUrl !== '' && !supabaseUrl.includes('placeholder')

export const supabase: SupabaseClient | null = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side client with service role (for admin operations)
export const supabaseAdmin: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey)
  : null

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => isConfigured

// Types (matches actual Supabase schema)
export interface Agent {
  id: string
  contract_address: string
  name: string
  token: string
  description?: string
  category: string
  twitter?: string
  score: number
  grade: string
  status: 'pending' | 'verified' | 'flagged'
  vouched_eth: number
  created_at: string
}

export interface Submission {
  id: string
  contract_address: string
  submitter_twitter?: string
  name?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
