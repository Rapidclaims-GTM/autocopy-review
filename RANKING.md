# How the Elo Ranking System Works

## The Concept

We use the same ranking system as chess (Elo) to find the best email approaches. Every time a reviewer picks Version A over Version B, both variants' ratings update — the winner gains points, the loser drops.

After enough comparisons, the best approaches naturally rise to the top, and those approaches become hardcoded rules for all future email generation.

## What's Being Ranked

**51 variants across 9 dimensions**, tested in 3 phases over ~11 days.

---

## Phase 1 — Style Archetypes

Tested first because structure has the highest impact. Reviewers see 6 obviously different styles vs. the current control.

### Email Structure (7 variants)

| Variant | Pattern | What makes it different |
|---------|---------|------------------------|
| THE ONE (control) | Observation → Hypothesis → Impact → CTA | Current style — 80-100w paragraphs |
| Curiosity overlay | Open loop → Reward → Resolve | E1 raises a question it doesn't answer; E2-3 pay it off |
| Peer story | Scenario → Surprising outcome → Bridge to them | Each email built around an anonymized peer |
| Direct value prop | Problem → Solution → Proof → CTA | No narrative, pure value delivery |
| Bullet-point format | Hook → 2-3 metric bullets → CTA | Scannable, metric-heavy |
| Bold key phrases | Paragraphs with **bold metrics** | Mobile-first readability |
| Anti-AI human signal | Best signal, broken formula, one typo per email | Sounds typed not generated |

---

## Phase 2 — Curiosity Decision

One question: does adding a curiosity loop (E1 teases, E2 rewards, E3 resolves) lift the Phase 1 winner? Skip if `curiosity_arc` already won Phase 1.

---

## Phase 3 — Dimension Drilling

Within the winning style, test one dimension at a time. Priority order:

| Day | Dimension | Variants |
|-----|-----------|----------|
| 5 | Opening hook | 7 |
| 6 | Subject line | 12 |
| 7 | CTA style | 5 |
| 8 | Sequence flow | 4 |
| 9 | Branding | 4 |
| 10 | Compliance footer | 4 |
| 11 | Human signals | 3 |

---

### Opening Hook (7 variants)

| Variant | Opens with... |
|---------|--------------|
| LinkedIn post | Reference to their specific LinkedIn post |
| Company signal | Observation about their company (hiring, news, expansion) |
| Industry trend | Macro trend bridged to their situation |
| Hiring signal | Their specific job posting |
| Financial signal | Their revenue, margins, or funding data |
| Peer comparison | Anonymous story from a similar organization |
| Timeline / sequence | Chain of events at their company that creates natural urgency |

### Subject Line (12 variants)

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
| Competitor name-drop | Names a known competitor | "beyond what nuance can do at {company}" |
| Contrarian | Challenges conventional wisdom | "why hiring more coders makes denials worse" |
| Fake internal forward | Looks like an internal fwd | "fwd: rcm vendor shortlist" |

### CTA Style (5 variants)

| Variant | Approach |
|---------|----------|
| Challenge question | Ask about their business challenge |
| Offer deliverable | Offer a specific asset (report, framework) |
| Social proof + call | Combine peer success with meeting ask |
| Soft landing | Low-pressure, non-committal |
| Direct ask | Clear meeting request |

### Tone/Length (5 variants)

| Variant | Words per email | Feel |
|---------|----------------|------|
| Executive brief | 55-70 | Authoritative, numbers-driven |
| Balanced | 80-100 | Professional but warm |
| Data-rich detailed | 100-120 | Thorough, analytical |
| Conversational | 70-90 | Casual, like a colleague |
| Ultra-short | 45-65 | One observation, one proof, one CTA |

### Sequence Flow (4 variants)

| Variant | How E1 → E2 → E3 connect |
|---------|--------------------------|
| Escalating | Light touch → Value-add → Direct ask |
| Narrative arc | Open loop → Answer with proof → Resolve |
| Angle shift | Company angle → Individual angle → Peer angle |
| Same thread | Same topic, going deeper each time |

### Branding (4 variants)

| Variant | Approach |
|---------|----------|
| No company name | Only "we" / "our team" / "I". No brand, no product name. |
| Subtle team reference | "Our team" + generic "autonomous coding technology". No RapidClaims. |
| RapidClaims named | RapidClaims mentioned once in Email 1. Emails 2-3 use "we". |
| RapidClaims + product | "RapidClaims autonomous coding" named throughout. |

### Compliance Footer (4 variants)

| Variant | What's added |
|---------|-------------|
| No P.S. | Clean ending — CTA is the last line |
| Compliance P.S. | "P.S. — We are HITRUST, SOC II, and HIPAA Compliant" on all 3 emails |
| Free pilot P.S. | "P.S. — We offer a free 30-day pilot with your actual claims" on Email 1 only |
| Compliance + pilot | Pilot P.S. on Email 1, Compliance P.S. on Email 2, none on Email 3 |

### Human Signals (3 variants)

Tests which anti-AI technique drives the most replies. AI flooded inboxes with perfectly structured, soulless emails — being intentionally imperfect now stands out.

| Variant | What it isolates |
|---------|-----------------|
| Intentional typo only | One casual typo per email (missing apostrophe, comma splice, lowercase "im") on control style |
| Anti-formula structure only | Breaks O → H → I → CTA without any typos — lets email meander naturally |
| Both combined | Broken structure + one typo per email — full anti-AI treatment |

---

## How Elo Math Works

Every variant starts at **Elo 1500**.

When two variants compete:

1. **Calculate expected outcome** based on current ratings:
   ```
   Expected_A = 1 / (1 + 10^((Rating_B - Rating_A) / 400))
   ```
   If A is rated 1600 and B is rated 1400, A is expected to win ~76% of the time.

2. **Update ratings** based on actual result:
   ```
   New_Rating = Old_Rating + 32 × (Actual - Expected)
   ```
   - Favorite wins: small gain for A, small loss for B
   - Underdog wins: big gain for B, big loss for A
   - Tie: both move slightly toward each other

3. **K-factor = 32** — ratings move quickly, good for small sample sizes.

### Example

| | Before | After (A wins) | After (B wins) |
|--|--------|----------------|----------------|
| Variant A (Elo 1550) | Expected: 57% | **1564** | **1532** |
| Variant B (Elo 1480) | Expected: 43% | **1466** | **1498** |

---

## When a Variant Wins

A variant is declared a **confident winner** when:
- **Elo gap > 100 points** above 2nd place in its dimension
- **15+ total comparisons** (enough data)
- **60%+ win rate** (consistent preference)

That variant's approach becomes a locked baseline for all future generation.

---

## Daily Progression

```
Phase 1 (Days 1-3):   6 archetypes vs. control. 49 comparisons/day.
                      Structure winner emerges by Day 3.

Phase 2 (Day 4):      Curiosity overlay decision. 84 comparisons.

Phase 3 (Days 5-11):  One dimension per day. 84 comparisons/day.
                      Rules applied as each dimension converges.

Day 11 (Solved):      All 9 dimensions have confident winners.
                      Every generated email uses the optimal combination.
```

---

## Adding New Variants

At any point, new ideas can be added at Elo 1500. They'll naturally compete against established leaders and either rise or fall. Use `/autocopy add-variant` in Claude Code.

Examples of things worth testing:
- "What if we drop the greeting entirely?"
- "What if Email 3 is just one sentence?"
- "What if we name-drop a specific patient outcome instead of a metric?"
