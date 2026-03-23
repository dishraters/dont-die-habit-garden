'use client'

import { useState, useEffect } from 'react'

const DDHG_API = process.env.NEXT_PUBLIC_DDHG_API || 'https://dont-die-habit-garden.vercel.app'
const USER_ID = typeof window !== 'undefined' ? localStorage.getItem('yoga_user_id') || 'user-' + Math.random().toString(36).substr(2, 9) : 'guest'

interface BalanceData {
  totalTokens: number
  loading: boolean
}

interface Session {
  duration: number
  type: string
}

export default function YogaApp() {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<string>('hatha')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [balance, setBalance] = useState<BalanceData>({ totalTokens: 0, loading: true })

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `${DDHG_API}/api/heartbeat/status?userId=${encodeURIComponent(USER_ID)}`,
          { credentials: 'include' }
        )
        if (response.ok) {
          const data = await response.json()
          setBalance({
            totalTokens: data.user_info?.totalTokens ?? 0,
            loading: false,
          })
        }
      } catch (err) {
        console.error('Balance fetch error:', err)
        setBalance({ totalTokens: 0, loading: false })
      }
    }
    fetchBalance()
  }, [])

  const completeSession = async () => {
    if (!selectedDuration) {
      setFeedback({ type: 'error', message: 'Select a duration first' })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${DDHG_API}/api/heartbeat/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          habitType: 'yoga',
          userId: USER_ID,
          sourceApp: 'yoga-app',
          rp_earned: 3
        })
      })

      if (response.ok) {
        const result = await response.json()
        const tokens = result.estimated_tokens || 0.11
        setFeedback({ type: 'success', message: `🤸 Yoga complete! +3 RP earned (est. ${tokens.toFixed(2)} DDHG)` })
        setSelectedDuration(null)
        setTimeout(() => setFeedback(null), 4000)
      }
    } catch (error) {
      console.error('Error:', error)
      setFeedback({ type: 'error', message: 'Failed to log yoga session' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', color: 'white', margin: 0 }}>🤸 Yoga</h1>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '20px', color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {balance.loading ? '...' : `💰 ${balance.totalTokens.toFixed(2)} DDHG`}
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Stretch, balance, and breathe
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', color: '#333' }}>
              Select Yoga Style
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {['Hatha', 'Vinyasa', 'Yin', 'Power'].map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedType(style.toLowerCase())}
                  style={{
                    padding: '0.75rem',
                    background: selectedType === style.toLowerCase() ? '#f5576c' : '#f8f8f8',
                    color: selectedType === style.toLowerCase() ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', color: '#333' }}>
              Session Duration
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {[15, 20, 30, 45].map(min => (
                <button
                  key={min}
                  onClick={() => setSelectedDuration(min)}
                  style={{
                    padding: '1rem',
                    background: selectedDuration === min ? '#f5576c' : '#f8f8f8',
                    color: selectedDuration === min ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  {min} min
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={completeSession}
            disabled={!selectedDuration || isSubmitting}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: selectedDuration ? '#22c55e' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: selectedDuration ? 'pointer' : 'not-allowed',
              fontSize: '1.1rem',
              marginBottom: '1rem'
            }}
          >
            {isSubmitting ? '⏳ Submitting...' : '✅ Complete Session'}
          </button>

          {feedback && (
            <div style={{
              padding: '1rem',
              borderRadius: '10px',
              background: feedback.type === 'success' ? '#d4edda' : '#f8d7da',
              color: feedback.type === 'success' ? '#155724' : '#721c24',
              textAlign: 'center'
            }}>
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
