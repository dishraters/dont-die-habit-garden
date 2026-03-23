'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface CompletionEvent {
  id: string
  userId: string
  habitId: string
  habitName: string
  source: string
  completedAt: string
  rp_earned: number
  streakDay: number
  sourceIcon?: string
  habitDisplayName?: string
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

const SOURCE_NAMES: { [key: string]: string } = {
  ddhg: 'DDHG',
  dishrated: 'Dishrated',
  trainlog: 'TrainLog',
  'habit-garden': 'Habit Garden',
  'meditation-timer': 'Meditation Timer',
  'stories-player': 'Stories Player',
  'yoga-app': 'Yoga App',
  'hydrate-app': 'Hydrate',
  'read-timer': 'Read Timer',
  planning: 'Planning',
  gratitude: 'Gratitude',
}

export default function ActivityPage() {
  const [completions, setCompletions] = useState<CompletionEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  const LIMIT = 50

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  // Fetch activity
  useEffect(() => {
    if (!currentUser?.id) return

    const fetchActivity = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/activity?userId=${currentUser.id}&limit=${LIMIT}&offset=${offset}`
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          const items = data.completions as CompletionEvent[]
          
          if (offset === 0) {
            setCompletions(items)
          } else {
            setCompletions(prev => [...prev, ...items])
          }
          
          setHasMore(data.hasMore)
        } else {
          throw new Error(data.error || 'Failed to fetch activity')
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('[activity]', message)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [currentUser?.id, offset])

  const filteredCompletions = selectedApp
    ? completions.filter(c => c.source === selectedApp)
    : completions

  const uniqueSources = Array.from(new Set(completions.map(c => c.source)))

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-gray-600">Please log in to view your activity.</p>
          <Link href="/login" className="mt-4 inline-block text-pink-600 hover:text-pink-700 font-semibold">
            Go to Login →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              ← Back
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">📝 Activity Feed</h1>
            <div className="w-12"></div>
          </div>

          <p className="text-gray-600 mb-6">
            See all your habit completions and earnings in one place
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
              Error: {error}
            </div>
          )}

          {/* App Filters */}
          {uniqueSources.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedApp(null)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  selectedApp === null
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                All Apps
              </button>
              {uniqueSources.map(source => (
                <button
                  key={source}
                  onClick={() => setSelectedApp(source)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
                    selectedApp === source
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <span>{SOURCE_ICONS[source] || '✓'}</span>
                  {SOURCE_NAMES[source] || source}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {loading && offset === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading activity...</p>
          </div>
        ) : filteredCompletions.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg">No activity yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Complete habits in any app to see your activity here!
            </p>
            <Link href="/" className="mt-4 inline-block text-pink-600 hover:text-pink-700 font-semibold">
              Go to Dashboard →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-600 to-transparent"></div>

              {/* Events */}
              {filteredCompletions.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-20 pb-6"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 w-14 h-14 bg-white rounded-full border-4 border-pink-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{SOURCE_ICONS[event.source] || '✓'}</span>
                  </div>

                  {/* Event card */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">
                          {SOURCE_NAMES[event.source] || event.source}
                        </p>
                        <h3 className="text-lg font-bold text-gray-900">{event.habitDisplayName || event.habitName}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{formatDate(event.completedAt)}</p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-t border-gray-200 border-b">
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold">RP Earned</p>
                        <p className="text-xl font-bold text-orange-600">{event.rp_earned || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold">Streak Day</p>
                        <p className="text-xl font-bold text-blue-600">{event.streakDay || 0}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-600 uppercase font-semibold">Habit Type</p>
                        <p className="text-lg font-bold text-gray-900">{event.habitId}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 text-xs text-gray-500">
                      ID: {event.id.substring(0, 8)}...
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setOffset(offset + LIMIT)}
                  disabled={loading}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
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
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition font-semibold text-gray-900 border border-gray-200"
            >
              🏆 Leaderboard
            </Link>
            <Link
              href="/activity"
              className="p-4 bg-pink-50 rounded-lg text-center hover:bg-pink-100 transition font-semibold text-pink-900 border border-pink-200"
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
