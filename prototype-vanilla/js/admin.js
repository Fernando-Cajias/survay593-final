/* ================================================
   Survey 593 — Admin Panel (Kolab Administrator)
   Dashboard, User Management, Data Quality
   ================================================ */

window.Survey593 = window.Survey593 || {};

Survey593.Admin = (() => {
  const DB = () => Survey593.DB;
  const Utils = () => Survey593.Utils;
  const Toast = () => Survey593.Toast;

  // ====== Dashboard ======
  function renderDashboard() {
    const totalUsers = DB().count('users');
    const doers = DB().count('users', u => u.role === 'doer');
    const providers = DB().count('users', u => u.role === 'provider');
    const totalSurveys = DB().count('surveys');
    const activeSurveys = DB().count('surveys', s => s.status === 'active');
    const totalResponses = DB().count('responses');
    const verifiedUsers = DB().count('users', u => u.verified);
    const totalTransactions = DB().getAll('transactions').filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    // User registration by role
    const usersByRole = { 'Encuestados': doers, 'Empresas': providers, 'Admin': DB().count('users', u => u.role === 'admin') };
    // Survey status
    const surveyStatus = { 'Activas': activeSurveys, 'Borrador': DB().count('surveys', s => s.status === 'draft'), 'Finalizadas': DB().count('surveys', s => s.status === 'completed') };
    // Responses per day (simulated)
    const days = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const dailyResp = days.map(() => Math.floor(Math.random() * 12) + 2);

    return `
      <div class="page">
        <div class="page-header">
          <div><h1 class="page-title">Panel Administrativo 🔧</h1><p class="page-subtitle">Ecosistema Kolab · Survey 593</p></div>
          <button class="btn btn-outline btn-sm" onclick="Survey593.Admin.resetSystem()">🔄 Reset Demo</button>
        </div>

        <div class="grid grid-4">
          <div class="kpi-card animate-in">
            <div class="kpi-header"><div><div class="kpi-value">${totalUsers}</div><div class="kpi-label">Usuarios Totales</div></div><div class="kpi-icon">👥</div></div>
            <div class="kpi-change up">↑ ${doers} encuestados, ${providers} empresas</div>
          </div>
          <div class="kpi-card accent-secondary animate-in animate-delay-1">
            <div class="kpi-header"><div><div class="kpi-value">${totalSurveys}</div><div class="kpi-label">Encuestas</div></div><div class="kpi-icon">📋</div></div>
            <div class="kpi-change up">${activeSurveys} activas</div>
          </div>
          <div class="kpi-card accent-success animate-in animate-delay-2">
            <div class="kpi-header"><div><div class="kpi-value">${totalResponses}</div><div class="kpi-label">Respuestas Verificadas</div></div><div class="kpi-icon">📊</div></div>
          </div>
          <div class="kpi-card accent-warning animate-in animate-delay-3">
            <div class="kpi-header"><div><div class="kpi-value">$${totalTransactions.toFixed(0)}</div><div class="kpi-label">Dinero Distribuido</div></div><div class="kpi-icon">💰</div></div>
          </div>
        </div>

        <div class="grid grid-3 mt-lg">
          <div class="chart-card animate-in animate-delay-1">
            <div class="chart-card-header"><span class="chart-card-title">Usuarios por Rol</span></div>
            <div style="height:240px"><canvas id="admin-chart-users"></canvas></div>
          </div>
          <div class="chart-card animate-in animate-delay-2">
            <div class="chart-card-header"><span class="chart-card-title">Estado de Encuestas</span></div>
            <div style="height:240px"><canvas id="admin-chart-surveys"></canvas></div>
          </div>
          <div class="chart-card animate-in animate-delay-3">
            <div class="chart-card-header"><span class="chart-card-title">Respuestas Diarias</span></div>
            <div style="height:240px"><canvas id="admin-chart-daily"></canvas></div>
          </div>
        </div>

        <div class="grid grid-2 mt-lg">
          <div>
            <div class="flex justify-between items-center mb-md"><h3>Usuarios Recientes</h3><a href="#/admin/users" class="btn btn-ghost btn-sm">Ver todos →</a></div>
            <div class="card">
              ${DB().getAll('users').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map(u => `
                <div class="transaction-item">
                  <div class="avatar" style="background:${u.avatarColor}">${Utils().getInitials(u.name)}</div>
                  <div class="transaction-info">
                    <div class="transaction-name">${u.name}</div>
                    <div class="transaction-date">${u.email} · ${Utils().formatRelative(u.createdAt)}</div>
                  </div>
                  <span class="badge badge-${u.role==='doer'?'primary':u.role==='provider'?'secondary':'warning'}">${u.role==='doer'?'Encuestado':u.role==='provider'?'Empresa':'Admin'}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div>
            <h3 class="mb-md">Métricas del Ecosistema 🌱</h3>
            <div class="card">
              <div class="transaction-item">
                <div class="transaction-icon income">✓</div>
                <div class="transaction-info"><div class="transaction-name">Tasa de Verificación</div><div class="transaction-date">${Utils().percentage(verifiedUsers, totalUsers)}% usuarios verificados</div></div>
                <span class="font-bold">${verifiedUsers}/${totalUsers}</span>
              </div>
              <div class="transaction-item">
                <div class="transaction-icon" style="background:var(--secondary-50);color:var(--secondary)">📊</div>
                <div class="transaction-info"><div class="transaction-name">Promedio Resp/Encuesta</div><div class="transaction-date">Engagement del ecosistema</div></div>
                <span class="font-bold">${totalSurveys ? (totalResponses / totalSurveys).toFixed(1) : 0}</span>
              </div>
              <div class="transaction-item">
                <div class="transaction-icon" style="background:var(--warning-50);color:var(--warning)">💰</div>
                <div class="transaction-info"><div class="transaction-name">Pago Promedio/Usuario</div><div class="transaction-date">Rentabilidad del encuestado</div></div>
                <span class="font-bold">$${doers ? (totalTransactions / doers).toFixed(2) : '0.00'}</span>
              </div>
              <div class="transaction-item">
                <div class="transaction-icon" style="background:var(--success-50);color:var(--success)">🛡️</div>
                <div class="transaction-info"><div class="transaction-name">Integridad de Datos</div><div class="transaction-date">Derechos ARCO+ cumplidos</div></div>
                <span class="badge badge-success">Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function initDashboardCharts() {
    const doers = DB().count('users', u => u.role === 'doer');
    const providers = DB().count('users', u => u.role === 'provider');
    const admins = DB().count('users', u => u.role === 'admin');
    Survey593.Charts.doughnut('admin-chart-users', ['Encuestados','Empresas','Admin'], [doers, providers, admins]);

    const active = DB().count('surveys', s => s.status === 'active');
    const draft = DB().count('surveys', s => s.status === 'draft');
    const completed = DB().count('surveys', s => s.status === 'completed');
    Survey593.Charts.doughnut('admin-chart-surveys', ['Activas','Borrador','Finalizadas'], [active, draft, completed || 0]);

    const days = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    Survey593.Charts.bar('admin-chart-daily', days, days.map(() => Math.floor(Math.random() * 12) + 2));
  }

  // ====== User Management ======
  function renderUsers() {
    const users = DB().getAll('users').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return `
      <div class="page">
        <div class="page-header">
          <div><h1 class="page-title">Gestión de Usuarios 👥</h1><p class="page-subtitle">${users.length} usuarios registrados</p></div>
        </div>

        <div class="card mb-lg" style="padding:16px">
          <div class="flex gap-md items-center flex-wrap">
            <div class="search-input" style="flex:1;min-width:200px">
              <span class="search-icon">🔍</span>
              <input type="text" class="form-input" id="user-search" placeholder="Buscar por nombre o email..." oninput="Survey593.Admin.searchUsers()" style="padding-left:40px">
            </div>
            <select class="form-input" id="user-role-filter" style="width:180px" onchange="Survey593.Admin.searchUsers()">
              <option value="">Todos los roles</option>
              <option value="doer">Encuestados</option>
              <option value="provider">Empresas</option>
              <option value="admin">Admin</option>
            </select>
            <select class="form-input" id="user-verified-filter" style="width:180px" onchange="Survey593.Admin.searchUsers()">
              <option value="">Verificación</option>
              <option value="true">Verificados</option>
              <option value="false">No verificados</option>
            </select>
          </div>
        </div>

        <div class="table-container" id="users-table-container">
          ${renderUsersTable(users)}
        </div>
      </div>
    `;
  }

  function renderUsersTable(users) {
    return `
      <table class="table">
        <thead><tr><th>Usuario</th><th>Rol</th><th>Verificado</th><th>Balance</th><th>Registro</th><th>Acciones</th></tr></thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td>
                <div class="cell-user">
                  <div class="avatar avatar-sm" style="background:${u.avatarColor}">${Utils().getInitials(u.name)}</div>
                  <div><div class="font-semibold">${u.name}</div><div class="text-xs text-muted">${u.email}</div></div>
                </div>
              </td>
              <td><span class="badge badge-${u.role==='doer'?'primary':u.role==='provider'?'secondary':'warning'}">${u.role==='doer'?'Encuestado':u.role==='provider'?'Empresa':'Admin'}</span></td>
              <td>${u.verified ? '<span class="badge badge-success badge-dot">Sí</span>' : '<span class="badge badge-error badge-dot">No</span>'}</td>
              <td>$${(u.balance || 0).toFixed(2)}</td>
              <td class="text-sm text-muted">${Utils().formatDate(u.createdAt)}</td>
              <td>
                <div class="flex gap-sm">
                  ${!u.verified ? `<button class="btn btn-ghost btn-sm" onclick="Survey593.Admin.verifyUser('${u.id}')" title="Verificar">✓</button>` : ''}
                  ${u.role !== 'admin' ? `<button class="btn btn-ghost btn-sm" onclick="Survey593.Admin.toggleUser('${u.id}')" title="Suspender" style="color:var(--warning)">⚠</button>` : ''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function searchUsers() {
    const search = (document.getElementById('user-search')?.value || '').toLowerCase();
    const roleFilter = document.getElementById('user-role-filter')?.value || '';
    const verifiedFilter = document.getElementById('user-verified-filter')?.value || '';
    let users = DB().getAll('users');
    if (search) users = users.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
    if (roleFilter) users = users.filter(u => u.role === roleFilter);
    if (verifiedFilter) users = users.filter(u => String(u.verified) === verifiedFilter);
    document.getElementById('users-table-container').innerHTML = renderUsersTable(users);
  }

  function verifyUser(userId) {
    DB().update('users', userId, { verified: true });
    Toast().success('Usuario verificado', 'La identidad ha sido verificada.');
    searchUsers();
  }

  function toggleUser(userId) {
    const user = DB().getById('users', userId);
    Survey593.Modal.show('⚠️ Confirmar Acción', `
      <p>¿Estás seguro de que quieres suspender a <strong>${user.name}</strong>?</p>
      <p class="text-sm text-muted mt-sm">El usuario no podrá acceder al sistema temporalmente.</p>
    `, `
      <button class="btn btn-outline" onclick="Survey593.Modal.hide()">Cancelar</button>
      <button class="btn btn-danger" onclick="Survey593.Modal.hide();Survey593.Toast.success('Usuario suspendido','${user.name} ha sido suspendido.')">Suspender</button>
    `);
  }

  // ====== Surveys Management ======
  function renderSurveys() {
    const surveys = DB().getAll('surveys').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return `
      <div class="page">
        <div class="page-header"><div><h1 class="page-title">Gestión de Encuestas 📋</h1><p class="page-subtitle">${surveys.length} encuestas en el sistema</p></div></div>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Encuesta</th><th>Empresa</th><th>Estado</th><th>Respuestas</th><th>Recompensa</th><th>Fecha</th></tr></thead>
            <tbody>
              ${surveys.map(s => {
                const prov = DB().getById('users', s.providerId);
                return `<tr>
                  <td><div class="font-semibold">${Utils().truncate(s.title, 35)}</div><div class="text-xs text-muted">${s.category}</div></td>
                  <td>${prov ? prov.company || prov.name : 'N/A'}</td>
                  <td><span class="badge badge-${s.status==='active'?'success':s.status==='draft'?'warning':'neutral'} badge-dot">${s.status}</span></td>
                  <td>${s.actualResponses}/${s.targetResponses}</td>
                  <td>$${s.rewardPerResponse.toFixed(2)}</td>
                  <td class="text-sm text-muted">${Utils().formatDate(s.createdAt)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ====== Data Quality ======
  function renderQuality() {
    const responses = DB().getAll('responses');
    const verified = responses.filter(r => r.verified).length;
    const totalUsers = DB().count('users');
    const verifiedUsers = DB().count('users', u => u.verified);
    return `
      <div class="page">
        <div class="page-header"><div><h1 class="page-title">Calidad de Datos ✨</h1><p class="page-subtitle">Métricas de confiabilidad del ecosistema</p></div></div>
        <div class="grid grid-3 mb-lg">
          <div class="kpi-card accent-success animate-in"><div class="kpi-value">${Utils().percentage(verified, responses.length)}%</div><div class="kpi-label">Respuestas Verificadas</div></div>
          <div class="kpi-card accent-secondary animate-in animate-delay-1"><div class="kpi-value">${Utils().percentage(verifiedUsers, totalUsers)}%</div><div class="kpi-label">Usuarios Verificados</div></div>
          <div class="kpi-card animate-in animate-delay-2"><div class="kpi-value">0</div><div class="kpi-label">Fraudes Detectados</div></div>
        </div>
        <div class="grid grid-2">
          <div class="card">
            <h3 class="mb-md">Checklist ARCO+ 🛡️</h3>
            <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Acceso</div><div class="transaction-date">Los usuarios pueden ver sus datos personales</div></div><span class="badge badge-success">Activo</span></div>
            <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Rectificación</div><div class="transaction-date">Los usuarios pueden editar su perfil</div></div><span class="badge badge-success">Activo</span></div>
            <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Cancelación</div><div class="transaction-date">Eliminación de cuenta disponible</div></div><span class="badge badge-success">Activo</span></div>
            <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Oposición</div><div class="transaction-date">Opt-out de encuestas específicas</div></div><span class="badge badge-success">Activo</span></div>
            <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Portabilidad</div><div class="transaction-date">Exportación CSV de datos</div></div><span class="badge badge-success">Activo</span></div>
          </div>
          <div class="card">
            <h3 class="mb-md">Sistema de Integridad</h3>
            <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Verificación de Identidad</div><div class="transaction-date">Prevención de cuentas duplicadas</div></div><span class="badge badge-success">Activo</span></div>
            <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Detección de Fraude</div><div class="transaction-date">Análisis de patrones de respuesta</div></div><span class="badge badge-success">Activo</span></div>
            <div class="transaction-item"><div class="transaction-icon" style="background:var(--warning-50);color:var(--warning)">⏳</div><div class="transaction-info"><div class="transaction-name">Backup Automático</div><div class="transaction-date">Respaldo cada 24h (LocalStorage)</div></div><span class="badge badge-warning">Demo</span></div>
            <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Monitoreo (Sentry)</div><div class="transaction-date">Tracking de errores en producción</div></div><span class="badge badge-warning">Pendiente</span></div>
          </div>
        </div>
      </div>
    `;
  }

  // ====== Ecosystem ======
  function renderEcosystem() {
    const projects = [
      { name: 'Survey 593', status: 'active', desc: 'Monetización de datos', progress: 35 },
      { name: 'DataWallet', status: 'planned', desc: 'Control unificado de identidad', progress: 5 },
      { name: 'ClínicaVida App', status: 'planned', desc: 'Telemedicina inteligente', progress: 10 },
      { name: 'EduKolab', status: 'planned', desc: 'Plataforma educativa', progress: 0 },
      { name: 'FinKolab', status: 'planned', desc: 'Fintech integrada', progress: 0 },
    ];
    return `
      <div class="page">
        <div class="page-header"><div><h1 class="page-title">Ecosistema Kolab 🌱</h1><p class="page-subtitle">16 proyectos interconectados</p></div></div>
        <div class="grid grid-2">
          ${projects.map((p, i) => `
            <div class="card animate-in animate-delay-${Math.min(i, 4)}">
              <div class="flex justify-between items-center mb-sm">
                <h3 style="font-size:1.0625rem">${p.name}</h3>
                <span class="badge badge-${p.status === 'active' ? 'success' : 'neutral'} badge-dot">${p.status === 'active' ? 'Activo' : 'Planificado'}</span>
              </div>
              <p class="text-sm text-muted mb-md">${p.desc}</p>
              <div class="flex justify-between items-center text-sm mb-sm"><span class="text-muted">Progreso</span><span class="font-semibold">${p.progress}%</span></div>
              <div class="progress"><div class="progress-bar ${p.progress > 20 ? '' : 'warning'}" style="width:${p.progress}%"></div></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function resetSystem() {
    Survey593.Modal.show('🔄 Reset del Sistema', `
      <p>Esto eliminará todos los datos actuales y restaurará los datos de demostración originales.</p>
      <p class="text-sm text-muted mt-sm">Esta acción no se puede deshacer.</p>
    `, `
      <button class="btn btn-outline" onclick="Survey593.Modal.hide()">Cancelar</button>
      <button class="btn btn-danger" onclick="Survey593.DB.resetDB();Survey593.Auth.logout()">Confirmar Reset</button>
    `);
  }

  return {
    renderDashboard, initDashboardCharts, renderUsers, renderSurveys,
    renderQuality, renderEcosystem, searchUsers, verifyUser, toggleUser,
    resetSystem
  };
})();
