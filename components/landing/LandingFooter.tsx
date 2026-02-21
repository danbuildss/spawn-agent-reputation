'use client'

import Link from 'next/link'

export default function LandingFooter() {
  return (
    <footer className="py-8 px-4 border-t border-subtle">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div>
          Built by{' '}
          <a href="https://twitter.com/danbuildss" target="_blank" rel="noopener" className="text-foreground hover:text-accent transition-colors">
            @danbuildss
          </a>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/app" className="hover:text-foreground transition-colors">App</Link>
          <a href="https://t.me/agentspawn_bot" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">Telegram</a>
          <a href="https://twitter.com/agentspawn" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="https://docs.agentspawn.xyz" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">Docs</a>
        </div>
      </div>
    </footer>
  )
}
