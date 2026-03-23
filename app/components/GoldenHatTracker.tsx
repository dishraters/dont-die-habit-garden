'use client'

import { useEffect, useState } from 'react'
import { GoldenSeedIcon } from './HeartbeatAnimation'

interface GoldenHatTrackerProps {
  userId: string
}

interface SeedHabit {
  habitId: string
  habitName: string
  seedCount: number
  earnedDate: string
}

export default function GoldenHatTracker({ userId }: GoldenHatTrackerProps) {
  const [totalSeeds, setTotalSeeds] = useState(0)
  const [seedHabits, setSeedHabits] = useState<SeedHabit[]>([])
  const [thisMonthSeeds, setThisMonthSeeds] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSeedData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/heartbeat/status?userId=${userId}`)

        if (response.ok) {
          const data = await response.json()
          const userInfo = data.user_info

          if (userInfo) {
            setTotalSeeds(userInfo.golden_seeds || 0)

            // Simulate seed habits from recent completions
            // In production, you'd fetch detailed seed data from Firestore
            const currentMonth = new Date().getMonth()
            const currentYear = new Date().getFullYear()

            let monthSeeds = 0
            const habits: SeedHabit[] = []

            userInfo.recent_completions?.forEach((completion: any) => {
              const completionDate = new Date(completion.timestamp)
              if (
                completionDate.getMonth() === currentMonth &&
                completionDate.getFullYear() === currentYear &&
                completion.streak >= 30
              ) {
                const seedCount = Math.floor(completion.streak / 30)
                monthSeeds += seedCount
                habits.push({
                  habitId: completion.habitId,
                  habitName: completion.habitName,
                  seedCount,
                  earnedDate: completion.timestamp,
                })
              }
            })

            setSeedHabits(habits)
            setThisMonthSeeds(monthSeeds)
          }
        }
      } catch (error) {
        console.error('Error fetching seed data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeedData()
    const interval = setInterval(fetchSeedData, 120000) // Refresh every 2 minutes
    return () => clearInterval(interval)
  }, [userId])

  const getHabitEmoji = (habitName: string): string => {
    const emojiMap: { [key: string]: string } = {
      meditation: '🧘',
      training: '💪',
      breakfast: '🍳',
      lunch: '🥗',
      dinner: '🍽️',
      planning: '📋',
      gratitude: '🙏',
      sleep: '🌙',
      stretching: '🤸',
    }
    return emojiMap[habitName.toLowerCase()] || '⭐'
  }

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg p-6 shadow-md">
        <div className="text-center text-gray-500">Loading seeds...</div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-amber-200">
      <GoldenSeedIcon />

      {/* Header with Badge */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Golden Hat Tracker</h3>
          <p className="text-xs text-gray-600">Unlock exclusive rewards with seeds</p>
        </div>
        <div className="relative">
          <style>{`
            @keyframes seed-badge-pulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
            }
            .seed-badge {
              animation: seed-badge-pulse 2s ease-in-out infinite;
            }
          `}</style>
          <div className="seed-badge text-5xl">🎩</div>
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
            {totalSeeds}
          </div>
        </div>
      </div>

      {/* Seeds Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-lg p-4 text-center border border-amber-100">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total Seeds</p>
          <p className="text-3xl font-bold text-yellow-600">
            {totalSeeds}
            <span className="text-xl ml-1">🌱</span>
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-amber-100">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">This Month</p>
          <p className="text-3xl font-bold text-amber-600">
            {thisMonthSeeds}
            <span className="text-xl ml-1">📈</span>
          </p>
        </div>
      </div>

      {/* Habits with Seeds */}
      {seedHabits.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">30+ Day Streak Habits</h4>
          <div className="space-y-2">
            {seedHabits.map((habit) => (
              <div
                key={habit.habitId}
                className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-yellow-300 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getHabitEmoji(habit.habitName)}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{habit.habitName}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(habit.earnedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">{habit.seedCount}</p>
                  <p className="text-xs text-gray-600">seeds</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {seedHabits.length === 0 && totalSeeds === 0 && (
        <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed border-amber-200 mb-6">
          <p className="text-3xl mb-2">🌱</p>
          <p className="text-sm text-gray-600">
            Maintain a 30+ day streak to earn your first seed!
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-white rounded-lg border border-amber-100">
        <p className="text-xs text-gray-700 mb-2">
          <span className="font-semibold">💎 What are seeds?</span>
        </p>
        <p className="text-xs text-gray-600">
          Seeds are earned when you reach 30-day streaks. They're redeemable for exclusive features,
          premium content, and special rewards coming soon.
        </p>
      </div>

      {/* Hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-amber-700 italic">
          Keep your streaks alive to unlock more golden seeds! 🌟
        </p>
      </div>
    </div>
  )
}
