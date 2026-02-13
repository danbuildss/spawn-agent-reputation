'use client'

import { Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-6">
          <span className="font-medium text-white">spawn</span>
          <span className="text-gray-600">The agent reputation directory</span>
        </div>
        
        <div className="flex items-center gap-6 text-gray-500">
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          <a href="#api" className="hover:text-white transition-colors">API</a>
          <a href="#" className="hover:text-white transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
          <span className="text-gray-600">Built on Base</span>
        </div>
      </div>
    </footer>
  )
}
