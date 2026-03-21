# DDHG Launch Plan — Monday, March 24, 5 PM Meeting

**Status:** Ready for implementation  
**Date:** March 21, 2026  
**Meeting:** Monday 5 PM (Google Calendar: "DDHG Integration Setup")

---

## What DDHG Does (Final Architecture)

DDHG is a **unified wellness dashboard** that pulls habit data from 3 existing apps and adds 6 simple built-in habits.

### **3 External Apps (Via Webhook)**

Users log habits in their preferred app. DDHG receives data + awards tokens.

#### 1. **Habit Garden → Planning + Gratitude**

**Planning (📋)**
- User: Creates daily plan in Habit Garden (not DDHG)
- Action: Saves 3+ big wins
- Webhook to DDHG: `planDate`, `big_wins[]`
- Token: +2 base, +12 (7-day), +30 (30-day)

**Gratitude (🙏)**
- User: Logs gratitude entry in Habit Garden (not DDHG)
- Action: Enters 3 grateful items + affirmation
- Webhook to DDHG: `entryDate`, `grateful_1`, `grateful_2`, `grateful_3`
- Token: +2 base, +12 (7-day), +30 (30-day)

#### 2. **Dishrated → Meals (3 Habits)**

**Breakfast (🍳)**
- User: Logs meal in Dishrated
- Action: Logs meal, health_score ≥ 5
- Webhook to DDHG: `mealType="breakfast"`, `health_score`
- Token: +1 base, +8 (7-day), +20 (30-day)

**Lunch (🥗)**
- User: Logs meal in Dishrated
- Action: Logs meal, health_score ≥ 5
- Webhook to DDHG: `mealType="lunch"`, `health_score`
- Token: +1 base, +8 (7-day), +20 (30-day)

**Dinner (🍽️)**
- User: Logs meal in Dishrated
- Action: Logs meal, health_score ≥ 5
- Webhook to DDHG: `mealType="dinner"`, `health_score`
- Token: +1 base, +8 (7-day), +20 (30-day)

#### 3. **TrainLog → Exercise**

**Exercise (💪)**
- User: Logs workout in TrainLog
- Action: 20+ minutes OR 5+ intensity points
- Webhook to DDHG: `exerciseName`, `duration`
- Token: +3 base, +15 (7-day), +40 (30-day)

### **6 Simple Built-In Habits (DDHG Native)**

Simple forms in DDHG. No external app needed.

#### 4. **Meditation (🧘)**
- Form: 5-minute timer ("Start Meditation")
- Requirement: Complete full 5 minutes
- Storage: Firestore `ddhg_habits`
- Token: +2 base, +10 (7-day), +25 (30-day)

#### 5. **Sleep (🌙)**
- Form: Simple input ("How many hours did you sleep?")
- Requirement: 7+ hours
- Storage: Firestore `ddhg_habits`
- Token: +2 base, +10 (7-day), +25 (30-day)

#### 6. **Stretching (🤸)**
- Form: Simple input ("Minutes of stretching/yoga?")
- Requirement: 10+ minutes
- Storage: Firestore `ddhg_habits`
- Token: +2 base, +10 (7-day), +25 (30-day)

#### 7-9. **3 More Simple Habits (TBD)**
- Each has minimal form (duration, yes/no, or simple input)
- Examples: Vitamins, Cold shower, Journaling, etc.
- Storage: Firestore

---

## Implementation Checklist (Monday)

### Phase 1: Webhooks (2-3 hours)

- [ ] **Habit Garden → DDHG**
  - [ ] Add webhook call in planning/page.tsx (after saveDailyPlan)
  - [ ] Webhook: POST https://ddhg.vercel.app/api/webhooks/planning-complete
  - [ ] Payload: `{ userId, planDate, big_wins[] }`
  - [ ] Add webhook call in gratitude/page.tsx (after saveGratitudeEntry)
  - [ ] Webhook: POST https://ddhg.vercel.app/api/webhooks/gratitude-complete
  - [ ] Payload: `{ userId, entryDate, grateful_1, grateful_2, grateful_3 }`

- [ ] **Dishrated → DDHG**
  - [ ] Add webhook call in add/page.tsx (after meal saved to Supabase)
  - [ ] Webhook: POST https://ddhg.vercel.app/api/webhooks/meal-logged
  - [ ] Payload: `{ userId, mealType, mealName, health_score }`

- [ ] **TrainLog → DDHG**
  - [ ] Add webhook call in index.html (after exercise logged)
  - [ ] Webhook: POST https://ddhg.vercel.app/api/webhooks/exercise-complete
  - [ ] Payload: `{ userId, exerciseName, duration }`

### Phase 2: DDHG Built-In Habits (2-3 hours)

- [ ] **Meditation Timer Component**
  - [ ] Create `app/components/MeditationTimer.tsx`
  - [ ] 5-minute countdown timer
  - [ ] On complete: Call `saveHabitCompletion(userId, 'meditation')`

- [ ] **Sleep Logger Component**
  - [ ] Create `app/components/SleepLogger.tsx`
  - [ ] Input: "Hours slept?" (number input)
  - [ ] Validate: ≥ 7 hours
  - [ ] On submit: Call `saveHabitCompletion(userId, 'sleep')`

- [ ] **Stretching Logger Component**
  - [ ] Create `app/components/StretchingLogger.tsx`
  - [ ] Input: "Minutes of stretching?" (number input)
  - [ ] Validate: ≥ 10 minutes
  - [ ] On submit: Call `saveHabitCompletion(userId, 'stretching')`

### Phase 3: Dashboard (2-3 hours)

- [ ] **Habit Progress Ring**
  - [ ] Show all 9 habits
  - [ ] Checkmark if completed today
  - [ ] Tap to open logger/form

- [ ] **Token Counter**
  - [ ] Display today's tokens earned
  - [ ] Display total tokens

- [ ] **Plant Growth Display**
  - [ ] Show current growth stage (0-6)
  - [ ] Show streak counter

- [ ] **Completion List**
  - [ ] Show recent completions (Exercise at 6 AM, Breakfast at 7 AM, etc.)

### Phase 4: Deployment (1 hour)

- [ ] Google OAuth setup (separate client for DDHG)
- [ ] Deploy to Vercel (DDHG)
- [ ] Deploy to Vercel (Habit Garden with webhooks)
- [ ] Deploy to Vercel (Dishrated with webhooks)
- [ ] Deploy to Vercel (TrainLog with webhooks)
- [ ] Test end-to-end: Log exercise → plant grows → token awarded

---

## Firestore Schema (Already Built)

### Collections

**ddhg_users**
```json
{
  "userId": "firebase_uid",
  "totalTokens": 47,
  "plantGrowthStage": 2,
  "plantStreak": 5,
  "habitStreaks": {
    "meditation": 3,
    "exercise": 2,
    "breakfast": 5,
    "lunch": 5,
    "dinner": 5,
    "planning": 4,
    "gratitude": 3,
    "sleep": 2,
    "stretching": 1
  },
  "todayCompletedHabits": ["exercise", "breakfast", "lunch"],
  "todayTokens": 8,
  "created_at": "2026-03-21T19:00:00Z",
  "updated_at": "2026-03-21T19:00:00Z"
}
```

**ddhg_completions**
```json
{
  "userId": "firebase_uid",
  "habitId": "exercise",
  "habitName": "Exercise",
  "source": "trainlog",
  "completedAt": "2026-03-21T06:30:00Z",
  "ddcEarned": 3,
  "streakIncremented": true,
  "growthStageIncremented": false,
  "mileachieved": null,
  "notes": "5K run, 30 min",
  "created_at": "2026-03-21T06:30:00Z"
}
```

---

## Success Criteria (Monday Evening)

✅ **DDHG is live at:** https://ddhg.vercel.app

✅ **Users can:**
- Sign in with Google OAuth
- See all 9 habits on dashboard
- Log meditation (timer)
- Log sleep (form)
- Log stretching (form)
- See today's token count
- See plant growth stage
- See completed habits from today

✅ **Webhooks working:**
- Habit Garden → DDHG planning completion triggers token
- Habit Garden → DDHG gratitude completion triggers token
- Dishrated → DDHG meal completion triggers token
- TrainLog → DDHG exercise completion triggers token

✅ **Test Scenario:**
1. User logs 5K run in TrainLog
2. Webhook fires to DDHG
3. DDHG records completion + awards +3 tokens
4. DDHG dashboard updates (exercise ✅, +3 tokens, streak increments)
5. Plant grows if first completion of day

---

## Files Ready for Development

✅ **PRD.md** (15KB) — Complete product vision
✅ **HABITS_SPEC.md** (13.8KB) — 9-habit system with token mechanics
✅ **INTEGRATION.md** (4.6KB) — Webhook payload specs
✅ **firestoreIntegration.ts** (5.8KB) — Core Firestore layer
✅ **habitFunctions.ts** (3.5KB) — Public API
✅ **app/api/webhooks/route.ts** (3.9KB) — Webhook endpoints

All code committed to GitHub. Ready to pull into implementation.

---

## Questions for Monday

1. **What should the other 3 simple habits be?** (beyond meditation, sleep, stretching)
   - Examples: Vitamins, cold shower, journaling, reading, stretching, hydration
   - Your choice what fits your wellness model

2. **Plant visualization:** Do we use Habit Garden's plant code, or simple CSS animation for MVP?

3. **Token spending:** Should tokens unlock features immediately, or just accumulate for now?

---

**Document Owner:** Nancy (Chief Product Officer)  
**Status:** APPROVED FOR MONDAY IMPLEMENTATION  
**Meeting Time:** Monday, March 24 @ 5 PM EST  
**Duration:** 1 hour walkthrough + live testing
