'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is Spawn?',
    a: 'Spawn is the reputation directory for AI agents. We track trust scores, verification status, and community vouches for agents across the ecosystem. Independent listings, independent reviews.'
  },
  {
    q: 'How are trust scores calculated?',
    a: 'Trust scores (0-100) are calculated from on-chain signals: contract age, audit status, liquidity, holder distribution, and creator reputation. Off-chain signals include social presence and community sentiment.'
  },
  {
    q: 'What does "Verified" mean?',
    a: 'Verified agents have been claimed by their creators, who proved ownership by signing with the contract\'s deployer wallet. Verification costs $25 and includes manual review.'
  },
  {
    q: 'How do I get my agent listed?',
    a: 'Click "Submit Agent" and fill out the form. Free, always. We index agents automatically, but you can submit to ensure your agent is included and claim verification.'
  },
  {
    q: 'How is Spawn different from Ethos?',
    a: 'Ethos is human reputation. Spawn is agent reputation. We use automated on-chain signals optimized for AI agents, not manual vouching between humans.'
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-12 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border border-white/10 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-gray-400">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
