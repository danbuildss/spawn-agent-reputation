'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Check, Clock, Shield, Loader2, Search } from 'lucide-react'
import { useAgentsContext } from './AgentsProvider'
import { formatVouchedShort } from '@/lib/agents-data'

type SortField = 'name' | 'score' | 'vouched'
type SortDir = 'asc' | 'desc'

const categories = ['All', 'Infrastructure', 'DeFi', 'Analytics', 'Social', 'Creative', 'Trading', 'Security']

const truncateAddress = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

export default function AgentDirectory() {
  const { agents, loading } = useAgentsContext()
  const [sortField, setSortField] = useState<SortField>('score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Listen for search events from Hero
  useEffect(() => {
    const handleSearch = (e: CustomEvent) => {
      setSearchQuery(e.detail)
      setFilter('All') // Reset filter when searching
    }
    window.addEventListener('agent-search', handleSearch as EventListener)
    return () => window.removeEventListener('agent-search', handleSearch as EventListener)
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const filteredAgents = agents
    .filter(a => {
      // Category filter
      if (filter !== 'All' && a.category !== filter) return false
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          a.name.toLowerCase().includes(query) ||
          a.token.toLowerCase().includes(query) ||
          a.handle.toLowerCase().includes(query) ||
          a.contract?.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query)
        )
      }
      return true
    })
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 80) return 'text-yellow-400'
    if (score >= 70) return 'text-orange-400'
    return 'text-red-400'
  }

  const getGrade = (score: number) => {
    if (score >= 85) return 'A'
    if (score >= 70) return 'B'
    if (score >= 55) return 'C'
    if (score >= 40) return 'D'
    return 'F'
  }

  return (
    <section className="py-8 px-4 md:px-6" id="agents">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Agent Reputation Scores</h2>
            <p className="text-muted-foreground text-sm">
              {loading ? 'Loading agents...' : `${filteredAgents.length} agents on Base`}
            </p>
          </div>
          
          {/* Search in directory */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-40 bg-card border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50"
              />
            </div>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        )}

        {/* No Results */}
        {!loading && filteredAgents.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No agents found matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-accent hover:underline text-sm"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && filteredAgents.length > 0 && (
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
                Score <SortIcon field="score" />
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
                    <div className="col-span-4 md:hidden flex items-center justify-end gap-1">
                      <span className={`text-lg font-bold ${getScoreColor(agent.score)}`}>
                        {agent.score}
                      </span>
                      <span className={`text-xs ${getScoreColor(agent.score)}`}>
                        ({getGrade(agent.score)})
                      </span>
                    </div>

                    {/* Category */}
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-card border border-border text-muted-foreground truncate">
                        {agent.category}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="hidden md:flex col-span-2 items-center justify-center gap-1">
                      <span className={`text-sm font-bold ${getScoreColor(agent.score)}`}>
                        {agent.score}
                      </span>
                      <span className={`text-xs ${getScoreColor(agent.score)}`}>
                        ({getGrade(agent.score)})
                      </span>
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

        {/* Grade Legend */}
        <div className="mt-6 p-4 bg-card border border-border rounded-xl">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-green-400 font-bold">A</span>
              <span className="text-muted-foreground">85-100 High Trust</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-400 font-bold">B</span>
              <span className="text-muted-foreground">70-84 Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-orange-400 font-bold">C</span>
              <span className="text-muted-foreground">55-69 Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-red-400 font-bold">D</span>
              <span className="text-muted-foreground">40-54 Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-red-500 font-bold">F</span>
              <span className="text-muted-foreground">0-39 Very Low</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
