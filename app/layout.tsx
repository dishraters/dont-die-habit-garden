import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Don\'t Die Habit Garden',
  description: '9 habits to build a healthier life. Earn DDC tokens for consistency.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
