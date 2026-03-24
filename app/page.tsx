'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import PlantCard from './components/PlantCard'
import HabitEntryModal from './components/HabitEntryModal'
import DishRatedModal from './components/DishRatedModal'
import GratitudeModal from './components/GratitudeModal'
import PlanningModal from './components/PlanningModal'
import MeditationModal from './components/MeditationModal'
import SleepModal from './components/SleepModal'
import StretchingModal from './components/StretchingModal'
import DailyPieChart from './components/DailyPieChart'
import EarningsDashboard from './components/EarningsDashboard'
import StreakMultiplier from './components/StreakMultiplier'
import GoldenHatTracker from './components/GoldenHatTracker'
import { saveHabitCompletion, loadUserHabits } from '@/lib/habitFunctions'
import { useSimpleAuth } from './lib/simple-auth-context'

const HABITS = [
  { id: 'meditation', name: 'Meditation', emoji: '🧘', source: 'ddhg' as const },
  { id: 'training', name: 'Training', emoji: '💪', source: 'trainlog' as const },
  { id: 'breakfast', name: 'Breakfast', emoji: '🍳', source: 'dishrated' as const },
  { id: 'lunch', name: 'Lunch', emoji: '🥗', source: 'dishrated' as const },
  { id: 'dinner', name: 'Dinner', emoji: '🍽️', source: 'dishrated' as const },
  { id: 'planning', name: 'Planning', emoji: '📋', source: 'planning' as const },
  { id: 'gratitude', name: 'Gratitude', emoji: '🙏', source: 'gratitude' as const },
  { id: 'sleep', name: 'Sleep', emoji: '🌙', source: 'ddhg' as const },
  { id: 'stretching', name: 'Stretching', emoji: '🤸', source: 'ddhg' as const },
]

const MEAL_MODALS = ['breakfast', 'lunch', 'dinner']

const emptyStreaks = () =>
  HABITS.reduce<{ [k: string]: number }>((acc, habit) => {
    acc[habit.id] = 0
    return acc
  }, {})

function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 text-6xl">🌱</div>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-green-900 md:text-5xl">
            A calm daily ritual for meditation, journaling, gratitude, and planning
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-green-700">
            Don&apos;t Die Habit Garden turns your wellness routine into a gentle plant-themed rhythm. Keep your core DDHG habits, earn consistency, and come back each day to grow something steady.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/auth" className="rounded-2xl bg-green-500 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-600">
              Start growing →
            </Link>
            <Link href="/login" className="rounded-2xl border border-green-200 bg-white px-8 py-4 text-lg font-bold text-green-700 transition hover:bg-green-50">
              Log in
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-green-900">What DDHG helps you do</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-5xl">🧘</div>
              <h3 className="mb-2 text-lg font-bold text-green-900">Stay grounded</h3>
              <p className="text-gray-600">Keep meditation, sleep, and stretching in one place so your baseline habits feel calm instead of chaotic.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-5xl">🙏</div>
              <h3 className="mb-2 text-lg font-bold text-green-900">Reflect daily</h3>
              <p className="text-gray-600">Journaling and gratitude live alongside your actions, so reflection becomes part of the practice.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-5xl">📋</div>
              <h3 className="mb-2 text-lg font-bold text-green-900">Plan with clarity</h3>
              <p className="text-gray-600">Map your day, check off meals and training, and build momentum through repetition.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-green-50 to-emerald-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-green-900">Why it feels different</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl">🌿</div>
              <h3 className="mb-2 text-lg font-bold text-green-900">Plant-first design</h3>
              <p className="text-gray-600">The UI borrows Habit Garden&apos;s clean, leafy feel so the experience is lighter and more inviting.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl">🪙</div>
              <h3 className="mb-2 text-lg font-bold text-green-900">DDHG-specific rewards</h3>
              <p className="text-gray-600">You keep the DDHG streaks, DDC tracking, and connected features without the old broken auth flow.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl">✨</div>
              <h3 className="mb-2 text-lg font-bold text-green-900">Simple sign-in</h3>
              <p className="text-gray-600">Firebase email/password and Google auth replace the custom JWT path with a proven client flow.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-green-900">Build your ritual, one day at a time</h2>
          <p className="mb-8 text-green-700">Open the app, log your habits, and let consistency compound.</p>
          <Link href="/auth" className="inline-block rounded-2xl bg-green-500 px-10 py-4 text-lg font-bold text-white transition hover:bg-green-600">
            Open DDHG →
          </Link>
        </div>
      </section>
    </main>
  )
}

export default function Home() {
  const { user, loading, signOut } = useSimpleAuth()
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [todayDDC, setTodayDDC] = useState(0)
  const [totalDDC, setTotalDDC] = useState(0)
  const [plantStreak, setPlantStreak] = useState(0)
  const [streaks, setStreaks] = useState<{ [key: string]: number }>(emptyStreaks())
  const [appLoading, setAppLoading] = useState(true)
  const [openModal, setOpenModal] = useState<string | null>(null)

  const userId = user?.id || 'guest'
  const firstName = useMemo(() => user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Gardener', [user])

  useEffect(() => {
    const init = async () => {
      if (!user) {
        setCompletedToday([])
        setTodayDDC(0)
        setTotalDDC(0)
        setPlantStreak(0)
        setStreaks(emptyStreaks())
        setAppLoading(false)
        return
      }

      setAppLoading(true)
      try {
        const habits = await loadUserHabits(user.id)
        setCompletedToday(habits.completedToday)
        setStreaks({ ...emptyStreaks(), ...habits.streaks })
        setTotalDDC(habits.totalDDC)
        setTodayDDC(habits.todayDDC)
        setPlantStreak(habits.plantStreak)
      } catch (error) {
        console.error('Error loading habits:', error)
      } finally {
        setAppLoading(false)
      }
    }

    if (!loading) {
      init()
    }
  }, [loading, user])

  const refreshData = async (uid: string) => {
    try {
      const habits = await loadUserHabits(uid)
      setCompletedToday(habits.completedToday)
      setStreaks({ ...emptyStreaks(), ...habits.streaks })
      setTotalDDC(habits.totalDDC)
      setTodayDDC(habits.todayDDC)
      setPlantStreak(habits.plantStreak)
    } catch (error) {
      console.error('Error loading habits:', error)
    }
  }

  const doMarkComplete = async (habitId: string, notes?: string, time?: string) => {
    if (completedToday.includes(habitId)) return
    const habit = HABITS.find((item) => item.id === habitId)
    const source = habit?.source || 'ddhg'

    setCompletedToday((prev) => [...prev, habitId])

    try {
      await saveHabitCompletion(userId, habitId, notes, time, source)
      await refreshData(userId)
    } catch (error) {
      console.error('Error saving habit:', error)
      setCompletedToday((prev) => prev.filter((id) => id !== habitId))
    }
  }

  const handleHabitAction = (habitId: string) => {
    if (completedToday.includes(habitId)) return

    const redirects: { [key: string]: string } = {
      meditation: 'https://habit-garden-2o0tuc1i0-dishraters-projects-15a47ec4.vercel.app/meditation',
      gratitude: 'https://habit-garden-2o0tuc1i0-dishraters-projects-15a47ec4.vercel.app/gratitude',
      planning: 'https://habit-garden-2o0tuc1i0-dishraters-projects-15a47ec4.vercel.app/planning',
      sleep: 'https://habit-garden-2o0tuc1i0-dishraters-projects-15a47ec4.vercel.app/sleep',
      breakfast: 'https://dishrated-mm4zyjktn-dishraters-projects-15a47ec4.vercel.app/breakfast',
      lunch: 'https://dishrated-mm4zyjktn-dishraters-projects-15a47ec4.vercel.app/lunch',
      dinner: 'https://dishrated-mm4zyjktn-dishraters-projects-15a47ec4.vercel.app/dinner',
      training: 'https://trainlog-next-gib6lzcol-dishraters-projects-15a47ec4.vercel.app/exercise',
    }

    const url = redirects[habitId]
    if (url) {
      window.open(url, '_blank')
      return
    }

    if (habitId === 'stretching') {
      setOpenModal(habitId)
    }
  }

  const closeModal = () => setOpenModal(null)

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  if (loading || (user && appLoading)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-emerald-100 px-4">
        <div className="rounded-3xl border border-green-100 bg-white px-8 py-6 text-lg font-medium text-green-800 shadow-lg shadow-green-100/60">
          🌱 Loading your garden...
        </div>
      </main>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-white px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-[2rem] border border-green-100 bg-white/90 p-8 shadow-xl shadow-green-100/70">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                <span>🌿</span>
                <span>Your daily ritual</span>
              </div>
              <h1 className="text-3xl font-bold text-green-900 md:text-4xl">Welcome back, {firstName}</h1>
              <p className="mt-3 max-w-2xl text-green-700">
                Keep your DDHG habits alive today: meditation, meals, planning, gratitude, sleep, stretching, and training.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleLogout} className="rounded-2xl border border-green-200 px-4 py-3 font-medium text-green-700 transition hover:bg-green-50">
                Sign out
              </button>
              <Link href="/how-it-works" className="rounded-2xl bg-green-500 px-4 py-3 font-medium text-white transition hover:bg-green-600">
                Learn the system
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-green-50 p-5">
              <div className="text-3xl font-bold text-green-900">🔥 {completedToday.length}/9</div>
              <div className="mt-1 text-sm text-green-700">Today&apos;s habits completed</div>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-5">
              <div className="text-3xl font-bold text-green-900">💰 +{todayDDC}</div>
              <div className="mt-1 text-sm text-green-700">DDC earned today</div>
            </div>
            <div className="rounded-3xl bg-lime-50 p-5">
              <div className="text-3xl font-bold text-green-900">🪙 {totalDDC}</div>
              <div className="mt-1 text-sm text-green-700">Total DDC</div>
            </div>
            <div className="rounded-3xl bg-teal-50 p-5">
              <div className="text-3xl font-bold text-green-900">🌱 Day {plantStreak}</div>
              <div className="mt-1 text-sm text-green-700">Plant streak</div>
            </div>
          </div>
        </section>

        <div className="mb-8 rounded-[2rem] border border-green-100 bg-white p-6 shadow-lg shadow-green-100/50">
          <h2 className="mb-2 text-2xl font-bold text-green-900">Your garden dashboard</h2>
          <p className="text-green-700">DDHG features are unchanged — they&apos;re just wrapped in a calmer Habit Garden-style shell.</p>
        </div>

        <div className="mb-8">
          <EarningsDashboard userId={userId} />
        </div>

        <div className="mb-8 grid gap-6 xl:grid-cols-2">
          <DailyPieChart userId={userId} />
          <StreakMultiplier userId={userId} />
        </div>

        <div className="mb-8">
          <GoldenHatTracker userId={userId} />
        </div>

        <section className="mb-8 rounded-[2rem] border border-green-100 bg-white p-6 shadow-lg shadow-green-100/50">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-900">Today&apos;s habits</h2>
              <p className="text-green-700">Open a linked tool or complete the habit directly to keep your streak growing.</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {HABITS.map((habit) => (
              <PlantCard
                key={habit.id}
                habitId={habit.id}
                habitName={habit.name}
                totalDDC={totalDDC}
                streak={streaks[habit.id] || 0}
                isCompleted={completedToday.includes(habit.id)}
                onMarkComplete={() => handleHabitAction(habit.id)}
                onOpenFeature={() => handleHabitAction(habit.id)}
              />
            ))}
          </div>
        </section>

        <section className="pb-10 text-center">
          <div className="inline-flex flex-col gap-3 sm:flex-row">
            <Link href="/activity" className="rounded-2xl border border-green-200 bg-white px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50">
              📊 View activity
            </Link>
            <Link href="/store" className="rounded-2xl bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600">
              🌱 Visit store
            </Link>
          </div>
        </section>
      </div>

      {openModal === 'meditation' && (
        <MeditationModal onComplete={(notes) => { doMarkComplete('meditation', notes); closeModal() }} onClose={closeModal} />
      )}

      {openModal === 'sleep' && (
        <SleepModal onComplete={(notes) => { doMarkComplete('sleep', notes); closeModal() }} onClose={closeModal} />
      )}

      {openModal === 'stretching' && (
        <StretchingModal onComplete={(notes) => { doMarkComplete('stretching', notes); closeModal() }} onClose={closeModal} />
      )}

      {openModal === 'gratitude' && (
        <GratitudeModal isOpen={true} onClose={closeModal} onSubmit={(text) => { doMarkComplete('gratitude', text); closeModal() }} isLoading={false} />
      )}

      {openModal === 'planning' && (
        <PlanningModal isOpen={true} onClose={closeModal} onSubmit={(text) => { doMarkComplete('planning', text); closeModal() }} isLoading={false} />
      )}

      {openModal && MEAL_MODALS.includes(openModal) && (
        <DishRatedModal
          mealType={openModal as 'breakfast' | 'lunch' | 'dinner'}
          isOpen={true}
          onClose={closeModal}
          onSubmit={(dishName, healthScore, costScore) => {
            doMarkComplete(openModal, `${dishName} (Health: ${healthScore}/10, Cost: ${costScore}/10)`)
            closeModal()
          }}
          isLoading={false}
        />
      )}

      {openModal === 'training' && (
        <HabitEntryModal
          habitId="training"
          habitName="Training"
          color="#22c55e"
          onSave={(data) => { doMarkComplete('training', data.description, data.time); closeModal() }}
          onClose={closeModal}
        />
      )}
    </main>
  )
}
