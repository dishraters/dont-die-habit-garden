/**
 * Dishrated Webhook - Redirect to Heartbeat Complete
 * 
 * POST /api/webhooks/dishrated
 * Body: { userId, mealType, mealName, healthScore?, notes? }
 * 
 * Proxies to /api/heartbeat/complete with standard schema
 */

import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_RP_VALUES: { [key: string]: number } = {
  breakfast: 2,
  lunch: 3,
  dinner: 3,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, mealType, mealName, healthScore, notes } = body

    if (!userId || !mealType) {
      return NextResponse.json({ error: 'Missing userId or mealType' }, { status: 400 })
    }

    // Health score gate: must be >= 5 to count
    if (healthScore !== undefined && healthScore !== null && Number(healthScore) < 5) {
      return NextResponse.json({
        success: false,
        message: `Meal not counted: health score ${healthScore}/10 is below minimum (5/10)`,
        estimated_tokens: 0,
      })
    }

    const normalizedMeal = mealType.toLowerCase()
    const rp_earned = DEFAULT_RP_VALUES[normalizedMeal] || 2
    const notesStr = notes || [mealName, healthScore ? `Health: ${healthScore}/10` : null].filter(Boolean).join(' — ')

    // Proxy to /api/heartbeat/complete with standard schema
    const response = await fetch('https://dont-die-habit-garden.vercel.app/api/heartbeat/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        habitType: normalizedMeal,
        userId,
        rp_earned,
        sourceApp: 'dishrated',
        notes: notesStr,
        timestamp: new Date().toISOString(),
      }),
    })

    const heartbeatResponse = await response.json()

    return NextResponse.json({
      success: heartbeatResponse.success,
      message: `✅ ${normalizedMeal.charAt(0).toUpperCase() + normalizedMeal.slice(1)} logged: ${mealName || ''}`,
      ...heartbeatResponse,
    })
  } catch (error) {
    console.error('[webhooks/dishrated]', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed', details: String(error) },
      { status: 500 }
    )
  }
}
