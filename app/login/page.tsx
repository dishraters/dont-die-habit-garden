'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSimpleAuth } from '../lib/simple-auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, loading: authLoading } = useSimpleAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }
        const result = await signUp(email, password, name)
        if (result.error) {
          setError(result.error.message)
        } else {
          router.push('/')
        }
      } else {
        const result = await signIn(email, password)
        if (result.error) {
          setError(result.error.message)
        } else {
          router.push('/')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
            🌱 DDHG
          </h1>
          <p className="text-gray-600 mt-2">Don&apos;t Die Habit Garden</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign up' : 'Sign in with Email'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsSignUp(false)
                  setError('')
                }}
                className="text-green-600 font-semibold hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => {
                  setIsSignUp(true)
                  setError('')
                }}
                className="text-green-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}