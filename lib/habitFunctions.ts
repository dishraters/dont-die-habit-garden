/**
 * Habit Functions - Firestore Integration
 * 
 * Syncs with Habit Garden, Dishrated, Planning, Gratitude, TrainLog
 */

import {
  recordCompletion,
  getDDCBalance,
  getPlantGrowthStage,
  getCurrentStreak,
  initDDHGUser,
  getCompletions,
} from './firestoreIntegration'

export interface HabitEntry {
  habitId: string
  completedAt: string
  notes?: string
  time?: string
}

export interface UserHabits {
  completedToday: string[]
  streaks: { [habitId: string]: number }
  totalDDC: number
  plantGrowthStage: number
  currentStreak: number
}

const HABIT_NAMES = {
  gratitude: 'Gratitude',
  meditation: 'Meditation',
  training: 'Train',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  sleeptime_stories: 'Stop Eating',
  planning: 'Plan',
  mindful_movements: 'Mindful Movements',
}

/**
 * Record a habit completion to Firestore
 * Automatically calculates DDC, updates streaks, plant growth
 */
export async function saveHabitCompletion(
  userId: string,
  habitId: string,
  notes?: string,
  time?: string,
  source: 'habit-garden' | 'dishrated' | 'trainlog' | 'planning' | 'gratitude' = 'habit-garden'
): Promise<void> {
  try {
    const habitName = HABIT_NAMES[habitId as keyof typeof HABIT_NAMES] || habitId
    
    await recordCompletion(userId, habitId, habitName, source, notes)
    
    console.log(`✅ Habit completed: ${habitName} (${source})`)
  } catch (e) {
    console.error('Failed to save habit completion:', e)
    throw e
  }
}

/**
 * Load user's habits, DDC, streaks, and plant growth stage
 */
export async function loadUserHabits(userId: string): Promise<UserHabits> {
  try {
    const user = await initDDHGUser(userId)
    const completions = await getCompletions(userId, 100)
    
    // Get today's completions
    const today = new Date().toDateString()
    const completedToday = completions
      .filter(c => new Date(c.completedAt).toDateString() === today)
      .map(c => c.habitId)
      .filter((v, i, a) => a.indexOf(v) === i) // unique

    // Build streak map (simplified - real streak logic is in Firestore)
    const streaks: { [key: string]: number } = {}
    Object.keys(HABIT_NAMES).forEach(id => {
      streaks[id] = user.streakCount // User-wide streak for now
    })

    return {
      completedToday,
      streaks,
      totalDDC: user.totalDDC,
      plantGrowthStage: user.plantGrowthStage,
      currentStreak: user.streakCount,
    }
  } catch (e) {
    console.error('Failed to load user habits:', e)
    // Return sensible defaults on error
    return {
      completedToday: [],
      streaks: {
        gratitude: 0,
        meditation: 0,
        training: 0,
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        sleeptime_stories: 0,
        planning: 0,
        mindful_movements: 0,
      },
      totalDDC: 0,
      plantGrowthStage: 0,
      currentStreak: 0,
    }
  }
}

/**
 * Get user's DDC balance
 */
export async function getDDC(userId: string): Promise<number> {
  try {
    return await getDDCBalance(userId)
  } catch {
    return 0
  }
}

/**
 * Get user's current plant growth stage
 */
export async function getGrowthStage(userId: string): Promise<number> {
  try {
    return await getPlantGrowthStage(userId)
  } catch {
    return 0
  }
}

/**
 * Get user's current streak
 */
export async function getStreak(userId: string): Promise<number> {
  try {
    return await getCurrentStreak(userId)
  } catch {
    return 0
  }
}
