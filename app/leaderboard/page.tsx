'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface LeaderboardUser {
  rank: number
  userId: string
  username: string
  totalTokens: number
  totalRewardPoints: number
  streakDay: number
  todayRewardPoints: number
}

interface UserRank {
  rank: number
  userId: string
  totalTokens: number
  percentile: number
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [userRank, setUserRank] = useState<UserRank | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [period, setPeriod] = useState<'all' | 'week' | 'month'>('all')

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          period,
          limit: '10',
          ...(currentUser?.id && { userId: currentUser.id }),
        })

        const response = await fetch(`/api/leaderboard?${params}`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          setUsers(data.topUsers || [])
          setUserRank(data.userRank || null)
        } else {
          throw new Error(data.error || 'Failed to fetch leaderboard')
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('[leaderboard]', message)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [period, currentUser?.id])

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `${rank}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              ← Back
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">🏆 Leaderboard</h1>
            <div className="w-12"></div>
          </div>

          <p className="text-gray-600 mb-6">
            See how you rank against other users earning tokens across all habit apps.
          </p>

          {/* Period Filters */}
          <div className="flex gap-3 flex-wrap">
            {(['all', 'week', 'month'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  period === p
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {p === 'all' ? 'All Time' : p === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-8">
            Error: {error}
          </div>
        )}

        {/* User's Current Rank */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-8 border-2 border-purple-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-semibold">YOUR CURRENT RANK</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  #{userRank.rank} / {users.length > 0 ? users[0].rank + 1000 : '?'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-600 font-semibold">TOKENS</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{userRank.totalTokens.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-600 font-semibold">PERCENTILE</p>
                <p className="text-3xl font-bold text-purple-900 mt-2 text-green-600">
                  Top {userRank.percentile}%
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg">No users on leaderboard yet</p>
            <p className="text-gray-500 text-sm mt-2">Complete habits to earn tokens and appear here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user, index) => {
              const isCurrentUser = user.userId === currentUser?.id
              return (
                <motion.div
                  key={user.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-lg p-4 transition ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-pink-50 to-pink-100 border-2 border-pink-600 shadow-lg'
                      : 'bg-white border border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Left: Rank & User */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="text-3xl font-bold text-gray-400 w-12 text-center">
                        {getMedalEmoji(user.rank)}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold ${isCurrentUser ? 'text-pink-900' : 'text-gray-900'}`}>
                          {user.username}
                          {isCurrentUser && ' (You)'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {user.streakDay} day streak • {user.todayRewardPoints} RP today
                        </p>
                      </div>
                    </div>

                    {/* Right: Tokens & Points */}
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${isCurrentUser ? 'text-pink-600' : 'text-gray-900'}`}>
                        {user.totalTokens.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">tokens</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">📊 How Rankings Work</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Ranked by total tokens earned across all apps</li>
              <li>✓ Updated in real-time as you complete habits</li>
              <li>✓ Your streak multiplier affects earning potential</li>
              <li>✓ Top earners get featured on the leaderboard</li>
              <li>✓ Rankings reset monthly with special season bonuses</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-bold text-green-900 mb-3">🎯 Tips to Climb</h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li>⭐ Build long streaks for higher multipliers</li>
              <li>📱 Complete habits across multiple apps</li>
              <li>🎁 Golden seeds give bonus tokens</li>
              <li>🔥 Consistency is key - keep your streak alive</li>
              <li>💰 Higher RP habits = more tokens per completion</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-gray-200 mt-12 pt-8 pb-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/portfolio"
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition font-semibold text-gray-900 border border-gray-200"
            >
              📊 Portfolio
            </Link>
            <Link
              href="/leaderboard"
              className="p-4 bg-pink-50 rounded-lg text-center hover:bg-pink-100 transition font-semibold text-pink-900 border border-pink-200"
            >
              🏆 Leaderboard
            </Link>
            <Link
              href="/activity"
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition font-semibold text-gray-900 border border-gray-200"
            >
              📝 Activity
            </Link>
            <Link
              href="/store"
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition font-semibold text-gray-900 border border-gray-200"
            >
              🛍️ Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
