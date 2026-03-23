/**
 * Habit Garden webhook
 * Receives planning and gratitude completions from Habit Garden app.
 *
 * POST /api/webhooks/habit-garden
 * Body (planning): { userId, planDate, bigWins: string[] }
 * Body (gratitude): { userId, entryDate, grateful1, grateful2, grateful3, affirmation? }
 */

import { NextRequest, NextResponse } from 'next/server'
import { recordCompletion } from '@/lib/firestoreIntegration'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    if (type === 'planning' || body.planDate !== undefined) {
      const { planDate, bigWins, notes } = body

      if (!planDate) {
        return NextResponse.json({ error: 'Missing planDate' }, { status: 400 })
      }

      const event = await recordCompletion(
        userId,
        'planning',
        'Planning',
        'planning',
        notes || (bigWins?.length ? `Big wins: ${bigWins.join(', ')}` : `Plan for ${planDate}`)
      )

      return NextResponse.json({
        success: true,
        event,
        message: `✅ Planning logged → plant grew!`,
      })
    }

    if (type === 'gratitude' || body.entryDate !== undefined) {
      const { entryDate, grateful1, grateful2, grateful3, affirmation } = body

      if (!entryDate) {
        return NextResponse.json({ error: 'Missing entryDate' }, { status: 400 })
      }

      const parts = [grateful1, grateful2, grateful3].filter(Boolean)
      const notesStr = parts.length
        ? `Grateful for: ${parts.join(', ')}${affirmation ? `. ${affirmation}` : ''}`
        : `Gratitude entry for ${entryDate}`

      const event = await recordCompletion(
        userId,
        'gratitude',
        'Gratitude',
        'gratitude',
        notesStr
      )

      return NextResponse.json({
        success: true,
        event,
        message: `✅ Gratitude logged → plant grew!`,
      })
    }

    return NextResponse.json({ error: 'Unknown habit type. Use type: "planning" or "gratitude"' }, { status: 400 })
  } catch (error) {
    console.error('Habit Garden webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed', details: String(error) }, { status: 500 })
  }
}
