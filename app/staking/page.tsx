'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface StakingTier {
  id: string
  name: string
  icon: string
  minTokens: number
  apy: number
  lockupDays: number
  color: string
  description: string
}

interface UserStakingInfo {
  stakedAmount: number
  unlocksAt: string | null
  tier: string
  pendingRewards: number
}

const TIERS: StakingTier[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    icon: '🥉',
    minTokens: 0,
    apy: 5,
    lockupDays: 30,
    color: 'from-amber-100 to-amber-50',
    description: 'Entry level staking tier',
  },
  {
    id: 'silver',
    name: 'Silver',
    icon: '🥈',
    minTokens: 1000,
    apy: 8,
    lockupDays: 60,
    color: 'from-gray-100 to-gray-50',
    description: 'Enhanced rewards and benefits',
  },
  {
    id: 'gold',
    icon: '🥇',
    name: 'Gold',
    minTokens: 5000,
    apy: 12,
    lockupDays: 90,
    color: 'from-yellow-100 to-yellow-50',
    description: 'Premium tier with maximum rewards',
  },
]

export default function StakingPage() {
  const [userInfo, setUserInfo] = useState<UserStakingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [userTokens, setUserTokens] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from localStorage (in production, fetch from API)
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          // Fetch staking info from API
          const response = await fetch(`/api/heartbeat/status?userId=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            if (data.user_info) {
              setUserTokens(data.user_info.totalTokens || 0)
              // Set default staking info
              setUserInfo({
                stakedAmount: 0,
                unlocksAt: null,
                tier: 'bronze',
                pendingRewards: 0,
              })
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const calculateRewards = (amount: number, apy: number) => {
    return (amount * apy) / 100 / 365
  }

  const getEligibleTiers = () => {
    return TIERS.filter((tier) => userTokens >= tier.minTokens)
  }

  const formatDate = (daysFromNow: number) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <p className="mt-4 text-gray-600">Loading staking information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Token Staking</h1>
            <div className="text-right">
              <p className="text-sm text-gray-600">Your Balance</p>
              <p className="text-2xl font-bold text-green-600">{userTokens.toFixed(2)}</p>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Lock your tokens to earn passive rewards through our staking program. Higher tiers offer better APY
            rates but require longer lock-up periods.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Staking Tiers Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Select Your Staking Tier</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier, index) => {
              const isEligible = userTokens >= tier.minTokens
              const isSelected = selectedTier === tier.id

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => isEligible && setSelectedTier(tier.id)}
                  className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                    isEligible ? 'hover:shadow-xl' : 'opacity-60 cursor-not-allowed'
                  } ${isSelected ? 'ring-2 ring-pink-600 shadow-xl' : 'shadow-md'}`}
                >
                  <div className={`bg-gradient-to-b ${tier.color} p-8 border-b-4 border-${tier.id}`}>
                    {/* Tier Icon */}
                    <div className="text-6xl mb-4 text-center">{tier.icon}</div>

                    {/* Tier Name */}
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{tier.name} Tier</h3>
                    <p className="text-sm text-gray-600 text-center mb-6">{tier.description}</p>

                    {/* Requirements */}
                    <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Minimum:</span>
                          <span className="font-bold text-gray-900">{tier.minTokens.toLocaleString()} DDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">APY:</span>
                          <span className="font-bold text-green-700">{tier.apy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Lock-up:</span>
                          <span className="font-bold text-orange-700">{tier.lockupDays} days</span>
                        </div>
                      </div>
                    </div>

                    {/* Daily Rewards Preview */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-2">Daily rewards on 1,000 DDC:</p>
                      <p className="text-xl font-bold text-blue-700">
                        {(calculateRewards(1000, tier.apy).toFixed(3))} DDC/day
                      </p>
                    </div>

                    {/* Eligible Badge */}
                    {isEligible ? (
                      <div className="text-center bg-green-100 text-green-800 rounded-lg py-2 font-semibold">
                        ✅ Eligible for this tier
                      </div>
                    ) : (
                      <div className="text-center bg-gray-100 text-gray-700 rounded-lg py-2 font-semibold">
                        ❌ Insufficient balance ({(tier.minTokens - userTokens).toFixed(2)} more needed)
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Action Section */}
        {selectedTier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-pink-600"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {TIERS.find((t) => t.id === selectedTier)?.name} Tier - Staking Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Details */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Lock-up Details</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between py-2 border-b">
                    <span>Tier Selected:</span>
                    <span className="font-bold">
                      {TIERS.find((t) => t.id === selectedTier)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Lock-up Period:</span>
                    <span className="font-bold">
                      {TIERS.find((t) => t.id === selectedTier)?.lockupDays} days
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>APY Rate:</span>
                    <span className="font-bold text-green-700">
                      {TIERS.find((t) => t.id === selectedTier)?.apy}%
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Unlock Date:</span>
                    <span className="font-bold">
                      {formatDate(TIERS.find((t) => t.id === selectedTier)?.lockupDays || 30)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Calculator */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Rewards Calculator</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-700 font-semibold">Amount to Stake (DDC)</label>
                    <input
                      type="number"
                      max={userTokens}
                      placeholder="Enter amount..."
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Estimated Daily Rewards:</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {(
                        calculateRewards(1000, TIERS.find((t) => t.id === selectedTier)?.apy || 5)
                      ).toFixed(3)}{' '}
                      DDC
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      (Based on 1,000 DDC at {TIERS.find((t) => t.id === selectedTier)?.apy}% APY)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl">
                🔒 Stake Now
              </button>
              <button
                onClick={() => setSelectedTier(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3">📚 How Staking Works</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Select your preferred tier based on your token balance</li>
              <li>✓ Stake your tokens for a fixed period</li>
              <li>✓ Earn daily rewards based on the tier's APY rate</li>
              <li>✓ After lock-up expires, claim both principal and rewards</li>
              <li>✓ Higher tiers offer better returns but require longer commitment</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h4 className="font-bold text-green-900 mb-3">💡 Pro Tips</h4>
            <ul className="text-sm text-green-800 space-y-2">
              <li>🎯 Stack multiple tiers for diversified returns</li>
              <li>📈 Plan staking to align with habit milestones</li>
              <li>🔄 Re-stake rewards to compound your earnings</li>
              <li>📅 Mark unlock dates to avoid missing claims</li>
              <li>⭐ Premium members unlock exclusive early-exit options</li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                q: 'Can I unstake before the lock-up period expires?',
                a: 'Standard tiers require waiting until the lock-up period ends. Premium members may unlock early-exit with a small fee.',
              },
              {
                q: 'How are daily rewards calculated?',
                a: 'Daily rewards = (Staked Amount × APY) / 365. Rewards accumulate daily and are added to your account.',
              },
              {
                q: 'Can I upgrade my tier while staking?',
                a: 'You can open new stakes at higher tiers anytime. Existing stakes remain at their original tier.',
              },
              {
                q: 'What happens if I fall below minimum token requirements?',
                a: 'Your existing stakes are unaffected. You just become ineligible for higher tiers until you accumulate more tokens.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="border border-gray-300 rounded-lg group">
                <summary className="p-4 cursor-pointer font-semibold text-gray-800 group-open:text-pink-600 hover:bg-gray-100 transition">
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-700">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
