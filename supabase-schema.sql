-- Spawn Agent Reputation - Database Schema
-- Run this in Supabase SQL Editor

-- Agents table (main directory)
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_address TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  token TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Infrastructure',
  twitter TEXT,
  website TEXT,
  logo_url TEXT,
  launch_platform TEXT,
  score INTEGER DEFAULT 0,
  grade TEXT DEFAULT 'F',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'flagged')),
  vouched_eth DECIMAL(18, 8) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Submissions table (pending reviews)
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_address TEXT NOT NULL,
  submitter_address TEXT,
  submitter_twitter TEXT,
  name TEXT,
  description TEXT,
  category TEXT,
  twitter TEXT,
  website TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT
);

-- Vouches table (trust stakes)
CREATE TABLE vouches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  voucher_address TEXT NOT NULL,
  amount_eth DECIMAL(18, 8) NOT NULL,
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table (user reviews)
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  reviewer_address TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_agents_contract ON agents(contract_address);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_score ON agents(score DESC);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_vouches_agent ON vouches(agent_id);

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouches ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for agents
CREATE POLICY "Agents are viewable by everyone" ON agents
  FOR SELECT USING (true);

-- Public read access for submissions (to check status)
CREATE POLICY "Submissions are viewable by everyone" ON submissions
  FOR SELECT USING (true);

-- Public insert for submissions
CREATE POLICY "Anyone can submit" ON submissions
  FOR INSERT WITH CHECK (true);

-- Public read for vouches
CREATE POLICY "Vouches are viewable by everyone" ON vouches
  FOR SELECT USING (true);

-- Public read for reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Insert some initial agents (optional - remove if migrating from existing data)
INSERT INTO agents (contract_address, name, token, description, category, twitter, score, grade, status, vouched_eth, launch_platform)
VALUES 
  ('0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b', 'Virtuals Protocol', '$VIRTUAL', 'AI agent creation & deployment protocol on Base', 'Infrastructure', 'virtikitten', 94, 'A', 'verified', 145.2, 'virtuals'),
  ('0x22af33fe49fd1fa80c7149773dde5890d3c76f3b', 'Bankr', '$BNKR', 'AI financial agent for DeFi operations', 'DeFi', 'bankaborhood', 95, 'A', 'verified', 89.5, 'virtuals'),
  ('0xacfe6019ed1a7dc6f7b508c02d1b04ec88cc21bb', 'Luna', '$LUNA', 'AI companion with social intelligence', 'Social', 'luna_virtuals', 92, 'A', 'verified', 67.3, 'virtuals'),
  ('0xe3086852a4b125803c815a158249ae468a3254ca', 'AIXBT', '$AIXBT', 'AI trading intelligence agent', 'Trading', 'aixbt_agent', 91, 'A', 'verified', 112.8, 'virtuals'),
  ('0x1234567890abcdef1234567890abcdef12345678', 'Agent Meme', '$MEME', 'Community-driven meme agent', 'Creative', 'agent_meme', 72, 'B', 'verified', 23.4, 'clanker');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for agents table
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- View for featured agents (top verified)
CREATE VIEW featured_agents AS
SELECT * FROM agents
WHERE status = 'verified' AND score >= 85
ORDER BY score DESC, vouched_eth DESC
LIMIT 10;

-- View for recently added
CREATE VIEW recent_agents AS
SELECT * FROM agents
ORDER BY created_at DESC
LIMIT 10;
