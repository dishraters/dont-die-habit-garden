'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type SimpleUser = {
  id: string
  email: string
  name?: string
  createdAt: number
}

type AuthContextType = {
  user: SimpleUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEYS = {
  USERS: 'ddhg_users',
  CURRENT_USER: 'ddhg_current_user',
}

function getUsers(): Record<string, { password: string; user: SimpleUser }> {
  if (typeof window === 'undefined') return {}
  const stored = localStorage.getItem(STORAGE_KEYS.USERS)
  return stored ? JSON.parse(stored) : {}
}

function saveUsers(users: Record<string, { password: string; user: SimpleUser }>) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

function generateUserId(): string {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

function hashPassword(password: string): string {
  // Simple hash for demo purposes - in production use proper hashing
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(16)
}

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    const users = getUsers()
    const normalizedEmail = email.toLowerCase().trim()
    const userRecord = users[normalizedEmail]
    
    if (!userRecord) {
      return { error: new Error('No account found with this email. Please sign up first.') }
    }
    
    if (userRecord.password !== hashPassword(password)) {
      return { error: new Error('Incorrect password. Please try again.') }
    }
    
    // Save session
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userRecord.user))
    setUser(userRecord.user)
    return { error: null }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    const normalizedEmail = email.toLowerCase().trim()
    const users = getUsers()
    
    if (users[normalizedEmail]) {
      return { error: new Error('An account with this email already exists. Please sign in.') }
    }
    
    // Basic validation
    if (password.length < 6) {
      return { error: new Error('Password must be at least 6 characters.') }
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      return { error: new Error('Please enter a valid email address.') }
    }
    
    const newUser: SimpleUser = {
      id: generateUserId(),
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail.split('@')[0],
      createdAt: Date.now(),
    }
    
    users[normalizedEmail] = {
      password: hashPassword(password),
      user: newUser,
    }
    
    saveUsers(users)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser))
    setUser(newUser)
    return { error: null }
  }

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSimpleAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider')
  }
  return context
}