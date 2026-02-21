'use client'

import { motion } from 'framer-motion'
import { Shield, BarChart3, Bot } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'TEE Verified',
    description: 'Scores computed in EigenLayer secure enclaves. Cryptographic proof, not promises.',
  },
  {
    icon: BarChart3,
    title: 'On-Chain Data',
    description: 'Liquidity, holders, volume, contract age. Real metrics that matter.',
  },
  {
    icon: Bot,
    title: 'Instant Access',
    description: 'Web app, Telegram bot, or API. Check any agent in seconds.',
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4 border-t border-subtle">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card p-6 hover:border-accent/30 transition-colors"
            >
              <div className="w-10 h-10 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-dim leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
