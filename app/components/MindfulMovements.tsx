'use client'

import { useState } from 'react'

interface MindfulMovementsProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const YOGA_POSES = [
  {
    id: 1,
    name: 'Child Pose',
    emoji: '🙏',
    description: 'Relax your shoulders and mind. Hold for 30 seconds.',
    benefits: 'Calms the nervous system, reduces stress',
  },
  {
    id: 2,
    name: 'Cat-Cow Stretch',
    emoji: '🐱',
    description: 'Flow between cat and cow poses. 10-15 repetitions.',
    benefits: 'Increases spinal flexibility, warms up the body',
  },
  {
    id: 3,
    name: 'Forward Fold',
    emoji: '📖',
    description: 'Gently touch your toes or shins. Hold for 30 seconds.',
    benefits: 'Stretches hamstrings and back, relieves tension',
  },
  {
    id: 4,
    name: 'Neck Rolls',
    emoji: '🌀',
    description: 'Slowly roll your head in circles. 5 reps each direction.',
    benefits: 'Releases neck tension, improves mobility',
  },
  {
    id: 5,
    name: 'Shoulder Shrugs',
    emoji: '💪',
    description: 'Raise shoulders to ears, release. Do 10 repetitions.',
    benefits: 'Reduces shoulder tension, promotes relaxation',
  },
]

export default function MindfulMovements({ isOpen, onClose, onComplete }: MindfulMovementsProps) {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0)
  const [completedPoses, setCompletedPoses] = useState<number[]>([])

  const currentPose = YOGA_POSES[currentPoseIndex]
  const allCompleted = completedPoses.length === YOGA_POSES.length

  const handleMarkPoseComplete = () => {
    if (!completedPoses.includes(currentPoseIndex)) {
      setCompletedPoses([...completedPoses, currentPoseIndex])
    }
    if (currentPoseIndex < YOGA_POSES.length - 1) {
      setCurrentPoseIndex(currentPoseIndex + 1)
    }
  }

  const goToPose = (index: number) => {
    setCurrentPoseIndex(index)
  }

  const handleFinish = () => {
    if (allCompleted) {
      onComplete()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🧘 Mindful Movements</h2>
          <p className="text-gray-600">Gentle yoga & stretching before bed</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2 text-center">
            Pose {currentPoseIndex + 1} of {YOGA_POSES.length}
          </p>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${((currentPoseIndex + 1) / YOGA_POSES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Pose Display */}
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-8 mb-6 text-center">
          <div className="text-8xl mb-4">{currentPose.emoji}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentPose.name}</h3>
          <p className="text-gray-700 mb-4">{currentPose.description}</p>
          <p className="text-sm text-gray-600 italic">✨ {currentPose.benefits}</p>
        </div>

        {/* Pose Navigation Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {YOGA_POSES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPose(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentPoseIndex
                  ? 'bg-green-500 w-8'
                  : completedPoses.includes(index)
                    ? 'bg-green-300'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Mark Pose Complete Button */}
        <button
          onClick={handleMarkPoseComplete}
          disabled={completedPoses.includes(currentPoseIndex)}
          className={`w-full font-bold py-3 rounded-lg mb-4 transition-colors ${
            completedPoses.includes(currentPoseIndex)
              ? 'bg-gray-300 text-gray-600 cursor-default'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {completedPoses.includes(currentPoseIndex) ? '✅ Pose Complete' : '✓ Mark Pose Complete'}
        </button>

        {/* Finish Button (only when all poses done) */}
        {allCompleted && (
          <button
            onClick={handleFinish}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg mb-4 transition-colors"
          >
            🎉 All Done! Complete Habit
          </button>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPoseIndex(Math.max(0, currentPoseIndex - 1))}
            disabled={currentPoseIndex === 0}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-800 font-bold py-2 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={() => setCurrentPoseIndex(Math.min(YOGA_POSES.length - 1, currentPoseIndex + 1))}
            disabled={currentPoseIndex === YOGA_POSES.length - 1}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-800 font-bold py-2 rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-lg mt-3 transition-colors"
        >
          ✕ Close
        </button>
      </div>
    </div>
  )
}
