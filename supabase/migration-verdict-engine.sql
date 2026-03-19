-- Verdict Engine: Job Evaluations
-- Phase 1 of SPAWN upgrade: Score + Decide

-- Job evaluations table (Job Memory)
CREATE TABLE IF NOT EXISTS job_evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id TEXT UNIQUE NOT NULL,
  agent_address TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'content',  -- content|api_output|code|analysis
  job_description TEXT NOT NULL,
  submission TEXT NOT NULL,
  verdict TEXT NOT NULL,                     -- approve|reject|review
  confidence DECIMAL(4,3) NOT NULL,          -- 0.000–1.000
  reasoning TEXT,
  score_before INTEGER,
  score_after INTEGER,
  score_delta INTEGER,                       -- positive or negative
  dispute_raised BOOLEAN DEFAULT FALSE,
  evaluator_version TEXT DEFAULT 'claude-sonnet-4-6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_evals_agent ON job_evaluations(agent_address);
CREATE INDEX IF NOT EXISTS idx_job_evals_created ON job_evaluations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_evals_verdict ON job_evaluations(verdict);

ALTER TABLE job_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read job_evaluations" ON job_evaluations FOR SELECT USING (true);
CREATE POLICY "Service role only inserts" ON job_evaluations FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role only updates" ON job_evaluations FOR UPDATE USING (true);

-- View: per-agent outcome stats (used by scoring engine)
CREATE OR REPLACE VIEW agent_outcome_stats AS
SELECT
  agent_address,
  COUNT(*) AS job_volume,
  ROUND(
    COUNT(*) FILTER (WHERE verdict = 'approve')::NUMERIC / NULLIF(COUNT(*), 0) * 100,
    1
  ) AS completion_rate,
  ROUND(
    COUNT(*) FILTER (WHERE verdict = 'reject')::NUMERIC / NULLIF(COUNT(*), 0) * 100,
    1
  ) AS rejection_rate,
  ROUND(AVG(confidence)::NUMERIC, 3) AS avg_confidence,
  COUNT(*) FILTER (WHERE dispute_raised = TRUE) AS dispute_count,
  MAX(created_at) AS last_job_at
FROM job_evaluations
GROUP BY agent_address;
