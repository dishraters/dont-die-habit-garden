/**
 * Habit Functions - Public API for components
 *
 * Wraps Firestore integration with user-friendly async functions.
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
  todayDDC: number
  plantGrowthStage: number
  plantStreak: number
}

export const HABIT_NAMES: { [habitId: string]: string } = {
  meditation: 'Meditation',
  training:   'Training',
  breakfast:  'Breakfast',
  lunch:      'Lunch',
  dinner:     'Dinner',
  planning:   'Planning',
  gratitude:  'Gratitude',
  sleep:      'Sleep',
  stretching: 'Stretching',
}

const CANONICAL_HABIT_IDS = Object.keys(HABIT_NAMES)

/**
 * Record a habit completion to Firestore
 */
export async function saveHabitCompletion(
  userId: string,
  habitId: string,
  notes?: string,
  time?: string,
  source: 'habit-garden' | 'dishrated' | 'trainlog' | 'planning' | 'gratitude' | 'ddhg' = 'ddhg'
): Promise<void> {
  const habitName = HABIT_NAMES[habitId] || habitId
  await recordCompletion(userId, habitId, habitName, source, notes)
}

/**
 * Load user habits, DDC, streaks, and plant growth stage
 */
export async function loadUserHabits(userId: string): Promise<UserHabits> {
  try {
    const user = await initDDHGUser(userId)
    const today = new Date().toISOString().split('T')[0]

    // Reset today's data if it's a new day
    const completedToday = user.todayDate === today
      ? (user.todayCompletedHabits || [])
      : []

    // Per-habit streaks from user doc
    const streaks: { [habitId: string]: number } = {}
    CANONICAL_HABIT_IDS.forEach(id => {
      streaks[id] = user.habitStreaks?.[id] || 0
    })

    return {
      completedToday,
      streaks,
      totalDDC: user.totalDDC || 0,
      todayDDC: user.todayDate === today ? (user.todayDDC || 0) : 0,
      plantGrowthStage: user.plantGrowthStage || 0,
      plantStreak: user.plantStreak || 0,
    }
  } catch (e) {
    console.error('Failed to load user habits:', e)
    const emptyStreaks: { [habitId: string]: number } = {}
    CANONICAL_HABIT_IDS.forEach(id => { emptyStreaks[id] = 0 })
    return {
      completedToday: [],
      streaks: emptyStreaks,
      totalDDC: 0,
      todayDDC: 0,
      plantGrowthStage: 0,
      plantStreak: 0,
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
 * Get user's current plant streak (consecutive days with any habit)
 */
export async function getStreak(userId: string): Promise<number> {
  try {
    return await getCurrentStreak(userId)
  } catch {
    return 0
  }
}
