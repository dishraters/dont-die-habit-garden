# DDHG: 9-Habit System — Complete Specification

**Status:** APPROVED FOR DEVELOPMENT  
**Date:** March 21, 2026  

---

## Overview

Users must complete **9 distinct habits with individual criteria** to earn tokens and grow their plant.

Each habit has:
- **Unique completion criteria** (not just "did you do it")
- **Token reward system** (different value per habit)
- **Daily reset** (complete by midnight)
- **Streak tracking** (per-habit streaks)

---

## The 9 Habits

### 1. **Meditation / Mindfulness** 🧘

**Criteria:** Complete a meditation session
- **Source:** Habit Garden (native)
- **Minimum:** 5+ minutes
- **Tracking:** Logged in Habit Garden's Meditation habit
- **Verification:** Firestore timestamp + duration

**Token Reward:**
- Base: **+2 tokens**
- 7-day streak: **+10 tokens** (total 12)
- 30-day streak: **+25 tokens** (total 27)

**Example:** User completes 15-min meditation at 6 AM → earns 2 tokens + adds to meditation streak.

---

### 2. **Exercise / Training** 💪

**Criteria:** Complete a workout session
- **Source:** TrainLog (via webhook)
- **Minimum:** 20+ minutes OR 5+ intensity points
- **Types:** Running, strength, yoga, sports, etc.
- **Verification:** TrainLog logs exercise with timestamp + duration

**Token Reward:**
- Base: **+3 tokens** (higher effort barrier)
- 7-day streak: **+15 tokens** (total 18)
- 30-day streak: **+40 tokens** (total 43)

**Example:** User logs 30-min 5K run → earns 3 tokens + adds to exercise streak.

---

### 3. **Breakfast** 🍳

**Criteria:** Log a breakfast meal with health score
- **Source:** Dishrated (via webhook)
- **Minimum:** Health score ≥ 5/10
- **Tracking:** Dishrated meal log (mealType = "breakfast")
- **Verification:** Firestore entry with meal_type + health_score

**Token Reward:**
- Base: **+1 token**
- 7-day streak: **+8 tokens** (total 9)
- 30-day streak: **+20 tokens** (total 21)

**Example:** User logs "Eggs & Oatmeal" with health score 7 → earns 1 token + adds to breakfast streak.

---

### 4. **Lunch** 🥗

**Criteria:** Log a lunch meal with health score
- **Source:** Dishrated (via webhook)
- **Minimum:** Health score ≥ 5/10
- **Tracking:** Dishrated meal log (mealType = "lunch")
- **Verification:** Firestore entry with meal_type + health_score

**Token Reward:**
- Base: **+1 token**
- 7-day streak: **+8 tokens** (total 9)
- 30-day streak: **+20 tokens** (total 21)

**Example:** User logs "Grilled Salmon Salad" with health score 8 → earns 1 token + adds to lunch streak.

---

### 5. **Dinner** 🍽️

**Criteria:** Log a dinner meal with health score
- **Source:** Dishrated (via webhook)
- **Minimum:** Health score ≥ 5/10
- **Tracking:** Dishrated meal log (mealType = "dinner")
- **Verification:** Firestore entry with meal_type + health_score

**Token Reward:**
- Base: **+1 token**
- 7-day streak: **+8 tokens** (total 9)
- 30-day streak: **+20 tokens** (total 21)

**Example:** User logs "Grilled Chicken & Vegetables" with health score 7 → earns 1 token + adds to dinner streak.

---

### 6. **Planning** 📋

**Criteria:** Create and save a daily plan with 3+ big wins
- **Source:** Habit Garden (via webhook)
- **Minimum:** Must include 3 "big wins" or "priority tasks"
- **Tracking:** Habit Garden Planning feature (daily plan save)
- **Verification:** Firestore entry with planDate + big_wins array length ≥ 3

**Token Reward:**
- Base: **+2 tokens**
- 7-day streak: **+12 tokens** (total 14)
- 30-day streak: **+30 tokens** (total 32)

**Example:** User saves plan: "Close 2 deals, Finish DDHG, Exercise" → earns 2 tokens + adds to planning streak.

---

### 7. **Gratitude** 🙏

**Criteria:** Save a gratitude entry with 3+ things you're grateful for
- **Source:** Habit Garden (via webhook)
- **Minimum:** Must list 3 things grateful for + 1 affirmation
- **Tracking:** Habit Garden Gratitude feature (evening entry)
- **Verification:** Firestore entry with grateful_1 + grateful_2 + grateful_3 + affirmation fields

**Token Reward:**
- Base: **+2 tokens**
- 7-day streak: **+12 tokens** (total 14)
- 30-day streak: **+30 tokens** (total 32)

**Example:** User saves: "Grateful for family, health, growth. Today I showed up." → earns 2 tokens + adds to gratitude streak.

---

### 8. **Sleep / Bedtime** 🌙

**Criteria:** Log sleep with 7+ hours
- **Source:** Habit Garden (native) OR external (Apple Health, Fitbit via future integration)
- **Minimum:** 7+ hours recorded
- **Tracking:** Sleep log in Habit Garden or imported from health app
- **Verification:** Firestore entry with sleep_hours ≥ 7

**Token Reward:**
- Base: **+2 tokens**
- 7-day streak: **+10 tokens** (total 12)
- 30-day streak: **+25 tokens** (total 27)

**Example:** User logs 8 hours sleep (10 PM - 6 AM) → earns 2 tokens + adds to sleep streak.

---

### 9. **Mindful Movement / Stretching** 🤸

**Criteria:** Complete a stretching or flexibility session
- **Source:** TrainLog or Habit Garden (native)
- **Minimum:** 10+ minutes of stretching, yoga, or mobility work
- **Tracking:** Logged as "Stretching" or "Yoga" or "Mobility" session
- **Verification:** Firestore entry with duration ≥ 10 min + activity type

**Token Reward:**
- Base: **+2 tokens**
- 7-day streak: **+10 tokens** (total 12)
- 30-day streak: **+25 tokens** (total 27)

**Example:** User logs 15-min yoga session → earns 2 tokens + adds to stretching streak.

---

## Token System: Complete Rules

### Token Earning

**Daily Max Tokens (if all 9 habits completed):**
- Base: 2+3+1+1+1+2+2+2+2 = **16 tokens/day**
- With no streaks

**With Streaks (7-day each):**
- 10+15+8+8+8+12+12+10+10 = **93 tokens/day** (all at 7-day)

**With Streaks (30-day each):**
- 27+40+21+21+21+32+32+25+25 = **244 tokens/day** (all at 30-day)

### Streak Mechanics

Each habit has **independent streak tracking:**

```
Meditation Streak: 12 days
Exercise Streak: 8 days
Breakfast Streak: 15 days
Lunch Streak: 15 days
Dinner Streak: 15 days
Planning Streak: 10 days
Gratitude Streak: 10 days
Sleep Streak: 7 days
Stretching Streak: 5 days
```

**Streak Reset:** Individual habit streak resets if not completed for 2 days.

**Plant Streak (Separate):** Overall plant growth is based on completing **ANY habit daily**:
- Days 1-2: Seed
- Days 2-4: Sprout
- Days 4-7: Leafing
- Days 7-11: Budding
- Days 11-16: Blooming
- Days 16+: Flourishing

So if user completes meditation on day 1, but skips day 2-3, then does stretching on day 4, the **plant streak continues** but the **meditation streak resets**.

### Token Milestones (Bonus Tokens)

**At 7-day consecutive completion per habit:**
- User gets all tokens for that day PLUS **+5 bonus tokens**
- Plant also visually celebrates

**At 30-day consecutive completion per habit:**
- User gets all tokens for that day PLUS **+20 bonus tokens**
- Plant animates a special glow/shine

### Total Daily Token Potential

| Scenario | Daily Tokens |
|----------|--------------|
| All 9 habits, no streak | 16 |
| All 9 habits, 7-day streaks | 93 |
| All 9 habits, 30-day streaks | 244 |
| Miss 1 habit, 7-day streaks | 78 |
| Complete 5 habits only, no streak | 10 |

---

## UI/UX: How Habits Are Displayed

### Home Screen: Habit Progress Ring

```
Today's Habits (6/9 completed)

🧘 Meditation ✅ +2 tokens (Day 12)
💪 Exercise ✅ +3 tokens (Day 8)
🍳 Breakfast ✅ +1 token (Day 15)
🥗 Lunch ✅ +1 token (Day 15)
🍽️ Dinner ✅ +1 token (Day 15)
📋 Planning ❌ Due by 9 PM
🙏 Gratitude ❌ Due by 11 PM
🌙 Sleep ❌ Due by midnight
🤸 Stretching ❌ Due by 8 PM (next session)

---
Today's Tokens: 8 / 16 possible
```

### Habit Detail Screen

User taps "📋 Planning" → sees:

```
Planning Habit
━━━━━━━━━━━━━━━━━━

Streak: 10 days 🔥

Criteria:
✓ Save daily plan
✓ Include 3+ big wins
✓ Complete by 9 PM

Today:
⏳ Not yet completed
Tap to log plan

Rewards (if completed today):
Base: +2 tokens
7-day bonus: +0 (5 more days)
30-day bonus: +0 (20 more days)

History:
✅ Mar 20: Completed 8:45 PM (+2 tokens, streak 10)
✅ Mar 19: Completed 9:15 PM (+2 tokens, streak 9)
⏭️ Mar 18: Skipped (streak would reset)
...
```

### Dashboard: Habit Summary

```
All Habits Performance (7-day view)

Meditation:    ✅✅✅✅✅✅✅ (7/7) 🔥 7-day bonus
Exercise:      ✅✅✅✅✅❌✅ (6/7)
Breakfast:     ✅✅✅✅✅✅✅ (7/7) 🔥 7-day bonus
Lunch:         ✅✅✅✅✅✅✅ (7/7) 🔥 7-day bonus
Dinner:        ✅✅✅✅✅✅✅ (7/7) 🔥 7-day bonus
Planning:      ✅✅✅✅✅✅❌ (6/7)
Gratitude:     ✅✅✅✅✅❌✅ (6/7)
Sleep:         ✅✅❌✅✅✅✅ (6/7)
Stretching:    ✅✅✅✅✅✅✅ (7/7) 🔥 7-day bonus

Completion Rate: 89% (56/63 total)
Week Total Tokens: 187
```

---

## Token Spending (Phase 2)

**Tokens can be spent on:**

- **Plant Skins** (20-50 tokens per skin)
  - Golden Plant (50 tokens)
  - Rainbow Plant (50 tokens)
  - Crystal Plant (50 tokens)

- **Animations** (10-30 tokens)
  - Particle effects on plant growth
  - Celebration animations on streak milestones

- **Power-Ups** (5-15 tokens)
  - Streak insurance (prevent 1 reset, 10 tokens)
  - Habit skip (skip 1 day without penalty, 5 tokens)
  - Plant revival (bring back wilted plant, 25 tokens)

- **Premium Features** (100+ tokens)
  - AI daily coach (15-min personalized nudge, 100 tokens)
  - Plant duplication (grow 2 plants simultaneously, 150 tokens)

---

## Implementation: Firestore Schema Update

### New Collection: `habit_data`

```
{
  userId: string
  habitId: string (meditation, exercise, breakfast, lunch, dinner, planning, gratitude, sleep, stretching)
  completedAt: timestamp (if completed today, else null)
  todayTokensEarned: number
  
  streak: {
    current: number
    longest: number
    lastCompletedDate: date
  }
  
  requirements: {
    type: string (duration, health_score, count, etc)
    value: number | array
    met: boolean
  }
  
  created_at: timestamp
  updated_at: timestamp
}
```

### Updated `ddhg_users`

```
{
  userId: string
  totalTokens: number (replaces DDC)
  plantGrowthStage: number (0-6)
  plantStreak: number (days of completing any habit)
  
  habitStreaks: {
    meditation: number
    exercise: number
    breakfast: number
    lunch: number
    dinner: number
    planning: number
    gratitude: number
    sleep: number
    stretching: number
  }
  
  todayCompletedHabits: string[] (habit IDs)
  todayTokens: number
  
  created_at: timestamp
  updated_at: timestamp
}
```

---

## Success Metrics (Updated)

### Phase 1 Launch Targets

| Metric | Target | Why |
|--------|--------|-----|
| All 9 habits completed (1 day) | 10% | High barrier, but inspiring |
| 7+ habits completed (daily) | 40% | Most users aim for most habits |
| 5+ habits completed (daily) | 70% | Sustainable baseline |
| Avg tokens earned/day | 25+ | Shows momentum |
| 30-day retention | 65% | Users keep streaks alive |

### Engagement Benchmarks

- **Week 1:** Users discover which 3-4 habits are easiest (meditation, meals, planning)
- **Week 2:** Users start seeing 7-day streaks on easy habits, motivation builds
- **Week 3:** Users attempt 30-day streaks, plant reaches Blooming/Flourishing
- **Month 2:** Users complete all 9 habits on "big commitment" days

---

## Examples: Real User Day

### Day 1 (Friday, March 22)

```
6:00 AM - Meditation ✅
  Logs 10-min session → +2 tokens (streak: 1)

6:30 AM - Exercise ✅
  Logs 30-min run → +3 tokens (streak: 1)

7:00 AM - Breakfast ✅
  Logs eggs & toast, health 6 → +1 token (streak: 1)

12:30 PM - Lunch ✅
  Logs salad, health 7 → +1 token (streak: 1)

6:30 PM - Dinner ✅
  Logs chicken & rice, health 6 → +1 token (streak: 1)

8:00 PM - Planning ✅
  Saves plan: "Close 2 deals, Finish PRD, Call Mom" → +2 tokens (streak: 1)

9:30 PM - Stretching ✅
  Logs 15-min yoga → +2 tokens (streak: 1)

11:00 PM - Gratitude ✅
  Logs: "Family, Health, Growth + Today I showed up" → +2 tokens (streak: 1)

⏰ Sleep still pending (needs 7+ hours logged by midnight)

---
Day 1 Summary:
✅ 8/9 habits completed
💰 14 tokens earned (need sleep to unlock +2)
🌱 Plant: Seed → Rooted (Day 1 streak)
```

### Day 7 (Thursday, March 28) - First Milestone

```
All 9 habits completed 7 days straight

6:00 AM - Meditation ✅
  Logs 12-min session → +2 tokens + 🎉 5-day streak bonus (+5) = +7 (streak: 7)

6:30 AM - Exercise ✅
  Logs 25-min strength → +3 tokens (streak: 7)

... (other habits) ...

📊 Day 7 Summary:
✅ 9/9 habits completed (perfect day!)
💰 Base tokens: 16
💎 7-day streak bonuses: +5 (meditation) +5 (meal x3) +5 (planning/gratitude/sleep/stretching) = +35
📈 Total day: 51 tokens
🌱 Plant: Leafing stage (Day 7 streak) ✨
🎉 Celebration notification: "All 9 habits for 7 days! Your plant is blooming! 🌸"
```

---

## Risk Mitigation

### Risk: Users overwhelmed by 9 habits

**Mitigation:**
- Week 1: Suggest starting with 3 "Easy Wins" (breakfast, lunch, dinner)
- Week 2: Add 2 more (meditation, planning)
- Week 3: Challenge full 9
- Onboarding wizard guides progression

### Risk: Some habits impossible to complete daily

**Mitigation:**
- Meditation/exercise/stretching: "Minimum duration" not perfection
- Meals: Can be quick/simple (not all gourmet)
- Sleep: 7+ hours is reasonable target
- Planning/Gratitude: 5-min investment

### Risk: Tokens feel too easy to earn

**Mitigation:**
- Base tokens are modest (1-3)
- Streaks are the multiplier (7-day = 4-8x)
- Encourage 30-day challenges for real token velocity

---

## Phase 1 Launch Checklist

- [ ] Implement 9-habit tracking in Firestore
- [ ] Add habit requirement validation (duration, health score, etc.)
- [ ] Build habit detail screens (per-habit UI)
- [ ] Update dashboard to show all 9 habits + today's progress
- [ ] Implement streak tracking (per-habit + plant streak)
- [ ] Token reward system (base + milestone bonuses)
- [ ] Webhook updates (Dishrated sends health_score, duration, etc.)
- [ ] Notifications (daily reminder, streak milestone, plant milestone)
- [ ] Testing (manual tests for all 9 habits, edge cases)

---

**Document Approved By:** Sam Monac  
**Date:** March 21, 2026  
**Next Review:** March 24, 2026 (pre-launch)
