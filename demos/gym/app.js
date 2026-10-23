'use strict';

const CLASSES = [
  { day: 'Mon', time: '6:00', name: 'Dawn Strength', type: 'Strength', coach: 'Inez R.', mins: 50 },
  { day: 'Mon', time: '12:10', name: 'Lunch Conditioning', type: 'Conditioning', coach: 'Mateo V.', mins: 40 },
  { day: 'Mon', time: '17:30', name: 'Logan Barbell', type: 'Strength', coach: 'Chris A.', mins: 60 },
  { day: 'Mon', time: '19:00', name: 'Slow Flow', type: 'Yoga', coach: 'Priya N.', mins: 60 },
  { day: 'Tue', time: '6:30', name: 'Engine', type: 'Conditioning', coach: 'Mateo V.', mins: 45 },
  { day: 'Tue', time: '9:30', name: 'Mobility Lab', type: 'Mobility', coach: 'Priya N.', mins: 45 },
  { day: 'Tue', time: '18:00', name: 'Bag Work', type: 'Boxing', coach: 'Lalo G.', mins: 50 },
  { day: 'Wed', time: '6:00', name: 'Dawn Strength', type: 'Strength', coach: 'Inez R.', mins: 50 },
  { day: 'Wed', time: '12:10', name: 'Midday Yoga', type: 'Yoga', coach: 'Priya N.', mins: 45 },
  { day: 'Wed', time: '17:30', name: 'Intervals', type: 'Conditioning', coach: 'Chris A.', mins: 40 },
  { day: 'Thu', time: '6:30', name: 'Boxing Basics', type: 'Boxing', coach: 'Lalo G.', mins: 50 },
  { day: 'Thu', time: '17:30', name: 'Squat Club', type: 'Strength', coach: 'Inez R.', mins: 60 },
  { day: 'Thu', time: '19:00', name: 'Restore', type: 'Mobility', coach: 'Priya N.', mins: 45 },
  { day: 'Fri', time: '6:00', name: 'Friday Engine', type: 'Conditioning', coach: 'Mateo V.', mins: 40 },
  { day: 'Fri', time: '17:00', name: 'Open Mat', type: 'Boxing', coach: 'Lalo G.', mins: 60 },
  { day: 'Sat', time: '8:30', name: 'Weekend Strength', type: 'Strength', coach: 'Chris A.', mins: 60 },
  { day: 'Sat', time: '10:00', name: 'Community Flow', type: 'Yoga', coach: 'Priya N.', mins: 60 },
  { day: 'Sat', time: '11:15', name: 'Family Mobility', type: 'Mobility', coach: 'Inez R.', mins: 30 }
];

const PLANS = [
  { id: 'ember', name: 'Ember', month: 89, year: 850, points: ['8 classes a month', 'No open-gym hours', 'No guest passes', 'Chalk, not recovery'] },
  { id: 'ridge', name: 'Ridge', month: 139, year: 1320, points: ['Unlimited classes', 'Open gym all week', 'One guest pass a month', 'Saturday in Cacho included'] },
  { id: 'summit', name: 'Summit', month: 179, year: 1710, points: ['Unlimited classes', 'Open gym all week', 'Two guest passes a month', 'Recovery room after training'] }
];

const DAYS = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TYPES = ['All', 'Strength', 'Conditioning', 'Yoga', 'Boxing', 'Mobility'];
const KEY = 'timeless-demo-senda';

const today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
const stored = load();
const state = {
  day: stored.day || (today === 'Sun' ? 'Sat' : today),
  type: stored.type || 'All',
  billing: stored.billing || 'month',
  plan: stored.plan || '',
  member: stored.member || null
};

const dayChips = document.getElementById('day-chips');
const typeChips = document.getElementById('type-chips');
const classList = document.getElementById('class-list');
const planTable = document.getElementById('plan-table');
const join = document.getElementById('join');
const joinTitle = document.getElementById('join-title');
const joinError = document.getElementById('join-error');
const joinDone = document.getElementById('join-done');

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return raw && typeof raw === 'object' ? raw : {};
  } catch (err) {
    return {};
  }
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* ignore */ }
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function renderChips(container, items, current, attr) {
  container.innerHTML = items.map((item) => (
    `<button type="button" data-${attr}="${esc(item)}" aria-pressed="${item === current ? 'true' : 'false'}">${esc(item)}</button>`
  )).join('');
}

function renderClasses() {
  const rows = CLASSES.filter((item) => (state.day === 'All' || item.day === state.day) && (state.type === 'All' || item.type === state.type));
  if (!rows.length) {
    classList.innerHTML = '<p class="empty">Nothing on that filter. Try another day, or clear the class type.</p>';
    return;
  }
  classList.innerHTML = rows.map((item) => `<article class="class-row">
    <p class="time">${esc(item.time)}</p>
    <div><h3>${esc(item.name)}</h3><p>${item.mins} min · ${esc(item.coach)}</p></div>
    <p>${esc(item.day)}</p>
    <p class="type">${esc(item.type)}</p>
  </article>`).join('');
}

function renderPlans() {
  planTable.innerHTML = `<div class="plan-grid">${PLANS.map((plan) => {
    const fee = state.billing === 'year' ? plan.year : plan.month;
    const unit = state.billing === 'year' ? '/yr' : '/mo';
    return `<button type="button" class="plan" data-plan="${plan.id}" aria-pressed="${state.plan === plan.id ? 'true' : 'false'}">
      <h3>${esc(plan.name)}</h3>
      <p class="fee">$${fee}<span style="font-size:.9rem;color:#efeae1">${unit}</span></p>
      <ul>${plan.points.map((point) => `<li>${esc(point)}</li>`).join('')}</ul>
    </button>`;
  }).join('')}</div>`;
  const selected = PLANS.find((plan) => plan.id === state.plan);
  join.classList.toggle('hidden', !selected);
  if (selected) {
    const fee = state.billing === 'year' ? selected.year : selected.month;
    joinTitle.textContent = 'Join ' + selected.name + ' · $' + fee + (state.billing === 'year' ? '/yr' : '/mo');
  }
  if (state.member) {
    joinDone.hidden = false;
    joinDone.textContent = state.member.name + ' is down for ' + state.member.plan + ' starting ' + state.member.start + '. Saved on this device only.';
  } else {
    joinDone.hidden = true;
  }
  document.getElementById('bill-month').setAttribute('aria-pressed', state.billing === 'month' ? 'true' : 'false');
  document.getElementById('bill-year').setAttribute('aria-pressed', state.billing === 'year' ? 'true' : 'false');
}

function render() {
  if (!DAYS.includes(state.day)) state.day = 'All';
  if (!TYPES.includes(state.type)) state.type = 'All';
  renderChips(dayChips, DAYS, state.day, 'day');
  renderChips(typeChips, TYPES, state.type, 'type');
  renderClasses();
  renderPlans();
  persist();
}

document.body.addEventListener('click', (event) => {
  const day = event.target.closest('[data-day]');
  const type = event.target.closest('[data-type]');
  const plan = event.target.closest('[data-plan]');
  if (day) { state.day = day.getAttribute('data-day'); render(); }
  if (type) { state.type = type.getAttribute('data-type'); render(); }
  if (plan) {
    state.plan = plan.getAttribute('data-plan');
    state.member = null;
    joinDone.hidden = true;
    render();
  }
  if (event.target.id === 'bill-month') { state.billing = 'month'; render(); }
  if (event.target.id === 'bill-year') { state.billing = 'year'; render(); }
});

join.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(join);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const start = String(data.get('start') || '');
  const plan = PLANS.find((item) => item.id === state.plan);
  if (!plan) return;
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !start) {
    joinError.hidden = false;
    joinError.textContent = 'Name, email, and a start date — then we hold the spot.';
    return;
  }
  joinError.hidden = true;
  state.member = { name, email, start, plan: plan.name, billing: state.billing };
  render();
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const details = link.closest('details');
    if (details && window.matchMedia('(max-width: 800px)').matches) details.open = false;
  });
});

render();
