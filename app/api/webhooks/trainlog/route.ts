/**
 * TrainLog Webhook - Redirect to Heartbeat Complete
 * 
 * POST /api/webhooks/trainlog
 * Body: { userId, exerciseName, duration?, intensityPoints?, notes? }
 * 
 * Proxies to /api/heartbeat/complete with standard schema
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, exerciseName, duration, intensityPoints, notes } = body

    if (!userId || !exerciseName) {
      return NextResponse.json({ error: 'Missing userId or exerciseName' }, { status: 400 })
    }

    const durationNum = Number(duration) || 0
    const intensityNum = Number(intensityPoints) || 0

    // Minimum requirement gate
    if (durationNum < 20 && intensityNum < 5) {
      return NextResponse.json({
        success: false,
        message: `Exercise not counted: below minimum (20 min OR 5 intensity points)`,
        estimated_tokens: 0,
      })
    }

    const notesStr = notes || [
      exerciseName,
      durationNum ? `${durationNum} min` : null,
      intensityNum ? `Intensity: ${intensityNum}` : null,
    ].filter(Boolean).join(' — ')

    // Proxy to /api/heartbeat/complete with standard schema
    const response = await fetch('https://dont-die-habit-garden.vercel.app/api/heartbeat/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        habitType: 'training',
        userId,
        rp_earned: 5,
        sourceApp: 'trainlog',
        notes: notesStr,
        timestamp: new Date().toISOString(),
      }),
    })

    const heartbeatResponse = await response.json()

    return NextResponse.json({
      success: heartbeatResponse.success,
      message: `✅ Training logged: ${exerciseName}`,
      ...heartbeatResponse,
    })
  } catch (error) {
    console.error('[webhooks/trainlog]', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed', details: String(error) },
      { status: 500 }
    )
  }
}
