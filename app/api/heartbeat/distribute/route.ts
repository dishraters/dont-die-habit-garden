/**
 * Daily Distribution Trigger API Endpoint
 * 
 * POST /api/heartbeat/distribute
 * Triggers the daily token distribution and golden seed awards
 * 
 * Body (optional):
 * - force: boolean - force distribution even if already done today
 * - adminSecret: string - secret key for authorization (if required)
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  distributeDailyPool,
  awardGoldenSeeds,
  getHeartbeatState,
  DistributionResult,
  HeartbeatState,
} from '@/lib/heartbeatEngine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const force = body.force ?? false
    const adminSecret = body.adminSecret

    // Optional: Verify admin secret (uncomment if you add auth)
    // if (adminSecret !== process.env.HEARTBEAT_ADMIN_SECRET) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    console.log('[heartbeat/distribute] Starting distribution...', { force })

    // Check if already distributed today (unless force=true)
    if (!force) {
      const today = new Date().toISOString().split('T')[0]
      const state = await getHeartbeatState(today)
      
      if (state) {
        return NextResponse.json(
          {
            status: 'already_distributed',
            message: 'Distribution already completed for today',
            state,
          },
          { status: 200 }
        )
      }
    }

    // Distribute daily pool
    const distributions: DistributionResult[] = await distributeDailyPool()
    console.log(`[heartbeat/distribute] Distributed to ${distributions.length} users`)

    // Award golden seeds
    await awardGoldenSeeds()
    console.log('[heartbeat/distribute] Golden seeds awarded')

    // Get updated state
    const state: HeartbeatState | null = await getHeartbeatState()

    return NextResponse.json({
      status: 'success',
      message: 'Heartbeat distribution completed',
      distributions_count: distributions.length,
      total_tokens_distributed: distributions.reduce((sum, d) => sum + d.tokens_awarded, 0),
      state,
    })
  } catch (error) {
    console.error('[heartbeat/distribute]', error)
    return NextResponse.json(
      { error: 'Failed to trigger distribution', details: String(error) },
      { status: 500 }
    )
  }
}
