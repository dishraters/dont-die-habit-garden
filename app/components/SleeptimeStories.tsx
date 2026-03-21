'use client'

import { useState } from 'react'

interface SleeptimeStoriesProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const STORIES = [
  {
    id: 1,
    title: 'The Origin of Humans',
    duration: '5:00',
    excerpt: 'From the African savanna to the stars... journey through millions of years of human evolution.',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'A Walk Through Time',
    duration: '5:00',
    excerpt: 'Discover how humans learned to make fire, build shelters, and create art.',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'The Star Seekers',
    duration: '5:00',
    excerpt: 'Ancient humans looked up at the stars and wondered... and that changed everything.',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 4,
    title: 'Connection & Community',
    duration: '5:00',
    excerpt: 'How humans learned to work together and build civilizations.',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 5,
    title: 'Dreams & Wonder',
    duration: '5:00',
    excerpt: 'Humans dared to dream big. From first flights to walking on the moon.',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
]

export default function SleeptimeStories({ isOpen, onClose, onComplete }: SleeptimeStoriesProps) {
  const [selectedStory, setSelectedStory] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  if (!isOpen) return null

  const story = selectedStory ? STORIES.find(s => s.id === selectedStory) : null

  const handlePlay = (id: number) => {
    setSelectedStory(id)
    setIsPlaying(true)
    // Simulated play - auto-complete after 5 seconds for demo
    setTimeout(() => {
      setIsPlaying(false)
    }, 5000)
  }

  const handleComplete = () => {
    onComplete()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-900">📖 Sleeptime Stories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {!story ? (
          <div className="space-y-3">
            <p className="text-gray-600 mb-4">Choose a story to drift off to sleep...</p>
            {STORIES.map((s) => (
              <button
                key={s.id}
                onClick={() => handlePlay(s.id)}
                className="w-full p-4 bg-white rounded-lg hover:bg-purple-50 border-2 border-transparent hover:border-purple-300 transition-all text-left"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-800">{s.title}</span>
                  <span className="text-xs text-gray-500 ml-2">{s.duration}</span>
                </div>
                <p className="text-xs text-gray-600">{s.excerpt}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🌙</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{story.title}</h3>
              <p className="text-sm text-gray-600">{story.duration}</p>
            </div>

            {isPlaying && (
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">Playing...</p>
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400"
                  >
                    ⏸ Pause
                  </button>
                </div>
              </div>
            )}

            {!isPlaying && (
              <button
                onClick={() => handlePlay(story.id)}
                className="w-full py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600"
              >
                ▶ Play Story
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStory(null)}
                className="flex-1 py-2 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400"
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
              >
                ✅ Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
