'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Paste Contract',
    description: 'Enter any AI agent token contract address. We support all tokens on Base network.',
  },
  {
    number: '02',
    title: 'TEE Computes Score',
    description: 'Our verifier running in EigenLayer TEE fetches on-chain data and calculates a trust score (0-100).',
  },
  {
    number: '03',
    title: 'Get Attestation',
    description: 'Receive a cryptographically signed score you can verify on-chain. No trust required — verify it yourself.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 md:px-6 bg-surface/50 relative" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal mb-4">
            How It Works
          </h2>
          <p className="text-dim text-lg max-w-xl mx-auto">
            Three steps to verifiable AI agent reputation.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
              )}

              {/* Step number */}
              <div className="text-5xl font-serif text-blue-500/20 mb-4">
                {step.number}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-dim leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Score breakdown preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 p-6 bg-background border border-white/5 rounded-2xl"
        >
          <h4 className="text-sm font-medium text-muted mb-4 uppercase tracking-wider">Score Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Contract Age', max: 20 },
              { label: 'Liquidity', max: 25 },
              { label: 'Holders', max: 15 },
              { label: 'LP Stability', max: 20 },
              { label: 'Volume', max: 10 },
              { label: 'Creator Rep', max: 10 },
            ].map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-2xl font-mono text-blue-500 mb-1">{metric.max}</div>
                <div className="text-xs text-dim">{metric.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <span className="text-sm text-muted">Total: </span>
            <span className="text-lg font-mono text-foreground">100 points</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
