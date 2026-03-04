-- API Keys table for Spawn API access
-- Identifier: wallet address (XMTP delivery) OR email (screen display)
-- XMTP sender uses SPAWN_XMTP_PRIVATE_KEY env var with @xmtp/xmtp-js

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE,
  email TEXT UNIQUE,
  api_key TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free',
  calls_today INTEGER DEFAULT 0,
  calls_limit INTEGER DEFAULT 500,
  last_reset_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT must_have_identifier CHECK (wallet_address IS NOT NULL OR email IS NOT NULL)
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for api_keys" ON api_keys
  USING (true);
