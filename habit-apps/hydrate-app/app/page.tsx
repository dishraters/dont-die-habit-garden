'use client'

import { useState, useEffect } from 'react'

const DDHG_API = process.env.NEXT_PUBLIC_DDHG_API || 'https://dont-die-habit-garden.vercel.app'
const USER_ID = typeof window !== 'undefined' ? localStorage.getItem('hydrate_user_id') || 'user-' + Math.random().toString(36).substr(2, 9) : 'guest'

interface BalanceData {
  totalTokens: number
  loading: boolean
}

export default function HydrateApp() {
  const [cupsLogged, setCupsLogged] = useState(0)
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

  const logWater = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${DDHG_API}/api/heartbeat/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          habitType: 'hydrate',
          userId: USER_ID,
          sourceApp: 'hydrate-app',
          rp_earned: 1
        })
      })

      if (response.ok) {
        const result = await response.json()
        const tokens = result.estimated_tokens || 0.04
        setCupsLogged(prev => prev + 1)
        setFeedback({ type: 'success', message: `💧 Water logged! +1 RP earned (est. ${tokens.toFixed(2)} DDHG)` })
        setTimeout(() => setFeedback(null), 3000)
      }
    } catch (error) {
      console.error('Error:', error)
      setFeedback({ type: 'error', message: 'Failed to log water' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', color: 'white', margin: 0 }}>💧 Hydrate</h1>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '20px', color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {balance.loading ? '...' : `💰 ${balance.totalTokens.toFixed(2)} DDHG`}
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Stay hydrated, stay healthy
          </p>

          {/* Water Cups Display */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {Array(Math.min(cupsLogged, 8)).fill(0).map((_, i) => '💧').join('')}
              {cupsLogged > 8 && <span style={{ fontSize: '1.5rem' }}>+{cupsLogged - 8}</span>}
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00b4db' }}>
              {cupsLogged} cups today
            </p>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>
              Daily goal: 8 cups
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{ background: '#f0f0f0', borderRadius: '10px', height: '12px', marginBottom: '2rem', overflow: 'hidden' }}>
            <div
              style={{
                background: 'linear-gradient(90deg, #00b4db 0%, #0083b0 100%)',
                height: '100%',
                width: `${Math.min((cupsLogged / 8) * 100, 100)}%`,
                transition: 'width 0.3s'
              }}
            />
          </div>

          {/* Log Water Button */}
          <button
            onClick={logWater}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '1.5rem',
              background: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            {isSubmitting ? '⏳ Logging...' : '💧 Log a Cup of Water'}
          </button>

          {/* Hydration Tips */}
          <div style={{ background: '#f0f7ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#0083b0', margin: 0 }}>
              💡 Drinking water earns you 1 RP per cup, up to 8 cups per day
            </p>
          </div>

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
