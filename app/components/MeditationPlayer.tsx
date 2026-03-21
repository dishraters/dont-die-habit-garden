'use client'

import { useState, useRef } from 'react'

interface MeditationPlayerProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function MeditationPlayer({ isOpen, onClose, onComplete }: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(300) // 5 minutes in seconds
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Simulated audio - in production, use real meditation audio
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
    onComplete()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = (currentTime / duration) * 100

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🧘 Meditation</h2>
          <p className="text-gray-600">5 min Nature Soundscape</p>
        </div>

        {/* Audio Element (Hidden) */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 300)}
        />

        {/* Player Display */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-8 mb-6 text-center">
          <div className="text-6xl mb-4">🌿</div>
          <p className="text-sm text-gray-600 mb-4">
            Listen to calming nature sounds: birds singing, water flowing, ambient wind
          </p>
          <p className="text-2xl font-bold text-blue-600">{formatTime(currentTime)}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-blue-500 transition-all"
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
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg mb-4 text-xl transition-colors"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        {/* Complete & Close Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onComplete}
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
      </div>
    </div>
  )
}
