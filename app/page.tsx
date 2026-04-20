'use client'

import Link from 'next/link'
import { useSimpleAuth } from './lib/simple-auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useSimpleAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect logged-in users to meditation
      router.push('/meditation')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌱</span>
            <span className="text-xl font-bold text-green-900">DDHG</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🌱</div>
          <h1 className="text-5xl font-bold text-green-900 mb-6 leading-tight">
            A calm daily ritual for habits, gratitude, and planning
          </h1>
          <p className="text-xl text-green-700 mb-8 leading-relaxed">
            Don&apos;t Die Habit Garden helps you build consistency through meditation, journaling, gratitude, and planning. A simple plant-themed rhythm for your wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 text-lg transition-colors">
              Get Started →
            </Link>
            <Link href="#features" className="px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-gray-50 border border-green-200 text-lg transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">What DDHG helps you do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🧘</div>
              <h3 className="text-lg font-bold text-green-900 mb-2">Stay Grounded</h3>
              <p className="text-gray-600">Keep meditation and movement in one place so your baseline habits feel calm.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🙏</div>
              <h3 className="text-lg font-bold text-green-900 mb-2">Reflect Daily</h3>
              <p className="text-gray-600">Journaling and gratitude live alongside your actions, so reflection becomes part of the practice.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-green-900 mb-2">Plan with Clarity</h3>
              <p className="text-gray-600">Map your day and build momentum through daily repetition.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">Why it feels different</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-4xl mb-3">🌱</div>
              <h4 className="text-lg font-bold text-green-900 mb-2">Visual Progress</h4>
              <p className="text-gray-600">Your daily consistency builds into a growing garden instead of another plain checklist.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-4xl mb-3">🧘</div>
              <h4 className="text-lg font-bold text-green-900 mb-2">Low Pressure</h4>
              <p className="text-gray-600">Habits, gratitude, and planning live together so it feels like a ritual, not a dashboard.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-4xl mb-3">⏰</div>
              <h4 className="text-lg font-bold text-green-900 mb-2">Daily Rhythm</h4>
              <p className="text-gray-600">Check in each morning and build a habit that sticks because it feels good.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-green-900 mb-4">Ready to grow?</h3>
          <p className="text-green-700 mb-8 text-lg">Start your daily ritual right now. It only takes a minute.</p>
          <Link href="/login" className="inline-block px-10 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 text-lg transition-colors">
            Start Growing →
          </Link>
        </div>
      </section>

      <section className="bg-white px-4 py-12 border-t border-green-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-green-900 mb-3">Built by Sam across practical products and systems</h3>
          <p className="text-gray-600 leading-relaxed">
            If you run a service business and want practical AI help with follow-up, intake, websites, and automation,
            check out{' '}
            <a className="text-green-700 font-semibold hover:text-green-800" href="https://aibusinessboomer.io/">
              Business Boomer
            </a>{' '}
            or explore{' '}
            <a className="text-green-700 font-semibold hover:text-green-800" href="https://aibusinessboomer.io/industries">
              AI automation for service businesses
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="bg-white border-t border-green-100 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">© 2026 Don&apos;t Die Habit Garden</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
