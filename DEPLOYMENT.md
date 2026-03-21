# Deployment Guide: GitHub → Vercel

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create repo named: `dont-die-habit-garden`
3. Choose "Public" (or Private if you prefer)
4. Click "Create repository"

## Step 2: Push to GitHub

```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/dont-die-habit-garden.git

# Rename branch to main (if needed)
git branch -M main

# Push
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

## Step 3: Connect Firebase

1. Go to https://console.firebase.google.com
2. Create a new project (or use existing one)
3. Enable:
   - Authentication (Email/Password)
   - Firestore Database
4. Get your config credentials (Project Settings → Web)
5. Create `.env.local` in the project root:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 4: Test Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — should see the 9 habits dashboard.

## Step 5: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Import your GitHub repo (connect GitHub account first)
3. Select `dont-die-habit-garden`
4. Add environment variables:
   - Copy each variable from `.env.local`
   - Paste into Vercel dashboard
5. Click "Deploy"
6. Wait ~2 minutes
7. Get your live URL: `https://dont-die-habit-garden.vercel.app`

### Option B: Via CLI

```bash
npm install -g vercel
vercel --prod
```

Follow prompts, add env vars when asked.

## Step 6: Verify Deployment

1. Visit your Vercel URL
2. Should see "Don't Die Habit Garden" with 9 habit cards
3. Click "Mark Complete" — should show as complete
4. Earn DDC: 10 per habit, 100 if all 9

## Firebase Firestore Rules (Security)

Update your Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /habit_completions/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /ddc_transactions/{document=**} {
      allow read: if request.auth.uid == resource.data.user_id;
      allow write: if false; // Only server can write (future)
    }
  }
}
```

## Continuous Deployment

Every push to `main` branch → auto-deploys to Vercel.

```bash
# Make changes
git add .
git commit -m "Add feature"
git push origin main

# Vercel auto-deploys ~30 seconds later
```

## Environment Variables (for Vercel)

Set in Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY = ...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = ...
NEXT_PUBLIC_FIREBASE_PROJECT_ID = ...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = ...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = ...
NEXT_PUBLIC_FIREBASE_APP_ID = ...
```

**Note:** `NEXT_PUBLIC_` prefix means these are visible in the browser (OK for Firebase public keys).

## Monitoring

- Vercel Dashboard: https://vercel.com/dashboard
- See live URL, logs, deployments
- Firebase Console: https://console.firebase.google.com
- See Firestore data, auth users, logs

## Troubleshooting

**Build fails?**
```bash
npm install
npm run build
```

**Firebase config missing?**
- Check `.env.local` exists with all 6 variables
- Vercel dashboard environment variables match

**App shows blank?**
- Check browser console (F12) for errors
- Verify Firebase config is correct

**Deploy won't update?**
```bash
git push origin main --force
vercel --prod
```

---

## Next: Add Auth + Features

After deployment works:
1. Add Firebase Auth (sign up/login)
2. Add Meditation audio player
3. Add Sleeptime Stories player
4. Add Mindful Movements carousel
5. Save completions to Firestore
6. Ship to friends for testing
