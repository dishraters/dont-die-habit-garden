'use client'

export function HeartbeatIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-pulse ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  )
}

export function PulseGlow({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(236, 72, 153, 0.8);
          }
        }
        .glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>
      <div className="glow-pulse">{children}</div>
    </div>
  )
}

export function AnimatedProgressBar({ percentage, color = 'bg-pink-500' }: { percentage: number; color?: string }) {
  return (
    <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
      <style>{`
        @keyframes slide-in {
          0% {
            width: 0;
          }
        }
        .progress-fill {
          animation: slide-in 0.8s ease-out;
          height: 100%;
        }
      `}</style>
      <div
        className={`progress-fill ${color} transition-all duration-500`}
        style={{
          width: `${Math.min(percentage, 100)}%`,
        }}
      />
    </div>
  )
}

export function StreakFireIcon({ multiplier }: { multiplier: number }) {
  const getColor = (mult: number) => {
    if (mult >= 10) return 'text-purple-600'
    if (mult >= 5) return 'text-red-600'
    return 'text-orange-500'
  }

  return (
    <div className={`text-6xl ${getColor(multiplier)} animate-bounce`}>
      🔥
    </div>
  )
}

export function GoldenSeedIcon() {
  return (
    <style>{`
      @keyframes seed-glow {
        0%, 100% {
          filter: drop-shadow(0 0 2px rgba(217, 119, 6, 0.5));
        }
        50% {
          filter: drop-shadow(0 0 8px rgba(217, 119, 6, 0.9));
        }
      }
      .seed-glow {
        animation: seed-glow 2s ease-in-out infinite;
      }
    `}</style>
  )
}
