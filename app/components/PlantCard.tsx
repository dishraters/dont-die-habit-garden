import { getPlantStage, PLANT_METADATA } from '@/lib/plantGraphics'

interface PlantCardProps {
  habitId: string
  habitName: string
  totalDDC: number
  streak: number
  isCompleted: boolean
  onMarkComplete: () => void
  onOpenFeature?: () => void
}

export default function PlantCard({
  habitId,
  habitName,
  totalDDC,
  streak,
  isCompleted,
  onMarkComplete,
  onOpenFeature,
}: PlantCardProps) {
  const plantStage = getPlantStage(totalDDC)
  const metadata = PLANT_METADATA[habitId as keyof typeof PLANT_METADATA]

  if (!metadata) return null

  // Progress bar to next cumulative token milestone
  const tokenMilestones = [100, 300, 700, 1200, 2000, 3500, 10000]
  const nextMilestone = tokenMilestones.find((m) => m > totalDDC) || 10000
  const previousMilestone = tokenMilestones.filter((m) => m <= totalDDC).pop() || 0
  const progressToNext = ((totalDDC - previousMilestone) / (nextMilestone - previousMilestone)) * 100

  return (
    <div
      className="rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        borderLeft: `4px solid ${metadata.color}`,
      }}
    >
      {/* Plant Emoji - Large (Clickable for Meditation/Movements/Stories) */}
      <div className="text-center mb-4 cursor-pointer hover:opacity-80 transition" onClick={onOpenFeature}>
        <div className="text-6xl mb-2 transition-transform hover:scale-110">
          {plantStage.emoji}
        </div>
        <h3 className="font-bold text-lg text-gray-800">{metadata.plantName}</h3>
        <p className="text-sm text-gray-600">{plantStage.label}</p>
      </div>

      {/* Habit Name */}
      <div className="mb-4 text-center">
        <h4 className="font-bold text-base text-gray-800">{habitName}</h4>
        <p className="text-xs text-gray-500">{metadata.description}</p>
      </div>

      {/* Token Counter */}
      <div className="mb-4 text-center">
        <p className="text-lg font-bold">
          💎 <span style={{ color: metadata.color }}>{totalDDC}</span> total tokens
        </p>
        <p className="text-xs text-gray-500">🔥 {streak} day streak</p>
      </div>

      {/* Progress Bar to Next Plant Stage */}
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
          {totalDDC < 100 && `${100 - totalDDC} tokens to 🌿 Sprout`}
          {totalDDC >= 100 && totalDDC < 300 && `${300 - totalDDC} tokens to 🌲 Young Tree`}
          {totalDDC >= 300 && totalDDC < 700 && `${700 - totalDDC} tokens to 🌳 Mature`}
          {totalDDC >= 700 && totalDDC < 1200 && `${1200 - totalDDC} tokens to 🌲✨ Thriving`}
          {totalDDC >= 1200 && totalDDC < 2000 && `${2000 - totalDDC} tokens to 🌴 Flourishing`}
          {totalDDC >= 2000 && totalDDC < 3500 && `${3500 - totalDDC} tokens to 🌳👑 Monument`}
          {totalDDC >= 3500 && '🌳👑 Monument achieved!'}
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
