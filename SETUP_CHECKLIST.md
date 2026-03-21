# Setup Checklist — Get DDHG Live Today

## ✅ Done (By Nancy)
- [x] Next.js boilerplate created
- [x] 9-habit dashboard UI built
- [x] Firebase config file created
- [x] Git repo initialized locally
- [x] Deployment guides written

## ⏳ TODO (By Sam or Someone With Accounts)

### Step 1: GitHub (5 min)
- [ ] Go to https://github.com/new
- [ ] Create repo: `dont-die-habit-garden`
- [ ] Copy the commands to push
- [ ] Run in terminal:
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden
git remote add origin https://github.com/YOUR_USERNAME/dont-die-habit-garden.git
git branch -M main
git push -u origin main
```

**Copy this URL once you create the repo:** `https://github.com/YOUR_USERNAME/dont-die-habit-garden`

### Step 2: Firebase (10 min)
- [ ] Go to https://console.firebase.google.com
- [ ] Click "Create project" → name it "dont-die-habit-garden"
- [ ] Enable Firestore Database
- [ ] Enable Authentication (Email/Password)
- [ ] Go to Project Settings (⚙️ gear icon)
- [ ] Click "Web" to add a web app
- [ ] Copy the config object:
```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

**Create `.env.local` file in the project:**
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden
cat > .env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=PASTE_apiKey_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=PASTE_authDomain_HERE
NEXT_PUBLIC_FIREBASE_PROJECT_ID=PASTE_projectId_HERE
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=PASTE_storageBucket_HERE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=PASTE_messagingSenderId_HERE
NEXT_PUBLIC_FIREBASE_APP_ID=PASTE_appId_HERE
EOF
```

### Step 3: Test Locally (5 min)
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden
npm install
npm run dev
```

Open http://localhost:3000

**Should see:**
- Purple gradient background
- "Don't Die Habit Garden" title
- 9 habit cards with emoji
- "Mark Complete" buttons
- DDC counter

If you see all this ✅, proceed to Vercel.

### Step 4: Vercel Deployment (10 min)
- [ ] Go to https://vercel.com/new
- [ ] Click "Continue with GitHub"
- [ ] Connect your GitHub account
- [ ] Find & select `dont-die-habit-garden` repo
- [ ] Vercel will auto-detect Next.js (good!)
- [ ] Click "Environment Variables"
- [ ] Add all 6 variables from `.env.local`:
  - NEXT_PUBLIC_FIREBASE_API_KEY
  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes
- [ ] Get your live URL: `https://dont-die-habit-garden.vercel.app` (or similar)

**Should see same thing as localhost, but at your Vercel URL**

### Step 5: Firestore Security (5 min)
In Firebase Console:
- [ ] Go to Firestore Database
- [ ] Click "Rules" tab
- [ ] Paste this:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /habit_completions/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
- [ ] Click "Publish"

---

## Summary

**After these 5 steps:**
1. ✅ Code on GitHub
2. ✅ Firebase auth + database ready
3. ✅ App live on Vercel URL
4. ✅ Database secured

**Total time: ~30 minutes**

**Next (for Nancy):**
- Add Firebase Auth UI
- Add meditation audio player
- Add sleeptime stories player
- Add mindful movements carousel
- Save data to Firestore
- Test with friends
- Ship by Friday

---

**Need help? See DEPLOYMENT.md or QUICKSTART.md**
