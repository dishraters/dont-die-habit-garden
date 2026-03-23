'use client'

import { useState } from 'react'

interface MeditationModalProps {
  onComplete: (notes: string) => void
  onClose: () => void
}

export default function MeditationModal({ onComplete, onClose }: MeditationModalProps) {
  const [minutes, setMinutes] = useState(10)
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const summary = `${minutes} min meditation${notes ? ` — ${notes}` : ''}`
    onComplete(summary)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>🧘 Log Meditation</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
              Duration (minutes) <span style={{ color: '#888', fontWeight: 'normal' }}>— minimum 5 min</span>
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={minutes}
              onChange={e => setMinutes(Number(e.target.value))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="How did it feel? Any insights?"
              rows={2}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          {minutes < 5 && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Minimum 5 minutes required to earn tokens.
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.875rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={minutes < 1} style={{ flex: 2, padding: '0.875rem', background: minutes >= 5 ? '#60a5fa' : '#93c5fd', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: minutes >= 1 ? 'pointer' : 'not-allowed' }}>
              ✅ Mark Complete (+2 DDC)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
