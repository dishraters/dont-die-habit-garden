'use client'

import { useState, useEffect } from 'react'

const DDHG_API = process.env.NEXT_PUBLIC_DDHG_API || 'http://localhost:3000'
const USER_ID = typeof window !== 'undefined' ? localStorage.getItem('meditation_user_id') || 'user-' + Math.random().toString(36).substr(2, 9) : 'guest'

interface TimerState {
  isRunning: boolean
  timeLeft: number
  duration: number
}

export default function MeditationTimer() {
  const [timer, setTimer] = useState<TimerState>({ isRunning: false, timeLeft: 0, duration: 0 })
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('meditation_user_id', USER_ID)
    }
  }, [])

  useEffect(() => {
    if (!timer.isRunning || timer.timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimer(prev => ({
        ...prev,
        timeLeft: Math.max(0, prev.timeLeft - 1)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [timer.isRunning, timer.timeLeft])

  const startTimer = (duration: number) => {
    setSelectedDuration(duration)
    setTimer({ isRunning: true, timeLeft: duration * 60, duration })
  }

  const stopTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }))
  }

  const resetTimer = () => {
    setTimer({ isRunning: false, timeLeft: 0, duration: 0 })
    setSelectedDuration(null)
  }

  const completeSession = async () => {
    if (timer.duration === 0) {
      setFeedback({ type: 'error', message: 'Please start a meditation session first' })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${DDHG_API}/api/heartbeat/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitType: 'meditation',
          userId: USER_ID,
          sourceApp: 'meditation-timer',
          rp_earned: 2
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit meditation completion')
      }

      setFeedback({ type: 'success', message: `🧘 Meditation complete! +2 RP earned` })
      resetTimer()
      setTimeout(() => setFeedback(null), 3000)
    } catch (error) {
      console.error('Error:', error)
      setFeedback({ type: 'error', message: 'Failed to log meditation. Check console.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = timer.duration > 0 ? ((timer.duration * 60 - timer.timeLeft) / (timer.duration * 60)) * 100 : 0

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>🧘 Meditation Timer</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Find your inner peace
        </p>

        {/* Timer Display */}
        {timer.duration > 0 ? (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#667eea',
              fontFamily: 'monospace',
              marginBottom: '1rem'
            }}>
              {formatTime(timer.timeLeft)}
            </div>
            <div style={{ background: '#f0f0f0', borderRadius: '10px', height: '8px', marginBottom: '1rem', overflow: 'hidden' }}>
              <div style={{ background: '#667eea', height: '100%', width: `${progressPercent}%`, transition: 'width 0.3s' }} />
            </div>
            <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
              {timer.isRunning ? 'Meditating...' : 'Paused'}
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '2rem', background: '#f8f8f8', borderRadius: '10px' }}>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>Select a duration to begin</p>
          </div>
        )}

        {/* Duration Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[5, 10, 15, 20].map(min => (
            <button
              key={min}
              onClick={() => startTimer(min)}
              disabled={timer.isRunning}
              style={{
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '10px',
                border: 'none',
                cursor: timer.isRunning ? 'not-allowed' : 'pointer',
                background: selectedDuration === min ? '#667eea' : '#e8e8e8',
                color: selectedDuration === min ? 'white' : '#333',
                opacity: timer.isRunning ? 0.6 : 1,
                transition: 'all 0.3s'
              }}
            >
              {min} min
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          {timer.duration > 0 && (
            <>
              <button
                onClick={() => timer.isRunning ? stopTimer() : startTimer(timer.duration)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  border: 'none',
                  background: timer.isRunning ? '#ff6b6b' : '#4CAF50',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {timer.isRunning ? '⏸ Pause' : '▶ Resume'}
              </button>
              <button
                onClick={resetTimer}
                style={{
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            </>
          )}
        </div>

        {/* Complete Button */}
        <button
          onClick={completeSession}
          disabled={isSubmitting || timer.duration === 0}
          style={{
            width: '100%',
            padding: '1.25rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '10px',
            border: 'none',
            background: timer.duration === 0 ? '#ccc' : '#22c55e',
            color: 'white',
            cursor: timer.duration === 0 ? 'not-allowed' : 'pointer',
            opacity: timer.duration === 0 ? 0.6 : 1,
            transition: 'all 0.3s'
          }}
        >
          {isSubmitting ? '⏳ Submitting...' : '✅ Complete Session'}
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
