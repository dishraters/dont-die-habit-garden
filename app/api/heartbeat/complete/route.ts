/**
 * Heartbeat Complete Endpoint - Record habit completion
 *
 * Route: POST /api/heartbeat/complete
 *
 * Webhook target for all 9 habit apps (meditation, stories, yoga, hydration, reading, etc)
 * Records habit completion → calculates RP → updates Firestore → returns real-time state
 */

import { NextRequest, NextResponse } from 'next/server'
import { recordCompletion, initDDHGUser } from '@/lib/firestoreIntegration'
import { calculateStreakMultiplier, getHeartbeatState, getUserExpectedTokens } from '@/lib/heartbeatEngine'

interface CompleteRequest {
  habitType: string // meditation, sleeptime_stories, mindful_movements, hydration, reading, training, breakfast, lunch, dinner, planning, gratitude
  userId: string
  rp_earned?: number // if not provided, use default based on habitType
  sourceApp?: string // meditation-timer, stories-player, yoga-app, hydrate-app, read-timer, dishrated, habit-garden, ddhg
  notes?: string
  timestamp?: string
}

interface CompleteResponse {
  success: boolean
  message: string
  user_daily_rp: number
  user_total_rp: number
  streak_day: number
  streak_multiplier: number
  final_rp: number
  estimated_tokens: number
  network_total_rp: number
  user_share_percent: number
  golden_seed_awarded?: boolean
  heartbeat_state?: any
}

// Default RP values per habit
const DEFAULT_RP_VALUES: { [key: string]: number } = {
  meditation: 2,
  sleeptime_stories: 3,
  mindful_movements: 2,
  gratitude: 2,
  planning: 3,
  training: 5,
  breakfast: 2,
  lunch: 3,
  dinner: 3,
  hydration: 1,
  reading: 3,
}

/**
 * POST /api/heartbeat/complete
 * Record a habit completion and calculate reward
 */
export async function POST(req: NextRequest) {
  try {
    const body: CompleteRequest = await req.json()

    // Validate required fields
    if (!body.habitType || !body.userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: habitType, userId',
        },
        { status: 400 }
      )
    }

    const { habitType, userId, sourceApp = 'ddhg', notes } = body

    // Get or create user
    const user = await initDDHGUser(userId)

    // Use provided RP or default
    const rp_earned = body.rp_earned ?? DEFAULT_RP_VALUES[habitType] ?? 1

    // Calculate streak and multiplier
    const streakDay = user.plantStreak ?? 0
    const multiplier = calculateStreakMultiplier(streakDay)
    const finalRP = rp_earned * multiplier

    // Map habit type to a display name for the completion record
    const habitNameMap: { [key: string]: string } = {
      meditation: 'Meditation',
      sleeptime_stories: 'Sleeptime Stories',
      mindful_movements: 'Mindful Movements',
      gratitude: 'Gratitude',
      planning: 'Planning',
      training: 'Training',
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      hydration: 'Hydration',
      reading: 'Reading',
    }

    const habitName = habitNameMap[habitType] || habitType
    const source = sourceApp === 'ddhg' ? 'ddhg' : (sourceApp as any)

    // Record completion in Firestore (will update todayRewardPoints, plantStreak, etc)
    await recordCompletion(
      userId,
      habitType,
      habitName,
      source,
      notes
    )

    // Refresh user to get updated values
    const updatedUser = await initDDHGUser(userId)
    const todayRP = updatedUser.todayRewardPoints ?? 0
    const totalRP = updatedUser.totalRewardPoints ?? 0
    const newStreakDay = updatedUser.plantStreak ?? 0
    const newMultiplier = calculateStreakMultiplier(newStreakDay)

    // Get network state for user's share
    const heartbeatState = await getHeartbeatState()
    const totalNetworkRP = heartbeatState?.total_network_rp ?? 0
    const userShare = totalNetworkRP > 0 ? (todayRP / totalNetworkRP) * 100 : 0

    // Estimate tokens based on proportional share
    const poolSize = heartbeatState?.total_pool ?? 2739.72
    const estimatedTokens = (userShare / 100) * poolSize

    // Check if golden seed awarded (30-day streak)
    const goldenSeedAwarded = newStreakDay >= 30

    const response: CompleteResponse = {
      success: true,
      message: `Habit '${habitType}' completed`,
      user_daily_rp: todayRP,
      user_total_rp: totalRP,
      streak_day: newStreakDay,
      streak_multiplier: newMultiplier,
      final_rp: finalRP,
      estimated_tokens: estimatedTokens,
      network_total_rp: totalNetworkRP,
      user_share_percent: userShare,
      ...(goldenSeedAwarded && { golden_seed_awarded: true }),
      heartbeat_state: heartbeatState || undefined,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error('Error in /api/heartbeat/complete:', error)
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/heartbeat/complete
 * Health check / info endpoint (not used for completions)
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/heartbeat/complete',
    method: 'POST',
    description: 'Record a habit completion and calculate reward',
    example_body: {
      habitType: 'meditation',
      userId: 'user123',
      rp_earned: 2,
      sourceApp: 'meditation-timer',
      notes: 'Morning session',
    },
  })
}
