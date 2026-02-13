# Spawn - Agent Reputation OnChain

Institutional-grade trust infrastructure for AI agents. Built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

- **Glass Morphism Design**: Modern, sleek UI with glassmorphic cards and subtle gradients
- **Interactive Visualizations**: Floating agent nodes with connection lines, glowing orb representing trust
- **Smooth Animations**: Framer Motion powered transitions and scroll-based reveals
- **Responsive Layout**: Mobile-first design that scales beautifully
- **Trust Scores**: Prominent display of agent reputation with glowing badges
- **Horizontal Scrolling**: Touch-friendly agent carousel

## Design System

- **Background**: `#0a0a0a` with radial gradient (blue/purple glow)
- **Glass Cards**: `bg-white/5` with backdrop blur and `border-white/10`
- **Accent Color**: `#0052FF` (Base blue)
- **Typography**: White headlines, `gray-400` body text
- **Effects**: Glow effects on scores, hover states with lift and glow

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/spawn-agent-reputation)

**Two methods:**

1. **Fastest** (using CLIs):
   ```bash
   # Push to GitHub
   gh repo create spawn-agent-reputation --public --source=. --push
   
   # Deploy to Vercel
   vercel --prod
   ```

2. **Interactive**:
   ```bash
   ./deploy.sh
   ```

📖 **Full deployment guide**: See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions.

📋 **Step-by-step guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment documentation.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure

```
spawn-agent-reputation/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Navigation.tsx      # Top navigation bar
│   ├── Hero.tsx            # Hero with visualization
│   ├── Stats.tsx           # Statistics cards
│   ├── TopAgents.tsx       # Scrolling agent list
│   ├── HowItWorks.tsx      # Process steps
│   ├── CTA.tsx             # Call to action
│   └── Footer.tsx          # Footer links
└── public/                 # Static assets
```

## Key Components

### Hero Visualization
- Central glowing orb representing trust
- 6 floating agent nodes positioned in a circle
- SVG connection lines with gradients
- Smooth floating animations

### Top Agents Carousel
- Horizontal scrolling with arrow controls
- Glass morphic cards with agent details
- Trust score badges with glow effects
- Hover states with scale and background transitions

### How It Works
- Three-step process cards
- Icon-based visual hierarchy
- Numbered steps with gradient accents
- Hover animations

## Customization

Edit the design tokens in `tailwind.config.js`:
- Colors: Update the `accent` and `dark` values
- Animations: Modify keyframes and durations
- Breakpoints: Adjust responsive breakpoints

## Deployment

Build for production:

```bash
npm run build
npm start
```

Deploy to Vercel:

```bash
vercel
```

## License

MIT

---

Built on Base • © 2026 Spawn
