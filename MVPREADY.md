# Don't Die Habit Garden - MVP Ready! 🌱

**Status:** Core features complete. Ready for Firebase setup + deployment.

## What's Built ✅

### Components (Reusable)
- **Dashboard** - 9 habit grid with plant cards
- **MeditationPlayer** - 5 min guided sessions (3 options)
- **MindfulMovements** - 5 pose carousel with images
- **SleeptimeStories** - 5 bedtime stories with audio
- **PlantCard** - Habit card with growth stages + streaks

### Features
- Plant growth visualization (5 stages: Seed → Sprout → Growing → Thriving → Legendary)
- Streak tracking (🔥 days)
- DDC earning (10 per habit, 100 if all 9)
- Modal flows for audio/media habits
- Real-time progress

## The 9 Habits

| # | Habit | Plant | Color | Type |
|---|-------|-------|-------|------|
| 1 | 🙏 Gratitude | Moonbloom | Gold | Manual |
| 2 | 🧘 Meditation | Lotus Seed | Blue | Audio Modal |
| 3 | 💪 Training | Iron Fern | Red | Manual |
| 4 | 🍳 Breakfast | Sunpetal | Orange | Manual |
| 5 | 🥗 Lunch | Meadowleaf | Green | Manual |
| 6 | 🍽️ Dinner | Twilight Bloom | Purple | Manual |
| 7 | 📖 Sleeptime Stories | Moon Vine | Pink | Audio Modal |
| 8 | 📋 Planning | Compass Fern | Cyan | Manual |
| 9 | 🧘 Mindful Movements | Breeze Orchid | Teal | Image Carousel |

## Setup (5 minutes)

### 1. Get Firebase Credentials
```bash
# Go to: https://console.firebase.google.com
# Create project "dont-die-habit-garden"
# Enable: Authentication (Email/Password) + Firestore
# Copy config values
```

### 2. Create .env.local
```bash
cp .env.local.example .env.local
# Paste Firebase values from step 1
```

### 3. Install & Run
```bash
npm install
npm run dev
# Open: http://localhost:3000
```

## What You'll See

- 9 habit cards with emoji plants
- Click any card to mark complete
- Meditation/Movements/Stories open modals
- DDC counter updates in real-time
- Plant grows through 5 stages

## Next Steps (Deployment)

### Deploy to Vercel

```bash
# 1. Push to GitHub (or create repo)
git add .
git commit -m "DDHG MVP ready"
git push

# 2. Import to Vercel
# Go to: https://vercel.com/new
# Select GitHub repo
# Add Firebase env vars
# Deploy

# 3. Get live URL + share
```

## Firebase Setup Detail

**Firestore Collections** (will create on first save):
```
habit_completions/
  - user_id
  - habit_id
  - date
  - timestamp

users/
  - ddc_balance
  - total_ddc
  - completed_today[]
  - streaks{}
```

**Auth:** Email/password sign-up (UI coming next)

## Testing

**Test User:** test-user-[timestamp]
**Demo Data:** Pre-loaded streaks (12, 8, 5 days)
**Mock Audio:** Using SoundHelix test files

## Known Limitations (MVP)

- ⏳ No Firebase Auth UI yet (test user only)
- ⏳ No actual audio files (using test URLs)
- ⏳ No Dishrated/TrainLog integration (manual entry)
- ⏳ No persistence between page reloads
- ✅ All habit tracking works locally

## Code Structure

```
app/
├── page.tsx              (Main dashboard)
├── components/
│   ├── PlantCard.tsx     (Habit card)
│   ├── MeditationPlayer.tsx
│   ├── MindfulMovements.tsx
│   └── SleeptimeStories.tsx
├── layout.tsx
└── globals.css
lib/
├── firebase.ts           (Config)
└── plantGraphics.ts      (Plant logic)
```

## Environment Variables

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

---

**Ready to ship. Set Firebase credentials + deploy. That's it.** 🚀
