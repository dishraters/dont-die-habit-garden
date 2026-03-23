# DDHG Firebase Integration - Library Reference

## Files

### 1. `integrations.ts` (451 lines)
**Main Firebase integration layer combining all apps**

**Core Functions:**

#### Habit Completion
- `saveHabitCompletion(userId, habitId, habitType, notes?, time?)` - Save completion + auto reward DDC
- `getCompletionsForDate(userId, dateStr)` - Get all completions for a specific day
- `getCompletionHistory(userId, limitCount?)` - Get recent completions (default 30)
- `calculateStreak(userId, habitId)` - Calculate consecutive days for a habit

#### DDC Management
- `getDDCBalance(userId)` - Get current DDC balance
- `addDDC(userId, amount)` - Add DDC and record daily earnings
- `spendDDC(userId, amount)` - Spend DDC (fails if insufficient)
- `getDailyEarnings(userId)` - Get breakdown by day (last 30 days)

#### Growth Stage Syncing
- `subscribeToGrowthStageUpdates(userId, onUpdate)` - Listen for stage changes
- `syncToHabitGarden(userId, habitId, habitType)` - Auto-sync after completion
- `getGrowthStage(userId, habitId)` - Get current stage for one habit
- `getAllGrowthStages(userId)` - Get stages for all habits

**Firestore Collections:**
- `habitCompletions` - {userId}_{habitId}_{date}
- `ddc` - {userId}
- `growthStages` - {userId}_{habitId}

### 2. `habitFunctions.ts` (148 lines)
**Public API - replaces localStorage with Firestore calls**

All functions accept userId (from auth) and return Firebase-backed data.

**Main Entry Points:**
- `saveHabitCompletion_Legacy(userId, habitId, notes?, time?)` - Save a completion
- `loadUserHabits(userId)` - Get daily summary (completions, streaks, DDC, stages)
- `getHabitStreak(userId, habitId)` - Streak for one habit
- `getDDCBalance_Legacy(userId)` - Current balance
- `addDDC_Legacy(userId, amount)` - Add DDC
- `spendDDC_Legacy(userId, amount)` - Spend DDC
- `getCompletionHistory_Legacy(userId, limit?)` - Recent completions
- `wasCompletedToday(userId, habitId)` - Check if done today
- `getHabitGrowthStage(userId, habitId)` - Stage for one habit
- `getAllHabitGrowthStages(userId)` - All stages

### 3. `../INTEGRATION_PLAN.md`
**Complete integration documentation**

- Architecture overview and data flow
- Firestore collection schemas with indexes
- Growth stage mapping (0-6 levels)
- DDC reward structure (30-50 per habit)
- Integration points for each component
- Migration path (localStorage → Firestore)
- Security rules template
- Performance optimizations
- Monitoring & alerts
- Cost estimation
- Testing checklist

## Quick Start

### 1. In a Component (e.g., HabitEntryModal)
```typescript
import { saveHabitCompletion_Legacy, loadUserHabits } from '@/lib/habitFunctions'

async function handleComplete(habitId: string) {
  const userId = auth.currentUser?.uid!
  
  // Save with optional notes
  await saveHabitCompletion_Legacy(userId, habitId, 'Felt great today')
  
  // DDC is automatically added (50 for exercise, 30 for meals, etc.)
  
  // Reload data to show updated streak/balance
  const habits = await loadUserHabits(userId)
  setStreaks(habits.streaks)
  setDDC(habits.totalDDC)
}
```

### 2. Display Current Status
```typescript
import { getHabitGrowthStage, getHabitStreak } from '@/lib/habitFunctions'

async function loadHabitStatus(userId: string, habitId: string) {
  const stage = await getHabitGrowthStage(userId, habitId)  // 0-6
  const streak = await getHabitStreak(userId, habitId)      // days
  
  // Display visual based on stage (seed → legendary)
  // Show streak count under habit name
}
```

### 3. Show DDC Balance
```typescript
import { getDDCBalance_Legacy } from '@/lib/habitFunctions'

async function showBalance(userId: string) {
  const balance = await getDDCBalance_Legacy(userId)
  setDDCDisplay(balance)
}
```

### 4. Spend DDC
```typescript
import { spendDDC_Legacy, getDDCBalance_Legacy } from '@/lib/habitFunctions'

async function buyReward(userId: string, cost: number) {
  const balance = await getDDCBalance_Legacy(userId)
  
  if (balance < cost) {
    showError('Not enough DDC!')
    return
  }
  
  const success = await spendDDC_Legacy(userId, cost)
  if (success) {
    showSuccess('Reward unlocked!')
  }
}
```

## Data Types

```typescript
// Individual completion record
HabitCompletion {
  userId: string
  habitId: "training" | "breakfast" | "lunch" | "dinner" | "gratitude" | etc.
  habitType: "exercise" | "meal" | "planning" | "gratitude" | "meditation"
  completedAt: ISO timestamp string
  notes?: string
  time?: string
  ddeReward: number (50, 30, 40, 25, or 35)
}

// User's daily summary
UserHabits {
  completedToday: string[]           // ["training", "breakfast"]
  streaks: { [habitId]: number }     // {"training": 14, "breakfast": 7}
  totalDDC: number                   // 2345
  growthStages: GrowthStageUpdate[]  // [{ habitId: "training", stageLevel: 3 }]
}

// Growth stage record
GrowthStageUpdate {
  userId: string
  habitId: string
  stageLevel: number         // 0=seed, 1=sprout, ..., 6=legendary
  streakCount: number        // Current consecutive days
  lastUpdated: ISO timestamp
}
```

## Growth Stages

| Level | Name | Streak | Plant Visual |
|-------|------|--------|--------------|
| 0 | Seed | 0 days | 🌱 |
| 1 | Sprout | 1-3 | 🌿 |
| 2 | Growing | 4-7 | 🌱 (taller) |
| 3 | Blooming | 8-14 | 🌻 |
| 4 | Flourishing | 15-30 | 🌺 |
| 5 | Thriving | 31-100 | 🌳 |
| 6 | Legendary | 100+ | ✨ |

## DDC Rewards Per Completion

- Training/Exercise: **50 DDC**
- Breakfast/Lunch/Dinner: **30 DDC** each
- Planning: **40 DDC**
- Gratitude: **25 DDC**
- Meditation/Sleeptime Stories: **35 DDC**

**Daily max:** ~155 DDC (all habits) / **Weekly:** ~1,085 DDC

## Security

All functions automatically validate `userId` against Firestore auth. See INTEGRATION_PLAN.md for security rules.

## Troubleshooting

### "Cannot save completion"
- Check user is authenticated (`auth.currentUser`)
- Verify Firestore database initialized (`db` imported from firebase.ts)
- Check browser console for detailed error

### Streak not updating
- Completion must be saved via `saveHabitCompletion_Legacy()` or `integrations.saveHabitCompletion()`
- Refresh page to reload from Firestore
- Check Firestore Console for `habitCompletions` collection

### DDC not adding up
- Each habit type has specific reward (see table above)
- DDC added automatically on completion
- Check `ddc` collection for user record

## Next Steps

1. **Migrate components** to use `habitFunctions.ts` (non-breaking change)
2. **Test in staging** - complete a full day of habits
3. **Monitor Firestore** - watch read/write costs
4. **Archive old data** - completions >1 year old
5. **Add caching** - `loadUserHabits()` results cached 5 minutes

See INTEGRATION_PLAN.md Phase 1-4 for full migration timeline.
