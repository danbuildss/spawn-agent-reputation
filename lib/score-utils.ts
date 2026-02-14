// Ethos Creator Score Utilities
// Scale: 0-2800

export interface ScoreTier {
  label: string
  min: number
  max: number
  color: string
  bgColor: string
  emoji: string
}

export const SCORE_TIERS: ScoreTier[] = [
  { label: 'Untrust', min: 0, max: 799, color: 'text-red-500', bgColor: 'bg-red-500/20', emoji: '⚠️' },
  { label: 'Questionable', min: 800, max: 1199, color: 'text-orange-500', bgColor: 'bg-orange-500/20', emoji: '❓' },
  { label: 'Neutral', min: 1200, max: 1399, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20', emoji: '😐' },
  { label: 'Known', min: 1400, max: 1599, color: 'text-lime-500', bgColor: 'bg-lime-500/20', emoji: '👤' },
  { label: 'Established', min: 1600, max: 1799, color: 'text-green-400', bgColor: 'bg-green-400/20', emoji: '✓' },
  { label: 'Reputable', min: 1800, max: 1999, color: 'text-emerald-400', bgColor: 'bg-emerald-400/20', emoji: '⭐' },
  { label: 'Exemplary', min: 2000, max: 2199, color: 'text-teal-400', bgColor: 'bg-teal-400/20', emoji: '🌟' },
  { label: 'Distinguished', min: 2200, max: 2399, color: 'text-cyan-400', bgColor: 'bg-cyan-400/20', emoji: '💎' },
  { label: 'Revered', min: 2400, max: 2599, color: 'text-blue-400', bgColor: 'bg-blue-400/20', emoji: '👑' },
  { label: 'Renowned', min: 2600, max: 2800, color: 'text-purple-400', bgColor: 'bg-purple-400/20', emoji: '🏆' },
]

export function getScoreTier(score: number): ScoreTier {
  for (const tier of SCORE_TIERS) {
    if (score >= tier.min && score <= tier.max) {
      return tier
    }
  }
  // Default to lowest tier
  return SCORE_TIERS[0]
}

export function getScoreColor(score: number): string {
  return getScoreTier(score).color
}

export function getScoreLabel(score: number): string {
  return getScoreTier(score).label
}

export function getScoreEmoji(score: number): string {
  return getScoreTier(score).emoji
}

export function formatScore(score: number): string {
  return score.toLocaleString()
}

// Convert old 0-100 score to new 0-2800 scale
export function convertToEthosScore(oldScore: number): number {
  // Map 0-100 to 0-2800
  // 40 -> 800 (questionable threshold)
  // 55 -> 1200 (neutral threshold)
  // 70 -> 1600 (established threshold)
  // 85 -> 2000 (exemplary threshold)
  // 100 -> 2800 (renowned)
  
  if (oldScore >= 95) return Math.round(2400 + ((oldScore - 95) / 5) * 400) // 2400-2800
  if (oldScore >= 90) return Math.round(2200 + ((oldScore - 90) / 5) * 200) // 2200-2400
  if (oldScore >= 85) return Math.round(2000 + ((oldScore - 85) / 5) * 200) // 2000-2200
  if (oldScore >= 80) return Math.round(1800 + ((oldScore - 80) / 5) * 200) // 1800-2000
  if (oldScore >= 75) return Math.round(1600 + ((oldScore - 75) / 5) * 200) // 1600-1800
  if (oldScore >= 70) return Math.round(1400 + ((oldScore - 70) / 5) * 200) // 1400-1600
  if (oldScore >= 55) return Math.round(1200 + ((oldScore - 55) / 15) * 200) // 1200-1400
  if (oldScore >= 40) return Math.round(800 + ((oldScore - 40) / 15) * 400) // 800-1200
  return Math.round((oldScore / 40) * 800) // 0-800
}
