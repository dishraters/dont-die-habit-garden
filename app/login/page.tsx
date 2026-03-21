'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email and password required')
      return
    }
    setLoading(true)
    // Mock login - just store email in localStorage
    try {
      const user = { email, name: email.split('@')[0], id: 'user-' + Date.now() }
      localStorage.setItem('ddhg_user', JSON.stringify(user))
      router.push('/')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem' }}>🌱</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Welcome Back</h1>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>Log in to your Habit Garden</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#333' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#333' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.875rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Logging in...' : '🚀 Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.875rem' }}>
          No account yet?{' '}
          <a href="/auth" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>Sign up free</a>
        </div>
      </div>
    </main>
  )
}
