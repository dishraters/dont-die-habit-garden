/**
 * Heartbeat Engine - HEARTBEAT TOKENOMICS v2.0
 *
 * Manages daily token distribution pool, streak multipliers, and golden seed rewards.
 * Runs once per day to:
 * 1. Calculate daily pool (2,739.72 base + bonuses)
 * 2. Distribute tokens proportionally to users based on their RP
 * 3. Award golden seeds for 30+ day streaks
 * 4. Track network-wide state
 */

import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  setDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { DDHGUser } from './firestoreIntegration'

// Daily token pool constants
const BASE_DAILY_POOL = 2739.72
const USER_BONUS_MULTIPLIER = 27.4 // $27.4 per 1000 users
const STREAK_MULTIPLIER_MAP: { [day: number]: number } = {
  1: 1.0, 2: 1.0,
  3: 1.2, 4: 1.2,
  5: 1.4, 6: 1.4,
  7: 1.6, 8: 1.6,
  9: 1.8, 10: 1.8,
  11: 2.0, 12: 2.0,
  13: 2.2, 14: 2.2,
  15: 2.4, 16: 2.4,
  17: 2.6, 18: 2.6,
  19: 2.8, 20: 2.8,
  21: 3.0, 22: 3.0,
  23: 3.5, 24: 3.5,
  25: 4.0, 26: 4.0,
  27: 4.5, 28: 4.5,
  29: 5.0, 30: 5.0,
}

export interface HeartbeatState {
  date: string
  total_network_rp: number
  total_pool: number
  user_count: number
  distributions: { [userId: string]: { tokens_awarded: number; pool_share: number } }
  ad_spend: number
  timestamp: string
}

export interface DistributionResult {
  userId: string
  tokens_awarded: number
  pool_share: number
}

/**
 * Calculate streak multiplier (1.0 to 15.0)
 * @param streakDay - consecutive days in a habit
 * @returns multiplier from 1.0 to 15.0
 */
export function calculateStreakMultiplier(streakDay: number): number {
  if (streakDay >= 31) return 15.0 // Hard cap at day 31+
  return STREAK_MULTIPLIER_MAP[streakDay] ?? 1.0
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Fetch all active users and calculate today's RP
 */
async function getAllUsersWithRP(): Promise<{ user: DDHGUser; daily_rp: number }[]> {
  const q = query(collection(db, 'ddhg_users'), where('userId', '!=', ''))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => {
    const user = { id: doc.id, ...doc.data() } as DDHGUser
    // Today's RP comes from todayRewardPoints
    const daily_rp = user.todayRewardPoints ?? 0
    return { user, daily_rp }
  })
}

/**
 * Distribute daily pool tokens proportionally based on users' daily RP
 * @returns array of distribution results per user
 */
export async function distributeDailyPool(): Promise<DistributionResult[]> {
  const today = todayStr()
  const usersWithRP = await getAllUsersWithRP()

  // Calculate network-wide daily RP
  const total_network_rp = usersWithRP.reduce((sum, { daily_rp }) => sum + daily_rp, 0)

  // Get active user count
  const user_count = usersWithRP.length

  // Calculate total pool: base + bonuses
  const user_bonus = (user_count / 1000) * USER_BONUS_MULTIPLIER
  const total_pool = BASE_DAILY_POOL + user_bonus // Ad jackpot not included in MVP

  // Distribute tokens
  const distributions: DistributionResult[] = []
  const distributionMap: { [userId: string]: { tokens_awarded: number; pool_share: number } } = {}

  for (const { user, daily_rp } of usersWithRP) {
    if (total_network_rp === 0) {
      // Edge case: no RP earned today, distribute evenly
      const equal_share = total_pool / user_count
      distributions.push({
        userId: user.userId,
        tokens_awarded: equal_share,
        pool_share: equal_share,
      })
      distributionMap[user.userId] = {
        tokens_awarded: equal_share,
        pool_share: equal_share,
      }
    } else {
      const pool_share = (daily_rp / total_network_rp) * total_pool
      distributions.push({
        userId: user.userId,
        tokens_awarded: pool_share,
        pool_share,
      })
      distributionMap[user.userId] = {
        tokens_awarded: pool_share,
        pool_share,
      }
    }
  }

  // Update user docs with distribution results
  for (const { user, daily_rp } of usersWithRP) {
    const dist = distributionMap[user.userId]
    if (dist) {
      const newTodayEarnings = {
        earned_rp: daily_rp,
        multiplier: daily_rp > 0 ? daily_rp / (daily_rp / 1) : 1.0, // Simplified; actual multiplier would be from calcTokens
        rp_after_multiplier: daily_rp,
        daily_pool_share: dist.pool_share,
        tokens_awarded: dist.tokens_awarded,
      }

      await updateDoc(doc(db, 'ddhg_users', user.id), {
        totalTokens: (user.totalTokens ?? 0) + dist.tokens_awarded,
        todayEarnings: newTodayEarnings,
        lastHeartbeat: new Date().toISOString(),
      })
    }
  }

  // Record heartbeat state
  const heartbeatState: HeartbeatState = {
    date: today,
    total_network_rp,
    total_pool,
    user_count,
    distributions: distributionMap,
    ad_spend: 0,
    timestamp: new Date().toISOString(),
  }

  await setDoc(doc(db, 'heartbeat_state', today), heartbeatState)

  return distributions
}

/**
 * Award golden seeds for users with 30+ day streaks
 */
export async function awardGoldenSeeds(): Promise<void> {
  const usersWithRP = await getAllUsersWithRP()

  for (const { user } of usersWithRP) {
    const habitStreaks = user.habitStreaks ?? {}
    const today = todayStr()

    for (const [habitId, streakDay] of Object.entries(habitStreaks)) {
      // Award golden seed on the exact day of 30-day streak (if not already awarded)
      if (streakDay === 30) {
        // Check if already awarded for this habit
        const existingSeeds = user.golden_seeds ?? 0
        
        // This is a simplified approach; in production, track per-habit golden seeds
        // For now, we increment the counter
        if (!user.lastHeartbeat || user.lastHeartbeat < today) {
          await updateDoc(doc(db, 'ddhg_users', user.id), {
            golden_seeds: existingSeeds + 1,
            lastHeartbeat: new Date().toISOString(),
          })
        }
      }
    }
  }
}

/**
 * Get current heartbeat state for a specific date
 * @param date - YYYY-MM-DD format, defaults to today
 */
export async function getHeartbeatState(date?: string): Promise<HeartbeatState | null> {
  const targetDate = date ?? todayStr()
  const docSnap = await getDocs(
    query(collection(db, 'heartbeat_state'), where('date', '==', targetDate))
  )

  if (docSnap.empty) return null

  const data = docSnap.docs[0].data()
  return {
    date: data.date,
    total_network_rp: data.total_network_rp,
    total_pool: data.total_pool,
    user_count: data.user_count,
    distributions: data.distributions ?? {},
    ad_spend: data.ad_spend ?? 0,
    timestamp: data.timestamp,
  } as HeartbeatState
}

/**
 * Get user's expected token amount based on current RP
 */
export async function getUserExpectedTokens(userId: string): Promise<number> {
  const state = await getHeartbeatState()
  if (!state || state.total_network_rp === 0) return 0

  // Fetch user
  const q = query(collection(db, 'ddhg_users'), where('userId', '==', userId))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return 0

  const user = snapshot.docs[0].data() as DDHGUser
  const user_daily_rp = user.todayRewardPoints ?? 0

  const expected_tokens = (user_daily_rp / state.total_network_rp) * state.total_pool
  return expected_tokens
}

/**
 * Calculate jackpot bonus based on ad revenue (future feature)
 * Currently returns 0, but can be extended when ad integration is ready
 * @param adRevenueAmount - total ad revenue collected
 * @returns jackpot amount to add to daily pool
 */
export function calculateJackpot(adRevenueAmount: number): number {
  // MVP: No ad jackpot yet
  // Future: adRevenueAmount * 0.1 (10% of ad revenue goes to jackpot)
  return 0
}

/**
 * Calculate user's RP based on habits completed
 * This is a reference function; actual RP calculation happens during habit completion
 * @param habitRP - sum of all RP earned from habit completions today
 * @param streakMultiplier - current streak multiplier
 * @returns total RP after multiplier applied
 */
export function calculateUserRP(habitRP: number, streakMultiplier: number): number {
  return habitRP * streakMultiplier
}
