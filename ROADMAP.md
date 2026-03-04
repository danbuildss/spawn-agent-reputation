# Spawn Roadmap

## V1 — Shipped ✅
- TEE-powered reputation scoring (EigenLayer attestation)
- 5-source data pipeline: TEE + BaseScan + DexScreener + Bankr + Virtuals Protocol
- Curated directory (85 agents, Base AI agents)
- Agent detail pages with full score breakdown
- Verified badge ($29 USDC, auto-verified on-chain)
- Featured agent slots ($49/month)
- Telegram bot (@agentspawn_bot): /check, /top, /stats, /verify, /help — DM + group chat
- API key system (free 500/day, pro $19/month)
- XMTP notification on verification approval
- OG score card image (/api/og/agent)
- Admin dashboard (agentspawn.xyz/admin)
- Share + "Share on X" on agent detail pages
- Auto payment verification via BaseScan tx check

## V2 — Planned
### High Priority
- [ ] Score change alerts (/alert) — Telegram notifications when agent score moves ±10
- [ ] ACP job endpoints (ERC-8004) — Spawn as a hireable agent on Virtuals ACP
  - score_agent: 0.50 VIRTUAL, 2min
  - risk_check: 1.00 VIRTUAL, 3min
  - verify_status: 0.10 VIRTUAL, 1min
  - top_agents: 0.50 VIRTUAL, 1min
  - batch_score: 2.00 VIRTUAL, 5min
- [ ] LP lock detection — detect whether liquidity is locked, add to scoring
- [ ] Self-serve API Pro upgrade ($19/month, no manual step)
- [ ] Shareable Telegram score card image (sendPhoto in bot)

### Medium Priority
- [ ] Weekly market report (automated Monday post — grades distribution, capital flow stats)
- [ ] DEX/trading bot grade widget embed
- [ ] Score Risk Banner API for DeFi frontends
- [ ] Automated featured payment (Stripe or USDC, no Telegram contact needed)
- [ ] Virtuals token graduation milestone tracking

### Later
- [ ] Group chat score alert subscriptions
- [ ] Multi-chain expansion (Solana, Ethereum mainnet)
- [ ] Agent-to-agent watchlist (agents monitoring other agents)
- [ ] Public API docs page (OpenAPI spec)
