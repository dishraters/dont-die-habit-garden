# PHASE 4: Cross-App Integration + Token Visibility

## ✅ COMPLETED

### Backend
- ✅ `/api/heartbeat/complete` endpoint — handles habit completions
- ✅ `/api/heartbeat/status?userId` endpoint — returns user balance
- ✅ Firestore integration for persistence
- ✅ Streak multiplier calculation (1× to 15×)
- ✅ Golden Seed awards (day 30+)

### Shared Infrastructure
- ✅ `hooks/useUserBalance.ts` — shared hook for all apps
  - Fetches from `/api/heartbeat/status`
  - Caches for 60 seconds
  - Refetches on tab focus
  - Can be exported as npm package or copied to each app

### DDHG Dashboard Pages
- ✅ `/portfolio` — Main balance display + weekly/monthly charts + breakdown by app
- ✅ `/leaderboard` — Top 10 users + time filters + your rank
- ✅ `/activity` — Timeline of all earnings across apps
- ✅ `/store` — Placeholder for future purchases
- ✅ `/staking` — Already exists from Phase 3

## 🚀 NEXT STEPS (For Coding Agent)

### App Integration (Each app needs these 4 items):

#### 1. **Dishrated** (`/Users/nancy/.openclaw/workspace/dishrated/dishrated/src/`)
- [ ] Add `useUserBalance()` hook to nav component
- [ ] Show floating DDHG balance in navbar
- [ ] On meal log success: Show toast "✅ +3 RP earned (est. 0.12 DDHG tokens)"
- [ ] Add "DDHG Earnings This Week" card on main dashboard
- [ ] Link to staking page in settings

**Files to modify:**
- `src/app/layout.tsx` — Add balance in header
- `src/app/lunch/page.tsx` — Update success toast with dynamic DDHG amount
- `src/app/breakfast/page.tsx` — Same
- `src/app/dinner/page.tsx` — Same
- `src/app/page.tsx` — Add earnings card on dashboard

#### 2. **Habit Garden** (`/Users/nancy/.openclaw/workspace/habit-garden/`)
- [ ] Add `useUserBalance()` hook
- [ ] Show DDHG balance in navbar
- [ ] On habit completion: Toast "🌱 Plant grew! +2 RP earned (est. 0.08 DDHG)"
- [ ] Add "Total DDHG Earned" counter next to plant stage
- [ ] Per-habit breakdown: "Meditation: 12 DDHG, Planning: 8 DDHG, etc"
- [ ] Weekly earnings chart (Mon-Sun)
- [ ] Link to DDHG dashboard

#### 3. **TrainLog** (`/Users/nancy/.openclaw/workspace/trainlog-next/`)
- [ ] Add `useUserBalance()` hook
- [ ] Show DDHG balance in navbar
- [ ] On exercise log: Toast "🔥 +5 RP (est. 0.20 DDHG tokens earned today)"
- [ ] Stats dashboard: "Total DDHG This Month: X tokens"
- [ ] Workout history: show DDHG earned per workout
- [ ] Show streak info: "Day 14 (15× multiplier) = 75 DDHG estimated"
- [ ] Leaderboard: filter by DDHG earned this week

#### 4. **5 New Habit Apps** (Each needs):
Apps: Meditation, Stories, Yoga, Hydrate, Read
- [ ] Create or scaffold each app
- [ ] Add Firebase Auth
- [ ] Add `useUserBalance()` hook in nav
- [ ] On completion: Toast "+X RP (est. Y DDHG tokens)"
- [ ] Stats page: "Total DDHG earned from [habit]: X tokens"
- [ ] Progress bar: "Next reward milestone: 100 DDHG"
- [ ] Quick link to DDHG dashboard

## 📋 Testing Checklist

### Test Account A: Power User
- Complete all 9 habits (25 RP base)
- Day 25 streak (12.5× multiplier) = 312.5 RP
- Expected: ~1.14 DDHG tokens
- **Verify:** All apps show "+X DDHG" toast
- **Verify:** DDHG dashboard totals correct
- **Verify:** Activity feed shows all 9 entries

### Test Account B: Casual User
- Complete 3 habits (8 RP base)
- Day 3 streak (2.5× multiplier) = 20 RP
- Expected: ~0.07 DDHG tokens
- **Verify:** Only connected apps show earnings
- **Verify:** Balance syncs across tabs

### Test Account C: New User
- First day, 1 habit (2 RP base)
- 1× multiplier = 2 RP
- Expected: ~0.007 DDHG tokens
- **Verify:** No errors, correct streak counter
- **Verify:** Can see dashboard + leaderboard

### Test Account D: Staker
- Stake 500 tokens (Silver tier, 8% APY)
- Complete habits to earn 0.2 DDHG
- **Verify:** Balance updates from both sources
- **Verify:** Locked tokens shown separately
- **Verify:** Unlock countdown correct

## 🔄 Integration Checklist

### Webhook Standardization
All apps POST to `/api/heartbeat/complete` with:
```json
{
  "userId": "firebase-uid",
  "habitType": "meditation|training|breakfast|lunch|dinner|gratitude|planning|stories|yoga|hydrate|reading",
  "sourceApp": "dishrated|habit-garden|trainlog|meditation-app|stories-app|yoga-app|hydrate-app|read-app",
  "baseRP": 2,
  "timestamp": "2026-03-23T04:30:00Z"
}
```

Server responds:
```json
{
  "success": true,
  "rp_earned": 2,
  "multiplier": 2.5,
  "final_rp": 5,
  "estimated_tokens": 0.18,
  "new_balance": 247.53,
  "streak_day": 12,
  "next_golden_seed_in": 18
}
```

### Real-Time Syncing
- All apps use `useUserBalance()` hook
- Cache: 60 seconds
- Refetch: On tab focus, on app switch
- Manual refresh: After completing habit (use `useUserBalanceRefresh()`)

## 📦 Deployment

### DDHG App
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden
npm run build
vercel deploy --prod
```

### Dishrated
```bash
cd /Users/nancy/.openclaw/workspace/dishrated/dishrated
npm run build
vercel deploy --prod
```

### Habit Garden
```bash
cd /Users/nancy/.openclaw/workspace/habit-garden
npm run build
vercel deploy --prod
```

### TrainLog
```bash
cd /Users/nancy/.openclaw/workspace/trainlog-next
npm run build
vercel deploy --prod
```

### New Habit Apps
```bash
# For each app (meditation, stories, yoga, hydrate, read)
npm run build
vercel deploy --prod
```

## ✨ Success Criteria (All Must Pass)

✅ User can earn DDHG in any app, see it everywhere
✅ Proportional formula working (user's share = (userRP / totalNetworkRP) × 2739.72)
✅ Streak multiplier applied (1× to 15×, caps at day 30)
✅ Golden Seeds awarded (day 30+ = 1 seed/day)
✅ All 9 habits wired (firing webhooks correctly)
✅ Real-time syncing (earn in Dishrated, balance updates in Habit Garden)
✅ Dashboard complete (Portfolio, Leaderboard, Activity, Store)
✅ Token utility (can use DDHG for premium features + staking)
✅ All 4 test accounts pass
✅ Cross-app balance visible (in nav of all 8 apps)
✅ End-to-end working (habit → RP → tokens → visible + usable)

---

## 🕐 DEADLINE: 6 AM EST

Current status: Backend + Dashboard ✅ | App Integration 🔄 | Testing 🔄 | Deployment 🔄
