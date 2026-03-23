/**
 * Dishrated webhook
 * Receives meal log completions from Dishrated app.
 *
 * POST /api/webhooks/dishrated
 * Body: { userId, mealType: "breakfast"|"lunch"|"dinner", mealName, healthScore?, notes? }
 *
 * Requires healthScore >= 5 to count (per HABITS_SPEC).
 */

import { NextRequest, NextResponse } from 'next/server'
import { recordCompletion } from '@/lib/firestoreIntegration'

const VALID_MEALS = ['breakfast', 'lunch', 'dinner'] as const
type MealType = typeof VALID_MEALS[number]

const MEAL_NAMES: { [key in MealType]: string } = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, mealType, mealName, healthScore, notes } = body

    if (!userId || !mealType) {
      return NextResponse.json({ error: 'Missing userId or mealType' }, { status: 400 })
    }

    const normalizedMeal = mealType.toLowerCase() as MealType
    if (!VALID_MEALS.includes(normalizedMeal)) {
      return NextResponse.json(
        { error: `Invalid mealType "${mealType}". Must be breakfast, lunch, or dinner.` },
        { status: 400 }
      )
    }

    // Health score gate: must be >= 5 to count (per HABITS_SPEC)
    if (healthScore !== undefined && healthScore !== null && Number(healthScore) < 5) {
      return NextResponse.json({
        success: false,
        message: `Meal not counted: health score ${healthScore}/10 is below minimum (5/10)`,
        ddcEarned: 0,
      })
    }

    const habitName = MEAL_NAMES[normalizedMeal]
    const notesStr = notes || [mealName, healthScore ? `Health: ${healthScore}/10` : null].filter(Boolean).join(' — ')

    const event = await recordCompletion(
      userId,
      normalizedMeal,
      habitName,
      'dishrated',
      notesStr
    )

    return NextResponse.json({
      success: true,
      event,
      message: `✅ ${habitName} logged: ${mealName || ''} → plant grew!`,
    })
  } catch (error) {
    console.error('Dishrated webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed', details: String(error) }, { status: 500 })
  }
}
