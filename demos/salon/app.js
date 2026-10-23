'use strict';

const STYLISTS = [
  { id: 'lina', name: 'Lina Ortega', role: 'Cuts', bio: 'Lived-in shape and lines you can still dry on a windy morning.', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=70', alt: 'A finished haircut in soft studio light' },
  { id: 'sofia', name: 'Sofía Beltrán', role: 'Color', bio: 'Balayage and the kind of pink that still looks like hair.', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=70', alt: 'Vivid pink color work' },
  { id: 'jonah', name: 'Jonah Park', role: 'Texture', bio: 'Precision crops, shear work, and almost no product.', img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=70', alt: 'A close crop at the chair' },
  { id: 'renata', name: 'Renata Vidal', role: 'Bridal', bio: 'Trials in North Park. Wedding mornings that can travel to Tijuana.', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=70', alt: 'An updo pinned for an event' }
];

const SERVICES = [
  { id: 'cut', name: 'Cut & style', price: 85, mins: 60 },
  { id: 'blowout', name: 'Blowout', price: 55, mins: 45 },
  { id: 'root', name: 'Root color', price: 120, mins: 90 },
  { id: 'balayage', name: 'Balayage', price: 210, mins: 180 },
  { id: 'gloss', name: 'Gloss', price: 65, mins: 45 },
  { id: 'bridal', name: 'Bridal trial', price: 150, mins: 90 }
];

const SLOTS = ['10:00', '11:30', '1:00', '2:30', '4:00', '5:30'];
const KEY = 'timeless-demo-nublado';
const stored = load();
const state = {
  step: Number.isInteger(stored.step) ? stored.step : 0,
  stylist: stored.stylist || '',
  service: stored.service || '',
  date: stored.date || '',
  time: stored.time || '',
  name: stored.name || '',
  phone: stored.phone || '',
  note: stored.note || '',
  error: '',
  ref: stored.ref || ''
};

const row = document.getElementById('stylist-row');
const panel = document.getElementById('book-panel');

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return raw && typeof raw === 'object' ? raw : {};
  } catch (err) {
    return {};
  }
}

function persist() {
  const copy = Object.assign({}, state);
  delete copy.error;
  try { localStorage.setItem(KEY, JSON.stringify(copy)); } catch (err) { /* ignore */ }
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function ymd(date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

function upcoming() {
  const days = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  while (days.length < 10) {
    if (cursor.getDay() !== 0 && cursor.getDay() !== 1) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function taken(dateStr, time) {
  const seed = Array.from(state.stylist + dateStr + time).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return seed % 4 === 0;
}

function past(dateStr, time) {
  if (dateStr !== ymd(new Date())) return false;
  let hour = Number(time.split(':')[0]);
  const minute = Number(time.split(':')[1]);
  if (hour < 9) hour += 12;
  const now = new Date();
  return hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes());
}

function stylist() { return STYLISTS.find((item) => item.id === state.stylist); }
function service() { return SERVICES.find((item) => item.id === state.service); }

function pretty(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function renderRow() {
  row.innerHTML = STYLISTS.map((person) => `<button type="button" class="stylist" data-stylist="${person.id}" aria-pressed="${state.stylist === person.id ? 'true' : 'false'}">
    <img src="${person.img}" alt="${esc(person.alt)}" width="800" height="1066">
    <p class="role">${esc(person.role)}</p>
    <h3>${esc(person.name)}</h3>
    <p>${esc(person.bio)}</p>
  </button>`).join('');
}

function steps(n) {
  return `<div class="steps" aria-hidden="true">${[0, 1, 2, 3].map((i) => `<span class="${i <= n ? 'on' : ''}"></span>`).join('')}</div>`;
}

function renderPanel() {
  persist();
  const who = stylist();
  const what = service();
  if (state.step === 4 && state.ref) {
    panel.innerHTML = `${steps(3)}<p class="role">Held</p><h2>${esc(state.ref)}</h2>
      <p>${esc(who.name)} · ${esc(what.name)} · ${esc(pretty(state.date))} at ${esc(state.time)}</p>
      <p>For ${esc(state.name)}. Saved on this device only — the studio will not call, because the studio is not real.</p>
      <button type="button" class="primary" id="reset">Book someone else</button>`;
    return;
  }
  let body = '';
  if (state.step === 0) {
    body = `<h2>Choose a stylist</h2><p>Use the portraits above, or pick a name here.</p>
      <div class="choices">${STYLISTS.map((person) => `<button type="button" class="choice" data-stylist="${person.id}" aria-pressed="${state.stylist === person.id ? 'true' : 'false'}">${esc(person.name)}<br><span>${esc(person.role)}</span></button>`).join('')}</div>
      <div class="row-actions"><button type="button" class="primary" id="next">Continue</button></div>`;
  } else if (state.step === 1) {
    body = `<h2>Choose a service</h2><p>With ${esc(who.name)}.</p>
      ${state.service === 'bridal' ? '<p class="note">Renata leads bridal. Any stylist can take the trial if her book is full.</p>' : ''}
      <div class="choices">${SERVICES.map((item) => `<button type="button" class="choice" data-service="${item.id}" aria-pressed="${state.service === item.id ? 'true' : 'false'}">${esc(item.name)}<br><span>$${item.price} · ${item.mins} min</span></button>`).join('')}</div>
      <div class="row-actions"><button type="button" class="ghost" id="back">Back</button><button type="button" class="primary" id="next">Continue</button></div>`;
  } else if (state.step === 2) {
    body = `<h2>Day and time</h2><p>Closed Sunday and Monday.</p>
      <div class="days">${upcoming().map((date) => {
        const value = ymd(date);
        const label = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        return `<button type="button" class="day" data-date="${value}" aria-pressed="${state.date === value ? 'true' : 'false'}">${esc(label)}</button>`;
      }).join('')}</div>
      <div class="slots">${SLOTS.map((time) => {
        const disabled = !state.date || taken(state.date, time) || past(state.date, time);
        return `<button type="button" class="slot" data-time="${time}" ${disabled ? 'disabled' : ''} aria-pressed="${state.time === time ? 'true' : 'false'}">${time}</button>`;
      }).join('')}</div>
      <div class="row-actions"><button type="button" class="ghost" id="back">Back</button><button type="button" class="primary" id="next">Continue</button></div>`;
  } else {
    body = `<h2>Your details</h2><p>${esc(who.name)} · ${esc(what.name)} · ${esc(pretty(state.date))} · ${esc(state.time)}</p>
      <label class="field">Name<input id="s-name" autocomplete="name" value="${esc(state.name)}"></label>
      <label class="field">Phone<input id="s-phone" type="tel" autocomplete="tel" value="${esc(state.phone)}"></label>
      <label class="field">Notes<textarea id="s-note" rows="2">${esc(state.note)}</textarea></label>
      <div class="row-actions"><button type="button" class="ghost" id="back">Back</button><button type="button" class="primary" id="confirm">Confirm booking</button></div>`;
  }
  panel.innerHTML = steps(Math.min(state.step, 3)) + (state.error ? `<p class="error">${esc(state.error)}</p>` : '') + body;
}

function render() {
  renderRow();
  renderPanel();
}

panel.addEventListener('click', (event) => {
  const who = event.target.closest('[data-stylist]');
  const what = event.target.closest('[data-service]');
  const date = event.target.closest('[data-date]');
  const time = event.target.closest('[data-time]');
  if (who) { state.stylist = who.getAttribute('data-stylist'); state.error = ''; render(); return; }
  if (what) { state.service = what.getAttribute('data-service'); state.error = ''; render(); return; }
  if (date) { state.date = date.getAttribute('data-date'); state.time = ''; state.error = ''; render(); return; }
  if (time && !time.disabled) { state.time = time.getAttribute('data-time'); state.error = ''; render(); return; }
  if (event.target.id === 'next' || event.target.id === 'confirm') advance();
  if (event.target.id === 'back') { state.error = ''; state.step = Math.max(0, state.step - 1); render(); }
  if (event.target.id === 'reset') {
    state.step = 0; state.stylist = ''; state.service = ''; state.date = ''; state.time = ''; state.ref = ''; state.error = '';
    render();
  }
});

row.addEventListener('click', (event) => {
  const who = event.target.closest('[data-stylist]');
  if (!who) return;
  state.stylist = who.getAttribute('data-stylist');
  state.step = 1;
  state.error = '';
  state.ref = '';
  render();
  document.getElementById('book').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function advance() {
  state.error = '';
  if (state.step === 0 && !state.stylist) state.error = 'Choose a stylist.';
  else if (state.step === 1 && !state.service) state.error = 'Choose a service.';
  else if (state.step === 2 && (!state.date || !state.time)) state.error = 'Choose a day and an open time.';
  else if (state.step === 3) {
    if (state.name.trim().length < 2) state.error = 'Add a name for the book.';
    else if (state.phone.replace(/\D/g, '').length < 7) state.error = 'Add a phone number.';
    else {
      state.ref = 'NB-' + String(1000 + (Date.now() % 9000));
      state.step = 4;
      render();
      return;
    }
  }
  if (!state.error) state.step += 1;
  render();
}

panel.addEventListener('input', (event) => {
  if (event.target.id === 's-name') state.name = event.target.value;
  if (event.target.id === 's-phone') state.phone = event.target.value;
  if (event.target.id === 's-note') state.note = event.target.value;
  persist();
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const details = link.closest('details');
    if (details && window.matchMedia('(max-width: 900px)').matches) details.open = false;
  });
});

render();
