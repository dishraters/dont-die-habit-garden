# DDHG Firebase Integration Plan

## Overview

This document outlines the Firebase integration layer for Don't Die Habit Garden (DDHG), which combines habit tracking data from multiple apps:
- **Habit Garden** - Growth stages and long-term progression
- **TrainLog** - Exercise completions
- **Dishrated** - Meal tracking completions
- **Planning** - Daily planning completions
- **Gratitude** - Gratitude entries

## Architecture

### Data Flow

```
Component (e.g., HabitEntryModal)
        ↓
saveHabitCompletion(habitId, type)
        ↓
integrations.ts (main layer)
├─ Save to habitCompletions collection
├─ Calculate DDC reward
├─ Update DDC balance
└─ Sync growth stage to Habit Garden
```

### Firestore Collections

#### 1. `habitCompletions` - Tracking all habit completions
```typescript
Collection: habitCompletions
Document ID: {userId}_{habitId}_{date}

Structure:
{
  userId: string
  habitId: string                              // "training", "breakfast", "gratitude", etc.
  habitType: "exercise" | "meal" | "planning" | "gratitude" | "meditation"
  completedAt: string                          // ISO timestamp
  notes?: string                               // Optional user notes
  time?: string                                // Optional completion time
  ddeReward: number                            // DDC earned (50, 30, 40, 25, 35)
}

Indexes:
- (userId, completedAt, desc) - For history queries
- (userId, habitId, completedAt, desc) - For streak calculation
```

#### 2. `ddc` - DDC (Daily Discipline Currency) balances
```typescript
Collection: ddc
Document ID: {userId}

Structure:
{
  userId: string
  totalDDC: number                             // Current balance
  lastUpdated: serverTimestamp()               // Last transaction
  dailyEarnings: {
    "2025-03-21": 75,                         // Date -> DDC earned that day
    "2025-03-20": 105,
    ...
  }
}

Indexes:
- (userId) - Primary lookup
```

#### 3. `growthStages` - Synced growth progression from Habit Garden
```typescript
Collection: growthStages
Document ID: {userId}_{habitId}

Structure:
{
  userId: string
  habitId: string
  stageLevel: number                           // 0-6 (seed to legendary)
  streakCount: number                          // Days in current streak
  lastUpdated: serverTimestamp()               // Last update from DDHG
}

Indexes:
- (userId, lastUpdated, desc) - For history queries
```

## Growth Stage Mapping

Stages are calculated based on consecutive days of habit completion:

| Stage | Name | Streak Days | Description |
|-------|------|-------------|-------------|
| 0 | Seed | 0 | Not started yet |
| 1 | Sprout | 1-3 | Just beginning |
| 2 | Growing | 4-7 | Making progress |
| 3 | Blooming | 8-14 | Momentum building |
| 4 | Flourishing | 15-30 | Strong habit |
| 5 | Thriving | 31-100 | Very strong |
| 6 | Legendary | 100+ | Unstoppable |

## DDC Reward Structure

| Habit Type | DDC Reward | Rationale |
|-----------|-----------|-----------|
| Exercise | 50 | High difficulty, physical challenge |
| Meal Tracking | 30 | Moderate, consistency focused |
| Planning | 40 | High value, strategic |
| Gratitude | 25 | Foundational habit |
| Meditation | 35 | Moderate-high, mental discipline |

**Daily Maximum:** ~155 DDC (if all habits completed)
**Weekly Maximum:** ~1,085 DDC
**Monthly Average:** ~4,340 DDC

## Integration Points

### 1. HabitEntryModal Component
When user completes a habit:
```typescript
import { saveHabitCompletion } from '@/lib/habitFunctions'

async function handleComplete() {
  await saveHabitCompletion(userId, habitId, notes, time)
  // Component automatically shows DDC earned
  // Streak updates appear on next data fetch
}
```

### 2. PlantCard Component
Display current data:
```typescript
import { getHabitGrowthStage, getHabitStreak } from '@/lib/habitFunctions'

const stage = await getHabitGrowthStage(userId, habitId)
const streak = await getHabitStreak(userId, habitId)
// Display visual based on stage (0-6)
// Show streak count below habit
```

### 3. DDC Balance Widget
Track currency:
```typescript
import { getDDCBalance_Legacy } from '@/lib/habitFunctions'

const balance = await getDDCBalance_Legacy(userId)
// Display prominent balance counter
// Update after each completion
```

### 4. Daily Dashboard
Show completions and earnings:
```typescript
import { loadUserHabits } from '@/lib/habitFunctions'

const habits = await loadUserHabits(userId)
// habits.completedToday - which habits done today
// habits.streaks - all current streaks
// habits.totalDDC - current balance
// habits.growthStages - all plant stages
```

### 5. History / Analytics
Track progress over time:
```typescript
import { getCompletionHistory_Legacy, getDailyEarnings } from '@/lib/integrations'

const history = await getCompletionHistory_Legacy(userId, 90)  // Last 90 completions
const earnings = await getDailyEarnings(userId)  // Daily breakdown
// Show graphs, heat maps, trends
```

## Migration Path (From localStorage to Firestore)

### Phase 1: Dual Write (Week 1)
- Keep localStorage as primary
- Write to Firestore on every completion
- Allow Firestore reads to fail gracefully

### Phase 2: Dual Read (Week 2)
- Read from Firestore primary
- Fall back to localStorage on error
- Log read mismatches

### Phase 3: Firestore Primary (Week 3)
- All reads from Firestore
- Remove localStorage fallback
- Clean up legacy code

### Phase 4: Complete Cutover (Week 4)
- Remove localStorage entirely
- Monitor Firestore performance
- Optimize queries based on usage

## Security Considerations

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /habitCompletions/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    match /ddc/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /growthStages/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### Authentication
- All functions require valid Firebase Auth session
- `userId` pulled from `auth.currentUser?.uid`
- Server-side validation on backend functions (if needed)

## Performance Optimizations

### Indexing Strategy
- Composite indexes on frequently queried fields
- Monthly archive of old completions (>1 year)
- Batch queries where possible

### Query Patterns
```typescript
// Efficient: single date query
getCompletionsForDate(userId, today)  // Hits: userId + completedAt

// Efficient: recent history
getCompletionHistory(userId, 30)  // Hits: userId + orderBy

// Less efficient: streak calculation
calculateStreak(userId, habitId)  // Fetches up to 365 docs
// Mitigation: Cache streaks in growthStages collection
```

### Caching
- Cache `loadUserHabits()` for 5 minutes
- Invalidate on completion
- Use local state for UI responsiveness

## Monitoring & Alerts

### Key Metrics
- Daily active users (DAU) completing habits
- Average DDC earned per user per day
- Streak distribution (what % at each stage)
- Firestore read/write costs

### Alerts
- Read cost > $5/day (potential abuse)
- Write errors increasing (data sync issues)
- Completions dropping >20% (engagement issue)

## Testing Checklist

- [ ] Save habit completion → verify Firestore doc created
- [ ] Verify DDC reward calculated correctly
- [ ] Calculate streak → matches local calculation
- [ ] Get growth stage → returns correct level
- [ ] Load user habits → all data present and current
- [ ] Completion shows in daily earnings
- [ ] Multiple completions same day → both logged
- [ ] 100-day streak → reaches legendary stage
- [ ] DDC spend → correctly reduces balance
- [ ] Offline → graceful fallback

## Future Enhancements

1. **Real-time Syncing** - Use `onSnapshot()` for live updates
2. **Habit Sharing** - Share streaks/progress with accountability partners
3. **DDC Marketplace** - Spend DDC on rewards/features
4. **Weekly Challenges** - Bonus DDC for completing all habits
5. **Social Leaderboards** - Compete with friends (privacy-controlled)
6. **AI Coaching** - Smart reminders based on completion patterns
7. **Export Data** - JSON/CSV exports for analysis
8. **Webhook Integration** - POST completions to external apps (IFTTT, Zapier)

## Cost Estimation (Monthly)

Assuming 100 active users, 2 completions/day average:

- **Reads:** ~6,000/day × 30 = 180,000 reads = ~$0.90
- **Writes:** ~200/day × 30 = 6,000 writes = ~$3.00
- **Storage:** ~100 users × 50KB = 5MB @ ~$0.18/GB/month ≈ $0.00
- **Total:** ~$3.90/month

## References

- [Habit Garden firestore.ts](../../habit-garden/src/lib/firestore.ts) - Patterns for setDoc, merge:true
- [DDHG habitFunctions.ts](./lib/habitFunctions.ts) - Original localStorage functions
- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)

---

**Status:** Ready for Phase 1 implementation
**Last Updated:** 2025-03-21
**Owner:** DDHG Team
