# Quick Start (Today)

## 5 Minutes to Running App

### 1. Install Dependencies
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden
npm install
```

### 2. Create `.env.local`
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Add your Firebase credentials (get from Firebase Console):
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 3. Run Dev Server
```bash
npm run dev
```

Open browser: **http://localhost:3000**

## What You'll See

✅ 9 habit cards with emoji
✅ "Mark Complete" button for each
✅ DDC counter (10 per habit, 100 if all 9)
✅ Responsive mobile design

## What's Next (Today)

- [ ] Add Firebase Auth
- [ ] Add Meditation player
- [ ] Add Sleeptime Stories player
- [ ] Add Mindful Movements carousel
- [ ] Deploy to Vercel (see DEPLOYMENT.md)
- [ ] Test with 20 people

## File Structure

```
dont-die-habit-garden/
├── app/
│   ├── page.tsx (main dashboard)
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── firebase.ts (Firebase config)
├── public/
├── package.json
├── next.config.js
├── tsconfig.json
├── README.md
└── DEPLOYMENT.md
```

## Useful Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Build for production
npm start         # Run production build locally
npm run lint      # Check for errors
vercel --prod     # Deploy to Vercel
```

## Need Help?

- Next.js docs: https://nextjs.org/docs
- Firebase docs: https://firebase.google.com/docs
- Vercel docs: https://vercel.com/docs

---

**You're ready. Ship fast. 🚀**
