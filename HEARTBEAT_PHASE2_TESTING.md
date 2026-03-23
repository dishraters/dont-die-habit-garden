# HEARTBEAT TOKENOMICS v2.0 - PHASE 2 TESTING GUIDE

## Overview
This document outlines the testing strategy for Phase 2 implementation:
- Firestore schema migration
- Heartbeat engine creation
- API endpoints
- Global heartbeat state tracking

## Test Scenarios

### Scenario 1: Basic Habit Completion with RP Tracking

**Setup:**
1. Create test user (or use existing)
2. Log 1 meditation habit (base RP value: 2)

**Expected Behavior:**
```
Before: todayRewardPoints = 0, totalRewardPoints = 0
After:  todayRewardPoints = 2, totalRewardPoints = 2
        ddcEarned = 2 (for backwards compat)
        rp_earned = 2 (new field)
        CompletionEvent.rp_earned = 2
```

**Verification:**
- [ ] User document has `todayRewardPoints: 2`
- [ ] User document has `totalRewardPoints: 2`
- [ ] CompletionEvent has `rp_earned: 2` and `ddcEarned: 2`
- [ ] `todayEarnings` object exists with defaults

**Command to Test:**
```bash
# Call from habit-garden or via webhook
curl -X POST http://localhost:3000/api/webhooks/habit-garden \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-1",
    "habitId": "meditation",
    "habitName": "Meditation",
    "source": "habit-garden"
  }'
```

---

### Scenario 2: Multiple Habits in One Day

**Setup:**
1. Log meditation (RP: 2)
2. Log training (RP: 3)
3. Log breakfast (RP: 1)

**Expected Behavior:**
```
todayRewardPoints = 2 + 3 + 1 = 6
totalRewardPoints = 6
todayDDC = 6 (same as RP for now)
```

**Verification:**
- [ ] `todayRewardPoints = 6`
- [ ] `totalRewardPoints = 6`
- [ ] `todayDDC = 6`
- [ ] 3 CompletionEvent records exist

---

### Scenario 3: 7-Day Streak Milestone

**Setup:**
1. Create test user
2. Log meditation for 7 consecutive days

**Expected Behavior:**
```
Day 1-6: RP = 2 (base value)
Day 7:   RP = 12 (streak7 value) + 5 (milestone bonus) = 17
CompletionEvent.milestoneReached = '7day'
```

**Verification:**
- [ ] Day 7 completion shows `milestoneReached: '7day'`
- [ ] Day 7 RP value includes +5 bonus
- [ ] User's `habitStreaks['meditation'] = 7`

---

### Scenario 4: 30-Day Streak & Golden Seed

**Setup:**
1. Create test user
2. Log meditation for 30 consecutive days

**Expected Behavior:**
```
Day 30: RP = 27 (streak30 value) + 20 (milestone bonus) = 47
CompletionEvent.golden_seed_earned = true
User.golden_seeds += 1
User.habitStreaks['meditation'] = 30
```

**Verification:**
- [ ] Day 30 completion shows `golden_seed_earned: true`
- [ ] Day 30 RP = 47
- [ ] User's `golden_seeds = 1`
- [ ] Habit streak is exactly 30

---

### Scenario 5: Daily Heartbeat Distribution

**Setup:**
1. Create multiple test users (3-5)
2. Log varying amounts of habits:
   - User A: meditation (2 RP)
   - User B: meditation + training (2 + 3 = 5 RP)
   - User C: meditation + training + breakfast (2 + 3 + 1 = 6 RP)
3. Trigger heartbeat distribution manually

**Expected Behavior:**
```
Total Network RP = 2 + 5 + 6 = 13
Total Pool = 2,739.72 + (user_count / 1000) * 27.4
           = 2,739.72 + (3 / 1000) * 27.4
           = 2,739.72 + 0.0822
           ≈ 2,739.80

Distribution:
- User A: (2 / 13) × 2,739.80 ≈ 421.51 tokens
- User B: (5 / 13) × 2,739.80 ≈ 1,053.77 tokens
- User C: (6 / 13) × 2,739.80 ≈ 1,264.53 tokens
```

**Verification:**
- [ ] Firestore collection `heartbeat_state/today` exists
- [ ] `heartbeat_state.total_network_rp = 13`
- [ ] `heartbeat_state.total_pool ≈ 2,739.80`
- [ ] `heartbeat_state.user_count = 3`
- [ ] Each user's `todayEarnings.tokens_awarded` matches calculation
- [ ] Each user's `totalTokens` increased by distribution amount
- [ ] Each user's `lastHeartbeat` is updated

**Command to Test:**
```bash
curl -X POST http://localhost:3000/api/heartbeat/trigger \
  -H "Content-Type: application/json" \
  -d '{ "force": true }'
```

---

### Scenario 6: API Endpoint - Status Check

**Setup:**
1. After heartbeat distribution completes
2. Query status with user ID

**Expected Call:**
```bash
curl http://localhost:3000/api/heartbeat/status?userId=test-user-2
```

**Expected Response:**
```json
{
  "status": "success",
  "heartbeat_state": {
    "date": "2026-03-22",
    "total_network_rp": 13,
    "total_pool": 2739.80,
    "user_count": 3,
    "distributions": {
      "user-1": { "tokens_awarded": 421.51, "pool_share": 421.51 },
      "user-2": { "tokens_awarded": 1053.77, "pool_share": 1053.77 },
      "user-3": { "tokens_awarded": 1264.53, "pool_share": 1264.53 }
    },
    "timestamp": "2026-03-22T..."
  },
  "user_info": {
    "userId": "test-user-2",
    "totalRewardPoints": 5,
    "todayRewardPoints": 5,
    "totalTokens": 1053.77,
    "todayEarnings": {
      "earned_rp": 5,
      "multiplier": 1.0,
      "rp_after_multiplier": 5,
      "daily_pool_share": 1053.77,
      "tokens_awarded": 1053.77
    },
    "golden_seeds": 0,
    "expected_tokens_today": 1053.77,
    "recent_completions": [...]
  }
}
```

**Verification:**
- [ ] Response structure matches above
- [ ] User's `totalTokens` matches distribution
- [ ] `expected_tokens_today` calculation is correct

---

### Scenario 7: Streak Multiplier Calculation

**Setup:**
1. Create test user
2. Log meditation for days 1, 3, 7, 15, 23, 29, 31

**Expected Multipliers:**
```
Day 1:  1.0× (base RP: 2)
Day 3:  1.2× (base RP: 2.4)
Day 7:  1.6× (base RP: 3.2)
Day 15: 2.4× (base RP: 4.8)
Day 23: 3.5× (base RP: 7.0)
Day 29: 5.0× (base RP: 10.0)
Day 31: 15.0× (hard cap, base RP: 30.0)
```

**Verification:**
- [ ] Multiplier function returns correct values for each streak day
- [ ] API can be tested via `/api/heartbeat/status`

**Command to Test:**
```bash
curl "http://localhost:3000/api/heartbeat/status?userId=test-user-multiplier"
```

---

### Scenario 8: Backfill Existing Users

**Setup:**
1. Query existing users in Firestore
2. Verify they have the new fields

**Expected Behavior:**
```
All existing users should have:
- totalTokens: 0 (or migrated value)
- totalRewardPoints: 0
- todayRewardPoints: 0
- todayEarnings: { earned_rp: 0, multiplier: 1.0, ... }
- golden_seeds: 0
- lastHeartbeat: ''
```

**Verification:**
- [ ] Run Firestore admin query to sample 5 existing users
- [ ] All have v2.0 fields present
- [ ] No null/undefined values in critical fields

---

### Scenario 9: Golden Seed Award via API

**Setup:**
1. Create test user with 30-day meditation streak
2. Call `/api/heartbeat/trigger` to award golden seeds

**Expected Behavior:**
```
POST /api/heartbeat/trigger
→ awardGoldenSeeds() is called
→ User with meditation streak 30 gets golden_seeds += 1
```

**Verification:**
- [ ] Golden seed counter increments
- [ ] Only awards once per 30-day milestone
- [ ] Works across multiple habits

---

### Scenario 10: User Sync Endpoint

**Setup:**
1. Create test user with known RP and token state

**Expected Call:**
```bash
curl -X POST http://localhost:3000/api/heartbeat/sync-user \
  -H "Content-Type: application/json" \
  -d '{ "userId": "test-user-2" }'
```

**Expected Response:**
```json
{
  "status": "success",
  "user": {
    "userId": "test-user-2",
    "totalRewardPoints": 13,
    "todayRewardPoints": 5,
    "totalTokens": 1053.77,
    "golden_seeds": 0,
    "expected_tokens_today": 1053.77,
    "lastHeartbeat": "2026-03-22T..."
  },
  "network_state": {
    "total_network_rp": 13,
    "total_pool": 2739.80,
    "user_count": 3
  }
}
```

**Verification:**
- [ ] Returns accurate user state
- [ ] Network state reflects current distribution

---

## Test Checklist

- [ ] Schema migration: all new fields added
- [ ] recordCompletion() uses RP instead of tokens
- [ ] Golden seed flag set correctly at 30-day milestone
- [ ] Streak multiplier calculation (1.0 to 15.0)
- [ ] Daily pool distribution is proportional
- [ ] Heartbeat state collection created in Firestore
- [ ] GET /api/heartbeat/status works
- [ ] POST /api/heartbeat/trigger distributes tokens
- [ ] POST /api/heartbeat/sync-user returns correct data
- [ ] Multiple habit tracking per user
- [ ] Backwards compatibility (ddcEarned still set)
- [ ] New users initialized with v2.0 fields
- [ ] Existing users backfilled with v2.0 fields

## Next Steps

After Phase 2 testing is complete and verified:

1. **Phase 3: UI Components**
   - Staking interface
   - Pie chart (token distribution visualization)
   - Multiplier display (current day's multiplier)
   - Hat tracker (golden seeds display)
   - Daily earnings breakdown

2. **Phase 4: Analytics & Monitoring**
   - Heartbeat state history
   - User earning trends
   - Network health metrics
   - Ad spend tracking

3. **Phase 5: Production Hardening**
   - Rate limiting
   - Error handling & recovery
   - Data validation
   - Security audit
