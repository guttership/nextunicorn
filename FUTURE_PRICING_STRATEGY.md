# Future Pricing Strategy - NextUnicorn Ads

## Current System (v1.0)
**Status:** Implemented
**Date:** November 19, 2025

### Fixed Tiers with Rotation (0-100 sponsors)
```
Spots 1-2   : 49€/mois  (490€/an)  → Founding Sponsors + ★ FOUNDING badge
Spots 3-8   : 99€/mois  (990€/an)  → Early Adopters
Spots 9-20  : 149€/mois (1490€/an) → Premium exclusive (2 faces fixed)
Spots 21+   : 79€/mois  (790€/an)  → Rotation tier (3+ faces shared)
```

### Technical Implementation
- Multi-face card rotation (2-10 faces per card)
- Vertical column filling algorithm
- "Your Ad Here" always visible on one face
- Maximum capacity: 100 sponsors (10 cards × 10 faces max)
- No scroll needed (fits Full HD screen)

### Revenue Projection (40 sponsors)
```
2 × 49€   =    98€/mois
6 × 99€   =   594€/mois
12 × 149€ = 1,788€/mois
20 × 79€  = 1,580€/mois
────────────────────────
TOTAL     = 4,060€/mois
```

---

## Future System (v2.0 - When market validated)
**Status:** Planned
**Trigger:** When reaching 20+ active sponsors consistently

### Hybrid: Rotation + Upgrade Option

#### Phase 1: Waitlist (when 20 spots filled)
- Display "20/20 SOLD OUT" on pricing page
- Offer 2 choices for new clients:
  1. **Rotation Tier:** 79€/mois (available immediately)
  2. **Waitlist for Fixed Spot:** Get notified when position available

#### Phase 2: Upgrade to Fixed Spot
- Rotation sponsors can upgrade to fixed position
- **First-come, first-served** at 149€/mois (no auction complexity)
- Becomes available when:
  - Someone cancels subscription
  - Someone doesn't renew
  
#### Pricing Rules
```
Existing sponsors: Keep their original price FOREVER (loyalty reward)
  - Founding (49€) → locked forever
  - Early (99€) → locked forever
  - Premium (149€) → locked forever
  
New sponsors (after 20):
  - Rotation: 79€/mois (fixed price)
  - Upgrade to fixed: 149€/mois (when slot available)
```

#### Example Flow
```
Month 1: 25 sponsors
  - Spots 1-20: Fixed positions (49-149€)
  - Spots 21-25: Rotation (79€)
  
Month 2: Sponsor #15 (149€) cancels
  - Email to rotation sponsors: "Fixed spot #15 available - Upgrade for 149€/mois"
  - First to click gets it
  - If no taker after 48h → open to new clients at 149€
```

---

## Future v3.0 - Auction System (If high demand)
**Status:** Concept only
**Trigger:** When consistent waitlist of 10+ people

### Rules
- Fixed spots go to highest bidder when available
- Minimum bid: 149€/mois
- Existing sponsors still protected at original price
- Auction duration: 48h
- Proceeds split: 80% revenue, 20% prize pool for best performing ads

### Risks to Consider
- Complexity might deter small SaaS
- Could create "rich only" perception
- Need clear UX for auction mechanics

### Alternative: Premium Tiers Instead
```
Instead of auctions, add premium tiers:
  - Standard Fixed (149€): Random position
  - Premium Fixed (249€): Top 10 positions
  - VIP Fixed (399€): Top 5 positions + newsletter mention
```

---

## Key Principles (Never Compromise)
1. **Loyalty First:** Existing sponsors keep their price forever
2. **Transparency:** Always show what you get for the price
3. **Fairness:** Rotation sponsors get equal impressions (tracked)
4. **Simplicity:** Don't over-engineer until proven demand
5. **No Dark Patterns:** Clear cancellation, honest visibility metrics

---

## Metrics to Track Before v2.0
- [ ] Sponsor retention rate (target: >70% after 3 months)
- [ ] Rotation tier adoption (need >5 sponsors to validate)
- [ ] Waitlist size (trigger at 10+ waiting)
- [ ] Click-through rates per position (justify premium pricing)
- [ ] Revenue stability (need 3 months consistent revenue)

---

## Implementation Checklist (when ready for v2.0)
- [ ] Add "Upgrade to Fixed Spot" button for rotation sponsors
- [ ] Email notification system when spot becomes available
- [ ] Admin dashboard to see available spots
- [ ] Waiting list database table
- [ ] Clear messaging: "Rotation vs Fixed" comparison table
- [ ] Metrics dashboard: show impressions per sponsor
- [ ] Legal: update terms to mention upgrade option

---

## Notes
- Current system (v1.0) already coded and ready to deploy
- No need to implement v2.0/v3.0 until market proves demand
- Start simple, iterate based on real user feedback
- Revenue is not the only goal: sponsor satisfaction matters more long-term
