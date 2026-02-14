# Spawn - AI Agent Reputation Protocol

> Trust infrastructure for AI agents on Base

## 🌐 Live Product

- **Website:** https://agentspawn.xyz
- **Telegram Bot:** [@agentspawn_bot](https://t.me/agentspawn_bot)
- **API:** https://agentspawn.xyz/api/reputation?address=0x...
- **GitHub:** https://github.com/danbuildss/spawn-agent-reputation

---

## 📦 What's Built (MVP)

### ✅ Website (Next.js + Tailwind)
| Feature | Status | Description |
|---------|--------|-------------|
| Homepage | ✅ Done | Hero, stats, featured agents |
| Agent Directory | ✅ Done | Search, filters, categories |
| Agent Detail Pages | ✅ Done | Score breakdown, links, info |
| Dynamic Pages | ✅ Done | Works for ANY contract address |
| Submit Form | ✅ Done | Submit new agents for review |
| Mobile Responsive | ✅ Done | Works on all devices |

### ✅ Reputation API
| Endpoint | Status | Description |
|----------|--------|-------------|
| GET /api/reputation | ✅ Done | Check any token's reputation |
| GET /api/agents | ✅ Done | List all indexed agents |
| POST /api/submit | ✅ Done | Submit new agent |

**Scoring System (0-100):**
- Contract Age: 20 pts
- Liquidity: 25 pts
- Holders: 15 pts
- LP Stability: 20 pts
- Volume: 10 pts
- Creator Reputation: 10 pts

**Grades:**
- A (85-100): High Trust ✅
- B (70-84): Good
- C (55-69): Moderate ⚠️
- D (40-54): Low
- F (<40): Very Low 🚨

### ✅ Telegram Bot (@agentspawn_bot)
| Command | Status | Description |
|---------|--------|-------------|
| /check <address> | ✅ Done | Check any contract |
| /top | ✅ Done | Top 10 verified agents |
| /stats | ✅ Done | Platform statistics |
| /help | ✅ Done | Usage guide |
| Command Menu | ✅ Done | Auto-complete on "/" |

### ✅ Database (Supabase)
| Table | Status | Description |
|-------|--------|-------------|
| agents | ✅ Done | Indexed agents directory |
| submissions | ✅ Done | Pending review queue |

### ✅ Integrations
| Service | Status | Description |
|---------|--------|-------------|
| DexScreener | ✅ Live | Real-time liquidity/volume |
| BaseScan | ✅ Ready | Contract verification |
| Supabase | ✅ Connected | Database |
| Vercel | ✅ Deployed | Hosting |

---

## 🚧 What's Left to Build

### Phase 2: Enhanced Data (Week 1-2)
| Feature | Priority | Description |
|---------|----------|-------------|
| Bankr API Integration | High | Pull AI agent data from Bankr |
| Real holder counts | High | BaseScan API for actual holders |
| LP lock detection | High | Check if liquidity is locked |
| Creator wallet history | Medium | Analyze deployer's past projects |
| Ethos Network scores | Medium | Creator reputation scores |

### Phase 3: User Features (Week 2-3)
| Feature | Priority | Description |
|---------|----------|-------------|
| Wallet connect | High | Sign in with wallet |
| Vouch system | High | Stake ETH to vouch for agents |
| User reviews | Medium | Rate and review agents |
| Watchlist | Medium | Track favorite agents |
| Alerts | Low | Notify on score changes |

### Phase 4: Agent-to-Agent (Week 3-4)
| Feature | Priority | Description |
|---------|----------|-------------|
| Agent verification | High | Agents verify themselves via API |
| Agent vouching | High | Agents vouch for other agents |
| Trust graph | Medium | Visualize agent relationships |
| API keys | Medium | Rate-limited API access for agents |

### Phase 5: Growth (Week 4+)
| Feature | Priority | Description |
|---------|----------|-------------|
| Chrome extension | Medium | Check scores while browsing |
| Discord bot | Medium | /check command in Discord |
| Embeddable badges | Low | "Verified on Spawn" badges |
| Leaderboards | Low | Weekly/monthly rankings |

---

## 💰 Monetization Opportunities

1. **API Access** - Paid tiers for high-volume queries
2. **Verification Fee** - Small fee for expedited review
3. **Premium Badges** - Enhanced visibility for verified agents
4. **B2B Integrations** - License to launchpads (Virtuals, Clanker)
5. **Agent SDK** - Paid SDK for agent-to-agent trust

---

## 🎯 Key Metrics to Track

- Total agents indexed
- Daily API calls
- Bot users
- Submissions per week
- Verified vs pending ratio

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes, Supabase
- **Database:** PostgreSQL (Supabase)
- **Bot:** Node.js, node-telegram-bot-api
- **APIs:** DexScreener, BaseScan, Ethos Network
- **Hosting:** Vercel
- **Domain:** agentspawn.xyz

---

## 📞 Contact

- **Builder:** @danbuildss
- **Twitter:** https://twitter.com/danbuildss
- **Telegram:** @danbuildsss

---

*Last updated: February 14, 2026*
