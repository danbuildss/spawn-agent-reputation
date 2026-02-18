'use client'

import { Twitter, Send } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="py-8 px-4 md:px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="relative w-5 h-5">
              <Image src="/logo.png" alt="Spawn" fill className="object-contain" />
            </div>
            <span className="font-light tracking-wider text-white lowercase">spawn</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400 text-xs">Trust Layer for AI Agents</span>
          </div>
          
          <div className="flex items-center gap-6 text-gray-400">
            <Link href="/submit" className="hover:text-amber-400 transition-colors">Submit</Link>
            <Link href="/featured" className="hover:text-amber-400 transition-colors">Featured</Link>
            <a 
              href="https://docs.agentspawn.xyz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-amber-400 transition-colors"
            >
              Docs
            </a>
            <a 
              href="https://t.me/agentspawn_bot" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              Bot
            </a>
            <a 
              href="https://twitter.com/danbuildss" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-amber-400 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 mt-6 pt-6 border-t border-white/5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Built on Base</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 Spawn</span>
            <a 
              href="https://twitter.com/danbuildss" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-amber-400 transition-colors"
            >
              Built by @danbuildss
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
