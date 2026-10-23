'use strict';

const HOMES = [
  { id: 'np', area: 'North Park', title: '30th Street bungalow', price: 875000, beds: 2, baths: 1, sqft: 1140, img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=70', blurb: 'A 1924 bungalow with a new kitchen and the original fireplace. Two blocks from the coffee, one alley from the canyon.' },
  { id: 'ob', area: 'Ocean Beach', title: 'Cottage off Newport', price: 1425000, beds: 3, baths: 2, sqft: 1460, img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=70', blurb: 'Sun in the morning, salt in the paint, and a yard big enough for a table of eight.' },
  { id: 'cv', area: 'Chula Vista', title: 'Eastlake new build', price: 789000, beds: 4, baths: 3, sqft: 2210, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70', blurb: 'Four bedrooms, a downstairs suite, and a commute that still reaches the crossing before eight.' },
  { id: 'cor', area: 'Coronado', title: 'Condo near the ferry', price: 1150000, beds: 2, baths: 2, sqft: 1080, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=70', blurb: 'Light on three sides. The building keeps the pool. The ferry is a twelve-minute walk.' },
  { id: 'zr', area: 'Zona Río', title: 'Flat on the Paseo', price: 265000, beds: 2, baths: 2, sqft: 980, img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70', blurb: 'A high floor, a guarded lobby, and Saturday walks to the river park.' },
  { id: 'playas', area: 'Playas de Tijuana', title: 'House off the beach', price: 410000, beds: 3, baths: 2, sqft: 1680, img: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=70', blurb: 'Stucco, a roof deck, and the shore when the wind comes from the right direction.' },
  { id: 'logan', area: 'Barrio Logan', title: 'Loft above the murals', price: 625000, beds: 1, baths: 1, sqft: 860, img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=70', blurb: 'Concrete floors, a real kitchen, and a roll-up that faces the gallery row.' },
  { id: 'lj', area: 'La Jolla', title: 'House on the upper hill', price: 2480000, beds: 4, baths: 3, sqft: 2860, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70', blurb: 'A quiet street, a long horizon, and a kitchen built for people who cook.' }
];

const KEY = 'timeless-demo-lindero';
const saved = load();
const state = {
  price: 'any',
  beds: 0,
  area: 'all',
  open: '',
  favs: saved.favs || [],
  requests: saved.requests || {}
};

const results = document.getElementById('results');
const countEl = document.getElementById('result-count');

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!raw || typeof raw !== 'object') return { favs: [], requests: {} };
    return {
      favs: Array.isArray(raw.favs) ? raw.favs : [],
      requests: raw.requests && typeof raw.requests === 'object' ? raw.requests : {}
    };
  } catch (err) {
    return { favs: [], requests: {} };
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ favs: state.favs, requests: state.requests }));
  } catch (err) { /* ignore */ }
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function money(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function inPrice(price) {
  if (state.price === 'u400') return price < 400000;
  if (state.price === '400') return price >= 400000 && price < 800000;
  if (state.price === '800') return price >= 800000 && price < 1200000;
  if (state.price === '1200') return price >= 1200000;
  return true;
}

function visible() {
  return HOMES.filter((home) => inPrice(home.price) && home.beds >= state.beds && (state.area === 'all' || home.area === state.area));
}

function render() {
  const homes = visible();
  const noun = homes.length === 1 ? 'home' : 'homes';
  countEl.textContent = homes.length + ' ' + noun;
  if (!homes.length) {
    results.innerHTML = '<p class="empty">No homes in that mix. Widen the price, or try another neighborhood.</p>';
    return;
  }
  results.innerHTML = `<div class="grid">${homes.map((home) => {
    const open = state.open === home.id;
    const fav = state.favs.includes(home.id);
    const request = state.requests[home.id];
    return `<article class="card">
      <figure>
        <img src="${esc(home.img)}" alt="${esc(home.title)} in ${esc(home.area)}" width="1200" height="800">
        <button type="button" class="heart" data-fav="${home.id}" aria-pressed="${fav ? 'true' : 'false'}" aria-label="${fav ? 'Remove from saved homes' : 'Save home'}">${fav ? '♥' : '♡'}</button>
      </figure>
      <p class="area-label">${esc(home.area)}</p>
      <div class="card-top">
        <h3>${esc(home.title)}</h3>
        <p class="price">${money(home.price)}</p>
      </div>
      <p class="facts">${home.beds} bd · ${home.baths} ba · ${home.sqft.toLocaleString('en-US')} sqft</p>
      <button type="button" class="more" data-open="${home.id}" aria-expanded="${open ? 'true' : 'false'}">${open ? 'Close' : 'Request a showing'}</button>
      ${open ? `<div class="detail">
        <p>${esc(home.blurb)}</p>
        ${request ? `<p class="saved">Showing requested for ${esc(request.name)} on ${esc(request.date)}. Saved on this device only.</p>` : `<form class="show" data-form="${home.id}">
          <input name="name" required placeholder="Your name" autocomplete="name" value="${esc(request && request.name || '')}">
          <input name="email" type="email" required placeholder="Email" autocomplete="email">
          <input name="date" type="date" required aria-label="Preferred day">
          <button type="submit">Hold a showing</button>
        </form>`}
      </div>` : ''}
    </article>`;
  }).join('')}</div>`;
}

document.getElementById('filters').addEventListener('submit', (event) => event.preventDefault());

document.getElementById('filters').addEventListener('change', (event) => {
  if (event.target.id === 'price') state.price = event.target.value;
  if (event.target.id === 'beds') state.beds = Number(event.target.value);
  if (event.target.id === 'area') state.area = event.target.value;
  state.open = '';
  render();
});

results.addEventListener('click', (event) => {
  const fav = event.target.closest('[data-fav]');
  const open = event.target.closest('[data-open]');
  if (fav) {
    const id = fav.getAttribute('data-fav');
    if (state.favs.includes(id)) state.favs = state.favs.filter((item) => item !== id);
    else state.favs.push(id);
    persist();
    render();
    return;
  }
  if (open) {
    const id = open.getAttribute('data-open');
    state.open = state.open === id ? '' : id;
    render();
  }
});

results.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-form]');
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const date = String(data.get('date') || '');
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !date) return;
  state.requests[form.getAttribute('data-form')] = { name, email, date };
  persist();
  render();
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const details = link.closest('details');
    if (details && window.matchMedia('(max-width: 800px)').matches) details.open = false;
  });
});

render();
