// Growth stages with progression names
export type GrowthStage = {
  label: string
  emoji: string
  progress: number
  stage: number
}

// Plant progression: maps cumulative tokens to visual stage
// 7 stages: 0-100 (seed) → 101-300 (sprout) → 301-700 (young tree) → 701-1200 (mature) → 1201-2000 (thriving) → 2001-3500 (flourishing) → 3501+ (monument)
export const getPlantStage = (totalDDC: number): GrowthStage => {
  if (totalDDC < 100)   return { label: 'Seed',         emoji: '🌱', progress: (totalDDC / 100) * 100, stage: 1 }
  if (totalDDC < 300)   return { label: 'Sprout',       emoji: '🌿', progress: ((totalDDC - 100) / 200) * 100, stage: 2 }
  if (totalDDC < 700)   return { label: 'Young Tree',   emoji: '🌲', progress: ((totalDDC - 300) / 400) * 100, stage: 3 }
  if (totalDDC < 1200)  return { label: 'Mature Tree',  emoji: '🌳', progress: ((totalDDC - 700) / 500) * 100, stage: 4 }
  if (totalDDC < 2000)  return { label: 'Thriving',     emoji: '🌲✨', progress: ((totalDDC - 1200) / 800) * 100, stage: 5 }
  if (totalDDC < 3500)  return { label: 'Flourishing',  emoji: '🌴', progress: ((totalDDC - 2000) / 1500) * 100, stage: 6 }
  return                 { label: 'Monument',       emoji: '🌳👑', progress: 100, stage: 7 }
}

// Milestone rewards based on cumulative tokens
export const getMilestoneReward = (totalDDC: number) => {
  if (totalDDC === 100)  return { reward: 50,   message: '🌱 Seed → Sprout! +50 bonus tokens' }
  if (totalDDC === 300)  return { reward: 100,  message: '🌿 Sprout → Young Tree! +100 bonus tokens' }
  if (totalDDC === 700)  return { reward: 200,  message: '🌲 Young Tree → Mature! +200 bonus tokens' }
  if (totalDDC === 1200) return { reward: 400,  message: '🌳 Mature → Thriving! +400 bonus tokens' }
  if (totalDDC === 2000) return { reward: 800,  message: '🌲✨ Thriving → Flourishing! +800 bonus tokens' }
  if (totalDDC === 3500) return { reward: 1600, message: '🌴 Flourishing → Monument! +1600 bonus tokens' }
  return null
}

// Plant metadata per habit
export const PLANT_METADATA: { [habitId: string]: { plantName: string; description: string; color: string } } = {
  meditation: {
    plantName: 'Lotus Seed',
    description: 'Opens wider with each streak',
    color: '#60a5fa',
  },
  gratitude: {
    plantName: 'Moonbloom',
    description: 'Gets brighter as thoughts pile up',
    color: '#fbbf24',
  },
  training: {
    plantName: 'Iron Fern',
    description: 'Thickens into a powerhouse plant',
    color: '#ef4444',
  },
  breakfast: {
    plantName: 'Sunpetal',
    description: 'Bright morning flower',
    color: '#f97316',
  },
  lunch: {
    plantName: 'Meadowleaf',
    description: 'Fills out the garden',
    color: '#22c55e',
  },
  dinner: {
    plantName: 'Twilight Bloom',
    description: 'Warm evening flower',
    color: '#8b5cf6',
  },
  sleep: {
    plantName: 'Moon Vine',
    description: 'Grows deep in restful nights',
    color: '#ec4899',
  },
  planning: {
    plantName: 'Compass Fern',
    description: 'Guides the path ahead',
    color: '#06b6d4',
  },
  stretching: {
    plantName: 'Breeze Orchid',
    description: 'Dances when you show up',
    color: '#10b981',
  },
}
