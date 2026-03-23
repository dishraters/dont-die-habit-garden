'use client'

import { useState } from 'react'

const DDHG_API = process.env.NEXT_PUBLIC_DDHG_API || 'http://localhost:3000'
const USER_ID = typeof window !== 'undefined' ? localStorage.getItem('yoga_user_id') || 'user-' + Math.random().toString(36).substr(2, 9) : 'guest'

interface Pose {
  id: number
  name: string
  emoji: string
  description: string
  duration: string
}

const POSES: Pose[] = [
  { id: 1, name: 'Child\'s Pose', emoji: '🙏', description: 'Relaxing forward bend', duration: '1-2 min' },
  { id: 2, name: 'Downward Dog', emoji: '🐕', description: 'Full body stretch', duration: '1-2 min' },
  { id: 3, name: 'Warrior I', emoji: '⚔️', description: 'Strength & balance', duration: '1 min each side' },
  { id: 4, name: 'Tree Pose', emoji: '🌳', description: 'Balance & focus', duration: '1 min each side' },
  { id: 5, name: 'Corpse Pose', emoji: '☠️', description: 'Final relaxation', duration: '3-5 min' },
]

export default function YogaApp() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedPoses, setCompletedPoses] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const currentPose = POSES[currentIndex]
  const isCompleted = completedPoses.includes(currentIndex)

  const togglePose = () => {
    if (completedPoses.includes(currentIndex)) {
      setCompletedPoses(prev => prev.filter(i => i !== currentIndex))
    } else {
      setCompletedPoses(prev => [...prev, currentIndex])
    }
  }

  const nextPose = () => {
    if (currentIndex < POSES.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const prevPose = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const completeSequence = async () => {
    if (completedPoses.length === 0) {
      setFeedback({ type: 'error', message: 'Complete at least one pose first' })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${DDHG_API}/api/heartbeat/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitType: 'mindful_movements',
          userId: USER_ID,
          sourceApp: 'yoga-app',
          rp_earned: 2
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit yoga completion')
      }

      setFeedback({ type: 'success', message: `🧘 Yoga sequence complete! +2 RP earned` })
      setCompletedPoses([])
      setCurrentIndex(0)
      setTimeout(() => setFeedback(null), 3000)
    } catch (error) {
      console.error('Error:', error)
      setFeedback({ type: 'error', message: 'Failed to log sequence. Check console.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>🧘 Yoga Sequence</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Move mindfully through 5 poses
        </p>

        {/* Progress */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <p style={{ fontWeight: 'bold', color: '#333' }}>Pose {currentIndex + 1} of {POSES.length}</p>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>{completedPoses.length} completed</p>
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#667eea', height: '100%', width: `${((currentIndex + 1) / POSES.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Current Pose */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', padding: '2rem', color: 'white', marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{currentPose.emoji}</div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{currentPose.name}</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{currentPose.description}</p>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Duration: {currentPose.duration}</p>

          <button
            onClick={togglePose}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: 'none',
              background: isCompleted ? '#4CAF50' : 'rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {isCompleted ? '✅ Pose Complete' : '⏱ Hold Pose'}
          </button>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={prevPose}
            disabled={currentIndex === 0}
            style={{
              flex: 1,
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: '1px solid #ddd',
              background: currentIndex === 0 ? '#f0f0f0' : 'white',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === 0 ? 0.5 : 1
            }}
          >
            ← Previous
          </button>
          <button
            onClick={nextPose}
            disabled={currentIndex === POSES.length - 1}
            style={{
              flex: 1,
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: '1px solid #ddd',
              background: currentIndex === POSES.length - 1 ? '#f0f0f0' : 'white',
              cursor: currentIndex === POSES.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === POSES.length - 1 ? 0.5 : 1
            }}
          >
            Next →
          </button>
        </div>

        {/* Pose List */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#333' }}>Sequence</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {POSES.map((pose, idx) => (
              <button
                key={pose.id}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: idx === currentIndex ? '2px solid #667eea' : '1px solid #ddd',
                  background: completedPoses.includes(idx) ? '#4CAF50' : idx === currentIndex ? '#667eea' : 'white',
                  color: completedPoses.includes(idx) || idx === currentIndex ? 'white' : '#333',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}
              >
                {pose.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Complete Button */}
        <button
          onClick={completeSequence}
          disabled={isSubmitting || completedPoses.length === 0}
          style={{
            width: '100%',
            padding: '1.25rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '10px',
            border: 'none',
            background: completedPoses.length === 0 ? '#ccc' : '#22c55e',
            color: 'white',
            cursor: completedPoses.length === 0 ? 'not-allowed' : 'pointer',
            opacity: completedPoses.length === 0 ? 0.6 : 1,
            transition: 'all 0.3s'
          }}
        >
          {isSubmitting ? '⏳ Submitting...' : '✅ Complete Sequence'}
        </button>

        {/* Feedback */}
        {feedback && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '10px',
            background: feedback.type === 'success' ? '#d4edda' : '#f8d7da',
            color: feedback.type === 'success' ? '#155724' : '#721c24',
            textAlign: 'center',
            fontSize: '0.95rem'
          }}>
            {feedback.message}
          </div>
        )}
      </div>
    </main>
  )
}
