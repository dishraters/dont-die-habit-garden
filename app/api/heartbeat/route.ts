/**
 * Heartbeat API Endpoint - HEARTBEAT TOKENOMICS v2.0
 *
 * Routes:
 * GET  /api/heartbeat/status - Get current day's state + user's distribution info
 * POST /api/heartbeat/trigger - Manually trigger daily distribution (testing)
 * POST /api/heartbeat/sync-user - Sync a user's RP and expected tokens
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  distributeDailyPool,
  awardGoldenSeeds,
  getHeartbeatState,
  getUserExpectedTokens,
  DistributionResult,
  HeartbeatState,
} from '../../../lib/heartbeatEngine'
import { initDDHGUser, getCompletions } from '../../../lib/firestoreIntegration'

/**
 * GET /api/heartbeat/status
 * Returns current day's state + user's distribution info
 *
 * Query params:
 * - userId: (optional) fetch user-specific info
 * - date: (optional) YYYY-MM-DD format, defaults to today
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const date = searchParams.get('date')

    const state = await getHeartbeatState(date)

    if (!state) {
      return NextResponse.json({
        status: 'no_heartbeat_today',
        message: 'No heartbeat state recorded for this date',
        date: date || new Date().toISOString().split('T')[0],
      })
    }

    const response: any = {
      status: 'success',
      heartbeat_state: state,
    }

    // If userId provided, add user-specific info
    if (userId) {
      const user = await initDDHGUser(userId)
      const expected_tokens = await getUserExpectedTokens(userId)
      const recent_completions = await getCompletions(userId, 5)

      response.user_info = {
        userId,
        totalRewardPoints: user.totalRewardPoints ?? 0,
        todayRewardPoints: user.todayRewardPoints ?? 0,
        totalTokens: user.totalTokens ?? 0,
        todayEarnings: user.todayEarnings ?? {
          earned_rp: 0,
          multiplier: 1.0,
          rp_after_multiplier: 0,
          daily_pool_share: 0,
          tokens_awarded: 0,
        },
        golden_seeds: user.golden_seeds ?? 0,
        expected_tokens_today: expected_tokens,
        lastHeartbeat: user.lastHeartbeat ?? '',
        recent_completions,
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[/api/heartbeat/status]', error)
    return NextResponse.json(
      { error: 'Failed to fetch heartbeat status', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * POST /api/heartbeat/trigger
 * Manually trigger daily distribution (for testing/admin)
 *
 * Body (optional):
 * - force: boolean - force distribution even if already done today
 */
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const pathname = url.pathname

    // Route: POST /api/heartbeat/trigger
    if (pathname.includes('/trigger')) {
      return await handleTrigger(req)
    }

    // Route: POST /api/heartbeat/sync-user
    if (pathname.includes('/sync-user')) {
      return await handleSyncUser(req)
    }

    return NextResponse.json(
      { error: 'Unknown POST endpoint' },
      { status: 404 }
    )
  } catch (error) {
    console.error('[/api/heartbeat POST]', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * Handle POST /api/heartbeat/trigger
 */
async function handleTrigger(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const force = body.force ?? false

    console.log('[heartbeat/trigger] Starting distribution...', { force })

    // Distribute daily pool
    const distributions = await distributeDailyPool()
    console.log(`[heartbeat/trigger] Distributed to ${distributions.length} users`)

    // Award golden seeds
    await awardGoldenSeeds()
    console.log('[heartbeat/trigger] Golden seeds awarded')

    // Get updated state
    const state = await getHeartbeatState()

    return NextResponse.json({
      status: 'success',
      message: 'Heartbeat distribution triggered',
      distributions_count: distributions.length,
      total_tokens_distributed: distributions.reduce((sum, d) => sum + d.tokens_awarded, 0),
      state,
    })
  } catch (error) {
    console.error('[heartbeat/trigger]', error)
    return NextResponse.json(
      { error: 'Failed to trigger heartbeat', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * Handle POST /api/heartbeat/sync-user
 * Sync a user's RP and expected tokens
 *
 * Body:
 * - userId: string (required)
 */
async function handleSyncUser(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const user = await initDDHGUser(userId)
    const expected_tokens = await getUserExpectedTokens(userId)
    const state = await getHeartbeatState()

    return NextResponse.json({
      status: 'success',
      user: {
        userId,
        totalRewardPoints: user.totalRewardPoints ?? 0,
        todayRewardPoints: user.todayRewardPoints ?? 0,
        totalTokens: user.totalTokens ?? 0,
        todayEarnings: user.todayEarnings,
        golden_seeds: user.golden_seeds ?? 0,
        expected_tokens_today: expected_tokens,
        lastHeartbeat: user.lastHeartbeat ?? '',
      },
      network_state: state
        ? {
            total_network_rp: state.total_network_rp,
            total_pool: state.total_pool,
            user_count: state.user_count,
          }
        : null,
    })
  } catch (error) {
    console.error('[heartbeat/sync-user]', error)
    return NextResponse.json(
      { error: 'Failed to sync user', details: String(error) },
      { status: 500 }
    )
  }
}
