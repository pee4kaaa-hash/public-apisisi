'use strict';

const $ = (sel) => document.querySelector(sel);

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* приватный режим */ }
  },
};

const state = {
  data: null,
  q: '',
  cat: 'all',
  nokey: false,
  tryable: false,
  fav: false,
  todo: false,
  favs: new Set(store.get('med-favs', [])),
  learned: new Set(store.get('med-learned', [])),
};

// Поиск без учёта регистра и разницы «е/ё».
const norm = (s) => s.toLowerCase().replace(/ё/g, 'е');

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

// Подсвечивает совпадения, не ломая HTML: ищем по нормализованной строке,
// а вырезаем из исходной (длина строки при замене ё→е не меняется).
function highlight(text, q) {
  if (!q) return escapeHtml(text);
  const hay = norm(text);
  let out = '';
  let pos = 0;
  let i = hay.indexOf(q);
  while (i !== -1) {
    out += escapeHtml(text.slice(pos, i)) + '<mark>' + escapeHtml(text.slice(i, i + q.length)) + '</mark>';
    pos = i + q.length;
    i = hay.indexOf(q, pos);
  }
  return out + escapeHtml(text.slice(pos));
}

// `код` в заметках из markdown превращаем в <code>.
const inlineCode = (s) => escapeHtml(s).replace(/`([^`]+)`/g, '<code>$1</code>');

const slug = (name) => 'api-' + norm(name).replace(/[^a-z0-9а-я]+/g, '-').replace(/^-|-$/g, '');

function matches(api) {
  if (state.cat !== 'all' && api.category !== state.cat) return false;
  if (state.nokey && api.key) return false;
  if (state.tryable && !api.example) return false;
  if (state.fav && !state.favs.has(api.name)) return false;
  if (state.todo && state.learned.has(api.name)) return false;
  if (state.q && !norm(api.name + ' ' + api.description).includes(state.q)) return false;
  return true;
}

function card(api) {
  const fav = state.favs.has(api.name);
  const done = state.learned.has(api.name);
  return `
    <article class="card${done ? ' done' : ''}" id="${slug(api.name)}">
      <div class="card-head">
        <a href="${escapeHtml(api.url)}" target="_blank" rel="noopener">${highlight(api.name, state.q)}</a>
        ${api.key
          ? '<span class="badge key" title="Нужна бесплатная регистрация">ключ</span>'
          : '<span class="badge free">без ключа</span>'}
      </div>
      <p>${highlight(api.description, state.q)}</p>
      <div class="card-actions">
        ${api.example ? `<button class="btn" data-act="try" data-name="${escapeHtml(api.name)}">▶ Попробовать</button>` : ''}
        <button class="btn fav" data-act="fav" data-name="${escapeHtml(api.name)}" aria-pressed="${fav}">${fav ? '★ В избранном' : '☆ В избранное'}</button>
        <button class="btn learn" data-act="learn" data-name="${escapeHtml(api.name)}" aria-pressed="${done}">${done ? '✓ Изучено' : '○ Изучено'}</button>
      </div>
    </article>`;
}

function render() {
  const { data } = state;
  const visible = data.apis.filter(matches);

  let html = '';
  for (const cat of data.categories) {
    const items = visible.filter((a) => a.category === cat.id);
    if (!items.length) continue;
    html += `<h3 class="cat">${escapeHtml(cat.name)}</h3><div class="cards">${items.map(card).join('')}</div>`;
  }
  $('#list').innerHTML = html;
  $('#empty').hidden = visible.length > 0;
  $('#count').textContent = `Показано ${visible.length} из ${data.apis.length}`;

  const learned = data.apis.filter((a) => state.learned.has(a.name)).length;
  $('#bar').style.width = `${(learned / data.apis.length) * 100}%`;
  $('#progress-text').textContent = `Изучено ${learned} из ${data.apis.length}`;

  for (const btn of document.querySelectorAll('#cats .chip')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.cat === state.cat));
  }
  syncUrl();
}

// Состояние фильтров живёт в адресе: ссылкой можно поделиться с одногруппниками.
function syncUrl() {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.cat !== 'all') p.set('cat', state.cat);
  for (const f of ['nokey', 'tryable', 'fav', 'todo']) if (state[f]) p.set(f, '1');
  const qs = p.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

function readUrl() {
  const p = new URLSearchParams(location.search);
  state.q = norm(p.get('q') || '');
  state.cat = p.get('cat') || 'all';
  if (state.cat !== 'all' && !state.data.categories.some((c) => c.id === state.cat)) state.cat = 'all';
  for (const f of ['nokey', 'tryable', 'fav', 'todo']) state[f] = p.get(f) === '1';
}

function toggleIn(set, key, name) {
  if (set.has(name)) set.delete(name); else set.add(name);
  store.set(key, [...set]);
}

function showApi(name) {
  // Снимаем фильтры, которые могут скрыть нужную карточку.
  Object.assign(state, { q: '', cat: 'all', nokey: false, tryable: false, fav: false, todo: false });
  $('#q').value = '';
  syncControls();
  render();
  const el = document.getElementById(slug(name));
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

function syncControls() {
  $('#f-nokey').checked = state.nokey;
  $('#f-try').checked = state.tryable;
  $('#f-fav').checked = state.fav;
  $('#f-todo').checked = state.todo;
}

/* ---------- Режим «Попробовать» ---------- */

let current = null;
let controller = null;

function openTry(api) {
  current = api;
  $('#try-title').textContent = api.name;
  $('#try-label').textContent = api.example.label;
  $('#try-url').textContent = api.example.url;
  $('#try-open').href = api.example.url;
  $('#try-out').hidden = true;
  $('#try-out').textContent = '';
  $('#try-run').hidden = !api.example.cors;
  $('#try-status').textContent = api.example.cors
    ? 'Запрос уйдёт напрямую из вашего браузера.'
    : 'Этот сервис не разрешает запросы со сторонних сайтов — откройте ссылку в новой вкладке.';
  $('#try').showModal();
}

async function runTry() {
  if (!current) return;
  if (controller) controller.abort();
  controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  const started = performance.now();
  $('#try-status').textContent = 'Загрузка…';
  $('#try-out').hidden = true;

  try {
    const res = await fetch(current.example.url, { signal: controller.signal });
    const text = await res.text();
    const ms = Math.round(performance.now() - started);
    let body = text;
    try { body = JSON.stringify(JSON.parse(text), null, 2); } catch (e) { /* не JSON */ }
    if (body.length > 20000) body = body.slice(0, 20000) + '\n… (ответ обрезан)';
    $('#try-out').textContent = body;
    $('#try-out').hidden = false;
    $('#try-status').textContent = res.status === 429
      ? `429 — сервис просит подождать (лимит запросов). Попробуйте через минуту. ${ms} мс`
      : `Ответ ${res.status} ${res.statusText} за ${ms} мс`;
  } catch (e) {
    $('#try-status').textContent = e.name === 'AbortError'
      ? 'Сервис не ответил за 25 секунд. Откройте ссылку в новой вкладке.'
      : 'Не удалось выполнить запрос (нет сети или сервис недоступен). Откройте ссылку в новой вкладке.';
  } finally {
    clearTimeout(timer);
  }
}

async function copyUrl() {
  if (!current) return;
  try {
    await navigator.clipboard.writeText(current.example.url);
    $('#try-status').textContent = 'URL скопирован.';
  } catch (e) {
    $('#try-status').textContent = 'Не удалось скопировать — выделите адрес выше вручную.';
  }
}

/* ---------- Тема ---------- */

const THEMES = ['auto', 'light', 'dark'];
const THEME_ICON = { auto: '⚙', light: '☀', dark: '☾' };
const THEME_NAME = { auto: 'авто', light: 'светлая', dark: 'тёмная' };

function applyTheme(theme) {
  if (theme === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  const btn = $('#theme');
  btn.textContent = `${THEME_ICON[theme]} ${THEME_NAME[theme]}`;
  btn.title = `Тема: ${THEME_NAME[theme]}`;
  try { localStorage.setItem('med-theme', theme); } catch (e) { /* ignore */ }
}

function currentTheme() {
  try {
    const t = localStorage.getItem('med-theme');
    return THEMES.includes(t) ? t : 'auto';
  } catch (e) {
    return 'auto';
  }
}

/* ---------- Запуск ---------- */

function bind() {
  let timer;
  $('#q').addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.q = norm(e.target.value.trim()); render(); }, 120);
  });

  $('#cats').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    state.cat = btn.dataset.cat;
    render();
  });

  for (const [id, key] of [['#f-nokey', 'nokey'], ['#f-try', 'tryable'], ['#f-fav', 'fav'], ['#f-todo', 'todo']]) {
    $(id).addEventListener('change', (e) => { state[key] = e.target.checked; render(); });
  }

  $('#list').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const api = state.data.apis.find((a) => a.name === btn.dataset.name);
    if (!api) return;
    if (btn.dataset.act === 'try') openTry(api);
    if (btn.dataset.act === 'fav') { toggleIn(state.favs, 'med-favs', api.name); render(); }
    if (btn.dataset.act === 'learn') { toggleIn(state.learned, 'med-learned', api.name); render(); }
  });

  $('#start').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-name]');
    if (btn) showApi(btn.dataset.name);
  });

  $('#try-run').addEventListener('click', runTry);
  $('#try-copy').addEventListener('click', copyUrl);
  $('#try').addEventListener('close', () => { if (controller) controller.abort(); });
  // Клик по затемнённому фону вокруг окна закрывает его.
  $('#try').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });

  $('#theme').addEventListener('click', () => {
    const next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
    applyTheme(next);
  });

  // «/» — быстрый переход к поиску, Esc — очистить поиск.
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); $('#q').focus(); }
    if (e.key === 'Escape' && document.activeElement === $('#q') && $('#q').value) {
      $('#q').value = '';
      state.q = '';
      render();
    }
  });
}

function renderStatic() {
  const { data } = state;
  $('#start').innerHTML = data.start.map((s) =>
    `<button type="button" data-name="${escapeHtml(s.api)}">${escapeHtml(s.task)}<b>${escapeHtml(s.api)}</b></button>`).join('');
  $('#cats').innerHTML = [{ id: 'all', name: 'Все' }, ...data.categories].map((c) =>
    `<button type="button" class="chip" data-cat="${c.id}">${escapeHtml(c.name)}</button>`).join('');
  $('#notes').innerHTML = data.notes.map((n) => `<p>${inlineCode(n)}</p>`).join('');
}

async function init() {
  applyTheme(currentTheme());
  try {
    const res = await fetch('data.json', { cache: 'no-cache' });
    state.data = await res.json();
  } catch (e) {
    $('#list').innerHTML = '<p class="empty">Не удалось загрузить список. Проверьте подключение и обновите страницу.</p>';
    return;
  }
  readUrl();
  $('#q').value = state.q;
  syncControls();
  renderStatic();
  bind();
  render();
}

init();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => { /* офлайн-режим необязателен */ });
}
