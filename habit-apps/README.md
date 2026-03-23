# 🌱 Phase 3 - Five Habit Apps

Five minimal Next.js apps that hook into the Don't Die Habit Garden (DDHG) dashboard. Each app represents a different daily habit with simple UI, timers/counters, and webhook integration.

## 📱 Apps at a Glance

| App | Port | Habit Type | Feature | RP |
|-----|------|-----------|---------|-----|
| 🧘 **meditation-timer** | 3001 | meditation | 5/10/15/20 min timer | 2 |
| 📖 **stories-player** | 3002 | sleeptime_stories | 5 sample audio stories | 3 |
| 🧘 **yoga-app** | 3003 | mindful_movements | 5 pose carousel | 2 |
| 💧 **hydrate-app** | 3004 | hydration | Water glass counter (goal: 8) | varies |
| 📚 **read-timer** | 3005 | reading | Book selector + timer | 3 |

## 🚀 Quick Start

### 1. Install All Dependencies
```bash
bash INSTALL_ALL.sh
```

This runs `npm install` in all 5 app directories.

### 2. Start DDHG Main App
```bash
cd ..  # back to main DDHG dir
npm run dev
# Runs on http://localhost:3000
```

### 3. Start All Habit Apps (Option A: Automated)
```bash
cd habit-apps
bash START_ALL.sh
```

### 4. Or Start Individually (Option B: Manual)
```bash
# Terminal 2
cd meditation-timer && npm run dev
# http://localhost:3001

# Terminal 3
cd stories-player && npm run dev
# http://localhost:3002

# Terminal 4
cd yoga-app && npm run dev
# http://localhost:3003

# Terminal 5
cd hydrate-app && npm run dev
# http://localhost:3004

# Terminal 6
cd read-timer && npm run dev
# http://localhost:3005
```

## 🧪 Testing

1. Open each app URL (3001-3005)
2. Use the app (select timer/book/poses, add water, etc.)
3. Click "Complete" button
4. ✅ Should see success message
5. Go to http://localhost:3000 to see dashboard update

**For detailed testing steps, see `PHASE3_SETUP.md`**

## 🔧 How It Works

```
User uses habit app
      ↓
Clicks "Complete" button
      ↓
App POSTs to /api/heartbeat/complete
      ↓
  {
    habitType: "meditation",
    userId: "user-xyz",
    sourceApp: "meditation-timer",
    rp_earned: 2
  }
      ↓
Webhook returns completion data
      ↓
Dashboard updates (30s auto-poll)
      ↓
RP accumulates, multiplier increases
```

## 📚 App Details

### 🧘 meditation-timer
- Timer buttons: 5, 10, 15, 20 minutes
- Timer display with progress bar
- Play/Pause/Reset controls
- RP: 2 per session
- HabitType: `meditation`

### 📖 stories-player
- 5 pre-loaded bedtime stories
- Story selector + details (narrator, duration)
- Play controls
- Mark Complete button
- RP: 3 per story
- HabitType: `sleeptime_stories`

### 🧘 yoga-app
- 5 yoga poses with emojis
- Carousel navigation (Previous/Next)
- Hold Pose button to complete each
- Track X/5 poses
- Complete Sequence button
- RP: 2 per sequence
- HabitType: `mindful_movements`

### 💧 hydrate-app
- Water glass counter (max 8)
- Click-to-add or +/- buttons
- Daily goal tracker with progress bar
- Persistent state (localStorage)
- Goal Reached button fires on 8 glasses
- RP: varies (0.5 × number of glasses)
- HabitType: `hydration`

### 📚 read-timer
- Book selector (5 sample books)
- Timer buttons: 15, 30, 45, 60 minutes
- Timer display with progress
- Play/Pause/Reset controls
- Session Complete button
- RP: 3 per session
- HabitType: `reading`

## 🌐 Environment Variables

Each app uses `NEXT_PUBLIC_DDHG_API` to know where to send webhooks.

**Default:** `http://localhost:3000`

**To change:**
```bash
# .env.local (in each app directory)
NEXT_PUBLIC_DDHG_API=https://my-deployed-ddhg.vercel.app
```

## 📁 File Structure

Each app has:
```
app-name/
├── package.json         (npm scripts, dependencies)
├── next.config.js       (Next.js config)
├── .env.local.example   (env template)
└── app/
    └── page.tsx         (entire app in one file)
```

No `lib/`, no `components/` subdirs — everything is in `page.tsx` for simplicity.

## 🎨 Design

- **Inline CSS**: No external stylesheets
- **Responsive**: Works on mobile (320px+) to desktop
- **Accessible**: Semantic HTML, proper buttons
- **Feedback**: Success/error messages for all actions
- **State**: localStorage for persistence where needed

## 🔗 Webhook Endpoint

All apps POST to: `POST /api/heartbeat/complete`

**Required payload:**
```json
{
  "habitType": "meditation",      // enum
  "userId": "user-123",            // string
  "sourceApp": "meditation-timer", // string (optional)
  "rp_earned": 2                   // number (optional, default per habitType)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Habit 'meditation' completed",
  "user_daily_rp": 2,
  "user_total_rp": 2,
  "streak_day": 1,
  "streak_multiplier": 1.467,
  "final_rp": 2.934,
  "estimated_tokens": 0.001,
  "network_total_rp": 100,
  "user_share_percent": 2.0
}
```

## 📊 Dashboard Integration

After completing habits, the DDHG dashboard (localhost:3000) shows:

- **EarningsDashboard**: Today's RP, multiplier, tokens, golden seeds
- **DailyPieChart**: Your RP as % of daily pool
- **StreakMultiplier**: Progress toward 15.0× max multiplier
- **GoldenHatTracker**: 30+ day streak seeds

All components update via 30-second polling of `/api/heartbeat/status`.

## 🐛 Troubleshooting

**Apps won't start?**
- Check Node.js version: `node --version` (need 18+)
- Delete `node_modules`, run `npm install` again
- Check ports 3001-3005 are free: `lsof -i :3001`

**Webhook not firing?**
- Check browser DevTools Network tab
- Verify DDHG is running on port 3000
- Check `.env.local` has correct DDHG_API URL

**Dashboard not updating?**
- Refresh http://localhost:3000
- Check browser console for errors
- Verify Firestore is initialized

**See full troubleshooting in `PHASE3_SETUP.md`**

## 📝 Development Notes

- **No TypeScript**: Uses JSX (simpler)
- **No dependencies**: Only React + Next.js
- **No build step required**: `npm run dev` is instant
- **HMR enabled**: Changes auto-refresh in browser

## 🚢 Deployment

### To Vercel (Recommended)

```bash
# For each app:
cd meditation-timer
vercel deploy
# Follow prompts, set NEXT_PUBLIC_DDHG_API to production URL
```

### Environment Variables for Production

Update `.env.production.local` in each app:
```
NEXT_PUBLIC_DDHG_API=https://dont-die-habit-garden.vercel.app
```

## 📚 Related Docs

- **PHASE3_SETUP.md** - Detailed testing guide
- **PHASE3_SUMMARY.md** - High-level overview
- **PHASE3_CHECKLIST.md** - Delivery checklist

---

**Phase 3 Complete** ✅

All 5 apps are ready to build, test, and deploy!
