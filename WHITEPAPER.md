# Don't Die Habit Garden (DDHG)
## Whitepaper & Tokenomics

**Version:** 1.0  
**Date:** March 22, 2026  
**Status:** Product Launch

---

## Executive Summary

Don't Die Habit Garden (DDHG) is a **unified habit-tracking + token-reward platform** that aggregates user habits from multiple apps and gamifies long-term consistency.

**Core Thesis:**
- Users already log habits in their favorite apps (Habit Garden, Dishrated, TrainLog)
- DDHG **receives webhook data** from these apps
- Users earn **tokens daily** for habit completion
- Tokens accumulate into **plant growth stages** (visual, satisfying feedback loop)
- Future: tokens can be redeemed (premium features, rewards, etc.)

**Target User:** Health-conscious, productivity-focused individuals who want accountability + visual progress tracking across multiple wellness domains.

---

## Product Overview

### What DDHG Does

1. **Aggregates habits** from 3+ habit-tracking apps via webhooks
2. **Awards tokens** for daily habit completion (with streak bonuses)
3. **Tracks plant growth** based on cumulative token earnings
4. **Provides dashboard** showing all 9 habits + today's progress + tokens + plant stage
5. **Simple native forms** for habits not tied to external apps

### What DDHG Does NOT Do

- ❌ Rebuild planning/meal logging/exercise logging (users already do this elsewhere)
- ❌ Move user data (data stays in original apps, we just read webhooks)
- ❌ Force users to change their workflow (integrates with existing habits)

---

## The 9 Habits (Complete System)

### From External Apps (Webhooks)

| Habit | App | Completion Criteria | Base Tokens | 7-Day Streak | 30-Day Streak |
|-------|-----|-------------------|------------|-------------|-------------|
| 🧘 Meditation | Habit Garden | 5+ min session | 2 | 10 | 25 |
| 💪 Exercise | TrainLog | 20+ min OR 5+ intensity | 3 | 15 | 40 |
| 🍳 Breakfast | Dishrated | Health score ≥ 5/10 | 1 | 8 | 20 |
| 🥗 Lunch | Dishrated | Health score ≥ 5/10 | 1 | 8 | 20 |
| 🍽️ Dinner | Dishrated | Health score ≥ 5/10 | 1 | 8 | 20 |
| 📋 Planning | Habit Garden | 3+ big wins logged | 2 | 12 | 30 |
| 🙏 Gratitude | Habit Garden | 3 things grateful for | 2 | 12 | 30 |
| 🌙 Sleep | Habit Garden | 7+ hours logged | 2 | 12 | 30 |

### Native to DDHG (Simple Forms)

| Habit | Form Type | Completion Criteria | Base Tokens | 7-Day Streak | 30-Day Streak |
|-------|-----------|-------------------|------------|-------------|-------------|
| 🤸 Stretching | Input: "Minutes?" | 10+ min logged | 1 | 7 | 18 |

---

## Tokenomics Model

### Daily Token Economy

**Base Daily Potential:** 16 tokens/day
- If user completes all 9 habits with no streaks
- Meditation (2) + Exercise (3) + Breakfast (1) + Lunch (1) + Dinner (1) + Planning (2) + Gratitude (2) + Sleep (2) + Stretching (1) = **16 tokens**

### Streak Multipliers

**7-Day Streak:** 1.3x multiplier per habit
- Example: Meditation normally 2 tokens → with 7-day streak: +10 tokens = 12 total

**30-Day Streak:** 2.2x multiplier per habit
- Example: Meditation normally 2 tokens → with 30-day streak: +25 tokens = 27 total

### Maximum Daily Earnings

**All 9 habits + max streaks (30 days each):**
- Meditation: 27
- Exercise: 43
- Breakfast: 21
- Lunch: 21
- Dinner: 21
- Planning: 32
- Gratitude: 32
- Sleep: 32
- Stretching: 19
- **TOTAL: 248 tokens/day** (at 30-day streak on all habits)

### Token Accumulation (Monthly)

| Scenario | Daily | Monthly |
|----------|-------|---------|
| No habits completed | 0 | 0 |
| All habits, no streak | 16 | 480 |
| All habits, avg 7-day streak | 60 | 1,800 |
| All habits, avg 15-day streak | 120 | 3,600 |
| All habits, 30-day streaks | 248 | 7,440 |

---

## Plant Growth System

### 7 Plant Growth Stages

**Cumulative tokens determine plant stage:**

| Stage | Tokens | Visual | Description |
|-------|--------|--------|-------------|
| 1 | 0-100 | 🌱 Seed | Just planted, dormant |
| 2 | 101-300 | 🌿 Sprout | First leaves emerging |
| 3 | 301-700 | 🌲 Young Tree | Growing stronger |
| 4 | 701-1,200 | 🌳 Mature Tree | Solid foundation |
| 5 | 1,201-2,000 | 🌲✨ Thriving | Full health |
| 6 | 2,001-3,500 | 🌴 Flourishing | Peak growth |
| 7 | 3,501+ | 🌳👑 Monument | Unstoppable habit master |

**Timeline to Monument:**
- At 16 tokens/day (no streaks): 219 days (7 months)
- At 60 tokens/day (avg 7-day streaks): 59 days (2 months)
- At 120 tokens/day (avg 15-day streaks): 29 days (1 month)

---

## Revenue Model (Future)

### Token Redemption Options (TBD)

1. **Premium Features**
   - Early access to new habits
   - Advanced analytics
   - Export/API access

2. **Physical Rewards**
   - Merchandise (plant-themed)
   - Health/wellness products

3. **Donation Model**
   - Redeem tokens for charitable donations
   - Plant real trees

4. **Freemium Upgrades**
   - Free: Basic dashboard + 5 habits
   - Premium ($5-10/mo): All 9 habits + export

---

## User Flow

### Day 1
1. User signs up to DDHG
2. Connects Habit Garden, Dishrated, TrainLog accounts (OAuth)
3. Dashboard shows 9 habits
4. Sees plant at Stage 1 (seed)

### Daily (User's Existing Workflow)
1. User logs meditation in **Habit Garden** (not DDHG)
2. User logs breakfast in **Dishrated** (not DDHG)
3. User logs workout in **TrainLog** (not DDHG)
4. **Webhooks fire automatically** → DDHG receives data
5. DDHG awards tokens + updates plant growth

### Weekly
1. User checks DDHG dashboard
2. Sees 7-day streaks forming
3. Notices plant growing toward Stage 2

### Monthly
1. 30-day streaks unlock (2x+ token multiplier)
2. Plant progression accelerates
3. User feels momentum from compounding rewards

---

## Success Metrics

### User Engagement
- Daily active users (DAU)
- Habit completion rate (% of 9 habits completed daily)
- Average streak length
- Plant stage distribution

### Retention
- 7-day retention
- 30-day retention
- Churn rate (days until user stops checking dashboard)

### Growth
- User acquisition via Habit Garden / Dishrated / TrainLog
- Referrals from token rewards
- Cross-app integration adoption

---

## Technical Architecture

### Webhook Integrations
- Habit Garden → `/api/webhooks/habit-garden` (meditation, planning, gratitude, sleep)
- Dishrated → `/api/webhooks/dishrated` (breakfast, lunch, dinner)
- TrainLog → `/api/webhooks/trainlog` (exercise)

### Database (Firestore)
- Users collection: profile, preferences, token balance
- Habits collection: daily completion records
- Streaks collection: per-habit streak tracking
- Plant collection: current stage, cumulative tokens

### Frontend
- Next.js dashboard
- Real-time updates (Firestore listeners)
- Plant animation (Canvas/SVG)
- Simple input forms (meditation timer, stretching, sleep)

---

## Competitive Advantages

1. **No Friction** — Integrates with apps users already use
2. **Unified View** — One dashboard for habits across multiple apps
3. **Gamification** — Plant growth is more engaging than points
4. **Streak Bonuses** — Exponential rewards drive long-term commitment
5. **Privacy** — We never store user data, only aggregate webhook events

---

## Roadmap (Phase 2+)

### Phase 1 (Current)
✅ Webhook integrations  
✅ Token system  
✅ Plant growth  
✅ Dashboard MVP  

### Phase 2 (Q2 2026)
- [ ] Mobile app (iOS/Android)
- [ ] Advanced analytics (habit insights, trends)
- [ ] Social features (leaderboards, challenges)
- [ ] Export data (CSV, PDF)

### Phase 3 (Q3 2026)
- [ ] Token marketplace (redeem for products)
- [ ] Community challenges (group habit goals)
- [ ] AI insights (personalized habit suggestions)
- [ ] Integrations (Apple Health, Fitbit, Whoop)

### Phase 4 (Q4 2026)
- [ ] B2B licensing (corporate wellness programs)
- [ ] White-label (other apps can embed DDHG)
- [ ] Subscription tiers (free, pro, enterprise)

---

## Conclusion

DDHG is a **habit aggregation platform** that turns consistent daily actions into visible progress. By leveraging existing habit-tracking apps and adding a gamified plant-growth layer, we create a system where **consistency compounds into unstoppable momentum**.

**Target Launch:** March 23, 2026  
**MVP Features:** 9 habits, webhooks, tokens, plant growth  
**First 100 Users:** Beta test with existing Habit Garden + Dishrated communities
