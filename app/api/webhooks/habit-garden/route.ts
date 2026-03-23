/**
 * Habit Garden Webhook - Redirect to Heartbeat Complete
 * 
 * POST /api/webhooks/habit-garden
 * Body (planning): { userId, planDate, bigWins: string[] }
 * Body (gratitude): { userId, entryDate, grateful1, grateful2, grateful3, affirmation? }
 * 
 * Proxies to /api/heartbeat/complete with standard schema
 */

import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_RP: { [key: string]: number } = {
  planning: 3,
  gratitude: 2,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    let habitType = ''
    let rp_earned = 1
    let notes = ''

    if (type === 'planning' || body.planDate !== undefined) {
      const { planDate, bigWins } = body
      if (!planDate) return NextResponse.json({ error: 'Missing planDate' }, { status: 400 })
      
      habitType = 'planning'
      rp_earned = DEFAULT_RP.planning
      notes = bigWins?.length ? `Big wins: ${bigWins.join(', ')}` : `Plan for ${planDate}`
    } else if (type === 'gratitude' || body.entryDate !== undefined) {
      const { entryDate, grateful1, grateful2, grateful3, affirmation } = body
      if (!entryDate) return NextResponse.json({ error: 'Missing entryDate' }, { status: 400 })
      
      habitType = 'gratitude'
      rp_earned = DEFAULT_RP.gratitude
      const parts = [grateful1, grateful2, grateful3].filter(Boolean)
      notes = parts.length
        ? `Grateful for: ${parts.join(', ')}${affirmation ? `. ${affirmation}` : ''}`
        : `Gratitude entry for ${entryDate}`
    } else {
      return NextResponse.json({ error: 'Unknown habit type. Use type: "planning" or "gratitude"' }, { status: 400 })
    }

    // Proxy to /api/heartbeat/complete
    const response = await fetch('https://dont-die-habit-garden.vercel.app/api/heartbeat/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        habitType,
        userId,
        rp_earned,
        sourceApp: 'habit-garden',
        notes,
        timestamp: new Date().toISOString(),
      }),
    })

    const heartbeatResponse = await response.json()

    return NextResponse.json({
      success: heartbeatResponse.success,
      message: `✅ ${habitType.charAt(0).toUpperCase() + habitType.slice(1)} logged`,
      ...heartbeatResponse,
    })
  } catch (error) {
    console.error('[webhooks/habit-garden]', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed', details: String(error) },
      { status: 500 }
    )
  }
}
