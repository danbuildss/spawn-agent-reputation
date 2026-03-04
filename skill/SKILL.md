# Spawn Skill

Use this skill when the user asks about AI agent trust, reputation scores, contract safety, or wants to check an agent before trading.

## What You Can Do

- Check the reputation score for any Base contract address
- Look up a verified agent by name from the Spawn directory
- Get top-rated agents on Base
- Interpret score results clearly for the user

## API

Base URL: `https://agentspawn.xyz`

All requests require the header: `X-API-Key: {SPAWN_API_KEY}`

Get your free API key at: `https://agentspawn.xyz/app` (API tab)

### Score a contract address
```
GET /api/reputation?address={address}
```

Response fields:
- `score` (0–100)
- `grade` (A/B/C/D/F)
- `source` ("tee" = EigenLayer TEE attested, "onchain" = fallback)
- `verified` (boolean — Spawn-verified badge)
- `name`, `token`, `description`, `twitter`
- `breakdown` — scoring factors object
- `flags` — array of risk/trust signals
- `recommendation` — human-readable verdict

### Get top agents
```
GET /api/agents
```

Returns `agents` array sorted by featured first, then score descending.

### Check scores for multiple addresses
Run multiple `/api/reputation` calls in sequence.

## Grade Scale

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 85–100 | High trust — strong signals across all factors |
| B | 70–84 | Good standing — minor gaps |
| C | 55–69 | Moderate risk — proceed with caution |
| D | 40–54 | High risk — significant red flags |
| F | 0–39 | Critical risk — do not trade |

## How to Use

When a user pastes a contract address or asks "is this agent safe?":
1. Call `/api/reputation?address={address}`
2. Report: name, grade, score, key flags, recommendation
3. If grade is D or F — explicitly warn the user
4. If `source === "tee"` — mention it's cryptographically attested by EigenLayer

### Example response format:
```
Agent: AIXBT ($AIXBT)
Score: 89/100 — Grade A
Source: EigenLayer TEE (tamper-proof)
Verified: Yes

Key signals:
- Contract age: 180+ days
- Liquidity: $2.1M
- Holder count: 12,400

Recommendation: Strong trust profile. Well-established with healthy liquidity and holder distribution.
```

## Configuration

Add to your OpenClaw config or `.env`:
```
SPAWN_API_KEY=spwn_your_key_here
```

Free tier: 500 calls/day
Pro tier: 10,000 calls/day ($19/month) — upgrade at agentspawn.xyz/app

## When NOT to Use This Skill

- For tokens on Solana, Ethereum mainnet, or other chains — Spawn scores Base contracts only
- For NFT collections — scoring is designed for agent tokens
- If the address is not a valid 0x hex address

## Notes

- Scores update in real-time from on-chain data
- TEE-attested scores (`source: "tee"`) are cryptographically verified — no one can manipulate them
- Directory agents (85 curated) have pre-cached scores; any Base address can be scored live
