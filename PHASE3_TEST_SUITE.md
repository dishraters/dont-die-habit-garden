# PHASE 3 Test Suite

## Pre-Test Checklist

- [ ] DDHG running locally at http://localhost:3000
- [ ] Firebase authenticated (user logged in)
- [ ] Firestore security rules deployed
- [ ] All 5 habit apps built locally
- [ ] Node dependencies installed for all repos
- [ ] Environment variables set (.env.local)

---

## TEST 1: Component Integration

**Objective:** Verify all 4 Phase 3 components render on dashboard

### Steps
1. Open http://localhost:3000
2. Scroll dashboard

### Expected Results
- ✅ EarningsDashboard appears (6 cards visible)
- ✅ DailyPieChart appears (pie chart SVG)
- ✅ StreakMultiplier appears (progress bar)
- ✅ GoldenHatTracker appears (seed counter)
- ✅ No console errors
- ✅ No TypeScript errors in build

### Pass/Fail
- **PASS** if all components visible and no errors
- **FAIL** if any component missing or console errors

---

## TEST 2: Webhook Endpoint (Meditation)

**Objective:** Verify /api/heartbeat/complete endpoint accepts requests

### Setup
```bash
# Get test user ID
# Open http://localhost:3000 in incognito
# Login with test account
# Check DevTools → Application → LocalStorage: ddhg_user
# Copy the userId
```

### Steps
1. Call POST /api/heartbeat/complete with meditation habit
2. Verify response
3. Check Firestore
4. Verify dashboard updates

### Test Code
```bash
USER_ID="YOUR_USER_ID"

curl -X POST http://localhost:3000/api/heartbeat/complete \
  -H "Content-Type: application/json" \
  -d "{
    \"habitType\": \"meditation\",
    \"userId\": \"$USER_ID\",
    \"rp_earned\": 2,
    \"sourceApp\": \"meditation-timer\"
  }"
```

### Expected Results
```json
{
  "success": true,
  "message": "Habit 'meditation' completed",
  "user_daily_rp": 2,
  "user_total_rp": 2,
  "streak_day": 1,
  "streak_multiplier": 1.0,
  "final_rp": 2.0,
  "estimated_tokens": 2.00,
  ...
}
```

### Firestore Check
- Go to Firebase Console
- Collection: `ddhg_completions`
- Document: `{today}/{userId}/{completionId}`
- Should see: habitType: "meditation", rp_earned: 2

### Dashboard Check
- Refresh http://localhost:3000
- EarningsDashboard: "Today's Earned RP" = 2
- DailyPieChart: user has slice of pie
- StreakMultiplier: shows 1× multiplier

### Pass/Fail
- **PASS** if response succeeds + Firestore has entry + dashboard updates
- **FAIL** if any step fails

---

## TEST 3: Multiple Habits (Cumulative RP)

**Objective:** Verify RP accumulates across multiple habits

### Steps
1. Call webhook for meditation (+2 RP)
2. Call webhook for stories (+3 RP)
3. Call webhook for yoga (+2 RP)
4. Verify dashboard shows 7 RP total

### Test Code
```bash
USER_ID="YOUR_USER_ID"

# Meditation (2 RP)
curl -X POST http://localhost:3000/api/heartbeat/complete \
  -H "Content-Type: application/json" \
  -d '{"habitType":"meditation","userId":"'$USER_ID'","rp_earned":2,"sourceApp":"meditation-timer"}'

# Stories (3 RP)
curl -X POST http://localhost:3000/api/heartbeat/complete \
  -H "Content-Type: application/json" \
  -d '{"habitType":"sleeptime_stories","userId":"'$USER_ID'","rp_earned":3,"sourceApp":"stories-player"}'

# Yoga (2 RP)
curl -X POST http://localhost:3000/api/heartbeat/complete \
  -H "Content-Type: application/json" \
  -d '{"habitType":"mindful_movements","userId":"'$USER_ID'","rp_earned":2,"sourceApp":"yoga-app"}'

# Check final state
curl http://localhost:3000/api/heartbeat/status?userId=$USER_ID
```

### Expected Results
- Total RP in responses: 2, 5, 7
- Final EarningsDashboard: 7 RP
- DailyPieChart updated 3 times
- Firestore: 3 entries in ddhg_completions

### Pass/Fail
- **PASS** if RP accumulates correctly
- **FAIL** if RP resets or doesn't accumulate

---

## TEST 4: Streak Multiplier

**Objective:** Verify streak multiplier calculates correctly

### Setup
```bash
# Create test user with streak
# Use bypassPermissions to set streakDay = 5 in ddhg_users
```

### Steps
1. User has 5-day streak
2. Complete meditation (+2 base RP)
3. Response should show: multiplier = 1.4×, final = 2.8 RP

### Test Code
```bash
USER_ID="YOUR_USER_ID"

# First, set user's streak to 5 (via Firestore directly)
# Then call webhook
curl -X POST http://localhost:3000/api/heartbeat/complete \
  -H "Content-Type: application/json" \
  -d '{"habitType":"meditation","userId":"'$USER_ID'","rp_earned":2}'
```

### Expected Response
```json
{
  "success": true,
  "user_daily_rp": 2,
  "streak_day": 5,
  "streak_multiplier": 1.4,
  "final_rp": 2.8,
  ...
}
```

### Pass/Fail
- **PASS** if multiplier = 1.4× and final_rp = 2.8
- **FAIL** if multiplier calculation wrong

---

## TEST 5: Golden Seeds (30+ Day Streak)

**Objective:** Verify golden seeds awarded on day 30+

### Setup
```bash
# Set user's streak to 29
# Complete meditation to trigger day 30
```

### Steps
1. User completes habit on day 30
2. Response should include: golden_seed_awarded: true
3. Firestore: golden_seeds count incremented

### Test Code
```bash
# Set user streak to 29, then complete
curl -X POST http://localhost:3000/api/heartbeat/complete \
  -H "Content-Type: application/json" \
  -d '{"habitType":"meditation","userId":"'$USER_ID'"}'
```

### Expected Response
```json
{
  "success": true,
  "golden_seed_awarded": true,
  ...
}
```

### Firestore Check
- ddhg_users/{userId}.golden_seeds = 1

### Pass/Fail
- **PASS** if golden_seed_awarded in response
- **FAIL** if flag missing or count not incremented

---

## TEST 6: DailyPieChart Updates

**Objective:** Verify pie chart reflects user's share of daily pool

### Setup
- 3 test users
- User A: 5 RP, User B: 3 RP, User C: 2 RP
- Total: 10 RP
- Pool size: 2739.72 tokens

### Steps
1. Each user completes habits
2. Open dashboard for User A
3. Check pie chart: User A's slice = 50% of pool

### Calculation
```
User A share = 5/10 = 50%
User A tokens = 0.5 × 2739.72 = 1369.86 tokens
```

### Expected Result
- Pie chart shows User A: 50%
- Tooltip: "1369.86 tokens"
- DailyPieChart label: "50.00%"

### Pass/Fail
- **PASS** if slice size = 50% visually + text shows correct %
- **FAIL** if pie chart wrong size or percentage incorrect

---

## TEST 7: EarningsDashboard Cards

**Objective:** Verify all 6 cards show correct data

### Card 1: Today's Earned RP
- Expected: Shows habit RP from today
- Value: 2 (for one meditation)

### Card 2: Streak Multiplier
- Expected: Shows current streak multiplier
- Value: 1.0× (day 1) or higher

### Card 3: Projected Tokens
- Expected: Shows estimated tokens based on pool share
- Value: (earned_rp × multiplier) / total_rp × pool_size

### Card 4: Last Distribution
- Expected: Shows timestamp of last heartbeat
- Value: "Today at HH:MM" or "Pending"

### Card 5: Lifetime Tokens
- Expected: Shows totalTokens from ddhg_users
- Value: Sum of all tokens earned

### Card 6: Golden Seeds
- Expected: Shows count of 30+ day streaks
- Value: 0 (unless day 30+ reached)

### Pass/Fail
- **PASS** if all 6 cards visible with correct values
- **FAIL** if any card missing or shows wrong value

---

## TEST 8: Real-Time Updates (Polling)

**Objective:** Verify dashboard polls API and updates in real-time

### Setup
- User logged in
- Dashboard open
- Open browser console

### Steps
1. Complete habit in meditation-timer app
2. Watch browser Network tab for /api/heartbeat/status calls
3. Watch EarningsDashboard card update

### Expected Results
- Webhook call to /api/heartbeat/complete succeeds
- Within 5 seconds, /api/heartbeat/status called
- EarningsDashboard updates within 30 seconds
- No console errors
- Network tab shows successful responses

### Pass/Fail
- **PASS** if all updates complete within 30 seconds
- **FAIL** if dashboard doesn't update or errors in console

---

## TEST 9: 5 Habit Apps Build & Deploy

**Objective:** Verify all 5 apps build without errors

### Steps
```bash
# For each app directory:
cd meditation-timer && npm install && npm run build
cd ../stories-player && npm install && npm run build
cd ../yoga-app && npm install && npm run build
cd ../hydrate-app && npm install && npm run build
cd ../read-timer && npm install && npm run build
```

### Expected Results
- ✅ All builds succeed (exit code 0)
- ✅ .next directories created
- ✅ No build errors
- ✅ All TypeScript checks pass

### Pass/Fail
- **PASS** if all 5 builds succeed
- **FAIL** if any build fails

---

## TEST 10: Webhook Firing from Apps

**Objective:** Verify each app's completion button fires webhook correctly

### Setup
- All 5 apps running locally on ports 3001-3005
- User logged in to each app
- Browser console open

### Test Each App:

#### Meditation Timer
1. Click "5 min" button
2. Timer counts down
3. Click "Complete" at end
4. Console should log successful webhook response

#### Stories Player
1. Select story
2. Click "Play"
3. Wait for audio to "complete" (skip with button)
4. Click "Mark Complete"
5. Console logs success

#### Yoga App
1. See pose carousel
2. Scroll through 5 poses
3. Click "Complete Sequence"
4. Console logs success

#### Hydration Tracker
1. See water glasses
2. Click 8 glasses to fill them
3. On 8th glass, "Daily Goal Reached" message
4. Webhook fires, console logs success

#### Reading Timer
1. Select book
2. Set timer (5 min)
3. Click "Start"
4. Click "Complete Session" at end
5. Console logs success

### Expected Console Output
```
✅ Habit completed!
{
  success: true,
  user_daily_rp: 2,
  estimated_tokens: 1.87,
  ...
}
```

### Pass/Fail
- **PASS** if all 5 apps fire webhooks successfully
- **FAIL** if any app's webhook fails or errors

---

## TEST 11: End-to-End User Journey

**Objective:** Simulate complete user flow

### Journey
```
1. Login to DDHG dashboard
2. See EarningsDashboard (0 RP, 0 tokens)
3. Click "Meditation" link → opens meditation-timer app
4. Complete 5-min meditation
5. Click "Complete" → webhook fires
6. Return to dashboard (or refresh)
7. See EarningsDashboard updated (+2 RP)
8. See DailyPieChart with user's slice
9. See StreakMultiplier showing 1×
10. Click "Stories" link → opens stories-player
11. Complete story
12. Dashboard updates (+3 RP, total 5)
13. Repeat for yoga (+2 RP, total 7)
14. Repeat for hydration (+1 RP, total 8)
15. Repeat for reading (+3 RP, total 11)
16. Final state: 11 RP, 25 possible
```

### Verification Points
- [ ] Step 2: Dashboard shows 0/0 initially
- [ ] Step 5: Webhook succeeds
- [ ] Step 7: Dashboard shows +2 RP
- [ ] Step 8: Pie chart has user slice
- [ ] Step 12: Total = 5 RP
- [ ] After all 5: Total = 11 RP
- [ ] No errors in console
- [ ] Firestore has 5 ddhg_completions entries

### Pass/Fail
- **PASS** if full journey completes without errors, data accurate
- **FAIL** if any step fails or data incorrect

---

## TEST 12: Firestore Consistency Check

**Objective:** Verify Firestore data integrity after all tests

### Checks

**ddhg_users/{userId}:**
- ✅ totalRewardPoints = sum of all rp_earned
- ✅ todayRewardPoints = sum of today's RP
- ✅ streakDay ≥ 1
- ✅ golden_seeds ≥ 0
- ✅ updated_at is recent timestamp

**ddhg_completions/{today}/{userId}:**
- ✅ 11 entries (one per habit)
- ✅ Each entry has habitType, rp_earned, sourceApp
- ✅ No duplicate habitTypes in single day
- ✅ All timestamps recent

**heartbeat_state/{today}:**
- ✅ Document exists
- ✅ total_network_rp = sum of all user daily RP
- ✅ total_pool = base pool size
- ✅ user_count ≥ 1

### Pass/Fail
- **PASS** if all Firestore data consistent and complete
- **FAIL** if any data missing or inconsistent

---

## Summary

Total Tests: 12
Time per test: 3-5 minutes
Total time: 45-60 minutes

**Critical Path (must pass before production):**
1. Component Integration
2. Webhook Endpoint
3. Multiple Habits
4. End-to-End Journey
5. Firestore Consistency

**Nice to Have (optional):**
6. Streak Multiplier (requires data setup)
7. Golden Seeds (requires data setup)
8. DailyPieChart Updates
9. EarningsDashboard Cards
10. Real-Time Updates

**Build Tests:**
11. 5 Habit Apps Build
12. Webhook Firing from Apps

---

## Success Criteria

✅ All critical path tests pass
✅ All 5 apps build without errors
✅ All 5 webhooks fire successfully
✅ Firestore data is consistent
✅ No console errors
✅ Dashboard updates in real-time
✅ Components visible and functional
✅ RP calculations correct
✅ Multipliers work as expected
✅ End-to-end user journey works

---

**Estimated Time to Complete:** 1 hour
**Pass/Fail Threshold:** 10/12 tests must pass
**Production Readiness:** When all critical path tests pass + no console errors

---

**Last Updated:** March 23, 2026, 00:24 AM EDT
