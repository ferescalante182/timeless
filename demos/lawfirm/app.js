'use strict';

const MATTERS = [
  {
    id: 'immigration',
    numeral: '01',
    title: 'Immigration',
    summary: 'Family petitions, visas, citizenship, and removal defense when home is on both sides of the line.',
    questions: [
      { id: 'goal', label: 'What are you hoping to do?', type: 'select', options: ['Family petition', 'Work or investor visa', 'Citizenship', 'Removal defense', 'Not sure yet'] },
      { id: 'deadline', label: 'Is there a deadline?', type: 'text', placeholder: 'A court date, a filing window, or none' }
    ]
  },
  {
    id: 'business',
    numeral: '02',
    title: 'Cross-border business',
    summary: 'Entities, contracts, and disputes for work that does not stay in one country.',
    questions: [
      { id: 'base', label: 'Where is the business based?', type: 'select', options: ['San Diego', 'Tijuana', 'Both', 'Somewhere else'] },
      { id: 'issue', label: 'What needs a lawyer?', type: 'textarea', placeholder: 'A contract, a partner, a payment that never arrived' }
    ]
  },
  {
    id: 'family',
    numeral: '03',
    title: 'Family',
    summary: 'Marriage, custody, and support when the parents do not share a zip code.',
    questions: [
      { id: 'kind', label: 'What kind of family matter?', type: 'select', options: ['Divorce or separation', 'Custody', 'Support', 'Prenup or postnup'] },
      { id: 'children', label: 'Are children involved?', type: 'select', options: ['Yes', 'No'] }
    ]
  },
  {
    id: 'employment',
    numeral: '04',
    title: 'Employment',
    summary: 'Wages, terminations, and workplace problems in either city.',
    questions: [
      { id: 'workplace', label: 'Where is the workplace?', type: 'select', options: ['San Diego', 'Chula Vista', 'Tijuana', 'Other'] },
      { id: 'status', label: 'Are you still employed there?', type: 'select', options: ['Yes', 'No', 'On leave'] }
    ]
  },
  {
    id: 'injury',
    numeral: '05',
    title: 'Injury',
    summary: 'A careful look at crashes and falls. We say no when we are the wrong desk.',
    questions: [
      { id: 'when', label: 'When did it happen?', type: 'text', placeholder: 'A date, or about how long ago' },
      { id: 'city', label: 'Which city?', type: 'text', placeholder: 'San Diego, Tijuana…' },
      { id: 'care', label: 'Have you seen a doctor?', type: 'select', options: ['Yes', 'Not yet', 'Emergency room only'] }
    ]
  }
];

const KEY = 'timeless-demo-albor';
const stored = load();
const state = {
  step: Number.isInteger(stored.step) ? stored.step : 0,
  matter: stored.matter || '',
  answers: stored.answers && typeof stored.answers === 'object' ? stored.answers : {},
  name: stored.name || '',
  email: stored.email || '',
  phone: stored.phone || '',
  city: stored.city || 'San Diego',
  reach: stored.reach || 'phone',
  consent: Boolean(stored.consent),
  error: '',
  ref: stored.ref || ''
};

const list = document.getElementById('practice-list');
const sheet = document.getElementById('sheet');

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

function matter() {
  return MATTERS.find((item) => item.id === state.matter);
}

function renderList() {
  list.innerHTML = MATTERS.map((item) => `<button type="button" class="matter" data-matter="${item.id}">
    <span class="num">${item.numeral}</span>
    <span><strong>${esc(item.title)}</strong><p>${esc(item.summary)}</p></span>
    <span class="start">Start here</span>
  </button>`).join('');
}

function fieldControl(question) {
  if (question.type === 'select' && !state.answers[question.id]) {
    state.answers[question.id] = question.options[0];
  }
  const value = state.answers[question.id] || '';
  if (question.type === 'select') {
    return `<select id="q-${question.id}">${question.options.map((option) => `<option ${value === option ? 'selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
  }
  if (question.type === 'textarea') {
    return `<textarea id="q-${question.id}" rows="3" placeholder="${esc(question.placeholder || '')}">${esc(value)}</textarea>`;
  }
  return `<input id="q-${question.id}" value="${esc(value)}" placeholder="${esc(question.placeholder || '')}">`;
}

function render() {
  persist();
  const current = matter();
  let body = '';
  if (state.step === 4 && state.ref) {
    body = `<p class="progress">Received on this device</p>
      <p class="ref">${esc(state.ref)}</p>
      <p class="hint">Thank you, ${esc(state.name)}. In a working office this would reach a coordinator. Here it stays in your browser and creates no attorney-client relationship.</p>
      <button type="button" class="primary" id="reset">Start another evaluation</button>`;
  } else if (state.step === 0) {
    body = `<p class="progress">Step 1 of 4</p><h2>What do you need help with?</h2><p class="hint">Choose one. You can change it before you finish.</p>
      ${MATTERS.map((item) => `<button type="button" class="choice" data-matter="${item.id}" aria-pressed="${state.matter === item.id ? 'true' : 'false'}">${esc(item.title)}</button>`).join('')}
      <div class="row-actions"><button type="button" class="primary" id="next">Continue</button></div>`;
  } else if (state.step === 1 && current) {
    body = `<p class="progress">Step 2 of 4 · ${esc(current.title)}</p><h2>A few facts</h2><p class="hint">${esc(current.summary)}</p>
      ${current.questions.map((question) => `<label class="field">${esc(question.label)}${fieldControl(question)}</label>`).join('')}
      <div class="row-actions"><button type="button" class="ghost" id="back">Back</button><button type="button" class="primary" id="next">Continue</button></div>`;
  } else if (state.step === 2) {
    body = `<p class="progress">Step 3 of 4</p><h2>How should we reach you?</h2>
      <label class="field">Name<input id="c-name" autocomplete="name" value="${esc(state.name)}"></label>
      <label class="field">Email<input id="c-email" type="email" autocomplete="email" value="${esc(state.email)}"></label>
      <label class="field">Phone<input id="c-phone" type="tel" autocomplete="tel" value="${esc(state.phone)}"></label>
      <label class="field">City
        <select id="c-city">${['San Diego', 'Tijuana', 'Chula Vista', 'Elsewhere'].map((city) => `<option ${state.city === city ? 'selected' : ''}>${city}</option>`).join('')}</select>
      </label>
      <label class="field">Prefer
        <select id="c-reach">
          <option value="phone" ${state.reach === 'phone' ? 'selected' : ''}>A phone call</option>
          <option value="email" ${state.reach === 'email' ? 'selected' : ''}>Email</option>
        </select>
      </label>
      <div class="row-actions"><button type="button" class="ghost" id="back">Back</button><button type="button" class="primary" id="next">Review</button></div>`;
  } else if (current) {
    const answers = current.questions.map((question) => `<div><dt>${esc(question.label)}</dt><dd>${esc(state.answers[question.id] || '—')}</dd></div>`).join('');
    body = `<p class="progress">Step 4 of 4</p><h2>Review</h2>
      <dl class="review">
        <div><dt>Matter</dt><dd>${esc(current.title)}</dd></div>
        ${answers}
        <div><dt>Name</dt><dd>${esc(state.name)}</dd></div>
        <div><dt>Email</dt><dd>${esc(state.email)}</dd></div>
        <div><dt>Phone</dt><dd>${esc(state.phone)}</dd></div>
        <div><dt>City</dt><dd>${esc(state.city)}</dd></div>
        <div><dt>Reach</dt><dd>${state.reach === 'email' ? 'Email' : 'A phone call'}</dd></div>
      </dl>
      <label class="check"><input type="checkbox" id="c-consent" ${state.consent ? 'checked' : ''}> I understand this concept form is not sent to a law office and does not create an attorney-client relationship.</label>
      <div class="row-actions"><button type="button" class="ghost" id="back">Back</button><button type="button" class="primary" id="submit">Submit evaluation</button></div>`;
  }
  sheet.innerHTML = (state.error ? `<p class="error">${esc(state.error)}</p>` : '') + body;
}

function answersComplete() {
  const current = matter();
  if (!current) return false;
  return current.questions.every((question) => String(state.answers[question.id] || '').trim().length > 0);
}

function next() {
  state.error = '';
  if (state.step === 0 && !state.matter) state.error = 'Choose a practice area.';
  else if (state.step === 1 && !answersComplete()) state.error = 'Answer each question so the review is useful.';
  else if (state.step === 2) {
    if (state.name.trim().length < 2) state.error = 'Add your name.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) state.error = 'Add an email address.';
    else if (state.phone.replace(/\D/g, '').length < 7) state.error = 'Add a phone number.';
  }
  if (state.error) { render(); return; }
  state.step += 1;
  render();
  document.getElementById('intake').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.body.addEventListener('click', (event) => {
  const matterBtn = event.target.closest('[data-matter]');
  if (matterBtn && event.target.closest('#practice-list')) {
    state.matter = matterBtn.getAttribute('data-matter');
    state.step = 1;
    state.error = '';
    state.ref = '';
    render();
    document.getElementById('intake').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (matterBtn && event.target.closest('#sheet')) {
    state.matter = matterBtn.getAttribute('data-matter');
    state.error = '';
    render();
    return;
  }
  if (event.target.id === 'next') next();
  if (event.target.id === 'back') {
    state.error = '';
    state.step = Math.max(0, state.step - 1);
    render();
  }
  if (event.target.id === 'submit') {
    state.error = '';
    if (!state.consent) {
      state.error = 'Confirm that you know this form stays on your device.';
      render();
      return;
    }
    state.ref = 'AL-' + String(1000 + (Date.now() % 9000));
    state.step = 4;
    render();
  }
  if (event.target.id === 'reset') {
    state.step = 0;
    state.matter = '';
    state.answers = {};
    state.consent = false;
    state.ref = '';
    state.error = '';
    render();
  }
});

document.body.addEventListener('input', (event) => {
  const id = event.target.id || '';
  if (id.startsWith('q-')) {
    state.answers[id.slice(2)] = event.target.value;
    persist();
  }
  const map = { 'c-name': 'name', 'c-email': 'email', 'c-phone': 'phone', 'c-city': 'city', 'c-reach': 'reach' };
  if (map[id]) {
    state[map[id]] = event.target.value;
    persist();
  }
  if (id === 'c-consent') {
    state.consent = event.target.checked;
    persist();
  }
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const details = link.closest('details');
    if (details && window.matchMedia('(max-width: 720px)').matches) details.open = false;
  });
});

renderList();
render();
