# Spawn Skill for OpenClaw

Pre-trade reputation scoring for AI agent tokens on Base — powered by EigenLayer TEE attestation.

## What It Does

Adds AI agent trust scoring to your OpenClaw assistant. Ask your agent to check any Base contract address and get an instant reputation score before you trade.

## Install

1. Copy `SKILL.md` into your OpenClaw skills directory
2. Add your Spawn API key to your config:
   ```
   SPAWN_API_KEY=spwn_your_key_here
   ```
3. Get a free API key at **agentspawn.xyz/app** (API tab) — 500 calls/day free

## Usage Examples

- "Check this agent: 0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825"
- "Is AIXBT safe to trade?"
- "What's the Spawn score for 0x..."
- "Show me the top agents on Base"
- "Is this contract verified on Spawn?"

## Scoring

Scores 0–100 across 5 data sources:
- EigenLayer TEE (cryptographic attestation)
- BaseScan (contract age, holders)
- DexScreener (liquidity, volume)
- Bankr (agent identity)
- Virtuals Protocol (enrichment)

Grades: A (85+) · B (70+) · C (55+) · D (40+) · F (<40)

## Links

- Website: [agentspawn.xyz](https://agentspawn.xyz)
- Telegram Bot: [@agentspawn_bot](https://t.me/agentspawn_bot)
- API Docs: agentspawn.xyz/app (Methodology tab)
