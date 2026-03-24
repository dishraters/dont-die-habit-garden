'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSimpleAuth } from '../lib/simple-auth-context'

export default function MeditationPage() {
  const { user, loading } = useSimpleAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌱</div>
          <p className="text-gray-600">Loading your garden...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌱</span>
            <span className="text-xl font-bold text-green-900">DDHG</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.name || user.email}</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-900 mb-4">Your Garden</h1>
          <p className="text-gray-600">Start your daily ritual</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Meditation */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="text-6xl mb-4">🧘</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Meditation</h2>
            <p className="text-gray-600 mb-6">Start your day with calm</p>
            <button className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
              Begin
            </button>
          </div>

          {/* Gratitude */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Gratitude</h2>
            <p className="text-gray-600 mb-6">Reflect with gratitude</p>
            <button className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
              Journal
            </button>
          </div>

          {/* Planning */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Planning</h2>
            <p className="text-gray-600 mb-6">Plan your day</p>
            <button className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
              Plan
            </button>
          </div>

          {/* Training */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="text-6xl mb-4">💪</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Training</h2>
            <p className="text-gray-600 mb-6">Log your workout</p>
            <button className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
              Log
            </button>
          </div>

          {/* Meals */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="text-6xl mb-4">🍳</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Meals</h2>
            <p className="text-gray-600 mb-6">Track what you eat</p>
            <button className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
              Log Meal
            </button>
          </div>

          {/* Sleep */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="text-6xl mb-4">🌙</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Sleep</h2>
            <p className="text-gray-600 mb-6">Track your rest</p>
            <button className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
              Log Sleep
            </button>
          </div>
        </div>

        <div className="mt-12 p-8 bg-white rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Daily Streaks</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-gray-600 text-sm">Meditation Streak</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-gray-600 text-sm">Training Streak</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-gray-600 text-sm">Consistency Streak</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-green-100 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">© 2026 Don&apos;t Die Habit Garden</p>
        </div>
      </footer>
    </main>
  )
}
