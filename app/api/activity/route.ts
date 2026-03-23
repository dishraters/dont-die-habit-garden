/**
 * Activity Feed API
 * 
 * GET /api/activity?userId=XXX&limit=50&offset=0
 * Returns paginated list of recent habit completions across all apps
 */

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, query, where, orderBy, limit as firestoreLimit, Query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CompletionEvent } from '@/lib/firestoreIntegration'

interface ActivityResponse {
  success: boolean
  userId: string
  completions: CompletionEvent[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

const SOURCE_ICONS: { [key: string]: string } = {
  ddhg: '🌱',
  dishrated: '🍽️',
  trainlog: '💪',
  'habit-garden': '🌿',
  'meditation-timer': '🧘',
  'stories-player': '📖',
  'yoga-app': '🤸',
  'hydrate-app': '💧',
  'read-timer': '📚',
  planning: '📋',
  gratitude: '🙏',
}

const HABIT_NAMES: { [key: string]: string } = {
  meditation: 'Meditation',
  sleeptime_stories: 'Sleep Stories',
  mindful_movements: 'Yoga',
  gratitude: 'Gratitude',
  planning: 'Planning',
  training: 'Training',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  hydration: 'Hydration',
  reading: 'Reading',
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const limitParam = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offsetParam = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId query parameter is required' },
        { status: 400 }
      )
    }

    // Query completions for this user, ordered by date (newest first)
    const q = query(
      collection(db, 'completions'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      firestoreLimit(limitParam + 1) // Fetch one extra to determine hasMore
    ) as Query

    const snapshot = await getDocs(q)
    const allCompletions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as CompletionEvent[]

    // Apply offset
    const completions = allCompletions.slice(offsetParam, offsetParam + limitParam)
    const hasMore = allCompletions.length > offsetParam + limitParam

    // Enrich with icons and friendly names
    const enrichedCompletions = completions.map(c => ({
      ...c,
      sourceIcon: SOURCE_ICONS[c.source] || '✓',
      habitDisplayName: HABIT_NAMES[c.habitId] || c.habitName,
    }))

    const response: ActivityResponse = {
      success: true,
      userId,
      completions: enrichedCompletions as any,
      total: allCompletions.length,
      limit: limitParam,
      offset: offsetParam,
      hasMore,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[/api/activity]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity', details: String(error) },
      { status: 500 }
    )
  }
}
