/* ==========================================
   Coffee Tea Cacao Expo — Exhibitor Portal
   Shared JS: auth, nav, toast, utils
   ========================================== */

// ---- Storage helpers ----
const Store = {
  get: (key, def = null) => {
    try { return JSON.parse(localStorage.getItem('ep_' + key)) ?? def; }
    catch { return def; }
  },
  set: (key, val) => localStorage.setItem('ep_' + key, JSON.stringify(val)),
  remove: (key) => localStorage.removeItem('ep_' + key),
};

// ---- Auth ----
const Auth = {
  getUser: () => Store.get('user'),
  isLoggedIn: () => !!Store.get('user'),
  login: (user) => {
    Store.set('user', user);
    Auth.log('login', 'Вход в систему');
  },
  logout: () => {
    Auth.log('logout', 'Выход из системы');
    Store.remove('user');
    window.location.href = 'index.html';
  },
  requireAuth: () => {
    if (!Auth.isLoggedIn()) window.location.href = 'index.html';
  },
  requireAdmin: () => {
    const u = Auth.getUser();
    if (!u || u.role !== 'admin') window.location.href = 'dashboard.html';
  },
  log: (action, detail) => {
    const logs = Store.get('logs', []);
    logs.unshift({
      ts: new Date().toISOString(),
      action,
      detail,
      user: Auth.getUser()?.email || 'system',
    });
    if (logs.length > 500) logs.splice(500);
    Store.set('logs', logs);
  },
};

// ---- Toast notifications ----
const Toast = {
  container: null,
  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(msg, type = 'info', duration = 3500) {
    this.init();
    const t = document.createElement('div');
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    t.className = `toast ${type}`;
    t.innerHTML = `<span style="font-size:16px">${icons[type] || 'ℹ'}</span><span>${msg}</span>`;
    this.container.appendChild(t);
    setTimeout(() => {
      t.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => t.remove(), 300);
    }, duration);
  },
};

// ---- Nav builder ----
function buildNav(activePage) {
  const user = Auth.getUser();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { href: 'dashboard.html', label: 'Главная', page: 'dashboard', icon: `<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 3.293l6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/><path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708z"/></svg>` },
    { href: 'stand.html', label: 'Информация о стенде', page: 'stand', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>` },
    { href: 'construction.html', label: 'Тип застройки', page: 'construction', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>` },
    { href: 'catalog.html', label: 'Информация в каталог', page: 'catalog', icon: `<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/><path fill-rule="evenodd" d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1z"/></svg>` },
    { href: 'badges.html', label: 'Бейджи экспонента', page: 'badges', icon: `<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/></svg>` },
    { href: 'materials.html', label: 'Формы и документы', page: 'materials', icon: `<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path fill-rule="evenodd" d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/></svg>` },
    { href: 'issues.html', label: 'Проблемы на стенде', page: 'issues', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` },
    { href: 'faq.html', label: 'FAQ', page: 'faq', icon: `<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/></svg>` },
    { href: 'contacts.html', label: 'Контакты', page: 'contacts', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>` },
  ];

  if (isAdmin) {
    navItems.push({ divider: true });
    navItems.push({ href: 'admin.html', label: 'Администрирование', page: 'admin', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>` });
  }

  navItems.push({ divider: true });
  navItems.push({ href: 'settings.html', label: 'Настройки аккаунта', page: 'settings', icon: `<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364z"/></svg>` });

  const userInfo = user ? `
    <div class="user-info">
      <span class="label">Пользователь</span>
      <span class="value">${escHtml(user.company || user.name || user.email)}</span>
      ${user.standNumber ? `<span class="label">Номер стенда</span><span class="value">${escHtml(user.standNumber)}</span>` : ''}
      ${user.exhibition ? `<span class="label">Выставка</span><span class="value">${escHtml(user.exhibition)}</span>` : ''}
      ${user.hall ? `<span class="label">Зал</span><span class="value">${escHtml(user.hall)}</span>` : ''}
    </div>
  ` : '';

  const items = navItems.map(item => {
    if (item.divider) return '<li><div class="divider"></div></li>';
    const active = item.page === activePage ? ' active' : '';
    return `<li><a href="${item.href}" class="${active}">${item.icon}<span>${item.label}</span></a></li>`;
  }).join('');

  return `
    <div class="sidebar-card">
      ${userInfo}
      <ul class="sidebar-nav">${items}</ul>
    </div>
  `;
}

// ---- Header builder ----
function buildHeader(title) {
  return `
    <div class="header-inner">
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Меню">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <a href="dashboard.html" class="logo" style="text-decoration:none;">
          <img src="https://exhibitors.pro/themes/new-exhibitors-portal/assets/ex/assets/img/coffee-tea-cacao-horeca-expo-logo.jpg" alt="Coffee Tea Cacao Expo" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
          <span style="display:none;font-weight:700;font-size:16px;color:#212529;">☕ CTC Expo</span>
        </a>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        ${title ? `<span style="font-size:13px;color:#666;display:none;" class="d-md-block">${escHtml(title)}</span>` : ''}
        <button onclick="Auth.logout()" class="btn btn-outline btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Выход
        </button>
      </div>
    </div>
  `;
}

// ---- Footer builder ----
function buildFooter() {
  return `
    <div class="footer-inner">
      <div>
        <img src="https://exhibitors.pro/themes/new-exhibitors-portal/assets/ex/assets/img/coffee-tea-cacao-horeca-expo-logo.jpg" height="46" alt="CTC Expo" style="margin-bottom:12px;" onerror="this.style.display='none'">
        <p class="copyright">© 2024 ООО Международный Дом Чая<br>Все права защищены.</p>
      </div>
      <div>
        <div class="footer-title">Coffee Tea Cacao Expo & HORECA Expo</div>
        <a href="https://coffeeteacacaoexpo.ru" target="_blank" style="display:block;margin-bottom:6px;">→ Сайт Coffee Tea Cacao Expo</a>
        <a href="https://expohoreca.ru" target="_blank" style="display:block;">→ Сайт HORECA Expo</a>
      </div>
      <div>
        <div class="footer-title">Портал экспонентов</div>
        <p style="font-size:13px;line-height:1.6;">Личный кабинет для подготовки участия в выставке. Заполняйте формы, управляйте бейджами и отслеживайте дедлайны.</p>
      </div>
    </div>
  `;
}

// ---- Init page ----
function initPage(options = {}) {
  const { activePage = '', title = '', requireAuth = true, requireAdmin = false } = options;

  if (requireAuth) Auth.requireAuth();
  if (requireAdmin) Auth.requireAdmin();

  // Header
  const header = document.getElementById('header');
  if (header) header.innerHTML = buildHeader(title);

  // Sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = buildNav(activePage);

  // Footer
  const footer = document.getElementById('footer');
  if (footer) footer.innerHTML = buildFooter();

  // Mobile menu toggle
  setTimeout(() => {
    const btn = document.getElementById('mobileMenuBtn');
    const overlay = document.getElementById('mobileOverlay');
    const sidebarEl = document.getElementById('sidebar');
    if (btn && sidebarEl) {
      btn.addEventListener('click', () => {
        sidebarEl.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebarEl?.classList.remove('open');
        overlay.classList.remove('open');
      });
    }
  }, 50);

  // PWA install
  initPWA();
}

// ---- PWA ----
let deferredPrompt = null;
function initPWA() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = document.getElementById('installBanner');
    if (banner && !localStorage.getItem('pwa_dismissed')) banner.style.display = 'flex';
  });
}

function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
  dismissInstallBanner();
}

function dismissInstallBanner() {
  const banner = document.getElementById('installBanner');
  if (banner) banner.style.display = 'none';
  localStorage.setItem('pwa_dismissed', '1');
}

// ---- Utils ----
function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('ru-RU');
}

function downloadCSV(data, filename) {
  if (!data.length) { Toast.show('Нет данных для выгрузки', 'warning'); return; }
  const headers = Object.keys(data[0]);
  const rows = [headers.join(';'), ...data.map(r => headers.map(h => `"${String(r[h]||'').replace(/"/g,'""')}"`).join(';'))];
  const blob = new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function isDeadlinePassed(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

function isDeadlineClose(dateStr, days = 7) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d > now && (d - now) < days * 86400000;
}

// ---- Demo data seeding ----
function seedDemoData() {
  if (!Store.get('seeded')) {
    // Create admin user
    const users = [
      { id: 'admin', email: 'admin@expo.ru', password: 'admin123', name: 'Администратор', role: 'admin', company: 'Оргкомитет', active: true, created: new Date().toISOString() },
      { id: 'u1', email: 'demo@expo.ru', password: 'demo123', name: 'Иван Петров', role: 'exhibitor', company: 'Coffee Tea Cacao', standNumber: 'A0', exhibition: 'Coffee Tea Cacao Expo', hall: 'Чаянов', active: true, created: new Date().toISOString(), activationCode: null },
    ];
    Store.set('users', users);

    // Date limits
    Store.set('deadlines', {
      catalog: '2026-02-27',
      construction: '2026-03-15',
      badges: '2026-04-06',
      items: '2026-02-27',
    });

    Store.set('seeded', true);
  }
}

// ---- Run on load ----
document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();

  // Register SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
