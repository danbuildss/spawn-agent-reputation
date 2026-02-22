'use client'

import { motion } from 'framer-motion'
import { Shield, BarChart3, Zap } from 'lucide-react'

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
    icon: Zap,
    title: 'Instant Access',
    description: 'Web app, Telegram bot, or API. Check any agent in seconds.',
  },
]

export default function Features() {
  return (
    <section className="py-24 px-4 md:px-6 border-t border-white/5 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-normal mb-4">
            Why <span className="text-accent">Spawn</span>?
          </h2>
          <p className="text-dim text-sm md:text-base max-w-md mx-auto font-mono">
            The infrastructure you need to trust AI agents in a trustless world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative"
            >
              {/* Hover glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative p-6 bg-surface border border-white/5 rounded-xl hover:border-white/10 transition-all duration-300">
                <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:border-blue-500/40 transition-colors">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 font-mono">{feature.title}</h3>
                <p className="text-sm text-dim leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
