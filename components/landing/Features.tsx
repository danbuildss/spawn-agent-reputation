'use client'

import { motion } from 'framer-motion'
import { Shield, Fingerprint, BarChart3, Bot, Zap, Users } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'TEE-Verified Scores',
    description: 'Reputation scores computed inside EigenLayer Trusted Execution Environments. Cryptographically signed attestations you can verify on-chain.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Fingerprint,
    title: 'Ethos Integration',
    description: 'Creator reputation powered by Ethos Network. Know if the team behind an agent has a track record you can trust.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'On-Chain Metrics',
    description: 'Real-time data from DexScreener: liquidity, volume, holder distribution, contract age. No manipulation, just facts.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Bot,
    title: 'Telegram Bot',
    description: 'Check any agent instantly. Just send a contract address to @agentspawn_bot and get a detailed reputation report.',
    gradient: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Zap,
    title: 'Real-Time Updates',
    description: 'Scores update as on-chain activity changes. No stale data, no cached results. Live reputation, always.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Agent Directory',
    description: 'Browse 100+ indexed AI agents on Base. Filter by category, sort by score, find the agents you can trust.',
    gradient: 'from-indigo-500 to-purple-500',
  },
]

export default function Features() {
  return (
    <section className="py-24 px-4 md:px-6 relative" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal mb-4">
            Why <span className="text-blue-500">Spawn</span>?
          </h2>
          <p className="text-dim text-lg max-w-2xl mx-auto">
            The infrastructure you need to trust AI agents in a trustless world.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-6 bg-surface border border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-4`}>
                <div className="w-full h-full bg-surface rounded-xl flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-dim leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
