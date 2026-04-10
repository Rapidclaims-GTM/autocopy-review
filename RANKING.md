# How the Elo Ranking System Works

## The Concept

We use the same ranking system as chess (Elo) to find the best email approaches. Every time a reviewer picks Version A over Version B, both variants' ratings update — the winner gains points, the loser drops.

After enough comparisons, the best approaches naturally rise to the top.

## What's Being Ranked

We test **42 variants** across **8 dimensions** of an email sequence:

### 1. Subject Line (9 variants)
| Variant | Style | Example |
|---------|-------|---------|
| Curiosity loop | Hints without revealing | "something we noticed at {company}" |
| Direct reference | Names their specific situation | "{name}'s coding backlog" |
| Question | Genuine business question | "{company}'s approach to denials?" |
| Metric-led | Leads with a number | "40% fewer denials at similar {org_type}" |
| Pain point | Names their challenge | "{company} + staffing gaps" |
| Ultra-short | 2-4 words, casual | "quick thought" |
| First name + hook | Prospect's name first | "alexandra, quick thought" |
| Trigger-event | References specific recent event | "saw accesshealth's expansion into county 3" |
| Re: fake thread | Mimics a reply thread | "re: coding capacity" |

### 2. Opening Hook (6 variants)
| Variant | Opens with... |
|---------|--------------|
| LinkedIn post | Reference to their specific LinkedIn post |
| Company signal | Observation about their company (hiring, news) |
| Industry trend | Macro trend bridged to their situation |
| Hiring signal | Their specific job posting |
| Financial signal | Their revenue, margins, or funding data |
| Peer comparison | Anonymous story from a similar organization |

### 3. CTA Style (5 variants)
| Variant | Approach |
|---------|----------|
| Challenge question | Ask about their business challenge |
| Offer deliverable | Offer a specific asset (report, framework) |
| Social proof + call | Combine peer success with meeting ask |
| Soft landing | Low-pressure, non-committal |
| Direct ask | Clear meeting request |

### 4. Tone/Length (4 variants)
| Variant | Words per email | Feel |
|---------|----------------|------|
| Executive brief | 55-70 | Authoritative, numbers-driven |
| Balanced | 80-100 | Professional but warm |
| Data-rich detailed | 100-120 | Thorough, analytical |
| Conversational | 70-90 | Casual, like a colleague |

### 5. Email Structure (6 variants)
| Variant | Pattern |
|---------|---------|
| THE ONE | Observation → Hypothesis → Impact → CTA |
| Curiosity overlay | Open loop → Reward → Resolve |
| Peer story | Scenario → Surprising outcome → Bridge to them |
| Direct value prop | Problem → Solution → Proof → CTA |
| Bullet-point format | Hook sentence → 2-3 scannable bullet points → CTA |
| Bold key phrases | Paragraph format with **bold metrics** for mobile readability |

### 6. Sequence Flow (4 variants)
| Variant | How E1 → E2 → E3 connect |
|---------|--------------------------|
| Escalating | Light touch → Value-add → Direct ask |
| Narrative arc | Open loop → Answer with proof → Resolve |
| Angle shift | Company angle → Individual angle → Peer angle |
| Same thread | Same topic, going deeper each time |

---

## How Elo Math Works

Every variant starts at **Elo 1500**.

When two variants compete in a comparison:

1. **Calculate expected outcome** based on current ratings:
   ```
   Expected_A = 1 / (1 + 10^((Rating_B - Rating_A) / 400))
   ```
   If A is rated 1600 and B is rated 1400, A is expected to win ~76% of the time.

2. **Update ratings** based on actual result:
   ```
   New_Rating = Old_Rating + 32 × (Actual - Expected)
   ```
   - If the favorite (A) wins: small gain for A, small loss for B
   - If the underdog (B) wins: big gain for B, big loss for A
   - Tie: both move slightly toward each other

3. **K-factor = 32** means ratings move quickly (good for our small sample sizes). In chess, K=32 is used for new players to help their rating converge fast.

### Example

| | Before | After (A wins) | After (B wins) |
|--|--------|----------------|----------------|
| Variant A (Elo 1550) | Expected: 57% | 1550 + 32×0.43 = **1564** | 1550 - 32×0.57 = **1532** |
| Variant B (Elo 1480) | Expected: 43% | 1480 - 32×0.43 = **1466** | 1480 + 32×0.57 = **1498** |

Upsets cause bigger rating swings than expected wins.

---

## How Comparisons Are Structured

Each comparison varies **one dimension only**. Everything else is held constant.

Example: Testing subject lines for Alexandra Charlton (Director, AccessHealth)

| | Version A | Version B |
|--|-----------|-----------|
| **Subject** | "something we noticed at accesshealth" (curiosity) | "accesshealth's approach to denials?" (question) |
| Hook | Her LinkedIn post about RCM challenges | Same |
| CTA | Challenge question style | Same |
| Tone | Balanced (80-100 words) | Same |
| Structure | THE ONE framework | Same |
| Flow | Escalating commitment | Same |

This isolation means when a reviewer picks A, we know it's the **subject line** that made the difference — not the hook or CTA.

---

## When a Variant Wins

A variant is declared a **confident winner** when:
- **Elo gap > 100 points** above 2nd place in its dimension
- **15+ total comparisons** (enough data)
- **60%+ win rate** (consistent preference)

When all three conditions are met, that variant's approach becomes a recommended rule for future email generation.

---

## Convergence

The tournament is "solved" when:
- All 6 dimensions have a confident winner
- Top variant's Elo is stable (< 20 point change over 2 days)
- Reviewers start picking "too close to call" more often

**Expected timeline**: 3-5 days with 7 reviewers doing 12 comparisons/day.

---

## Daily Progression

```
Day 1 (Exploration):    All variants at ~1500. Random matchups.
                        First preferences emerge.

Day 2 (Emerging):       Early leaders at 1550-1600. Laggards at 1400-1450.
                        Test close matchups to separate contenders.

Day 3 (Clarifying):     2-3 dimensions have confident winners.
                        Focus remaining comparisons on undecided dimensions.

Day 4 (Converging):     5-6 dimensions decided. Final refinement.
                        Rules proposed and applied.

Day 5 (Solved):         All dimensions have confident winners.
                        Optimal email approach locked in.
```

### 7. Branding (4 variants)
| Variant | Approach |
|---------|----------|
| No company name | Only "we" / "our team" / "I". No brand, no product name. |
| Subtle team reference | "Our team" / "my team" + generic "autonomous coding technology". No RapidClaims name. |
| RapidClaims named | RapidClaims mentioned once in Email 1. Emails 2-3 use "we". |
| RapidClaims + product | "RapidClaims autonomous coding" named throughout the sequence. |

### 8. Compliance Footer (4 variants)
| Variant | What's added |
|---------|-------------|
| No P.S. | Clean ending — CTA is the last line |
| Compliance P.S. | "P.S. — We are HITRUST, SOC II, and HIPAA Compliant" on all 3 emails |
| Free pilot P.S. | "P.S. — We offer a free 30-day pilot with your actual claims" on Email 1 only |
| Compliance + pilot | Pilot P.S. on Email 1, Compliance P.S. on Email 2, none on Email 3 |

---

## Adding New Variants

At any point, new ideas can be added at Elo 1500. They'll naturally compete against established leaders and either rise or fall. Examples:
- "What if we drop the greeting entirely?"
- "What if we use emojis in subject lines?"
- "What if Email 3 is just one sentence?"
