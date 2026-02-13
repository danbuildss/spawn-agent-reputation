'use client'

import { Twitter } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-8 px-4 md:px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-4">
            <span className="font-medium text-foreground">spawn</span>
            <span className="text-muted-foreground">Agent Reputation Platform</span>
          </div>
          
          <div className="flex items-center gap-6 text-muted-foreground">
            <Link href="/submit" className="hover:text-foreground transition-colors">Submit</Link>
            <Link href="/featured" className="hover:text-foreground transition-colors">Featured</Link>
            <Link href="#api" className="hover:text-foreground transition-colors">API</Link>
            <a href="https://twitter.com/danbuildss" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Built on Base</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 Spawn</span>
            <a href="https://twitter.com/danbuildss" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Built by @danbuildss
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
