'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface DailyPieChartProps {
  userId: string
  dailyPoolSize?: number
}

interface HeartbeatState {
  total_network_rp: number
  total_pool: number
  user_count: number
}

interface UserEarnings {
  earned_rp: number
  multiplier: number
  rp_after_multiplier: number
  daily_pool_share: number
  tokens_awarded: number
}

export default function DailyPieChart({ userId, dailyPoolSize = 2739.72 }: DailyPieChartProps) {
  const [userRP, setUserRP] = useState(0)
  const [networkRP, setNetworkRP] = useState(0)
  const [userShare, setUserShare] = useState(0)
  const [userTokens, setUserTokens] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/heartbeat/status?userId=${userId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch heartbeat status')
        }

        const data = await response.json()

        if (data.user_info && data.heartbeat_state) {
          const userInfo = data.user_info
          const heartbeatState: HeartbeatState = data.heartbeat_state
          const todayEarnings: UserEarnings = userInfo.todayEarnings || {
            earned_rp: 0,
            multiplier: 1.0,
            rp_after_multiplier: 0,
            daily_pool_share: 0,
            tokens_awarded: 0,
          }

          const rp = userInfo.todayRewardPoints || 0
          const networkTotalRP = heartbeatState.total_network_rp || 1

          setUserRP(rp)
          setNetworkRP(networkTotalRP)
          setUserShare(todayEarnings.daily_pool_share || (rp / networkTotalRP) * 100)
          setUserTokens(todayEarnings.tokens_awarded || 0)
        }

        setError(null)
      } catch (err) {
        console.error('Error fetching pie chart data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [userId])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-lg p-6 shadow-md">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg p-6 shadow-md">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  const restOfNetwork = Math.max(0, 100 - userShare)
  const chartData = [
    {
      name: 'Your RP',
      value: Math.round(userShare * 100) / 100,
      color: '#ec4899',
    },
    {
      name: 'Rest of Network',
      value: Math.round(restOfNetwork * 100) / 100,
      color: '#d1d5db',
    },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Your RP: <span className="font-bold text-pink-600">{userRP}</span>
          </p>
          <p className="text-sm text-gray-600">
            Network RP: <span className="font-bold text-gray-600">{networkRP}</span>
          </p>
          <p className="text-sm text-gray-600">
            Your share: <span className="font-bold text-pink-600">{userShare.toFixed(2)}%</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Tokens: <span className="font-bold text-green-600">{userTokens.toFixed(2)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Daily Distribution Pool</h3>
        <p className="text-sm text-gray-600">
          Your slice: <span className="font-bold text-pink-600">{userShare.toFixed(2)}%</span> of{' '}
          <span className="font-bold">{dailyPoolSize.toLocaleString()}</span> tokens ={' '}
          <span className="font-bold text-green-600">{userTokens.toFixed(2)} tokens</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => {
              const data = entry.payload as any
              return `${value} (${data.value.toFixed(2)}%)`
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-pink-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Your Daily Share</p>
          <p className="text-2xl font-bold text-pink-600">{userShare.toFixed(2)}%</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Tokens Earned</p>
          <p className="text-2xl font-bold text-green-600">{userTokens.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
