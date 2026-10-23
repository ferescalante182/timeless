'use strict';

const BEERS = [
  { name: 'Cerro Pils', style: 'Lager', abv: '4.8%', ibu: '28', note: 'Cracker, a little lime, the one you order twice.', pour: '$4 / $7' },
  { name: 'Otay Clear', style: 'Lager', abv: '4.2%', ibu: '18', note: 'Light grain, cold, made for the patio.', pour: '$4 / $6' },
  { name: 'Bajamar Haze', style: 'IPA', abv: '6.5%', ibu: '45', note: 'Mango and a soft bitterness. Not a juice bomb.', pour: '$5 / $8' },
  { name: 'Colina', style: 'IPA', abv: '7.1%', ibu: '62', note: 'Pine, grapefruit pith, a west-coast finish.', pour: '$5 / $8' },
  { name: 'Noche de Cacho', style: 'Stout', abv: '6.2%', ibu: '32', note: 'Roast coffee from a roaster we like on Fir Street.', pour: '$5 / $8' },
  { name: 'Cacao de Valle', style: 'Stout', abv: '8.0%', ibu: '30', note: 'Cocoa nibs, a sweet edge, one is enough.', pour: '$6 / $9' },
  { name: 'Buganvilia', style: 'Sour', abv: '4.6%', ibu: '8', note: 'Hibiscus, tart, the color of the courtyard wall.', pour: '$5 / $8' },
  { name: 'Guayaba Rosa', style: 'Sour', abv: '5.1%', ibu: '8', note: 'Guava, salt on the rim if you ask.', pour: '$5 / $8' },
  { name: 'Maíz Azul', style: 'Seasonal', abv: '5.4%', ibu: '22', note: 'Blue corn in the mash. Tortilla chip, in a good way.', pour: '$5 / $8' },
  { name: 'Niebla', style: 'Seasonal', abv: '5.0%', ibu: '16', note: 'A wheat beer for the gray mornings off the coast.', pour: '$4 / $7' }
];

const STYLES = ['All', 'Lager', 'IPA', 'Stout', 'Sour', 'Seasonal'];
const KEY = 'timeless-demo-rumor';
const now = new Date();
const stored = load();
const state = {
  style: STYLES.includes(stored.style) ? stored.style : 'All',
  y: now.getFullYear(),
  m: now.getMonth(),
  selected: ymd(now),
  rsvps: Array.isArray(stored.rsvps) ? stored.rsvps : []
};

const chips = document.getElementById('style-chips');
const tapList = document.getElementById('tap-list');
const tapCount = document.getElementById('tap-count');
const grid = document.getElementById('cal-grid');
const monthLabel = document.getElementById('month-label');
const detail = document.getElementById('day-detail');

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return raw && typeof raw === 'object' ? raw : {};
  } catch (err) {
    return {};
  }
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({ style: state.style, rsvps: state.rsvps })); } catch (err) { /* ignore */ }
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function ymd(date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

function eventsOn(date) {
  const dow = date.getDay();
  const id = ymd(date);
  const list = [];
  if (dow === 2) list.push({ id: id + '-trivia', title: 'Trivia de la frontera', time: '7:00 p.m.', note: 'Teams of four. Questions in English and Spanish.' });
  if (dow === 5) list.push({ id: id + '-son', title: 'Son jarocho', time: '8:00 p.m.', note: 'A trio by the tap wall. No cover.' });
  if (dow === 6) list.push({ id: id + '-mariscos', title: 'Mariscos pop-up', time: '1:00 p.m.', note: 'Aguachile and a lager. Their kitchen, our beer.' });
  if (dow === 4 && date.getDate() <= 7) list.push({ id: id + '-talk', title: 'Tap talk', time: '6:00 p.m.', note: 'The brewer walks the list. One beer is included.' });
  if (dow === 0 && date.getDate() > 14 && date.getDate() < 22) list.push({ id: id + '-bottle', title: 'Bottle club', time: '4:00 p.m.', note: 'A seasonal bottle and the good glassware.' });
  return list;
}

function filtered() {
  return BEERS.filter((beer) => state.style === 'All' || beer.style === state.style);
}

function renderTaps() {
  chips.innerHTML = STYLES.map((style) => `<button type="button" data-style="${esc(style)}" aria-pressed="${style === state.style ? 'true' : 'false'}">${esc(style)}</button>`).join('');
  const beers = filtered();
  tapCount.textContent = beers.length + (beers.length === 1 ? ' beer' : ' beers') + (state.style === 'All' ? ' pouring' : ' in ' + state.style);
  if (!beers.length) {
    tapList.innerHTML = '<p class="empty">Nothing in that style today. The lager is still cold.</p>';
    return;
  }
  tapList.innerHTML = beers.map((beer) => `<article class="tap">
    <div><p class="style">${esc(beer.style)}</p><h3>${esc(beer.name)}</h3><p>${esc(beer.note)}</p></div>
    <p class="nums">${esc(beer.abv)} ABV</p>
    <p class="nums">${esc(beer.ibu)} IBU</p>
    <p>${esc(beer.pour)}</p>
  </article>`).join('');
}

function inRange(next) {
  const min = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const max = new Date(now.getFullYear(), now.getMonth() + 2, 1);
  return next >= min && next <= max;
}

function renderCalendar() {
  const label = new Date(state.y, state.m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  monthLabel.textContent = label;
  const first = new Date(state.y, state.m, 1);
  const days = new Date(state.y, state.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first.getDay(); i += 1) cells.push('<span class="day pad"></span>');
  for (let day = 1; day <= days; day += 1) {
    const date = new Date(state.y, state.m, day);
    const id = ymd(date);
    const has = eventsOn(date).length > 0;
    const today = id === ymd(now);
    cells.push(`<button type="button" class="day${has ? ' has' : ''}" data-day="${id}" aria-pressed="${state.selected === id ? 'true' : 'false'}" ${today ? 'aria-current="date"' : ''}>${day}</button>`);
  }
  grid.innerHTML = cells.join('');
  const selected = new Date(state.selected + 'T12:00:00');
  const sameMonth = selected.getFullYear() === state.y && selected.getMonth() === state.m;
  const events = sameMonth ? eventsOn(selected) : [];
  const heading = selected.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  if (!sameMonth || !events.length) {
    detail.innerHTML = `<h3>${esc(heading)}</h3><p>Nothing on the book. The taproom is still open Wed–Sun.</p>`;
    return;
  }
  detail.innerHTML = `<h3>${esc(heading)}</h3>` + events.map((event) => {
    const saved = state.rsvps.includes(event.id);
    return `<article class="event"><p class="style">${esc(event.time)}</p><h3>${esc(event.title)}</h3><p>${esc(event.note)}</p>
      <button type="button" class="rsvp" data-rsvp="${esc(event.id)}" aria-pressed="${saved ? 'true' : 'false'}">${saved ? 'Seat saved on this device' : 'Save a seat'}</button></article>`;
  }).join('');
}

function render() {
  renderTaps();
  renderCalendar();
  persist();
}

document.body.addEventListener('click', (event) => {
  const style = event.target.closest('[data-style]');
  const day = event.target.closest('[data-day]');
  const rsvp = event.target.closest('[data-rsvp]');
  if (style) {
    state.style = style.getAttribute('data-style');
    render();
    return;
  }
  if (day) {
    state.selected = day.getAttribute('data-day');
    render();
    return;
  }
  if (rsvp) {
    const id = rsvp.getAttribute('data-rsvp');
    if (state.rsvps.includes(id)) state.rsvps = state.rsvps.filter((item) => item !== id);
    else state.rsvps.push(id);
    render();
  }
  if (event.target.id === 'prev-month' || event.target.id === 'next-month') {
    const delta = event.target.id === 'next-month' ? 1 : -1;
    const next = new Date(state.y, state.m + delta, 1);
    if (!inRange(next)) return;
    state.y = next.getFullYear();
    state.m = next.getMonth();
    state.selected = ymd(next);
    render();
  }
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const details = link.closest('details');
    if (details && window.matchMedia('(max-width: 800px)').matches) details.open = false;
  });
});

render();
