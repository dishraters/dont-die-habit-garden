// Mock habit functions using localStorage for MVP
// Replace with real Firebase calls when ready

export interface HabitEntry {
  habitId: string
  completedAt: string
  notes?: string
  time?: string
}

export interface UserHabits {
  completedToday: string[]
  streaks: { [habitId: string]: number }
  totalDDC: number
}

const STORAGE_KEY = 'ddhg_habits'
const DDC_KEY = 'ddhg_ddc'

export function saveHabitCompletion(userId: string, habitId: string, notes?: string, time?: string): void {
  try {
    const today = new Date().toDateString()
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (!existing[today]) existing[today] = []
    if (!existing[today].includes(habitId)) {
      existing[today].push(habitId)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  } catch (e) {
    console.warn('localStorage not available', e)
  }
}

export function loadUserHabits(userId: string): UserHabits {
  try {
    const today = new Date().toDateString()
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const completedToday: string[] = existing[today] || []

    // Calculate simple streaks from history
    const allHabits = ['gratitude', 'meditation', 'training', 'breakfast', 'lunch', 'dinner', 'sleeptime_stories', 'planning', 'mindful_movements']
    const streaks: { [key: string]: number } = {}
    allHabits.forEach(id => {
      streaks[id] = calculateStreak(existing, id)
    })

    const totalDDC = getDDCBalance(userId)

    return { completedToday, streaks, totalDDC }
  } catch (e) {
    return {
      completedToday: [],
      streaks: { gratitude: 0, meditation: 0, training: 0, breakfast: 0, lunch: 0, dinner: 0, sleeptime_stories: 0, planning: 0, mindful_movements: 0 },
      totalDDC: 0,
    }
  }
}

function calculateStreak(history: { [date: string]: string[] }, habitId: string): number {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toDateString()
    if (history[dateStr]?.includes(habitId)) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function getDDCBalance(userId: string): number {
  try {
    return parseInt(localStorage.getItem(DDC_KEY) || '0', 10)
  } catch {
    return 0
  }
}

export function addDDC(userId: string, amount: number): number {
  try {
    const current = getDDCBalance(userId)
    const newBalance = current + amount
    localStorage.setItem(DDC_KEY, String(newBalance))
    return newBalance
  } catch {
    return 0
  }
}
