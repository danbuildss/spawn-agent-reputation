# SPAWN Roadmap: From Score Layer → Execution Layer

## What You've Built (V1 — Shipped ✅)

SPAWN is fully functional AI agent trust scoring infrastructure for the Base blockchain.

- TEE-powered reputation scoring (EigenLayer attestation)
- 5-source data pipeline: BaseScan + DexScreener + Bankr + Virtuals + Ethos
- Agent directory (100+ agents indexed on Base)
- Agent detail pages with full score breakdown
- Verified badge ($29 USDC, auto-verified on-chain)
- Featured agent slots ($49/month)
- Telegram bot (@agentspawn_bot): /check, /top, /stats, /alert, /verify, /help
- API key system (free 500/day, pro $19/month)
- XMTP notification on verification approval
- OG score card image (/api/og/agent)
- Admin dashboard (agentspawn.xyz/admin)
- Share + "Share on X" on agent detail pages
- Auto payment verification via BaseScan tx check

### Current Scoring Model

```
Signals → Score (0–100)

contract_age       (20 pts)  — time on-chain
liquidity_depth    (25 pts)  — DexScreener liquidity
holder_count       (15 pts)  — BaseScan holders
lp_stability       (20 pts)  — volume/liquidity ratio
volume_24h         (10 pts)  — 24h trading volume
creator_reputation (10 pts)  — Ethos Network score
```

**What this gives you:** A passive analytics layer. You tell users *who to trust*, but SPAWN doesn't act on that trust yet.

---

## The Upgrade: Score + Decide

The shift: **passive scoring → active decision-making**

```
Before:  signals → score  (analytics)
After:   signals + outcomes → score + verdict  (execution)
```

SPAWN becomes the **default evaluator API** for agent commerce. Any marketplace, workflow, or protocol calls SPAWN to decide whether to approve or reject an agent's work output.

This is not a new product. It's one new primitive on top of everything you built: **the Verdict Engine**.

---

## Verdict Engine

### New Endpoint: `POST /api/evaluate-job`

```json
Input:
{
  "job_id": "uuid",
  "agent_address": "0x...",
  "job_description": "Summarize this research report",
  "submission": "The report covers...",
  "context": {
    "job_type": "content|api_output|code|analysis",
    "quality_threshold": 0.7
  }
}

Output:
{
  "verdict": "approve|reject|review",
  "confidence": 0.91,
  "reasoning": "Output matches job description. Quality above threshold.",
  "score_delta": +2,
  "updated_score": 84,
  "job_id": "uuid",
  "evaluated_at": "2026-03-19T..."
}
```

### How It Works

1. Pull current agent score from scoring engine
2. Evaluate submission against job description (LLM evaluator)
3. Record verdict in Job Memory table
4. Update agent score with outcome delta
5. Return verdict + updated score

---

## Score Model Upgrade

### New Outcome Variables

| Variable | Points | Description |
|---|---|---|
| `completion_rate` | 12 | % accepted jobs vs total — core trust signal |
| `avg_evaluator_confidence` | 8 | Mean confidence across all verdicts |
| `job_volume` | 5 | Total job count — proof of real demand |
| `rejection_rate` | 5 | Inverse (lower = better) |
| `dispute_count` | 0 to -10 | Penalty for contested verdicts |

### Updated Score Formula

```
Upgraded (6 signals + 5 outcomes = 100 pts):

  [on-chain signals: 70 pts]
    contract_age       (15)
    liquidity_depth    (20)
    holder_count       (10)
    lp_stability       (15)
    volume_24h         (10)

  [outcome signals: 30 pts]
    completion_rate    (12)
    avg_confidence     (8)
    job_volume         (5)
    rejection_rate     (5)
    dispute_count      (0 to -10 penalty)
```

On-chain signals establish baseline trust. Outcomes prove delivery. The combination is impossible to game.

---

## Job Memory Layer

Lightweight off-chain store first. Migrates on-chain in Phase 6.

### New Table: `job_evaluations`

```sql
CREATE TABLE job_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT UNIQUE NOT NULL,
  agent_address TEXT NOT NULL,
  job_type TEXT NOT NULL,           -- content|api_output|code|analysis
  job_description TEXT NOT NULL,
  submission TEXT NOT NULL,
  verdict TEXT NOT NULL,            -- approve|reject|review
  confidence DECIMAL(4,3),          -- 0.000–1.000
  reasoning TEXT,
  score_before INTEGER,
  score_delta INTEGER,              -- positive or negative
  dispute_raised BOOLEAN DEFAULT FALSE,
  evaluator_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Every evaluation makes future evaluations better. This is your training layer and moat.

---

## UI Upgrades

### Agent Directory Cards

```
Current:
  Virtuals Protocol  $VIRTUAL
  Score: 99  Grade: A

Upgraded:
  Virtuals Protocol  $VIRTUAL
  Score: 99  Grade: A
  Completion: 94%    Jobs: 1,204
  Last 10: ████████░░  8/10 approved
```

### Alert Messages

```
Current:
  "Score changed for 0xabc..."

Upgraded:
  "⚠️ Agent 0xabc rejected on $500 job → score -6 (91 → 85)"
  "✓ Agent 0xdef approved 3 consecutive jobs → score +4 (72 → 76)"
```

---

## Phased Implementation Plan

### Phase 1 — Verdict Engine MVP (This Week)

**Goal:** Ship `/evaluate-job`, run 20 real examples, post results publicly.

- [ ] Add `job_evaluations` table to Supabase migration
- [ ] Build `POST /api/evaluate-job` endpoint
  - Input validation (job_id, agent_address, description, submission)
  - LLM evaluation call (Claude API)
  - Score delta calculation + write to DB
  - Return verdict + updated score
- [ ] Update agent score in `agents` table on each verdict
- [ ] Add computed stats view: `completion_rate`, `rejection_rate`, `job_volume` per agent

**Deliverable:** Working endpoint you can demo and post about.

---

### Phase 2 — Score Model Upgrade (Week 2)

**Goal:** Outcomes feed back into scores in real time.

- [ ] Add outcome weighting to `lib/score-utils.ts`
- [ ] Create `get_agent_outcome_stats(address)` DB function
- [ ] Update `/api/reputation` to blend on-chain signals + outcome history
- [ ] Recompute scores for agents with job history
- [ ] Add score trajectory sparkline to agent detail page

**Deliverable:** Scores that change based on real delivery, not just on-chain signals.

---

### Phase 3 — UI + Alerts Upgrade (Week 2–3)

**Goal:** Make the data feel alive.

- [ ] Add completion rate + job history bar to `AgentDirectory.tsx` cards
- [ ] Add "Last 10 jobs" section to `/agent/[address]` detail page
- [ ] Upgrade Telegram alerts to include job context (amount, type, score delta)
- [ ] Add job history tab on agent detail page
- [ ] Update `Stats.tsx` to show total evaluations run + avg confidence

**Deliverable:** Directory that shows live proof of delivery.

---

### Phase 4 — ACP Job Endpoints + Distribution (Week 3–4)

**Goal:** Become the default evaluator API for agent marketplaces.

- [ ] Expose `/evaluate-job` on public API with auth
- [ ] Add evaluation tier to API key access
- [ ] Write integration docs (how any marketplace calls SPAWN to decide outcomes)
- [ ] ACP job endpoints (ERC-8004) — SPAWN as hireable agent on Virtuals ACP:
  - `score_agent`: 0.50 VIRTUAL, 2min
  - `risk_check`: 1.00 VIRTUAL, 3min
  - `evaluate_job`: 1.50 VIRTUAL, 3min
  - `batch_score`: 2.00 VIRTUAL, 5min
- [ ] Telegram bot: `/evaluate` command

**Deliverable:** External platforms can integrate SPAWN as their evaluator.

---

### Phase 5 — Token Model Upgrade (Month 2)

**Goal:** Align incentives around evaluation quality.

```
Current:
  token = governance + verification

Upgraded:
  stake to become evaluator  → earn fees for correct decisions
  slash for wrong decisions  → skin in the game
  dispute resolution staking → community challenges bad verdicts
```

- [ ] Evaluator staking contract
- [ ] Fee routing: portion of job fees → staked evaluators
- [ ] Dispute mechanism: contest verdict + stake challenge fee
- [ ] Slashing: consistently overridden verdicts → stake penalty
- [ ] Evaluator leaderboard (accuracy, volume, fees earned)

---

### Phase 6 — On-Chain Job Memory (Month 2–3)

**Goal:** Verdicts become cryptographically verifiable.

- [ ] ERC-8183 integration for job evaluation events
- [ ] TEE-signed verdicts (extend existing EigenCloud verifier)
- [ ] Merkle proof of job history for any agent address
- [ ] Move verdict storage from Supabase → on-chain event log hybrid
- [ ] LP lock detection added to scoring

---

### Phase 7 — Expansion (Month 3+)

- [ ] Self-serve API Pro upgrade ($19/month, no manual step)
- [ ] Weekly market report (automated Monday: grades distribution, capital flow)
- [ ] DEX/trading bot grade widget embed
- [ ] Score Risk Banner API for DeFi frontends
- [ ] Multi-chain expansion (Solana, Ethereum mainnet)
- [ ] Agent-to-agent watchlist
- [ ] Public API docs page (OpenAPI spec)
- [ ] Shareable Telegram score card image (sendPhoto in bot)

---

## What NOT to Build Right Now

- Full ERC-8183 standard (not needed for Phase 1–3)
- Multi-chain (nail Base first)
- Decentralized evaluator network (Phase 5+ only)
- Mobile app
- Full governance UI
- Rebuild the existing scoring — extend it, don't replace it

---

## Positioning

**Old:** "Trust scores for AI agents"

**New:** "SPAWN decides who gets paid."

Or: "Scores tell you who to trust. SPAWN enforces it."

The shift:
- Analytics layer → passive, shows data
- **Decision layer → active, controls outcomes**

That's a different category. The second category wins.

---

## This Week (Focus on only this)

```
1. Build /evaluate-job
2. Run 20 real job evaluations manually
3. Show before/after score changes
4. Post the results publicly
```

That single endpoint repositions SPAWN from a dashboard to infrastructure.
