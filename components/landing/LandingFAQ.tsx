'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is Spawn?',
    a: 'Spawn is the trust layer for AI agents. We provide cryptographically verified reputation scores for AI agent tokens, helping you identify legitimate projects and avoid scams. Our scores are computed in Trusted Execution Environments (TEEs) and can be verified on-chain.'
  },
  {
    q: 'How are trust scores calculated?',
    a: 'Trust scores (0-100) are computed from multiple on-chain signals: contract age (20 pts), liquidity depth (25 pts), holder distribution (15 pts), LP stability (20 pts), trading volume (10 pts), and creator reputation via Ethos Network (10 pts). All data is fetched in real-time from DexScreener and blockchain APIs.'
  },
  {
    q: 'What is TEE verification?',
    a: 'TEE (Trusted Execution Environment) is secure hardware that runs our scoring logic in an isolated environment. Even we can\'t tamper with the results. Every score comes with a cryptographic signature from the TEE that you can verify on-chain — proving the score wasn\'t manipulated.'
  },
  {
    q: 'What is Ethos Network integration?',
    a: 'Ethos Network provides reputation scores for crypto wallets based on on-chain history, vouches, and reviews. When an agent team has their wallet registered on Ethos, we fetch their reputation and factor it into the overall trust score. This helps identify teams with established credibility.'
  },
  {
    q: 'How do I get my agent listed?',
    a: 'Click "Launch App" and use the Submit form. Listing is free and automatic. For verified status (shows a checkmark and boosts visibility), you\'ll need to prove ownership by signing with the deployer wallet.'
  },
  {
    q: 'What does the grade mean?',
    a: 'Grades simplify the 0-100 score: A (85+) = High trust, safe to interact. B (70-84) = Good reputation, normal caution. C (55-69) = Moderate trust, do research. D (40-54) = Low trust, exercise caution. F (below 40) = Very low trust, high risk.'
  },
  {
    q: 'Can I use Spawn via API?',
    a: 'Yes! Our API is free to use. Just call /api/reputation?address=0x... with any token contract address. You\'ll get back the score, breakdown, grade, flags, and a cryptographic attestation. Perfect for integrating trust checks into your own apps.'
  },
  {
    q: 'Is there a Telegram bot?',
    a: 'Yes! Send any contract address to @agentspawn_bot and get an instant reputation report. Great for quick checks when you\'re researching agents on the go.'
  },
]

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 px-4 md:px-6" id="faq">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-normal mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>
        
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border border-white/10 rounded-xl overflow-hidden bg-surface/50"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 text-sm text-dim leading-relaxed">
                  {faq.a}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
