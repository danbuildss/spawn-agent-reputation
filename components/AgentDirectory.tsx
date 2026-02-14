'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Check, Clock, Shield, Loader2, Copy, ExternalLink } from 'lucide-react'
import { useAgentsContext } from './AgentsProvider'
import { formatVouchedShort } from '@/lib/agents-data'
import { getScoreTier, formatScore } from '@/lib/score-utils'

type SortField = 'name' | 'score' | 'vouched'
type SortDir = 'asc' | 'desc'

const categories = ['All', 'Infrastructure', 'DeFi', 'Analytics', 'Social', 'Creative', 'Trading', 'Security']

// Truncate address for display
const truncateAddress = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

export default function AgentDirectory() {
  const { agents, loading } = useAgentsContext()
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
    if (sortField !== field) return <ChevronDown className="w-3 h-3 text-muted" />
    return sortDir === 'asc' 
      ? <ChevronUp className="w-3 h-3 text-accent" />
      : <ChevronDown className="w-3 h-3 text-accent" />
  }

  return (
    <section className="py-8 px-4 md:px-6" id="agents">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Ethos Creator Scores</h2>
            <p className="text-muted-foreground text-sm">
              {loading ? 'Loading agents...' : `${filteredAgents.length} agents on Base`}
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  filter === cat 
                    ? 'bg-accent/20 text-accent border border-accent/30' 
                    : 'bg-card text-muted-foreground border border-border hover:bg-accent/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        )}

        {/* Table */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <button 
                onClick={() => handleSort('name')}
                className="col-span-4 flex items-center gap-1 hover:text-foreground transition-colors text-left"
              >
                Agent <SortIcon field="name" />
              </button>
              <div className="col-span-2 text-center">Category</div>
              <button 
                onClick={() => handleSort('score')}
                className="col-span-2 flex items-center justify-center gap-1 hover:text-foreground transition-colors"
              >
                Ethos Score <SortIcon field="score" />
              </button>
              <button 
                onClick={() => handleSort('vouched')}
                className="col-span-2 flex items-center justify-center gap-1 hover:text-foreground transition-colors"
              >
                Trust Value <SortIcon field="vouched" />
              </button>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {/* Table Rows */}
            {filteredAgents.slice(0, 50).map((agent, i) => {
              const vouched = formatVouchedShort(agent.vouched)
              const tier = getScoreTier(agent.score)
              return (
                <Link href={`/agent/${agent.id}`} key={agent.id}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.01 }}
                    className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-border hover:bg-accent/5 transition-colors cursor-pointer group"
                  >
                    {/* Agent Name */}
                    <div className="col-span-8 md:col-span-4 flex items-center gap-2 md:gap-3">
                      {/* Agent Logo/Image */}
                      {(agent as any).imageUrl ? (
                        <img 
                          src={(agent as any).imageUrl} 
                          alt={agent.name}
                          className="w-8 h-8 rounded-lg flex-shrink-0 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                          {agent.logo.slice(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground font-medium text-sm group-hover:text-accent transition-colors truncate">
                            {agent.name}
                          </span>
                          {agent.status === 'verified' && <Shield className="w-3 h-3 text-green-400 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-muted text-xs">
                          <span>{agent.token}</span>
                          {agent.contract && (
                            <span className="hidden md:inline text-muted-foreground font-mono">
                              {truncateAddress(agent.contract)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Score - Mobile */}
                    <div className="col-span-4 md:hidden flex flex-col items-end justify-center">
                      <span className={`text-lg font-bold ${tier.color}`}>
                        {formatScore(agent.score)}
                      </span>
                      <span className={`text-xs ${tier.color}`}>{tier.label}</span>
                    </div>

                    {/* Category */}
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-card border border-border text-muted-foreground truncate">
                        {agent.category}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      <div className="text-center">
                        <span className={`text-sm font-bold ${tier.color}`}>
                          {formatScore(agent.score)}
                        </span>
                        <div className={`text-xs ${tier.color}`}>{tier.label}</div>
                      </div>
                    </div>

                    {/* Vouched */}
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm text-foreground">{vouched.eth}</div>
                        <div className="text-xs text-muted-foreground">{vouched.usd}</div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="hidden md:flex col-span-2 items-center justify-end">
                      {agent.status === 'verified' ? (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <Check className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </div>
                  </motion.div>
                </Link>
              )
            })}
            
            {filteredAgents.length > 50 && (
              <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                Showing 50 of {filteredAgents.length} agents
              </div>
            )}
          </motion.div>
        )}

        {/* Score Legend */}
        <div className="mt-6 p-4 bg-card border border-border rounded-xl">
          <h3 className="text-sm font-medium text-foreground mb-3">Ethos Creator Score Tiers</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🏆</span>
              <span className="text-purple-400">2600-2800 Renowned</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">👑</span>
              <span className="text-blue-400">2400-2599 Revered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">💎</span>
              <span className="text-cyan-400">2200-2399 Distinguished</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400">🌟</span>
              <span className="text-teal-400">2000-2199 Exemplary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">⭐</span>
              <span className="text-emerald-400">1800-1999 Reputable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-green-400">1600-1799 Established</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lime-500">👤</span>
              <span className="text-lime-500">1400-1599 Known</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">😐</span>
              <span className="text-yellow-500">1200-1399 Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">❓</span>
              <span className="text-orange-500">800-1199 Questionable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <span className="text-red-500">0-799 Untrust</span>
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm mb-3">Build your agent's reputation on Spawn</p>
          <Link href="/submit" className="inline-block px-6 py-2 text-sm text-accent hover:text-foreground border border-accent/30 rounded-lg hover:bg-accent/20 transition-colors">
            Submit Your Agent
          </Link>
        </div>
      </div>
    </section>
  )
}
