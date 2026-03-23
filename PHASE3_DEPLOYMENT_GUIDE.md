# PHASE 3 DEPLOYMENT GUIDE

## Status Summary

### ✅ COMPLETE
- **Phase 2 Backend**: heartbeatEngine.ts, /api/heartbeat/status, /api/heartbeat/trigger
- **Firestore Schema**: v2.0 with RP tracking, streak multipliers, golden seeds
- **UI Components**: DailyPieChart, EarningsDashboard, StreakMultiplier, GoldenHatTracker
- **Webhook Endpoint**: `/api/heartbeat/complete` (newly created)

### 🔧 IN PROGRESS
- **Phase 3 Component Integration**: Adding components to app/page.tsx
- **5 Habit Apps**: Building meditation-timer, stories-player, yoga-app, hydrate-app, read-timer
- **Webhook Wiring**: Each app POSTs to /api/heartbeat/complete

---

## Critical Path

### Step 1: Integrate Components (15 min)
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden

# Edit app/page.tsx:
# 1. Add imports at top:
import DailyPieChart from './components/DailyPieChart'
import EarningsDashboard from './components/EarningsDashboard'
import StreakMultiplier from './components/StreakMultiplier'
import GoldenHatTracker from './components/GoldenHatTracker'

# 2. Add to JSX (after h1, before habit cards):
<section className="mb-12">
  <EarningsDashboard userId={userId} />
</section>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
  <DailyPieChart userId={userId} dailyPoolSize={2739.72} />
  <StreakMultiplier userId={userId} />
</div>

<section className="mb-12">
  <GoldenHatTracker userId={userId} />
</section>
```

### Step 2: Build 5 Apps (90 min)

Each app is a minimal Next.js project with:
- Simple UI
- Completion button → POST /api/heartbeat/complete
- Test locally, then deploy to Vercel

#### App 1: meditation-timer
```
POST /api/heartbeat/complete
{
  "habitType": "meditation",
  "userId": "USER_ID",
  "rp_earned": 2,
  "sourceApp": "meditation-timer"
}
```

#### App 2: stories-player
```
POST /api/heartbeat/complete
{
  "habitType": "sleeptime_stories",
  "userId": "USER_ID",
  "rp_earned": 3,
  "sourceApp": "stories-player"
}
```

#### App 3: yoga-app
```
POST /api/heartbeat/complete
{
  "habitType": "mindful_movements",
  "userId": "USER_ID",
  "rp_earned": 2,
  "sourceApp": "yoga-app"
}
```

#### App 4: hydrate-app
```
POST /api/heartbeat/complete
{
  "habitType": "hydration",
  "userId": "USER_ID",
  "rp_earned": 1,
  "sourceApp": "hydrate-app"
}
```

#### App 5: read-timer
```
POST /api/heartbeat/complete
{
  "habitType": "reading",
  "userId": "USER_ID",
  "rp_earned": 3,
  "sourceApp": "read-timer"
}
```

### Step 3: Test E2E (30 min)

```bash
# 1. Start DDHG locally
cd dont-die-habit-garden
npm run dev  # Port 3000

# 2. Create test user in Firebase
# Login at http://localhost:3000
# Note: userId

# 3. Test meditation-timer
# Click "Complete" button
# Check browser console: should log webhook response
# Response should include:
# {
#   success: true,
#   user_daily_rp: 2,
#   streak_multiplier: 1.0,
#   estimated_tokens: 0.XXX,
#   ...
# }

# 4. Return to DDHG dashboard
# Should see EarningsDashboard updated with +2 RP
# DailyPieChart should show user's share
# StreakMultiplier should show 1× multiplier

# 5. Complete another habit (stories)
# EarningsDashboard should now show +5 RP (2 + 3)
# DailyPieChart should update

# 6. Verify Firestore
# Check ddhg_completions/{today}/{userId}/ → should see 2 entries
```

### Step 4: Deploy to Production (30 min)

```bash
# 1. Deploy DDHG to Vercel
cd dont-die-habit-garden
vercel deploy --prod

# 2. Deploy meditation-timer
cd ../meditation-timer
vercel deploy --prod
# Set environment: NEXT_PUBLIC_HEARTBEAT_API=https://ddhg.vercel.app/api/heartbeat/complete

# 3. Deploy stories-player
cd ../stories-player
vercel deploy --prod

# 4. Deploy yoga-app
cd ../yoga-app
vercel deploy --prod

# 5. Deploy hydrate-app
cd ../hydrate-app
vercel deploy --prod

# 6. Deploy read-timer
cd ../read-timer
vercel deploy --prod

# 7. Update DDHG dashboard with app links
# app/page.tsx or app/layout.tsx:
<a href="https://meditation-timer.vercel.app">Meditation</a>
<a href="https://stories-player.vercel.app">Stories</a>
<a href="https://yoga-app.vercel.app">Yoga</a>
<a href="https://hydrate-app.vercel.app">Hydration</a>
<a href="https://read-timer.vercel.app">Reading</a>
```

---

## Verification Checklist

### Local Testing
- [ ] DailyPieChart appears on dashboard
- [ ] EarningsDashboard shows 6 cards (all 0 initially)
- [ ] StreakMultiplier displays on dashboard
- [ ] GoldenHatTracker shows seed count
- [ ] meditation-timer app runs locally
- [ ] Click "Complete" button in timer app
- [ ] Browser console shows webhook response (success: true)
- [ ] DDHG dashboard updates with +2 RP
- [ ] DailyPieChart updates user's slice
- [ ] EarningsDashboard card shows new RP total
- [ ] Repeat for all 5 apps

### Firestore Verification
- [ ] ddhg_completions/{today}/{userId} has 5 entries (one per app)
- [ ] Each entry has habitType, rp_earned, sourceApp
- [ ] ddhg_users/{userId}.totalRewardPoints = 11 (2+3+2+1+3)
- [ ] ddhg_users/{userId}.todayRewardPoints = 11
- [ ] ddhg_users/{userId}.streakDay updated

### Deployment Testing
- [ ] DDHG deployed to Vercel production
- [ ] All 5 apps deployed to Vercel production
- [ ] Visit production dashboard
- [ ] Click links to each app
- [ ] Complete a habit in production app
- [ ] Verify webhook POSTs to correct endpoint
- [ ] Production dashboard updates with RP

---

## Known Endpoints

### Local (Development)
- DDHG Dashboard: http://localhost:3000
- Heartbeat Status: http://localhost:3000/api/heartbeat/status?userId=USER_ID
- Complete Habit: POST http://localhost:3000/api/heartbeat/complete
- Meditation Timer: http://localhost:3001
- Stories Player: http://localhost:3002
- Yoga App: http://localhost:3003
- Hydration Tracker: http://localhost:3004
- Reading Timer: http://localhost:3005

### Production (Vercel)
- DDHG Dashboard: https://dont-die-habit-garden.vercel.app (or custom domain)
- Heartbeat Status: https://dont-die-habit-garden.vercel.app/api/heartbeat/status?userId=USER_ID
- Complete Habit: POST https://dont-die-habit-garden.vercel.app/api/heartbeat/complete
- Apps: https://meditation-timer.vercel.app, etc.

---

## Troubleshooting

### Issue: Components don't appear on dashboard
**Check:**
- Imports in app/page.tsx correct
- userId is being passed
- No TypeScript errors: `npm run build`

### Issue: Webhook gets 404
**Check:**
- Endpoint is `/api/heartbeat/complete` (not `/api/heartbeat`)
- Method is POST
- DDHG is running or deployed

### Issue: Webhook gets 400 (bad request)
**Check:**
- Body has required fields: `habitType`, `userId`
- JSON is valid
- Check browser console for exact error

### Issue: Dashboard doesn't update after webhook
**Check:**
- Webhook returned `success: true`
- Firestore has new ddhg_completions entry
- User is logged in (userId matches)
- Try refreshing browser

### Issue: DailyPieChart shows "No data"
**Check:**
- User has completed at least one habit
- Firestore ddhg_completions has entries for today
- `/api/heartbeat/status?userId=USER_ID` returns data
- Network tab shows API call successful

---

## Files Modified/Created

### New Files
```
app/api/heartbeat/complete/route.ts          [NEW - webhook endpoint]
PHASE3_DEPLOYMENT_GUIDE.md                   [NEW - this file]
```

### Modified Files
```
app/page.tsx                                 [MODIFY - add 4 component imports + JSX]
```

### Unchanged (Already Done)
```
lib/heartbeatEngine.ts                       [DONE]
app/api/heartbeat/route.ts                   [DONE]
app/components/DailyPieChart.tsx             [DONE]
app/components/EarningsDashboard.tsx         [DONE]
app/components/StreakMultiplier.tsx          [DONE]
app/components/GoldenHatTracker.tsx          [DONE]
lib/firestoreIntegration.ts                  [DONE - schema v2.0]
```

---

## Timeline
- **Phase 2**: ✅ DONE (12 hours ago)
- **Phase 3 Integration**: 15 min
- **Phase 3 Build (5 apps)**: 90 min
- **Testing**: 30 min
- **Deployment**: 30 min
- **Total Phase 3**: ~2.5 hours
- **DEADLINE**: 6 AM EST (5.5 hours available)

**EXPECTED COMPLETION: ~4:30 AM EST** (with buffer)

---

## Success = 

✅ All 4 UI components visible on DDHG dashboard
✅ All 5 habit apps built + deployable
✅ All 5 webhooks firing to heartbeat/complete
✅ Real-time dashboard updates after habit completion
✅ Firestore tracking all completions + RP
✅ Streak multipliers calculating correctly
✅ Golden seeds awarded on day 30+
✅ End-to-end test passes (all 5 apps)
✅ All code committed
✅ Ready for production deployment

---

**Status**: 🚀 Ready for Phase 3 final push
**Last Updated**: March 23, 2026, 00:24 AM EDT
