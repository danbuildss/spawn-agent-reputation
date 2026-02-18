# Spawn - Trust Layer for AI Agents

## What is Spawn?

Spawn is a reputation protocol for AI agents on Base. We provide trust scores that help users verify whether an AI agent is legitimate before interacting with it.

Think of it as a "credit score" for AI agents — built from on-chain data, not opinions.

## The Problem

AI agents are exploding. Thousands launch daily on platforms like Virtuals, Clanker, and others. But there's no way to know:

- Is this agent legitimate?
- Will the team rug?
- Is the liquidity real?
- What's the creator's track record?

Users are flying blind. Scams are everywhere.

## The Solution

Spawn aggregates on-chain data to generate a **Trust Score (0-100)** for any AI agent on Base.

### How Scoring Works

| Factor | Weight | What We Check |
|--------|--------|---------------|
| Contract Age | 20 pts | How long the contract has been deployed |
| Liquidity | 25 pts | DEX pool depth and stability |
| Holders | 15 pts | Token distribution, whale concentration |
| LP Stability | 20 pts | Liquidity consistency, lock status |
| Volume | 10 pts | Trading activity (24h) |
| Creator Rep | 10 pts | Creator's on-chain history |

### Trust Grades

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 85-100 | High Trust — Safe to interact |
| B | 70-84 | Good — Proceed with normal caution |
| C | 55-69 | Moderate — Do additional research |
| D | 40-54 | Low — Exercise caution |
| F | 0-39 | Very Low — High risk |

## How to Use Spawn

### 1. Website
Visit [agentspawn.xyz](https://agentspawn.xyz) and:
- Browse verified agents
- Search by name or token
- Paste any contract address for instant live scoring

### 2. Telegram Bot
Message [@agentspawn_bot](https://t.me/agentspawn_bot):
```
/check 0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b
```

### 3. API
```bash
curl "https://agentspawn.xyz/api/reputation?address=0x..."
```

## Key Features

- **Live Scoring**: Paste any address, get instant reputation data
- **Verified Directory**: Curated list of trusted agents
- **Score Breakdown**: See exactly why an agent scored high or low
- **Risk Flags**: Automatic warnings for red flags
- **Free API**: Integrate scores into your own apps

## Who It's For

| User | Use Case |
|------|----------|
| **Investors** | Due diligence before buying agent tokens |
| **Developers** | Verify agents before integrating |
| **Platforms** | Curate agent marketplaces |
| **DAOs** | Vet agents before partnerships |

## Built on Base

Spawn is built natively on Base, optimized for the ecosystem's AI agents. We pull data from:
- DexScreener (liquidity, volume)
- BaseScan (contract age, creator)
- On-chain holder data

---

**Website:** [agentspawn.xyz](https://agentspawn.xyz)  
**Telegram:** [@agentspawn_bot](https://t.me/agentspawn_bot)  
**Twitter:** [@danbuildss](https://twitter.com/danbuildss)
