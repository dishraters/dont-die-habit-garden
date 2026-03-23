'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

function getFriendlyError(message?: string) {
  if (!message) return 'Something went wrong. Please try again.'
  if (message.includes('email-already-in-use')) return 'That email is already in use.'
  if (message.includes('weak-password')) return 'Password should be at least 6 characters.'
  if (message.includes('invalid-email')) return 'Please enter a valid email address.'
  return message
}

export default function SignupPage() {
  const router = useRouter()
  const { user, loading, signUp, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.replace('/')
    }
  }, [loading, router, user])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !name) {
      setError('All fields are required.')
      return
    }

    setSubmitting(true)
    const result = await signUp(email, password, name)
    setSubmitting(false)

    if (result.error) {
      setError(getFriendlyError(result.error.message))
      return
    }

    router.push('/')
  }

  const handleGoogle = async () => {
    setSubmitting(true)
    const result = await signInWithGoogle()
    setSubmitting(false)

    if (result.error) {
      setError(getFriendlyError(result.error.message))
      return
    }

    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-green-100 bg-white p-8 shadow-xl shadow-green-100/60">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🌱</div>
          <h1 className="text-3xl font-bold text-green-900">Create your garden</h1>
          <p className="mt-2 text-sm text-green-700">Start a calmer ritual for meditation, journaling, gratitude, and planning.</p>
        </div>

        {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <button
          onClick={handleGoogle}
          disabled={submitting}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-green-200 px-4 py-3 font-medium text-gray-700 transition hover:bg-green-50 disabled:opacity-60"
        >
          <span>✨</span>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-green-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-green-600">
            <span className="bg-white px-3">or use email</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-green-900">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sam"
              className="w-full rounded-2xl border border-green-200 px-4 py-3 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-green-900">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-green-200 px-4 py-3 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-green-900">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-2xl border border-green-200 px-4 py-3 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-green-500 px-4 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
          >
            {submitting ? 'Planting...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-green-700 hover:text-green-800">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
