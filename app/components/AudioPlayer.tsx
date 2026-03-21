'use client'

import { useState, useRef, useEffect } from 'react'

interface Track {
  id: string
  title: string
  duration: string
  emoji: string
  src: string
}

const MEDITATION_TRACKS: Track[] = [
  { id: 'med-5', title: 'Morning Calm', duration: '5 min', emoji: '🧘', src: '/audio/meditation-5min.mp3' },
  { id: 'med-10', title: 'Deep Focus', duration: '10 min', emoji: '🌊', src: '/audio/meditation-10min.mp3' },
  { id: 'med-15', title: 'Body Scan', duration: '15 min', emoji: '✨', src: '/audio/meditation-15min.mp3' },
]

const SLEEP_TRACKS: Track[] = [
  { id: 'sleep-1', title: 'Forest Dreams', duration: '20 min', emoji: '🌲', src: '/audio/sleep-forest.mp3' },
  { id: 'sleep-2', title: 'Ocean Waves', duration: '25 min', emoji: '🌊', src: '/audio/sleep-ocean.mp3' },
  { id: 'sleep-3', title: 'Starlight Journey', duration: '30 min', emoji: '⭐', src: '/audio/sleep-stars.mp3' },
  { id: 'sleep-4', title: 'Rainy Garden', duration: '20 min', emoji: '🌧️', src: '/audio/sleep-rain.mp3' },
  { id: 'sleep-5', title: 'Moonlight Valley', duration: '35 min', emoji: '🌙', src: '/audio/sleep-moon.mp3' },
]

interface AudioPlayerProps {
  mode: 'meditation' | 'sleep'
  onComplete: () => void
  onClose: () => void
}

export default function AudioPlayer({ mode, onComplete, onClose }: AudioPlayerProps) {
  const tracks = mode === 'meditation' ? MEDITATION_TRACKS : SLEEP_TRACKS
  const [selectedTrack, setSelectedTrack] = useState<Track>(tracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasCompleted, setHasCompleted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [selectedTrack])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => {
        // Audio file not found in dev - simulate playback
        setIsPlaying(true)
        simulatePlayback()
      })
      setIsPlaying(true)
    }
  }

  // Simulate playback when actual audio file not available
  const simulatePlayback = () => {
    const fakeDuration = 30 // 30 second simulation
    setDuration(fakeDuration)
    let t = currentTime
    const interval = setInterval(() => {
      t += 1
      setCurrentTime(t)
      if (t >= fakeDuration) {
        clearInterval(interval)
        setIsPlaying(false)
        handleTrackEnd()
      }
    }, 1000)
  }

  const handleTrackEnd = () => {
    setIsPlaying(false)
    if (!hasCompleted) {
      setHasCompleted(true)
      onComplete()
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const color = mode === 'meditation' ? '#60a5fa' : '#ec4899'
  const title = mode === 'meditation' ? '🧘 Meditation' : '🌙 Sleeptime Stories'

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666', padding: '0' }}>✕</button>
        </div>

        {/* Track List */}
        <div style={{ marginBottom: '1.25rem' }}>
          {tracks.map(track => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                borderRadius: '8px',
                border: `2px solid ${selectedTrack.id === track.id ? color : '#e5e7eb'}`,
                background: selectedTrack.id === track.id ? `${color}15` : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>{track.emoji}</span>
              <div>
                <div style={{ fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>{track.title}</div>
                <div style={{ color: '#888', fontSize: '0.75rem' }}>{track.duration}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Player Controls */}
        <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.75rem', fontWeight: '600', color: '#333' }}>
            {selectedTrack.emoji} {selectedTrack.title}
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              style={{ width: '100%', accentColor: color }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{duration ? formatTime(duration) : selectedTrack.duration}</span>
            </div>
          </div>

          {/* Play/Pause */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={togglePlay}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: color,
                color: 'white',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>

        {hasCompleted && (
          <div style={{ marginTop: '1rem', background: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontWeight: '600' }}>
            ✅ Session complete! Habit marked done.
          </div>
        )}

        <audio
          ref={audioRef}
          src={selectedTrack.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleTrackEnd}
        />
      </div>
    </div>
  )
}
