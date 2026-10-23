'use strict';

const MENU = [
  { id: 'pastor', cat: 'Tacos', name: 'Al pastor', note: 'Trompo, piña, cilantro y cebolla', price: 325 },
  { id: 'asada', cat: 'Tacos', name: 'Carne asada', note: 'Mesquite, salsa roja on the side', price: 350 },
  { id: 'suadero', cat: 'Tacos', name: 'Suadero', note: 'Slow confit, crisp at the edges', price: 325 },
  { id: 'pescado', cat: 'Tacos', name: 'Pescado', note: 'Battered rockfish, cabbage, crema', price: 375 },
  { id: 'tripa', cat: 'Tacos', name: 'Tripa', note: 'Ask if the plancha is ready', price: 350 },
  { id: 'queso', cat: 'Quesadillas', name: 'Queso fresco', note: 'Hand-pressed tortilla, salsa roja', price: 550 },
  { id: 'flor', cat: 'Quesadillas', name: 'Flor de calabaza', note: 'Squash blossom, epazote, cheese', price: 650 },
  { id: 'chicharron', cat: 'Quesadillas', name: 'Chicharrón prensado', note: 'Pressed pork, salsa verde', price: 675 },
  { id: 'mulita', cat: 'Platillos', name: 'Mulita de asada', note: 'Two tortillas, cheese, meat', price: 750 },
  { id: 'vampiro', cat: 'Platillos', name: 'Vampiro', note: 'Toasted tortilla, asada, avocado', price: 700 },
  { id: 'charros', cat: 'Platillos', name: 'Frijoles charros', note: 'Cup, with bacon and chile', price: 400 },
  { id: 'elote', cat: 'Platillos', name: 'Elote en vaso', note: 'Mayo, cheese, chile, lime', price: 450 },
  { id: 'jamaica', cat: 'Aguas', name: 'Agua de jamaica', note: 'Hibiscus, not too sweet', price: 300 },
  { id: 'horchata', cat: 'Aguas', name: 'Horchata', note: 'Rice, cinnamon, a little almond', price: 300 },
  { id: 'cafe', cat: 'Aguas', name: 'Horchata con café', note: 'The afternoon order', price: 400 }
];

const CATS = ['Todo', 'Tacos', 'Quesadillas', 'Platillos', 'Aguas'];
const KEY = 'timeless-demo-mesa-lena';

const state = load() || { lines: {}, note: '', ticket: null, cat: 'Todo' };

const catsEl = document.getElementById('cats');
const listEl = document.getElementById('menu-list');
const cartEl = document.getElementById('cart');
const navCount = document.getElementById('nav-count');

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!raw || typeof raw !== 'object') return null;
    return {
      lines: raw.lines && typeof raw.lines === 'object' ? raw.lines : {},
      note: typeof raw.note === 'string' ? raw.note : '',
      ticket: raw.ticket || null,
      cat: CATS.includes(raw.cat) ? raw.cat : 'Todo'
    };
  } catch (err) {
    return null;
  }
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* private mode */ }
}

function money(cents) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function count() {
  return Object.values(state.lines).reduce((sum, qty) => sum + qty, 0);
}

function subtotal() {
  return MENU.reduce((sum, item) => sum + item.price * (state.lines[item.id] || 0), 0);
}

function renderCats() {
  catsEl.innerHTML = CATS.map((cat) => (
    `<button type="button" data-cat="${esc(cat)}" aria-pressed="${cat === state.cat ? 'true' : 'false'}">${esc(cat)}</button>`
  )).join('');
}

function renderMenu() {
  const items = MENU.filter((item) => state.cat === 'Todo' || item.cat === state.cat);
  listEl.innerHTML = items.map((item) => {
    const qty = state.lines[item.id] || 0;
    return `<article class="menu-item">
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.note)}</p>
      <span class="price">${money(item.price)}</span>
      <button type="button" class="add" data-add="${esc(item.id)}" data-on="${qty ? 'true' : 'false'}">${qty ? 'Add · ' + qty : 'Add'}</button>
    </article>`;
  }).join('');
}

function renderCart() {
  navCount.textContent = String(count());
  if (state.ticket) {
    const ticket = state.ticket;
    cartEl.innerHTML = `<div class="ticket">
      <p class="cart-kicker">Pickup ticket</p>
      <p class="ticket-no">${esc(ticket.id)}</p>
      <p>Pay at the window. We’ll call the number.</p>
      <ol>${ticket.items.map((item) => `<li>${item.qty} × ${esc(item.name)} — ${money(item.price * item.qty)}</li>`).join('')}</ol>
      ${ticket.note ? `<p>Note: ${esc(ticket.note)}</p>` : ''}
      <p class="totals"><span>Total</span><span>${money(ticket.total)}</span></p>
      <p>Buen provecho.</p>
      <button type="button" class="primary" id="new-order">Start another order</button>
    </div>`;
    return;
  }

  const lines = MENU.filter((item) => state.lines[item.id]);
  if (!lines.length) {
    cartEl.innerHTML = `<p class="cart-kicker">Your ticket</p><h2>Order</h2><p class="cart-empty">Nothing yet. The trompo is already spinning — add a taco.</p>`;
    return;
  }

  cartEl.innerHTML = `<p class="cart-kicker">Your ticket</p><h2>Order</h2>
    ${lines.map((item) => `<div class="line">
      <strong>${esc(item.name)}</strong>
      <span>${money(item.price * state.lines[item.id])}</span>
      <div class="stepper">
        <button type="button" data-dec="${esc(item.id)}" aria-label="Remove one ${esc(item.name)}">−</button>
        <span>${state.lines[item.id]}</span>
        <button type="button" data-add="${esc(item.id)}" aria-label="Add another ${esc(item.name)}">+</button>
        <button type="button" class="text-btn" data-remove="${esc(item.id)}">Remove</button>
      </div>
    </div>`).join('')}
    <label class="note">Note for the window
      <textarea id="order-note" rows="2" maxlength="140" placeholder="Sin cebolla, extra salsa verde…">${esc(state.note)}</textarea>
    </label>
    <p class="totals"><span>Total</span><span>${money(subtotal())}</span></p>
    <button type="button" class="primary" id="place-order">Hold for pickup</button>`;
}

function render() {
  renderCats();
  renderMenu();
  renderCart();
  persist();
}

function add(id) {
  state.ticket = null;
  state.lines[id] = (state.lines[id] || 0) + 1;
  render();
}

document.body.addEventListener('click', (event) => {
  const cat = event.target.closest('[data-cat]');
  const addBtn = event.target.closest('[data-add]');
  const decBtn = event.target.closest('[data-dec]');
  const removeBtn = event.target.closest('[data-remove]');
  if (cat) {
    state.cat = cat.getAttribute('data-cat');
    render();
    return;
  }
  if (addBtn && addBtn.id !== 'place-order') {
    add(addBtn.getAttribute('data-add'));
    return;
  }
  if (decBtn) {
    const id = decBtn.getAttribute('data-dec');
    state.lines[id] = (state.lines[id] || 0) - 1;
    if (state.lines[id] <= 0) delete state.lines[id];
    render();
    return;
  }
  if (removeBtn) {
    delete state.lines[removeBtn.getAttribute('data-remove')];
    render();
    return;
  }
  if (event.target.id === 'place-order') {
    const items = MENU.filter((item) => state.lines[item.id]).map((item) => ({
      name: item.name,
      qty: state.lines[item.id],
      price: item.price
    }));
    if (!items.length) return;
    state.ticket = {
      id: 'ML-' + String(1000 + (Date.now() % 9000)),
      items,
      note: state.note.trim(),
      total: subtotal()
    };
    state.lines = {};
    state.note = '';
    render();
    return;
  }
  if (event.target.id === 'new-order') {
    state.ticket = null;
    render();
  }
});

document.body.addEventListener('input', (event) => {
  if (event.target.id === 'order-note') {
    state.note = event.target.value;
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
