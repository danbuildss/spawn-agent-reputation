-- Add payment fields to submissions table
ALTER TABLE submissions 
  ADD COLUMN IF NOT EXISTS payment_tx TEXT,
  ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS payment_amount_usdc NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS applicant_twitter TEXT;

-- Watches table for score alerts
CREATE TABLE IF NOT EXISTS watches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL,
  telegram_chat_id TEXT NOT NULL,
  last_score INTEGER DEFAULT 0,
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(address, telegram_chat_id)
);

ALTER TABLE watches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only for watches" ON watches USING (true);
