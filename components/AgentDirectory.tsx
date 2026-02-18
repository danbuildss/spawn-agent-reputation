'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Check, Clock, Shield, Loader2, Search, Zap, ExternalLink } from 'lucide-react'
import { useAgentsContext } from './AgentsProvider'
import { formatVouchedShort } from '@/lib/agents-data'

type SortField = 'name' | 'score' | 'vouched'
type SortDir = 'asc' | 'desc'

const categories = ['All', 'Infrastructure', 'DeFi', 'Analytics', 'Social', 'Creative', 'Trading', 'Security']

const truncateAddress = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

// Check if input looks like an Ethereum address
const isEthAddress = (input: string) => /^0x[a-fA-F0-9]{40}$/i.test(input.trim())

interface LiveScore {
  address: string
  name?: string
  token?: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  breakdown: {
    contractAge: { score: number; max: number; detail: string }
    liquidity: { score: number; max: number; detail: string }
    holders: { score: number; max: number; detail: string }
    lpLocked: { score: number; max: number; detail: string }
    volume: { score: number; max: number; detail: string }
    creatorHistory: { score: number; max: number; detail: string }
  } | null
  flags: string[]
  recommendation: string
  source: 'database' | 'live' | 'none'
  timestamp: string
}

export default function AgentDirectory() {
  const { agents, loading } = useAgentsContext()
  const [sortField, setSortField] = useState<SortField>('score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Live lookup state
  const [liveScore, setLiveScore] = useState<LiveScore | null>(null)
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveError, setLiveError] = useState<string | null>(null)

  // Listen for search events from Hero
  useEffect(() => {
    const handleSearch = (e: CustomEvent) => {
      setSearchQuery(e.detail)
      setFilter('All')
    }
    window.addEventListener('agent-search', handleSearch as EventListener)
    return () => window.removeEventListener('agent-search', handleSearch as EventListener)
  }, [])

  // Live lookup when address is entered
  const fetchLiveScore = useCallback(async (address: string) => {
    setLiveLoading(true)
    setLiveError(null)
    setLiveScore(null)
    
    try {
      const res = await fetch(`/api/reputation?address=${address}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch score')
      }
      const data: LiveScore = await res.json()
      setLiveScore(data)
    } catch (err) {
      setLiveError(err instanceof Error ? err.message : 'Failed to lookup address')
    } finally {
      setLiveLoading(false)
    }
  }, [])

  // Debounced live lookup
  useEffect(() => {
    const trimmed = searchQuery.trim()
    
    // Clear live results if not an address
    if (!isEthAddress(trimmed)) {
      setLiveScore(null)
      setLiveError(null)
      return
    }

    // Check if address is already in our static list
    const inStaticList = agents.some(a => a.contract?.toLowerCase() === trimmed.toLowerCase())
    if (inStaticList) {
      setLiveScore(null)
      setLiveError(null)
      return
    }

    // Debounce API call
    const timer = setTimeout(() => {
      fetchLiveScore(trimmed)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, agents, fetchLiveScore])

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
      if (filter !== 'All' && a.category !== filter) return false
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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-400 border-green-400/30 bg-green-400/10'
      case 'B': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
      case 'C': return 'text-orange-400 border-orange-400/30 bg-orange-400/10'
      case 'D': return 'text-red-400 border-red-400/30 bg-red-400/10'
      default: return 'text-red-500 border-red-500/30 bg-red-500/10'
    }
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
                placeholder="Search or paste address..."
                className="w-56 bg-card border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50"
              />
            </div>
          </div>
        </div>

        {/* Live Score Result */}
        {(liveLoading || liveScore || liveError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Live Score Lookup</span>
              </div>

              {liveLoading && (
                <div className="flex items-center gap-3 py-4">
                  <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                  <span className="text-sm text-muted-foreground">Fetching on-chain data...</span>
                </div>
              )}

              {liveError && (
                <div className="py-2">
                  <p className="text-red-400 text-sm">{liveError}</p>
                </div>
              )}

              {liveScore && (
                <div className="space-y-4">
                  {/* Main Score Card */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border ${getGradeColor(liveScore.grade)}`}>
                        {liveScore.grade}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-medium">
                            {liveScore.name || 'Unknown Token'}
                          </span>
                          {liveScore.token && (
                            <span className="text-muted-foreground text-sm">{liveScore.token}</span>
                          )}
                          {liveScore.source === 'live' && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">LIVE</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {truncateAddress(liveScore.address)}
                          <a 
                            href={`https://basescan.org/address/${liveScore.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1.5 text-accent hover:underline inline-flex items-center gap-0.5"
                          >
                            BaseScan <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(liveScore.score)}`}>
                          {liveScore.score}
                        </div>
                        <div className="text-xs text-muted-foreground">/ 100</div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  {liveScore.breakdown && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                      {Object.entries(liveScore.breakdown).map(([key, val]) => (
                        <div key={key} className="bg-card/50 rounded-lg p-2 text-center">
                          <div className="text-xs text-muted-foreground capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm font-medium text-foreground">
                            {val.score}/{val.max}
                          </div>
                          <div className="text-xs text-muted truncate" title={val.detail}>
                            {val.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Flags */}
                  {liveScore.flags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {liveScore.flags.map((flag, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-lg bg-card border border-border text-muted-foreground">
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Recommendation */}
                  <div className="text-sm text-foreground">
                    {liveScore.recommendation}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
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
        {!loading && filteredAgents.length === 0 && !liveScore && !liveLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No agents found matching "{searchQuery}"</p>
            {isEthAddress(searchQuery.trim()) ? (
              <p className="mt-2 text-sm">Searching for live score...</p>
            ) : (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 text-accent hover:underline text-sm"
              >
                Clear search
              </button>
            )}
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
                      {((agent as any).imageUrl || agent.twitter) ? (
                        <img 
                          src={(agent as any).imageUrl || `https://unavatar.io/x/${agent.twitter}`} 
                          alt={agent.name}
                          className="w-8 h-8 rounded-lg flex-shrink-0 object-cover bg-card"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${((agent as any).imageUrl || agent.twitter) ? 'hidden' : ''}`}>
                        {agent.logo.slice(0, 2)}
                      </div>
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
