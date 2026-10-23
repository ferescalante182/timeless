'use strict';

const SERVICES = [
  { id: 'cleaning', name: 'Cleaning & polish', detail: '45 min · from $90' },
  { id: 'exam', name: 'New-patient exam', detail: '60 min · from $120' },
  { id: 'whitening', name: 'Whitening visit', detail: '90 min · from $280' },
  { id: 'filling', name: 'Filling', detail: '60 min · from $160' },
  { id: 'emergency', name: 'Toothache consult', detail: '30 min · from $75' }
];

const SLOTS = ['9:00', '10:00', '11:30', '1:00', '2:30', '4:00', '5:30'];
const KEY = 'timeless-demo-claridad';

const state = Object.assign({
  step: 0,
  service: '',
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  patient: 'new',
  note: '',
  error: '',
  ref: ''
}, load());

const book = document.getElementById('book');

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

function ymd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function upcomingDays() {
  const days = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  while (days.length < 12) {
    if (cursor.getDay() !== 0) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function weekday(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function monthDay(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function slotTaken(dateStr, time) {
  const seed = Array.from(dateStr + time).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return seed % 5 === 0;
}

function slotPast(dateStr, time) {
  if (dateStr !== ymd(new Date())) return false;
  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)?$/i);
  if (!match) return false;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 8) hour += 12;
  const now = new Date();
  return hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes());
}

function saturdayLate(dateStr, time) {
  const date = new Date(dateStr + 'T12:00:00');
  if (date.getDay() !== 6) return false;
  return time === '4:00' || time === '5:30';
}

function serviceName() {
  const found = SERVICES.find((item) => item.id === state.service);
  return found ? found.name : '';
}

function prettyDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function steps(current) {
  return `<div class="steps" aria-hidden="true">${[0, 1, 2, 3].map((n) => `<span class="${n <= current ? 'on' : ''}"></span>`).join('')}</div>`;
}

function render() {
  persist();
  if (state.step === 4) {
    book.innerHTML = `<div class="confirm">
      ${steps(3)}
      <p class="hint">You are on the book</p>
      <h3>${esc(state.ref)}</h3>
      <div class="summary">
        <dl>
          <dt>Visit</dt><dd>${esc(serviceName())}</dd>
          <dt>When</dt><dd>${esc(prettyDate(state.date))} · ${esc(state.time)}</dd>
          <dt>For</dt><dd>${esc(state.name)}</dd>
        </dl>
      </div>
      <p class="hint">Saved on this device only. The studio is fictitious, so no one will call — though in the real version, the desk would.</p>
      <button type="button" class="primary" id="reset">Book another time</button>
    </div>`;
    return;
  }

  let body = '';
  if (state.step === 0) {
    body = `<h2>Book a visit</h2><p class="hint">Choose a service.</p>
      ${SERVICES.map((item) => `<button type="button" class="choice" data-service="${item.id}" aria-pressed="${state.service === item.id ? 'true' : 'false'}"><strong>${esc(item.name)}</strong><span>${esc(item.detail)}</span></button>`).join('')}
      <div class="row-actions"><button type="button" class="primary" id="next">Continue</button></div>`;
  } else if (state.step === 1) {
    const days = upcomingDays();
    body = `<h2>Pick a day</h2><p class="hint">${esc(serviceName())}. Closed Sundays.</p>
      <div class="days">${days.map((date) => {
        const value = ymd(date);
        return `<button type="button" class="day" data-date="${value}" aria-pressed="${state.date === value ? 'true' : 'false'}"><strong>${esc(weekday(date))}</strong><span>${esc(monthDay(date))}</span></button>`;
      }).join('')}</div>
      <div class="row-actions"><button type="button" class="ghost" id="back">Back</button><button type="button" class="primary" id="next">Continue</button></div>`;
  } else if (state.step === 2) {
    body = `<h2>Pick a time</h2><p class="hint">${esc(prettyDate(state.date))}</p>
      <div class="slots">${SLOTS.map((time) => {
        const disabled = slotTaken(state.date, time) || slotPast(state.date, time) || saturdayLate(state.date, time);
        const label = disabled ? 'Taken' : 'Open';
        return `<button type="button" class="slot" data-time="${time}" ${disabled ? 'disabled' : ''} aria-pressed="${state.time === time ? 'true' : 'false'}">${esc(time)}<span>${label}</span></button>`;
      }).join('')}</div>
      <div class="row-actions"><button type="button" class="ghost" id="back">Back</button><button type="button" class="primary" id="next">Continue</button></div>`;
  } else {
    body = `<h2>Your details</h2><p class="hint">${esc(serviceName())} · ${esc(prettyDate(state.date))} · ${esc(state.time)}</p>
      <label class="field">Name<input id="f-name" autocomplete="name" value="${esc(state.name)}" required></label>
      <label class="field">Phone<input id="f-phone" type="tel" autocomplete="tel" value="${esc(state.phone)}" required></label>
      <label class="field">Email<input id="f-email" type="email" autocomplete="email" value="${esc(state.email)}" required></label>
      <label class="field">Patient
        <select id="f-patient">
          <option value="new" ${state.patient === 'new' ? 'selected' : ''}>New to Claridad</option>
          <option value="return" ${state.patient === 'return' ? 'selected' : ''}>I have been in before</option>
        </select>
      </label>
      <label class="field">Anything we should know?<textarea id="f-note" rows="2" maxlength="180">${esc(state.note)}</textarea></label>
      <div class="row-actions"><button type="button" class="ghost" id="back">Back</button><button type="button" class="primary" id="confirm">Confirm visit</button></div>`;
  }

  book.innerHTML = steps(state.step) + (state.error ? `<p class="error">${esc(state.error)}</p>` : '') + body;
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function next() {
  state.error = '';
  if (state.step === 0 && !state.service) {
    state.error = 'Choose a service to continue.';
  } else if (state.step === 1 && !state.date) {
    state.error = 'Choose a day.';
  } else if (state.step === 2 && !state.time) {
    state.error = 'Choose an open time.';
  } else if (state.step === 3) {
    if (state.name.trim().length < 2) state.error = 'Add the name for the appointment.';
    else if (state.phone.replace(/\D/g, '').length < 7) state.error = 'Add a phone number the desk could call.';
    else if (!validEmail(state.email.trim())) state.error = 'Add a real-looking email. It stays on this device.';
    else {
      state.ref = 'CL-' + String(1000 + (Date.now() % 9000));
      state.step = 4;
      render();
      return;
    }
  }
  if (!state.error) state.step += 1;
  render();
}

book.addEventListener('click', (event) => {
  const service = event.target.closest('[data-service]');
  const date = event.target.closest('[data-date]');
  const time = event.target.closest('[data-time]');
  if (service) {
    state.service = service.getAttribute('data-service');
    state.error = '';
    render();
    return;
  }
  if (date) {
    state.date = date.getAttribute('data-date');
    state.time = '';
    state.error = '';
    render();
    return;
  }
  if (time && !time.disabled) {
    state.time = time.getAttribute('data-time');
    state.error = '';
    render();
    return;
  }
  if (event.target.id === 'next' || event.target.id === 'confirm') next();
  if (event.target.id === 'back') {
    state.error = '';
    state.step = Math.max(0, state.step - 1);
    render();
  }
  if (event.target.id === 'reset') {
    state.step = 0;
    state.service = '';
    state.date = '';
    state.time = '';
    state.note = '';
    state.ref = '';
    state.error = '';
    render();
  }
});

book.addEventListener('input', (event) => {
  const map = { 'f-name': 'name', 'f-phone': 'phone', 'f-email': 'email', 'f-patient': 'patient', 'f-note': 'note' };
  const key = map[event.target.id];
  if (key) {
    state[key] = event.target.value;
    persist();
  }
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const details = link.closest('details');
    if (details && window.matchMedia('(max-width: 900px)').matches) details.open = false;
  });
});

render();
