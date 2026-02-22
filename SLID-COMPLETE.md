# Slid — Complete Product Bible

*"Agreements + Invoices + Payments. One swipe."*

**Built on Base | Farcaster Frame | BaseApp Mini App**
**By Why Base Media**

---

# PART 1: OVERVIEW

## What is Slid?

Slid combines **agreements, invoices, and payments** into one link. Freelancers and agencies send a single link — clients sign the scope, agree to terms, and pay instantly with USDC on Base. All in one swipe.

## The Problem

### Current Freelancer Workflow (Broken)

```
Day 1: Send agreement via Google Form or DocuSign
Day 2: Wait...
Day 3: Client signs
Day 4: Send invoice via email/PDF
Day 5: Wait...
Day 7: Client says "I'll pay tomorrow"
Day 10: Chase again
Day 14: Finally get paid
Day 15: Start work (2 weeks late)
```

**4 tools. Weeks of waiting. Constant chasing.**

### Slid Workflow (Fixed)

```
Minute 1: Create Slid (agreement + invoice)
Minute 2: Share link
Minute 3: Client opens, reads terms, swipes to pay
Minute 4: Money in wallet + signed agreement
Minute 5: Start work
```

**One link. One swipe. Done.**

## The Insight

**Agencies use Google Forms to send agreements and invoices.**
- Unprofessional
- No payment attached
- No proof of signature
- Manual tracking nightmare

**Slid replaces Google Forms + DocuSign + PayPal with one tool.**

---

## Core Value Propositions

### For Freelancers/Agencies
1. **Get paid before work starts** — Client commits with money
2. **No chasing payments** — Payment required to sign
3. **Professional agreements** — Not janky Google Forms
4. **On-chain proof** — Wallet signature = legal evidence
5. **Instant payments** — USDC hits wallet in seconds

### For Clients
1. **One-click process** — No switching between tools
2. **Clear terms** — Know exactly what they're paying for
3. **Easy payment** — Just swipe, no bank details
4. **Receipt included** — Proof of payment + agreement

---

## Competitive Advantage

| Feature | DocuSign | Request | Google Forms | PayPal | **Slid** |
|---------|----------|---------|--------------|--------|----------|
| Agreements | ✅ | ❌ | ✅ (basic) | ❌ | ✅ |
| Invoicing | ❌ | ✅ | ❌ | ✅ | ✅ |
| Crypto payments | ❌ | ✅ | ❌ | ❌ | ✅ |
| One-swipe flow | ❌ | ❌ | ❌ | ❌ | ✅ |
| On-chain proof | ❌ | ✅ | ❌ | ❌ | ✅ |
| Mini app native | ❌ | ❌ | ❌ | ❌ | ✅ |
| Price | $25/mo | Free+fees | Free | 2.9%+30¢ | Free+2% |

**No one combines all five. That's the moat.**

---

# PART 2: PRODUCT DETAILS

## User Flows

### Flow 1: Create a Slid (Freelancer)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  CREATE SLID                                    [Preview]   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CLIENT                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Name                                                │   │
│  │ [Acme Corp____________________________________]    │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Email (optional - for notifications)                │   │
│  │ [john@acme.com_______________________________]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  AMOUNT                                                     │
│  ┌──────────────────────┐  ┌────────────┐                  │
│  │ $ 500                │  │ USDC  ▼   │                  │
│  └──────────────────────┘  └────────────┘                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Due Date                                            │   │
│  │ [February 28, 2026___________________________]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DESCRIPTION                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Podcast editing - Episode 5                         │   │
│  │ Full edit with intro/outro                          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ☑ ADD AGREEMENT                                           │
│                                                             │
│  Scope of Work                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Edit 45-minute podcast episode                    │   │
│  │ • Remove background noise, ums, dead air            │   │
│  │ • Add intro music and outro                         │   │
│  │ • Deliver within 48 hours                           │   │
│  │ • 1 round of revisions included                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Terms & Conditions                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Payment due upon signing                          │   │
│  │ • Work begins after payment received                │   │
│  │ • Additional revisions: $50 each                    │   │
│  │ • Delivery via Google Drive                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ☐ Save as template for future use                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────┐                   │
│              │   CREATE SLID →         │                   │
│              └─────────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flow 2: Share Modal (After Create)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ✅ SLID CREATED                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  slid.money/p/xK7mN2                    [📋 Copy]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  SHARE VIA                                                  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Warpcast │  │ Telegram │  │    X     │  │  Email   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ WhatsApp │  │ Discord  │  │   Copy   │  │   More   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           [Go to Dashboard]                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flow 3: Client Payment Page (Swipe to Pay)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌────────┐                                                 │
│  │  pfp   │  dan.eth                                       │
│  └────────┘  Why Base Media                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│               AGREEMENT & INVOICE                           │
│                                                             │
│               Invoice #SLD-0042                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PROJECT                                                    │
│  Podcast editing - Episode 5                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SCOPE OF WORK                                      │   │
│  │                                                     │   │
│  │  • Edit 45-minute podcast episode                   │   │
│  │  • Remove background noise, ums, dead air           │   │
│  │  • Add intro music and outro                        │   │
│  │  • Deliver within 48 hours                          │   │
│  │  • 1 round of revisions included                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TERMS                                              │   │
│  │                                                     │   │
│  │  • Payment due upon signing                         │   │
│  │  • Work begins after payment received               │   │
│  │  • Additional revisions: $50 each                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    AMOUNT DUE                               │
│                                                             │
│                   $500.00                                   │
│                    USDC                                     │
│                                                             │
│                Due: Feb 28, 2026                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ☑ I agree to the scope and terms above            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Your balance: 2,340.50 USDC ✓                             │
│                                                             │
│  ╔═════════════════════════════════════════════════════╗   │
│  ║                                                     ║   │
│  ║   ○─────────────────────────────────────────▶      ║   │
│  ║              SIGN & PAY $500                        ║   │
│  ║                                                     ║   │
│  ╚═════════════════════════════════════════════════════╝   │
│                                                             │
│                  Powered by Slid                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flow 4: Payment Success

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                      ┌─────────┐                            │
│                      │         │                            │
│                      │    ✓    │                            │
│                      │         │                            │
│                      └─────────┘                            │
│                                                             │
│                   SIGNED & PAID                             │
│                                                             │
│                   $500.00 USDC                              │
│                    to dan.eth                               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Agreement signed: Feb 22, 2026, 2:34 PM UTC                │
│  Payment confirmed: Feb 22, 2026, 2:34 PM UTC               │
│                                                             │
│  Transaction: 0x7a3f...8c2d                                 │
│  [View on BaseScan ↗]                                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           📄 Download Receipt (PDF)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           📤 Share Receipt                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                                                             │
│                  Powered by Slid                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flow 5: Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Logo] Slid                           dan.eth [●] [⚙️]    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  OVERVIEW                               [+ Create Slid]    │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  $4,250     │  │     23      │  │      4      │        │
│  │  Total      │  │   Total     │  │  Awaiting   │        │
│  │  Earned     │  │   Slids     │  │  Payment    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  RECENT SLIDS                                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Acme Corp                    $500        ✅ Paid   │   │
│  │  Podcast editing - Ep 5       Feb 22               │   │
│  │                                            [View]   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Web3 Studio                  $1,200    ⏳ Pending  │   │
│  │  Website redesign             Feb 21               │   │
│  │                        [Copy Link] [Send Reminder]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  DeFi Protocol                $2,500    ⏳ Pending  │   │
│  │  Smart contract audit         Feb 20               │   │
│  │                        [Copy Link] [Send Reminder]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                      [View All →]                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TEMPLATES                                                  │
│                                                             │
│  ┌────────────────┐  ┌────────────────┐                    │
│  │ Podcast Edit   │  │ Consulting     │                    │
│  │ $500 • 3 used  │  │ $150/hr • 1    │                    │
│  └────────────────┘  └────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Farcaster Frame

When shared on Warpcast, Slid appears as interactive Frame:

```
┌─────────────────────────────────────────────────────────────┐
│  @danbuildss                                                │
│  Invoice for @acmecorp — podcast editing 🎙️                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │               S L I D                               │   │
│  │                                                     │   │
│  │         Agreement & Invoice                         │   │
│  │                                                     │   │
│  │            $500 USDC                                │   │
│  │                                                     │   │
│  │        Podcast editing - Ep 5                       │   │
│  │         Due: Feb 28, 2026                           │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [💳 Sign & Pay]         [📄 View Details]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Client clicks "Sign & Pay" → Opens payment page → Swipes → Done

**Viral potential:** Others see the Frame, learn about Slid, start using it.

---

## BaseApp Mini App

Slid as a native mini app inside Base ecosystem:

### Discovery
- Listed on base.org/apps or BaseApp directory
- Category: Finance / Payments
- Tagged: Invoicing, Freelance, Payments

### Mini App Flow
```
Open BaseApp → Find Slid → Wallet already connected → Create/View Slids
```

No separate login. No wallet connection needed. Just works.

---

# PART 3: BRANDING

## Name & Domain

| Element | Value |
|---------|-------|
| Name | **Slid** |
| Pronunciation | "Slid" (like "slid into DMs") |
| Domain | slid.money |
| Backup domains | slidpay.xyz, getslid.xyz |

## Taglines

**Primary:**
> "Agreements + Invoices + Payments. One swipe."

**Alternatives:**
- "Sign. Pay. Done."
- "The contract that pays itself."
- "Get paid before you start working."
- "One swipe from idea to income."

## Color Palette

| Color | Hex | RGB | Use |
|-------|-----|-----|-----|
| Background | #0A0A0B | 10, 10, 11 | Page background |
| Surface | #141416 | 20, 20, 22 | Cards, modals |
| Surface Light | #1C1C1F | 28, 28, 31 | Hover states |
| Border | #2A2A2D | 42, 42, 45 | Dividers, borders |
| Primary | #00D47E | 0, 212, 126 | CTAs, success (money green) |
| Primary Hover | #00B86B | 0, 184, 107 | Button hover |
| Secondary | #3B82F6 | 59, 130, 246 | Links, secondary actions |
| Text | #FAFAFA | 250, 250, 250 | Primary text |
| Text Muted | #71717A | 113, 113, 122 | Secondary text |
| Text Dim | #52525B | 82, 82, 91 | Disabled, hints |
| Error | #EF4444 | 239, 68, 68 | Errors |
| Warning | #F59E0B | 245, 158, 11 | Warnings |

## Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headlines | Inter | 700 (Bold) | 32-48px |
| Subheads | Inter | 600 (Semi) | 20-24px |
| Body | Inter | 400 (Regular) | 16px |
| Small | Inter | 400 | 14px |
| Mono (amounts) | JetBrains Mono | 500 | 16-32px |

## Logo Ideas

### Concept 1: Swipe Arrow
```
    ──────────▶
   S L I D
```
Simple arrow showing the swipe motion.

### Concept 2: Abstract S + Arrow
```
    ╭──╮
    │  ╰──▶
    ╰──╮
       │
    ───╯
```
Letter S formed with swipe motion.

### Concept 3: Minimal Wordmark
```
   slid.
```
Clean lowercase with period. Professional, simple.

### Concept 4: Circle Swipe
```
    ┌─────────┐
    │ ○────▶  │
    └─────────┘
      slid
```
The swipe interaction as the logo.

### Concept 5: Checkmark Flow
```
    ────▶ ✓
     slid
```
Swipe leads to completion.

**Recommendation:** Concept 3 (minimal wordmark) or Concept 4 (circle swipe) — both work well at small sizes and represent the product clearly.

---

# PART 4: TECHNICAL SPEC

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 14 (App Router) | Fast, React, SSR |
| Styling | Tailwind CSS | Rapid development |
| Animation | Framer Motion | Swipe interactions |
| Wallet | RainbowKit + wagmi + viem | Best wallet UX |
| Database | Supabase (Postgres) | Free tier, realtime |
| Auth | SIWE | Wallet-based, no passwords |
| Payments | Direct USDC transfer | No custom contract needed |
| Hosting | Vercel | One-click deploy |
| Frame | Frog framework | Farcaster Frames |
| Mini App | Base Mini App SDK | BaseApp integration |

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  address TEXT PRIMARY KEY,
  ens_name TEXT,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free', -- 'free' | 'pro'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Slids (invoices with agreements)
CREATE TABLE slids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_id TEXT UNIQUE DEFAULT nanoid(7),
  
  -- Creator
  creator_address TEXT NOT NULL REFERENCES users(address),
  
  -- Client
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_address TEXT, -- Filled when they pay
  
  -- Invoice details
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USDC',
  due_date DATE,
  
  -- Agreement (optional)
  has_agreement BOOLEAN DEFAULT FALSE,
  scope_of_work TEXT,
  terms TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'cancelled' | 'expired'
  
  -- Payment
  payment_tx TEXT,
  paid_at TIMESTAMP,
  paid_amount NUMERIC,
  
  -- Agreement signature
  agreement_signed_at TIMESTAMP,
  agreement_signature TEXT, -- Wallet signature
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_address TEXT NOT NULL REFERENCES users(address),
  name TEXT NOT NULL,
  title TEXT,
  description TEXT,
  amount NUMERIC,
  scope_of_work TEXT,
  terms TEXT,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_slids_creator ON slids(creator_address);
CREATE INDEX idx_slids_short_id ON slids(short_id);
CREATE INDEX idx_slids_status ON slids(status);
```

## Key Constants

```typescript
// contracts.ts
export const CONTRACTS = {
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
} as const;

export const CHAIN = {
  id: 8453,
  name: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
} as const;
```

## Payment Flow (No Custom Contract)

```typescript
// Simple ERC20 transfer
async function paySlid(slid: Slid) {
  const amount = parseUnits(slid.amount.toString(), 6); // USDC has 6 decimals
  
  const tx = await writeContract({
    address: CONTRACTS.USDC,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [slid.creator_address, amount],
  });
  
  // Update database
  await supabase
    .from('slids')
    .update({
      status: 'paid',
      payment_tx: tx.hash,
      paid_at: new Date(),
      paid_amount: slid.amount,
      client_address: userAddress,
    })
    .eq('id', slid.id);
    
  return tx;
}
```

## File Structure

```
slid/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind + custom styles
│   │
│   ├── (auth)/
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Dashboard
│   │   ├── create/
│   │   │   └── page.tsx            # Create slid
│   │   ├── slid/
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Slid detail
│   │   └── settings/
│   │       └── page.tsx            # Settings
│   │
│   ├── p/
│   │   └── [shortId]/
│   │       └── page.tsx            # Public pay page
│   │
│   ├── receipt/
│   │   └── [id]/
│   │       └── page.tsx            # Receipt page
│   │
│   └── api/
│       ├── slid/
│       │   ├── route.ts            # Create/list slids
│       │   └── [id]/
│       │       └── route.ts        # Get/update slid
│       ├── frame/
│       │   └── route.tsx           # Farcaster Frame
│       └── og/
│           └── route.tsx           # OG image generation
│
├── components/
│   ├── ui/                         # Base components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── SwipeToPay.tsx              # Swipe component
│   ├── SlidCard.tsx                # Invoice display
│   ├── CreateSlidForm.tsx          # Create form
│   ├── ShareModal.tsx              # Share options
│   ├── Navbar.tsx                  # Navigation
│   ├── WalletButton.tsx            # Connect wallet
│   └── Stats.tsx                   # Dashboard stats
│
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── wagmi.ts                    # Wallet config
│   ├── contracts.ts                # Contract addresses
│   ├── utils.ts                    # Helpers
│   └── types.ts                    # TypeScript types
│
├── public/
│   ├── logo.svg
│   ├── og-image.png
│   └── favicon.ico
│
├── .env.local                      # Environment variables
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

# PART 5: ROADMAP

## Week 1: MVP

**Goal:** Working product, 5 real slids paid

| Day | Tasks |
|-----|-------|
| **Day 1** | Project setup (Next.js, Tailwind, RainbowKit), Supabase schema, Deploy skeleton to Vercel |
| **Day 2** | Landing page, Connect wallet (SIWE), Basic dashboard layout |
| **Day 3** | Create slid form (with agreement option), Save to database, Generate short link |
| **Day 4** | Public pay page, Swipe-to-pay component, USDC transfer integration |
| **Day 5** | Receipt page, Dashboard with slid list, Copy link + status display |
| **Day 6** | Polish, fix bugs, mobile responsive |
| **Day 7** | Test with 5 real users, fix issues |

**Deliverables:**
- [ ] slid.money live
- [ ] Create → Share → Pay flow working
- [ ] 5 real slids created and paid

## Week 2: Distribution

**Goal:** 25 users, 50 slids, launch publicly

| Day | Tasks |
|-----|-------|
| **Day 8** | Farcaster Frame implementation |
| **Day 9** | OG image generation (pretty link previews) |
| **Day 10** | Launch tweet + Farcaster cast |
| **Day 11** | Post in communities (/base, freelancer groups) |
| **Day 12** | DM outreach to 20 freelancers |
| **Day 13** | Collect feedback, prioritize fixes |
| **Day 14** | Fix top 3 issues |

**Deliverables:**
- [ ] Farcaster Frame working
- [ ] Launch announcement (100+ likes target)
- [ ] 25 users, 50 slids

## Week 3: Iteration

**Goal:** Product-market fit signals

| Task | Why |
|------|-----|
| User interviews (5 calls) | Understand real needs |
| Email notifications | "You got paid!" alerts |
| Payment reminders | Reduce chasing |
| Templates | Save common slid types |
| Testimonials | Social proof |

**Deliverables:**
- [ ] 5 user interviews
- [ ] Email notifications working
- [ ] 3 testimonials collected

## Week 4: Monetization

**Goal:** First Pro subscriber

| Task | Why |
|------|-----|
| Pro tier ($9/mo) | Test willingness to pay |
| 0.5% vs 2% fee logic | Pro benefit |
| Custom branding | Logo on invoices |
| Priority support | Pro perk |

**Deliverables:**
- [ ] Pro tier live
- [ ] First paying customer
- [ ] Fee logic working

## Month 2: Scale

**Goal:** 100 users, BaseApp listing

| Task | Why |
|------|-----|
| BaseApp mini app submission | Ecosystem distribution |
| Recurring slids | Retainers, subscriptions |
| Multi-currency (ETH) | User request |
| PDF export | Professional receipts |
| Analytics dashboard | Track performance |

## Month 3: Growth

**Goal:** 500 users, $2K MRR

| Task | Why |
|------|-----|
| Team accounts | Agency tier |
| API for integrations | Developer adoption |
| Referral program | Growth loop |
| Content marketing | SEO, guides |
| Escrow/milestones | Larger projects |

---

# PART 6: BUSINESS

## Revenue Model

### Free Tier
- Unlimited slids
- 2% fee on payments
- Basic features

### Pro Tier — $9/month
- 0.5% fee on payments
- Email notifications
- Custom branding (logo on invoices)
- Priority support
- Templates (unlimited)

### Team Tier — $29/month (Future)
- Everything in Pro
- 3 team members
- Shared dashboard
- Client management

### Agency Tier — $79/month (Future)
- Everything in Team
- 10 team members
- White-label option
- API access
- Dedicated support

## Financial Projections

### Month 1
| Metric | Target |
|--------|--------|
| Users | 100 |
| Slids created | 200 |
| Total volume | $10,000 |
| Revenue (2% avg) | $200 |

### Month 3
| Metric | Target |
|--------|--------|
| Users | 500 |
| Slids created | 1,000 |
| Total volume | $50,000 |
| Pro subscribers | 20 |
| Revenue | $1,000 (fees) + $180 (pro) = $1,180 |

### Month 6
| Metric | Target |
|--------|--------|
| Users | 2,000 |
| Monthly volume | $200,000 |
| Pro subscribers | 80 |
| Revenue | $3,000 (fees) + $720 (pro) = $3,720 |

## Ideal Customer Profile

### Primary: Web3 Freelancers
- Smart contract devs, designers, writers, marketers
- Already have wallets, paid in crypto
- Use Twitter, Farcaster, Telegram
- Pain: Late payments, unprofessional invoicing

### Secondary: Small Agencies (2-10 people)
- Dev shops, design studios, marketing agencies
- Multiple clients, need organization
- Want professional tools

### Where to Find Them
- Crypto Twitter
- Farcaster (/base, /founders, /freelance)
- Developer DAO, Superteam
- Telegram freelancer groups
- Web3 job boards

---

# PART 7: RISKS & MITIGATION

## Why Slid Might Fail

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| No one needs this | Medium | High | Validate with 10 users in week 1. Kill fast if no traction. |
| Can't get distribution | Medium | High | Use existing audience (10.8K followers + podcast). |
| Competitors copy | Low | Medium | Move fast, build community, brand matters. |
| Won't pay fees | Medium | Medium | Free tier with fees is still cheaper than PayPal (2.9%). |
| Regulatory | Low | High | Non-custodial, P2P. No money transmission. |
| Smart contract risk | Low | High | No custom contracts in MVP. Just ERC20 transfers. |
| You get distracted | High | High | Set deadline: 10 paying users in 30 days or pause. |

## Kill Criteria

**30 days:** < 10 users with paid slids → Pause
**60 days:** < $500 MRR → Evaluate if worth continuing

---

# PART 8: LAUNCH CHECKLIST

## Pre-Launch
- [ ] Domain (slid.money) purchased and configured
- [ ] Vercel project set up
- [ ] Supabase database created
- [ ] Environment variables configured
- [ ] Basic analytics (Plausible or similar)

## MVP Launch (Day 5)
- [ ] Landing page live
- [ ] Create slid flow working
- [ ] Pay page with swipe working
- [ ] Dashboard showing slids
- [ ] Mobile responsive

## Public Launch (Day 10)
- [ ] Farcaster Frame working
- [ ] OG images generating
- [ ] 5 real slids paid (proof it works)
- [ ] Launch tweet drafted
- [ ] Farcaster cast drafted

## Launch Day
- [ ] Tweet goes live
- [ ] Farcaster cast goes live
- [ ] Post in /base channel
- [ ] DM 20 freelancer friends
- [ ] Monitor for bugs

---

# SUMMARY

## What is Slid?
**Agreements + Invoices + Payments in one swipe.**

## Who is it for?
**Web3 freelancers and agencies who want to get paid instantly.**

## What's the moat?
**No one else combines agreements + invoicing + crypto payments.**

## How does it make money?
**2% fee (free) or $9/mo + 0.5% (pro).**

## Where does it live?
**Web app + Farcaster Frame + BaseApp mini app.**

## When do we ship?
**MVP in 5 days. Public launch Day 10.**

---

**Ready to build. Send UI samples when ready.** 🔨
