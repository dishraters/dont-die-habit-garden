# DDHG Integration Guide

## Overview

Don't Die Habit Garden (DDHG) now integrates with:
- **Habit Garden** - Core habit tracking
- **Dishrated** - Meal logging (Breakfast, Lunch, Dinner)
- **TrainLog** - Exercise tracking
- **Planning** - Daily planning completion
- **Gratitude** - Gratitude entries

## How It Works

1. **User completes an activity** in any app (exercise, meal, plan, gratitude)
2. **App sends webhook** to DDHG with completion data
3. **DDHG records completion** in Firestore
4. **Plant grows + DDC earned** based on streaks and milestones

### Reward System

- **Base:** +1 DDC per completion
- **3-day streak:** +10 DDC total
- **7-day streak:** +20 DDC total
- **30-day streak:** +50 DDC total

### Plant Growth

Growth stages (0-6) based on streak count:
- Stage 0 (Seed): 0 days
- Stage 1 (Rooted): 1 day
- Stage 2 (Sprout): 2 days
- Stage 3 (Leafing): 4 days
- Stage 4 (Budding): 7 days
- Stage 5 (Blooming): 11 days
- Stage 6 (Flourishing): 16+ days

## Webhook Endpoints

### TrainLog Exercise Complete
```
POST https://ddhg.vercel.app/api/webhooks/exercise-complete

{
  "userId": "user123",
  "exerciseName": "Running",
  "duration": 30,
  "notes": "5K run in the park"
}
```

**Response:**
```json
{
  "success": true,
  "event": { /* completion details */ },
  "message": "✅ Exercise logged: Running → plant grew!"
}
```

### Dishrated Meal Logged
```
POST https://ddhg.vercel.app/api/webhooks/meal-logged

{
  "userId": "user123",
  "mealType": "breakfast",
  "mealName": "Eggs and Toast",
  "notes": "Healthy start"
}
```

**Meal Types:** `breakfast`, `lunch`, `dinner`, `snack`

### Habit Garden Planning Complete
```
POST https://ddhg.vercel.app/api/webhooks/planning-complete

{
  "userId": "user123",
  "planDate": "2026-03-23",
  "planId": "plan123"
}
```

### Habit Garden Gratitude Complete
```
POST https://ddhg.vercel.app/api/webhooks/gratitude-complete

{
  "userId": "user123",
  "entryDate": "2026-03-23",
  "grateful1": "Family",
  "grateful2": "Health",
  "grateful3": "Growth"
}
```

## Data Structure

### DDHG User (Firestore: `ddhg_users`)
```typescript
{
  userId: string
  totalDDC: number
  plantGrowthStage: number
  streakCount: number
  lastCompletedAt?: string
  habits: string[]
  created_at: Timestamp
  updated_at: Timestamp
}
```

### Completion Event (Firestore: `ddhg_completions`)
```typescript
{
  userId: string
  habitId: string
  habitName: string
  source: 'habit-garden' | 'dishrated' | 'trainlog' | 'planning' | 'gratitude'
  completedAt: string (ISO)
  ddcEarned: number
  streakIncremented: boolean
  growthStageIncremented: boolean
  mileachieved?: '3day' | '7day' | '30day'
  notes?: string
  created_at: Timestamp
}
```

## Implementation Checklist

### DDHG Setup (✅ Done)
- [x] Firestore integration (`firestoreIntegration.ts`)
- [x] Webhook handler (`app/api/webhooks/route.ts`)
- [x] Habit functions updated to use Firestore
- [ ] Google OAuth configured (separate client ID)
- [ ] Plant growth visualization
- [ ] DDC display + spending

### Habit Garden Integration
- [ ] Add webhook call after habit completion
- [ ] Send to `ddhg.vercel.app/api/webhooks/planning-complete`
- [ ] Send to `ddhg.vercel.app/api/webhooks/gratitude-complete`

### Dishrated Integration
- [ ] Add webhook call after meal logged
- [ ] Send to `ddhg.vercel.app/api/webhooks/meal-logged`

### TrainLog Integration
- [ ] Add webhook call after exercise logged
- [ ] Send to `ddhg.vercel.app/api/webhooks/exercise-complete`

## Testing

### Local Testing
```bash
# Start DDHG locally
cd dont-die-habit-garden
npm run dev

# Test webhook (example)
curl -X POST http://localhost:3000/api/webhooks/exercise-complete \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "exerciseName": "Running",
    "duration": 30
  }'
```

### Manual Test Flow
1. Create account in DDHG
2. Log an exercise in TrainLog
3. Check Firestore: `ddhg_completions` should have new entry
4. Check Firestore: `ddhg_users.totalDDC` should increase
5. Check DDHG UI: plant should grow, DDC should display

## Environment Variables

Already configured:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Still needed:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=... (OAuth for sign-in)
```

## Notes

- Streak logic: User-wide streak (all habits count together)
- Can modify to per-habit streaks if needed
- Webhooks should use auth tokens for security (add later)
- Consider rate limiting on webhook endpoints
