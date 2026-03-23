# DDHG Crypto Tokenomics
## Don't Die Habit Garden — Token Economy & Blockchain Integration

**Version:** 1.0  
**Date:** March 22, 2026  
**Status:** Tokenomics Design Phase

---

## Overview

DDHG operates on a **dual-token system**:
1. **In-App Tokens (DDHG Points)** — Earned daily, gamified, non-transferable
2. **Blockchain Tokens (DDHG)** — ERC-20 standard, tradeable, scarce

Users earn Points daily. Points can be converted to blockchain tokens at a 1:1 ratio on scheduled weekly windows.

---

## Token Architecture

### Token A: DDHG Points (In-App)
- **Purpose:** Daily gamification, habit tracking
- **Blockchain:** None (stored in Firestore)
- **Transferability:** Non-transferable
- **Supply:** Unlimited (new points created daily)
- **Exchange Rate:** 1 Point = 1 DDHG token (on claim)
- **Claim Window:** Weekly (Sunday 8 PM UTC)

### Token B: DDHG (Blockchain Token)
- **Standard:** ERC-20 (Ethereum mainnet)
- **Ticker:** $DDHG
- **Total Supply:** 1,000,000,000 (1B tokens)
- **Decimal Places:** 18
- **Transferability:** Full (can trade, send, hold)
- **Exchange:** DEX listing (Uniswap primary)

---

## Supply Allocation

**Total Supply:** 1,000,000,000 DDHG tokens

| Allocation | Tokens | % | Purpose |
|-----------|--------|-----|---------|
| **User Rewards** | 400,000,000 | 40% | Daily habit earnings |
| **Staking Rewards** | 200,000,000 | 20% | Long-term holders |
| **Foundation** | 150,000,000 | 15% | Operations, development |
| **Team** | 100,000,000 | 10% | Core team (4-year vesting) |
| **Marketing** | 100,000,000 | 10% | Growth campaigns |
| **Liquidity** | 50,000,000 | 5% | DEX seeding, bridges |

**Total:** 1,000,000,000 (100%)

---

## Emission Schedule

### Year 1 (2026)
- **Daily emission:** 1,095,890 tokens/day (from 400M user reward pool)
- **Monthly:** ~33M tokens
- **Yearly:** ~400M tokens (full allocation by end of 2026)

**Halving Events:** None planned (linear emission)

### Years 2-5
- **Annual emission:** 0 tokens (all user rewards released in Year 1)
- **Staking rewards:** 50M tokens/year (from 200M staking pool)
- **Deflation:** Token burn from transaction fees (0.1% to burn wallet)

---

## User Earning Model

### Daily In-App Points

Users earn **DDHG Points** daily (stored in Firestore):

| Scenario | Daily Points | Weekly (7d) | Monthly (30d) |
|----------|------------|-----------|------------|
| Base (no streaks) | 16 | 112 | 480 |
| Avg 7-day streaks | 60 | 420 | 1,800 |
| Avg 15-day streaks | 120 | 840 | 3,600 |
| Max (30-day streaks) | 248 | 1,736 | 7,440 |

### Weekly Claims → Blockchain

**Every Sunday 8 PM UTC:**
- Users can claim accumulated Points as DDHG tokens
- 1 Point → 1 DDHG token (1:1 ratio)
- Points claimed are burned (removed from Firestore)
- DDHG tokens deposited to user's wallet

**Claim Window:** 24 hours (Sunday 8 PM → Monday 8 PM UTC)  
**Late Claims:** Can claim up to 30 days after window (no penalty)  
**Unclaimed Points:** Roll over to next week (no expiry)

### Example Earning Path

**Week 1:**
- User completes all 9 habits, avg 7-day streak: 60 points/day
- Weekly total: 420 DDHG Points
- Sunday claim: 420 DDHG tokens sent to wallet

**Week 4 (first 30-day streak achieved):**
- User completes all 9 habits, 30-day streak: 248 points/day
- Weekly total: 1,736 DDHG Points
- Sunday claim: 1,736 DDHG tokens sent to wallet

**After 30 days of consistent habits:**
- Total earned: ~7,200 DDHG tokens
- At $0.10/token (early price): $720
- At $1.00/token (mature price): $7,200

---

## Token Utility

### In-App (Non-Crypto)

1. **Premium Features**
   - Unlock advanced analytics (habit insights, trends)
   - Export data (CSV, PDF, API)
   - Custom plant skins
   - **Cost:** 100-500 DDHG Points/month

2. **Redemptions**
   - Health products (protein powder, gym gear)
   - Wellness subscriptions (Headspace, Peloton, etc.)
   - Merch (DDHG branded apparel)
   - **Cost:** 500-5,000 DDHG Points

3. **Social Features**
   - Create community challenges (50 DDHG Points)
   - Sponsor leaderboards (100 DDHG Points)
   - **Cost:** 50-200 DDHG Points

### Blockchain (DeFi)

1. **Staking**
   - Stake DDHG tokens → earn staking rewards (APY %)
   - Minimum: 100 DDHG
   - Duration: 30, 90, 180 days
   - APY: 20%, 35%, 50% (tiered)

2. **Trading**
   - Trade on Uniswap, Curve, other DEXs
   - LP pairs: DDHG/ETH, DDHG/USDC, DDHG/USDT
   - Trading fee: 0.25% (standard Uniswap)

3. **Governance (Phase 2)**
   - Snapshot votes (community proposals)
   - DAO treasury (300M tokens reserved)
   - Token-weighted voting (1 token = 1 vote)

4. **Bridges (Phase 3)**
   - Cross-chain: Polygon, Arbitrum, Optimism
   - Wrapped tokens: wDDHG
   - Bridge fee: 0.1%

---

## Staking Rewards Program

### Staking Tiers

| Tier | Tokens Staked | Duration | APY | Monthly Return (100 tokens) |
|------|--------------|----------|-----|---------------------------|
| Bronze | 100-500 | 30 days | 20% | ~1.67 tokens |
| Silver | 501-2,000 | 90 days | 35% | ~2.92 tokens |
| Gold | 2,001+ | 180 days | 50% | ~4.17 tokens |

### Staking Pool
- **Source:** 200M tokens (20% of total supply)
- **Distribution:** 50M/year for 4 years
- **Early liquidity:** 80M for first 6 months (accelerated)
- **Late liquidity:** 20M/year thereafter

**Total staked after 1 year (projected):**
- Conservative: 50M DDHG staked = $5M at $0.10
- Moderate: 150M DDHG staked = $15M at $0.10
- Optimistic: 300M DDHG staked = $30M at $0.10

---

## Price Discovery & Market Structure

### Launch Price (Assumption)
- **Initial:** $0.01 per DDHG (DEX seeding)
- **Target Month 3:** $0.10 (2-user retention growth)
- **Target Year 1:** $0.50-$1.00 (ecosystem maturity)

### Market Capitalization
| Price | Market Cap (400M circ) | Market Cap (1B total) |
|-------|----------------------|----------------------|
| $0.01 | $4M | $10M |
| $0.10 | $40M | $100M |
| $0.50 | $200M | $500M |
| $1.00 | $400M | $1B |

### Circulating Supply Growth

**Circulating Supply Curve** (as tokens are claimed from rewards):

| Month | Claimed (User Rewards) | Staking Rewards | Total Circ | % of 1B |
|-------|----------------------|-----------------|-----------|---------|
| 0 | 50M (seed) | 0 | 50M | 5% |
| 3 | 90M | 12.5M | 102.5M | 10% |
| 6 | 180M | 25M | 205M | 20% |
| 12 | 400M | 50M | 450M | 45% |
| 24 | 400M | 100M | 500M | 50% |

---

## Deflationary Mechanisms

### Fee Burn
- **Transaction fees:** 0.1% on all blockchain transfers (in-app claims, trades)
- **Destination:** Burn wallet (0x0000...0001)
- **Expected monthly burn:** 50K-500K tokens (scales with volume)

### Redemption Burn
- **In-app redemptions:** 20% of redeemed tokens burned
- **Example:** User redeems 500 DDHG Points → 100 tokens burned, 400 retained

### Total Deflationary Impact (Year 1)
- **Estimated:** 5-10M tokens burned
- **Net supply Year 1:** 390-395M (from 400M allocated)

---

## Tokenomics Scenarios

### Conservative (Low Adoption)
- **Daily active users:** 10,000
- **Avg points/user:** 30/day
- **Daily emission:** 300K tokens
- **Monthly:** 9M tokens
- **Year 1 total:** 110M tokens claimed
- **Price:** $0.05-0.10 (low demand)

### Moderate (Healthy Growth)
- **Daily active users:** 100,000
- **Avg points/user:** 60/day
- **Daily emission:** 6M tokens
- **Monthly:** 180M tokens
- **Year 1 total:** 2.2B tokens claimed (capped at 400M)
- **Price:** $0.25-0.75 (steady demand)

### Optimistic (Viral Growth)
- **Daily active users:** 1,000,000
- **Avg points/user:** 80/day
- **Daily emission:** 80M tokens
- **Monthly:** 2.4B tokens (exceeds 400M pool)
- **Year 1 claimed:** 400M (pool exhausted by month 2)
- **Price:** $1.00-5.00 (high demand)

---

## Risk Factors & Mitigations

### Risk 1: Token Price Collapse
**Mitigation:**
- Burn mechanism reduces supply
- Staking rewards encourage holding
- Utility in-app prevents pure speculation

### Risk 2: User Churn (Points Worthless)
**Mitigation:**
- Gamification keeps engagement high
- Plant growth provides intrinsic motivation
- Redemption options maintain utility

### Risk 3: Regulatory (Crypto Classification)
**Mitigation:**
- DDHG Points ≠ Securities (in-app gamification)
- DDHG token = Utility (not profit-sharing)
- Compliance review with legal counsel required

### Risk 4: Large Holder Dump
**Mitigation:**
- Team tokens on 4-year vesting schedule
- Large stakers incentivized to hold (APY%)
- Gradual release prevents sudden sell pressure

---

## Roadmap

### Phase 1 (Launch - March 2026)
✅ In-app Points system  
✅ Weekly claim mechanism  
✅ ERC-20 token deployment  
🔄 Uniswap listing (pending)  
- Wallets: MetaMask, WalletConnect

### Phase 2 (Q2 2026)
- [ ] Staking contracts (30/90/180 day pools)
- [ ] Redemption marketplace (health products, merch)
- [ ] Cross-chain bridges (Polygon, Arbitrum)
- [ ] Price oracle (Chainlink)

### Phase 3 (Q3 2026)
- [ ] Governance token (DAO launch)
- [ ] Snapshot voting (community proposals)
- [ ] Treasury multisig (3/5 signers)
- [ ] NFT achievements (habit milestones)

### Phase 4 (Q4 2026)
- [ ] Institutional staking (large holder pools)
- [ ] Options/Futures (if market cap > $100M)
- [ ] Partnerships (health/fitness brands)
- [ ] Exchange listings (major CEXs if qualified)

---

## Financial Projections

### Revenue Model (Year 1)

| Source | Revenue | Notes |
|--------|---------|-------|
| **Premium subscriptions** | $500K | 10K users × $5/mo × 10 mo avg |
| **Marketplace fees** | $200K | 2% on $10M redeemed |
| **Staking pool cuts** | $100K | 0.5% on staking volume |
| **Partnerships** | $300K | Brand integrations (sponsorships) |
| **Total Revenue** | **$1.1M** | |

### Operating Costs (Year 1)
| Cost | Amount | Notes |
|------|--------|-------|
| **Dev team** | $500K | 5 engineers |
| **Infrastructure** | $100K | Firestore, Vercel, Arbitrum |
| **Marketing** | $200K | Social, content, influencers |
| **Legal/Compliance** | $100K | SEC, tax, regulatory |
| **Contingency** | $100K | Misc/unexpected |
| **Total Costs** | **$1M** | |

**Net Year 1:** $100K profit (breakeven with growth investment)

---

## Conclusion

DDHG's crypto tokenomics create a **sustainable economy** where:
1. **Users earn** real tokens for consistent habits
2. **Holders benefit** from appreciation + staking rewards
3. **Protocol benefits** from transaction fees + burn
4. **Community governs** via DAO (Phase 3)

By tying token value to **real habit completion** (not hype), DDHG creates intrinsic demand and long-term sustainability.

**Target:** 100K active users earning 60 points/day = 6M daily emissions → $180M/month utility → sustainable $0.10-1.00 price range.

---

## Appendix: Smart Contract Specs (Dev Reference)

### ERC-20 Contract
```solidity
// DDHG Token
// Total Supply: 1,000,000,000 (1B)
// Decimals: 18
// Functions: transfer, approve, burn
```

### Staking Contract
```solidity
// StakingPool.sol
// Tiers: 30d (20% APY), 90d (35%), 180d (50%)
// Reward distribution: Linear unlock
```

### Claim Bridge
```solidity
// ClaimBridge.sol
// Input: User wallet + Point balance
// Output: DDHG token transfer
// Authorization: Signed by backend
```

