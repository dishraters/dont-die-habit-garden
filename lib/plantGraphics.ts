// Growth stages with better progression names
export type GrowthStage = {
  label: string
  emoji: string
  progress: number
}

// Plant progression: maps streak count to visual stage
export const getPlantStage = (streak: number): GrowthStage => {
  if (streak === 0) return { label: 'Seed', emoji: '🌱', progress: 0 }
  if (streak < 2) return { label: 'Rooted', emoji: '🌱', progress: (streak / 2) * 100 }
  if (streak < 4) return { label: 'Sprout', emoji: '🌿', progress: ((streak - 2) / 2) * 100 }
  if (streak < 7) return { label: 'Leafing', emoji: '🌿', progress: ((streak - 4) / 3) * 100 }
  if (streak < 11) return { label: 'Budding', emoji: '🌾', progress: ((streak - 7) / 4) * 100 }
  if (streak < 16) return { label: 'Blooming', emoji: '🌸', progress: ((streak - 11) / 5) * 100 }
  return { label: 'Flourishing', emoji: '🌺', progress: 100 }
}

// Milestone rewards
export const getMilestoneReward = (streak: number) => {
  if (streak === 2) return { reward: 100, message: '🌱 Rooted! +100 DDC bonus' }
  if (streak === 4) return { reward: 250, message: '🌿 Sprouting! +250 DDC bonus' }
  if (streak === 7) return { reward: 500, message: '🎉 One week! +500 DDC bonus' }
  if (streak === 11) return { reward: 1000, message: '🌸 Blooming! +1000 DDC bonus' }
  if (streak === 16) return { reward: 2000, message: '🌺 Flourishing! +2000 DDC bonus' }
  return null
}

// Plant metadata (for display in cards)
export const PLANT_METADATA = {
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
  sleeptime_stories: {
    plantName: 'Moon Vine',
    description: 'Night vine that rewards listening',
    color: '#ec4899',
  },
  planning: {
    plantName: 'Compass Fern',
    description: 'Guides the path ahead',
    color: '#06b6d4',
  },
  mindful_movements: {
    plantName: 'Breeze Orchid',
    description: 'Dances when you show up',
    color: '#10b981',
  },
}
