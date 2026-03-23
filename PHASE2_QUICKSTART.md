# PHASE 2 QUICKSTART - Testing & Verification

**Status**: Implementation complete, ready for testing
**Created**: 2026-03-22

---

## 5-Minute Overview

PHASE 2 adds heartbeat tokenomics to Don't Die Habit Garden:

1. **Users earn RP** when they complete habits
2. **RP accumulates daily** (tracked in `todayRewardPoints`)
3. **Heartbeat distributes tokens** proportionally (daily, via API)
4. **30-day streaks** earn golden seeds (achievement tracking)

Example flow:
```
User completes meditation (RP: 2)
User completes training (RP: 3)
→ User now has 5 RP for today

[Daily heartbeat triggers]
→ 5 RP / 13 total network RP = 38% of pool
→ 38% × 2,739.80 tokens = 1,040.94 tokens awarded
→ User's totalTokens += 1,040.94
```

---

## What Was Built

### Core Files (3 files, ~450 lines)

| File | Purpose | Status |
|------|---------|--------|
| `lib/heartbeatEngine.ts` | Token distribution engine | ✅ Ready |
| `app/api/heartbeat/route.ts` | API endpoints (3 routes) | ✅ Ready |
| `lib/firestoreIntegration.ts` | Schema + RP tracking | ✅ Updated |

### Documentation (5 files, ~30KB)

| File | Contents |
|------|----------|
| `HEARTBEAT_PHASE2_TESTING.md` | **← START HERE** - 10 test scenarios |
| `HEARTBEAT_PHASE2_IMPLEMENTATION.md` | Full technical details |
| `PHASE2_COMPLETION_SUMMARY.md` | Executive summary |
| `PHASE2_VALIDATION_CHECKLIST.md` | Detailed validation |
| `PHASE2_STATUS.txt` | Status report |

---

## Testing: 3 Steps

### Step 1: Verify Code (5 min)
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden

# Check files exist
ls -l lib/heartbeatEngine.ts app/api/heartbeat/route.ts

# Quick syntax check (if your IDE supports it)
# No output = success
```

### Step 2: Test Single Habit (10 min)

**Setup**: Create test user with 1 habit completion

```bash
# Option A: Via webhook (if running)
curl -X POST http://localhost:3000/api/webhooks/habit-garden \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-1",
    "habitId": "meditation",
    "habitName": "Meditation",
    "source": "habit-garden"
  }'

# Option B: Direct Firestore query
# Open Firebase console → ddhg_users
# Look for user with todayRewardPoints = 2 (meditation base value)
```

**Verify**:
- [ ] User document has `todayRewardPoints: 2`
- [ ] User document has `totalRewardPoints: 2`
- [ ] Completion event has `rp_earned: 2`

### Step 3: Test Distribution (10 min)

**Setup**: Create 3 test users with habits logged
- User A: 1 meditation (2 RP)
- User B: 1 meditation + 1 training (2 + 3 = 5 RP)
- User C: 1 meditation + 1 training + 1 breakfast (2 + 3 + 1 = 6 RP)

**Trigger distribution**:
```bash
curl -X POST http://localhost:3000/api/heartbeat/trigger \
  -H "Content-Type: application/json" \
  -d '{ "force": true }'
```

**Expected response**:
```json
{
  "status": "success",
  "distributions_count": 3,
  "total_tokens_distributed": 2739.80,
  "state": {
    "date": "2026-03-22",
    "total_network_rp": 13,
    "total_pool": 2739.80,
    "user_count": 3
  }
}
```

**Verify**:
- [ ] Response status is "success"
- [ ] All 3 users received tokens
- [ ] Firestore collection `heartbeat_state/2026-03-22` exists
- [ ] Each user's `totalTokens` increased
- [ ] Each user's `todayEarnings` populated

---

## API Endpoints (Quick Reference)

### 1. GET /api/heartbeat/status
```bash
# Check network state
curl "http://localhost:3000/api/heartbeat/status"

# Check user state
curl "http://localhost:3000/api/heartbeat/status?userId=test-user-1"

# Check historical state
curl "http://localhost:3000/api/heartbeat/status?date=2026-03-21"
```

**Response includes**:
- Network: total_network_rp, total_pool, user_count
- User (if provided): RP totals, token balance, earnings, golden seeds

### 2. POST /api/heartbeat/trigger
```bash
# Trigger distribution for today
curl -X POST http://localhost:3000/api/heartbeat/trigger

# Force re-distribution (testing)
curl -X POST http://localhost:3000/api/heartbeat/trigger \
  -H "Content-Type: application/json" \
  -d '{ "force": true }'
```

**Response includes**:
- Distribution count
- Total tokens distributed
- Updated heartbeat state

### 3. POST /api/heartbeat/sync-user
```bash
# Sync specific user
curl -X POST http://localhost:3000/api/heartbeat/sync-user \
  -H "Content-Type: application/json" \
  -d '{ "userId": "test-user-1" }'
```

**Response includes**:
- User's RP/token state
- Network state snapshot
- Expected tokens for today

---

## Common Checks

### Check User RP Tracking
```bash
# In Firebase console, find ddhg_users/{userId}
# Look for:
todayRewardPoints: 5
totalRewardPoints: 5
todayEarnings: {
  earned_rp: 5,
  multiplier: 1.0,
  rp_after_multiplier: 5,
  daily_pool_share: 1053.77,
  tokens_awarded: 1053.77
}
```

### Check Heartbeat State
```bash
# In Firebase console, find heartbeat_state/YYYY-MM-DD
# Look for:
date: "2026-03-22"
total_network_rp: 13
total_pool: 2739.80
user_count: 3
distributions: {
  "user-1": { tokens_awarded: 421.51, pool_share: 421.51 },
  "user-2": { tokens_awarded: 1053.77, pool_share: 1053.77 },
  ...
}
```

### Check Golden Seed
```bash
# Complete 30 days of a habit in test user
# After completion, verify in ddhg_users/{userId}:
golden_seeds: 1
```

---

## Common Issues & Fixes

### Issue: "Cannot find module 'heartbeatEngine'"
**Fix**: Check file exists at `lib/heartbeatEngine.ts` (case-sensitive)

### Issue: 404 on /api/heartbeat/status
**Fix**: Check next.config.js allows API routes, restart dev server

### Issue: Firestore error "Missing heartbeat_state"
**Fix**: Collection is created automatically on first write. Run trigger once.

### Issue: Calculation doesn't match (off by $0.01)
**Fix**: Rounding is expected. Use Math.round(value * 100) / 100 for display.

---

## Detailed Testing

For comprehensive test scenarios (10 scenarios with exact expected values):

👉 **Read**: `HEARTBEAT_PHASE2_TESTING.md`

Includes:
- Setup steps for each scenario
- Expected calculations (step-by-step)
- Verification checklist
- Example curl commands

---

## What to Test First (Priority Order)

1. **✅ Code exists** (5 min)
   - Files created: heartbeatEngine.ts, route.ts
   - Files modified: firestoreIntegration.ts

2. **✅ Basic RP tracking** (10 min)
   - Log 1 habit
   - Verify `todayRewardPoints` updated

3. **✅ Multiple habits** (10 min)
   - Log 3 different habits
   - Verify `todayRewardPoints = sum of RP`

4. **✅ Distribution** (10 min)
   - Create 3+ test users
   - Trigger heartbeat
   - Verify tokens awarded proportionally

5. **✅ API endpoints** (10 min)
   - Test GET /api/heartbeat/status
   - Test POST /api/heartbeat/trigger
   - Test POST /api/heartbeat/sync-user

6. **✅ Golden seeds** (15 min)
   - Simulate 30-day streak
   - Verify `golden_seeds` counter increments
   - Verify `golden_seed_earned` flag on completion

7. **✅ Edge cases** (optional)
   - 0 RP (no habits) → equal distribution
   - Single user → gets 100% of pool
   - 31+ day streak → 15.0× multiplier

---

## Success Criteria

All of the following should be true:

✅ RP tracking works (todayRewardPoints updates)
✅ Distribution calculates correctly (proportional to RP)
✅ Golden seeds awarded at 30 days
✅ API endpoints respond without errors
✅ Firestore collections created/updated
✅ Backward compatibility maintained (old fields still work)
✅ Multiple users distribute correctly
✅ No RP distribution breaks with 0 RP

---

## Next: Phase 3

Once testing is complete:

**Phase 3 UI Components** (estimated 2-3 days):
- Staking interface
- Pie chart visualization
- Multiplier display
- Hat tracker (golden seeds)
- Daily earnings breakdown

---

## Support

**Questions?**

1. Check `HEARTBEAT_PHASE2_IMPLEMENTATION.md` for technical details
2. Check `HEARTBEAT_PHASE2_TESTING.md` for specific test scenarios
3. Check `PHASE2_VALIDATION_CHECKLIST.md` for validation details
4. Check Firebase console (Firestore tab) for data verification

---

**Status**: PHASE 2 COMPLETE ✅
**Ready for**: Testing & Verification
**Time to test**: ~1 hour (10 min per scenario × 6 priority scenarios)
