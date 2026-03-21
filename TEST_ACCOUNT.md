# 🌱 DDHG - Test Account Credentials

**Status:** MVP (No auth required yet)  
**Test URL:** http://localhost:3002 (local) or https://dont-die-habit-garden.vercel.app (live)

---

## 🔓 LOCAL TESTING (No Login Required)

**Current Setup:**
- No authentication system yet
- Automatically logs in test user on page load
- User ID: `test-user-[timestamp]`
- Data stored in browser state (session-only)

**What This Means:**
- ✅ No sign-up needed
- ✅ No password needed
- ❌ Data resets on page reload
- ❌ Data doesn't sync between browsers/devices

---

## 🧪 TEST SCENARIOS

### Test 1: Mark Individual Habits
1. Open http://localhost:3002
2. See 9 habit cards
3. Click "Mark Complete" on Gratitude card (gold)
4. See:
   - Button changes to "✅ Completed Today" (green)
   - DDC counter shows "+10" (bottom left)
   - Progress bar increases
   - Plant changes emoji slightly (visual feedback)
5. Refresh page → resets (expected MVP behavior)

### Test 2: Complete All 9 Habits
1. Open dashboard
2. Click "Mark Complete" on each of 9 habits:
   - Gratitude (gold)
   - Meditation (blue) → opens modal
   - Training (red)
   - Breakfast (orange)
   - Lunch (green)
   - Dinner (purple)
   - Sleeptime Stories (pink) → opens modal
   - Planning (cyan)
   - Mindful Movements (teal) → opens modal
3. After all 9: DDC counter shows "+100" (bonus!)
4. All cards show "✅ Completed Today"

### Test 3: Meditation Modal
1. Click on Meditation card (blue plant)
2. Modal opens with:
   - Title: "🧘 Meditation"
   - Subtitle: "5 min Nature Soundscape"
   - Large blue emoji: 🌿
   - Description: "Listen to calming nature sounds..."
   - Progress bar (empty)
   - Play/Pause button (shows ▶ Play)
   - Complete & Close buttons
3. Click ▶ Play
   - Button changes to ⏸ Pause
   - Progress bar starts moving
   - Timer increments: 0:00 → 0:01 → etc.
4. Click ✅ Complete
   - Modal closes
   - Meditation habit marked complete
   - DDC updates
   - Plant shows as complete
5. Click ✕ Close
   - Modal closes without marking complete
   - Habit still shows "Mark Complete"

### Test 4: Sleeptime Stories Modal
1. Click on Sleeptime Stories card (pink)
2. Modal opens with:
   - 5 story buttons: "First", "Water", "Wings", "Standing", "Sparks"
   - Current story display: title + description
   - Play/Pause button
   - Progress bar
3. Click "Water" button (switches story)
   - Title changes: "From Water to Land"
   - Description changes
   - Progress bar resets
4. Click ▶ Play
   - Button changes to ⏸ Pause
   - Timer starts
5. Cycle through all 5 stories:
   1. The First Breath (ancient cells)
   2. From Water to Land (ocean→land)
   3. Wings & Wonder (flight)
   4. Standing Tall (upright humans)
   5. Sparks of Consciousness (language)
6. Click ✅ Complete
   - Modal closes
   - Habit marked complete
   - DDC +10

### Test 5: Mindful Movements Carousel
1. Click on Mindful Movements card (teal)
2. Modal opens with:
   - Pose 1/5 displayed: "Child Pose" 🙏
   - Description: "Relax your shoulders..."
   - Benefits: "Calms the nervous system..."
   - 5 navigation dots (first is highlighted blue)
   - "Mark Pose Complete" button
   - "← Back" & "Next →" buttons (Back disabled on pose 1)
3. Click "Mark Pose Complete"
   - Button changes to "✅ Pose Complete" (gray)
   - First dot changes to green
   - Can't click button again (disabled)
4. Click "Next →"
   - Pose 2/5: "Cat-Cow Stretch" 🐱
   - Description & benefits update
   - Second dot now highlighted blue
5. Click navigation dot 3
   - Jump to pose 3/5: "Forward Fold" 📖
   - Dot 3 highlighted
6. Complete poses 2-5:
   - Mark each complete
   - Navigate forward/back
   - All dots turn green
7. After pose 5 complete:
   - "🎉 All Done! Complete Habit" button appears
8. Click "All Done! Complete Habit"
   - Modal closes
   - Mindful Movements marked complete
   - DDC +10
   - Plant shows completed

---

## 📊 DEMO DATA (Hardcoded for MVP)

**Streaks (days on plant):**
```
Gratitude:         12 🔥
Meditation:        12 🔥
Training:           8 🔥
Breakfast:         12 🔥
Lunch:             12 🔥
Dinner:            12 🔥
Sleeptime Stories:  5 🔥
Planning:          12 🔥
Mindful Movements:  2 🔥
```

**DDC:**
- Starting balance: 1,250 🪙
- Today earned: 0 (resets at midnight)
- Earn 10 per habit, 100 if all 9 done

**Plant Stages:**
- Seed 🌱: 0 days
- Sprout 🌿: 7+ days
- Growing 🌾: 30+ days
- Thriving 🌳: 60+ days
- Legendary ✨: 365+ days

---

## 🎨 COLORS & PLANT NAMES

| Habit | Plant Name | Color | Emoji Stage |
|-------|-----------|-------|----------|
| 🙏 Gratitude | Moonbloom | Gold (#fbbf24) | Seed→Sprout |
| 🧘 Meditation | Lotus Seed | Blue (#60a5fa) | Seed→Sprout |
| 💪 Training | Iron Fern | Red (#ef4444) | Sprout→Growing |
| 🍳 Breakfast | Sunpetal | Orange (#f97316) | Seed→Sprout |
| 🥗 Lunch | Meadowleaf | Green (#22c55e) | Seed→Sprout |
| 🍽️ Dinner | Twilight Bloom | Purple (#8b5cf6) | Seed→Sprout |
| 📖 Sleeptime Stories | Moon Vine | Pink (#ec4899) | Sprout |
| 📋 Planning | Compass Fern | Cyan (#06b6d4) | Seed→Sprout |
| 🧘 Mindful Movements | Breeze Orchid | Teal (#10b981) | Seed |

---

## ✅ ACCEPTANCE CRITERIA (MVP)

### Must Work:
- [ ] All 9 habits visible on dashboard
- [ ] Click "Mark Complete" → habit shows green
- [ ] DDC counter updates (+10 per habit)
- [ ] Completing all 9 → +100 bonus
- [ ] Meditation modal opens/closes
- [ ] Meditation play/pause controls work
- [ ] Sleeptime Stories can select different stories
- [ ] Sleeptime Stories play/pause works
- [ ] Mindful Movements carousel navigates
- [ ] Mindful Movements marks poses complete
- [ ] Modal flows work (open → complete → close)
- [ ] No console errors

### Should Work (Nice to Have):
- [ ] Plant emoji changes with streak
- [ ] Progress bars show toward next milestone
- [ ] Mobile responsive (tested on phone)
- [ ] Buttons have hover states
- [ ] Smooth transitions & animations

### Known Limitations (OK for MVP):
- ❌ No sign-up/login (test user auto-loads)
- ❌ Data doesn't persist (resets on reload)
- ❌ No actual audio files (using placeholder)
- ❌ No yoga pose images (using emoji + text)
- ❌ No Dishrated integration (manual entry)
- ❌ No TrainLog integration (manual entry)

---

## 🔐 FUTURE AUTH CREDENTIALS

**When Firebase Auth is added:**

```
Email:    test@ddhg.com
Password: TestPass123!
```

**Other test users:**
```
Email:    friend@example.com
Password: Test123456!

Email:    coach@ddhg.com
Password: CoachPass123!
```

**Admin user (future):**
```
Email:    admin@ddhg.com
Password: AdminDDHG123!
```

---

## 🚀 TESTING ON VERCEL

**After deployment:**

1. Get live URL from Vercel dashboard
2. Share: `https://dont-die-habit-garden.vercel.app`
3. Testing is identical to local:
   - No login required
   - Auto-loads test user
   - Same demo data
   - Same behavior

---

## 📱 MOBILE TESTING

**Test on your phone:**
1. Open https://dont-die-habit-garden.vercel.app on phone
2. Check:
   - [ ] Habit cards stack vertically (mobile)
   - [ ] Buttons are clickable (44px min height)
   - [ ] Modal fits screen height
   - [ ] Text is readable (no overflow)
   - [ ] Carousel swiping works (or use arrows)

---

## 🐛 DEBUG MODE

**To see console logs:**
1. Open http://localhost:3002
2. Press F12 (or Cmd+Option+I on Mac)
3. Click "Console" tab
4. Mark a habit complete
5. See: `Marked [habit_id] complete. DDC: [amount]`

**Check React State:**
1. Open DevTools
2. Install React DevTools extension
3. Click on components in Component tree
4. See state: `completedToday`, `ddc`, `openModal`, etc.

---

## 🎯 TEST CHECKLIST

Before sharing with 20-50 testers:

- [ ] All features tested locally
- [ ] No console errors
- [ ] Mobile tested
- [ ] Deployed to Vercel
- [ ] Live URL works
- [ ] Modal flows work
- [ ] DDC counting works
- [ ] All 9 habits visible
- [ ] Created TEST_ACCOUNT.md (this file)
- [ ] Shared MVP_LAUNCH_GUIDE.md
- [ ] Recorded 2-min demo video (optional)

---

## 💬 FEEDBACK QUESTIONS FOR TESTERS

1. **What's your first impression?**
2. **Which habits are easiest to do?**
3. **Which habits are hardest?**
4. **Would you actually use this daily?**
5. **What feature would make you addicted?**
6. **Anything confusing?**
7. **Bugs or crashes?**
8. **Mobile experience OK?**
9. **Would you pay for this?**
10. **What would make it 10x better?**

---

## 📝 TESTING LOG

**Track your testing:**

```markdown
### Test Run #1 (Local)
- Date: 2026-03-21
- Device: Mac mini
- Browser: Chrome
- ✅ All features working
- ⚠️ Note: Audio is placeholder
- 🐛 No bugs found

### Test Run #2 (Mobile)
- Date: 2026-03-21
- Device: iPhone 12
- Browser: Safari
- ✅ Responsive layout works
- ⚠️ Note: Carousel could be smoother
- 🐛 No crashes

### Test Run #3 (Vercel Live)
- Date: 2026-03-21
- URL: https://dont-die-habit-garden.vercel.app
- ✅ Deployed successfully
- ✅ All features work
- ⚠️ Note: Load time ~2s (acceptable)
- 🐛 No issues
```

---

**Ready to test! Follow the scenarios above and report any issues.** 🚀
