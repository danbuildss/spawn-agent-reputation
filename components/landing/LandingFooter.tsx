'use client'

import { Twitter, Send, Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingFooter() {
  return (
    <footer className="py-12 px-4 md:px-6 border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="Spawn" fill className="object-contain" />
              </div>
              <span className="font-light tracking-wider text-foreground lowercase text-lg">spawn</span>
            </div>
            <p className="text-sm text-dim max-w-sm leading-relaxed">
              The trust layer for AI agents. Cryptographically verified reputation scores 
              powered by EigenLayer TEE and Ethos Network.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-dim">
              <li>
                <Link href="/app" className="hover:text-foreground transition-colors">
                  Launch App
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-foreground transition-colors">
                  Submit Agent
                </Link>
              </li>
              <li>
                <a href="https://docs.agentspawn.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://t.me/agentspawn_bot" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Telegram Bot
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-dim">
              <li>
                <a 
                  href="https://twitter.com/agentspawn_xyz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  @agentspawn_xyz
                </a>
              </li>
              <li>
                <a 
                  href="https://t.me/agentspawn" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/danbuildss/spawn-agent-reputation" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Built on Base • Powered by EigenLayer</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 Spawn</span>
            <span className="text-white/20">•</span>
            <a 
              href="https://twitter.com/danbuildss" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground transition-colors"
            >
              Built by @danbuildss
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
