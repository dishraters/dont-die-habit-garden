'use client'

import { useState } from 'react'

interface Movement {
  id: number
  name: string
  emoji: string
  description: string
  duration: string
}

const MOVEMENTS: Movement[] = [
  { id: 1, name: 'Deep Breathing', emoji: '🫁', description: 'Inhale for 4 counts, hold 4, exhale 4', duration: '1 min' },
  { id: 2, name: 'Neck Rolls', emoji: '🙆', description: 'Slow circles to release neck tension', duration: '1 min' },
  { id: 3, name: 'Shoulder Stretch', emoji: '🤸', description: 'Cross-body shoulder stretch, hold 30s each', duration: '1 min' },
  { id: 4, name: 'Standing Cat-Cow', emoji: '🐄', description: 'Stand and arch/round your spine', duration: '1 min' },
  { id: 5, name: 'Hip Circles', emoji: '💃', description: 'Hands on hips, make large circles', duration: '1 min' },
  { id: 6, name: 'Forward Fold', emoji: '🧎', description: 'Hang forward, let gravity work', duration: '1 min' },
  { id: 7, name: 'Side Stretch', emoji: '🤾', description: 'Reach one arm over head, lean sideways', duration: '1 min' },
  { id: 8, name: 'Wrist Circles', emoji: '✋', description: 'Rotate wrists in both directions', duration: '30 sec' },
  { id: 9, name: 'Calf Raises', emoji: '🦵', description: 'Rise up on toes slowly, lower down', duration: '1 min' },
  { id: 10, name: 'Gratitude Pose', emoji: '🙏', description: 'Hands to heart, 3 deep breaths of gratitude', duration: '30 sec' },
]

interface MovementsCarouselProps {
  onComplete: () => void
  onClose: () => void
}

export default function MovementsCarousel({ onComplete, onClose }: MovementsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [seen, setSeen] = useState<Set<number>>(new Set([0]))
  const [completed, setCompleted] = useState(false)

  const goNext = () => {
    const next = (currentIndex + 1) % MOVEMENTS.length
    setCurrentIndex(next)
    const newSeen = new Set(seen)
    newSeen.add(next)
    setSeen(newSeen)

    if (newSeen.size === MOVEMENTS.length && !completed) {
      setCompleted(true)
      onComplete()
    }
  }

  const goPrev = () => {
    const prev = (currentIndex - 1 + MOVEMENTS.length) % MOVEMENTS.length
    setCurrentIndex(prev)
  }

  const goTo = (index: number) => {
    setCurrentIndex(index)
    const newSeen = new Set(seen)
    newSeen.add(index)
    setSeen(newSeen)
  }

  const movement = MOVEMENTS[currentIndex]
  const progress = (seen.size / MOVEMENTS.length) * 100

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>🌿 Mindful Movements</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666', padding: '0' }}>✕</button>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
            <span>{seen.size}/{MOVEMENTS.length} movements seen</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#10b981', borderRadius: '3px', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Movement Card */}
        <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', borderRadius: '12px', padding: '2rem', textAlign: 'center', marginBottom: '1.25rem', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{movement.emoji}</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#065f46', marginBottom: '0.5rem' }}>{movement.name}</h3>
          <p style={{ color: '#047857', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{movement.description}</p>
          <span style={{ background: '#10b981', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>{movement.duration}</span>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button
            onClick={goPrev}
            style={{ padding: '0.75rem 1.25rem', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#374151' }}
          >
            ← Prev
          </button>

          <span style={{ color: '#6b7280', fontWeight: '600' }}>
            {currentIndex + 1} / {MOVEMENTS.length}
          </span>

          <button
            onClick={goNext}
            style={{ padding: '0.75rem 1.25rem', background: '#10b981', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: 'white' }}
          >
            Next →
          </button>
        </div>

        {/* Dot Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {MOVEMENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                background: i === currentIndex ? '#10b981' : seen.has(i) ? '#6ee7b7' : '#e5e7eb',
                padding: '0',
              }}
            />
          ))}
        </div>

        {completed && (
          <div style={{ marginTop: '1rem', background: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontWeight: '600' }}>
            ✅ All movements complete! Great job!
          </div>
        )}

        {!completed && seen.size < MOVEMENTS.length && (
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            View all {MOVEMENTS.length} movements to complete
          </p>
        )}
      </div>
    </div>
  )
}
