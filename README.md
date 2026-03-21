# Don't Die Habit Garden 🌱

A habit tracking app with 9 core habits for building a healthier life. Complete all 9 daily to earn DDC tokens.

## Setup

### 1. Clone & Install
```bash
git clone <repo-url>
cd dont-die-habit-garden
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy your Firebase config
5. Create `.env.local` from `.env.local.example`
6. Paste your Firebase credentials

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 3. Run Locally
```bash
npm run dev
```
Open http://localhost:3000

### 4. Deploy to Vercel
```bash
vercel --prod
```

## The 9 Habits

1. 🌟 Gratitude
2. 🧘 Meditation
3. 💪 Training
4. 🍳 Breakfast
5. 🥗 Lunch
6. 🍽️ Dinner
7. 📖 Sleeptime Stories
8. 📋 Planning
9. 🧘 Mindful Movements

**Complete all 9 → Earn 100 DDC**

## Architecture

- **Frontend:** Next.js 14 + React 18 + TypeScript
- **Backend:** Firebase (Auth + Firestore)
- **Deploy:** Vercel
- **State:** React hooks + Firestore

## Database Schema (Firestore)

```
users/
  {userId}/
    - ddc_balance: number
    - ddc_earned_today: number
    - habits_completed_today: array
    - last_updated: timestamp

habit_completions/
  {completionId}/
    - user_id: string
    - habit_id: string
    - completed_date: date
    - created_at: timestamp

ddc_transactions/
  {transactionId}/
    - user_id: string
    - amount: number
    - reason: string
    - created_at: timestamp
```

## Next Steps

- [ ] Add Firebase Auth (sign up/login)
- [ ] Connect Meditation audio player
- [ ] Connect Sleeptime Stories audio player
- [ ] Add Mindful Movements image carousel
- [ ] Save habit completions to Firestore
- [ ] Add Dishrated API integration
- [ ] Deploy to Vercel
- [ ] Test with 20-50 people

## Development

All features are in `app/` directory using Next.js App Router pattern.

Main components:
- `app/page.tsx` - Dashboard (9 habits)
- `lib/firebase.ts` - Firebase config + functions

---

**Ship Friday. Iterate constantly.**
