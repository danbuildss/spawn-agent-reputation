'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Check, Clock } from 'lucide-react'

type SortField = 'name' | 'score' | 'vouched'
type SortDir = 'asc' | 'desc'

const agents = [
  { name: 'Luna Protocol', category: 'DeFi', score: 94, vouched: 0.5, status: 'verified', contract: '0x1a2b...3c4d' },
  { name: 'Astra Finance', category: 'Trading', score: 91, vouched: 1.2, status: 'verified', contract: '0x2b3c...4d5e' },
  { name: 'Nova Trading', category: 'Trading', score: 88, vouched: 0.8, status: 'verified', contract: '0x3c4d...5e6f' },
  { name: 'Orion Analytics', category: 'Analytics', score: 87, vouched: 0.3, status: 'pending', contract: '0x4d5e...6f7g' },
  { name: 'Zenith Markets', category: 'DeFi', score: 85, vouched: 2.1, status: 'verified', contract: '0x5e6f...7g8h' },
  { name: 'Echo Strategies', category: 'Trading', score: 82, vouched: 0.6, status: 'pending', contract: '0x6f7g...8h9i' },
  { name: 'Pulse Network', category: 'Social', score: 79, vouched: 0.4, status: 'verified', contract: '0x7g8h...9i0j' },
  { name: 'Nexus Agent', category: 'DeFi', score: 76, vouched: 0.2, status: 'pending', contract: '0x8h9i...0j1k' },
  { name: 'Cipher Bot', category: 'Security', score: 73, vouched: 0.9, status: 'verified', contract: '0x9i0j...1k2l' },
  { name: 'Delta Protocol', category: 'Analytics', score: 71, vouched: 0.1, status: 'pending', contract: '0x0j1k...2l3m' },
]

const categories = ['All', 'DeFi', 'Trading', 'Analytics', 'Social', 'Security']

export default function AgentDirectory() {
  const [sortField, setSortField] = useState<SortField>('score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filter, setFilter] = useState('All')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const filteredAgents = agents
    .filter(a => filter === 'All' || a.category === filter)
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1
      if (sortField === 'name') return mult * a.name.localeCompare(b.name)
      if (sortField === 'score') return mult * (a.score - b.score)
      if (sortField === 'vouched') return mult * (a.vouched - b.vouched)
      return 0
    })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-600" />
    return sortDir === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-accent" />
      : <ChevronDown className="w-4 h-4 text-accent" />
  }

  return (
    <section className="py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">All Agents</h2>
            <p className="text-gray-500 text-sm">{filteredAgents.length} agents found</p>
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  filter === cat 
                    ? 'bg-accent/20 text-accent border border-accent/30' 
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
            <button 
              onClick={() => handleSort('name')}
              className="col-span-4 flex items-center gap-1 hover:text-white transition-colors text-left"
            >
              Agent <SortIcon field="name" />
            </button>
            <div className="col-span-2">Category</div>
            <button 
              onClick={() => handleSort('score')}
              className="col-span-2 flex items-center gap-1 hover:text-white transition-colors"
            >
              Score <SortIcon field="score" />
            </button>
            <button 
              onClick={() => handleSort('vouched')}
              className="col-span-2 flex items-center gap-1 hover:text-white transition-colors"
            >
              Vouched <SortIcon field="vouched" />
            </button>
            <div className="col-span-2 text-right">Status</div>
          </div>

          {/* Table Rows */}
          {filteredAgents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              {/* Agent Name */}
              <div className="col-span-4 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  agent.score >= 90 ? 'bg-green-500/20 text-green-400' :
                  agent.score >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {agent.name[0]}
                </div>
                <div>
                  <div className="text-white font-medium text-sm group-hover:text-accent transition-colors">
                    {agent.name}
                  </div>
                  <div className="text-gray-600 text-xs">{agent.contract}</div>
                </div>
              </div>

              {/* Category */}
              <div className="col-span-2 flex items-center">
                <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">
                  {agent.category}
                </span>
              </div>

              {/* Score */}
              <div className="col-span-2 flex items-center">
                <span className={`text-sm font-bold ${
                  agent.score >= 90 ? 'text-green-400' :
                  agent.score >= 80 ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  {agent.score}
                </span>
              </div>

              {/* Vouched */}
              <div className="col-span-2 flex items-center text-sm text-gray-400">
                {agent.vouched} ETH
              </div>

              {/* Status */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                {agent.status === 'verified' ? (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                )}
                <ExternalLink className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
            Load More Agents
          </button>
        </div>
      </div>
    </section>
  )
}
