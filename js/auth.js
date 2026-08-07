/* ================================================
   Survey 593 — Auth System
   Login, Register, Session Management
   ================================================ */

window.Survey593 = window.Survey593 || {};

Survey593.Auth = (() => {
  const SESSION_KEY = 'survey593_session';

  function getCurrentUser() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!session) return null;
    return Survey593.DB.getById('users', session.userId);
  }

  function login(email, password) {
    const user = Survey593.DB.query('users', u => u.email === email && u.password === password)[0];
    if (!user) return { success: false, error: 'Correo o contraseña incorrectos' };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, loginAt: new Date().toISOString() }));
    return { success: true, user };
  }

  function register(data) {
    const existing = Survey593.DB.query('users', u => u.email === data.email)[0];
    if (existing) return { success: false, error: 'Este correo ya está registrado' };
    if (!data.name || !data.email || !data.password) return { success: false, error: 'Todos los campos son obligatorios' };
    if (data.password.length < 6) return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };

    const colors = ['#0D9488','#6366F1','#F59E0B','#EF4444','#8B5CF6','#EC4899','#10B981','#3B82F6','#F97316'];
    const user = Survey593.DB.insert('users', {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'doer',
      avatar: null,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      verified: false,
      balance: 0,
      surveysCompleted: 0,
      streak: 0,
      company: data.company || '',
      industry: data.industry || '',
      city: data.city || '',
      age: data.age || null,
      gender: data.gender || ''
    });
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, loginAt: new Date().toISOString() }));
    return { success: true, user };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.hash = '#/';
    window.location.reload();
  }

  function getDefaultRoute(role) {
    const routes = { doer: '#/doer', provider: '#/provider', admin: '#/admin' };
    return routes[role] || '#/';
  }

  // ====== Login Page ======
  function renderLoginPage() {
    return `
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-header">
            <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:16px">
              <div class="sidebar-logo" style="width:44px;height:44px;font-size:1rem">S5</div>
            </div>
            <h2 id="auth-title">Iniciar Sesión</h2>
            <p id="auth-subtitle">Accede a tu cuenta de Survey 593</p>
          </div>

          <div id="auth-error" style="display:none;padding:10px 14px;background:var(--error-50);border:1px solid rgba(239,68,68,0.3);border-radius:var(--radius);color:var(--error);font-size:0.8125rem;margin-bottom:16px"></div>

          <!-- LOGIN FORM -->
          <form id="login-form" onsubmit="return Survey593.Auth.handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Correo electrónico</label>
              <input type="email" class="form-input" id="login-email" placeholder="tu@email.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-input" id="login-password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg">Iniciar Sesión</button>
            <div class="auth-toggle">
              ¿No tienes cuenta? <a onclick="Survey593.Auth.toggleForm('register')">Regístrate aquí</a>
            </div>
          </form>

          <!-- REGISTER FORM -->
          <form id="register-form" style="display:none" onsubmit="return Survey593.Auth.handleRegister(event)">
            <div class="form-group">
              <label class="form-label">Selecciona tu rol</label>
              <div class="role-selector" id="role-selector">
                <div class="role-option selected" data-role="doer" onclick="Survey593.Auth.selectRole('doer')">
                  <div class="role-option-icon">👤</div>
                  <div class="role-option-label">Encuestado</div>
                  <div class="role-option-desc">Responde y gana</div>
                </div>
                <div class="role-option" data-role="provider" onclick="Survey593.Auth.selectRole('provider')">
                  <div class="role-option-icon">🏢</div>
                  <div class="role-option-label">Empresa</div>
                  <div class="role-option-desc">Crea encuestas</div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Nombre completo</label>
              <input type="text" class="form-input" id="reg-name" placeholder="Tu nombre completo" required>
            </div>
            <div id="company-fields" style="display:none">
              <div class="form-group">
                <label class="form-label">Nombre de la empresa</label>
                <input type="text" class="form-input" id="reg-company" placeholder="Nombre de tu empresa">
              </div>
              <div class="form-group">
                <label class="form-label">Industria</label>
                <select class="form-input" id="reg-industry">
                  <option value="">Selecciona una industria</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Salud">Salud</option>
                  <option value="Educación">Educación</option>
                  <option value="Política">Política</option>
                  <option value="Retail">Retail</option>
                  <option value="Moda y Textiles">Moda y Textiles</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Correo electrónico</label>
              <input type="email" class="form-input" id="reg-email" placeholder="tu@email.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-input" id="reg-password" placeholder="Mínimo 6 caracteres" required minlength="6">
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg">Crear Cuenta</button>
            <div class="auth-toggle">
              ¿Ya tienes cuenta? <a onclick="Survey593.Auth.toggleForm('login')">Inicia sesión</a>
            </div>
          </form>

          <div class="auth-divider">Cuentas de demostración</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="Survey593.Auth.demoLogin('maria@email.com','demo123')" style="justify-content:flex-start">
              👤 María García — Encuestada
            </button>
            <button class="btn btn-ghost btn-sm" onclick="Survey593.Auth.demoLogin('admin@textilandina.ec','demo123')" style="justify-content:flex-start">
              🏢 Textil Andina — Empresa
            </button>
            <button class="btn btn-ghost btn-sm" onclick="Survey593.Auth.demoLogin('admin@kolab.ec','admin123')" style="justify-content:flex-start">
              🔧 Admin Kolab — Administrador
            </button>
          </div>
        </div>
      </div>
    `;
  }

  let selectedRole = 'doer';

  function selectRole(role) {
    selectedRole = role;
    document.querySelectorAll('.role-option').forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.role === role);
    });
    const companyFields = document.getElementById('company-fields');
    if (companyFields) companyFields.style.display = role === 'provider' ? 'block' : 'none';
  }

  function toggleForm(form) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const errorEl = document.getElementById('auth-error');

    if (errorEl) errorEl.style.display = 'none';

    if (form === 'register') {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      title.textContent = 'Crear Cuenta';
      subtitle.textContent = 'Únete a Survey 593 y comienza';
    } else {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      title.textContent = 'Iniciar Sesión';
      subtitle.textContent = 'Accede a tu cuenta de Survey 593';
    }
  }

  function showError(message) {
    const el = document.getElementById('auth-error');
    if (el) { el.textContent = message; el.style.display = 'block'; }
  }

  function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const result = login(email, password);
    if (result.success) {
      Survey593.Toast.success('¡Bienvenido!', `Hola, ${result.user.name}`);
      window.location.hash = getDefaultRoute(result.user.role);
      Survey593.App.render();
    } else {
      showError(result.error);
    }
    return false;
  }

  function handleRegister(e) {
    e.preventDefault();
    const data = {
      name: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value,
      role: selectedRole,
      company: document.getElementById('reg-company')?.value.trim() || '',
      industry: document.getElementById('reg-industry')?.value || ''
    };
    const result = register(data);
    if (result.success) {
      Survey593.Toast.success('¡Cuenta creada!', 'Bienvenido a Survey 593');
      window.location.hash = getDefaultRoute(result.user.role);
      Survey593.App.render();
    } else {
      showError(result.error);
    }
    return false;
  }

  function demoLogin(email, password) {
    const result = login(email, password);
    if (result.success) {
      Survey593.Toast.success('Demo activo', `Sesión como ${result.user.name}`);
      window.location.hash = getDefaultRoute(result.user.role);
      Survey593.App.render();
    }
  }

  return {
    getCurrentUser, login, register, logout, getDefaultRoute,
    renderLoginPage, handleLogin, handleRegister, demoLogin,
    toggleForm, selectRole
  };
})();
