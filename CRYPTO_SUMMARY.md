# DDHG Crypto — Quick Reference

## Dual Token System

| Property | DDHG Points | DDHG Token |
|----------|------------|-----------|
| **Blockchain** | None (Firestore) | ERC-20 (Ethereum) |
| **Earned** | Daily habits | Weekly claims |
| **Transferable** | No | Yes (DEX trading) |
| **Supply** | Unlimited | 1B fixed |
| **Exchange** | 1:1 ratio | Public DEX (Uniswap) |

---

## Supply (1B Total)

```
User Rewards:     40% (400M)  ← Users earn these daily
Staking Rewards:  20% (200M)  ← Long-term holders
Foundation:       15% (150M)  ← Ops, dev
Team:            10% (100M)  ← 4-year vesting
Marketing:       10% (100M)  ← Growth
Liquidity:        5% (50M)   ← DEX seeding
─────────────────────────────
TOTAL:          100% (1B)
```

---

## Daily Earning → Weekly Claim Flow

```
┌─────────────────────┐
│  User Completes     │
│  9 Habits Daily     │
└──────────┬──────────┘
           │ Earns: 16-248 Points/day
           ↓
┌─────────────────────┐
│  Points Stored in   │
│  Firestore (Wallet) │
│  (Non-transferable) │
└──────────┬──────────┘
           │ Every Sunday 8 PM UTC
           ↓
┌─────────────────────┐
│  User Claims        │
│  Points → DDHG      │
│  (1:1 ratio)        │
└──────────┬──────────┘
           │ Sent to wallet
           ↓
┌─────────────────────┐
│  DDHG Tokens        │
│  Ready to Trade     │
│  (Uniswap/CEX)      │
└─────────────────────┘
```

---

## Earning Scenarios (Monthly)

| Activity | Points/Month | DDHG Tokens/Week | Value @ $0.10 | Value @ $1.00 |
|----------|------------|-----------------|--------------|---------------|
| **Base (no streaks)** | 480 | 68 | $6.80 | $68 |
| **Avg 7-day streaks** | 1,800 | 257 | $25.70 | $257 |
| **Avg 15-day streaks** | 3,600 | 514 | $51.40 | $514 |
| **Max (30-day streaks)** | 7,440 | 1,063 | $106.30 | $1,063 |

---

## Price Timeline (Estimate)

| Time | Price | Market Cap | Circulating |
|------|-------|-----------|------------|
| **Launch** | $0.01 | $10M | 50M |
| **Month 3** | $0.10 | $40M | 100M |
| **Month 6** | $0.25 | $50M | 200M |
| **Month 12** | $0.50 | $200M | 400M |

---

## Staking Rewards (Phase 2)

**Tier System (4-year pool: 200M tokens)**

| Tier | Min Stake | Duration | APY | Monthly Return |
|------|-----------|----------|-----|-----------------|
| **Bronze** | 100 DDHG | 30d | 20% | +1.67 tokens |
| **Silver** | 500 DDHG | 90d | 35% | +2.92 tokens |
| **Gold** | 2,000 DDHG | 180d | 50% | +4.17 tokens |

**Example:**
- Stake 1,000 DDHG for 90 days at 35% APY
- Earn: 87.5 DDHG (quarterly)
- Total after 1 year: 1,350 DDHG (if reinvested)

---

## Token Utility

### In-App (DDHG Points)
- Premium features (analytics, export, custom skins): 100-500 Points
- Health product redemptions: 500-5K Points
- Merch: 1K-3K Points
- Community challenges: 50-200 Points

### On-Chain (DDHG Token)
- Staking (earn APY 20-50%)
- Trading (DEX: Uniswap, Curve)
- Governance (Phase 3 DAO)
- Bridges (Phase 3: Polygon, Arbitrum)

---

## Launch Timeline

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| **Phase 1** | March 2026 | Points system, weekly claims, ERC-20 token, Uniswap listing |
| **Phase 2** | Q2 2026 | Staking pools, marketplace, cross-chain bridges |
| **Phase 3** | Q3 2026 | DAO governance, Treasury, NFT achievements |
| **Phase 4** | Q4 2026 | Institutional staking, CEX listings, partnerships |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| **Price collapse** | Burn mechanism, staking rewards, in-app utility |
| **User churn** | Gamification, plant growth, streaks |
| **Whale dump** | Team vesting (4 years), staking incentives |
| **Regulatory** | Points = gamification (not securities), token = utility (not equity) |

---

## Key Numbers

- **Total Supply:** 1,000,000,000 DDHG
- **Year 1 Emission:** 400M user reward tokens
- **Staking Pool:** 200M tokens (4-year distribution)
- **Launch Price:** $0.01
- **Target Year 1 Price:** $0.50-1.00
- **Target Market Cap:** $200M-1B

---

## Next Steps

1. **Deploy ERC-20 contract** (audit required)
2. **Seed Uniswap liquidity** (50M DDHG + $500K)
3. **Launch staking contracts** (Phase 2)
4. **Announce partnerships** (health brands, exchanges)
5. **Community governance** (Phase 3 DAO)

