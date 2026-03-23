'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useUserBalance } from '@/lib/hooks/useUserBalance'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface EarningsData {
  date: string
  earnings: number
}

interface AppBreakdown {
  app: string
  icon: string
  earned: number
  percentage: number
  color: string
}

const APP_COLORS: { [key: string]: string } = {
  dishrated: '#ef4444',
  trainlog: '#3b82f6',
  'habit-garden': '#10b981',
  meditation: '#8b5cf6',
  stories: '#f59e0b',
  yoga: '#ec4899',
  hydrate: '#06b6d4',
  read: '#f97316',
}

const APP_ICONS: { [key: string]: string } = {
  dishrated: '🍽️',
  trainlog: '💪',
  'habit-garden': '🌿',
  meditation: '🧘',
  stories: '📖',
  yoga: '🤸',
  hydrate: '💧',
  read: '📚',
}

export default function PortfolioPage() {
  const [user, setUser] = useState<any>(null)
  const { balance, loading: balanceLoading, error: balanceError, refresh } = useUserBalance(user?.id)
  const [weeklyData, setWeeklyData] = useState<EarningsData[]>([])
  const [monthlyData, setMonthlyData] = useState<EarningsData[]>([])
  const [appBreakdown, setAppBreakdown] = useState<AppBreakdown[]>([])
  const [activityLoading, setActivityLoading] = useState(false)

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Load activity data and generate charts
  useEffect(() => {
    if (!user?.id) return

    const loadActivityData = async () => {
      setActivityLoading(true)
      try {
        const response = await fetch(`/api/activity?userId=${user.id}&limit=1000`)
        if (response.ok) {
          const data = await response.json()
          const { completions } = data

          // Generate weekly data (last 7 days)
          const weeklyMap: { [key: string]: number } = {}
          const today = new Date()
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            weeklyMap[dateStr] = 0
          }

          // Generate monthly data (last 30 days)
          const monthlyMap: { [key: string]: number } = {}
          for (let i = 29; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            monthlyMap[dateStr] = 0
          }

          // Group by app for breakdown
          const appMap: { [key: string]: number } = {}

          completions.forEach((c: any) => {
            const dateStr = c.completedAt?.split('T')[0]
            const dateLabel = new Date(c.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            const tokens = c.rp_earned || 0

            // Weekly
            if (dateStr && weeklyMap.hasOwnProperty(dateStr)) {
              weeklyMap[dateStr] += tokens
            }

            // Monthly
            if (monthlyMap.hasOwnProperty(dateLabel)) {
              monthlyMap[dateLabel] += tokens
            }

            // App breakdown
            const app = c.source || 'unknown'
            appMap[app] = (appMap[app] || 0) + tokens
          })

          setWeeklyData(
            Object.entries(weeklyMap).map(([date, earnings]) => ({
              date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
              earnings: Math.round(earnings * 100) / 100,
            }))
          )

          setMonthlyData(
            Object.entries(monthlyMap).map(([date, earnings]) => ({
              date,
              earnings: Math.round(earnings * 100) / 100,
            }))
          )

          // App breakdown with colors
          const totalEarnings = Object.values(appMap).reduce((a: number, b: number) => a + b, 0)
          setAppBreakdown(
            Object.entries(appMap)
              .map(([app, earned]) => ({
                app,
                icon: APP_ICONS[app] || '✓',
                earned: Math.round((earned as number) * 100) / 100,
                percentage: totalEarnings > 0 ? Math.round(((earned as number) / totalEarnings) * 100) : 0,
                color: APP_COLORS[app] || '#6b7280',
              }))
              .sort((a, b) => b.earned - a.earned)
          )
        }
      } catch (error) {
        console.error('Failed to load activity data:', error)
      } finally {
        setActivityLoading(false)
      }
    }

    loadActivityData()
  }, [user?.id])

  const totalTokens = balance?.totalTokens || 0
  const todayEarnings = balance?.todayEarnings?.tokens_awarded || 0

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center py-20">
          <p className="text-gray-600">Please log in to view your portfolio.</p>
          <Link href="/login" className="mt-4 inline-block text-pink-600 hover:text-pink-700 font-semibold">
            Go to Login →
          </Link>
        </div>
      </div>
    )
  }

  if (balanceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <p className="mt-4 text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    )
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your Portfolio</h1>
            <button
              onClick={() => refresh()}
              className="text-gray-600 hover:text-gray-900 text-xl"
              title="Refresh"
            >
              🔄
            </button>
          </div>

          {balanceError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-4">
              Error: {balanceError}
            </div>
          )}

          {/* Balance Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200"
            >
              <p className="text-sm text-pink-600 font-semibold">Total Tokens</p>
              <p className="text-4xl font-bold text-pink-900">{totalTokens.toFixed(2)}</p>
              <p className="text-xs text-pink-700 mt-2">Across all apps</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200"
            >
              <p className="text-sm text-blue-600 font-semibold">Today's Earnings</p>
              <p className="text-4xl font-bold text-blue-900">{todayEarnings.toFixed(2)}</p>
              <p className="text-xs text-blue-700 mt-2">Tokens earned today</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200"
            >
              <p className="text-sm text-green-600 font-semibold">Reward Points</p>
              <p className="text-4xl font-bold text-green-900">{(balance?.totalRewardPoints || 0).toFixed(0)}</p>
              <p className="text-xs text-green-700 mt-2">Total RP earned</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {activityLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading charts...</p>
          </div>
        ) : (
          <>
            {/* Weekly Earnings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-blue-600"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Earnings</h2>
              {weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="earnings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 py-8 text-center">No data available yet</p>
              )}
            </motion.div>

            {/* Monthly Earnings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-green-600"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Earnings</h2>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#10b981"
                      dot={{ fill: '#10b981', r: 4 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 py-8 text-center">No data available yet</p>
              )}
            </motion.div>

            {/* App Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Earnings by App</h2>
              {appBreakdown.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pie Chart */}
                  <div className="flex justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={appBreakdown}
                          dataKey="earned"
                          nameKey="app"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, value }: any) => `${name} (${value}%)`}
                        >
                          {appBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Breakdown Table */}
                  <div className="space-y-3">
                    {appBreakdown.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-900 capitalize">{item.app}</p>
                            <p className="text-sm text-gray-600">{item.percentage}% of earnings</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{item.earned.toFixed(2)}</p>
                          <p className="text-xs text-gray-600">tokens</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 py-8 text-center">No earnings data yet. Complete habits to see breakdowns!</p>
              )}
            </motion.div>
          </>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-gray-200 mt-12 pt-8 pb-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/portfolio"
              className="p-4 bg-pink-50 rounded-lg text-center hover:bg-pink-100 transition font-semibold text-pink-900 border border-pink-200"
            >
              📊 Portfolio
            </Link>
            <Link
              href="/leaderboard"
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition font-semibold text-gray-900 border border-gray-200"
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
