/**
 * TrainLog webhook
 * Receives exercise completions from TrainLog app.
 *
 * POST /api/webhooks/trainlog
 * Body: { userId, exerciseName, duration?, intensityPoints?, notes? }
 *
 * Requires duration >= 20 min OR intensityPoints >= 5 (per HABITS_SPEC).
 */

import { NextRequest, NextResponse } from 'next/server'
import { recordCompletion } from '@/lib/firestoreIntegration'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, exerciseName, duration, intensityPoints, notes } = body

    if (!userId || !exerciseName) {
      return NextResponse.json({ error: 'Missing userId or exerciseName' }, { status: 400 })
    }

    const durationNum = Number(duration) || 0
    const intensityNum = Number(intensityPoints) || 0

    // Minimum requirement gate (per HABITS_SPEC)
    if (duration !== undefined && intensityPoints !== undefined) {
      if (durationNum < 20 && intensityNum < 5) {
        return NextResponse.json({
          success: false,
          message: `Exercise not counted: ${durationNum} min / ${intensityNum} intensity is below minimum (20 min OR 5 intensity points)`,
          ddcEarned: 0,
        })
      }
    }

    const notesStr = notes || [
      exerciseName,
      durationNum ? `${durationNum} min` : null,
      intensityNum ? `Intensity: ${intensityNum}` : null,
    ].filter(Boolean).join(' — ')

    const event = await recordCompletion(
      userId,
      'training',
      'Training',
      'trainlog',
      notesStr
    )

    return NextResponse.json({
      success: true,
      event,
      message: `✅ Training logged: ${exerciseName} → plant grew!`,
    })
  } catch (error) {
    console.error('TrainLog webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed', details: String(error) }, { status: 500 })
  }
}
