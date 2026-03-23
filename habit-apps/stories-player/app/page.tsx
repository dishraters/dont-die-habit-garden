'use client'

import { useState } from 'react'

const DDHG_API = process.env.NEXT_PUBLIC_DDHG_API || 'http://localhost:3000'
const USER_ID = typeof window !== 'undefined' ? localStorage.getItem('stories_user_id') || 'user-' + Math.random().toString(36).substr(2, 9) : 'guest'

interface Story {
  id: string
  title: string
  duration: string
  narrator: string
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

  const playStory = (story: Story) => {
    setCurrentStory(story)
    setIsPlaying(true)
  }

  const stopStory = () => {
    setIsPlaying(false)
  }

  const markComplete = async () => {
    if (!currentStory) {
      setFeedback({ type: 'error', message: 'Select a story first' })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${DDHG_API}/api/heartbeat/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitType: 'sleeptime_stories',
          userId: USER_ID,
          sourceApp: 'stories-player',
          rp_earned: 3
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit story completion')
      }

      setFeedback({ type: 'success', message: `📖 Story complete! +3 RP earned` })
      setCurrentStory(null)
      setIsPlaying(false)
      setTimeout(() => setFeedback(null), 3000)
    } catch (error) {
      console.error('Error:', error)
      setFeedback({ type: 'error', message: 'Failed to log story. Check console.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '600px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>📖 Sleeptime Stories</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Drift into peaceful sleep with soothing narratives
        </p>

        {/* Current Playing Story */}
        {currentStory ? (
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', padding: '2rem', color: 'white', marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎧</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{currentStory.title}</h2>
            <p style={{ marginBottom: '0.25rem' }}>Narrator: <strong>{currentStory.narrator}</strong></p>
            <p style={{ opacity: 0.9 }}>Duration: {currentStory.duration}</p>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={stopStory}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#f8f8f8', borderRadius: '10px', marginBottom: '2rem' }}>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>Select a story to begin</p>
          </div>
        )}

        {/* Stories List */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>Available Stories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STORIES.map(story => (
              <button
                key={story.id}
                onClick={() => playStory(story)}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: currentStory?.id === story.id ? '2px solid #667eea' : '1px solid #ddd',
                  background: currentStory?.id === story.id ? '#f0f4ff' : '#f8f8f8',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>📚 {story.title}</p>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>by {story.narrator}</p>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#999' }}>{story.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mark Complete Button */}
        <button
          onClick={markComplete}
          disabled={isSubmitting || !currentStory}
          style={{
            width: '100%',
            padding: '1.25rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '10px',
            border: 'none',
            background: !currentStory ? '#ccc' : '#22c55e',
            color: 'white',
            cursor: !currentStory ? 'not-allowed' : 'pointer',
            opacity: !currentStory ? 0.6 : 1,
            transition: 'all 0.3s'
          }}
        >
          {isSubmitting ? '⏳ Submitting...' : '✅ Mark Complete'}
        </button>

        {/* Feedback */}
        {feedback && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '10px',
            background: feedback.type === 'success' ? '#d4edda' : '#f8d7da',
            color: feedback.type === 'success' ? '#155724' : '#721c24',
            textAlign: 'center',
            fontSize: '0.95rem'
          }}>
            {feedback.message}
          </div>
        )}
      </div>
    </main>
  )
}
