/* ================================================
   Survey 593 — Shared Components
   Notifications, Sidebar, Icons, Helpers
   ================================================ */

window.Survey593 = window.Survey593 || {};

// ====== Icons (inline SVGs) ======
Survey593.Icons = {
  dashboard: '📊', surveys: '📋', wallet: '💰', users: '👥', create: '✏️',
  results: '📈', settings: '⚙️', logout: '🚪', check: '✅', clock: '🕐',
  star: '⭐', money: '💵', alert: '🔔', search: '🔍', filter: '🔽',
  plus: '➕', edit: '✏️', trash: '🗑️', eye: '👁️', download: '📥',
  upload: '📤', link: '🔗', shield: '🛡️', verified: '✓', pending: '⏳',
  close: '✕', menu: '☰', chevron: '›', back: '←', forward: '→',
  home: '🏠', chart: '📉', target: '🎯', gift: '🎁', fire: '🔥',
  trophy: '🏆', heart: '❤️', globe: '🌐', mail: '📧', lock: '🔒',
  user: '👤', company: '🏢', admin: '🔧', question: '❓', info: 'ℹ️',
  success: '✓', error: '✕', warning: '⚠', arrowUp: '↑', arrowDown: '↓',
  billing: '💳', quality: '✨', ecosystem: '🌱', streak: '🔥'
};

// ====== Toast Notifications ======
Survey593.Toast = (() => {
  function init() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  }

  function show(type, title, message, duration = 4000) {
    init();
    const container = document.getElementById('toast-container');
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ'}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <span class="toast-close" onclick="this.parentElement.classList.add('removing');setTimeout(()=>this.parentElement.remove(),300)">✕</span>
    `;
    container.appendChild(toast);
    if (duration > 0) {
      setTimeout(() => {
        if (toast.parentElement) {
          toast.classList.add('removing');
          setTimeout(() => toast.remove(), 300);
        }
      }, duration);
    }
  }

  return {
    success: (title, msg) => show('success', title, msg),
    error: (title, msg) => show('error', title, msg),
    warning: (title, msg) => show('warning', title, msg),
    info: (title, msg) => show('info', title, msg)
  };
})();

// ====== Sidebar ======
Survey593.Sidebar = (() => {
  const menuConfig = {
    doer: {
      title: 'Encuestado',
      sections: [
        { title: 'Principal', items: [
          { id: 'doer-dashboard', icon: '📊', label: 'Dashboard', route: '#/doer' },
          { id: 'doer-surveys', icon: '📋', label: 'Encuestas', route: '#/doer/surveys', badge: null },
          { id: 'doer-wallet', icon: '💰', label: 'Mi Wallet', route: '#/doer/wallet' },
        ]},
        { title: 'Cuenta', items: [
          { id: 'doer-profile', icon: '👤', label: 'Mi Perfil', route: '#/doer/profile' },
          { id: 'doer-verification', icon: '🛡️', label: 'Verificación', route: '#/doer/verification' },
        ]}
      ]
    },
    provider: {
      title: 'Empresa',
      sections: [
        { title: 'Panel', items: [
          { id: 'prov-dashboard', icon: '📊', label: 'Dashboard', route: '#/provider' },
          { id: 'prov-create', icon: '✏️', label: 'Crear Encuesta', route: '#/provider/create' },
          { id: 'prov-campaigns', icon: '📋', label: 'Mis Campañas', route: '#/provider/campaigns' },
        ]},
        { title: 'Análisis', items: [
          { id: 'prov-results', icon: '📈', label: 'Resultados', route: '#/provider/results' },
          { id: 'prov-billing', icon: '💳', label: 'Facturación', route: '#/provider/billing' },
        ]}
      ]
    },
    admin: {
      title: 'Admin Kolab',
      sections: [
        { title: 'Gestión', items: [
          { id: 'admin-dashboard', icon: '📊', label: 'Dashboard', route: '#/admin' },
          { id: 'admin-users', icon: '👥', label: 'Usuarios', route: '#/admin/users' },
          { id: 'admin-surveys', icon: '📋', label: 'Encuestas', route: '#/admin/surveys' },
        ]},
        { title: 'Sistema', items: [
          { id: 'admin-quality', icon: '✨', label: 'Calidad de Datos', route: '#/admin/quality' },
          { id: 'admin-ecosystem', icon: '🌱', label: 'Ecosistema', route: '#/admin/ecosystem' },
        ]}
      ]
    }
  };

  function render(user) {
    if (!user) return '';
    const config = menuConfig[user.role];
    if (!config) return '';

    const currentHash = window.location.hash || '#/';
    const initials = user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const unreadCount = Survey593.DB.count('notifications', n => n.userId === user.id && !n.read);

    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">S5</div>
          <div class="sidebar-brand">
            <h3>Survey 593</h3>
            <span>${config.title}</span>
          </div>
        </div>
        <nav class="sidebar-nav">
          ${config.sections.map(section => `
            <div class="nav-section">
              <div class="nav-section-title">${section.title}</div>
              ${section.items.map(item => {
                const isActive = currentHash === item.route || 
                  (item.route !== '#/doer' && item.route !== '#/provider' && item.route !== '#/admin' && currentHash.startsWith(item.route));
                return `
                  <a class="nav-item ${isActive ? 'active' : ''}" href="${item.route}" data-nav="${item.id}">
                    <span class="nav-icon">${item.icon}</span>
                    <span>${item.label}</span>
                    ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                  </a>
                `;
              }).join('')}
            </div>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          ${unreadCount > 0 ? `
            <div class="nav-item mb-sm" style="color:var(--warning)">
              <span class="nav-icon">🔔</span>
              <span>Notificaciones</span>
              <span class="nav-badge">${unreadCount}</span>
            </div>
          ` : ''}
          <div class="sidebar-user" onclick="Survey593.Auth.logout()">
            <div class="avatar" style="background:${user.avatarColor || 'var(--primary)'}">${initials}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${user.name}</div>
              <div class="sidebar-user-role">Cerrar sesión</div>
            </div>
          </div>
        </div>
      </aside>
      <div class="sidebar-overlay" id="sidebar-overlay" onclick="Survey593.Sidebar.toggle()"></div>
      <button class="mobile-menu-btn" id="mobile-menu-btn" onclick="Survey593.Sidebar.toggle()">☰</button>
    `;
  }

  function toggle() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  }

  function updateActive(hash) {
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.getAttribute('href');
      if (!href) return;
      const isActive = hash === href || (href.length > 6 && hash.startsWith(href));
      item.classList.toggle('active', isActive);
    });
  }

  return { render, toggle, updateActive };
})();

// ====== Charts Helper ======
Survey593.Charts = (() => {
  const palette = ['#0D9488','#6366F1','#F59E0B','#EF4444','#8B5CF6','#EC4899','#10B981','#3B82F6','#F97316','#14B8A6'];

  function bar(canvasId, labels, data, label = 'Respuestas') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label, data, backgroundColor: palette.slice(0, labels.length).map(c => c + '99'), borderColor: palette.slice(0, labels.length), borderWidth: 1, borderRadius: 6, barPercentage: 0.7 }]
      },
      options: chartOptions(label)
    });
  }

  function doughnut(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: palette.slice(0, labels.length), borderColor: 'transparent', borderWidth: 0, hoverOffset: 8 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8', padding: 16, font: { family: 'Inter', size: 12 }, usePointStyle: true, pointStyle: 'circle' } } } }
    });
  }

  function line(canvasId, labels, datasets) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    const colors = [palette[0], palette[1], palette[4]];
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map((ds, i) => ({
          label: ds.label, data: ds.data, borderColor: colors[i], backgroundColor: colors[i] + '20',
          tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: colors[i], pointBorderColor: '#1E293B', pointBorderWidth: 2
        }))
      },
      options: chartOptions()
    });
  }

  function horizontalBar(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data, backgroundColor: palette.slice(0, labels.length).map(c => c + '99'), borderColor: palette.slice(0, labels.length), borderWidth: 1, borderRadius: 6, barPercentage: 0.6 }]
      },
      options: { ...chartOptions(), indexAxis: 'y' }
    });
  }

  function chartOptions(title) {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#334155', titleFont: { family: 'Inter' }, bodyFont: { family: 'Inter' }, cornerRadius: 8, padding: 12 }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } }, beginAtZero: true }
      }
    };
  }

  return { bar, doughnut, line, horizontalBar, palette };
})();

// ====== Modal Helper ======
Survey593.Modal = (() => {
  function show(title, bodyHtml, footerHtml = '') {
    let overlay = document.getElementById('modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modal-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" onclick="Survey593.Modal.hide()">✕</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>
    `;
    overlay.onclick = (e) => { if (e.target === overlay) Survey593.Modal.hide(); };
    requestAnimationFrame(() => overlay.classList.add('active'));
  }

  function hide() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
  }

  return { show, hide };
})();

// ====== Utility Helpers ======
Survey593.Utils = {
  formatCurrency: (amount) => '$' + Math.abs(amount).toFixed(2),
  formatDate: (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
  },
  formatRelative: (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
  },
  getInitials: (name) => name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
  truncate: (str, len = 80) => str && str.length > len ? str.substring(0, len) + '...' : str,
  percentage: (part, total) => total > 0 ? Math.round((part / total) * 100) : 0,
  animateValue: (el, start, end, duration = 1000) => {
    const range = end - start;
    const startTime = performance.now();
    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + range * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
};
