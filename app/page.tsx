'use client'

import { useState, useEffect, useCallback } from 'react'
import PlantCard from './components/PlantCard'
import HabitEntryModal from './components/HabitEntryModal'
import DishRatedModal from './components/DishRatedModal'
import GratitudeModal from './components/GratitudeModal'
import PlanningModal from './components/PlanningModal'
import MeditationModal from './components/MeditationModal'
import SleepModal from './components/SleepModal'
import StretchingModal from './components/StretchingModal'
import { saveHabitCompletion, loadUserHabits } from '@/lib/habitFunctions'

const HABITS = [
  { id: 'meditation', name: 'Meditation',  emoji: '🧘', source: 'ddhg' as const,        modal: 'meditation' },
  { id: 'training',   name: 'Training',    emoji: '💪', source: 'trainlog' as const,     modal: 'training' },
  { id: 'breakfast',  name: 'Breakfast',   emoji: '🍳', source: 'dishrated' as const,    modal: 'breakfast' },
  { id: 'lunch',      name: 'Lunch',       emoji: '🥗', source: 'dishrated' as const,    modal: 'lunch' },
  { id: 'dinner',     name: 'Dinner',      emoji: '🍽️', source: 'dishrated' as const,    modal: 'dinner' },
  { id: 'planning',   name: 'Planning',    emoji: '📋', source: 'planning' as const,     modal: 'planning' },
  { id: 'gratitude',  name: 'Gratitude',   emoji: '🙏', source: 'gratitude' as const,    modal: 'gratitude' },
  { id: 'sleep',      name: 'Sleep',       emoji: '🌙', source: 'ddhg' as const,         modal: 'sleep' },
  { id: 'stretching', name: 'Stretching',  emoji: '🤸', source: 'ddhg' as const,         modal: 'stretching' },
]

const MEAL_MODALS = ['breakfast', 'lunch', 'dinner']

interface User {
  email: string
  name: string
  id: string
}

const emptyStreaks = () =>
  HABITS.reduce<{ [k: string]: number }>((acc, h) => { acc[h.id] = 0; return acc }, {})

export default function Home() {
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [todayDDC, setTodayDDC] = useState(0)
  const [totalDDC, setTotalDDC] = useState(0)
  const [plantStreak, setPlantStreak] = useState(0)
  const [streaks, setStreaks] = useState<{ [key: string]: number }>(emptyStreaks())
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [openModal, setOpenModal] = useState<string | null>(null)

  const userId = user?.id || 'guest'

  // Load user data from Firestore
  const refreshData = useCallback(async (uid: string) => {
    try {
      const habits = await loadUserHabits(uid)
      setCompletedToday(habits.completedToday)
      setStreaks(prev => ({ ...emptyStreaks(), ...habits.streaks }))
      setTotalDDC(habits.totalDDC)
      setTodayDDC(habits.todayDDC)
      setPlantStreak(habits.plantStreak)
    } catch (e) {
      console.error('Error loading habits:', e)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const stored = localStorage.getItem('ddhg_user')
        if (stored) {
          const u = JSON.parse(stored) as User
          setUser(u)
          await refreshData(u.id)
        }
      } catch {
        // ignore localStorage errors
      }
      setLoading(false)
    }
    init()
  }, [refreshData])

  const doMarkComplete = useCallback(async (habitId: string, notes?: string, time?: string) => {
    if (completedToday.includes(habitId)) return
    const habit = HABITS.find(h => h.id === habitId)
    const source = habit?.source || 'ddhg'

    // Optimistic UI update
    setCompletedToday(prev => [...prev, habitId])

    try {
      await saveHabitCompletion(userId, habitId, notes, time, source)
      // Refresh to get actual DDC values from Firestore
      await refreshData(userId)
    } catch (e) {
      console.error('Error saving habit:', e)
      // Revert optimistic update on error
      setCompletedToday(prev => prev.filter(id => id !== habitId))
    }
  }, [completedToday, userId, refreshData])

  const handleHabitAction = (habitId: string) => {
    if (completedToday.includes(habitId)) return

    // External app redirects - open in new tab for logging
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
    
    // Only stretching uses modal
    if (habitId === 'stretching') {
      setOpenModal(habitId)
    }
  }

  const closeModal = () => setOpenModal(null)

  const handleLogout = () => {
    localStorage.removeItem('ddhg_user')
    setUser(null)
    setCompletedToday([])
    setTodayDDC(0)
    setTotalDDC(0)
    setStreaks(emptyStreaks())
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>🌱 Loading your garden...</div>
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
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>🌱 Don&apos;t Die Habit Garden</h1>
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
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Today&apos;s Habits</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.75rem 1.25rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>💰 +{todayDDC}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>DDC Earned Today</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.75rem 1.25rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>🪙 {totalDDC}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Total DDC</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.75rem 1.25rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>🌱 Day {plantStreak}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Plant Streak</div>
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
              totalDDC={totalDDC}
              streak={streaks[habit.id] || 0}
              isCompleted={completedToday.includes(habit.id)}
              onMarkComplete={() => handleHabitAction(habit.id)}
              onOpenFeature={() => handleHabitAction(habit.id)}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: '3rem', textAlign: 'center', paddingBottom: '2rem' }}>
          <button style={{ background: '#22c55e', color: 'white', padding: '0.875rem 1.5rem', borderRadius: '10px', fontWeight: 'bold', marginRight: '1rem', fontSize: '1rem' }}>
            📊 View Analytics
          </button>
          <button style={{ background: '#ec4899', color: 'white', padding: '0.875rem 1.5rem', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem' }}>
            💰 Book Coaching
          </button>
        </div>
      </div>

      {/* === Modals === */}

      {openModal === 'meditation' && (
        <MeditationModal
          onComplete={(notes) => { doMarkComplete('meditation', notes); closeModal() }}
          onClose={closeModal}
        />
      )}

      {openModal === 'sleep' && (
        <SleepModal
          onComplete={(notes) => { doMarkComplete('sleep', notes); closeModal() }}
          onClose={closeModal}
        />
      )}

      {openModal === 'stretching' && (
        <StretchingModal
          onComplete={(notes) => { doMarkComplete('stretching', notes); closeModal() }}
          onClose={closeModal}
        />
      )}

      {openModal === 'gratitude' && (
        <GratitudeModal
          isOpen={true}
          onClose={closeModal}
          onSubmit={(text) => { doMarkComplete('gratitude', text); closeModal() }}
          isLoading={false}
        />
      )}

      {openModal === 'planning' && (
        <PlanningModal
          isOpen={true}
          onClose={closeModal}
          onSubmit={(text) => { doMarkComplete('planning', text); closeModal() }}
          isLoading={false}
        />
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
          color="#ef4444"
          onSave={(data) => { doMarkComplete('training', data.description, data.time); closeModal() }}
          onClose={closeModal}
        />
      )}
    </main>
  )
}
