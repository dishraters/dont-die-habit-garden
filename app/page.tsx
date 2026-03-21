'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import PlantCard from './components/PlantCard'

const HABITS = [
  { id: 'gratitude', name: 'Gratitude', plantName: 'Moonbloom', color: '#fbbf24' },
  { id: 'meditation', name: 'Meditation', plantName: 'Lotus Seed', color: '#60a5fa' },
  { id: 'training', name: 'Training', plantName: 'Iron Fern', color: '#ef4444' },
  { id: 'breakfast', name: 'Breakfast', plantName: 'Sunpetal', color: '#f97316' },
  { id: 'lunch', name: 'Lunch', plantName: 'Meadowleaf', color: '#22c55e' },
  { id: 'dinner', name: 'Dinner', plantName: 'Twilight Bloom', color: '#8b5cf6' },
  { id: 'sleeptime_stories', name: 'Sleeptime Stories', plantName: 'Moon Vine', color: '#ec4899' },
  { id: 'planning', name: 'Planning', plantName: 'Compass Fern', color: '#06b6d4' },
  { id: 'mindful_movements', name: 'Mindful Movements', plantName: 'Breeze Orchid', color: '#10b981' },
]



export default function Home() {
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [ddc, setDdc] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [streaks, setStreaks] = useState<{ [key: string]: number }>({
    gratitude: 12,
    meditation: 12,
    training: 8,
    breakfast: 12,
    lunch: 12,
    dinner: 12,
    sleeptime_stories: 5,
    planning: 12,
    mindful_movements: 2,
  })

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HABITS.map((habit) => (
            <PlantCard
              key={habit.id}
              habitId={habit.id}
              habitName={habit.name}
              streak={streaks[habit.id as keyof typeof streaks] || 0}
              isCompleted={completedToday.includes(habit.id)}
              onMarkComplete={() => markComplete(habit.id)}
            />
          ))}
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
