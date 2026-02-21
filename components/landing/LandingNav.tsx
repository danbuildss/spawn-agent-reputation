'use client'

import Link from 'next/link'

export default function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-white">
          spawn
        </Link>
        <div className="flex items-center gap-4">
          <a 
            href="https://docs.agentspawn.xyz" 
            target="_blank" 
            rel="noopener"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Docs
          </a>
          <Link
            href="/app"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  )
}
