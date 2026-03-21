'use client'

import { useState } from 'react'

interface HabitEntryModalProps {
  habitId: string
  habitName: string
  color: string
  onSave: (data: { time: string; description: string }) => void
  onClose: () => void
}

const HABIT_PROMPTS: { [key: string]: string } = {
  training: 'What did you train today? (e.g. 30 min weights, 5k run)',
  breakfast: 'What did you have for breakfast?',
  lunch: 'What did you have for lunch?',
  dinner: 'What did you have for dinner?',
}

const HABIT_EMOJIS: { [key: string]: string } = {
  training: '💪',
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
}

export default function HabitEntryModal({ habitId, habitName, color, onSave, onClose }: HabitEntryModalProps) {
  const [time, setTime] = useState(() => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  })
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ time, description })
  }

  const emoji = HABIT_EMOJIS[habitId] || '✅'
  const prompt = HABIT_PROMPTS[habitId] || `Describe your ${habitName} habit today`

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>
            {emoji} Log {habitName}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666', padding: '0' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>Notes</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={prompt}
              rows={3}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '0.875rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ flex: 2, padding: '0.875rem', background: color, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ✅ Mark Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
