# DDHG Test Cases - Full Validation

**Date:** March 22, 2026 23:26 EDT  
**Status:** Running comprehensive tests

---

## TEST 1: App Loads & UI Renders

**Steps:**
1. Open https://dont-die-habit-garden.vercel.app
2. Wait for page load
3. Check for login/signup screen

**Expected:**
- Page loads in <3 seconds
- Login screen visible
- No console errors
- Gradient background visible (purple)

**Result:** [ ]

---

## TEST 2: User Authentication

**Steps:**
1. Click "Sign up"
2. Enter email: test@example.com
3. Enter password: test123456
4. Click submit
5. Check localStorage for user data

**Expected:**
- User account created
- Redirected to dashboard
- User data stored in localStorage
- No auth errors in console

**Result:** [ ]

---

## TEST 3: Dashboard Renders with Correct Data

**Steps:**
1. After signup, check dashboard
2. Look for:
   - 9 habit buttons visible
   - Plant emoji visible
   - Token count display
   - Daily progress counter

**Expected:**
- All 9 habits shown: 🧘 🍳 🥗 🍽️ 💪 📋 🙏 🌙 🤸
- Plant shows 🌱 (seed) at 0 tokens
- "0/9 Today's Habits" counter
- "+0 DDC Earned Today"
- "0 Total DDC"

**Result:** [ ]

---

## TEST 4: Habit Redirect - Gratitude Page

**Steps:**
1. Click 🙏 Gratitude button
2. Check if new tab opens
3. Verify URL is https://habit-garden-iota.vercel.app/gratitude
4. Page should load with form
5. Fill 3 things grateful for
6. Click "Save Gratitude"

**Expected:**
- New tab opens to Gratitude page
- Form renders without 404
- "Save Gratitude" button works
- Success message: "✅ Gratitude Logged! +2 tokens awarded"
- Auto-redirect back to DDHG
- No console errors on either app

**Result:** [ ]

---

## TEST 5: Webhook Fires & Tokens Award

**Steps:**
1. After saving gratitude (Test 4)
2. Return to DDHG tab
3. Wait 2 seconds
4. Check if:
   - Daily tokens increased (+2)
   - Total tokens increased
   - Habit marked as complete

**Expected:**
- "+2 DDC Earned Today" (or higher if test repeated)
- "1/9 Today's Habits" counter updated
- Gratitude button shows "✅ Completed Today"
- Webhook successfully fired

**Result:** [ ]

---

## TEST 6: Plant Growth - Cumulative Tokens

**Steps:**
1. Complete multiple habits to reach token thresholds
2. At 100 tokens: plant should become 🌿 (Sprout)
3. At 300 tokens: plant should become 🌲 (Young Tree)
4. Check plant emoji updates in real-time

**Expected:**
- Plant emoji changes as tokens accumulate
- Progress bar shows progress to next stage
- Label updates: "Seed" → "Sprout" → "Young Tree" etc.
- No lag or delays in updates

**Result:** [ ]

---

## TEST 7: Meal Logging - Dishrated Redirect

**Steps:**
1. Click 🍳 Breakfast button
2. Verify redirects to https://dishrated.com/breakfast
3. Fill meal name: "Eggs and toast"
4. Set health score: 7/10
5. Click "Save Breakfast"

**Expected:**
- Opens Dishrated breakfast page (no 404)
- Form displays correctly
- Health score validation: minimum 5/10 enforced
- Success message: "✅ Breakfast Logged! +1 token awarded"
- Auto-redirect to DDHG
- DDHG updates with +1 token

**Result:** [ ]

---

## TEST 8: Exercise Logging - TrainLog Redirect

**Steps:**
1. Click 💪 Exercise button
2. Verify redirects to https://trainlog-next.vercel.app/exercise
3. Select exercise type: "Running"
4. Enter duration: 25 minutes
5. Set intensity: 6/10
6. Click "Save Exercise"

**Expected:**
- Opens TrainLog exercise page (no 404)
- Dropdown shows exercise types
- Duration and intensity sliders work
- Validation: minimum 20 min OR 5+ intensity
- Success message: "✅ Exercise Logged! +3 tokens awarded"
- Auto-redirect to DDHG
- DDHG updates with +3 tokens

**Result:** [ ]

---

## TEST 9: Native Modal - Stretching

**Steps:**
1. Click 🤸 Stretching button
2. Check if modal opens (NOT redirect)
3. Fill form: 15 minutes
4. Click submit

**Expected:**
- Modal opens in DDHG (same tab)
- Form renders inside modal
- Submit works without redirect
- Tokens awarded immediately
- Modal closes
- No redirect to external app

**Result:** [ ]

---

## TEST 10: Meditation Timer - Habit Garden

**Steps:**
1. Click 🧘 Meditation button
2. Redirects to https://habit-garden-iota.vercel.app/meditation
3. Click "Start" button
4. Wait 30 seconds
5. Click "Stop"
6. Click "Save Meditation"

**Expected:**
- Timer page loads (no 404)
- Timer starts and counts up
- Start/Stop/Reset buttons work
- Minimum 5 minutes enforced (validation)
- After 5 min: Save button enabled
- Success message: "✅ Meditation Logged! +2 tokens awarded"
- Auto-redirect to DDHG

**Result:** [ ]

---

## TEST 11: Sleep Logging - Habit Garden

**Steps:**
1. Click 🌙 Sleep button
2. Redirects to https://habit-garden-iota.vercel.app/sleep
3. Set hours slept: 8
4. Set bedtime: 22:00
5. Set wake time: 06:00
6. Click "Save Sleep"

**Expected:**
- Sleep form loads (no 404)
- Sliders work correctly
- Minimum 7 hours enforced
- Success message: "✅ Sleep Logged! +2 tokens awarded"
- Auto-redirect to DDHG
- DDHG updates with +2 tokens

**Result:** [ ]

---

## TEST 12: Planning - Habit Garden

**Steps:**
1. Click 📋 Planning button
2. Redirects to https://habit-garden-iota.vercel.app/planning
3. Fill 3 big wins:
   - Win 1: "Complete project"
   - Win 2: "Call a friend"
   - Win 3: "Review code"
4. Click "Save Plan"

**Expected:**
- Planning page loads (no 404)
- Form accepts 3+ wins
- Validation: minimum 3 required
- Success message: "✅ Plan Logged! +2 tokens awarded"
- Auto-redirect to DDHG
- DDHG updates with +2 tokens

**Result:** [ ]

---

## TEST 13: Console Errors Check

**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Refresh DDHG app
4. Click through all habits
5. Check for any red errors

**Expected:**
- Console clean (no red errors)
- No TypeScript errors
- No network 404s
- No async/await issues
- No Firebase errors

**Result:** [ ]

---

## TEST 14: Network Requests - Webhooks Firing

**Steps:**
1. Open DevTools Network tab
2. Complete a habit (e.g., gratitude)
3. Look for POST requests to /api/webhooks/*
4. Check request payload
5. Check response status (should be 200/201)

**Expected:**
- POST request to /api/webhooks/habit-garden
- Payload includes: habitType, tokens, timestamp
- Response status: 200 or 201
- Firestore updated (check backend)

**Result:** [ ]

---

## TEST 15: Mobile Responsiveness

**Steps:**
1. Open DevTools → Device toolbar
2. Set viewport to iPhone 12 (390x844)
3. Test all pages:
   - DDHG dashboard
   - Gratitude form
   - Meditation timer
   - Breakfast form
   - Sleep form
   - Planning form
   - Exercise form

**Expected:**
- All pages render correctly on mobile
- Buttons are clickable
- Forms are readable
- No horizontal scroll
- Text is sized appropriately

**Result:** [ ]

---

## TEST 16: Firestore Data Persistence

**Steps:**
1. Complete 5 habits
2. Check Firestore console
3. Verify:
   - habits_completions collection has entries
   - user_streaks updated
   - user_tokens correct
   - total_ddc matches UI

**Expected:**
- Firestore has all completion records
- Streak counts match habits
- Total tokens match dashboard display
- Timestamps are correct

**Result:** [ ]

---

## SUMMARY

**Total Tests:** 16  
**Passed:** [ ]/16  
**Failed:** [ ]/16  
**Blocked:** [ ]/16

**Critical Failures:**
(List any must-fix issues)

**Minor Issues:**
(List any nice-to-have fixes)

---

## GO/NO-GO DECISION

**Ready for production?**
- [ ] YES - All 16 tests passed
- [ ] NO - Critical failures found

