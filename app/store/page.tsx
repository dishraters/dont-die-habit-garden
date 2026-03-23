'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface StoreItem {
  id: string
  name: string
  description: string
  price: number
  app: string
  icon: string
  category: 'premium' | 'subscription' | 'tools' | 'cosmetic'
}

export default function StorePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)

  // Get user ID on mount
  useEffect(() => {
    const getUID = async () => {
      try {
        const auth = (globalThis as any).firebase?.auth
        const uid = auth?.currentUser?.uid || localStorage.getItem('firebaseUid')
        
        if (uid) {
          setUserId(uid)
          // Fetch balance
          const response = await fetch(
            `/api/heartbeat/status?userId=${encodeURIComponent(uid)}`,
            { credentials: 'include' }
          )
          if (response.ok) {
            const data = await response.json()
            setBalance(data.user_info?.totalTokens ?? 0)
          }
        } else {
          router.push('/auth')
        }
      } catch (e) {
        console.error('Auth error:', e)
        router.push('/auth')
      }
    }
    
    getUID()
    setLoading(false)
  }, [router])

  const storeItems: StoreItem[] = [
    {
      id: '1',
      name: 'Premium Meal Plans',
      description: 'Personalized nutrition plans curated for your goals',
      price: 50,
      app: 'Dishrated',
      icon: '🥗',
      category: 'premium',
    },
    {
      id: '2',
      name: 'Ad-Free Experience',
      description: 'Remove all ads across all apps',
      price: 100,
      app: 'All Apps',
      icon: '✨',
      category: 'subscription',
    },
    {
      id: '3',
      name: 'Premium Plant Themes',
      description: 'Unlock exclusive garden themes & decorations',
      price: 30,
      app: 'Habit Garden',
      icon: '🌸',
      category: 'cosmetic',
    },
    {
      id: '4',
      name: 'Personal Habit Coach (AI)',
      description: 'Get AI-powered insights and personalized habit recommendations',
      price: 100,
      app: 'Habit Garden',
      icon: '🤖',
      category: 'premium',
    },
    {
      id: '5',
      name: 'Form Guide Videos',
      description: 'Expert-led exercise form guides and corrections',
      price: 40,
      app: 'TrainLog',
      icon: '🎥',
      category: 'premium',
    },
    {
      id: '6',
      name: 'Monthly Training Plans',
      description: 'Structured workout plans from certified trainers',
      price: 75,
      app: 'TrainLog',
      icon: '📋',
      category: 'premium',
    },
    {
      id: '7',
      name: 'Advanced Analytics',
      description: 'Deep insights into your fitness and health trends',
      price: 50,
      app: 'TrainLog',
      icon: '📊',
      category: 'tools',
    },
    {
      id: '8',
      name: 'Exclusive Guided Meditations',
      description: 'Premium collection of guided meditations from world-renowned teachers',
      price: 20,
      app: 'Meditation App',
      icon: '🧘',
      category: 'premium',
    },
  ]

  const categories = ['premium', 'subscription', 'tools', 'cosmetic'] as const

  if (!userId) {
    return <div className="p-8">Redirecting to auth...</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-600">Loading store...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🏪 DDHG Store</h1>
              <p className="text-gray-600 text-sm mt-1">Spend your tokens on premium features and tools</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>

          {/* Balance Bar */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-4">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-sm opacity-90">Your Balance</p>
              <p className="text-2xl font-bold">{balance.toFixed(2)} DDHG</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* COMING SOON Banner */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold mb-2">Store Coming Soon!</h2>
          <p className="text-sm opacity-90 max-w-2xl mx-auto">
            We're building an amazing marketplace where you can spend your DDHG tokens on premium features, 
            exclusive content, and more. Check back soon!
          </p>
        </div>

        {/* Product Preview */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">🎁 Available Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 opacity-75"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{item.icon}</div>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.app}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-indigo-600">{item.price}</span>
                  <span className="text-xs text-gray-500">DDHG</span>
                </div>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-bold text-gray-900 mb-2">Flexible Spending</h3>
            <p className="text-sm text-gray-600">
              Use your DDHG tokens on whatever you want — no restrictions
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-900 mb-2">Real Value</h3>
            <p className="text-sm text-gray-600">
              Every purchase supports your health and habit journey
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🌟</div>
            <h3 className="font-bold text-gray-900 mb-2">Exclusive Items</h3>
            <p className="text-sm text-gray-600">
              Premium content and features only available for DDHG holders
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
          <p className="text-gray-700 mb-4">
            In the meantime, keep earning DDHG by completing habits across all apps!
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}
