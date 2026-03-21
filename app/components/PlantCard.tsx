import { getPlantStage, PLANT_METADATA } from '@/lib/plantGraphics'

interface PlantCardProps {
  habitId: string
  habitName: string
  streak: number
  isCompleted: boolean
  onMarkComplete: () => void
  onOpenFeature?: () => void
}

export default function PlantCard({
  habitId,
  habitName,
  streak,
  isCompleted,
  onMarkComplete,
  onOpenFeature,
}: PlantCardProps) {
  const plantStage = getPlantStage(streak)
  const metadata = PLANT_METADATA[habitId as keyof typeof PLANT_METADATA]

  if (!metadata) return null

  // Progress bar to next milestone
  const milestones = [7, 30, 60, 365]
  const nextMilestone = milestones.find((m) => m > streak) || 365
  const previousMilestone = milestones.filter((m) => m <= streak).pop() || 0
  const progressToNext = ((streak - previousMilestone) / (nextMilestone - previousMilestone)) * 100

  return (
    <div
      className="rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        borderLeft: `4px solid ${metadata.color}`,
      }}
    >
      {/* Plant Emoji - Large (Clickable for Meditation/Movements/Stories) */}
      <div className="text-center mb-4 cursor-pointer" onClick={onOpenFeature}>
        <div className="text-6xl mb-2 transition-transform hover:scale-110">
          {plantStage.emoji}
        </div>
        <h3 className="font-bold text-lg text-gray-800">{metadata.plantName}</h3>
        <p className="text-sm text-gray-600">{plantStage.stage}</p>
      </div>

      {/* Habit Name */}
      <div className="mb-4 text-center">
        <h4 className="font-bold text-base text-gray-800">{habitName}</h4>
        <p className="text-xs text-gray-500">{metadata.description}</p>
      </div>

      {/* Streak Counter */}
      <div className="mb-4 text-center">
        <p className="text-lg font-bold">
          🔥 <span style={{ color: metadata.color }}>{streak}</span> day streak
        </p>
      </div>

      {/* Progress Bar to Next Milestone */}
      <div className="mb-4">
        <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${Math.min(progressToNext, 100)}%`,
              backgroundColor: metadata.color,
            }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1 text-center">
          {streak < 7 && `${7 - streak} days to Sprout`}
          {streak >= 7 && streak < 30 && `${30 - streak} days to Growing`}
          {streak >= 30 && streak < 60 && `${60 - streak} days to Thriving`}
          {streak >= 60 && streak < 365 && `${365 - streak} days to Legendary`}
          {streak >= 365 && '✨ Legendary!'}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onMarkComplete}
        disabled={isCompleted}
        className={`w-full py-3 rounded-lg font-bold transition-all ${
          isCompleted
            ? 'bg-green-500 text-white cursor-default'
            : `text-white hover:scale-105 active:scale-95`
        }`}
        style={{
          backgroundColor: isCompleted ? '#22c55e' : metadata.color,
        }}
      >
        {isCompleted ? '✅ Completed Today' : 'Mark Complete'}
      </button>
    </div>
  )
}
