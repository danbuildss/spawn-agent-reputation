'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Upload, Check, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    contract: '',
    category: '',
    description: '',
    website: '',
    twitter: '',
    email: ''
  })
  
  const categories = ['DeFi', 'Trading', 'Analytics', 'Social', 'Gaming', 'NFT', 'Infrastructure', 'Security', 'Other']

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Submit Your Agent</h1>
          <p className="text-gray-400 mb-8">Get your AI agent listed in the Spawn directory. Free submission, reviewed within 48 hours.</p>
          
          <form className="space-y-6">
            {/* Agent Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Luna Protocol"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            
            {/* Contract Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contract Address *</label>
              <input
                type="text"
                value={formData.contract}
                onChange={(e) => setFormData({ ...formData, contract: e.target.value })}
                placeholder="0x..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Base network contract address</p>
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      formData.category === cat
                        ? 'bg-accent/20 border-accent/30 text-accent'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does your agent do? (2-3 sentences)"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors resize-none"
              />
            </div>
            
            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            
            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="@handle"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            
            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="team@youragent.xyz"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">We'll notify you when your agent is listed</p>
            </div>
            
            {/* Info Box */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-white font-medium mb-1">What happens next?</p>
                <ul className="text-gray-400 space-y-1">
                  <li>• We'll review your submission within 48 hours</li>
                  <li>• Your agent will be indexed and scored automatically</li>
                  <li>• You'll receive an email when it's live</li>
                  <li>• Want verification? You can claim your agent after listing</li>
                </ul>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Submit Agent
            </button>
            
            <p className="text-center text-xs text-gray-500">
              By submitting, you agree to our terms of service. Spam submissions will be rejected.
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
