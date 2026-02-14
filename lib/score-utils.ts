// Score Utilities for Spawn
// Main Score: 0-100 (visible to users)
// Ethos Creator Score: Used internally for creator reputation component

export interface ScoreGrade {
  grade: string
  label: string
  min: number
  max: number
  color: string
  bgColor: string
}

// Main score grades (0-100 scale)
export const SCORE_GRADES: ScoreGrade[] = [
  { grade: 'A', label: 'High Trust', min: 85, max: 100, color: 'text-green-400', bgColor: 'bg-green-400/20' },
  { grade: 'B', label: 'Good', min: 70, max: 84, color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' },
  { grade: 'C', label: 'Moderate', min: 55, max: 69, color: 'text-orange-400', bgColor: 'bg-orange-400/20' },
  { grade: 'D', label: 'Low Trust', min: 40, max: 54, color: 'text-red-400', bgColor: 'bg-red-400/20' },
  { grade: 'F', label: 'Very Low', min: 0, max: 39, color: 'text-red-500', bgColor: 'bg-red-500/20' },
]

export function getScoreGrade(score: number): ScoreGrade {
  for (const grade of SCORE_GRADES) {
    if (score >= grade.min && score <= grade.max) {
      return grade
    }
  }
  return SCORE_GRADES[SCORE_GRADES.length - 1]
}

export function getScoreColor(score: number): string {
  return getScoreGrade(score).color
}

export function getScoreLabel(score: number): string {
  return getScoreGrade(score).label
}

// Ethos Creator Score tiers (0-2800) - used internally
export interface EthosTier {
  label: string
  min: number
  max: number
}

export const ETHOS_TIERS: EthosTier[] = [
  { label: 'Untrusted', min: 0, max: 799 },
  { label: 'Questionable', min: 800, max: 1199 },
  { label: 'Neutral', min: 1200, max: 1399 },
  { label: 'Known', min: 1400, max: 1599 },
  { label: 'Established', min: 1600, max: 1799 },
  { label: 'Reputable', min: 1800, max: 1999 },
  { label: 'Exemplary', min: 2000, max: 2199 },
  { label: 'Distinguished', min: 2200, max: 2399 },
  { label: 'Revered', min: 2400, max: 2599 },
  { label: 'Renowned', min: 2600, max: 2800 },
]

export function getEthosTier(ethosScore: number): EthosTier {
  for (const tier of ETHOS_TIERS) {
    if (ethosScore >= tier.min && ethosScore <= tier.max) {
      return tier
    }
  }
  return ETHOS_TIERS[0]
}

// Convert Ethos score (0-2800) to contribution points (0-10) for creator reputation
export function ethosToCreatorPoints(ethosScore: number): number {
  return Math.round((ethosScore / 2800) * 10)
}
