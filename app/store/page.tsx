'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const PLACEHOLDER_ITEMS = [
  { id: 1, title: 'Premium Avatar', price: '500 tokens', icon: '👤' },
  { id: 2, title: 'Custom Theme', price: '1000 tokens', icon: '🎨' },
  { id: 3, title: 'Exclusive Badge', price: '750 tokens', icon: '🏅' },
  { id: 4, title: 'Streak Booster', price: '250 tokens', icon: '🔥' },
  { id: 5, title: 'Golden Hat Pack', price: '2000 tokens', icon: '👑' },
  { id: 6, title: 'Sound Pack', price: '300 tokens', icon: '🎵' },
]

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              ← Back
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">🛍️ Token Store</h1>
            <div className="w-12"></div>
          </div>

          <p className="text-gray-600 max-w-2xl">
            Spend your hard-earned tokens on exclusive items, themes, and perks. New items coming soon!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-8 border-2 border-yellow-200 mb-12 text-center"
        >
          <p className="text-6xl mb-4">🚀</p>
          <h2 className="text-2xl font-bold text-yellow-900 mb-2">Coming Soon!</h2>
          <p className="text-yellow-800 max-w-2xl mx-auto">
            The Token Store is currently under development. We're working on curating amazing items for you to spend
            your tokens on. Check back soon!
          </p>
        </motion.div>

        {/* Preview Grid (Disabled) */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Preview of Coming Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLACEHOLDER_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg p-6 border border-gray-200 shadow-md hover:shadow-lg transition opacity-60 cursor-not-allowed"
              >
                <div className="text-5xl mb-4 text-center">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{item.title}</h3>
                <p className="text-center text-sm text-gray-600 mb-4">{item.price}</p>
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">💡 What to Expect</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Exclusive avatars and profile customizations</li>
              <li>✓ Custom app themes and color schemes</li>
              <li>✓ Rare badges and achievement unlocks</li>
              <li>✓ Streak boosters and multiplier items</li>
              <li>✓ Sound packs and notification customizations</li>
              <li>✓ Limited-edition seasonal items</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-bold text-green-900 mb-3">🎯 How to Earn Tokens</h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li>🌱 Complete habits across 9+ apps</li>
              <li>🔥 Build streaks for multiplier bonuses</li>
              <li>👑 Reach 30-day streaks for golden seeds</li>
              <li>🏆 Climb the leaderboard for rewards</li>
              <li>⭐ Participate in daily challenges</li>
              <li>💰 Earn tokens from heartbeat distributions</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-lg p-8 text-white text-center shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-4">Start Earning Tokens Today!</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Complete habits in any of our apps and watch your token balance grow. The more you do, the more you earn!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/portfolio"
              className="px-6 py-3 bg-white text-pink-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              View Your Balance
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-pink-800 text-white font-semibold rounded-lg hover:bg-pink-900 transition border-2 border-white"
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'When will the store launch?',
                a: 'The Token Store is launching in Q2 2026 with a curated selection of digital items and customizations.',
              },
              {
                q: 'Can I refund purchases?',
                a: 'Digital items are non-refundable, but we guarantee satisfaction with every purchase.',
              },
              {
                q: 'Will items be exclusive?',
                a: 'Yes! Many items will be limited-edition or seasonal, so collect them while they last.',
              },
              {
                q: 'How much will items cost?',
                a: 'Items range from 100 to 5,000 tokens depending on rarity and exclusivity.',
              },
              {
                q: 'Can I trade tokens with other users?',
                a: 'Token trading is not currently supported. Tokens are personal and non-transferable.',
              },
              {
                q: 'Will there be free items?',
                a: 'Absolutely! Certain free cosmetics and badges will be available to all users.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-gray-200 mt-12 pt-8 pb-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/portfolio"
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition font-semibold text-gray-900 border border-gray-200"
            >
              📊 Portfolio
            </Link>
            <Link
              href="/leaderboard"
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition font-semibold text-gray-900 border border-gray-200"
            >
              🏆 Leaderboard
            </Link>
            <Link
              href="/activity"
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition font-semibold text-gray-900 border border-gray-200"
            >
              📝 Activity
            </Link>
            <Link
              href="/store"
              className="p-4 bg-pink-50 rounded-lg text-center hover:bg-pink-100 transition font-semibold text-pink-900 border border-pink-200"
            >
              🛍️ Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
