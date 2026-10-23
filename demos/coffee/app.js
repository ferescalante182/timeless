'use strict';

const PRODUCTS = [
  { id: 'fog', name: 'Border Fog', origin: 'House blend', notes: 'Cacao, pan dulce, soft citrus', price: 1800, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=70' },
  { id: 'oaxaca', name: 'Oaxaca Pluma', origin: 'Pluma Hidalgo', notes: 'Brown sugar, almond, cocoa husk', price: 2200, img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=70' },
  { id: 'chiapas', name: 'Chiapas Highlands', origin: 'Sierra Madre', notes: 'Red apple, honey, a clean finish', price: 2000, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=70' },
  { id: 'huatulco', name: 'Huatulco Lavado', origin: 'Oaxaca coast', notes: 'Orange peel and cane sugar', price: 2100, img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=70' },
  { id: 'sidama', name: 'Sidama Natural', origin: 'Ethiopia', notes: 'Blueberry, jasmine, cocoa', price: 2400, img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=70' },
  { id: 'mug', name: 'Heavy stoneware mug', origin: 'Thrown in Tijuana', notes: '12 oz, sand glaze, no logo', price: 2800, img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=70' }
];

const KEY = 'timeless-demo-humo';
const stored = load();
const state = {
  cart: stored.cart && typeof stored.cart === 'object' ? stored.cart : {},
  order: stored.order || null
};

const productsEl = document.getElementById('products');
const cartEl = document.getElementById('cart');
const navCount = document.getElementById('nav-count');
const checkout = document.getElementById('checkout');
const confirmEl = document.getElementById('confirm');
const summary = document.getElementById('checkout-summary');
const shop = document.getElementById('shop');

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return raw && typeof raw === 'object' ? raw : {};
  } catch (err) {
    return {};
  }
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({ cart: state.cart, order: state.order })); } catch (err) { /* ignore */ }
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function money(cents) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function lines() {
  return PRODUCTS.filter((item) => state.cart[item.id]).map((item) => ({ ...item, qty: state.cart[item.id] }));
}

function total() {
  return lines().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function count() {
  return Object.values(state.cart).reduce((sum, qty) => sum + qty, 0);
}

function renderProducts() {
  productsEl.innerHTML = PRODUCTS.map((item) => `<article class="product">
    <img src="${esc(item.img)}" alt="" width="600" height="600">
    <div>
      <p class="origin">${esc(item.origin)}</p>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.notes)}</p>
    </div>
    <div>
      <p>${money(item.price)}</p>
      <button type="button" data-add="${item.id}">Add</button>
    </div>
  </article>`).join('');
}

function renderCart() {
  navCount.textContent = String(count());
  const items = lines();
  if (!items.length) {
    cartEl.innerHTML = '<h2>Cart</h2><p class="hint">The bag is empty. Start with Border Fog if you want the house cup.</p>';
    return;
  }
  cartEl.innerHTML = `<h2>Cart</h2>
    ${items.map((item) => `<div class="line"><span>${esc(item.name)}</span><span>${money(item.price * item.qty)}</span>
      <div class="stepper">
        <button type="button" data-dec="${item.id}" aria-label="Decrease ${esc(item.name)}">−</button>
        <span>${item.qty}</span>
        <button type="button" data-add="${item.id}" aria-label="Increase ${esc(item.name)}">+</button>
      </div>
    </div>`).join('')}
    <p class="totals"><span>Total</span><span>${money(total())}</span></p>
    <button type="button" class="solid" id="to-checkout">Checkout</button>
    <button type="button" class="ghost" id="close-cart">Close</button>`;
}

function renderSummary() {
  const items = lines();
  summary.innerHTML = `<div class="summary-box"><h2>Your order</h2>
    ${items.map((item) => `<p>${item.qty} × ${esc(item.name)} <span style="float:right">${money(item.price * item.qty)}</span></p>`).join('') || '<p>Your cart is empty.</p>'}
    <p class="totals"><span>Due at pickup</span><span>${money(total())}</span></p></div>`;
}

function showOrder() {
  if (!state.order) {
    confirmEl.hidden = true;
    return;
  }
  const order = state.order;
  shop.hidden = true;
  checkout.hidden = true;
  confirmEl.hidden = false;
  confirmEl.innerHTML = `<p class="origin">Pickup order</p><h2>${esc(order.id)}</h2>
    <p>${esc(order.name)} · ${esc(order.pickup)}</p>
    <p>${esc(order.when)} · ${esc(order.pay)}</p>
    <ul>${order.items.map((item) => `<li>${item.qty} × ${esc(item.name)}</li>`).join('')}</ul>
    <p class="totals"><span>Total</span><span>${money(order.total)}</span></p>
    <p class="hint">Saved on this device. Nothing was charged.</p>
    <button type="button" class="solid" id="new-order">Shop again</button>`;
}

function render() {
  renderProducts();
  renderCart();
  renderSummary();
  if (state.order) showOrder();
  persist();
}

function add(id) {
  state.order = null;
  confirmEl.hidden = true;
  shop.hidden = false;
  state.cart[id] = (state.cart[id] || 0) + 1;
  render();
}

document.body.addEventListener('click', (event) => {
  const addBtn = event.target.closest('[data-add]');
  const decBtn = event.target.closest('[data-dec]');
  if (addBtn) { add(addBtn.getAttribute('data-add')); return; }
  if (decBtn) {
    const id = decBtn.getAttribute('data-dec');
    state.cart[id] = (state.cart[id] || 0) - 1;
    if (state.cart[id] <= 0) delete state.cart[id];
    render();
    return;
  }
  if (event.target.id === 'to-checkout') {
    if (!lines().length) return;
    checkout.hidden = false;
    shop.hidden = true;
    confirmEl.hidden = true;
    cartEl.classList.remove('is-open');
    renderSummary();
    checkout.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (event.target.id === 'back-shop') {
    checkout.hidden = true;
    shop.hidden = false;
  }
  if (event.target.id === 'open-cart') {
    cartEl.classList.toggle('is-open');
    if (window.matchMedia('(max-width: 860px)').matches) {
      shop.hidden = false;
      checkout.hidden = true;
    }
  }
  if (event.target.id === 'close-cart') cartEl.classList.remove('is-open');
  if (event.target.id === 'new-order') {
    state.order = null;
    state.cart = {};
    confirmEl.hidden = true;
    shop.hidden = false;
    render();
  }
});

document.getElementById('checkout-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const error = document.getElementById('check-error');
  if (!lines().length) {
    error.hidden = false;
    error.textContent = 'Add something to the cart before checking out.';
    return;
  }
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.replace(/\D/g, '').length < 7) {
    error.hidden = false;
    error.textContent = 'Name, email, and phone — then the order is held for pickup.';
    return;
  }
  error.hidden = true;
  state.order = {
    id: 'HL-' + String(1000 + (Date.now() % 9000)),
    name,
    email,
    phone,
    pickup: data.get('pickup'),
    when: data.get('when'),
    pay: data.get('pay'),
    items: lines().map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
    total: total()
  };
  state.cart = {};
  render();
  confirmEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const details = link.closest('details');
    if (details && window.matchMedia('(max-width: 860px)').matches) details.open = false;
  });
});

render();
