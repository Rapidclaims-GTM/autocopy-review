# AutoCopy Review App

Email comparison tool for optimizing outreach copy. Reviewers compare email sequence variants side-by-side, and an Elo ranking system surfaces the best approaches.

## For Reviewers

1. Open: **https://autocopy-review.vercel.app/**
2. Tap your name
3. You'll see 12 email comparisons — two versions of a 3-email sequence side by side
4. For each pair, pick which sequence would be more likely to get a reply
5. Optionally tap what stood out (Subject, Hook, CTA, Tone, Flow, Length)
6. Optionally leave a comment
7. Takes ~5-8 minutes

**The comparisons are blind** — you won't know what was changed between versions. Just go with your gut: which one would you reply to?

### Tips for Good Feedback
- Read all 3 emails in each version before voting
- Think about whether the sequence tells a coherent story across emails
- Consider: would a busy healthcare executive actually read and reply to this?
- Comments are super valuable — even short ones like "A's subject made me curious" or "B's CTA felt pushy"

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
- Pull random profiles from your campaign data
- Generate email variants using real LinkedIn/company signals
- Create comparison pairs (one dimension varied per pair)
- Push to GitHub Pages
- Give you the URL to share with reviewers

**Share with team:**
Send the URL. That's it. No login needed.

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
Select which proposed rules to save. They'll be appended to the email learnings files and used in future email generation.

**Check progress anytime:**
```
/autocopy status
```
Shows current Elo rankings, convergence status, and what's left to test.

### Other Commands

| Command | What it does |
|---------|-------------|
| `/autocopy init` | First-time setup (webhook URL, source campaigns) |
| `/autocopy add-variant` | Add a new variant to test |
| `/autocopy status` | View current rankings and convergence |

### Expected Timeline
- **Day 1-2**: Exploration — all variants tested broadly
- **Day 3-4**: Exploitation — close matchups refined
- **Day 5**: Convergence — confident winners in most dimensions

With 7 reviewers doing 12 comparisons/day = 84 comparisons/day = ~14 per dimension/day.

---

## Technical Details

### Architecture
- **Frontend**: Static HTML/CSS/JS on GitHub Pages
- **Backend**: Google Sheets via Apps Script webhook (POST votes, GET results)
- **Orchestration**: Claude Code `/autocopy` skill (runs on your Claude plan, no API key needed)
- **Data**: Per-reviewer JSON files in `data/` folder

### Data Flow
```
/autocopy generate
  → Pulls profiles from campaigns/*/input/researched_profiles.csv
  → Generates email variants with real prospect data
  → Creates data/day_NNN_{reviewer}.json for each reviewer
  → Pushes to GitHub Pages

Reviewers vote on the live site
  → Votes POST to Google Apps Script webhook
  → Apps Script appends rows to Google Sheet

/autocopy collect
  → GET from Apps Script returns all votes
  → Elo scores updated locally in autocopy/variant_pool.json
  → Rule mutations proposed based on confident winners
```

### File Structure
```
data/
  latest.json              — Current day number + Elo leaders
  day_001_prahalad.json    — Prahalad's 12 comparison pairs
  day_001_rahul.json       — Rahul's 12 comparison pairs
  ...                      — One file per reviewer per day
```

### Privacy
- No authentication required (reviewer name stored in browser localStorage)
- Votes are stored in a private Google Sheet
- Profile data (names, companies) is visible in the review app — share URL only with your team
