'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const HABITS = [
  { id: 'gratitude', name: 'Gratitude', emoji: '🌟', color: '#fbbf24' },
  { id: 'meditation', name: 'Meditation', emoji: '🧘', color: '#60a5fa' },
  { id: 'training', name: 'Training', emoji: '💪', color: '#ef4444' },
  { id: 'breakfast', name: 'Breakfast', emoji: '🍳', color: '#f97316' },
  { id: 'lunch', name: 'Lunch', emoji: '🥗', color: '#22c55e' },
  { id: 'dinner', name: 'Dinner', emoji: '🍽️', color: '#8b5cf6' },
  { id: 'sleeptime_stories', name: 'Sleeptime Stories', emoji: '📖', color: '#ec4899' },
  { id: 'planning', name: 'Planning', emoji: '📋', color: '#06b6d4' },
  { id: 'mindful_movements', name: 'Mindful Movements', emoji: '🧘', color: '#10b981' },
]

export default function Home() {
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [ddc, setDdc] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // TODO: Add Firebase Auth
  useEffect(() => {
    // Temporary user ID for development
    const tempUserId = 'test-user-' + Date.now()
    setUserId(tempUserId)
    setLoading(false)
  }, [])

  const markComplete = async (habitId: string) => {
    if (!userId || completedToday.includes(habitId)) return

    const newCompleted = [...completedToday, habitId]
    setCompletedToday(newCompleted)

    // Calculate DDC: 10 per habit, 100 if all 9 complete
    const newDdc = newCompleted.length === 9 ? 100 : newCompleted.length * 10
    setDdc(newDdc)

    // TODO: Save to Firebase
    console.log(`Marked ${habitId} complete. DDC: ${newDdc}`)
  }

  if (loading) return <div>Loading...</div>

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">🌱 Don't Die Habit Garden</h1>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl">🔥 Today: {completedToday.length}/9 habits</p>
              <p className="text-lg">💰 DDC Earned: {ddc} | Total: 1,250 🪙</p>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HABITS.map((habit) => {
            const isComplete = completedToday.includes(habit.id)
            return (
              <div
                key={habit.id}
                className="habit-card"
                style={{
                  borderLeft: `4px solid ${habit.color}`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{habit.emoji}</span>
                    <h3 className="font-bold text-lg">{habit.name}</h3>
                  </div>
                </div>

                <div className="mb-4">
                  {isComplete ? (
                    <span className="habit-complete">✅ Completed</span>
                  ) : (
                    <button
                      onClick={() => markComplete(habit.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  🔥 Streak: {Math.floor(Math.random() * 30)} days
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 text-center text-white">
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold mr-4">
            📊 View Analytics
          </button>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-bold">
            💰 Book Coaching
          </button>
        </div>
      </div>
    </main>
  )
}
