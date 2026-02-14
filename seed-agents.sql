-- Seed initial agents for Spawn
-- Run in Supabase SQL Editor

INSERT INTO agents (contract_address, name, token, description, category, twitter, score, grade, status, vouched_eth, launch_platform)
VALUES 
  ('0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b', 'Virtuals Protocol', '$VIRTUAL', 'AI agent creation & deployment protocol on Base. The infrastructure layer for autonomous AI agents.', 'Infrastructure', 'virtikitten', 94, 'A', 'verified', 145.2, 'virtuals'),
  
  ('0x22af33fe49fd1fa80c7149773dde5890d3c76f3b', 'Bankr', '$BNKR', 'AI-powered financial agent for DeFi operations. Autonomous trading and portfolio management.', 'DeFi', 'bankaborhood', 95, 'A', 'verified', 89.5, 'virtuals'),
  
  ('0xacfe6019ed1a7dc6f7b508c02d1b04ec88cc21bb', 'Luna', '$LUNA', 'AI companion with advanced social intelligence. Engaging conversations and community building.', 'Social', 'luna_virtuals', 92, 'A', 'verified', 67.3, 'virtuals'),
  
  ('0xe3086852a4b125803c815a158249ae468a3254ca', 'AIXBT', '$AIXBT', 'AI trading intelligence agent. Real-time market analysis and trading signals.', 'Trading', 'aixbt_agent', 91, 'A', 'verified', 112.8, 'virtuals'),
  
  ('0x8888888888888888888888888888888888888888', 'VaderAI', '$VADER', 'Community-driven AI agent with meme capabilities. Creative content generation.', 'Creative', 'vader_ai_', 88, 'A', 'verified', 45.6, 'virtuals'),
  
  ('0x7777777777777777777777777777777777777777', 'Sekoia', '$SEKOIA', 'Security-focused AI agent. Smart contract auditing and risk assessment.', 'Security', 'sekaborhood', 86, 'A', 'verified', 34.2, 'virtuals'),
  
  ('0x6666666666666666666666666666666666666666', 'GAME', '$GAME', 'Gaming AI agent for blockchain games. Strategy optimization and automated gameplay.', 'Gaming', 'game_virtuals', 82, 'B', 'verified', 28.9, 'virtuals'),
  
  ('0x5555555555555555555555555555555555555555', 'Acolyt', '$ACO', 'Analytics AI agent. On-chain data analysis and insights generation.', 'Analytics', 'acolyt_ai', 79, 'B', 'verified', 19.4, 'clanker'),
  
  ('0x4444444444444444444444444444444444444444', 'Kwantxbt', '$KWANT', 'Quantitative trading AI. Algorithmic strategies and backtesting.', 'Trading', 'kwantxbt', 75, 'B', 'verified', 15.7, 'virtuals'),
  
  ('0x3333333333333333333333333333333333333333', 'Iona', '$IONA', 'Creative AI agent for art and music generation.', 'Creative', 'iona_ai', 72, 'B', 'pending', 8.3, 'clanker')

ON CONFLICT (contract_address) DO UPDATE SET
  name = EXCLUDED.name,
  token = EXCLUDED.token,
  description = EXCLUDED.description,
  score = EXCLUDED.score,
  grade = EXCLUDED.grade,
  status = EXCLUDED.status,
  vouched_eth = EXCLUDED.vouched_eth;
