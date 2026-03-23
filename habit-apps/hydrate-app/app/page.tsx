'use client'

import { useState, useEffect } from 'react'

const DDHG_API = process.env.NEXT_PUBLIC_DDHG_API || 'http://localhost:3000'
const USER_ID = typeof window !== 'undefined' ? localStorage.getItem('hydrate_user_id') || 'user-' + Math.random().toString(36).substr(2, 9) : 'guest'
const DAILY_GOAL = 8

interface HydrationState {
  glassesCount: number
  lastReset: string
}

export default function HydrateApp() {
  const [state, setState] = useState<HydrationState>({ glassesCount: 0, lastReset: new Date().toDateString() })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Load from localStorage
  useEffect(() => {
    const today = new Date().toDateString()
    const stored = typeof window !== 'undefined' ? localStorage.getItem('hydrate_state') : null

    if (stored) {
      const parsed = JSON.parse(stored)
      // Reset if day changed
      if (parsed.lastReset !== today) {
        setState({ glassesCount: 0, lastReset: today })
      } else {
        setState(parsed)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hydrate_state', JSON.stringify(state))
    }
  }, [state])

  const addGlass = () => {
    setState(prev => ({
      ...prev,
      glassesCount: Math.min(prev.glassesCount + 1, DAILY_GOAL)
    }))
  }

  const removeGlass = () => {
    setState(prev => ({
      ...prev,
      glassesCount: Math.max(prev.glassesCount - 1, 0)
    }))
  }

  const completeGoal = async () => {
    if (state.glassesCount < DAILY_GOAL) {
      setFeedback({ type: 'error', message: `Drink ${DAILY_GOAL - state.glassesCount} more glasses to reach goal` })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${DDHG_API}/api/heartbeat/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitType: 'hydration',
          userId: USER_ID,
          sourceApp: 'hydrate-app',
          rp_earned: Math.round(state.glassesCount * 0.5) // Varies based on glasses
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit hydration completion')
      }

      const rp = Math.round(state.glassesCount * 0.5)
      setFeedback({ type: 'success', message: `💧 Goal reached! +${rp} RP earned` })
      setState({ glassesCount: 0, lastReset: new Date().toDateString() })
      setTimeout(() => setFeedback(null), 3000)
    } catch (error) {
      console.error('Error:', error)
      setFeedback({ type: 'error', message: 'Failed to log hydration. Check console.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercent = (state.glassesCount / DAILY_GOAL) * 100
  const glassesRemaining = DAILY_GOAL - state.glassesCount

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>💧 Hydration Tracker</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Daily goal: {DAILY_GOAL} glasses of water
        </p>

        {/* Glass Visual */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥤</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' }}>
            {state.glassesCount}/{DAILY_GOAL}
          </div>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            {glassesRemaining === 0 ? '🎉 Goal reached!' : `${glassesRemaining} glasses to go`}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ background: '#f0f0f0', borderRadius: '10px', height: '12px', overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div style={{ background: '#667eea', height: '100%', width: `${progressPercent}%`, transition: 'width 0.3s' }} />
          </div>
          <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>{Math.round(progressPercent)}% complete</p>
        </div>

        {/* Water Glasses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
          {[...Array(DAILY_GOAL)].map((_, i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: i < state.glassesCount ? '#667eea' : '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: i < state.glassesCount ? 'none' : '1px dashed #ddd'
              }}
              onClick={() => {
                if (i < state.glassesCount) {
                  setState(prev => ({ ...prev, glassesCount: i }))
                } else {
                  setState(prev => ({ ...prev, glassesCount: i + 1 }))
                }
              }}
            >
              {i < state.glassesCount ? '💧' : '○'}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={removeGlass}
            disabled={state.glassesCount === 0}
            style={{
              flex: 1,
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: '1px solid #ddd',
              background: state.glassesCount === 0 ? '#f0f0f0' : 'white',
              cursor: state.glassesCount === 0 ? 'not-allowed' : 'pointer',
              opacity: state.glassesCount === 0 ? 0.5 : 1
            }}
          >
            − Remove
          </button>
          <button
            onClick={addGlass}
            disabled={state.glassesCount === DAILY_GOAL}
            style={{
              flex: 1,
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: '1px solid #ddd',
              background: state.glassesCount === DAILY_GOAL ? '#f0f0f0' : '#667eea',
              color: state.glassesCount === DAILY_GOAL ? '#333' : 'white',
              cursor: state.glassesCount === DAILY_GOAL ? 'not-allowed' : 'pointer',
              opacity: state.glassesCount === DAILY_GOAL ? 0.5 : 1
            }}
          >
            + Add Glass
          </button>
        </div>

        {/* Complete Button */}
        <button
          onClick={completeGoal}
          disabled={isSubmitting || state.glassesCount < DAILY_GOAL}
          style={{
            width: '100%',
            padding: '1.25rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '10px',
            border: 'none',
            background: state.glassesCount < DAILY_GOAL ? '#ccc' : '#22c55e',
            color: 'white',
            cursor: state.glassesCount < DAILY_GOAL ? 'not-allowed' : 'pointer',
            opacity: state.glassesCount < DAILY_GOAL ? 0.6 : 1,
            transition: 'all 0.3s'
          }}
        >
          {isSubmitting ? '⏳ Submitting...' : '✅ Goal Reached!'}
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

        {/* Info Box */}
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f7ff', borderRadius: '10px', border: '1px solid #d0e8ff' }}>
          <p style={{ fontSize: '0.85rem', color: '#0066cc', margin: 0 }}>
            💡 <strong>Tip:</strong> Drinking enough water improves focus, energy, and overall health!
          </p>
        </div>
      </div>
    </main>
  )
}
