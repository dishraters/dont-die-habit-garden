'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface ActivityEvent {
  id: string
  type: 'habit_complete' | 'reward_earned' | 'streak_milestone' | 'golden_seed' | 'rank_change'
  timestamp: string
  title: string
  description: string
  value?: number
  icon: string
  color: string
}

export default function ActivityPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [filter, setFilter] = useState<'all' | 'habits' | 'rewards' | 'milestones'>('all')

  // Get user ID on mount
  useEffect(() => {
    const getUID = async () => {
      try {
        const auth = (globalThis as any).firebase?.auth
        const uid = auth?.currentUser?.uid || localStorage.getItem('firebaseUid')
        
        if (uid) {
          setUserId(uid)
        } else {
          router.push('/auth')
        }
      } catch (e) {
        console.error('Auth error:', e)
        router.push('/auth')
      }
    }
    
    getUID()
  }, [router])

  // Fetch activity data
  useEffect(() => {
    if (!userId) return

    const fetchActivityData = async () => {
      try {
        const response = await fetch(
          `/api/heartbeat/status?userId=${encodeURIComponent(userId)}`,
          { credentials: 'include' }
        )
        
        if (!response.ok) throw new Error('Failed to fetch data')
        
        const data = await response.json()

        // Generate mock activity timeline (TODO: fetch real from backend)
        const now = new Date()
        const mockActivities: ActivityEvent[] = [
          {
            id: '1',
            type: 'reward_earned',
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
            title: 'Daily Heartbeat Pulse 💓',
            description: 'Earned 12.45 DDHG from today\'s activity',
            value: 12.45,
            icon: '💰',
            color: 'green',
          },
          {
            id: '2',
            type: 'habit_complete',
            timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
            title: 'Meditation Complete 🧘',
            description: 'Completed 10-min meditation session',
            value: 2,
            icon: '🧘',
            color: 'indigo',
          },
          {
            id: '3',
            type: 'streak_milestone',
            timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
            title: '7-Day Streak! 🔥',
            description: 'Reached 7-day streak (multiplier: 1.6x)',
            value: 7,
            icon: '🔥',
            color: 'orange',
          },
          {
            id: '4',
            type: 'habit_complete',
            timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            title: 'Training Complete 💪',
            description: 'Completed 30-min workout',
            value: 3,
            icon: '💪',
            color: 'red',
          },
          {
            id: '5',
            type: 'golden_seed',
            timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            title: '30-Day Golden Seed 🌱',
            description: 'Earned golden seed for 30-day habit streak',
            value: 1,
            icon: '🌱',
            color: 'yellow',
          },
          {
            id: '6',
            type: 'rank_change',
            timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            title: 'Rank Up! 📈',
            description: 'Climbed from rank 127 to rank 89',
            value: 89,
            icon: '📈',
            color: 'blue',
          },
          {
            id: '7',
            type: 'reward_earned',
            timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            title: 'Weekly Earnings 💎',
            description: 'Weekly total: 87.32 DDHG earned',
            value: 87.32,
            icon: '💎',
            color: 'purple',
          },
        ]

        setActivities(mockActivities)
        setLoading(false)
      } catch (err) {
        console.error('Activity data error:', err)
        setLoading(false)
      }
    }

    fetchActivityData()
  }, [userId])

  if (!userId) {
    return <div className="p-8">Redirecting to auth...</div>
  }

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'all') return true
    if (filter === 'habits') return activity.type === 'habit_complete'
    if (filter === 'rewards') return activity.type === 'reward_earned'
    if (filter === 'milestones') return ['streak_milestone', 'golden_seed', 'rank_change'].includes(activity.type)
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-600">Loading activity...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Activity Timeline</h1>
            <p className="text-gray-600 text-sm mt-1">Your recent earnings and milestones</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(['all', 'habits', 'rewards', 'milestones'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {f === 'all' && '📋 All'}
              {f === 'habits' && '✅ Habits'}
              {f === 'rewards' && '💰 Rewards'}
              {f === 'milestones' && '🎉 Milestones'}
            </button>
          ))}
        </div>

        {/* Activity Timeline */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No activities found</p>
              <p className="text-sm">Start completing habits to see your activity here!</p>
            </div>
          ) : (
            filteredActivities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors p-4 flex items-start gap-4"
              >
                {/* Icon */}
                <div className="text-3xl mt-1 flex-shrink-0">{activity.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{activity.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                    </div>
                    {activity.value !== undefined && (
                      <div className={`flex-shrink-0 text-right`}>
                        <div className={`text-2xl font-bold text-${activity.color}-600`}>
                          {activity.type === 'reward_earned' ? '+' : ''}
                          {activity.type === 'habit_complete' || activity.type === 'golden_seed'
                            ? activity.value
                            : activity.value.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {activity.type === 'reward_earned' && 'DDHG'}
                          {activity.type === 'habit_complete' && 'RP'}
                          {activity.type === 'streak_milestone' && 'days'}
                          {activity.type === 'golden_seed' && 'seed'}
                          {activity.type === 'rank_change' && 'rank'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-gray-500 mt-3">
                    {new Date(activity.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredActivities.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
              Load More Activity
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
