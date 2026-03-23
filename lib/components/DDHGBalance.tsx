'use client'

/**
 * DDHG Balance Component - Reusable across all apps
 * 
 * Usage:
 * <DDHGBalance userId="user123" showLink={true} />
 * 
 * Shows:
 * - Current balance
 * - Today's earnings
 * - Link to DDHG dashboard
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DDHGBalanceProps {
  userId?: string
  showLink?: boolean
  compact?: boolean
}

export function DDHGBalance({ userId, showLink = true, compact = false }: DDHGBalanceProps) {
  const [balance, setBalance] = useState<number>(0)
  const [todayEarnings, setTodayEarnings] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchBalance = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/heartbeat/status?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.user_info) {
            setBalance(data.user_info.totalTokens || 0)
            setTodayEarnings(data.user_info.todayEarnings?.tokens_awarded || 0)
          }
        } else {
          setError('Failed to load balance')
        }
      } catch (err) {
        console.error('Error fetching balance:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 60000) // Refresh every 60s
    return () => clearInterval(interval)
  }, [userId])

  if (!userId) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-pink-50 rounded-lg border border-pink-200">
        <span className="text-lg">🌱</span>
        <div className="text-sm">
          <p className="font-bold text-pink-900">{balance.toFixed(2)}</p>
          <p className="text-xs text-pink-700">tokens</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
      {error && (
        <p className="text-red-600 text-sm mb-2">{error}</p>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">🌱</span>
        <p className="text-xs text-pink-700 uppercase font-semibold">DDHG Tokens</p>
      </div>

      <p className="text-3xl font-bold text-pink-900 mb-1">
        {loading ? '...' : balance.toFixed(2)}
      </p>

      {todayEarnings > 0 && (
        <p className="text-sm text-pink-700 mb-3">
          Today: +{todayEarnings.toFixed(2)} tokens
        </p>
      )}

      {showLink && (
        <Link
          href="https://dont-die-habit-garden.vercel.app/portfolio"
          className="inline-block text-sm font-semibold text-pink-600 hover:text-pink-800 transition"
        >
          View Dashboard →
        </Link>
      )}
    </div>
  )
}

/**
 * Toast notification for habit completions
 */
export function ShowCompletionToast(habitName: string, tokensEarned: number) {
  const toast = document.createElement('div')
  toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50'
  toast.textContent = `✅ ${habitName} logged! +${tokensEarned} tokens`
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}
