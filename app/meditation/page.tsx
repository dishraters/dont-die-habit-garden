'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSimpleAuth } from '../lib/simple-auth-context'

export default function MeditationPage() {
  const { user, loading, signOut } = useSimpleAuth()
  const router = useRouter()
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const toggleHabit = (habitId: string) => {
    const updated = new Set(completedToday)
    if (updated.has(habitId)) {
      updated.delete(habitId)
    } else {
      updated.add(habitId)
    }
    setCompletedToday(updated)
  }

  const habits = [
    { id: 'meditation', name: 'Meditation', emoji: '🧘', color: 'from-emerald-400 to-green-600' },
    { id: 'gratitude', name: 'Gratitude', emoji: '🙏', color: 'from-amber-300 to-orange-500' },
    { id: 'planning', name: 'Planning', emoji: '📋', color: 'from-blue-400 to-cyan-600' },
    { id: 'training', name: 'Training', emoji: '💪', color: 'from-red-400 to-pink-600' },
    { id: 'meals', name: 'Meals', emoji: '🍳', color: 'from-yellow-300 to-amber-500' },
    { id: 'sleep', name: 'Sleep', emoji: '🌙', color: 'from-indigo-400 to-purple-600' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🌱</div>
          <p className="text-gray-500 font-medium">Growing your garden...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const completionRate = Math.round((completedToday.size / habits.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-green-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🌱</span>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                DDHG
              </h1>
              <p className="text-xs text-gray-500">Don't Die Habit Garden</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome</p>
              <p className="text-lg font-semibold text-gray-900">{user.name || user.email.split('@')[0]}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Today's Focus */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Today's Ritual</h2>
                <p className="text-gray-500">Complete your daily practices for growth</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {completionRate}%
                </div>
                <p className="text-sm text-gray-500">Complete</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Habit Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {habits.map((habit) => {
            const isCompleted = completedToday.has(habit.id)
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 ${
                  isCompleted
                    ? `bg-gradient-to-br ${habit.color} shadow-lg`
                    : 'bg-white border-2 border-gray-100 hover:border-green-200 shadow-sm'
                }`}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 opacity-10 text-8xl">{habit.emoji}</div>

                {/* Content */}
                <div className="relative z-10">
                  <div className={`text-5xl mb-4 transition-transform duration-300 ${isCompleted ? 'scale-110' : ''}`}>
                    {habit.emoji}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isCompleted ? 'text-white' : 'text-gray-900'}`}>
                    {habit.name}
                  </h3>
                  <p className={`text-sm ${isCompleted ? 'text-white/80' : 'text-gray-500'}`}>
                    {isCompleted ? '✓ Completed' : 'Tap to complete'}
                  </p>
                </div>

                {/* Completion indicator */}
                {isCompleted && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Streaks Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Streaks</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <p className="text-sm text-gray-600 mb-2">Current Streak</p>
              <p className="text-4xl font-bold text-green-600">0</p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <p className="text-sm text-gray-600 mb-2">Total Completed</p>
              <p className="text-4xl font-bold text-blue-600">{completedToday.size}</p>
              <p className="text-xs text-gray-500 mt-1">habits today</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
              <p className="text-sm text-gray-600 mb-2">Consistency</p>
              <p className="text-4xl font-bold text-amber-600">{completionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">today's goals</p>
            </div>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Every small step grows your garden. Keep going. 🌿
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-green-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">© 2026 Don't Die Habit Garden</p>
        </div>
      </footer>
    </div>
  )
}
