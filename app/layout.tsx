import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import { SimpleAuthProvider } from './lib/simple-auth-context'

export const metadata: Metadata = {
  title: "Don't Die Habit Garden",
  description: 'A calm daily ritual for meditation, journaling, gratitude, planning, and consistency.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SimpleAuthProvider>
          <Navbar />
          {children}
        </SimpleAuthProvider>
      </body>
    </html>
  )
}
