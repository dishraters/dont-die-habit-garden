/**
 * DDHG Firestore Integration
 *
 * Per-habit streaks, per-habit token rewards, plant growth tracking.
 * Token values from HABITS_SPEC.md.
 */

import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'

// Per-habit token config from HABITS_SPEC.md
// base = tokens per day with no streak
// streak7 = total tokens per day at 7-day streak
// streak30 = total tokens per day at 30-day streak
const HABIT_TOKEN_CONFIG: { [habitId: string]: { base: number; streak7: number; streak30: number } } = {
  meditation: { base: 2,  streak7: 12, streak30: 27 },
  training:   { base: 3,  streak7: 18, streak30: 43 },
  breakfast:  { base: 1,  streak7: 9,  streak30: 21 },
  lunch:      { base: 1,  streak7: 9,  streak30: 21 },
  dinner:     { base: 1,  streak7: 9,  streak30: 21 },
  planning:   { base: 2,  streak7: 14, streak30: 32 },
  gratitude:  { base: 2,  streak7: 14, streak30: 32 },
  sleep:      { base: 2,  streak7: 12, streak30: 27 },
  stretching: { base: 2,  streak7: 12, streak30: 27 },
}

export interface DDHGUser {
  id: string
  userId: string
  totalDDC: number
  plantGrowthStage: number
  plantStreak: number         // consecutive days with ANY habit completed
  lastActivityDate: string    // YYYY-MM-DD, for plant streak calculation
  habitStreaks: { [habitId: string]: number }
  habitLastDates: { [habitId: string]: string } // YYYY-MM-DD per habit
  todayCompletedHabits: string[]
  todayDate: string           // YYYY-MM-DD, resets todayCompletedHabits when changed
  todayDDC: number
  created_at?: string
  updated_at?: string
}

export interface CompletionEvent {
  id: string
  userId: string
  habitId: string
  habitName: string
  source: 'habit-garden' | 'dishrated' | 'trainlog' | 'planning' | 'gratitude' | 'ddhg'
  completedAt: string
  ddcEarned: number
  streakDay: number         // which day of the habit streak this was
  growthStageChanged: boolean
  milestoneReached?: '7day' | '30day'
  notes?: string
  created_at?: string
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD
}

function getGrowthStage(plantStreak: number): number {
  if (plantStreak >= 16) return 6 // Flourishing
  if (plantStreak >= 11) return 5 // Blooming
  if (plantStreak >= 7)  return 4 // Budding
  if (plantStreak >= 4)  return 3 // Leafing
  if (plantStreak >= 2)  return 2 // Sprout
  if (plantStreak >= 1)  return 1 // Rooted
  return 0                         // Seed
}

function calcTokens(habitId: string, newStreak: number): { tokens: number; milestone?: '7day' | '30day' } {
  const config = HABIT_TOKEN_CONFIG[habitId] || { base: 1, streak7: 5, streak30: 10 }
  let tokens: number
  let milestone: '7day' | '30day' | undefined

  if (newStreak >= 30) {
    tokens = config.streak30
  } else if (newStreak >= 7) {
    tokens = config.streak7
  } else {
    tokens = config.base
  }

  // One-time milestone bonus on the exact day
  if (newStreak === 7) {
    tokens += 5
    milestone = '7day'
  } else if (newStreak === 30) {
    tokens += 20
    milestone = '30day'
  }

  return { tokens, milestone }
}

/**
 * Initialize or get DDHG user profile
 */
export async function initDDHGUser(userId: string): Promise<DDHGUser> {
  const q = query(collection(db, 'ddhg_users'), where('userId', '==', userId))
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0]
    const data = docSnap.data() as Omit<DDHGUser, 'id'>
    // Ensure new fields exist (backwards compat with old schema)
    return {
      id: docSnap.id,
      habitStreaks: {},
      habitLastDates: {},
      todayCompletedHabits: [],
      todayDate: todayStr(),
      todayDDC: 0,
      plantStreak: data.plantGrowthStage || 0, // fallback
      lastActivityDate: '',
      ...data,
    }
  }

  // Create new user
  const today = todayStr()
  const newUser: Omit<DDHGUser, 'id'> = {
    userId,
    totalDDC: 0,
    plantGrowthStage: 0,
    plantStreak: 0,
    lastActivityDate: '',
    habitStreaks: {},
    habitLastDates: {},
    todayCompletedHabits: [],
    todayDate: today,
    todayDDC: 0,
  }

  const docRef = await addDoc(collection(db, 'ddhg_users'), {
    ...newUser,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })

  return { id: docRef.id, ...newUser }
}

/**
 * Record a habit completion from any source.
 * Handles per-habit streaks, per-habit token rewards, plant streak, deduplication.
 */
export async function recordCompletion(
  userId: string,
  habitId: string,
  habitName: string,
  source: CompletionEvent['source'],
  notes?: string
): Promise<CompletionEvent> {
  const user = await initDDHGUser(userId)
  const today = todayStr()

  // Reset today's data if it's a new day
  const freshToday = user.todayDate !== today
  const todayCompleted: string[] = freshToday ? [] : (user.todayCompletedHabits || [])

  // Deduplicate: already logged this habit today
  if (todayCompleted.includes(habitId)) {
    // Return a mock event for the existing completion
    return {
      id: 'duplicate',
      userId,
      habitId,
      habitName,
      source,
      completedAt: new Date().toISOString(),
      ddcEarned: 0,
      streakDay: user.habitStreaks?.[habitId] || 0,
      growthStageChanged: false,
      notes,
    }
  }

  // --- Calculate per-habit streak ---
  const habitLastDate = user.habitLastDates?.[habitId] || ''
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newHabitStreak: number
  if (habitLastDate === yesterdayStr || habitLastDate === today) {
    // Consecutive day (or somehow same-day, shouldn't reach here due to dedup)
    newHabitStreak = (user.habitStreaks?.[habitId] || 0) + 1
  } else {
    // Gap > 1 day → reset streak
    newHabitStreak = 1
  }

  // --- Calculate tokens ---
  const { tokens, milestone } = calcTokens(habitId, newHabitStreak)

  // --- Calculate plant streak ---
  let newPlantStreak = user.plantStreak || 0
  const lastActivity = user.lastActivityDate || ''

  if (lastActivity === today) {
    // Already did a habit today, plant streak stays
  } else if (lastActivity === yesterdayStr) {
    newPlantStreak += 1
  } else if (lastActivity === '') {
    newPlantStreak = 1 // First ever activity
  } else {
    newPlantStreak = 1 // Gap → reset
  }

  const oldGrowthStage = user.plantGrowthStage
  const newGrowthStage = getGrowthStage(newPlantStreak)
  const growthStageChanged = newGrowthStage > oldGrowthStage

  // --- Update user doc ---
  const newTodayCompleted = [...todayCompleted, habitId]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = {
    totalDDC: user.totalDDC + tokens,
    plantGrowthStage: newGrowthStage,
    plantStreak: newPlantStreak,
    lastActivityDate: today,
    habitStreaks: { ...(user.habitStreaks || {}), [habitId]: newHabitStreak },
    habitLastDates: { ...(user.habitLastDates || {}), [habitId]: today },
    todayCompletedHabits: newTodayCompleted,
    todayDate: today,
    todayDDC: (freshToday ? 0 : (user.todayDDC || 0)) + tokens,
    updated_at: serverTimestamp(),
  }

  await updateDoc(doc(db, 'ddhg_users', user.id), updates)

  // --- Record completion event ---
  const event: Omit<CompletionEvent, 'id'> = {
    userId,
    habitId,
    habitName,
    source,
    completedAt: new Date().toISOString(),
    ddcEarned: tokens,
    streakDay: newHabitStreak,
    growthStageChanged,
    milestoneReached: milestone,
    notes,
    created_at: new Date().toISOString(),
  }

  const eventRef = await addDoc(collection(db, 'ddhg_completions'), {
    ...event,
    created_at: serverTimestamp(),
  })

  return { id: eventRef.id, ...event }
}

/**
 * Get user's total DDC balance
 */
export async function getDDCBalance(userId: string): Promise<number> {
  const user = await initDDHGUser(userId)
  return user.totalDDC
}

/**
 * Get user's current plant growth stage
 */
export async function getPlantGrowthStage(userId: string): Promise<number> {
  const user = await initDDHGUser(userId)
  return user.plantGrowthStage
}

/**
 * Get user's current plant streak
 */
export async function getCurrentStreak(userId: string): Promise<number> {
  const user = await initDDHGUser(userId)
  return user.plantStreak
}

/**
 * Get recent completions for a user
 */
export async function getCompletions(userId: string, limit = 50): Promise<CompletionEvent[]> {
  const q = query(
    collection(db, 'ddhg_completions'),
    where('userId', '==', userId)
  )
  const snapshot = await getDocs(q)

  return snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }) as CompletionEvent)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, limit)
}
