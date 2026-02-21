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
    <section className="py-20 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
            >
              <feature.icon className="w-5 h-5 text-blue-500 mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
