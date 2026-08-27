/* ================================================
   Survey 593 — App Router & Landing Page
   Hash-based SPA Router + Initialization
   ================================================ */

window.Survey593 = window.Survey593 || {};

Survey593.App = (() => {

  // ====== Route Configuration ======
  const routes = {
    '#/':                  { page: 'landing', auth: false },
    '#/login':             { page: 'login', auth: false },
    '#/doer':              { page: 'doer-dashboard', auth: true, role: 'doer' },
    '#/doer/surveys':      { page: 'doer-surveys', auth: true, role: 'doer' },
    '#/doer/survey':       { page: 'doer-survey', auth: true, role: 'doer', dynamic: true },
    '#/doer/wallet':       { page: 'doer-wallet', auth: true, role: 'doer' },
    '#/doer/profile':      { page: 'doer-profile', auth: true, role: 'doer' },
    '#/doer/verification': { page: 'doer-verification', auth: true, role: 'doer' },
    '#/provider':          { page: 'provider-dashboard', auth: true, role: 'provider' },
    '#/provider/studio':   { page: 'provider-studio', auth: true, role: 'provider' },
    '#/provider/studio/edit': { page: 'provider-studio', auth: true, role: 'provider', dynamic: true },
    '#/provider/dashboards': { page: 'provider-dashboards', auth: true, role: 'provider' },
    '#/provider/dashboard/view': { page: 'provider-dashboard-view', auth: true, role: 'provider', dynamic: true },
    '#/provider/create':   { page: 'provider-create', auth: true, role: 'provider' },
    '#/provider/results':  { page: 'provider-results', auth: true, role: 'provider', dynamic: true },
    '#/provider/campaigns':{ page: 'provider-campaigns', auth: true, role: 'provider' },
    '#/provider/billing':  { page: 'provider-billing', auth: true, role: 'provider' },
    '#/admin':             { page: 'admin-dashboard', auth: true, role: 'admin' },
    '#/admin/users':       { page: 'admin-users', auth: true, role: 'admin' },
    '#/admin/surveys':     { page: 'admin-surveys', auth: true, role: 'admin' },
    '#/admin/quality':     { page: 'admin-quality', auth: true, role: 'admin' },
    '#/admin/ecosystem':   { page: 'admin-ecosystem', auth: true, role: 'admin' },
  };

  // ====== Page Renderers ======
  const pages = {
    'landing':              { render: renderLanding },
    'login':                { render: () => Survey593.Auth.renderLoginPage() },
    'doer-dashboard':       { render: () => Survey593.Doer.renderDashboard() },
    'doer-surveys':         { render: () => Survey593.Doer.renderSurveysList() },
    'doer-survey':          { render: (id) => Survey593.Doer.renderSurveyAnswer(id) },
    'doer-wallet':          { render: () => Survey593.Doer.renderWallet() },
    'doer-profile':         { render: () => Survey593.Doer.renderProfile() },
    'doer-verification':    { render: () => Survey593.Doer.renderVerification() },
    'provider-dashboard':   { render: () => Survey593.Provider.renderDashboard(), init: () => Survey593.Provider.initDashboardCharts() },
    'provider-studio':      { render: (id) => Survey593.Studio.renderStudio(id), init: () => Survey593.Studio.initWidgetsCharts() },
    'provider-dashboards':  { render: () => Survey593.Studio.renderDashboardsList() },
    'provider-dashboard-view': { render: (id) => Survey593.Studio.renderLiveView(id), init: (id) => Survey593.Studio.initLiveView(id) },
    'provider-create':      { render: () => Survey593.Provider.renderCreateSurvey() },
    'provider-results':     { render: (id) => Survey593.Provider.renderResults(id), init: (id) => { if (id) Survey593.Provider.initResultsCharts(id); } },
    'provider-campaigns':   { render: () => Survey593.Provider.renderCampaigns() },
    'provider-billing':     { render: () => Survey593.Provider.renderBilling() },
    'admin-dashboard':      { render: () => Survey593.Admin.renderDashboard(), init: () => Survey593.Admin.initDashboardCharts() },
    'admin-users':          { render: () => Survey593.Admin.renderUsers() },
    'admin-surveys':        { render: () => Survey593.Admin.renderSurveys() },
    'admin-quality':        { render: () => Survey593.Admin.renderQuality() },
    'admin-ecosystem':      { render: () => Survey593.Admin.renderEcosystem() },
  };

  // ====== Router ======
  function resolveRoute(hash) {
    if (!hash || hash === '#' || hash === '#/') return { route: routes['#/'], params: null };
    
    // Exact match
    if (routes[hash]) return { route: routes[hash], params: null };
    
    // Dynamic route (e.g., #/doer/survey/surv_1)
    const parts = hash.split('/');
    const paramValue = parts.pop();
    const basePath = parts.join('/');
    if (routes[basePath] && routes[basePath].dynamic) {
      return { route: routes[basePath], params: paramValue };
    }

    return { route: null, params: null };
  }

  function render() {
    const hash = window.location.hash || '#/';
    const { route, params } = resolveRoute(hash);
    const user = Survey593.Auth.getCurrentUser();
    const app = document.getElementById('app');

    // No route found → redirect to landing
    if (!route) {
      window.location.hash = '#/';
      return;
    }

    // Auth guard
    if (route.auth && !user) {
      window.location.hash = '#/login';
      return;
    }

    // Role guard
    if (route.role && user && user.role !== route.role) {
      window.location.hash = Survey593.Auth.getDefaultRoute(user.role);
      return;
    }

    // If logged in and trying to access landing or login, redirect to dashboard
    if (user && (route.page === 'landing' || route.page === 'login')) {
      window.location.hash = Survey593.Auth.getDefaultRoute(user.role);
      return;
    }

    const page = pages[route.page];
    if (!page) { app.innerHTML = '<div class="page"><h1>404</h1></div>'; return; }

    // Render page
    if (route.auth && user) {
      // App layout with sidebar
      const content = page.render(params);
      app.innerHTML = `
        ${Survey593.Sidebar.render(user)}
        <div class="main-content" id="main-content">
          ${content}
        </div>
      `;
      Survey593.Sidebar.updateActive(hash);
    } else {
      // Full-page layout (landing, login)
      app.innerHTML = page.render(params);
    }

    // Post-render initialization (charts, etc.)
    if (page.init) {
      requestAnimationFrame(() => {
        setTimeout(() => page.init(params), 100);
      });
    }
  }

  // ====== Landing Page ======
  function renderLanding() {
    return `
      <div class="landing">
        <!-- Navigation -->
        <nav class="landing-nav">
          <div class="landing-nav-brand">
            <div class="sidebar-logo" style="width:36px;height:36px;font-size:0.875rem">S5</div>
            <span class="font-bold">Survey 593</span>
          </div>
          <div class="landing-nav-links">
            <a href="#features" class="btn btn-ghost btn-sm">Características</a>
            <a href="#how" class="btn btn-ghost btn-sm">Cómo Funciona</a>
            <a href="#/login" class="btn btn-primary btn-sm">Iniciar Sesión</a>
          </div>
        </nav>

        <!-- Hero -->
        <section class="hero">
          <div class="hero-content">
            <div class="hero-badge animate-in">
              🌱 Ecosistema Kolab · Proyecto #1
            </div>
            <h1 class="animate-in animate-delay-1">
              Monetiza tu opinión.<br>
              <span class="text-gradient">Datos reales, decisiones reales.</span>
            </h1>
            <p class="animate-in animate-delay-2">
              Survey 593 conecta a empresas que necesitan datos confiables con ciudadanos que quieren ser recompensados por su opinión. Sin fraude. Sin intermediarios.
            </p>
            <div class="hero-actions animate-in animate-delay-3">
              <a href="#/login" class="btn btn-primary btn-xl">Comenzar Ahora →</a>
              <a href="#how" class="btn btn-outline btn-xl">¿Cómo funciona?</a>
            </div>
            <div class="hero-stats animate-in animate-delay-4">
              <div class="hero-stat">
                <div class="hero-stat-value">593+</div>
                <div class="hero-stat-label">Usuarios activos</div>
              </div>
              <div class="hero-stat">
                <div class="hero-stat-value">1,200+</div>
                <div class="hero-stat-label">Encuestas completadas</div>
              </div>
              <div class="hero-stat">
                <div class="hero-stat-value">$15K+</div>
                <div class="hero-stat-label">Pagados a encuestados</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="features-section" id="features">
          <div class="section-title">
            <h2>¿Por qué Survey 593?</h2>
            <p>Datos verificados + opiniones reales = decisiones inteligentes</p>
          </div>
          <div class="features-grid">
            <div class="feature-card animate-in">
              <div class="feature-card-icon">🛡️</div>
              <h3>Identidad Verificada</h3>
              <p>Cada encuestado pasa por un proceso de verificación para garantizar datos reales y eliminar el fraude.</p>
            </div>
            <div class="feature-card animate-in animate-delay-1">
              <div class="feature-card-icon">💰</div>
              <h3>Monetización Justa</h3>
              <p>Los encuestados reciben pagos automáticos por cada encuesta completada. Tu opinión tiene valor.</p>
            </div>
            <div class="feature-card animate-in animate-delay-2">
              <div class="feature-card-icon">📊</div>
              <h3>Resultados en Tiempo Real</h3>
              <p>Dashboards con métricas y visualizaciones para tomar decisiones basadas en datos actualizados al instante.</p>
            </div>
          </div>
        </section>

        <!-- How it works -->
        <section class="how-section" id="how">
          <div class="section-title">
            <h2>¿Cómo funciona?</h2>
            <p>Tres pasos simples para comenzar</p>
          </div>
          <div class="steps-container">
            <div class="step-card animate-in">
              <div class="step-num">1</div>
              <h3>Regístrate</h3>
              <p>Crea tu cuenta como encuestado o empresa. Es rápido, gratuito y seguro.</p>
            </div>
            <div class="step-card animate-in animate-delay-1">
              <div class="step-num">2</div>
              <h3>Participa</h3>
              <p>Responde encuestas (encuestado) o crea campañas de investigación (empresa).</p>
            </div>
            <div class="step-card animate-in animate-delay-2">
              <div class="step-num">3</div>
              <h3>Gana</h3>
              <p>Encuestados reciben pagos automáticos. Empresas reciben datos verificados y accionables.</p>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="cta-section">
          <div class="cta-box">
            <h2>¿Listo para democratizar los datos?</h2>
            <p>Únete a Survey 593 y sé parte del futuro de la monetización de opiniones en Ecuador.</p>
            <a href="#/login" class="btn btn-primary btn-xl">Crear Cuenta Gratis →</a>
          </div>
        </section>

        <!-- Footer -->
        <footer class="landing-footer">
          <p>© 2026 Survey 593 · Ecosistema Kolab · Todos los derechos reservados</p>
          <p style="margin-top:4px">Hecho con 💚 en Ecuador</p>
        </footer>
      </div>
    `;
  }

  // ====== Initialize ======
  function init() {
    // Ensure DB is seeded
    Survey593.DB.seed();

    // Listen for route changes
    window.addEventListener('hashchange', () => render());

    // Initial render
    render();

    console.log('🚀 Survey 593 initialized');
  }

  return { render, init };
})();

// ====== Bootstrap ======
document.addEventListener('DOMContentLoaded', () => {
  Survey593.App.init();
});
