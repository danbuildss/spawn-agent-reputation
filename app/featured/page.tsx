'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Check, Star, Zap, Shield, BarChart3, MessageSquare } from 'lucide-react'

const tiers = [
  {
    name: 'Submit',
    price: '$0',
    description: 'Get reviewed for listing',
    features: [
      'Submit for review',
      'Manual verification',
      'Basic listing if approved',
      'Trust score calculated',
    ],
    notIncluded: [
      'Guaranteed listing',
      'Verification badge',
      'Featured placement',
      'Analytics dashboard',
    ],
    cta: 'Submit Agent',
    href: '/submit',
    highlight: false,
  },
  {
    name: 'Verified',
    price: '$20',
    period: 'one-time',
    description: 'Prove ownership + get listed',
    features: [
      'Guaranteed listing',
      'Verified badge ✓',
      'Contract verification',
      'Edit agent details',
      'Priority review',
      'Basic analytics',
    ],
    notIncluded: [
      'Featured placement',
      'Full analytics',
    ],
    cta: 'Get Verified',
    href: '#contact',
    highlight: false,
  },
  {
    name: 'Featured',
    price: '$60',
    period: 'per month',
    description: 'Maximum visibility',
    features: [
      'Everything in Verified',
      'Homepage featured spot',
      'Priority in search results',
      '"Featured" badge',
      'Custom banner/branding',
      'Full analytics dashboard',
      'Direct contact link',
      'Dedicated support',
    ],
    notIncluded: [],
    cta: 'Get Featured',
    href: '#contact',
    highlight: true,
  },
]

const benefits = [
  {
    icon: Star,
    title: 'Stand Out',
    description: 'Featured agents get 10x more views than standard listings'
  },
  {
    icon: Shield,
    title: 'Build Trust',
    description: 'Verification shows users you\'re a legitimate project'
  },
  {
    icon: BarChart3,
    title: 'Track Performance',
    description: 'See how many users view and interact with your listing'
  },
  {
    icon: Zap,
    title: 'Priority Placement',
    description: 'Appear first in search results and category pages'
  },
]

export default function FeaturedPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Get Your Agent Featured</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Increase visibility, build trust, and drive more users to your AI agent
          </p>
        </motion.div>
        
        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-xl p-6 ${
                tier.highlight
                  ? 'bg-gradient-to-b from-accent/20 to-transparent border-2 border-accent/50'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  {tier.period && <span className="text-gray-500 text-sm">/{tier.period}</span>}
                </div>
                <p className="text-sm text-gray-400 mt-2">{tier.description}</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
                {tier.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 flex items-center justify-center text-gray-600">–</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href={tier.href}
                className={`block w-full py-3 text-center font-medium rounded-lg transition-colors ${
                  tier.highlight
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">Why Get Featured?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <div key={benefit.title} className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center bg-white/5 border border-white/10 rounded-xl p-8"
          id="contact"
        >
          <MessageSquare className="w-10 h-10 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Get Featured?</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Contact us to discuss featured placement for your agent. Enterprise and custom packages available.
          </p>
          <a
            href="mailto:featured@spawn.xyz"
            className="inline-block px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            Contact Us
          </a>
          <p className="text-xs text-gray-500 mt-4">
            Or DM us on Twitter <a href="#" className="text-accent hover:underline">@spawnxyz</a>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
