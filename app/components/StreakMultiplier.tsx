'use client'

import { useEffect, useState } from 'react'
import { StreakFireIcon, AnimatedProgressBar } from './HeartbeatAnimation'

interface StreakMultiplierProps {
  userId: string
}

interface HabitStreak {
  habitId: string
  habitName: string
  streak: number
}

export default function StreakMultiplier({ userId }: StreakMultiplierProps) {
  const [multiplier, setMultiplier] = useState(1.0)
  const [currentDay, setCurrentDay] = useState(0)
  const [habitStreaks, setHabitStreaks] = useState<HabitStreak[]>([])
  const [maxDay, setMaxDay] = useState(30)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        // For now, we'll simulate loading from Firestore
        // In production, you'd fetch from /api/user/streaks or similar
        const response = await fetch(`/api/heartbeat/status?userId=${userId}`)
        
        if (response.ok) {
          const data = await response.json()
          
          // Calculate multiplier based on longest active streak
          // This would come from user data in production
          const userInfo = data.user_info
          if (userInfo && userInfo.recent_completions) {
            // Calculate active streak from recent completions
            const today = new Date()
            let activeStreak = 0
            
            userInfo.recent_completions.forEach((completion: any) => {
              const completionDate = new Date(completion.timestamp)
              const daysDiff = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24))
              
              if (daysDiff < 30) {
                activeStreak = Math.max(activeStreak, 30 - daysDiff)
              }
            })

            // Calculate multiplier: 1.0 + (day * 0.467) capped at 15.0
            const calculatedMultiplier = Math.min(1.0 + (activeStreak * 0.467), 15.0)
            setMultiplier(calculatedMultiplier)
            setCurrentDay(activeStreak)
            setLocked(activeStreak >= 30)
          }
        }
      } catch (error) {
        console.error('Error fetching streaks:', error)
      }
    }

    fetchStreaks()
    const interval = setInterval(fetchStreaks, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [userId])

  const getMultiplierColor = () => {
    if (multiplier >= 10) return 'text-purple-600'
    if (multiplier >= 5) return 'text-red-600'
    return 'text-orange-500'
  }

  const getProgressColor = () => {
    if (multiplier >= 10) return 'bg-purple-600'
    if (multiplier >= 5) return 'bg-red-600'
    return 'bg-orange-500'
  }

  const daysUntilMax = Math.max(0, 30 - currentDay)

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Streak Multiplier</h3>

        {/* Fire Icon with Multiplier */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <StreakFireIcon multiplier={multiplier} />
            <div>
              <p className="text-sm text-gray-600">Current Multiplier</p>
              <p className={`text-4xl font-bold ${getMultiplierColor()}`}>
                {multiplier.toFixed(1)}×
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {locked ? '15.0× Locked' : `Day ${currentDay} of 30`}
            </span>
            <span className="text-xs text-gray-500">
              {locked ? '✅ Achieved!' : `${daysUntilMax} days remaining`}
            </span>
          </div>
          <AnimatedProgressBar percentage={(currentDay / 30) * 100} color={getProgressColor()} />
        </div>

        {/* Milestone Info */}
        <div className={`p-3 rounded-lg ${locked ? 'bg-purple-50' : 'bg-amber-50'}`}>
          {locked ? (
            <p className="text-sm text-purple-700 font-semibold">
              🎉 30-day streak reached! Maximum multiplier locked in.
            </p>
          ) : (
            <p className="text-sm text-amber-700">
              <span className="font-semibold">Next milestone:</span> {daysUntilMax} days until 15.0× locked
            </p>
          )}
        </div>
      </div>

      {/* Active Habits with Streaks */}
      {habitStreaks.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Habit Streaks</h4>
          <div className="space-y-2">
            {habitStreaks.map((habit) => (
              <div key={habit.habitId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{habit.habitName}</span>
                <span className="text-sm font-bold text-pink-600">{habit.streak} 🔥</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-700">
          <span className="font-semibold">💡 How it works:</span> Your multiplier increases with consecutive daily activity.
          Reach day 30 to lock in the maximum 15.0× multiplier permanently.
        </p>
      </div>
    </div>
  )
}
