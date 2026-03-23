'use client'

import { useState, useEffect, useCallback } from 'react'

interface UserBalance {
  totalTokens: number
  todayEarnings: number
  balance: number
  loading: boolean
  error: string | null
  lastFetch: number
}

const CACHE_DURATION = 60000 // 60 seconds
let cachedBalance: UserBalance | null = null
let cacheTimestamp: number = 0

export function useUserBalance(userId?: string): UserBalance {
  const [state, setState] = useState<UserBalance>({
    totalTokens: 0,
    todayEarnings: 0,
    balance: 0,
    loading: true,
    error: null,
    lastFetch: 0,
  })

  const fetchBalance = useCallback(async () => {
    // Use Firebase UID if no userId provided
    let uid = userId
    
    // If no userId, try to get from localStorage or Firebase
    if (!uid) {
      try {
        const auth = (globalThis as any).firebase?.auth
        uid = auth?.currentUser?.uid
        if (!uid && typeof window !== 'undefined') {
          uid = localStorage.getItem('firebaseUid')
        }
      } catch (e) {
        console.error('[useUserBalance] Failed to get UID:', e)
      }
    }

    if (!uid) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'No user ID available',
      }))
      return
    }

    // Check cache
    const now = Date.now()
    if (cachedBalance && now - cacheTimestamp < CACHE_DURATION) {
      setState(prev => ({
        ...prev,
        ...cachedBalance,
        loading: false,
      }))
      return
    }

    try {
      const response = await fetch(
        `/api/heartbeat/status?userId=${encodeURIComponent(uid)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      const newBalance: UserBalance = {
        totalTokens: data.user_info?.totalTokens ?? 0,
        todayEarnings: data.user_info?.todayEarnings?.tokens_awarded ?? 0,
        balance: data.user_info?.totalTokens ?? 0,
        loading: false,
        error: null,
        lastFetch: now,
      }

      // Update cache
      cachedBalance = newBalance
      cacheTimestamp = now

      setState(newBalance)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error('[useUserBalance] Fetch error:', errorMsg)
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMsg,
      }))
    }
  }, [userId])

  useEffect(() => {
    // Fetch on mount
    fetchBalance()

    // Set up interval refetch (every 60 seconds)
    const interval = setInterval(fetchBalance, CACHE_DURATION)

    // Refetch on tab focus
    const handleFocus = () => {
      // Clear cache to force fresh fetch
      cacheTimestamp = 0
      fetchBalance()
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        cacheTimestamp = 0
        fetchBalance()
      }
    })

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [fetchBalance])

  return state
}

/**
 * Manually trigger a balance refresh
 * Useful after completing a habit
 */
export function useUserBalanceRefresh() {
  return useCallback(async (userId: string) => {
    // Clear cache to force next fetch
    cacheTimestamp = 0
    
    try {
      const response = await fetch(
        `/api/heartbeat/status?userId=${encodeURIComponent(userId)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      )

      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data = await response.json()
      
      const newBalance: UserBalance = {
        totalTokens: data.user_info?.totalTokens ?? 0,
        todayEarnings: data.user_info?.todayEarnings?.tokens_awarded ?? 0,
        balance: data.user_info?.totalTokens ?? 0,
        loading: false,
        error: null,
        lastFetch: Date.now(),
      }

      cachedBalance = newBalance
      cacheTimestamp = Date.now()

      return newBalance
    } catch (error) {
      console.error('[useUserBalanceRefresh] Error:', error)
      return null
    }
  }, [])
}
