'use client'

import { useState, useRef } from 'react'

interface SleepstoriesPlayerProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const STORIES = [
  {
    id: 1,
    title: 'The First Breath',
    description: 'How the first living cells learned to survive on early Earth...',
    narrator: 'Deep & Soothing',
  },
  {
    id: 2,
    title: 'From Water to Land',
    description: 'The epic journey of life leaving the oceans...',
    narrator: 'Gentle & Calm',
  },
  {
    id: 3,
    title: 'Wings & Wonder',
    description: 'When creatures first took flight into the skies...',
    narrator: 'Dreamy Voice',
  },
  {
    id: 4,
    title: 'Standing Tall',
    description: 'The rise of upright walkers and early humans...',
    narrator: 'Warm & Inviting',
  },
  {
    id: 5,
    title: 'Sparks of Consciousness',
    description: 'How humans developed language, art, and thought...',
    narrator: 'Reflective Tone',
  },
]

export default function SleepstoriesPlayer({ isOpen, onClose, onComplete }: SleepstoriesPlayerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(300) // 5 minutes in seconds
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentStory = STORIES[currentStoryIndex]

  // Simulated audio - in production, use real story audio with TTS
  const audioUrl = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const selectStory = (index: number) => {
    setCurrentStoryIndex(index)
    setCurrentTime(0)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const handleComplete = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    onComplete()
  }

  const progressPercent = (currentTime / duration) * 100

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🌙 Sleeptime Stories</h2>
          <p className="text-gray-600">5-minute tales about human evolution</p>
        </div>

        {/* Audio Element (Hidden) */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 300)}
        />

        {/* Story Display */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
          <div className="text-6xl mb-4 text-center">🌙</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentStory.title}</h3>
          <p className="text-gray-700 mb-4">{currentStory.description}</p>
          <p className="text-sm text-purple-600 italic">Narrated in: {currentStory.narrator}</p>
        </div>

        {/* Progress Display */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-lg mb-4 text-xl transition-colors"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        {/* Story Selection Tabs */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-3">Choose a story:</p>
          <div className="grid grid-cols-2 gap-2">
            {STORIES.map((story, index) => (
              <button
                key={story.id}
                onClick={() => selectStory(index)}
                className={`text-xs py-2 px-3 rounded-lg font-semibold transition-colors ${
                  currentStoryIndex === index
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {story.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleComplete}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            ✅ Complete
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition-colors"
          >
            ✕ Close
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Relax and let these gentle stories drift you off to sleep...
        </p>
      </div>
    </div>
  )
}
