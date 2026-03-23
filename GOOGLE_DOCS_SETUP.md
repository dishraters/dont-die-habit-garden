# DDHG Google Docs & Sheets — Complete Setup Guide

**Status:** All content files ready. Ready for Google import.

---

## Quick Summary

✅ **5 Documents Created:**
1. WHITEPAPER.md (8.1K) — Full product vision
2. CRYPTO_TOKENOMICS.md (11K) — Crypto economics deep-dive
3. CRYPTO_SUMMARY.md (4.6K) — Quick reference
4. DDHG_ECOSYSTEM.md (11K) — System architecture & data flows
5. TOKENOMICS_SHEET.csv (1.1K) — Habit token values

---

## Option A: Fastest Way (5 minutes)

### Google Sheets (Tokenomics)

1. **Go to:** https://sheets.new
2. **Title it:** `DDHG Tokenomics & Habits`
3. **File → Import:**
   - Upload: `/Users/nancy/.openclaw/workspace/dont-die-habit-garden/TOKENOMICS_SHEET.csv`
   - Replace all existing content
4. **Share:** With your email + team

**Done!** Tokenomics data is now in Google Sheets.

### Google Docs (4 Documents)

1. **Go to:** https://docs.new
2. **For each document below:**
   - Open file from `/Users/nancy/.openclaw/workspace/dont-die-habit-garden/`
   - Copy entire content
   - Paste into new Google Doc
   - Format (fix heading levels if needed)
   - Share

#### Doc 1: Whitepaper
- **File:** `WHITEPAPER.md`
- **Title:** `DDHG Whitepaper - Don't Die Habit Garden`
- **Format:** Headers → Heading 1-3, bold text for key terms

#### Doc 2: Crypto Tokenomics
- **File:** `CRYPTO_TOKENOMICS.md`
- **Title:** `DDHG Crypto Tokenomics`
- **Format:** Same as above

#### Doc 3: Crypto Summary
- **File:** `CRYPTO_SUMMARY.md`
- **Title:** `DDHG Crypto - Quick Reference`

#### Doc 4: Ecosystem Map
- **File:** `DDHG_ECOSYSTEM.md`
- **Title:** `DDHG Ecosystem Map & Data Flows`

---

## Option B: Organized Folder (Recommended)

### Step 1: Create Google Folder

1. Go to https://drive.google.com
2. Click **+ New → Folder**
3. Name: `DDHG - Don't Die Habit Garden`
4. Note the folder ID (you'll use it to organize docs)

### Step 2: Create Documents Inside Folder

**For each of the 5 files:**

1. Open Google Drive
2. Navigate to `DDHG - Don't Die Habit Garden` folder
3. Click **+ New → Google Docs** (for markdown files) or **Google Sheets** (for CSV)
4. Name: `DDHG Whitepaper`, `DDHG Crypto Tokenomics`, etc.
5. Paste content from corresponding markdown file
6. Format as needed

### Step 3: Share Folder

1. Right-click folder → **Share**
2. Add: shmonac@gmail.com (your email)
3. Add: Any team members
4. Permission: **Editor** (full access)

---

## File Locations (Local)

All files are in Git repository at:
```
/Users/nancy/.openclaw/workspace/dont-die-habit-garden/
```

**Main Files:**
- `WHITEPAPER.md` — Product whitepaper
- `CRYPTO_TOKENOMICS.md` — Tokenomics deep-dive
- `CRYPTO_SUMMARY.md` — Quick reference
- `DDHG_ECOSYSTEM.md` — Architecture & flows
- `TOKENOMICS_SHEET.csv` — Habit token table

---

## What Each Document Contains

### 1. WHITEPAPER.md
- Executive summary
- Product overview (what DDHG does/doesn't do)
- 9-habit system specification
- Tokenomics model overview
- Plant growth system (7 stages)
- Revenue model (future)
- User flow (Day 1 → Monthly)
- Success metrics
- Technical architecture
- Competitive advantages
- Roadmap (Phase 2-4)

**Audience:** Investors, partners, team leads

### 2. CRYPTO_TOKENOMICS.md
- Dual-token system (Points + ERC-20)
- Supply allocation (1B tokens)
  - 40% user rewards
  - 20% staking rewards
  - 40% team/foundation/marketing
- Emission schedule (Year 1: 400M tokens)
- Weekly claim mechanism
- Staking rewards program (20-50% APY)
- Token utility (in-app + DeFi)
- Price discovery model
- Deflationary mechanisms (burn, fees)
- Tokenomics scenarios (conservative/moderate/optimistic)
- Risk factors & mitigations
- Roadmap (Phase 1-4)

**Audience:** Crypto enthusiasts, token holders, traders

### 3. CRYPTO_SUMMARY.md
- Quick reference cheat sheet
- Dual token system comparison
- Supply breakdown (visual)
- Daily earning scenarios
- Price timeline
- Staking rewards examples
- Token utility matrix
- Key numbers summary
- Launch timeline
- Risk mitigations

**Audience:** Quick learners, traders, new users

### 4. DDHG_ECOSYSTEM.md
- Complete system architecture (diagram)
- Data flow (habits → webhooks → tokens → DEX)
- User flow (detailed steps)
- Economic loops (habit → staking → appreciation)
- Monetization paths (user + platform)
- Competitive positioning
- Success metrics dashboard
- Governance structure (Phase 3 DAO)
- Security & compliance
- Timeline to profitability

**Audience:** Developers, architects, analysts

### 5. TOKENOMICS_SHEET.csv
- All 9 habits with token values
- Base + 7-day + 30-day bonuses
- Daily economy scenarios
- Streak multipliers
- Plant stage requirements
- Crypto supply allocation

**Audience:** Everyone (reference data)

---

## Google Sheets Tabs to Create

After importing the CSV, add additional sheets for:

### Tab 1: Habits Overview (from CSV)
| Habit | Source App | Base Tokens | 7-Day | 30-Day |
|-------|-----------|------------|-------|--------|
| (auto-filled from CSV import) |

### Tab 2: Daily Economy
| Scenario | Daily | Monthly | @ $0.10 | @ $1.00 |
|----------|-------|---------|---------|----------|
| No streaks | 16 | 480 | $6.80 | $68 |
| 7-day avg | 60 | 1,800 | $25.70 | $257 |
| 15-day avg | 120 | 3,600 | $51.40 | $514 |
| Max (30-day) | 248 | 7,440 | $106.30 | $1,063 |

### Tab 3: Plant Stages
| Stage | Tokens | Visual | Timeline (No Streak) | Timeline (7-day) | Timeline (30-day) |
|-------|--------|--------|----------------------|------------------|------------------|
| 1 | 0-100 | 🌱 Seed | 6 days | 2 days | 1 day |
| 2 | 101-300 | 🌿 Sprout | 12 days | 3 days | 1 day |
| ... | ... | ... | ... | ... | ... |

### Tab 4: Crypto Supply
| Allocation | Tokens | % | Purpose |
|-----------|--------|-----|---------|
| User Rewards | 400M | 40% | Daily earnings |
| Staking | 200M | 20% | APY incentives |
| Foundation | 150M | 15% | Ops |
| Team | 100M | 10% | 4-year vesting |
| Marketing | 100M | 10% | Growth |
| Liquidity | 50M | 5% | DEX seeding |

### Tab 5: Staking Rewards
| Tier | Minimum | Duration | APY | Monthly Return |
|------|---------|----------|-----|-----------------|
| Bronze | 100 | 30d | 20% | +1.67 |
| Silver | 500 | 90d | 35% | +2.92 |
| Gold | 2,000 | 180d | 50% | +4.17 |

---

## Share Permissions

Once docs are created, share with:

| Person | Email | Permission |
|--------|-------|-----------|
| You | shmonac@gmail.com | Owner |
| Team | [team emails] | Editor |
| Investors | [investor emails] | Viewer |
| Partners | [partner emails] | Viewer |

---

## Next Steps After Setup

1. ✅ Create Google folder: `DDHG - Don't Die Habit Garden`
2. ✅ Create 4 Google Docs (whitepaper, crypto tokenomics, crypto summary, ecosystem)
3. ✅ Create 1 Google Sheet (tokenomics & habits)
4. ✅ Add 5 tabs to sheet (habits, daily economy, plant stages, supply, staking)
5. ✅ Share folder with team
6. 🔄 **Next:** Add dashboard data (real-time user/token metrics)
7. 🔄 **Later:** Embed live charts (DAU, APY, price, emissions)

---

## Live Dashboard (Phase 2)

Once DDHG is live with real users, create a dashboard sheet that auto-updates:

**Metrics to Track:**
- Total users registered
- Monthly active users (MAU)
- Daily active users (DAU)
- Avg habits completed/user
- Token emissions (daily/monthly)
- Plant stage distribution
- Price (from DEX)
- Market cap
- Staking TVL
- Revenue (premium subs + marketplace fees)

---

## File Git History

All files committed to Git:
```bash
cd /Users/nancy/.openclaw/workspace/dont-die-habit-garden
git log --oneline | head -5
```

Latest commit:
```
17e3179 Add comprehensive crypto tokenomics & whitepaper docs
```

---

## Questions?

**File locations:**
- Local: `/Users/nancy/.openclaw/workspace/dont-die-habit-garden/`
- GitHub: `dont-die-habit-garden/` (public repo)

**Google Drive:**
- Create folder: https://drive.google.com
- Create docs: https://docs.new
- Create sheets: https://sheets.new

**Support:**
- Check CRYPTO_SUMMARY.md for quick answers
- Check DDHG_ECOSYSTEM.md for architecture questions
- Check WHITEPAPER.md for business questions

---

## Summary

| Item | Status | Location |
|------|--------|----------|
| Whitepaper | ✅ Ready | `/WHITEPAPER.md` |
| Crypto Tokenomics | ✅ Ready | `/CRYPTO_TOKENOMICS.md` |
| Crypto Summary | ✅ Ready | `/CRYPTO_SUMMARY.md` |
| Ecosystem Map | ✅ Ready | `/DDHG_ECOSYSTEM.md` |
| Tokenomics Sheet | ✅ Ready | `/TOKENOMICS_SHEET.csv` |
| Google Docs | ⏳ Manual | Create at docs.new |
| Google Sheets | ⏳ Manual | Create at sheets.new |
| Folder Sharing | ⏳ Manual | Share in Google Drive |

**ETA:** 30 minutes to have all docs in Google Drive + shared with team.

