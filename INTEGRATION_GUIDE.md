# PHASE 3 Integration Guide

## Quick Start: Adding Components to Your Dashboard

### 1. Import Components

Open `app/page.tsx` and add these imports:

```tsx
import DailyPieChart from './components/DailyPieChart'
import EarningsDashboard from './components/EarningsDashboard'
import StreakMultiplier from './components/StreakMultiplier'
import GoldenHatTracker from './components/GoldenHatTracker'
```

### 2. Add Components to JSX

Inside your dashboard component, add the components where you want them:

```tsx
export default function Home() {
  const userId = user?.id || 'guest'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Real-time Earnings Dashboard (6 cards) */}
      <section className="mb-12">
        <EarningsDashboard userId={userId} />
      </section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Left: Daily Pie Chart */}
        <DailyPieChart userId={userId} dailyPoolSize={2739.72} />

        {/* Right: Streak Multiplier */}
        <StreakMultiplier userId={userId} />
      </div>

      {/* Golden Hat Tracker */}
      <section className="mb-12">
        <GoldenHatTracker userId={userId} />
      </section>

      {/* Your existing components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PlantCard components, etc */}
      </div>
    </div>
  )
}
```

### 3. Add Navigation Links

Update your navigation/menu to include the new pages:

```tsx
<nav className="flex gap-4">
  <Link href="/" className="hover:text-pink-600">Dashboard</Link>
  <Link href="/staking" className="hover:text-pink-600">Staking</Link>
  <Link href="/how-it-works" className="hover:text-pink-600">Learn</Link>
</nav>
```

---

## Component Props Reference

### EarningsDashboard
```tsx
<EarningsDashboard userId={currentUser.id} />
```
**Props:**
- `userId: string` - Firebase user ID (required)

**Output:** 6 color-coded cards showing:
- Today's Earned RP
- Streak Multiplier
- Projected Tokens
- Last Distribution
- Lifetime Tokens
- Golden Seeds

---

### DailyPieChart
```tsx
<DailyPieChart userId={currentUser.id} dailyPoolSize={2739.72} />
```
**Props:**
- `userId: string` - Firebase user ID (required)
- `dailyPoolSize?: number` - Daily pool size in tokens (default: 2739.72)

**Output:** Interactive pie chart with tooltip

---

### StreakMultiplier
```tsx
<StreakMultiplier userId={currentUser.id} />
```
**Props:**
- `userId: string` - Firebase user ID (required)

**Output:** Streak tracker with animated progress bar

---

### GoldenHatTracker
```tsx
<GoldenHatTracker userId={currentUser.id} />
```
**Props:**
- `userId: string` - Firebase user ID (required)

**Output:** Seed collection tracker with habit list

---

## Page Routes

### Staking Page
**URL:** `/staking`
**Features:**
- 3 tier selection cards
- Rewards calculator
- FAQ section
- Lock-up details

**Link:**
```tsx
<Link href="/staking">View Staking Options</Link>
```

### How It Works Page
**URL:** `/how-it-works`
**Features:**
- 6 comprehensive sections
- Interactive charts
- FAQ with dropdowns
- Smooth scroll animations

**Link:**
```tsx
<Link href="/how-it-works">Learn How It Works</Link>
```

---

## Data Flow

### Component → API → Firestore

```
User (browser)
    ↓
Component (React)
    ↓
GET /api/heartbeat/status?userId={userId}
    ↓
Firestore Collections:
    - ddhg_users (user data)
    - heartbeat_state (network state)
    ↓
Response JSON with user_info + heartbeat_state
    ↓
Component re-renders with live data
```

### Update Intervals

| Component | Interval | Purpose |
|-----------|----------|---------|
| DailyPieChart | 30s | Track pool distribution changes |
| EarningsDashboard | 30s | Show latest earnings |
| StreakMultiplier | 60s | Update streak progress |
| GoldenHatTracker | 120s | Sync seed count |

---

## Styling Customization

### Colors

All components use Tailwind CSS with these colors:

```css
/* Primary */
Pink: #ec4899 (user's share)

/* Accent Colors */
Orange: #f97316 (1-5× multiplier)
Red: #ef4444 (5-10× multiplier)
Purple: #a855f7 (10-15× multiplier)

/* Card Backgrounds */
Green: #10b981 (earnings)
Blue: #3b82f6 (projected)
Amber: #d97706 (lifetime)
Yellow: #eab308 (seeds)
```

### Responsive Breakpoints

```tsx
// Mobile-first (320px+)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Mobile: 1 column
// Tablet (768px+): 2 columns
// Desktop (1024px+): 3 columns
```

---

## Error Handling

Each component includes:

1. **Loading State**
   ```tsx
   if (loading) {
     return <div className="text-center">Loading...</div>
   }
   ```

2. **Error State**
   ```tsx
   if (error) {
     return <div className="text-red-600">Error: {error}</div>
   }
   ```

3. **Fallback Data**
   ```tsx
   const earnings = userInfo?.todayEarnings || {
     earned_rp: 0,
     multiplier: 1.0,
     // ...
   }
   ```

---

## Performance Tips

### 1. Memoization
Components are already optimized with `useEffect` cleanup:
```tsx
useEffect(() => {
  const interval = setInterval(fetchData, 30000)
  return () => clearInterval(interval) // Cleanup on unmount
}, [userId])
```

### 2. Debouncing
Real-time updates are polled at reasonable intervals (30s-2m) to avoid API overload.

### 3. Lazy Loading
Import components normally—Next.js code splitting handles the rest:
```tsx
import DailyPieChart from './components/DailyPieChart'
// Automatically code-split and lazy-loaded
```

---

## Common Issues & Solutions

### Issue: Components showing "No data"
**Solution:** Ensure user is logged in and has completed habits.
```tsx
// Check user data
console.log(userInfo)
console.log(heartbeatState)
```

### Issue: Charts not rendering
**Solution:** Verify recharts is installed:
```bash
npm list recharts
```

### Issue: Real-time updates not working
**Solution:** Check Firestore security rules allow reads:
```
match /ddhg_users/{userId} {
  allow read: if request.auth.uid == userId
}
```

### Issue: Styling looks off
**Solution:** Ensure Tailwind CSS is built:
```bash
npm run build
```

---

## Testing the Integration

### 1. Check Console
Open browser DevTools → Console
- No red errors
- API calls showing in Network tab
- Component logs showing data fetches

### 2. Manual Testing
```
[] Visit dashboard
[] Check EarningsDashboard loads
[] Verify pie chart displays
[] Click staking page
[] Scroll how-it-works page
[] Check mobile responsiveness
```

### 3. API Testing
```bash
# Test heartbeat API endpoint
curl "http://localhost:3000/api/heartbeat/status?userId=YOUR_USER_ID"
```

---

## Next: Backend Integration

### Staking API Endpoints (To Be Implemented)
```
POST /api/staking/stake
  Body: { userId, amount, tierId, lockupDays }
  Response: { success, stakeId, unlocksAt }

GET /api/staking/stakes
  Query: userId
  Response: { stakes: [{ id, amount, tier, lockedUntil }] }

POST /api/staking/claim
  Body: { stakeId }
  Response: { claimed, tokens, rewards }
```

### Seed Redemption API (To Be Implemented)
```
POST /api/seeds/redeem
  Body: { userId, seedCount, rewardType }
  Response: { success, reward }

GET /api/seeds/available-rewards
  Response: { rewards: [{ id, name, seedCost, description }] }
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All components tested locally
- [ ] TypeScript compilation passes (`npm run build`)
- [ ] No console errors in development
- [ ] Responsive design tested on mobile
- [ ] API endpoints verified
- [ ] Firestore security rules configured
- [ ] Environment variables set (.env.local)
- [ ] Analytics integrated (if using)
- [ ] Error tracking configured (if using Sentry)
- [ ] Performance optimized (lighthouse audit)

---

## Support & Documentation

For detailed component docs, see:
- `PHASE3_COMPONENTS.md` - Full component reference
- `HEARTBEAT_PHASE2_IMPLEMENTATION.md` - Backend API details
- Individual component files for inline JSDoc comments

---

**Last Updated:** March 23, 2026
**Status:** Ready for Integration ✅
