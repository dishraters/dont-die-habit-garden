# Integration Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup ✅
```bash
# Verify .env.local has all variables
cat .env.local | grep -E "FIREBASE|GOOGLE_CLIENT|DDC"
```

Should show:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCneQP04ra4z6bQEwpxOVguir9_dCE6crk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dontdiehabitgarden.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dontdiehabitgarden
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dontdiehabitgarden.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=575235110627
NEXT_PUBLIC_FIREBASE_APP_ID=1:575235110627:web:212516a3153acd320037d6
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<set-this>
NEXT_PUBLIC_DDC_PER_COMPLETION=1
```

### 2. Firebase Project Setup

**In Firebase Console (dontdiehabitgarden):**

1. Go to Firestore Database → Create Collection
   - Collection: `ddhg_users`
   - Auto ID first document with:
     ```json
     {
       "userId": "test-user",
       "totalDDC": 0,
       "plantGrowthStage": 0,
       "streakCount": 0,
       "habits": [],
       "created_at": <current timestamp>
     }
     ```

2. Create remaining collections (can be empty, they'll auto-populate):
   - `habit_completions`
   - `ddc_ledger`
   - `growth_milestones`

3. Update Firestore Security Rules:
   ```firestore
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /ddhg_users/{userId} {
         allow read, write: if request.auth.uid == userId;
       }
       match /habit_completions/{document=**} {
         allow read, write: if request.auth.uid == resource.data.userId;
       }
       match /ddc_ledger/{document=**} {
         allow read: if request.auth.uid == resource.data.userId;
         allow write: if false;
       }
       match /growth_milestones/{document=**} {
         allow read: if request.auth.uid == resource.data.userId;
         allow write: if false;
       }
     }
   }
   ```

4. Enable Authentication → Google Provider (if not already)

### 3. Google OAuth Setup

**In Google Cloud Console:**

1. Go to APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
   - Name: "DDHG OAuth"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://ddhg.vercel.app` (or your domain)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback`
     - `https://ddhg.vercel.app/auth/callback`
3. Copy Client ID → Add to `.env.local` as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### 4. Code Verification

```bash
# Check all new files exist
ls -lh lib/{integrations,habitFunctions,firestoreIntegration}.ts

# Verify imports work
npm run build 2>&1 | grep -i "error" || echo "✅ Build successful"
```

### 5. Test Locally

```bash
npm run dev

# Visit http://localhost:3000
# Login with Google
# Try completing a habit
# Check Firestore console for new entries in habit_completions
```

**Expected Firestore entry after first completion:**
```json
{
  "userId": "google-auth-id",
  "habitId": "meditation",
  "habitName": "Meditation",
  "source": "habit-garden",
  "completedAt": "2026-03-21T...",
  "ddcEarned": 1,
  "streakIncremented": true,
  "growthStageIncremented": false
}
```

---

## Deployment Steps

### Deploy to Staging (Vercel)

```bash
# 1. Push to git
git add lib/*.ts INTEGRATION_PLAN.md INTEGRATION_COMPLETE.md DEPLOY_INTEGRATION.md
git commit -m "feat: Firebase integration layer for multi-app sync"
git push origin main

# 2. Vercel auto-deploys, or manual:
vercel deploy --prod
```

### Set Environment Variables in Vercel

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add all vars from `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `NEXT_PUBLIC_DDC_PER_COMPLETION=1`
   - `NEXT_PUBLIC_DDC_STREAK_BONUS_3D=3`
   - `NEXT_PUBLIC_DDC_STREAK_BONUS_7D=5`
   - `NEXT_PUBLIC_DDC_STREAK_BONUS_30D=10`
   - `NEXT_PUBLIC_DDC_PERFECT_DAY_BONUS=3`

3. Redeploy → Vercel will use new env vars

---

## Testing After Deployment

### Staging URL Test
```bash
# Login with test account
# 1. Click "Login with Google"
# 2. Authenticate with Google
# 3. Should redirect to dashboard

# 4. Complete a habit (e.g., click "Mark Meditation Done")
# 5. Check:
#    - ✅ Habit appears in "Completed Today"
#    - ✅ Plant growth stage increases
#    - ✅ DDC count increments
```

### Firestore Verification
```bash
# In Firebase Console → Firestore:
# 1. Collections → ddhg_users → Should have new user entry
# 2. Collections → habit_completions → Should have new entry
# 3. Collections → ddc_ledger → Should have transaction record
```

### Error Handling Test
```
# Disconnect internet
# Try completing habit
# Should show error gracefully (not crash)
# Reconnect, should retry
```

---

## Rollback Plan

If issues occur:

```bash
# Option 1: Revert last commit
git revert HEAD
git push
vercel deploy --prod

# Option 2: Switch to previous Vercel deployment
# Go to Vercel Dashboard → Deployments → Select previous build → Promote to Production

# Option 3: Comment out new code in components temporarily
# Remove calls to new functions in page.tsx
# Use fallback localStorage for demo
```

---

## Phase 2: Component Integration

Once staging is validated, integrate into components:

1. **app/page.tsx** - Main dashboard
   ```typescript
   import { loadUserHabits } from '@/lib/habitFunctions'
   
   const habits = await loadUserHabits(userId)
   ```

2. **app/components/PlantCard.tsx** - Plant display
   ```typescript
   const growthStage = await getGrowthStage(userId)
   ```

3. **app/components/HabitEntryModal.tsx** - Complete habit
   ```typescript
   await saveHabitCompletion(userId, habitId)
   ```

See `INTEGRATION_COMPLETE.md` for detailed usage examples.

---

## Monitoring & Metrics

### Key Metrics to Track
- Daily active users (logging in)
- Habit completion rate (habits/user/day)
- DDC earned per user (total)
- Growth stage distribution (how many at each stage)
- Error rate in Firestore operations

### Logging Strategy
```typescript
// In firestoreIntegration.ts, add:
console.log(`[DDHG] User ${userId} completed ${habitId} (+${ddcEarned} DDC)`)
```

Monitor in Vercel Analytics → Logs

---

## Support & Troubleshooting

### Issue: "No Firestore data appears"
**Fix**: 
1. Check `.env.local` has correct `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
2. Verify user is authenticated (check Firebase Auth console)
3. Check Firestore security rules (might be too restrictive)

### Issue: "Google OAuth fails"
**Fix**:
1. Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
2. Check authorized redirect URIs in Google Console match Vercel domain
3. Verify Google provider enabled in Firebase Auth

### Issue: "DDC not incrementing"
**Fix**:
1. Check `recordCompletion()` is being called in `habitFunctions.ts`
2. Verify Firestore `ddc_ledger` collection has transaction record
3. Check `DDC_PER_COMPLETION` env var is set correctly

### Issue: "Slow Firestore queries"
**Fix**:
1. Add indexes in Firestore Console if prompted
2. Limit queries to last 30 days for real-time listeners
3. Cache user profile locally (Phase 3)

---

## Success Criteria

- [x] All 4 files created & deployed
- [ ] Firebase collections populated with test data
- [ ] Google OAuth working
- [ ] Habit completions sync to Firestore
- [ ] DDC awards correctly
- [ ] Growth stages update
- [ ] No console errors
- [ ] <2 second page load time
- [ ] Real-time updates <500ms latency

---

**Deployment Date**: 2026-03-21  
**Expected Duration**: 30 minutes  
**Rollback Time**: 5 minutes  
**Status**: READY

**Next**: After validation, proceed to Phase 2 (Component Integration)
