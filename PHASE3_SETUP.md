# Phase 3 - Habit Apps Integration & Webhook Testing

## 📋 What's Complete

### ✅ TASK 1: Dashboard Component Integration
- **DailyPieChart**: Shows your RP slice of the daily pool
- **EarningsDashboard**: Real-time earnings, multiplier, tokens, golden seeds
- **StreakMultiplier**: Visual streak progress toward 15.0× multiplier lock
- **GoldenHatTracker**: 30-day streak seeds tracking
- **Location**: All integrated into `app/page.tsx` after title, before habit cards

### ✅ TASK 2: Five Minimal Habit Apps Built
All apps are Next.js apps with webhook integration.

1. **meditation-timer** (port 3001)
   - Timer: 5, 10, 15, 20 min buttons
   - Complete button fires webhook
   - RP: 2 | HabitType: `meditation`

2. **stories-player** (port 3002)
   - 5 sample stories with narrators
   - Play + "Mark Complete" webhook
   - RP: 3 | HabitType: `sleeptime_stories`

3. **yoga-app** (port 3003)
   - Carousel of 5 yoga poses
   - Check off poses → "Complete Sequence" webhook
   - RP: 2 | HabitType: `mindful_movements`

4. **hydrate-app** (port 3004)
   - Water glass counter (max 8 glasses)
   - Daily goal tracker with persistent state
   - "Goal Reached" webhook on 8 glasses
   - RP: varies (0.5 × glasses count) | HabitType: `hydration`

5. **read-timer** (port 3005)
   - Book selector (5 sample books)
   - Timer: 15, 30, 45, 60 min
   - "Session Complete" webhook
   - RP: 3 | HabitType: `reading`

### ✅ TASK 3: Webhooks Wired
All 5 apps POST to `DDHG_API/api/heartbeat/complete` with:
```json
{
  "habitType": "...",
  "userId": "...",
  "sourceApp": "...",
  "rp_earned": 2
}
```

### ✅ TASK 4: Testing Guide (Below)

---

## 🚀 Quick Start - Local Testing

### Prerequisites
- Node.js 18+ installed
- DDHG main app running on `http://localhost:3000`
- Each habit app in separate terminal

### Step 1: Start DDHG Main App
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden
npm install  # if needed
npm run dev
# Runs on http://localhost:3000
```

### Step 2: Start All 5 Habit Apps (in separate terminals)

```bash
# Terminal 2 - Meditation Timer
cd habit-apps/meditation-timer
npm install  # first time only
npm run dev
# http://localhost:3001

# Terminal 3 - Stories Player
cd habit-apps/stories-player
npm install
npm run dev
# http://localhost:3002

# Terminal 4 - Yoga App
cd habit-apps/yoga-app
npm install
npm run dev
# http://localhost:3003

# Terminal 5 - Hydrate App
cd habit-apps/hydrate-app
npm install
npm run dev
# http://localhost:3004

# Terminal 6 - Read Timer
cd habit-apps/read-timer
npm install
npm run dev
# http://localhost:3005
```

### Step 3: Test Each App

#### Test Meditation Timer
1. Open http://localhost:3001
2. Click "5 min" button
3. Timer starts counting down
4. Click "Complete Session" button
5. ✅ Should see "Meditation complete! +2 RP earned"
6. Check Firestore: `ddhg_completions` collection should have new entry

#### Test Stories Player
1. Open http://localhost:3002
2. Click on a story (e.g., "The Enchanted Forest")
3. Story card shows selected
4. Click "Mark Complete" button
5. ✅ Should see "Story complete! +3 RP earned"
6. Check Firestore for new entry with `habitType: "sleeptime_stories"`

#### Test Yoga App
1. Open http://localhost:3003
2. Click emojis to select poses (or navigate with arrows)
3. When pose is selected, click "Hold Pose" to mark complete
4. At least one pose should show as completed (green)
5. Click "Complete Sequence" button
6. ✅ Should see "Yoga sequence complete! +2 RP earned"
7. Firestore: `habitType: "mindful_movements"`

#### Test Hydrate App
1. Open http://localhost:3004
2. Click "+ Add Glass" button 8 times to fill 8 glasses
3. Progress bar should fill to 100%
4. "Goal Reached!" button appears active
5. Click button
6. ✅ Should see "Goal reached! +4 RP earned" (8 glasses × 0.5)
7. Counter resets to 0
8. Firestore: `habitType: "hydration"`, `rp_earned: 4`

#### Test Read Timer
1. Open http://localhost:3005
2. Select a book (e.g., "Atomic Habits")
3. Click "30 min" button to start timer
4. Timer counts down (or click "Pause" to verify)
5. When ready, click "Session Complete" button
6. ✅ Should see "Reading session complete! +3 RP earned"
7. Firestore: `habitType: "reading"`, `rp_earned: 3`

### Step 4: Verify Real-Time Dashboard Updates

After completing habits in the apps:
1. Go to http://localhost:3000 (main DDHG dashboard)
2. **Check Earnings Dashboard:**
   - "Today's Earned RP" should increment (add base RPs from all completions)
   - "Streak Multiplier" should increase
   - "Projected Tokens" should update
3. **Check Daily Pie Chart:**
   - Your share % should increase
   - Tokens earned should increase
4. **Check Streak Multiplier:**
   - Progress bar should show active streak
   - Multiplier badge (🔥) should increase
5. **Check Golden Hat Tracker:**
   - After 30 consecutive days, seeds should appear

---

## 📊 Firestore Verification

### Check ddhg_completions Collection
```bash
# Firebase Console → Firestore → Collections → ddhg_completions

# Each entry should look like:
{
  userId: "user-xxx",
  habitType: "meditation",
  sourceApp: "meditation-timer",
  rp_earned: 2,
  timestamp: "2025-03-23T00:30:00Z",
  notes: "" (optional)
}
```

### Check ddhg_users Collection
```bash
# After 5 completions, user doc should show:
{
  userId: "user-xxx",
  todayRewardPoints: 12,    # sum of all RP for today
  totalRewardPoints: 12,    # cumulative
  streakDay: 1,             # increases each day with any completion
  multiplier: 1.467,        # 1.0 + (1 * 0.467)
  golden_seeds: 0,          # appears after 30-day streak
  lastHeartbeat: "2025-03-23T00:30:00Z"
}
```

---

## 🔧 Customization & Deployment

### Environment Variables
Each habit app reads `NEXT_PUBLIC_DDHG_API` for webhook target:
```bash
# Default: http://localhost:3000
# For production, set:
export NEXT_PUBLIC_DDHG_API=https://dont-die-habit-garden.vercel.app
```

### Production Deployment
1. **Deploy DDHG main app** to Vercel/production
2. **Update env vars** in each habit app with production URL
3. **Deploy each habit app** separately to Vercel
4. **Update links** in main `app/page.tsx` redirects to deployed URLs

---

## 📱 Mobile Testing

All apps are mobile-responsive. Test on:
- Chrome DevTools (F12 → Device Toggle)
- iPhone/Android actual devices
- Test on various screen sizes (320px to 1200px)

---

## ❌ Troubleshooting

### Webhook Returns 400
- Check `userId` is provided
- Check `habitType` matches one of the known types
- Verify JSON format is correct

### Firestore Not Updating
- Verify Firebase is initialized in `lib/firestoreIntegration.ts`
- Check browser console for auth errors
- Make sure DDHG is running locally on port 3000

### Timer Not Counting
- Check browser console for errors
- Verify `setInterval` is working (not blocked by browser)
- Try clearing browser cache

### Habit Apps Won't Start
- Ensure Node.js 18+ installed: `node --version`
- Delete `node_modules` and `npm install` again
- Check ports 3001-3005 are available: `lsof -i :3001`

---

## 🎯 Success Criteria

✅ All 5 apps launch without errors
✅ Each app's complete button fires webhook (check network tab)
✅ Webhook returns 200 OK with completion data
✅ Firestore `ddhg_completions` updated with new entry
✅ Dashboard updates in real-time (refresh or auto-poll every 30s)
✅ RP values accumulate correctly
✅ Multiplier increases with consecutive days

---

## 📝 Notes

- **User IDs** are auto-generated per-app (stored in localStorage)
- **Same user can use all 5 apps** by sharing user ID
- **Timestamps** are UTC
- **Multiplier formula**: 1.0 + (streakDay × 0.467), capped at 15.0
- **Golden seeds** awarded when streak ≥ 30 days (one per 30-day milestone)

---

**Ready to test? Start with Step 1 and follow through!**
