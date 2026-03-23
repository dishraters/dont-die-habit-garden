# DEFINITION OF DONE - DDHG Complete Rebuild

**Acceptance Criteria:** ALL items must be 100% complete and tested.

---

## ✅ PLANT GROWTH LOGIC

### Code Changes
- [ ] `lib/plantGraphics.ts`: `getPlantStage()` uses `totalDDC` parameter (not `streak`)
- [ ] `app/components/PlantCard.tsx`: Accepts `totalDDC` prop (not per-habit streak)
- [ ] `app/page.tsx`: Passes `totalDDC` to PlantCard

### Behavior
- [ ] Plant emoji shows: 🌱 (0-100) → 🌿 (101-300) → 🌲 (301-700) → 🌳 (701-1200) → 🌲✨ (1201-2000) → 🌴 (2001-3500) → 🌳👑 (3501+)
- [ ] Progress bar shows progress to next stage (not next day)
- [ ] Completing habits updates plant stage immediately
- [ ] Plant emoji changes in real-time as tokens accumulate
- [ ] No console errors related to plant logic

### Testing
- [ ] Test with 0 tokens → shows 🌱 Seed
- [ ] Test with 150 tokens → shows 🌿 Sprout
- [ ] Test with 500 tokens → shows 🌲 Young Tree
- [ ] Test with 1000 tokens → shows 🌳 Mature Tree
- [ ] Test with 1500 tokens → shows 🌲✨ Thriving
- [ ] Test with 2500 tokens → shows 🌴 Flourishing
- [ ] Test with 3500+ tokens → shows 🌳👑 Monument

---

## ✅ HABIT GARDEN PAGES

### Gratitude Page: `/gratitude`
- [ ] Page loads without 404 error
- [ ] Form has 3 input fields for "things grateful for"
- [ ] Form has 1 input field for "affirmation"
- [ ] Save button submits form
- [ ] Webhook fires to DDHG with correct payload
- [ ] Success message displays: "✅ Gratitude logged! +2 tokens"
- [ ] Page auto-redirects to DDHG after 2 seconds
- [ ] Mobile responsive
- [ ] No console errors

### Planning Page: `/planning`
- [ ] Page loads without 404 error
- [ ] Form accepts 3+ big wins (input or textarea)
- [ ] Save button submits form
- [ ] Webhook fires with big_wins array
- [ ] Success message displays: "✅ Plan logged! +2 tokens"
- [ ] Page auto-redirects after 2s
- [ ] Mobile responsive
- [ ] No console errors

### Meditation Page: `/meditation`
- [ ] Page loads without 404 error
- [ ] Timer component displays
- [ ] Start/stop/reset buttons work
- [ ] Minimum 5 minutes enforced (can't submit < 5 min)
- [ ] Webhook fires when timer completes
- [ ] Success message displays: "✅ Meditation logged! +2 tokens"
- [ ] Page auto-redirects after 2s
- [ ] Mobile responsive
- [ ] No console errors

### Sleep Page: `/sleep`
- [ ] Page loads without 404 error
- [ ] Form has hours input (number field, minimum 7)
- [ ] Form has optional bedtime/wake time fields
- [ ] Save button submits form
- [ ] Webhook fires with correct payload
- [ ] Success message displays: "✅ Sleep logged! +2 tokens"
- [ ] Page auto-redirects after 2s
- [ ] Mobile responsive
- [ ] No console errors

---

## ✅ DISHRATED PAGES

### Breakfast Page: `/breakfast`
- [ ] Page loads without 404 error
- [ ] Form has meal name input
- [ ] Form has health score slider (1-10)
- [ ] Minimum health score 5 enforced
- [ ] Save button submits form
- [ ] Webhook fires to DDHG with correct payload
- [ ] Success message displays: "✅ Breakfast logged! +1 token"
- [ ] Page auto-redirects to DDHG after 2s
- [ ] Mobile responsive
- [ ] No console errors

### Lunch Page: `/lunch`
- [ ] Same as breakfast
- [ ] Success message shows "+1 token"

### Dinner Page: `/dinner`
- [ ] Same as breakfast
- [ ] Success message shows "+1 token"

---

## ✅ TRAINLOG DEPLOYMENT

### Code & Deployment
- [ ] TrainLog converted to Next.js (from HTML)
- [ ] TrainLog deployed to Vercel
- [ ] Live URL accessible (no 404)
- [ ] package.json has all dependencies
- [ ] Build passes without errors (`npm run build` succeeds)

### Exercise Page: `/exercise`
- [ ] Page loads without 404 error
- [ ] Form has exercise type dropdown (running, strength, yoga, sports, etc.)
- [ ] Form has duration input (minutes)
- [ ] Form has intensity input (1-10)
- [ ] Minimum enforced: 20+ minutes OR 5+ intensity
- [ ] Save button submits form
- [ ] Webhook fires to DDHG with correct payload
- [ ] Success message displays: "✅ Exercise logged! +3 tokens"
- [ ] Page auto-redirects to DDHG after 2s
- [ ] Mobile responsive
- [ ] No console errors

---

## ✅ DDHG REDIRECTS

### Code Changes
- [ ] `app/page.tsx`: `handleHabitAction()` redirects instead of opening modals
- [ ] Habit buttons map to correct URLs
- [ ] External habits open in new tab/window
- [ ] Stretching still uses modal (native to DDHG)

### Redirect Links
- [ ] 🧘 Meditation → https://habit-garden-iota.vercel.app/meditation ✓ (works, no 404)
- [ ] 📋 Planning → https://habit-garden-iota.vercel.app/planning ✓ (works, no 404)
- [ ] 🙏 Gratitude → https://habit-garden-iota.vercel.app/gratitude ✓ (works, no 404)
- [ ] 🌙 Sleep → https://habit-garden-iota.vercel.app/sleep ✓ (works, no 404)
- [ ] 🍳 Breakfast → https://dishrated.com/breakfast ✓ (works, no 404)
- [ ] 🥗 Lunch → https://dishrated.com/lunch ✓ (works, no 404)
- [ ] 🍽️ Dinner → https://dishrated.com/dinner ✓ (works, no 404)
- [ ] 💪 Exercise → https://trainlog-xyz.vercel.app/exercise ✓ (works, no 404)
- [ ] 🤸 Stretching → Modal in DDHG ✓ (still works)

### User Flow Testing
- [ ] Click habit in DDHG → new tab opens with correct app page ✓
- [ ] User fills form in external app → webhook fires ✓
- [ ] DDHG updates immediately after webhook (tokens, plant) ✓
- [ ] Redirect message appears + user returned to DDHG ✓

---

## ✅ WEBHOOK VALIDATION

### All Webhooks Fire Correctly
- [ ] Habit Garden `/gratitude` webhook → DDHG receives data
- [ ] Habit Garden `/planning` webhook → DDHG receives data
- [ ] Habit Garden `/meditation` webhook → DDHG receives data
- [ ] Habit Garden `/sleep` webhook → DDHG receives data
- [ ] Dishrated `/breakfast` webhook → DDHG receives data
- [ ] Dishrated `/lunch` webhook → DDHG receives data
- [ ] Dishrated `/dinner` webhook → DDHG receives data
- [ ] TrainLog `/exercise` webhook → DDHG receives data

### Firestore Verification
- [ ] Firestore `habits_completions` collection updated for each habit
- [ ] Firestore `user_streaks` incremented correctly
- [ ] Firestore `user_tokens` updated with correct token amount
- [ ] Firestore `total_ddc` reflects new cumulative total

---

## ✅ DDHG APP VERIFICATION

### Dashboard Updates
- [ ] Daily habit count updates (e.g., "3/9 completed")
- [ ] Daily token count updates (e.g., "+5 today")
- [ ] Total tokens display updates (e.g., "245 total")
- [ ] Plant emoji updates as tokens accumulate
- [ ] All displays are real-time (no page refresh needed)

### No Errors
- [ ] Browser console: No errors
- [ ] Browser console: No warnings about missing data
- [ ] Network tab: All API calls return 200/201 status
- [ ] No 404 errors on any page

---

## ✅ STYLING & UX

### All Pages
- [ ] Consistent styling across all apps (Habit Garden, Dishrated, TrainLog, DDHG)
- [ ] Mobile responsive (tested on 375px width)
- [ ] Tablet responsive (tested on 768px width)
- [ ] Desktop responsive (tested on 1920px width)
- [ ] Forms have clear labels
- [ ] Buttons are clickable and responsive
- [ ] Success messages are visible and clear
- [ ] Loading states shown if applicable

### No Console Errors
- [ ] Browser console: Clean (no errors or warnings)
- [ ] Network requests: All successful
- [ ] React warnings: None about missing keys or prop types

---

## ✅ FINAL VALIDATION

### End-to-End Testing
- [ ] User logs into DDHG
- [ ] User clicks 🙏 Gratitude → redirects to Habit Garden
- [ ] User fills gratitude form → webhook fires
- [ ] DDHG updates: tokens +2, plant grows, display refreshes
- [ ] User clicks 🍳 Breakfast → redirects to Dishrated
- [ ] User fills meal form → webhook fires
- [ ] DDHG updates: tokens +1, display refreshes
- [ ] User clicks 💪 Exercise → redirects to TrainLog
- [ ] User fills exercise form → webhook fires
- [ ] DDHG updates: tokens +3, display refreshes
- [ ] User clicks 🤸 Stretching → modal opens in DDHG
- [ ] User fills form → tokens awarded immediately
- [ ] Plant emoji matches cumulative tokens correctly

### Deployment
- [ ] All apps deployed to Vercel ✓
- [ ] All pages live and accessible ✓
- [ ] No 404 errors ✓
- [ ] All webhooks configured ✓

---

## 🔴 IF NOT MET: REQUIRED FIXES

**If ANY checkbox is unchecked, specify:**
1. Which item failed
2. Expected behavior
3. Actual behavior
4. Exact code changes needed
5. Files to modify

**Then re-run testing until ALL boxes are checked.**

---

## ✅ SIGN-OFF

When all items are checked:

1. Commit to Git with message: `"DDHG Complete: Plant growth, redirects, webhooks all working"`
2. Push to main
3. Share Vercel links with Sam
4. Notify: "Definition of Done 100% complete. App ready for use."
