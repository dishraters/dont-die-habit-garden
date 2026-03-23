/**
 * Leaderboard API Endpoint
 * 
 * GET /api/heartbeat/leaderboard
 * Returns top users by totalTokens or todayRewardPoints with filters and sorting
 * 
 * Query params:
 * - limit: number (default 10, max 100) - number of users to return
 * - sortBy: 'totalTokens' | 'todayRewardPoints' (default: 'totalTokens')
 * - userId: string (optional) - to include current user's rank in response
 */

import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, query, orderBy, limit as firestoreLimit, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { DDHGUser } from '@/lib/firestoreIntegration'

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  totalTokens: number
  totalRewardPoints: number
  todayRewardPoints: number
  streakDay: number
  goldenSeeds: number
  avatar?: string
}

interface LeaderboardResponse {
  success: boolean
  sortBy: 'totalTokens' | 'todayRewardPoints'
  topUsers: LeaderboardEntry[]
  userRank?: {
    rank: number
    userId: string
    totalTokens: number
    todayRewardPoints: number
    percentile: number
  }
  totalUsers: number
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limitParam = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const sortBy = (searchParams.get('sortBy') || 'totalTokens') as 'totalTokens' | 'todayRewardPoints'
    const userId = searchParams.get('userId')

    // Validate sortBy parameter
    if (!['totalTokens', 'todayRewardPoints'].includes(sortBy)) {
      return NextResponse.json(
        { success: false, error: 'Invalid sortBy parameter. Use: totalTokens or todayRewardPoints' },
        { status: 400 }
      )
    }

    // Fetch all users sorted by requested field
    const q = query(
      collection(db, 'ddhg_users'),
      where('userId', '!=', ''),
      orderBy(sortBy as any, 'desc'),
      firestoreLimit(Math.max(limitParam, 100)) // Fetch more to find user's rank
    )

    const snapshot = await getDocs(q)
    const allUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (DDHGUser & { id: string })[]

    // Get top N users
    const topUsers: LeaderboardEntry[] = allUsers.slice(0, limitParam).map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      username: user.userId.substring(0, 8) + '***',
      totalTokens: user.totalTokens ?? 0,
      totalRewardPoints: user.totalRewardPoints ?? 0,
      todayRewardPoints: user.todayRewardPoints ?? 0,
      streakDay: user.streakDay ?? 0,
      goldenSeeds: user.golden_seeds ?? 0,
      avatar: user.avatar,
    }))

    const response: LeaderboardResponse = {
      success: true,
      sortBy,
      topUsers,
      totalUsers: allUsers.length,
    }

    // If userId provided, calculate their rank
    if (userId) {
      const userIndex = allUsers.findIndex((u) => u.userId === userId)
      if (userIndex !== -1) {
        const userDoc = allUsers[userIndex]
        const percentile = ((allUsers.length - userIndex - 1) / allUsers.length) * 100
        response.userRank = {
          rank: userIndex + 1,
          userId,
          totalTokens: userDoc.totalTokens ?? 0,
          todayRewardPoints: userDoc.todayRewardPoints ?? 0,
          percentile: Math.round(percentile),
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[/api/heartbeat/leaderboard]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard', details: String(error) },
      { status: 500 }
    )
  }
}
