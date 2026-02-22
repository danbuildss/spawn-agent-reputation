'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 px-4 md:px-6 border-t border-white/5"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-5 h-5">
              <Image
                src="/logo.png"
                alt="Spawn"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-light tracking-wider text-dim lowercase font-mono">spawn</span>
          </Link>
          
          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted font-mono">
            <Link href="/app" className="hover:text-foreground transition-colors">App</Link>
            <a href="https://t.me/agentspawn_bot" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">Telegram</a>
            <a href="https://twitter.com/agentspawnxyz" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="https://docs.agentspawn.xyz" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">Docs</a>
          </div>
          
          {/* Built by */}
          <div className="text-sm text-muted font-mono">
            Built by{' '}
            <a href="https://twitter.com/danbuildss" target="_blank" rel="noopener" className="text-foreground hover:text-accent transition-colors">
              @danbuildss
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
