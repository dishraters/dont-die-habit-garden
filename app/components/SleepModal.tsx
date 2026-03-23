'use client'

import { useState } from 'react'

interface SleepModalProps {
  onComplete: (notes: string) => void
  onClose: () => void
}

export default function SleepModal({ onComplete, onClose }: SleepModalProps) {
  const [hours, setHours] = useState(8)
  const [bedtime, setBedtime] = useState('')
  const [wakeTime, setWakeTime] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parts = [`${hours} hours sleep`]
    if (bedtime) parts.push(`Bed: ${bedtime}`)
    if (wakeTime) parts.push(`Wake: ${wakeTime}`)
    onComplete(parts.join(' — '))
  }

  const meetsMinimum = hours >= 7

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>🌙 Log Sleep</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
              Hours slept <span style={{ color: '#888', fontWeight: 'normal' }}>— 7+ hours earns tokens</span>
            </label>
            <input
              type="number"
              min={1}
              max={14}
              step={0.5}
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
              style={{ width: '100%', padding: '0.75rem', border: `1px solid ${meetsMinimum ? '#ddd' : '#fca5a5'}`, borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>Bedtime (optional)</label>
              <input
                type="time"
                value={bedtime}
                onChange={e => setBedtime(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>Wake time (optional)</label>
              <input
                type="time"
                value={wakeTime}
                onChange={e => setWakeTime(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {!meetsMinimum && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Log 7+ hours to earn +2 DDC.
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.875rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={hours < 1} style={{ flex: 2, padding: '0.875rem', background: meetsMinimum ? '#ec4899' : '#f9a8d4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: hours >= 1 ? 'pointer' : 'not-allowed' }}>
              ✅ Mark Complete{meetsMinimum ? ' (+2 DDC)' : ' (no DDC — 7+ hrs needed)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
