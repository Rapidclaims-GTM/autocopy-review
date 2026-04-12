# AutoCopy Review App

Email comparison tool for optimizing outreach copy. Reviewers compare email sequence variants side-by-side, and an Elo ranking system surfaces the best approaches.

## For Reviewers

1. Open: **https://autocopy-review.vercel.app/**
2. Tap your name
3. Compare email sequences side by side — pick which version you'd be more likely to reply to
4. Optionally tap what stood out (Subject, Hook, CTA, Tone, Flow, Length)
5. Optionally leave a comment
6. Takes ~5-10 minutes depending on the phase

**The comparisons are blind** — you won't know what was changed between versions. Just go with your gut: which one would you reply to?

### How many comparisons per session?

| Phase | Comparisons | What you're comparing |
|-------|-------------|----------------------|
| Phase 1 (Days 1-3) | 7 | Full email styles — obviously different approaches |
| Phase 2 (Day 4) | 12 | Curiosity overlay on/off |
| Phase 3 (Days 5-11) | 12 | One specific element varied at a time |

### Tips for Good Feedback

- Read all 3 emails in each version before voting
- Think about whether the sequence tells a coherent story across emails
- Consider: would a busy healthcare executive actually read and reply to this?
- Comments are super valuable — even short ones like "A's subject made me curious" or "B felt more human"

---

## For Admins (Running the System)

### Prerequisites
- Claude Code (runs on your Claude plan — no separate API key needed)
- Google Sheet "AutoCopy Feedback" with Apps Script webhook deployed
- Existing campaigns with `researched_profiles.csv` files

### Daily Workflow

**Morning — Generate new batch:**
```
/autocopy generate
```
This will:
- Pull profiles from your campaign data
- Generate email variant pairs using real LinkedIn/company signals
- Create per-reviewer JSON files and push to Vercel
- Print the URL to share with reviewers

**Share with team:**
Send the URL. No login needed.

**Evening — Collect results:**
```
/autocopy collect
```
This will:
- Fetch all votes from Google Sheets
- Update Elo rankings for every variant
- Show which approaches are winning
- Propose rule changes based on confident winners

**Apply winning rules:**
```
/autocopy apply
```
Select which proposed rules to save. They'll be appended to the email learnings files and used in all future email generation.

**Check progress anytime:**
```
/autocopy status
```
Shows current Elo rankings, convergence status, phase, and what's left to test.

### All Commands

| Command | What it does |
|---------|-------------|
| `/autocopy init` | First-time setup (webhook URL, source campaigns) |
| `/autocopy generate` | Generate today's batch and deploy |
| `/autocopy collect` | Fetch votes, update Elo, propose rules |
| `/autocopy apply` | Apply approved rule mutations to learnings files |
| `/autocopy status` | View current rankings and convergence |
| `/autocopy add-variant` | Add a new variant to test |

### Tournament Phases

**Phase 1 — Style Archetypes (Days 1-3)**
7 reviewers × 7 comparisons = 49 comparisons/day. Tests 6 whole-email archetypes vs. control:
- `curiosity_arc` — Opens a loop E1, rewards E2, resolves E3
- `ultra_short` — 4 sentences, 55-70 words
- `bullets` — Hook + 2-3 metric bullets + CTA
- `peer_story` — Built around an anonymized peer's story
- `bold_scan` — Bold key phrases for mobile readability
- `anti_ai_human` — Same best signal, one intentional typo per email, formula structure broken

**Phase 2 — Curiosity Decision (Day 4)**
12 comparisons/reviewer. Does adding a curiosity overlay lift the Phase 1 winner?

**Phase 3 — Dimension Drilling (Days 5-11)**
12 comparisons/reviewer per day. Tests one dimension at a time: opening hook, subject line, CTA, sequence flow, branding, compliance footer, human signals.

### Expected Timeline

```
Day 1-3:  Phase 1 — 6 archetypes vs. control. Winner emerges by Day 3.
Day 4:    Phase 2 — Curiosity overlay decision.
Day 5-11: Phase 3 — One dimension per day. Rules locked and applied.
```

With 7 reviewers doing 7 comparisons in Phase 1 = 49/day. Phase 3 = 84/day.

---

## Technical Details

### Architecture
- **Frontend**: Static HTML/CSS/JS auto-deployed to Vercel
- **Backend**: Google Sheets via Apps Script webhook (POST votes, GET results)
- **Orchestration**: Claude Code `/autocopy` skill
- **Data**: Per-reviewer JSON files in `data/` folder

### Data Flow
```
/autocopy generate
  → Pulls profiles from campaigns/*/input/researched_profiles.csv
  → Generates email variants with real prospect data
  → Writes data/day_NNN_{reviewer}.json for each reviewer
  → git push → Vercel auto-deploys

Reviewers vote on the live site
  → Votes POST to Google Apps Script webhook
  → Apps Script appends rows to Google Sheet

/autocopy collect
  → GET from Apps Script returns all votes
  → Elo scores updated locally in autocopy/variant_pool.json
  → Rule mutations proposed based on confident winners
  → Winning variants lock in as baseline for next generation
```

### File Structure
```
data/
  latest.json              — Current day number + Elo leaders
  day_001_prahalad.json    — Prahalad's comparison pairs
  day_001_rahul.json       — Rahul's comparison pairs
  ...                      — One file per reviewer per day
```

### Privacy
- No authentication required (reviewer name stored in browser localStorage)
- Votes are stored in a private Google Sheet
- Profile data (names, companies) is visible in the review app — share URL only with your team
