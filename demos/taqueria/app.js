'use strict';

const TOPPINGS = {
  onion: 'Onion',
  cilantro: 'Cilantro',
  verde: 'Salsa verde',
  roja: 'Salsa roja',
  lime: 'Lime',
  radish: 'Radishes',
  pina: 'Piña',
  cabbage: 'Cabbage',
  crema: 'Crema',
  epazote: 'Epazote',
  chile: 'Chile',
  mayo: 'Mayonnaise',
  queso: 'Cheese',
  cinnamon: 'Cinnamon',
  avocado: 'Avocado'
};

const ADDONS = {
  guac: { name: 'Guacamole', price: 150 },
  cheese: { name: 'Extra cheese', price: 100 },
  meat: { name: 'Extra meat', price: 175 },
  bacon: { name: 'Extra bacon', price: 125 },
  chile: { name: 'Extra chile', price: 50 },
  large: { name: 'Large', price: 100 },
  cafe: { name: 'Extra café', price: 75 }
};

const FLOUR = 50;
const MEATS = [
  { id: 'asada', name: 'Carne asada', price: 0 },
  { id: 'pastor', name: 'Al pastor', price: 0 },
  { id: 'suadero', name: 'Suadero', price: 0 }
];
const QUESO_MEATS = [
  { id: 'none', name: 'Cheese only', price: 0 },
  { id: 'asada', name: 'Carne asada', price: 175 },
  { id: 'pastor', name: 'Al pastor', price: 175 },
  { id: 'suadero', name: 'Suadero', price: 175 }
];

const MENU = [
  {
    id: 'pastor', cat: 'Tacos', name: 'Al pastor', note: 'Trompo, piña, cilantro y cebolla', price: 325, tortilla: true,
    toppings: [['pina', true], ['onion', true], ['cilantro', true], ['verde', false], ['roja', false], ['lime', true], ['radish', false]],
    addons: ['guac', 'cheese', 'meat']
  },
  {
    id: 'asada', cat: 'Tacos', name: 'Carne asada', note: 'Mesquite, salsa roja on the side', price: 350, tortilla: true,
    toppings: [['onion', true], ['cilantro', true], ['roja', true], ['verde', false], ['lime', true], ['radish', false]],
    addons: ['guac', 'cheese', 'meat']
  },
  {
    id: 'suadero', cat: 'Tacos', name: 'Suadero', note: 'Slow confit, crisp at the edges', price: 325, tortilla: true,
    toppings: [['onion', true], ['cilantro', true], ['verde', true], ['roja', false], ['lime', true], ['radish', false]],
    addons: ['guac', 'cheese', 'meat']
  },
  {
    id: 'pescado', cat: 'Tacos', name: 'Pescado', note: 'Battered rockfish, cabbage, crema', price: 375, tortilla: true,
    toppings: [['cabbage', true], ['crema', true], ['lime', true], ['verde', false], ['roja', false], ['onion', false], ['cilantro', false]],
    addons: ['guac', 'cheese', 'meat'],
    addonNames: { meat: 'Extra fish' }
  },
  {
    id: 'tripa', cat: 'Tacos', name: 'Tripa', note: 'Ask if the plancha is ready', price: 350, tortilla: true,
    toppings: [['onion', true], ['cilantro', true], ['verde', true], ['roja', false], ['lime', true], ['radish', false]],
    addons: ['guac', 'cheese', 'meat']
  },
  {
    id: 'queso', cat: 'Quesadillas', name: 'Queso fresco', note: 'Hand-pressed tortilla, salsa roja', price: 550, tortilla: true,
    proteins: QUESO_MEATS,
    toppings: [['roja', true], ['verde', false], ['onion', false], ['cilantro', false], ['lime', false]],
    addons: ['guac', 'cheese', 'meat']
  },
  {
    id: 'flor', cat: 'Quesadillas', name: 'Flor de calabaza', note: 'Squash blossom, epazote, cheese', price: 650, tortilla: true,
    proteins: QUESO_MEATS,
    toppings: [['epazote', true], ['verde', false], ['roja', false], ['onion', false], ['lime', false]],
    addons: ['guac', 'cheese', 'meat']
  },
  {
    id: 'chicharron', cat: 'Quesadillas', name: 'Chicharrón prensado', note: 'Pressed pork, salsa verde', price: 675, tortilla: true,
    toppings: [['verde', true], ['roja', false], ['onion', false], ['cilantro', false], ['lime', true]],
    addons: ['guac', 'cheese', 'meat'],
    addonNames: { meat: 'Extra chicharrón' }
  },
  {
    id: 'mulita', cat: 'Platillos', name: 'Mulita de asada', note: 'Two tortillas, cheese, meat', price: 750, tortilla: true,
    proteins: MEATS,
    toppings: [['onion', true], ['cilantro', true], ['roja', false], ['verde', false], ['lime', true]],
    addons: ['guac', 'cheese', 'meat']
  },
  {
    id: 'vampiro', cat: 'Platillos', name: 'Vampiro', note: 'Toasted tortilla, asada, avocado', price: 700, tortilla: true,
    proteins: MEATS,
    toppings: [['avocado', true], ['onion', true], ['cilantro', true], ['roja', false], ['lime', true]],
    addons: ['guac', 'cheese', 'meat']
  },
  {
    id: 'charros', cat: 'Platillos', name: 'Frijoles charros', note: 'Cup, with bacon and chile', price: 400,
    toppings: [['onion', true], ['cilantro', true], ['chile', false], ['lime', true]],
    addons: ['bacon', 'cheese']
  },
  {
    id: 'elote', cat: 'Platillos', name: 'Elote en vaso', note: 'Mayo, cheese, chile, lime', price: 450,
    toppings: [['mayo', true], ['queso', true], ['chile', true], ['lime', true]],
    addons: ['cheese', 'chile']
  },
  {
    id: 'jamaica', cat: 'Aguas', name: 'Agua de jamaica', note: 'Hibiscus, not too sweet', price: 300, drink: true,
    toppings: [['lime', false]],
    addons: ['large']
  },
  {
    id: 'horchata', cat: 'Aguas', name: 'Horchata', note: 'Rice, cinnamon, a little almond', price: 300, drink: true,
    toppings: [['cinnamon', true]],
    addons: ['large']
  },
  {
    id: 'cafe', cat: 'Aguas', name: 'Horchata con café', note: 'The afternoon order', price: 400, drink: true,
    toppings: [['cinnamon', true]],
    addons: ['cafe', 'large']
  }
];

const CATS = ['Todo', 'Tacos', 'Quesadillas', 'Platillos', 'Aguas'];
const KEY = 'timeless-demo-mesa-lena';

const catsEl = document.getElementById('cats');
const listEl = document.getElementById('menu-list');
const cartEl = document.getElementById('cart');
const navCount = document.getElementById('nav-count');
const customizer = document.getElementById('customizer');
const panel = document.getElementById('customizer-panel');

let draftItem = null;
let lastFocus = null;

function byId(id) {
  return MENU.find((item) => item.id === id) || null;
}

function makeId() {
  return 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function clampQty(value) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(12, n));
}

function money(cents) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function plus(cents) {
  return cents ? '+' + money(cents) : 'Included';
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function addonName(item, id) {
  if (item.addonNames && item.addonNames[id]) return item.addonNames[id];
  return ADDONS[id].name;
}

function defaultDraft(item) {
  const toppings = {};
  (item.toppings || []).forEach(([id, on]) => { toppings[id] = !!on; });
  const addons = {};
  (item.addons || []).forEach((id) => { addons[id] = false; });
  return {
    id: item.id,
    qty: 1,
    tortilla: item.tortilla ? 'corn' : null,
    protein: item.proteins ? item.proteins[0].id : null,
    toppings,
    addons,
    note: '',
    sweetness: item.drink ? 'regular' : null,
    ice: item.drink ? true : null
  };
}

function sanitizeLine(line) {
  const item = line && byId(line.id);
  if (!item) return null;
  const draft = defaultDraft(item);
  if (line.toppings && typeof line.toppings === 'object') {
    Object.keys(draft.toppings).forEach((id) => {
      if (typeof line.toppings[id] === 'boolean') draft.toppings[id] = line.toppings[id];
    });
  }
  if (line.addons && typeof line.addons === 'object') {
    Object.keys(draft.addons).forEach((id) => {
      if (line.addons[id] === true) draft.addons[id] = true;
    });
  }
  if (item.tortilla && (line.tortilla === 'corn' || line.tortilla === 'flour')) draft.tortilla = line.tortilla;
  if (item.proteins && item.proteins.some((protein) => protein.id === line.protein)) draft.protein = line.protein;
  if (item.drink && (line.sweetness === 'regular' || line.sweetness === 'less')) draft.sweetness = line.sweetness;
  if (item.drink && typeof line.ice === 'boolean') draft.ice = line.ice;
  draft.qty = clampQty(line.qty);
  draft.note = typeof line.note === 'string' ? line.note.slice(0, 140).trim() : '';
  draft.uid = typeof line.uid === 'string' && line.uid ? line.uid : makeId();
  return draft;
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!raw || typeof raw !== 'object') return null;
    let lines = [];
    if (Array.isArray(raw.lines)) lines = raw.lines.map(sanitizeLine).filter(Boolean);
    else if (raw.lines && typeof raw.lines === 'object') {
      lines = Object.entries(raw.lines).map(([id, qty]) => {
        const item = byId(id);
        const n = parseInt(qty, 10);
        if (!item || !n || n < 1) return null;
        const line = defaultDraft(item);
        line.qty = clampQty(n);
        line.uid = makeId();
        return line;
      }).filter(Boolean);
    }
    return {
      lines,
      ticket: raw.ticket && typeof raw.ticket === 'object' ? raw.ticket : null,
      cat: CATS.includes(raw.cat) ? raw.cat : 'Todo'
    };
  } catch (err) {
    return null;
  }
}

const state = load() || { lines: [], ticket: null, cat: 'Todo' };

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* private mode */ }
}

function unitPrice(line) {
  const item = byId(line.id);
  if (!item) return 0;
  let cents = item.price;
  if (item.tortilla && line.tortilla === 'flour') cents += FLOUR;
  if (item.proteins && line.protein) {
    const protein = item.proteins.find((entry) => entry.id === line.protein);
    if (protein) cents += protein.price;
  }
  (item.addons || []).forEach((id) => {
    if (line.addons && line.addons[id] && ADDONS[id]) cents += ADDONS[id].price;
  });
  return cents;
}

function count() {
  return state.lines.reduce((sum, line) => sum + line.qty, 0);
}

function subtotal() {
  return state.lines.reduce((sum, line) => sum + unitPrice(line) * line.qty, 0);
}

function qtyOf(id) {
  return state.lines.reduce((sum, line) => sum + (line.id === id ? line.qty : 0), 0);
}

function describe(line) {
  const item = byId(line.id);
  const choice = [];
  const withs = [];
  const withouts = [];
  const adds = [];
  if (!item) return { choice, withs, withouts, adds, note: '' };
  if (item.tortilla) choice.push(line.tortilla === 'flour' ? 'Flour tortilla' : 'Corn tortilla');
  if (item.proteins && line.protein && line.protein !== 'none') {
    const protein = item.proteins.find((entry) => entry.id === line.protein);
    if (protein) choice.push(protein.name);
  }
  if (item.drink) {
    choice.push(line.sweetness === 'less' ? 'Less sweet' : 'Regular');
    choice.push(line.ice === false ? 'No ice' : 'Ice');
  }
  (item.toppings || []).forEach(([id, included]) => {
    const on = !!(line.toppings && line.toppings[id]);
    if (on) withs.push(TOPPINGS[id]);
    else if (included) withouts.push(TOPPINGS[id]);
  });
  (item.addons || []).forEach((id) => {
    if (line.addons && line.addons[id]) adds.push(addonName(item, id));
  });
  return { choice, withs, withouts, adds, note: (line.note || '').trim() };
}

function detailLines(info) {
  const lines = [];
  if (info.choice.length) lines.push(info.choice.join(' · '));
  if (info.withs.length) lines.push('With ' + info.withs.join(', '));
  if (info.withouts.length) lines.push('No ' + info.withouts.join(', '));
  if (info.adds.length) lines.push('+ ' + info.adds.join(', '));
  if (info.note) lines.push('“' + info.note + '”');
  return lines;
}

function detailHtml(line) {
  return detailLines(describe(line)).map((text) => {
    const className = text.charAt(0) === '“' ? 'line-note' : 'line-detail';
    return `<p class="${className}">${esc(text)}</p>`;
  }).join('');
}

function renderCats() {
  catsEl.innerHTML = CATS.map((cat) => (
    `<button type="button" data-cat="${esc(cat)}" aria-pressed="${cat === state.cat ? 'true' : 'false'}">${esc(cat)}</button>`
  )).join('');
}

function renderMenu() {
  const items = MENU.filter((item) => state.cat === 'Todo' || item.cat === state.cat);
  listEl.innerHTML = items.map((item) => {
    const qty = qtyOf(item.id);
    return `<article class="menu-item" data-open="${esc(item.id)}">
      <button type="button" class="item-hit" data-open="${esc(item.id)}">
        <span class="item-name">${esc(item.name)}</span>
        <span class="item-note">${esc(item.note)}</span>
      </button>
      <span class="price">${money(item.price)}</span>
      <button type="button" class="add" data-open="${esc(item.id)}" data-on="${qty ? 'true' : 'false'}">${qty ? 'Customize · ' + qty : 'Customize'}</button>
    </article>`;
  }).join('');
}

function renderTicket(ticket) {
  const items = (ticket.items || []).map((item) => {
    const unit = Number.isFinite(item.unit) ? item.unit : item.price;
    const extra = Array.isArray(item.lines) ? item.lines.map((text) => `<span class="ticket-detail">${esc(text)}</span>`).join('') : '';
    return `<li>${item.qty} × ${esc(item.name)} — ${money(unit * item.qty)}${extra}</li>`;
  }).join('');
  cartEl.innerHTML = `<div class="ticket">
    <p class="cart-kicker">Pickup ticket</p>
    <p class="ticket-no">${esc(ticket.id)}</p>
    <p>Pay at the window. We’ll call the number. This confirmation stays on your phone.</p>
    <ol>${items}</ol>
    ${ticket.note ? `<p>Note: ${esc(ticket.note)}</p>` : ''}
    <p class="totals"><span>Total</span><span>${money(ticket.total)}</span></p>
    <p>Buen provecho.</p>
    <button type="button" class="primary" id="new-order">Start another order</button>
  </div>`;
}

function renderCart() {
  navCount.textContent = String(count());
  if (state.ticket) {
    renderTicket(state.ticket);
    return;
  }
  if (!state.lines.length) {
    cartEl.innerHTML = `<p class="cart-kicker">Your ticket</p><h2>Order</h2><p class="cart-empty">Nothing yet. Tap Customize and tell the plancha how you want it.</p>`;
    return;
  }
  cartEl.innerHTML = `<p class="cart-kicker">Your ticket</p><h2>Order</h2>
    ${state.lines.map((line) => {
      const item = byId(line.id);
      if (!item) return '';
      return `<div class="line">
        <strong>${esc(item.name)}</strong>
        <span>${money(unitPrice(line) * line.qty)}</span>
        ${detailHtml(line)}
        <div class="stepper">
          <button type="button" data-line-dec="${esc(line.uid)}" aria-label="Remove one ${esc(item.name)}">−</button>
          <span>${line.qty}</span>
          <button type="button" data-line-inc="${esc(line.uid)}" aria-label="Add another ${esc(item.name)}">+</button>
          <button type="button" class="text-btn" data-line-remove="${esc(line.uid)}">Remove</button>
        </div>
      </div>`;
    }).join('')}
    <p class="totals"><span>Total</span><span>${money(subtotal())}</span></p>
    <button type="button" class="primary" id="place-order">Hold for pickup</button>`;
}

function render() {
  renderCats();
  renderMenu();
  renderCart();
  persist();
}

function choiceGroup(legend, hint, name, choices, selected) {
  const radios = choices.map((choice) => {
    const checked = choice.id === selected ? ' checked' : '';
    return `<label class="option"><input type="radio" name="${esc(name)}" value="${esc(choice.id)}"${checked}><span>${esc(choice.name)}</span><span class="opt-price">${esc(choice.priceLabel)}</span></label>`;
  }).join('');
  return `<fieldset><legend>${esc(legend)}</legend>${hint ? `<p class="field-hint">${esc(hint)}</p>` : ''}<div class="options">${radios}</div></fieldset>`;
}

function checkGroup(legend, hint, choices) {
  const boxes = choices.map((choice) => {
    const checked = choice.checked ? ' checked' : '';
    return `<label class="option"><input type="checkbox" name="${esc(choice.inputName)}"${checked}><span>${esc(choice.name)}</span><span class="opt-price">${esc(choice.priceLabel)}</span></label>`;
  }).join('');
  return `<fieldset><legend>${esc(legend)}</legend>${hint ? `<p class="field-hint">${esc(hint)}</p>` : ''}<div class="options">${boxes}</div></fieldset>`;
}

function customizerMarkup(item, draft) {
  let groups = '';
  if (item.tortilla) {
    groups += choiceGroup('Tortilla', 'Pressed while you order.', 'tortilla', [
      { id: 'corn', name: 'Corn', priceLabel: 'Included' },
      { id: 'flour', name: 'Flour', priceLabel: plus(FLOUR) }
    ], draft.tortilla);
  }
  if (item.proteins) {
    groups += choiceGroup('Protein', '', 'protein', item.proteins.map((protein) => ({
      id: protein.id,
      name: protein.name,
      priceLabel: plus(protein.price)
    })), draft.protein);
  }
  if (item.drink) {
    groups += choiceGroup('The cup', '', 'sweetness', [
      { id: 'regular', name: 'Regular', priceLabel: 'Included' },
      { id: 'less', name: 'Less sweet', priceLabel: 'Included' }
    ], draft.sweetness);
    groups += checkGroup('Ice', '', [{
      name: 'Ice',
      priceLabel: 'Included',
      checked: draft.ice !== false,
      inputName: 'ice'
    }]);
  }
  if (item.toppings && item.toppings.length) {
    groups += checkGroup(item.drink ? 'Finish' : 'On it', item.drink ? 'Checked means it goes in.' : 'Checked means it goes on. Uncheck to hold it.', item.toppings.map(([id, included]) => ({
      name: TOPPINGS[id],
      priceLabel: included ? 'Usual' : 'If you want it',
      checked: !!draft.toppings[id],
      inputName: 'top-' + id
    })));
  }
  if (item.addons && item.addons.length) {
    groups += checkGroup('Add-ons', 'These change the price.', item.addons.map((id) => ({
      name: addonName(item, id),
      priceLabel: plus(ADDONS[id].price),
      checked: !!draft.addons[id],
      inputName: 'add-' + id
    })));
  }
  return `<div class="customizer-head">
      <p class="eyebrow">${esc(item.cat)}</p>
      <h2 id="customizer-title">${esc(item.name)}</h2>
      <p class="item-note">${esc(item.note)}</p>
      <button type="button" class="customizer-close" data-close aria-label="Close">×</button>
    </div>
    <form id="customizer-form">
      ${groups}
      <label class="note">A note for the plancha
        <textarea name="note" rows="2" maxlength="140" autocomplete="off" placeholder="Sin cebolla, well done, salsa on the side…"></textarea>
      </label>
      <div class="customizer-actions">
        <p class="customizer-live" id="customizer-live" aria-live="polite"></p>
        <div class="stepper">
          <button type="button" data-qty="-1" aria-label="Fewer">−</button>
          <input name="qty" type="number" inputmode="numeric" min="1" max="12" value="${draft.qty}" aria-label="Quantity">
          <button type="button" data-qty="1" aria-label="More">+</button>
        </div>
        <button type="submit" class="primary" id="customizer-submit">Add to ticket</button>
      </div>
    </form>`;
}

function readDraft(form, item) {
  const draft = defaultDraft(item);
  draft.qty = clampQty(form.elements.qty.value);
  draft.note = String(form.elements.note.value || '').slice(0, 140);
  if (item.tortilla) draft.tortilla = form.elements.tortilla.value === 'flour' ? 'flour' : 'corn';
  if (item.proteins) {
    const picked = form.elements.protein.value;
    if (item.proteins.some((protein) => protein.id === picked)) draft.protein = picked;
  }
  (item.toppings || []).forEach(([id]) => {
    const input = form.elements['top-' + id];
    draft.toppings[id] = !!(input && input.checked);
  });
  (item.addons || []).forEach((id) => {
    const input = form.elements['add-' + id];
    draft.addons[id] = !!(input && input.checked);
  });
  if (item.drink) {
    draft.sweetness = form.elements.sweetness.value === 'less' ? 'less' : 'regular';
    draft.ice = !!(form.elements.ice && form.elements.ice.checked);
  }
  return draft;
}

function paintPrice(line) {
  const live = document.getElementById('customizer-live');
  const submit = document.getElementById('customizer-submit');
  if (!live || !submit) return;
  const each = unitPrice(line);
  const total = each * line.qty;
  live.textContent = line.qty === 1 ? money(each) : line.qty + ' × ' + money(each);
  submit.textContent = 'Add to ticket · ' + money(total);
}

function openCustomizer(id) {
  const item = byId(id);
  if (!item) return;
  draftItem = item;
  lastFocus = document.activeElement;
  const draft = defaultDraft(item);
  panel.innerHTML = customizerMarkup(item, draft);
  customizer.hidden = false;
  document.body.classList.add('modal-open');
  paintPrice(draft);
  panel.focus();
}

function closeCustomizer() {
  if (customizer.hidden) return;
  customizer.hidden = true;
  document.body.classList.remove('modal-open');
  panel.innerHTML = '';
  draftItem = null;
  const focus = lastFocus;
  lastFocus = null;
  if (focus && typeof focus.focus === 'function') focus.focus();
}

function signature(line) {
  return JSON.stringify({
    id: line.id,
    tortilla: line.tortilla,
    protein: line.protein,
    toppings: line.toppings,
    addons: line.addons,
    note: (line.note || '').trim(),
    sweetness: line.sweetness,
    ice: line.ice
  });
}

function addLine(line) {
  line.note = (line.note || '').trim();
  line.qty = clampQty(line.qty);
  const existing = state.lines.find((item) => signature(item) === signature(line));
  if (existing) existing.qty = clampQty(existing.qty + line.qty);
  else {
    line.uid = makeId();
    state.lines.push(line);
  }
  state.ticket = null;
  closeCustomizer();
  render();
  if (window.matchMedia('(max-width: 900px)').matches) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    cartEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}

function changeQty(uid, delta) {
  const index = state.lines.findIndex((line) => line.uid === uid);
  if (index < 0) return;
  const next = state.lines[index].qty + delta;
  if (next < 1) state.lines.splice(index, 1);
  else state.lines[index].qty = Math.min(12, next);
  render();
}

function placeOrder() {
  if (!state.lines.length) return;
  state.ticket = {
    id: 'ML-' + String(1000 + (Date.now() % 9000)),
    items: state.lines.map((line) => ({
      name: byId(line.id).name,
      qty: line.qty,
      unit: unitPrice(line),
      lines: detailLines(describe(line))
    })),
    total: subtotal()
  };
  state.lines = [];
  render();
}

customizer.addEventListener('click', (event) => {
  if (event.target.closest('[data-close]')) {
    event.preventDefault();
    closeCustomizer();
    return;
  }
  const step = event.target.closest('[data-qty]');
  if (!step || !draftItem) return;
  const form = customizer.querySelector('form');
  const input = form.elements.qty;
  const current = parseInt(input.value, 10);
  const base = Number.isFinite(current) ? current : 1;
  input.value = String(clampQty(base + Number(step.getAttribute('data-qty'))));
  paintPrice(readDraft(form, draftItem));
});

customizer.addEventListener('input', () => {
  if (customizer.hidden || !draftItem) return;
  const form = customizer.querySelector('form');
  if (form) paintPrice(readDraft(form, draftItem));
});

customizer.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!draftItem) return;
  addLine(readDraft(event.target, draftItem));
});

document.addEventListener('keydown', (event) => {
  if (customizer.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeCustomizer();
    return;
  }
  if (event.key !== 'Tab') return;
  const nodes = [...customizer.querySelectorAll('button, input, textarea')].filter((el) => !el.disabled);
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.body.addEventListener('click', (event) => {
  if (event.target.closest('#customizer')) return;
  const cat = event.target.closest('[data-cat]');
  const opener = event.target.closest('[data-open]');
  const dec = event.target.closest('[data-line-dec]');
  const inc = event.target.closest('[data-line-inc]');
  const remove = event.target.closest('[data-line-remove]');
  if (cat) {
    state.cat = cat.getAttribute('data-cat');
    render();
    return;
  }
  if (opener) {
    openCustomizer(opener.getAttribute('data-open'));
    return;
  }
  if (dec) {
    changeQty(dec.getAttribute('data-line-dec'), -1);
    return;
  }
  if (inc) {
    changeQty(inc.getAttribute('data-line-inc'), 1);
    return;
  }
  if (remove) {
    state.lines = state.lines.filter((line) => line.uid !== remove.getAttribute('data-line-remove'));
    render();
    return;
  }
  if (event.target.id === 'place-order') {
    placeOrder();
    return;
  }
  if (event.target.id === 'new-order') {
    state.ticket = null;
    render();
  }
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const details = link.closest('details');
    if (details && window.matchMedia('(max-width: 900px)').matches) details.open = false;
  });
});

render();
