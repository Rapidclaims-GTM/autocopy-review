/**
 * AutoCopy Review App
 * Elo-ranked Tinder-style email variant tournament
 */

// ============ STATE ============
let state = {
  reviewer: null,
  day: null,
  pairs: [],
  currentPairIndex: 0,
  votes: [],
  currentVote: null,       // { winner, aspects, comment }
  selectedAspects: new Set(),
  dataLoaded: false
};

// ============ INIT ============
document.addEventListener('DOMContentLoaded', async () => {
  // Load latest.json to find current day
  try {
    const latestResp = await fetch('data/latest.json');
    const latest = await latestResp.json();
    state.day = latest.day;

    const dayTitle = document.getElementById('day-title');
    dayTitle.textContent = `Review - Day ${state.day}`;

    // Load Elo leaders if available
    if (latest.elo_leaders) {
      showEloLeaders(latest.elo_leaders, 'elo-leaders', 'elo-leaders-list');
    }
  } catch (e) {
    console.log('No latest.json found, using defaults');
    state.day = 1;
  }

  // Render reviewer buttons
  renderReviewerButtons();

  // Set up tab switcher
  setupTabSwitcher();

  // Set up vote buttons
  setupVoteButtons();

  // Set up aspect chips
  renderAspectChips();
});

// ============ REVIEWER SELECTION ============
function renderReviewerButtons() {
  const container = document.getElementById('reviewer-buttons');
  CONFIG.REVIEWERS.forEach(id => {
    const btn = document.createElement('button');
    btn.className = 'reviewer-btn';
    btn.textContent = CONFIG.REVIEWER_DISPLAY[id] || id;
    btn.addEventListener('click', () => selectReviewer(id));
    container.appendChild(btn);
  });
}

async function selectReviewer(reviewerId) {
  state.reviewer = reviewerId;

  // Check if already submitted today
  const storageKey = `autocopy_done_day${state.day}_${reviewerId}`;
  if (localStorage.getItem(storageKey)) {
    showScreen('screen-already-done');
    return;
  }

  // Load reviewer's comparison data
  try {
    const filename = `data/day_${String(state.day).padStart(3, '0')}_${reviewerId}.json`;
    const resp = await fetch(filename);
    if (!resp.ok) throw new Error(`No data file: ${filename}`);
    const data = await resp.json();
    state.pairs = data.pairs;
    state.dataLoaded = true;

    // Start comparisons
    showScreen('screen-compare');
    renderPair(0);
  } catch (e) {
    alert(`No review data found for ${CONFIG.REVIEWER_DISPLAY[reviewerId]}. Check with the admin.`);
    console.error(e);
  }
}

// ============ COMPARISON RENDERING ============
function renderPair(index) {
  state.currentPairIndex = index;
  state.currentVote = null;
  state.selectedAspects.clear();

  const pair = state.pairs[index];

  // Update progress
  document.getElementById('progress-text').textContent =
    `${index + 1}/${state.pairs.length}`;
  document.getElementById('progress-fill').style.width =
    `${((index + 1) / state.pairs.length) * 100}%`;

  // Profile info
  document.getElementById('profile-info').innerHTML =
    `<strong>${pair.person_name}</strong> &middot; ${pair.persona_type} &middot; ${pair.company_name}`;

  // Render emails for Version A
  renderEmails('emails-a', pair.version_a.emails);

  // Render emails for Version B
  renderEmails('emails-b', pair.version_b.emails);

  // Reset vote UI
  document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('aspect-section').classList.add('hidden');
  document.getElementById('comment-input').value = '';
  document.querySelectorAll('.aspect-chip').forEach(c => c.classList.remove('selected'));

  // Reset mobile tab to Version A
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(b => b.classList.remove('active'));
  tabBtns[0]?.classList.add('active');
  document.getElementById('column-a')?.classList.remove('hide');
  document.getElementById('column-b')?.classList.remove('show');

  // Scroll compare body to top
  document.querySelector('.compare-body')?.scrollTo(0, 0);
}

function renderEmails(containerId, emails) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  emails.forEach(email => {
    const card = document.createElement('div');
    card.className = 'email-card';

    const wordCount = email.email_body ? email.email_body.split(/\s+/).length : 0;

    card.innerHTML = `
      <div class="email-card-header">
        <span class="email-number">Email ${email.email_number}</span>
        <span class="email-word-count">${wordCount} words</span>
      </div>
      <div class="email-subject">${escapeHtml(email.subject_line)}</div>
      <div class="email-body">${escapeHtml(email.email_body)}</div>
    `;

    container.appendChild(card);
  });
}

// ============ TAB SWITCHER (MOBILE) ============
function setupTabSwitcher() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (tab === 'a') {
        document.getElementById('column-a').classList.remove('hide');
        document.getElementById('column-b').classList.remove('show');
      } else {
        document.getElementById('column-a').classList.add('hide');
        document.getElementById('column-b').classList.add('show');
      }
    });
  });
}

// ============ VOTING ============
function setupVoteButtons() {
  document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const winner = btn.dataset.winner;
      state.currentVote = { winner, aspects: [], comment: '' };

      // Highlight selected
      document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Show aspect section
      document.getElementById('aspect-section').classList.remove('hidden');
    });
  });

  // Next button
  document.getElementById('next-btn').addEventListener('click', submitVoteAndNext);
}

function renderAspectChips() {
  const container = document.getElementById('aspect-chips');
  CONFIG.ASPECT_OPTIONS.forEach(opt => {
    const chip = document.createElement('button');
    chip.className = 'aspect-chip';
    chip.textContent = opt.label;
    chip.dataset.aspect = opt.id;
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      if (state.selectedAspects.has(opt.id)) {
        state.selectedAspects.delete(opt.id);
      } else {
        state.selectedAspects.add(opt.id);
      }
    });
    container.appendChild(chip);
  });
}

function submitVoteAndNext() {
  if (!state.currentVote) return;

  const pair = state.pairs[state.currentPairIndex];

  // Record vote
  state.votes.push({
    pair_number: state.currentPairIndex + 1,
    profile_id: pair.profile_id,
    dimension: pair.dimension,
    variant_a_id: pair.version_a.variant_id,
    variant_b_id: pair.version_b.variant_id,
    winner: state.currentVote.winner,
    aspect_taps: Array.from(state.selectedAspects),
    comment: document.getElementById('comment-input').value.trim(),
    timestamp: new Date().toISOString()
  });

  // Next pair or submit
  if (state.currentPairIndex < state.pairs.length - 1) {
    renderPair(state.currentPairIndex + 1);
  } else {
    submitAllVotes();
  }
}

// ============ SUBMISSION ============
async function submitAllVotes() {
  const payload = {
    day: state.day,
    reviewer: state.reviewer,
    votes: state.votes
  };

  // Try to POST to webhook
  if (CONFIG.WEBHOOK_URL) {
    try {
      await fetch(CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Apps Script doesn't support CORS preflight
      });
    } catch (e) {
      console.warn('Webhook POST failed, saving locally:', e);
    }
  }

  // Always save locally as backup
  saveLocalBackup(payload);

  // Mark as done
  const storageKey = `autocopy_done_day${state.day}_${state.reviewer}`;
  localStorage.setItem(storageKey, JSON.stringify({
    timestamp: new Date().toISOString(),
    votes_count: state.votes.length
  }));

  // Show completion screen
  showCompletionScreen();
}

function saveLocalBackup(payload) {
  const key = `autocopy_votes_day${state.day}_${state.reviewer}`;
  localStorage.setItem(key, JSON.stringify(payload));
}

// ============ COMPLETION SCREEN ============
function showCompletionScreen() {
  // Count comparisons per dimension
  const dimCounts = {};
  state.votes.forEach(v => {
    dimCounts[v.dimension] = (dimCounts[v.dimension] || 0) + 1;
  });

  document.getElementById('done-count').textContent =
    `${state.votes.length}/${state.pairs.length} comparisons complete`;

  // Summary of what was compared
  const summaryContainer = document.getElementById('done-summary');
  const dimensionLabels = {
    'subject_line': 'Subject line',
    'opening_hook': 'Opening hook',
    'cta_style': 'CTA style',
    'tone_length': 'Tone/length',
    'email_structure': 'Structure',
    'sequence_flow': 'Sequence flow'
  };

  let summaryHtml = '<h3>Today you compared</h3>';
  Object.entries(dimCounts).forEach(([dim, count]) => {
    summaryHtml += `
      <div class="done-summary-row">
        <span>${dimensionLabels[dim] || dim}</span>
        <span>${count} matchup${count > 1 ? 's' : ''}</span>
      </div>`;
  });
  summaryContainer.innerHTML = summaryHtml;

  // Load Elo leaders if available from latest.json
  try {
    fetch('data/latest.json')
      .then(r => r.json())
      .then(latest => {
        if (latest.elo_leaders) {
          const leadersDiv = document.getElementById('done-leaders');
          leadersDiv.className = 'elo-leaders';
          let html = '<h3>Current Elo Leaders</h3>';
          Object.entries(latest.elo_leaders).forEach(([dim, info]) => {
            html += `
              <div class="elo-leader-row">
                <span class="elo-leader-dim">${dimensionLabels[dim] || dim}</span>
                <span class="elo-leader-name">${info.label}</span>
                <span class="elo-leader-score">${info.elo}</span>
              </div>`;
          });
          leadersDiv.innerHTML = html;
        }
      });
  } catch (e) {}

  showScreen('screen-done');
}

// ============ ELO LEADERS DISPLAY ============
function showEloLeaders(leaders, containerId, listId) {
  const container = document.getElementById(containerId);
  const list = document.getElementById(listId);
  if (!container || !list || !leaders) return;

  const dimensionLabels = {
    'subject_line': 'Subject',
    'opening_hook': 'Hook',
    'cta_style': 'CTA',
    'tone_length': 'Tone',
    'email_structure': 'Structure',
    'sequence_flow': 'Flow'
  };

  let html = '';
  Object.entries(leaders).forEach(([dim, info]) => {
    html += `
      <div class="elo-leader-row">
        <span class="elo-leader-dim">${dimensionLabels[dim] || dim}</span>
        <span class="elo-leader-name">${info.label}</span>
        <span class="elo-leader-score">${info.elo}</span>
      </div>`;
  });

  list.innerHTML = html;
  container.classList.remove('hidden');
}

// ============ HELPERS ============
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
