'use client'

import { useState, useEffect } from 'react'

const DDHG_API = process.env.NEXT_PUBLIC_DDHG_API || 'https://dont-die-habit-garden.vercel.app'
const USER_ID = typeof window !== 'undefined' ? localStorage.getItem('stories_user_id') || 'user-' + Math.random().toString(36).substr(2, 9) : 'guest'

interface Story {
  id: string | number
  title: string
  duration: string
  narrator: string
}

interface BalanceData {
  totalTokens: number
  loading: boolean
}

const STORIES: Story[] = [
  { id: 1, title: 'The Enchanted Forest', duration: '8:42', narrator: 'Morgan Freeman' },
  { id: 2, title: 'Journey to the Stars', duration: '10:15', narrator: 'David Attenborough' },
  { id: 3, title: 'Whispers of the Ocean', duration: '7:30', narrator: 'Meryl Streep' },
  { id: 4, title: 'Mountains Call', duration: '9:20', narrator: 'Tom Hiddleston' },
  { id: 5, title: 'Dreams of Tomorrow', duration: '8:05', narrator: 'Tilda Swinton' },
]

export default function StoriesPlayer() {
  const [currentStory, setCurrentStory] = useState<Story | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [balance, setBalance] = useState<BalanceData>({ totalTokens: 0, loading: true })

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `${DDHG_API}/api/heartbeat/status?userId=${encodeURIComponent(USER_ID)}`,
          { credentials: 'include' }
        )
        if (response.ok) {
          const data = await response.json()
          setBalance({
            totalTokens: data.user_info?.totalTokens ?? 0,
            loading: false,
          })
        }
      } catch (err) {
        console.error('Balance fetch error:', err)
        setBalance({ totalTokens: 0, loading: false })
      }
    }
    fetchBalance()
  }, [])

  const playStory = (story: Story) => {
    setCurrentStory(story)
    setIsPlaying(true)
  }

  const markComplete = async () => {
    if (!currentStory) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`${DDHG_API}/api/heartbeat/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          habitType: 'stories',
          userId: USER_ID,
          sourceApp: 'stories-app',
          rp_earned: 3
        })
      })

      if (response.ok) {
        const result = await response.json()
        const tokens = result.estimated_tokens || 0.11
        setFeedback({ type: 'success', message: `📖 Story complete! +3 RP earned (est. ${tokens.toFixed(2)} DDHG)` })
        setCurrentStory(null)
        setIsPlaying(false)
        setTimeout(() => setFeedback(null), 4000)
      }
    } catch (error) {
      console.error('Error:', error)
      setFeedback({ type: 'error', message: 'Failed to log story' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', color: 'white', margin: 0 }}>📖 Stories</h1>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '20px', color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {balance.loading ? '...' : `💰 ${balance.totalTokens.toFixed(2)} DDHG`}
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '600px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          {!currentStory ? (
            <>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Select a story to begin</p>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {STORIES.map(story => (
                  <button
                    key={story.id}
                    onClick={() => playStory(story)}
                    style={{
                      padding: '1rem',
                      background: '#f8f8f8',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{story.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{story.narrator} • {story.duration}</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 style={{ marginBottom: '1rem' }}>{currentStory.title}</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>Narrated by {currentStory.narrator}</p>
              <div style={{ padding: '2rem', background: '#f8f8f8', borderRadius: '10px', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>▶</div>
                <p style={{ color: '#999' }}>{isPlaying ? 'Playing...' : 'Ready to play'}</p>
              </div>
              <button
                onClick={markComplete}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                {isSubmitting ? 'Submitting...' : '✅ Complete Story'}
              </button>
              <button
                onClick={() => { setCurrentStory(null); setIsPlaying(false) }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                ← Back to Stories
              </button>
            </>
          )}

          {feedback && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '10px',
              background: feedback.type === 'success' ? '#d4edda' : '#f8d7da',
              color: feedback.type === 'success' ? '#155724' : '#721c24',
              textAlign: 'center'
            }}>
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
