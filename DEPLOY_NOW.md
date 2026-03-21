# DEPLOY DDHG NOW - Step by Step 🚀

## Prerequisites (5 min)

### 1. Firebase Project
Go to https://console.firebase.google.com

1. Click "Create Project"
2. Name: `dont-die-habit-garden`
3. Enable Analytics (optional)
4. Create project
5. Wait for it to initialize

### 2. Enable Services
In Firebase console:

**Authentication:**
- Go to "Authentication" > "Sign-in method"
- Enable "Email/Password"
- Save

**Firestore:**
- Go to "Firestore Database"
- Click "Create Database"
- Select "Start in test mode"
- Select region (us-central1)
- Create

### 3. Get Credentials
In Firebase console:

1. Click settings icon (⚙️) > "Project settings"
2. Scroll to "Your apps" > "Web"
3. Click "Config" to reveal credentials
4. Copy all 6 values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### 4. Add to .env.local
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden

# Create file with these values:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deploy to Vercel (10 min)

### Step 1: Prepare Git Repo
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden

git add .
git commit -m "DDHG MVP: 9 habits, plant growth, DDC earning"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Login with GitHub
3. Import `dont-die-habit-garden` repo
4. Click "Create"

### Step 3: Add Environment Variables
1. In Vercel project > Settings > Environment Variables
2. Add all 6 Firebase variables from Step 4 above
3. Save

### Step 4: Deploy
1. Vercel auto-deploys on git push
2. Wait for build to complete (2-3 min)
3. You'll get a live URL: `https://dont-die-habit-garden.vercel.app`

## Testing Locally First (optional)

```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden
npm install
npm run dev
# Open: http://localhost:3000
```

## What You Should See

✅ 9 habit cards with emoji plants
✅ Click "Mark Complete" to earn DDC
✅ Meditation/Stories/Movements open modals
✅ Plant grows through 5 stages
✅ Streaks counter (🔥 days)
✅ Total DDC tracker

## Test Credentials

- **User:** test-user-[auto-generated]
- **Password:** Not needed (demo mode)
- **Habits pre-loaded:** Varying streaks (2-12 days)

## Troubleshooting

**"Firebase not initialized"**
- Check .env.local has all 6 variables
- Make sure variables have `NEXT_PUBLIC_` prefix
- Restart `npm run dev`

**"Cannot mark complete"**
- Firebase config is incorrect
- Check browser console for errors
- Verify credentials in .env.local

**Vercel deployment stuck**
- Wait 5+ minutes for build
- Check Vercel dashboard for errors
- Push again: `git push origin main`

## What's Next (Week 2)

- Add Firebase Auth (sign up/login UI)
- Connect Dishrated (auto-sync meals)
- Connect TrainLog (auto-sync workouts)
- Real meditation/story audio files
- Leaderboards + social sharing

## Live Demo

Once deployed to Vercel, you have:
- ✅ Live working app
- ✅ Ready to test with 20-50 people
- ✅ Can iterate quickly

**Share the Vercel URL with Sam's Telegram group** 🎉

---

**Do these 4 steps in order. Total time: ~20 minutes.**
