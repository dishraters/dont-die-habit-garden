/**
 * useUserBalance Hook
 * 
 * Fetches user balance from /api/heartbeat/status
 * Caches for 60s, refetches on tab focus
 * 
 * Usage:
 * const { balance, loading, error, refresh } = useUserBalance(userId)
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export interface UserBalanceData {
  userId: string
  totalRewardPoints: number
  todayRewardPoints: number
  totalTokens: number
  todayEarnings: {
    earned_rp: number
    multiplier: number
    rp_after_multiplier: number
    daily_pool_share: number
    tokens_awarded: number
  }
  golden_seeds: number
  expected_tokens_today: number
  lastHeartbeat: string
  recent_completions?: any[]
}

interface UseUserBalanceReturn {
  balance: UserBalanceData | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const CACHE_DURATION = 60000 // 60 seconds

export function useUserBalance(userId: string | undefined): UseUserBalanceReturn {
  const [balance, setBalance] = useState<UserBalanceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cache control
  const cacheRef = useRef<{
    data: UserBalanceData | null
    timestamp: number
  }>({
    data: null,
    timestamp: 0,
  })

  const fetchBalance = useCallback(async () => {
    if (!userId) {
      setError('No userId provided')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/heartbeat/status?userId=${userId}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.user_info) {
        const userData = data.user_info as UserBalanceData
        setBalance(userData)
        
        // Update cache
        cacheRef.current = {
          data: userData,
          timestamp: Date.now(),
        }
      } else {
        throw new Error('No user_info in response')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      console.error('[useUserBalance]', message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Initial load and cache check
  useEffect(() => {
    if (!userId) return

    const now = Date.now()
    const cached = cacheRef.current

    // Use cache if fresh
    if (cached.data && now - cached.timestamp < CACHE_DURATION) {
      setBalance(cached.data)
      return
    }

    // Otherwise fetch
    fetchBalance()
  }, [userId, fetchBalance])

  // Handle tab focus to refresh
  useEffect(() => {
    const handleFocus = () => {
      // Check if cache is stale
      if (Date.now() - cacheRef.current.timestamp > CACHE_DURATION) {
        fetchBalance()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchBalance])

  const refresh = useCallback(async () => {
    // Force refresh, bypass cache
    cacheRef.current = { data: null, timestamp: 0 }
    await fetchBalance()
  }, [fetchBalance])

  return { balance, loading, error, refresh }
}
