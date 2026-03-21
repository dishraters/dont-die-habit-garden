# Don't Die Habit Garden (DDHG) — Product Requirements Document

**Document Version:** 1.0  
**Date:** March 21, 2026  
**Status:** APPROVED FOR DEVELOPMENT  
**Product Owner:** Sam Monac  
**Chief Product Officer:** Nancy  

---

## Executive Summary

**Don't Die Habit Garden** is a unified habit tracking ecosystem that transforms habit completion into living, growing plants. It unifies data across 5 interconnected applications—Habit Garden, TrainLog, Dishrated, Planning, and Gratitude—into a single, beautifully gamified experience where every action across your entire fitness, nutrition, and personal development ecosystem makes your virtual plant grow.

**Core Mission:** Help users see the interconnected power of their daily habits by visualizing how exercise, meals, plans, and gratitude all feed the growth of a single, living thing they care about.

**Target User:** Ambitious individuals who struggle with habit consistency and benefit from visual, emotional feedback. People who track fitness, nutrition, planning, and gratitude separately but need to see the whole picture.

**Success Metric:** Users keep plants alive for 30+ days → 80% of cohort by Month 3.

---

## The Problem

### Today's Fragmented Reality

Users maintain separate habit-tracking habits across multiple apps:
- **TrainLog** for exercises (isolated)
- **Dishrated** for meals (isolated)
- **Habit Garden** for planning/gratitude (isolated)

**The Friction:**
- Each app shows only partial progress
- No unified view of daily consistency
- Hard to see correlations (e.g., "I exercised, ate well, AND planned → why don't I feel it?")
- Motivation fades when progress is scattered

### The Psychological Gap

Humans need:
1. **Unified feedback** — One clear signal for all efforts
2. **Emotional attachment** — Something alive that depends on them
3. **Visible growth** — Stages, progress, not just metrics
4. **Streak incentive** — Small wins compound into big ones

Current apps treat habits as tasks. DDHG treats them as nurturing a living thing.

---

## The Solution: Don't Die Habit Garden

### Core Concept

Users have **one plant**. Every habit completion (exercise, meal, plan, gratitude) adds water to it. The plant grows through 7 visible stages based on cumulative streak.

- **No plant = no excuses.** If your plant wilts, it's visible, emotional, and fixable.
- **One plant = all habits matter equally.** A 30-day exercise streak and a 30-day gratitude streak both unlock the same growth stage.
- **Gamification with stakes.** Not fake points. Real plants that die if neglected.

### Key Insight

Instead of asking "Did I do my habit today?", users ask:

> "What does my plant need today?"

This psychological shift is everything.

---

## Product Features

### 1. The Unified Plant

**Visual Growth Stages (0-6)**

| Stage | Name | Streak | Visual | Feeling |
|-------|------|--------|--------|---------|
| 0 | Seed | 0 days | Tiny dot | "Potential" |
| 1 | Rooted | 1 day | Small sprout | "Starting" |
| 2 | Sprout | 2 days | Visible growth | "Building" |
| 3 | Leafing | 4 days | Full leaves | "Consistency" |
| 4 | Budding | 7 days | First flowers | "Momentum" |
| 5 | Blooming | 11 days | Full bloom | "Power" |
| 6 | Flourishing | 16+ days | Lush, alive | "Mastery" |

**Plant Mechanics:**
- Plant grows based on **user-wide streak** (all habits count together)
- **One completion per day per habit** = +1 to streak
- **Streak persists** across app boundaries (Habit Garden → TrainLog → Dishrated → all feed the same plant)
- **Plant wilts** after 2 missed days (automatic reset)
- **Plant dies** after 7 missed days (unrecoverable, must start over)

### 2. DDC Currency (Don't Die Credits)

**Reward System**

Users earn "Don't Die Credits" for consistency. Credits persist and can later be spent (in Phase 2).

**Earning Rules:**
- **Base:** +1 DDC per completion
- **3-day streak:** +9 bonus (total 10)
- **7-day streak:** +19 bonus (total 20)
- **30-day streak:** +49 bonus (total 50)

Example: User logs exercise on day 1, 2, 3 → hits 3-day milestone → gets +10 DDC total.

**Phase 2 Spending (Future):** DDC unlocks plant skins, premium features, or community rewards.

### 3. Unified Habit Sources

DDHG automatically pulls completions from 5 apps via webhook:

#### **TrainLog** (Exercises)
- Webhook triggers when user logs a workout
- Maps to: `habit: "Train"`
- Example: "5K Run" → plant grows
- Payload: `{ exerciseName, duration, userId }`

#### **Dishrated** (Meals)
- Webhook triggers when user logs a meal
- Maps to: `habit: "Breakfast" | "Lunch" | "Dinner"`
- Example: "Salad & Grilled Chicken" → plant grows
- Payload: `{ mealType, mealName, taste_score, health_score }`

#### **Habit Garden - Planning**
- Webhook triggers when user saves daily plan
- Maps to: `habit: "Plan"`
- Example: "Set My Day with 3 wins" → plant grows
- Payload: `{ planDate, big_wins }`

#### **Habit Garden - Gratitude**
- Webhook triggers when user saves gratitude entry
- Maps to: `habit: "Gratitude"`
- Example: "Grateful for family, health, growth" → plant grows
- Payload: `{ entryDate, grateful_1, grateful_2, grateful_3 }`

#### **DDHG Native** (Manual Tracking)
- Users can log habits directly in DDHG
- Example: "Took vitamins" → plant grows
- Source: `habit: "Custom"`

**Key Design:** All sources feed the same streak. It doesn't matter if you log in Habit Garden or DDHG—your plant sees it.

### 4. Real-Time Dashboard

**Home Screen Shows:**
- **The Plant** — Large, beautiful, center-stage. Current stage with visual glow.
- **Streak Counter** — "🔥 Day 12 Streak"
- **DDC Balance** — "💎 47 Don't Die Credits"
- **Today's Progress** — Checkmarks for each habit completed today
- **Recent Completions** — Scrollable list (Exercise → Meal → Plan → Gratitude)
- **Next Milestone** — "6 more days for +20 DDC & Bloom Stage"

**Minimal, Clean, Focused.** The plant is the hero. Everything else supports it.

### 5. History & Insights (Phase 1)

- **7-day calendar** showing which days had completions
- **Habit breakdown** (% completed: Exercise, Meals, Planning, Gratitude)
- **Streak milestones** (all-time record, current streak)
- **Completion timeline** (when you logged each habit)

No heavy analytics in Phase 1. Just enough to fuel curiosity and motivation.

### 6. Authentication

- **Separate Google OAuth client** for DDHG (independent of other apps)
- **One-account unification** — Optional: Link Habit Garden/Dishrated/TrainLog accounts to auto-populate
- **Offline fallback** — Local caching for 48 hours if Firestore unavailable

---

## Technical Architecture

### Data Layer: Firestore

**Collections:**

```
ddhg_users
├─ userId (user ID from Firebase Auth)
├─ totalDDC (integer)
├─ plantGrowthStage (0-6)
├─ streakCount (integer, auto-reset after 2 days)
├─ lastCompletedAt (timestamp)
├─ created_at, updated_at (timestamps)

ddhg_completions
├─ userId
├─ habitId (exercise, breakfast, lunch, dinner, plan, gratitude, custom)
├─ habitName (human-readable)
├─ source (trainlog | dishrated | planning | gratitude | native)
├─ completedAt (timestamp)
├─ ddcEarned (integer, milestone bonus or 1)
├─ streakIncremented (boolean)
├─ growthStageIncremented (boolean)
├─ mileachieved (3day | 7day | 30day | null)
├─ notes (optional)
├─ created_at (timestamp)
```

### API Layer: Next.js Webhooks

**Endpoints:**

```
POST /api/webhooks/exercise-complete (TrainLog)
POST /api/webhooks/meal-logged (Dishrated)
POST /api/webhooks/planning-complete (Habit Garden)
POST /api/webhooks/gratitude-complete (Habit Garden)
```

Each webhook:
1. Validates userId
2. Calls `recordCompletion(userId, habitId, source)`
3. Returns `{ success, event, message }`

**Fire-and-forget pattern:** Webhooks don't block the originating app's UI.

### Frontend: Next.js + React

- **App Router** (Next.js 14+)
- **Real-time listeners** (Firestore SDK)
- **Plant visualization** (SVG/CSS animations)
- **Responsive design** (mobile-first)

---

## User Flows

### Flow 1: Daily Completion (Unified View)

```
1. User opens DDHG home → sees plant at Sprout stage (Day 2)
2. User logs into Dishrated, logs breakfast
3. Dishrated sends webhook to DDHG
4. DDHG records completion, updates streak, refreshes UI
5. User opens DDHG → plant stage is now Leafing (Day 4 ✓)
6. User sees "Breakfast ✓" in Today's Progress
7. User gets push notification: "Your plant is growing! 🌿"
```

### Flow 2: Streak Reset (Stakes)

```
1. User has 11-day streak (plant at Blooming stage)
2. User misses day 12 (no exercise, no meals, no plan)
3. Day 13: Still no habit completion
4. System auto-resets streak to 0 on day 14 (2-day grace period ended)
5. Plant reverts to Seed stage
6. User sees "Your plant wilted 💔" alert
7. User completes one habit → plant back to Stage 1, streak = 1
```

### Flow 3: Milestone Reward

```
1. User completes habits on days 1, 2, 3 (exercise, meal, plan)
2. Day 3 completion triggers 3-day milestone
3. DDHG awards: +10 DDC (not just +1)
4. User sees "Milestone! 🎉 +10 DDC" badge
5. Plant moves from Sprout → Leafing stage
6. User feels momentum → more likely to continue
```

---

## Success Metrics

### Phase 1 (Launch - Week 4)

| Metric | Target | Why It Matters |
|--------|--------|---|
| **30-day retention** | 60%+ | Users keep plants alive |
| **Daily active** | 70% of week 1 | Habit stickiness |
| **Avg streak length** | 7+ days | Momentum building |
| **Webhook success rate** | 99%+ | Integration reliability |

### Phase 2 (Month 2-3)

| Metric | Target | Why It Matters |
|--------|--------|---|
| **Cross-app integration** | 80% have linked account | Unified experience |
| **30-day streak rate** | 15%+ | Serious habit building |
| **Plant diversity** | Multiple plant types | Engagement scaling |

### Qualitative

- Users report "I don't want my plant to die" as primary motivation
- Users tell friends about DDHG plant mechanic (viral coefficient)
- Users complete habits in other apps (Dishrated, TrainLog) specifically to feed DDHG plant

---

## Go-to-Market & Launch

### Phase 1 Launch: Week of March 24 (Monday)

**What Ships:**
- DDHG core (plant, streaks, DDC)
- Webhook integration (Habit Garden, Dishrated, TrainLog)
- Google OAuth sign-in
- Basic dashboard
- Firestore backend

**NOT in Phase 1:**
- Plant skins / cosmetics
- Social features
- Analytics dashboard
- DDC spending

### Phase 1 Users

- **Internal testers:** Sam + team (7-10 people)
- **Early beta:** Invite habits.com + dishrated + trainlog users (50-100 people)
- **Target:** Prove 60% 30-day retention before scaling

### Launch Message

> "Stop tracking habits separately. Your entire day feeds one plant. Watch it grow."

---

## Competitive Positioning

### Existing Competitors

- **Habitica:** Gamified, but cartoonish. DDHG is beautiful and emotional.
- **Streaks:** Simple, clean, BUT isolated per app. DDHG unifies everything.
- **Duolingo/Fitbit:** Motivating, BUT feel like external pressure. DDHG feels like nurturing.

### DDHG's Edge

1. **Multi-app unification** — No competitor connects habit apps
2. **Emotional design** — Plant lives/dies, not just streak numbers
3. **Realistic stakes** — Miss 2 days → real reset (not artificial)
4. **Cross-ecosystem integration** — One plant fed by exercise + meals + planning + gratitude

---

## Product Roadmap

### Month 1: Core (March-April)
- ✅ Plant growth mechanics
- ✅ Webhook integration (5 apps)
- ✅ DDC currency system
- ✅ Basic UI/dashboard

### Month 2: Delight (April-May)
- Plant skins (10+ variants)
- Animations (growth sequences, wilting, revival)
- Push notifications (milestones, streak warnings)
- Weekly recap emails
- Leaderboards (optional friends, anonymous global)

### Month 3: Ecosystem (May-June)
- DDC spending (unlock plant skins, features)
- Habit groups (family challenges, team streaks)
- AI coach (daily nudges based on past completion times)
- API for 3rd-party integrations

### Month 4+: Scale
- Mobile apps (iOS, Android)
- Web app (desktop)
- Teams/organizations
- Premium tier (advanced analytics, coach, custom plants)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Webhook failures** | Plant doesn't grow → user quits | 99%+ uptime SLA, retry logic, user alerts |
| **Plant death feels bad** | High churn after wilt | Gentle messaging, one-time "revival" in early phases, grace periods |
| **Cross-app integration complex** | Late launches, bugs | Build webhooks incrementally, test each integration fully |
| **Only appeals to obsessives** | Niche product | User testing with "normal" habit trackers (50 people) |
| **Streak reset too harsh** | Users abandon after miss | 2-day grace period, optional streak insurance (DDC cost, later) |

---

## Non-Goals (Phase 1)

- ❌ Mobile app (web only)
- ❌ Social sharing (no Instagram integration yet)
- ❌ Advanced analytics
- ❌ Habit reminders (let external apps handle this)
- ❌ Customizable habits (fixed set: Exercise, Meals, Plan, Gratitude)
- ❌ Teams or family features

---

## Design Principles

### 1. **The Plant is Everything**
The plant is the hero. Every UI element supports the plant, not competes with it.

### 2. **Emotional, Not Metrics-Driven**
Show a living thing, not charts. A plant that needs water is more motivating than "+0.5% productivity."

### 3. **One Tap, One Plant**
Completions in other apps automatically feed this plant. No manual re-entry, no duplicate tracking.

### 4. **Real Stakes**
- Streaks reset on missed days (not forgiving)
- Plants wilt and die (not metaphorical)
- This creates urgency other habit apps lack

### 5. **Beautiful Simplicity**
The UI should be so simple that a 14-year-old understands it in 10 seconds.

---

## Success Story (6 Months)

Sam opens DDHG at 7 AM.

His plant is at **Flourishing stage** (Day 31 streak). It glows beautifully on his screen.

He logged:
- ✅ TrainLog: 5K run at 6 AM
- ✅ Dishrated: Healthy breakfast at 7 AM
- ✅ Habit Garden: Daily plan saved at 7:15 AM
- ✅ Gratitude: Evening entry pending

The app shows: **"One more habit and you'll hit Day 32! Your plant is thriving. 🌱"**

He knows that without this plant, he'd skip workouts. But he can't let his plant die.

**That's the magic.**

---

## Appendix: API Payload Examples

### Meal Logged (Dishrated → DDHG)
```json
{
  "userId": "user_12345",
  "mealType": "breakfast",
  "mealName": "Eggs & Toast",
  "notes": "taste: 8, health: 8"
}
```

### Exercise Complete (TrainLog → DDHG)
```json
{
  "userId": "user_12345",
  "exerciseName": "Running",
  "duration": 30,
  "notes": "5K in 25 min"
}
```

### Plan Created (Habit Garden → DDHG)
```json
{
  "userId": "user_12345",
  "planDate": "2026-03-21",
  "big_wins": ["Close 3 deals", "Finish DDHG PRD", "Exercise"]
}
```

### Gratitude Saved (Habit Garden → DDHG)
```json
{
  "userId": "user_12345",
  "entryDate": "2026-03-21",
  "grateful_1": "Family",
  "grateful_2": "Health",
  "grateful_3": "Growth"
}
```

---

**Document Approved By:** Sam Monac  
**Date Approved:** March 21, 2026  
**Next Review:** April 21, 2026 (post-launch)
