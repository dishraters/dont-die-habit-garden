'use client'

import { useState, useEffect } from 'react'
import PlantCard from './components/PlantCard'
import AudioPlayer from './components/AudioPlayer'
import MovementsCarousel from './components/MovementsCarousel'
import HabitEntryModal from './components/HabitEntryModal'
import GratitudeModal from './components/GratitudeModal'
import PlanningModal from './components/PlanningModal'
import { saveHabitCompletion, loadUserHabits, addDDC } from '@/lib/habitFunctions'

const HABITS = [
  { id: 'gratitude', name: 'Gratitude', plantName: 'Moonbloom', color: '#fbbf24', requiresModal: true },
  { id: 'meditation', name: 'Meditation', plantName: 'Lotus Seed', color: '#60a5fa', requiresModal: true },
  { id: 'training', name: 'Training', plantName: 'Iron Fern', color: '#ef4444', requiresModal: true },
  { id: 'breakfast', name: 'Breakfast', plantName: 'Sunpetal', color: '#f97316', requiresModal: true },
  { id: 'lunch', name: 'Lunch', plantName: 'Meadowleaf', color: '#22c55e', requiresModal: true },
  { id: 'dinner', name: 'Dinner', plantName: 'Twilight Bloom', color: '#8b5cf6', requiresModal: true },
  { id: 'sleeptime_stories', name: 'Sleeptime Stories', plantName: 'Moon Vine', color: '#ec4899', requiresModal: true },
  { id: 'planning', name: 'Planning', plantName: 'Compass Fern', color: '#06b6d4', requiresModal: true },
  { id: 'mindful_movements', name: 'Mindful Movements', plantName: 'Breeze Orchid', color: '#10b981', requiresModal: true },
]

const MEAL_HABITS = ['training', 'breakfast', 'lunch', 'dinner']

interface User {
  email: string
  name: string
  id: string
}

export default function Home() {
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [ddc, setDdc] = useState(0)
  const [totalDdc, setTotalDdc] = useState(0)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [streaks, setStreaks] = useState<{ [key: string]: number }>({
    gratitude: 0, meditation: 0, training: 0, breakfast: 0, lunch: 0,
    dinner: 0, sleeptime_stories: 0, planning: 0, mindful_movements: 0,
  })
  const [openModal, setOpenModal] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ddhg_user')
      if (stored) {
        const u = JSON.parse(stored) as User
        setUser(u)
        const habits = loadUserHabits(u.id)
        setCompletedToday(habits.completedToday)
        setStreaks(prev => ({ ...prev, ...habits.streaks }))
        setTotalDdc(habits.totalDDC)
      }
    } catch {
      // ignore localStorage errors
    }
    setLoading(false)
  }, [])

  const doMarkComplete = (habitId: string, notes?: string, time?: string) => {
    if (completedToday.includes(habitId)) return
    const userId = user?.id || 'guest'
    saveHabitCompletion(userId, habitId, notes, time)
    const newCompleted = [...completedToday, habitId]
    setCompletedToday(newCompleted)
    const earned = newCompleted.length === 9 ? 100 : 10
    setDdc(prev => prev + earned)
    const newTotal = addDDC(userId, earned)
    setTotalDdc(newTotal)
  }

  const handleHabitAction = (habitId: string) => {
    if (completedToday.includes(habitId)) return
    const habit = HABITS.find(h => h.id === habitId)
    if (habit?.requiresModal) {
      setOpenModal(habitId)
    } else {
      doMarkComplete(habitId)
    }
  }

  const handleModalComplete = (habitId: string) => {
    doMarkComplete(habitId)
    setOpenModal(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('ddhg_user')
    setUser(null)
    setCompletedToday([])
    setDdc(0)
  }

  const entryHabit = openModal && MEAL_HABITS.includes(openModal)
    ? HABITS.find(h => h.id === openModal)
    : null

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>🌱 Loading...</div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ color: 'white', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>🌱 Don't Die Habit Garden</h1>
              {user ? (
                <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>Welcome back, {user.name}!</p>
              ) : (
                <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
                  Guest mode —{' '}
                  <a href="/login" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: '600' }}>Log in</a>
                  {' '}to save progress
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {user ? (
                <button
                  onClick={handleLogout}
                  style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Log out
                </button>
              ) : (
                <>
                  <a href="/login" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem' }}>Log in</a>
                  <a href="/auth" style={{ padding: '0.5rem 1rem', background: '#fbbf24', color: '#333', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>Sign up</a>
                </>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.75rem 1.25rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>🔥 {completedToday.length}/9</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Today's Habits</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.75rem 1.25rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>💰 +{ddc}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>DDC Earned Today</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.75rem 1.25rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>🪙 {totalDdc}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Total DDC</div>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {HABITS.map((habit) => (
            <PlantCard
              key={habit.id}
              habitId={habit.id}
              habitName={habit.name}
              streak={streaks[habit.id as keyof typeof streaks] || 0}
              isCompleted={completedToday.includes(habit.id)}
              onMarkComplete={() => handleHabitAction(habit.id)}
              onOpenFeature={habit.requiresModal ? () => setOpenModal(habit.id) : undefined}
            />
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ marginTop: '3rem', textAlign: 'center', paddingBottom: '2rem' }}>
          <button style={{ background: '#22c55e', color: 'white', padding: '0.875rem 1.5rem', borderRadius: '10px', fontWeight: 'bold', marginRight: '1rem', fontSize: '1rem' }}>
            📊 View Analytics
          </button>
          <button style={{ background: '#ec4899', color: 'white', padding: '0.875rem 1.5rem', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem' }}>
            💰 Book Coaching
          </button>
        </div>
      </div>

      {/* Gratitude Modal */}
      {openModal === 'gratitude' && (
        <GratitudeModal
          isOpen={true}
          onClose={() => setOpenModal(null)}
          onSubmit={(text) => {
            doMarkComplete('gratitude', text)
            setOpenModal(null)
          }}
          isLoading={false}
        />
      )}

      {/* Audio Player - Meditation */}
      {openModal === 'meditation' && (
        <AudioPlayer
          mode="meditation"
          onComplete={() => handleModalComplete('meditation')}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Audio Player - Sleeptime Stories */}
      {openModal === 'sleeptime_stories' && (
        <AudioPlayer
          mode="sleep"
          onComplete={() => handleModalComplete('sleeptime_stories')}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Movements Carousel */}
      {openModal === 'mindful_movements' && (
        <MovementsCarousel
          onComplete={() => handleModalComplete('mindful_movements')}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Planning Modal */}
      {openModal === 'planning' && (
        <PlanningModal
          isOpen={true}
          onClose={() => setOpenModal(null)}
          onSubmit={(text) => {
            doMarkComplete('planning', text)
            setOpenModal(null)
          }}
          isLoading={false}
        />
      )}

      {/* Habit Entry Modal (Training, Breakfast, Lunch, Dinner) */}
      {entryHabit && (
        <HabitEntryModal
          habitId={entryHabit.id}
          habitName={entryHabit.name}
          color={entryHabit.color}
          onSave={(data) => {
            doMarkComplete(entryHabit.id, data.description, data.time)
            setOpenModal(null)
          }}
          onClose={() => setOpenModal(null)}
        />
      )}
    </main>
  )
}
