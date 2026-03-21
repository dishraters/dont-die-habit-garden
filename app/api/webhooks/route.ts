/**
 * Webhook endpoints for syncing with other apps
 * 
 * POST /api/webhooks/exercise-complete (TrainLog)
 * POST /api/webhooks/meal-logged (Dishrated)
 * POST /api/webhooks/planning-complete (Habit Garden)
 * POST /api/webhooks/gratitude-complete (Habit Garden)
 */

import { NextRequest, NextResponse } from 'next/server'
import { recordCompletion } from '@/lib/firestoreIntegration'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const pathname = request.nextUrl.pathname

    if (pathname.includes('/exercise-complete')) {
      // TrainLog webhook
      const { userId, exerciseName, duration, notes } = body
      
      if (!userId || !exerciseName) {
        return NextResponse.json(
          { error: 'Missing userId or exerciseName' },
          { status: 400 }
        )
      }

      const event = await recordCompletion(
        userId,
        `trainlog_${exerciseName.toLowerCase().replace(/\s+/g, '_')}`,
        'Train',
        'trainlog',
        notes || `${exerciseName} for ${duration} min`
      )

      return NextResponse.json({
        success: true,
        event,
        message: `✅ Exercise logged: ${exerciseName} → plant grew!`,
      })
    }

    if (pathname.includes('/meal-logged')) {
      // Dishrated webhook
      const { userId, mealType, mealName, notes } = body
      
      if (!userId || !mealType) {
        return NextResponse.json(
          { error: 'Missing userId or mealType' },
          { status: 400 }
        )
      }

      const habitMap: { [key: string]: string } = {
        breakfast: 'breakfast',
        lunch: 'lunch',
        dinner: 'dinner',
        snack: 'snack',
      }

      const habitId = habitMap[mealType.toLowerCase()] || mealType.toLowerCase()
      const mealHabitMap: { [key: string]: string } = {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',
        snack: 'Snack',
      }
      const habitName = mealHabitMap[mealType.toLowerCase()] || mealType

      const event = await recordCompletion(
        userId,
        habitId,
        habitName,
        'dishrated',
        notes || mealName
      )

      return NextResponse.json({
        success: true,
        event,
        message: `✅ Meal logged: ${habitName} (${mealName}) → plant grew!`,
      })
    }

    if (pathname.includes('/planning-complete')) {
      // Planning webhook
      const { userId, planDate, planId, notes } = body
      
      if (!userId) {
        return NextResponse.json(
          { error: 'Missing userId' },
          { status: 400 }
        )
      }

      const event = await recordCompletion(
        userId,
        `plan_${planDate}`,
        'Plan',
        'planning',
        notes || `Daily plan created for ${planDate}`
      )

      return NextResponse.json({
        success: true,
        event,
        message: `✅ Plan completed → plant grew!`,
      })
    }

    if (pathname.includes('/gratitude-complete')) {
      // Gratitude webhook
      const { userId, entryDate, grateful1, grateful2, grateful3 } = body
      
      if (!userId || !entryDate) {
        return NextResponse.json(
          { error: 'Missing userId or entryDate' },
          { status: 400 }
        )
      }

      const event = await recordCompletion(
        userId,
        `gratitude_${entryDate}`,
        'Gratitude',
        'gratitude',
        `Grateful for: ${grateful1}, ${grateful2}, ${grateful3}`
      )

      return NextResponse.json({
        success: true,
        event,
        message: `✅ Gratitude logged → plant grew!`,
      })
    }

    return NextResponse.json(
      { error: 'Unknown webhook endpoint' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: String(error) },
      { status: 500 }
    )
  }
}
