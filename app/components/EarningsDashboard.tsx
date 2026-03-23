'use client'

import { useEffect, useState } from 'react'

interface EarningsDashboardProps {
  userId: string
}

interface TodayEarnings {
  earned_rp: number
  multiplier: number
  rp_after_multiplier: number
  daily_pool_share: number
  tokens_awarded: number
}

interface UserInfo {
  userId: string
  totalRewardPoints: number
  todayRewardPoints: number
  totalTokens: number
  todayEarnings: TodayEarnings
  golden_seeds: number
  lastHeartbeat: string
}

export default function EarningsDashboard({ userId }: EarningsDashboardProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/heartbeat/status?userId=${userId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch earnings data')
        }

        const data = await response.json()

        if (data.user_info) {
          setUserInfo(data.user_info)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching earnings:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchEarnings()
    const interval = setInterval(fetchEarnings, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [userId])

  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !userInfo) {
    return (
      <div className="w-full bg-red-50 rounded-lg p-6 shadow-md border border-red-200">
        <p className="text-red-700">Error loading earnings: {error}</p>
      </div>
    )
  }

  const earnings = userInfo.todayEarnings || {
    earned_rp: 0,
    multiplier: 1.0,
    rp_after_multiplier: 0,
    daily_pool_share: 0,
    tokens_awarded: 0,
  }

  const lastDistributionDate = userInfo.lastHeartbeat
    ? new Date(userInfo.lastHeartbeat).toLocaleDateString()
    : 'Never'

  return (
    <div className="w-full space-y-4">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Real-Time Earnings</h2>
        <p className="text-sm text-gray-600">Track your daily RP, multiplier, and tokens earned</p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Earned RP */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Today's Earned RP</h3>
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-3xl font-bold text-green-700 mb-2">{earnings.earned_rp}</p>
          <div className="text-xs text-gray-600 space-y-1 bg-white bg-opacity-50 p-2 rounded">
            <p>
              {earnings.earned_rp} RP <span className="text-green-600 font-semibold">× {earnings.multiplier.toFixed(1)}</span>
            </p>
            <p className="text-green-700 font-semibold">= {earnings.rp_after_multiplier.toFixed(0)} RP earned</p>
          </div>
        </div>

        {/* Streak Multiplier */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Streak Multiplier</h3>
            <span className="text-2xl animate-bounce">🔥</span>
          </div>
          <p className="text-3xl font-bold text-red-600 mb-2">{earnings.multiplier.toFixed(1)}×</p>
          <div className="text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
            <p>Bonus boost from your daily activity streak</p>
          </div>
        </div>

        {/* Projected Tokens (Pending) */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Projected Tokens</h3>
            <span className="text-2xl">💫</span>
          </div>
          <p className="text-3xl font-bold text-blue-700 mb-2">~{earnings.tokens_awarded.toFixed(2)}</p>
          <div className="text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
            <p>Pending distribution at next heartbeat</p>
          </div>
        </div>

        {/* Last Distribution */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Last Distribution</h3>
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-3xl font-bold text-purple-700 mb-2">{earnings.tokens_awarded.toFixed(2)}</p>
          <div className="text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
            <p>Distributed on {lastDistributionDate}</p>
          </div>
        </div>

        {/* Lifetime Tokens */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Lifetime Tokens</h3>
            <span className="text-2xl">💎</span>
          </div>
          <p className="text-3xl font-bold text-amber-700 mb-2">{userInfo.totalTokens.toFixed(2)}</p>
          <div className="text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
            <p>Total tokens earned across all time</p>
          </div>
        </div>

        {/* Golden Seeds */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-yellow-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Golden Seeds</h3>
            <span className="text-2xl animate-pulse">🌱</span>
          </div>
          <p className="text-3xl font-bold text-yellow-700 mb-2">{userInfo.golden_seeds}</p>
          <div className="text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
            <p>Earned from 30+ day streaks</p>
          </div>
        </div>
      </div>

      {/* Summary Info */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Breakdown</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Base RP earned today:</span>
            <span className="font-semibold text-gray-800">{earnings.earned_rp}</span>
          </div>
          <div className="flex justify-between">
            <span>Multiplier:</span>
            <span className="font-semibold text-gray-800">{earnings.multiplier.toFixed(1)}×</span>
          </div>
          <div className="flex justify-between">
            <span>Total RP (after multiplier):</span>
            <span className="font-semibold text-gray-800">{earnings.rp_after_multiplier.toFixed(0)}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between">
            <span className="font-semibold">Your pool share:</span>
            <span className="font-bold text-green-700">{earnings.daily_pool_share.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Tokens earned:</span>
            <span className="font-bold text-green-700">{earnings.tokens_awarded.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Real-time Note */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-xs text-blue-700">
          <span className="font-semibold">🔄 Real-time updates:</span> This dashboard updates every 30 seconds
          to reflect your latest activity and earnings.
        </p>
      </div>
    </div>
  )
}
