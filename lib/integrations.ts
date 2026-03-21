/**
 * Firebase Integration Layer for DDHG
 * 
 * Syncs habit completions across:
 * - Habit Garden (growth stages, streaks)
 * - TrainLog (exercise completions)
 * - Dishrated (meal completions)
 * - Planning (daily planning completions)
 * - Gratitude (gratitude entries)
 * - DDC Tracking (Daily Discipline Currency stored in Firestore)
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

/**
 * Habit completion entry for tracking across apps
 */
export interface HabitCompletion {
  userId: string
  habitId: string
  habitType: 'exercise' | 'meal' | 'planning' | 'gratitude' | 'meditation'
  completedAt: string
  notes?: string
  time?: string
  ddeReward: number // DDC earned from this completion
}

/**
 * DDC (Daily Discipline Currency) tracker in Firestore
 */
export interface DDCBalance {
  userId: string
  totalDDC: number
  lastUpdated: string
  dailyEarnings: { [date: string]: number }
}

/**
 * Growth stage tracker synced from Habit Garden
 */
export interface GrowthStageUpdate {
  userId: string
  habitId: string
  stageLevel: number // 0=seed, 1=sprout, 2=growing, 3=blooming, 4=flourishing, 5=thriving, 6=legendary
  streakCount: number
  lastUpdated: string
}

const COMPLETIONS_COLLECTION = 'habitCompletions'
const DDC_COLLECTION = 'ddc'
const GROWTH_STAGE_COLLECTION = 'growthStages'

// ============================================================================
// HABIT COMPLETION TRACKING
// ============================================================================

/**
 * Save a habit completion and sync to Habit Garden
 * Automatically rewards DDC based on habit type
 */
export async function saveHabitCompletion(
  userId: string,
  habitId: string,
  habitType: 'exercise' | 'meal' | 'planning' | 'gratitude' | 'meditation',
  notes?: string,
  time?: string
): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  const timestamp = new Date().toISOString()

  // Determine DDC reward based on habit type
  const ddeReward = getDDCRewardForHabit(habitType)

  // Create completion record
  const completion: HabitCompletion = {
    userId,
    habitId,
    habitType,
    completedAt: timestamp,
    notes,
    time,
    ddeReward,
  }

  // Save to habitCompletions collection with date-based ID for easy querying
  const completionRef = doc(
    db,
    COMPLETIONS_COLLECTION,
    `${userId}_${habitId}_${today}`
  )
  await setDoc(completionRef, completion, { merge: true })

  // Add DDC to user's balance
  await addDDC(userId, ddeReward)

  // Sync to Habit Garden (update streak/stage)
  await syncToHabitGarden(userId, habitId, habitType)
}

/**
 * Retrieve all completions for a user on a specific date
 */
export async function getCompletionsForDate(
  userId: string,
  dateStr: string
): Promise<HabitCompletion[]> {
  const q = query(
    collection(db, COMPLETIONS_COLLECTION),
    where('userId', '==', userId),
    where('completedAt', '>=', `${dateStr}T00:00:00`),
    where('completedAt', '<=', `${dateStr}T23:59:59`),
    orderBy('completedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as HabitCompletion)
}

/**
 * Retrieve all completions for a user (recent first, limit 30)
 */
export async function getCompletionHistory(
  userId: string,
  limitCount: number = 30
): Promise<HabitCompletion[]> {
  const q = query(
    collection(db, COMPLETIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('completedAt', 'desc'),
    limit(limitCount)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as HabitCompletion)
}

/**
 * Calculate streak for a specific habit (days in a row)
 */
export async function calculateStreak(
  userId: string,
  habitId: string
): Promise<number> {
  const completions = await getCompletionHistory(userId, 365)
  const completedDates = new Set<string>()

  completions
    .filter(c => c.habitId === habitId)
    .forEach(c => {
      const date = c.completedAt.split('T')[0]
      completedDates.add(date)
    })

  let streak = 0
  const today = new Date()

  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]

    if (completedDates.has(dateStr)) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// ============================================================================
// DDC (DAILY DISCIPLINE CURRENCY) MANAGEMENT
// ============================================================================

/**
 * Get current DDC balance for user
 */
export async function getDDCBalance(userId: string): Promise<number> {
  try {
    const ref = doc(db, DDC_COLLECTION, userId)
    const snapshot = await getDocs(
      query(collection(db, DDC_COLLECTION), where('userId', '==', userId))
    )

    if (snapshot.empty) {
      return 0
    }

    const docSnap = snapshot.docs[0]
    return (docSnap.data() as DDCBalance).totalDDC || 0
  } catch (e) {
    console.warn('Error getting DDC balance:', e)
    return 0
  }
}

/**
 * Add DDC to user's balance and record daily earnings
 */
export async function addDDC(userId: string, amount: number): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0]
    const ref = doc(db, DDC_COLLECTION, userId)

    // Get current balance
    const currentBalance = await getDDCBalance(userId)
    const newBalance = currentBalance + amount

    // Update with merge to preserve existing data
    await setDoc(
      ref,
      {
        userId,
        totalDDC: newBalance,
        lastUpdated: serverTimestamp(),
        [`dailyEarnings.${today}`]: (currentBalance + amount) - currentBalance,
      },
      { merge: true }
    )

    return newBalance
  } catch (e) {
    console.warn('Error adding DDC:', e)
    return 0
  }
}

/**
 * Spend DDC (returns false if insufficient balance)
 */
export async function spendDDC(userId: string, amount: number): Promise<boolean> {
  try {
    const currentBalance = await getDDCBalance(userId)

    if (currentBalance < amount) {
      return false
    }

    const newBalance = currentBalance - amount
    const ref = doc(db, DDC_COLLECTION, userId)

    await setDoc(
      ref,
      {
        userId,
        totalDDC: newBalance,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    )

    return true
  } catch (e) {
    console.warn('Error spending DDC:', e)
    return false
  }
}

/**
 * Get daily earnings breakdown for a user (last 30 days)
 */
export async function getDailyEarnings(userId: string): Promise<{ [date: string]: number }> {
  try {
    const snapshot = await getDocs(
      query(collection(db, DDC_COLLECTION), where('userId', '==', userId))
    )

    if (snapshot.empty) {
      return {}
    }

    const docSnap = snapshot.docs[0]
    return (docSnap.data() as DDCBalance).dailyEarnings || {}
  } catch (e) {
    console.warn('Error getting daily earnings:', e)
    return {}
  }
}

// ============================================================================
// GROWTH STAGE SYNCING WITH HABIT GARDEN
// ============================================================================

/**
 * Listen for growth stage updates from Habit Garden
 * Call this on app init to keep DDHG in sync with Habit Garden's progression
 */
export async function subscribeToGrowthStageUpdates(
  userId: string,
  onUpdate: (update: GrowthStageUpdate) => void
): Promise<() => void> {
  // This is a real-time listener setup
  // In production, use onSnapshot() for live updates
  // For now, return a no-op unsubscribe function

  const checkGrowthStages = async () => {
    try {
      const q = query(
        collection(db, GROWTH_STAGE_COLLECTION),
        where('userId', '==', userId),
        orderBy('lastUpdated', 'desc')
      )
      const snapshot = await getDocs(q)
      snapshot.docs.forEach(doc => {
        onUpdate(doc.data() as GrowthStageUpdate)
      })
    } catch (e) {
      console.warn('Error checking growth stages:', e)
    }
  }

  // Check immediately
  await checkGrowthStages()

  // Return unsubscribe function (polling interval ID would go here)
  return () => {}
}

/**
 * Sync habit completion to Habit Garden's growth stage tracker
 * Called automatically when a habit is completed
 */
export async function syncToHabitGarden(
  userId: string,
  habitId: string,
  habitType: string
): Promise<void> {
  try {
    // Calculate current streak from DDHG data
    const streak = await calculateStreak(userId, habitId)

    // Determine growth stage based on streak
    const stageLevel = calculateGrowthStage(streak)

    // Record in growth stage tracker
    const stageRef = doc(db, GROWTH_STAGE_COLLECTION, `${userId}_${habitId}`)
    await setDoc(
      stageRef,
      {
        userId,
        habitId,
        stageLevel,
        streakCount: streak,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    )
  } catch (e) {
    console.warn('Error syncing to Habit Garden:', e)
  }
}

/**
 * Get latest growth stage for a habit
 */
export async function getGrowthStage(
  userId: string,
  habitId: string
): Promise<GrowthStageUpdate | null> {
  try {
    const q = query(
      collection(db, GROWTH_STAGE_COLLECTION),
      where('userId', '==', userId),
      where('habitId', '==', habitId),
      limit(1)
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return null
    }

    return snapshot.docs[0].data() as GrowthStageUpdate
  } catch (e) {
    console.warn('Error getting growth stage:', e)
    return null
  }
}

/**
 * Get all growth stages for a user
 */
export async function getAllGrowthStages(userId: string): Promise<GrowthStageUpdate[]> {
  try {
    const q = query(
      collection(db, GROWTH_STAGE_COLLECTION),
      where('userId', '==', userId),
      orderBy('lastUpdated', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data() as GrowthStageUpdate)
  } catch (e) {
    console.warn('Error getting all growth stages:', e)
    return []
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determine DDC reward based on habit type
 * Exercise = 50 DDC
 * Meal = 30 DDC
 * Planning = 40 DDC
 * Gratitude = 25 DDC
 * Meditation = 35 DDC
 */
function getDDCRewardForHabit(habitType: string): number {
  const rewards: { [key: string]: number } = {
    exercise: 50,
    meal: 30,
    planning: 40,
    gratitude: 25,
    meditation: 35,
  }
  return rewards[habitType] || 0
}

/**
 * Calculate growth stage (0-6) based on streak count
 * 0 = seed (0 days)
 * 1 = sprout (1-3 days)
 * 2 = growing (4-7 days)
 * 3 = blooming (8-14 days)
 * 4 = flourishing (15-30 days)
 * 5 = thriving (31-100 days)
 * 6 = legendary (100+ days)
 */
function calculateGrowthStage(streakCount: number): number {
  if (streakCount === 0) return 0
  if (streakCount <= 3) return 1
  if (streakCount <= 7) return 2
  if (streakCount <= 14) return 3
  if (streakCount <= 30) return 4
  if (streakCount <= 100) return 5
  return 6
}
