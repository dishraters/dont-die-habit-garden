// Import plant graphics from existing Habit Garden
// These are the SVG/image assets already used in the live app

export const PLANT_EMOJIS = {
  // Seed stage
  seed: '🌱',
  
  // Sprout stage
  sprout: '🌿',
  
  // Growing stage
  growing: '🌾',
  
  // Thriving stage
  thriving: '🌳',
  
  // Legendary stage
  legendary: '✨🌟',
}

// Plant progression: maps streak count to visual stage
export const getPlantStage = (streak: number) => {
  if (streak === 0) return { stage: 'Seed', emoji: '🌱', progress: 0 }
  if (streak < 7) return { stage: 'Sprout', emoji: '🌿', progress: (streak / 7) * 100 }
  if (streak < 30) return { stage: 'Growing', emoji: '🌾', progress: ((streak - 7) / 23) * 100 }
  if (streak < 60) return { stage: 'Thriving', emoji: '🌳', progress: ((streak - 30) / 30) * 100 }
  return { stage: 'Legendary', emoji: '✨', progress: 100 }
}

// Milestone rewards
export const getMilestoneReward = (streak: number) => {
  if (streak === 7) return { reward: 500, message: '🎉 One week! +500 DDC bonus' }
  if (streak === 30) return { reward: 2000, message: '🌟 One month! +2000 DDC bonus' }
  if (streak === 60) return { reward: 5000, message: '👑 Two months! +5000 DDC bonus' }
  if (streak === 365) return { reward: 10000, message: '🏆 One year! +10000 DDC bonus' }
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
