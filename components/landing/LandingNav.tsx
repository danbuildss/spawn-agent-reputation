'use client'

import Link from 'next/link'

export default function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 bg-background/80 backdrop-blur-sm border-b border-subtle">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-foreground">
          spawn
        </Link>
        <div className="flex items-center gap-4">
          <a 
            href="https://docs.agentspawn.xyz" 
            target="_blank" 
            rel="noopener"
            className="text-sm text-dim hover:text-foreground transition-colors"
          >
            Docs
          </a>
          <Link
            href="/app"
            className="px-4 py-2 bg-accent hover:bg-accent-dim text-white text-sm font-medium rounded-lg transition-colors"
          >
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  )
}
