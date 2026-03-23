# DDHG Complete Rebuild - Coding Agent Specification

**Project:** Don't Die Habit Garden (DDHG)  
**Objective:** Fix plant growth logic, build missing app pages, implement redirects  
**Timeline:** Complete end-to-end in one session  
**Definition of Done:** See DEFINITION_OF_DONE.md

---

## PHASE 1: FIX PLANT GROWTH LOGIC

### Problem
Currently plants grow based on **per-habit streaks** (individual habit day count 0-16).  
Should grow based on **cumulative tokens** (total tokens earned across all habits 0-3501+).

### Solution

#### File 1: Update `lib/plantGraphics.ts`

**Replace getPlantStage function:**

```typescript
export const getPlantStage = (totalDDC: number): GrowthStage => {
  if (totalDDC < 100)        return { label: 'Seed',        emoji: '🌱', progress: (totalDDC / 100) * 100 }
  if (totalDDC < 300)        return { label: 'Sprout',      emoji: '🌿', progress: ((totalDDC - 100) / 200) * 100 }
  if (totalDDC < 700)        return { label: 'Young Tree',  emoji: '🌲', progress: ((totalDDC - 300) / 400) * 100 }
  if (totalDDC < 1200)       return { label: 'Mature Tree', emoji: '🌳', progress: ((totalDDC - 700) / 500) * 100 }
  if (totalDDC < 2000)       return { label: 'Thriving',    emoji: '🌲✨', progress: ((totalDDC - 1200) / 800) * 100 }
  if (totalDDC < 3500)       return { label: 'Flourishing', emoji: '🌴', progress: ((totalDDC - 2000) / 1500) * 100 }
  return                       { label: 'Monument',    emoji: '🌳👑', progress: 100 }
}
```

#### File 2: Update `app/components/PlantCard.tsx`

**Change props:**
```typescript
interface PlantCardProps {
  totalDDC: number        // NEW: total cumulative tokens
  onMarkComplete: () => void
  onOpenFeature?: () => void
}
```

**Update rendering:**
```typescript
const plantStage = getPlantStage(totalDDC)  // Use totalDDC instead of streak

// Progress bar shows progress to next stage
const stages = [100, 300, 700, 1200, 2000, 3500, Infinity]
const currentStageIndex = stages.findIndex(s => totalDDC < s)
const currentStageMin = stages[currentStageIndex - 1] || 0
const currentStageMax = stages[currentStageIndex] || 3501
const progressToNext = ((totalDDC - currentStageMin) / (currentStageMax - currentStageMin)) * 100
```

#### File 3: Update `app/page.tsx`

**Pass totalDDC to PlantCard:**
```typescript
<PlantCard
  totalDDC={totalDDC}  // Changed from streak
  onMarkComplete={() => handleHabitAction(habit.id)}
/>
```

---

## PHASE 2: BUILD HABIT GARDEN PAGES

**App location:** `/Users/nancy/.openclaw/workspace/habit-garden`

### Create 4 New Pages

#### 1. `/app/gratitude/page.tsx`
- Form: Input 3+ things grateful for + 1 affirmation
- Button: "Save Gratitude"
- On submit: POST to webhook `/api/webhooks/habit-garden` with:
  ```json
  {
    "habitType": "gratitude",
    "grateful_1": "value1",
    "grateful_2": "value2",
    "grateful_3": "value3",
    "affirmation": "value4",
    "completedAt": "ISO timestamp"
  }
  ```
- Success: Show "✅ Gratitude logged! +2 tokens" and redirect to DDHG after 2s

#### 2. `/app/planning/page.tsx`
- Form: Input 3+ big wins (comma-separated or multiline)
- Button: "Save Plan"
- On submit: POST to webhook with:
  ```json
  {
    "habitType": "planning",
    "big_wins": ["win1", "win2", "win3"],
    "completedAt": "ISO timestamp"
  }
  ```
- Success message + redirect

#### 3. `/app/meditation/page.tsx`
- Timer component: Start/stop/reset
- Minimum: 5 minutes
- On complete: POST to webhook with:
  ```json
  {
    "habitType": "meditation",
    "duration": 300,
    "completedAt": "ISO timestamp"
  }
  ```
- Auto-redirect after 2s

#### 4. `/app/sleep/page.tsx`
- Form: Input hours slept (number)
- Minimum: 7 hours
- Optional: Bedtime and wake time
- On submit: POST to webhook with:
  ```json
  {
    "habitType": "sleep",
    "sleep_hours": 8,
    "bedtime": "2026-03-22T22:00:00Z",
    "wake_time": "2026-03-23T06:00:00Z",
    "completedAt": "ISO timestamp"
  }
  ```
- Success + redirect

**Style:** Match existing Habit Garden design. Use Tailwind CSS.

---

## PHASE 3: BUILD DISHRATED MEAL PAGES

**App location:** `/Users/nancy/.openclaw/workspace/dishrated` (or wherever Dishrated is)

### Create 3 New Pages

#### 1. `/app/breakfast/page.tsx`
- Form: Meal name + health score (1-10 slider)
- Minimum health score: 5
- On submit: POST to webhook with:
  ```json
  {
    "habitType": "breakfast",
    "meal_name": "eggs and toast",
    "health_score": 7,
    "completedAt": "ISO timestamp"
  }
  ```
- Success + redirect

#### 2. `/app/lunch/page.tsx`
Same as breakfast

#### 3. `/app/dinner/page.tsx`
Same as breakfast

**Webhook endpoint:** `/api/webhooks/dishrated`

**Style:** Match Dishrated design.

---

## PHASE 4: DEPLOY TRAINLOG

**Current state:** Local HTML at `/Users/nancy/.openclaw/workspace/trainlog`

### Convert to Next.js + Deploy

#### 1. Create app structure
```
trainlog/
├── app/
│   ├── page.tsx (root)
│   ├── exercise/
│   │   └── page.tsx
│   └── api/
│       └── webhooks/
│           └── trainlog/
│               └── route.ts
├── package.json
├── next.config.js
└── tsconfig.json
```

#### 2. `/app/exercise/page.tsx`
- Form: Exercise type (dropdown) + Duration (minutes) + Intensity (1-10)
- Minimum: 20 minutes OR 5+ intensity
- On submit: POST to `/api/webhooks/trainlog` with:
  ```json
  {
    "habitType": "exercise",
    "exercise_type": "running",
    "duration": 30,
    "intensity": 7,
    "completedAt": "ISO timestamp"
  }
  ```
- Success + redirect to DDHG

#### 3. Deploy to Vercel
```bash
cd trainlog
vercel deploy
```

Note the live URL (e.g., `https://trainlog-xyz.vercel.app`)

---

## PHASE 5: UPDATE DDHG APP REDIRECTS

**App location:** `/Users/nancy/.openclaw/workspace/dont-die-habit-garden`

### File: `app/page.tsx`

**Update handleHabitAction to redirect instead of modal:**

```typescript
const handleHabitAction = (habitId: string) => {
  const redirects: { [key: string]: string } = {
    meditation: 'https://habit-garden-iota.vercel.app/meditation',
    gratitude: 'https://habit-garden-iota.vercel.app/gratitude',
    planning: 'https://habit-garden-iota.vercel.app/planning',
    sleep: 'https://habit-garden-iota.vercel.app/sleep',
    breakfast: 'https://dishrated.com/breakfast',
    lunch: 'https://dishrated.com/lunch',
    dinner: 'https://dishrated.com/dinner',
    training: 'https://trainlog-xyz.vercel.app/exercise', // Replace with actual URL
    stretching: null  // Keep modal for stretching
  }

  const url = redirects[habitId]
  
  if (url) {
    window.open(url, '_blank')  // Open in new tab
  } else if (habitId === 'stretching') {
    setOpenModal(habitId)  // Keep stretching as modal
  }
}
```

---

## DELIVERABLES CHECKLIST

- [ ] PlantCard now uses totalDDC instead of per-habit streaks
- [ ] Plant emoji changes: 🌱 → 🌿 → 🌲 → 🌳 → 🌲✨ → 🌴 → 🌳👑
- [ ] Habit Garden pages created: /gratitude, /planning, /meditation, /sleep
- [ ] Dishrated pages created: /breakfast, /lunch, /dinner
- [ ] TrainLog deployed to Vercel with /exercise page
- [ ] DDHG app redirects to all external pages
- [ ] All webhooks fire correctly (verify in Firestore)
- [ ] No 404 errors on any page
- [ ] Mobile responsive on all pages
- [ ] Success messages show after logging
- [ ] Auto-redirect to DDHG after 2s on each page

---

## SUCCESS CRITERIA

See DEFINITION_OF_DONE.md for complete checklist.
