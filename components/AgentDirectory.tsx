'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, ExternalLink, Check, Clock } from 'lucide-react'
import { agents, Agent } from '@/lib/agents-data'

type SortField = 'name' | 'score' | 'vouched'
type SortDir = 'asc' | 'desc'

const categories = ['All', 'Infrastructure', 'DeFi', 'Analytics', 'Social', 'Creative', 'Trading', 'Security']

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
    <section className="py-8 px-6" id="agents">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">All Agents</h2>
            <p className="text-gray-500 text-sm">{filteredAgents.length} Base ecosystem agents</p>
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
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
            <Link href={`/agent/${agent.id}`} key={agent.id}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                {/* Agent Name */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xs font-bold text-white`}>
                    {agent.logo.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm group-hover:text-accent transition-colors">
                      {agent.name}
                    </div>
                    <div className="text-gray-600 text-xs">{agent.token}</div>
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
                    agent.score >= 70 ? 'text-orange-400' :
                    'text-red-400'
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
            </Link>
          ))}
        </motion.div>

        {/* Submit CTA */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-3">Don't see your agent?</p>
          <Link href="/submit" className="px-6 py-2 text-sm text-accent hover:text-white border border-accent/30 rounded-lg hover:bg-accent/20 transition-colors">
            Submit Your Agent
          </Link>
        </div>
      </div>
    </section>
  )
}
