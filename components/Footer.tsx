'use client'

import { Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-white">spawn</span>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
              <span>Built on Base</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
            <a href="#api" className="hover:text-white transition-colors">API</a>
            <a href="#" className="hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
          
          <span className="text-xs text-gray-600">© 2026 Spawn</span>
        </div>
      </div>
    </footer>
  )
}
