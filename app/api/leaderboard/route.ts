/**
 * Leaderboard API
 * 
 * GET /api/leaderboard?period=all&limit=10
 * Returns top users by total tokens or period earnings
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
  streakDay: number
  todayRewardPoints: number
  avatar?: string
}

interface LeaderboardResponse {
  success: boolean
  period: string
  topUsers: LeaderboardEntry[]
  userRank?: {
    rank: number
    userId: string
    totalTokens: number
    percentile: number
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'all' // all, week, month
    const limitParam = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId') // optional, to get user's rank

    // Fetch all users sorted by totalTokens
    const q = query(
      collection(db, 'ddhg_users'),
      where('userId', '!=', ''),
      orderBy('totalTokens', 'desc'),
      firestoreLimit(limitParam > 100 ? 100 : limitParam)
    )

    const snapshot = await getDocs(q)
    const topUsers: LeaderboardEntry[] = snapshot.docs.map((doc, index) => {
      const user = { id: doc.id, ...doc.data() } as DDHGUser
      return {
        rank: index + 1,
        userId: user.userId,
        username: user.userId.substring(0, 8) + '***', // Hide full ID
        totalTokens: user.totalTokens ?? 0,
        totalRewardPoints: user.totalRewardPoints ?? 0,
        streakDay: user.plantStreak ?? 0,
        todayRewardPoints: user.todayRewardPoints ?? 0,
        avatar: user.plantGrowthStage ? `🌱` : '🌰',
      }
    })

    const response: LeaderboardResponse = {
      success: true,
      period,
      topUsers,
    }

    // If userId provided, calculate their rank
    if (userId) {
      const allUsersQ = query(
        collection(db, 'ddhg_users'),
        where('userId', '!=', ''),
        orderBy('totalTokens', 'desc')
      )
      const allSnapshot = await getDocs(allUsersQ)
      const allUsers = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DDHGUser))
      
      const userIndex = allUsers.findIndex(u => u.userId === userId)
      if (userIndex !== -1) {
        const userDoc = allUsers[userIndex]
        const percentile = ((allUsers.length - userIndex) / allUsers.length) * 100
        response.userRank = {
          rank: userIndex + 1,
          userId,
          totalTokens: userDoc.totalTokens ?? 0,
          percentile: Math.round(percentile),
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[/api/leaderboard]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard', details: String(error) },
      { status: 500 }
    )
  }
}
