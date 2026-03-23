'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HeartbeatIcon } from '../components/HeartbeatAnimation'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const streakMultiplierData = [
  { day: 1, multiplier: 1.0 },
  { day: 5, multiplier: 1.93 },
  { day: 10, multiplier: 2.67 },
  { day: 15, multiplier: 4.0 },
  { day: 20, multiplier: 6.34 },
  { day: 25, multiplier: 8.67 },
  { day: 30, multiplier: 15.0 },
]

const habitRPData = [
  { habit: 'Meditation', baseRP: 2, color: '#6366f1' },
  { habit: 'Training', baseRP: 3, color: '#ef4444' },
  { habit: 'Breakfast', baseRP: 1, color: '#f59e0b' },
  { habit: 'Lunch', baseRP: 1, color: '#f59e0b' },
  { habit: 'Dinner', baseRP: 1, color: '#f59e0b' },
  { habit: 'Planning', baseRP: 2, color: '#3b82f6' },
  { habit: 'Gratitude', baseRP: 2, color: '#ec4899' },
  { habit: 'Sleep', baseRP: 2, color: '#8b5cf6' },
  { habit: 'Stretching', baseRP: 1, color: '#10b981' },
]

const supplyData = [
  { day: 'Mon', tokens: 2739.72 },
  { day: 'Tue', tokens: 2739.72 },
  { day: 'Wed', tokens: 2739.72 },
  { day: 'Thu', tokens: 2739.72 },
  { day: 'Fri', tokens: 2739.72 },
  { day: 'Sat', tokens: 2739.72 },
  { day: 'Sun', tokens: 2739.72 },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-6">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl animate-pulse">💓</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">The Heartbeat System</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
            Understand how your daily habits earn you tokens through our innovative reward ecosystem.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Section 1: The Heartbeat */}
        <Section title="🔄 The Heartbeat" icon="💓">
          <p className="text-gray-700 mb-6">
            Every day at midnight, the Heartbeat pulse triggers. It's the moment when your daily activity translates
            into real rewards. Here's how the cycle works:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '📝', label: 'You Complete Habits', desc: 'Earn RP from daily actions' },
              {
                icon: '⚡',
                label: 'RP Accumulates',
                desc: 'Base RP + Streak Multiplier',
              },
              {
                icon: '📊',
                label: 'Pool Distributes',
                desc: 'Daily tokens split by share',
              },
              {
                icon: '💎',
                label: 'You Earn Tokens',
                desc: 'Tokens added to your balance',
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-b from-pink-50 to-white rounded-lg p-6 border border-pink-200 text-center"
              >
                <div className="text-4xl mb-3">{step.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{step.label}</h4>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Key Insight:</span> The Heartbeat ensures that more active users
              earn more tokens, while the daily pool size remains constant. It's a fair, transparent system where
              participation directly rewards consistency.
            </p>
          </div>
        </Section>

        {/* Section 2: Reward Points */}
        <Section title="⚡ Reward Points (RP)" icon="🎯">
          <p className="text-gray-700 mb-6">
            Every habit completion earns you Reward Points (RP). Different habits have different base RP values
            based on their health impact and difficulty:
          </p>

          <div className="bg-white rounded-lg p-6 shadow-md mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-bold text-gray-800">Habit</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-800">Base RP</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-800">Category</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-800">Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    habit: 'Meditation',
                    rp: 2,
                    category: 'Mental Health',
                    example: '10 min meditation = 2 RP',
                  },
                  {
                    habit: 'Training',
                    rp: 3,
                    category: 'Physical',
                    example: '30 min workout = 3 RP',
                  },
                  {
                    habit: 'Sleep',
                    rp: 2,
                    category: 'Recovery',
                    example: '8 hours = 2 RP',
                  },
                  {
                    habit: 'Gratitude',
                    rp: 2,
                    category: 'Mindfulness',
                    example: '5 items = 2 RP',
                  },
                  {
                    habit: 'Breakfast/Lunch/Dinner',
                    rp: 1,
                    category: 'Nutrition',
                    example: 'Each meal = 1 RP',
                  },
                  {
                    habit: 'Planning',
                    rp: 2,
                    category: 'Productivity',
                    example: 'Daily plan = 2 RP',
                  },
                  {
                    habit: 'Stretching',
                    rp: 1,
                    category: 'Physical',
                    example: '5 min stretch = 1 RP',
                  },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-800">{item.habit}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold">
                        {item.rp} RP
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{item.category}</td>
                    <td className="py-3 px-4 text-gray-600 italic">{item.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <p className="text-sm text-green-800 mb-3">
              <span className="font-semibold">📈 Daily RP Example:</span>
            </p>
            <code className="text-xs bg-white p-3 rounded block border border-green-200 mb-3">
              {`// Your daily activity
Meditation (2 RP)
+ Training (3 RP)
+ Breakfast (1 RP)
+ Lunch (1 RP)
+ Dinner (1 RP)
+ Planning (2 RP)
+ Gratitude (2 RP)
+ Sleep (2 RP)
+ Stretching (1 RP)
━━━━━━━━━━━━━
= 15 RP earned today`}
            </code>
          </div>
        </Section>

        {/* Section 3: Streak Multiplier */}
        <Section title="🔥 Streak Multiplier" icon="📈">
          <p className="text-gray-700 mb-6">
            Your streak multiplier grows as you maintain consecutive days of activity. It amplifies your earned RP
            and directly impacts your daily token rewards:
          </p>

          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={streakMultiplierData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" label={{ value: 'Multiplier', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="multiplier"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { range: 'Days 1-10', mult: '1.0x - 2.67x', color: 'orange' },
              { range: 'Days 11-20', mult: '2.67x - 6.34x', color: 'red' },
              { range: 'Days 21-30', mult: '6.34x - 15.0x', color: 'purple' },
            ].map((tier, idx) => (
              <div key={idx} className={`bg-${tier.color}-50 rounded-lg p-4 border border-${tier.color}-200`}>
                <p className={`font-semibold text-${tier.color}-900`}>{tier.range}</p>
                <p className={`text-2xl font-bold text-${tier.color}-700`}>{tier.mult}</p>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <p className="text-sm text-purple-800 mb-2">
              <span className="font-semibold">🎉 Maximum Multiplier:</span>
            </p>
            <p className="text-lg font-bold text-purple-700 mb-3">15.0× after 30 consecutive days</p>
            <p className="text-sm text-purple-700">
              Once you reach day 30, your multiplier is locked at 15.0× and becomes permanent for future activity.
            </p>
          </div>
        </Section>

        {/* Section 4: Daily Pool Distribution */}
        <Section title="📊 Daily Pool Distribution" icon="💰">
          <p className="text-gray-700 mb-6">
            Every day, 2,739.72 DDC tokens are distributed among all active users. Your share is determined by your
            percentage of the total network RP:
          </p>

          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={supplyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tokens"
                  fill="#ec48992e"
                  stroke="#ec4899"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6">
            <p className="text-sm text-blue-800 font-mono mb-3">
              <span className="font-semibold">Formula:</span>
            </p>
            <code className="text-xs bg-white p-3 rounded block border border-blue-200">
              {`Your Daily Tokens = (Your RP ÷ Total Network RP) × 2,739.72

Example:
Your RP today: 45 (15 base × 3.0× multiplier)
Network Total: 10,000 RP
Your Share: (45 ÷ 10,000) × 2,739.72 = 12.33 DDC`}
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-900 mb-2">More Active Users = Smaller Slices</h4>
              <p className="text-sm text-green-800">
                As more people participate, each person's slice of the daily pool shrinks. This encourages
                consistency to grow streaks.
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h4 className="font-bold text-orange-900 mb-2">Multiplier Amplifies Share</h4>
              <p className="text-sm text-orange-800">
                Higher multipliers mean more RP, which means a bigger slice. Streaks directly translate to
                rewards.
              </p>
            </div>
          </div>
        </Section>

        {/* Section 5: Golden Seeds */}
        <Section title="🌱 Golden Seeds" icon="🎁">
          <p className="text-gray-700 mb-6">
            Reach 30-day streaks and unlock exclusive Golden Seeds. These are collectible rewards that unlock
            premium features and future perks:
          </p>

          <div className="bg-white rounded-lg p-6 shadow-md mb-6 border-l-4 border-yellow-500">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">🌱</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">How to Earn Seeds</h4>
                <ol className="text-sm text-gray-700 space-y-2">
                  <li>
                    <span className="font-semibold">Day 7:</span> First milestone reached
                  </li>
                  <li>
                    <span className="font-semibold">Day 14:</span> Halfway there
                  </li>
                  <li>
                    <span className="font-semibold">Day 30:</span> 🌱 Earn 1 Golden Seed!
                  </li>
                  <li>
                    <span className="font-semibold">Every 30 days:</span> Continue earning seeds for extended streaks
                  </li>
                </ol>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">💎 Seed Benefits:</span> Redeemable for premium features, early access
                to new habits, exclusive content, and limited-edition cosmetics.
              </p>
            </div>
          </div>
        </Section>

        {/* Section 6: The Ecosystem Loop */}
        <Section title="🔄 The Ecosystem Loop" icon="♻️">
          <p className="text-gray-700 mb-6">
            The Heartbeat creates a virtuous cycle that encourages long-term engagement:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { icon: '📝', label: 'Activity', desc: 'Complete habits' },
              { icon: '⚡', label: 'RP', desc: 'Earn reward points' },
              { icon: '🔥', label: 'Streaks', desc: 'Multiply rewards' },
              { icon: '💰', label: 'Distribution', desc: 'Earn tokens' },
              { icon: '🎯', label: 'Motivation', desc: 'Keep going!' },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-b from-pink-50 to-white rounded-lg p-4 border border-pink-200 text-center relative"
              >
                <div className="text-3xl mb-2">{step.icon}</div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{step.label}</h4>
                <p className="text-xs text-gray-600">{step.desc}</p>
                {idx < 4 && (
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-2xl hidden md:block">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-6 bg-green-50 rounded-lg p-6 border border-green-200">
            <p className="text-sm text-green-800">
              <span className="font-semibold">✨ The Magic:</span> The system is designed so that the more people
              participate and maintain streaks, the more valuable everyone's tokens become. It's a rising tide that
              lifts all boats—your success doesn't diminish others; it strengthens the entire ecosystem.
            </p>
          </div>
        </Section>

        {/* FAQ Section */}
        <Section title="❓ Frequently Asked Questions" icon="💬">
          <div className="space-y-3">
            {[
              {
                q: 'Why do my earnings fluctuate day to day?',
                a: 'Your earnings depend on two factors: (1) your daily RP and multiplier, and (2) total network RP. More active users = smaller slices of the daily pool.',
              },
              {
                q: 'What happens if I miss a day?',
                a: 'Your streak resets to 0, and your multiplier drops back to 1.0×. Start building a new streak immediately to get back on track.',
              },
              {
                q: 'Can I trade or sell tokens?',
                a: 'Tokens are currently non-transferable. Future versions may enable token staking, trading, and governance features.',
              },
              {
                q: 'How many seeds can I earn?',
                a: 'One seed per 30-day streak. A 60-day streak = 2 seeds, 90-day = 3 seeds, etc. The limit is your consistency.',
              },
              {
                q: 'What can I do with tokens?',
                a: 'Currently: staking for rewards. Future: premium features, cosmetics, and exclusive content.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="border border-gray-300 rounded-lg group">
                <summary className="p-4 cursor-pointer font-semibold text-gray-800 group-open:text-pink-600 hover:bg-gray-100 transition">
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-700 bg-gray-50">{faq.a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-12 py-12 bg-gradient-to-r from-pink-100 to-orange-100 rounded-lg border-2 border-pink-300"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Earning?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Head back to your dashboard, complete your daily habits, and watch your tokens grow. The Heartbeat is
            always beating—are you?
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            🏠 Go to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16 scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{icon}</span>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="pl-16">{children}</div>
    </motion.section>
  )
}
