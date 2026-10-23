'use strict';

const VEHICLES = [
  { id: 'compact', name: 'Compact', multiplier: 0.9 },
  { id: 'sedan', name: 'Sedan', multiplier: 1 },
  { id: 'suv', name: 'SUV', multiplier: 1.15 },
  { id: 'pickup', name: 'Pickup', multiplier: 1.2 },
  { id: 'van', name: 'Van', multiplier: 1.25 }
];

const SERVICES = [
  { id: 'oil', name: 'Oil and filter', price: 49 },
  { id: 'brakes', name: 'Brake pads, one axle', price: 189 },
  { id: 'battery', name: 'Battery test and replace', price: 165 },
  { id: 'diag', name: 'Diagnostics', price: 95 },
  { id: 'tires', name: 'Tire rotation', price: 35 },
  { id: 'ac', name: 'A/C service', price: 149 },
  { id: 'align', name: 'Alignment', price: 119 }
];

const KEY = 'timeless-demo-meridiano';
const stored = load();
const state = {
  vehicle: stored.vehicle || 'sedan',
  services: Array.isArray(stored.services) ? stored.services : [],
  quote: stored.quote || null,
  name: '',
  phone: '',
  day: ''
};

const vehiclesEl = document.getElementById('vehicles');
const servicesEl = document.getElementById('services');
const totalsEl = document.getElementById('totals');
const holdEl = document.getElementById('hold');

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return raw && typeof raw === 'object' ? raw : {};
  } catch (err) {
    return {};
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      vehicle: state.vehicle,
      services: state.services,
      quote: state.quote
    }));
  } catch (err) { /* ignore */ }
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function money(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function vehicle() {
  return VEHICLES.find((item) => item.id === state.vehicle) || VEHICLES[1];
}

function line(service) {
  return Math.round(service.price * vehicle().multiplier);
}

function selected() {
  return SERVICES.filter((service) => state.services.includes(service.id));
}

function supplies(sum) {
  return Math.round(sum * 0.04);
}

function renderVehicles() {
  vehiclesEl.innerHTML = VEHICLES.map((item) => (
    `<button type="button" data-vehicle="${item.id}" aria-pressed="${item.id === state.vehicle ? 'true' : 'false'}">${esc(item.name)}</button>`
  )).join('');
}

function renderServices() {
  servicesEl.innerHTML = SERVICES.map((service) => {
    const on = state.services.includes(service.id);
    return `<button type="button" class="svc" data-service="${service.id}" aria-pressed="${on ? 'true' : 'false'}">
      <span>${esc(service.name)}</span><b>${money(line(service))}</b>
    </button>`;
  }).join('');
}

function renderTotals() {
  const lines = selected();
  const sub = lines.reduce((sum, service) => sum + line(service), 0);
  const shop = lines.length ? supplies(sub) : 0;
  const total = sub + shop;
  if (!lines.length) {
    totalsEl.innerHTML = '<p class="muted">Tick at least one service. Prices already include the vehicle multiplier.</p>';
    return;
  }
  totalsEl.innerHTML = `<div><span>Labor &amp; parts</span><span>${money(sub)}</span></div>
    <div><span>Shop supplies 4%</span><span>${money(shop)}</span></div>
    <div class="grand"><span>Estimate</span><span>${money(total)}</span></div>
    <p class="muted">${esc(vehicle().name)} rate. Final price confirmed after inspection.</p>`;
}

function renderHold() {
  if (state.quote) {
    holdEl.innerHTML = `<p class="quote-id">${esc(state.quote.id)}</p>
      <p>Held for ${esc(state.quote.name)} · ${esc(state.quote.vehicle)} · ${money(state.quote.total)}. Preferred day ${esc(state.quote.day)}. This quote stays on this device.</p>
      <button type="button" id="clear-quote">Write a new estimate</button>`;
    return;
  }
  if (!selected().length) {
    holdEl.innerHTML = '';
    return;
  }
  holdEl.innerHTML = `<label>Name<input id="q-name" autocomplete="name" value="${esc(state.name)}"></label>
    <label>Phone<input id="q-phone" type="tel" autocomplete="tel" value="${esc(state.phone)}"></label>
    <label>Preferred day<input id="q-day" type="date" value="${esc(state.day)}"></label>
    <p class="muted" id="q-error" hidden></p>
    <button type="button" id="save-quote">Hold this quote</button>`;
}

function render() {
  renderVehicles();
  renderServices();
  renderTotals();
  renderHold();
  persist();
}

document.getElementById('invoice').addEventListener('submit', (event) => event.preventDefault());

document.getElementById('invoice').addEventListener('click', (event) => {
  const vehicleBtn = event.target.closest('[data-vehicle]');
  const serviceBtn = event.target.closest('[data-service]');
  if (vehicleBtn) {
    state.vehicle = vehicleBtn.getAttribute('data-vehicle');
    state.quote = null;
    render();
    return;
  }
  if (serviceBtn) {
    const id = serviceBtn.getAttribute('data-service');
    if (state.services.includes(id)) state.services = state.services.filter((item) => item !== id);
    else state.services.push(id);
    state.quote = null;
    render();
    return;
  }
  if (event.target.id === 'save-quote') {
    const name = state.name.trim();
    const phone = state.phone.trim();
    const day = state.day;
    const error = document.getElementById('q-error');
    if (name.length < 2 || phone.replace(/\D/g, '').length < 7 || !day) {
      if (error) {
        error.hidden = false;
        error.textContent = 'Add a name, a phone number, and the day you can leave the car.';
      }
      return;
    }
    const lines = selected();
    const sub = lines.reduce((sum, service) => sum + line(service), 0);
    state.quote = {
      id: 'MW-' + String(1000 + (Date.now() % 9000)),
      name,
      phone,
      day,
      vehicle: vehicle().name,
      services: lines.map((service) => service.name),
      total: sub + supplies(sub)
    };
    render();
  }
  if (event.target.id === 'clear-quote') {
    state.quote = null;
    render();
  }
});

document.getElementById('invoice').addEventListener('input', (event) => {
  if (event.target.id === 'q-name') state.name = event.target.value;
  if (event.target.id === 'q-phone') state.phone = event.target.value;
  if (event.target.id === 'q-day') state.day = event.target.value;
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const details = link.closest('details');
    if (details && window.matchMedia('(max-width: 900px)').matches) details.open = false;
  });
});

render();
