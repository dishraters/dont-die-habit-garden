/**
 * DDHG Firestore Integration
 * 
 * Syncs with Habit Garden, Dishrated, Planning, Gratitude, TrainLog
 * Tracks DDC (Don't Die Credits) and plant growth
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
import { getDb } from './firebase'

export interface DDHGUser {
  id: string
  userId: string
  totalDDC: number
  plantGrowthStage: number
  streakCount: number
  lastCompletedAt?: string
  habits: string[] // habit IDs from Habit Garden
  created_at?: string
  updated_at?: string
}

export interface CompletionEvent {
  id: string
  userId: string
  habitId: string
  habitName: string
  source: 'habit-garden' | 'dishrated' | 'trainlog' | 'planning' | 'gratitude'
  completedAt: string
  ddcEarned: number
  streakIncremented: boolean
  growthStageIncremented: boolean
  mileachieved?: string // '3day' | '7day' | '30day'
  notes?: string
  created_at?: string
}

/**
 * Initialize or get DDHG user profile
 */
export async function initDDHGUser(userId: string): Promise<DDHGUser> {
  const q = query(collection(getDb(), 'ddhg_users'), where('userId', '==', userId))
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    const doc = snapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
    } as DDHGUser
  }

  // Create new user profile
  const newUser: Omit<DDHGUser, 'id'> = {
    userId,
    totalDDC: 0,
    plantGrowthStage: 0,
    streakCount: 0,
    habits: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const docRef = await addDoc(collection(getDb(), 'ddhg_users'), {
    ...newUser,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })

  return {
    id: docRef.id,
    ...newUser,
  }
}

/**
 * Record a habit completion from any source
 * Automatically calculates DDC, updates streaks, triggers plant growth
 */
export async function recordCompletion(
  userId: string,
  habitId: string,
  habitName: string,
  source: 'habit-garden' | 'dishrated' | 'trainlog' | 'planning' | 'gratitude',
  notes?: string
): Promise<CompletionEvent> {
  const user = await initDDHGUser(userId)
  const today = new Date().toDateString()

  // Check if already completed today
  const q = query(
    collection(getDb(), 'ddhg_completions'),
    where('userId', '==', userId),
    where('habitId', '==', habitId),
    where('completedAt', '>=', today)
  )
  const existing = await getDocs(q)
  
  if (!existing.empty) {
    // Already logged today
    const doc = existing.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
    } as CompletionEvent
  }

  // Calculate DDC reward
  let ddcEarned = 1 // Base reward
  let streakIncremented = false
  let growthStageIncremented = false
  let mileachieved: string | undefined

  // Increment streak
  const newStreak = user.streakCount + 1
  streakIncremented = true

  // Check milestone rewards
  if (newStreak === 3) {
    ddcEarned += 9 // total 10
    mileachieved = '3day'
  } else if (newStreak === 7) {
    ddcEarned += 19 // total 20
    mileachieved = '7day'
  } else if (newStreak === 30) {
    ddcEarned += 49 // total 50
    mileachieved = '30day'
  }

  // Check growth stage progression (based on streak)
  const oldGrowthStage = getGrowthStage(user.streakCount)
  const newGrowthStage = getGrowthStage(newStreak)
  if (newGrowthStage > oldGrowthStage) {
    growthStageIncremented = true
  }

  // Update user profile
  const newTotalDDC = user.totalDDC + ddcEarned
  await updateDoc(doc(getDb(), 'ddhg_users', user.id), {
    totalDDC: newTotalDDC,
    streakCount: newStreak,
    plantGrowthStage: newGrowthStage,
    lastCompletedAt: new Date().toISOString(),
    updated_at: serverTimestamp(),
  })

  // Record completion event
  const completionEvent: Omit<CompletionEvent, 'id'> = {
    userId,
    habitId,
    habitName,
    source,
    completedAt: new Date().toISOString(),
    ddcEarned,
    streakIncremented,
    growthStageIncremented,
    mileachieved,
    notes,
    created_at: new Date().toISOString(),
  }

  const eventDocRef = await addDoc(collection(getDb(), 'ddhg_completions'), {
    ...completionEvent,
    created_at: serverTimestamp(),
  })

  return {
    id: eventDocRef.id,
    ...completionEvent,
  }
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
 * Get user's current streak
 */
export async function getCurrentStreak(userId: string): Promise<number> {
  const user = await initDDHGUser(userId)
  return user.streakCount
}

/**
 * Calculate growth stage based on streak count
 * Mirrors Habit Garden's growth.ts logic
 */
function getGrowthStage(streakCount: number): number {
  if (streakCount >= 16) return 6 // Flourishing
  if (streakCount >= 11) return 5 // Blooming
  if (streakCount >= 7) return 4 // Budding
  if (streakCount >= 4) return 3 // Leafing
  if (streakCount >= 2) return 2 // Sprout
  if (streakCount >= 1) return 1 // Rooted
  return 0 // Seed
}

/**
 * Get recent completions
 */
export async function getCompletions(userId: string, limit: number = 10): Promise<CompletionEvent[]> {
  const q = query(
    collection(getDb(), 'ddhg_completions'),
    where('userId', '==', userId)
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    }) as CompletionEvent)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, limit)
}
