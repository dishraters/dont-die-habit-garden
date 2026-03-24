'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSimpleAuth } from '../lib/simple-auth-context'

const appLinks = [
  { href: '/', label: 'Garden' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/activity', label: 'Activity' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/staking', label: 'Staking' },
  { href: '/store', label: 'Store' },
  { href: '/how-it-works', label: 'How it works' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, signOut } = useSimpleAuth()

  const isActive = (href: string) => pathname === href

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-green-900">
          <span className="text-3xl">🌱</span>
          <div>
            <div className="text-lg font-bold">Don&apos;t Die Habit Garden</div>
            <div className="text-xs text-green-700">Calm daily consistency</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {appLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!loading && user ? (
            <>
              <span className="text-sm text-green-900">Hi, {user.name || user.email?.split('@')[0] || 'Gardener'}</span>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-green-200 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-700">
                Log in
              </Link>
              <Link href="/auth" className="rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600">
                Start growing
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-full border border-green-200 p-2 text-green-800 lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-green-100 bg-white lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4">
            {appLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 border-t border-green-100 pt-3">
              {!loading && user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full rounded-2xl border border-green-200 px-4 py-3 text-left text-sm font-medium text-green-700"
                >
                  Sign out
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50">
                    Log in
                  </Link>
                  <Link href="/auth" onClick={() => setIsOpen(false)} className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-medium text-white">
                    Start growing
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
