/* ================================================
   Survey 593 — Doer Panel (Encuestado)
   Dashboard, Available Surveys, Answer Survey, Wallet
   ================================================ */

window.Survey593 = window.Survey593 || {};

Survey593.Doer = (() => {
  const DB = () => Survey593.DB;
  const Utils = () => Survey593.Utils;
  const Charts = () => Survey593.Charts;
  const Toast = () => Survey593.Toast;

  // ====== Dashboard ======
  function renderDashboard() {
    const user = Survey593.Auth.getCurrentUser();
    if (!user) return '';
    const completedSurveys = DB().count('responses', r => r.userId === user.id);
    const totalEarned = DB().query('transactions', t => t.userId === user.id && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const availableSurveys = DB().query('surveys', s => s.status === 'active')
      .filter(s => !DB().query('responses', r => r.userId === user.id && r.surveyId === s.id).length);
    const recentResponses = DB().query('responses', r => r.userId === user.id)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 5);

    return `
      <div class="page">
        <div class="page-header">
          <div>
            <h1 class="page-title">¡Hola, ${user.name.split(' ')[0]}! 👋</h1>
            <p class="page-subtitle">Aquí está tu resumen de actividad</p>
          </div>
          ${user.verified ? '<span class="badge badge-success badge-dot">Verificado</span>' : '<a href="#/doer/verification" class="btn btn-outline btn-sm">🛡️ Verificar identidad</a>'}
        </div>

        <div class="grid grid-4">
          <div class="kpi-card animate-in">
            <div class="kpi-header">
              <div><div class="kpi-value" data-count="${user.balance.toFixed(2)}">$${user.balance.toFixed(2)}</div><div class="kpi-label">Saldo disponible</div></div>
              <div class="kpi-icon">💰</div>
            </div>
          </div>
          <div class="kpi-card accent-secondary animate-in animate-delay-1">
            <div class="kpi-header">
              <div><div class="kpi-value">${completedSurveys}</div><div class="kpi-label">Encuestas completadas</div></div>
              <div class="kpi-icon">📋</div>
            </div>
          </div>
          <div class="kpi-card accent-success animate-in animate-delay-2">
            <div class="kpi-header">
              <div><div class="kpi-value">$${totalEarned.toFixed(2)}</div><div class="kpi-label">Total ganado</div></div>
              <div class="kpi-icon">📈</div>
            </div>
          </div>
          <div class="kpi-card accent-warning animate-in animate-delay-3">
            <div class="kpi-header">
              <div><div class="kpi-value">${user.streak || 0} 🔥</div><div class="kpi-label">Racha de días</div></div>
              <div class="kpi-icon">🏆</div>
            </div>
          </div>
        </div>

        <div class="mt-lg">
          <div class="flex justify-between items-center mb-md">
            <h3>Encuestas Disponibles</h3>
            <span class="badge badge-primary">${availableSurveys.length} disponibles</span>
          </div>
          ${availableSurveys.length ? `
            <div class="grid grid-2">
              ${availableSurveys.map(s => renderSurveyCard(s)).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-state-icon">📋</div>
              <div class="empty-state-title">No hay encuestas disponibles</div>
              <div class="empty-state-text">Vuelve pronto, se publican nuevas encuestas constantemente.</div>
            </div>
          `}
        </div>

        ${recentResponses.length ? `
          <div class="mt-lg">
            <h3 class="mb-md">Actividad Reciente</h3>
            <div class="card">
              ${recentResponses.map(r => {
                const survey = DB().getById('surveys', r.surveyId);
                return `
                  <div class="transaction-item">
                    <div class="transaction-icon income">✓</div>
                    <div class="transaction-info">
                      <div class="transaction-name">${survey ? survey.title : 'Encuesta'}</div>
                      <div class="transaction-date">${Utils().formatRelative(r.completedAt)}</div>
                    </div>
                    <span class="badge badge-success">Completada</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderSurveyCard(survey) {
    const provider = DB().getById('users', survey.providerId);
    const progress = Utils().percentage(survey.actualResponses, survey.targetResponses);
    return `
      <div class="survey-card" onclick="window.location.hash='#/doer/survey/${survey.id}'">
        <div class="survey-card-header">
          <span class="badge badge-${survey.category === 'Gobierno' ? 'secondary' : survey.category === 'Salud' ? 'error' : 'primary'}">${survey.category}</span>
          <div class="survey-card-reward">+$${survey.rewardPerResponse.toFixed(2)}</div>
        </div>
        <div class="survey-card-title">${survey.title}</div>
        <div class="survey-card-desc">${survey.description}</div>
        <div class="progress mb-sm"><div class="progress-bar" style="width:${progress}%"></div></div>
        <div class="survey-card-meta">
          <span>🕐 ~${survey.estimatedTime} min</span>
          <span>📊 ${survey.actualResponses}/${survey.targetResponses}</span>
          <span>🏢 ${provider ? provider.company || provider.name : ''}</span>
        </div>
      </div>
    `;
  }

  // ====== Surveys List ======
  function renderSurveysList() {
    const user = Survey593.Auth.getCurrentUser();
    const allSurveys = DB().query('surveys', s => s.status === 'active');
    const answered = DB().query('responses', r => r.userId === user.id).map(r => r.surveyId);
    const available = allSurveys.filter(s => !answered.includes(s.id));
    const completed = allSurveys.filter(s => answered.includes(s.id));

    return `
      <div class="page">
        <div class="page-header">
          <div><h1 class="page-title">Encuestas</h1><p class="page-subtitle">Explora y responde encuestas para ganar dinero</p></div>
        </div>
        <div class="tabs">
          <div class="tab active" onclick="Survey593.Doer.filterSurveys('available')">Disponibles (${available.length})</div>
          <div class="tab" onclick="Survey593.Doer.filterSurveys('completed')">Completadas (${completed.length})</div>
        </div>
        <div id="surveys-content">
          <div class="grid grid-2">
            ${available.map(s => renderSurveyCard(s)).join('')}
          </div>
          ${!available.length ? '<div class="empty-state"><div class="empty-state-icon">🎉</div><div class="empty-state-title">¡Has completado todas!</div><div class="empty-state-text">Regresa pronto para nuevas encuestas.</div></div>' : ''}
        </div>
      </div>
    `;
  }

  function filterSurveys(tab) {
    const user = Survey593.Auth.getCurrentUser();
    document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', (tab === 'available' && i === 0) || (tab === 'completed' && i === 1)));
    const allSurveys = DB().query('surveys', s => s.status === 'active');
    const answered = DB().query('responses', r => r.userId === user.id).map(r => r.surveyId);
    const surveys = tab === 'available' ? allSurveys.filter(s => !answered.includes(s.id)) : allSurveys.filter(s => answered.includes(s.id));
    const container = document.getElementById('surveys-content');
    if (surveys.length) {
      container.innerHTML = `<div class="grid grid-2">${surveys.map(s => {
        if (tab === 'completed') {
          return `<div class="survey-card" style="opacity:0.7;cursor:default">
            <div class="survey-card-header"><span class="badge badge-success badge-dot">Completada</span><div class="survey-card-reward">+$${s.rewardPerResponse.toFixed(2)}</div></div>
            <div class="survey-card-title">${s.title}</div><div class="survey-card-desc">${s.description}</div>
          </div>`;
        }
        return renderSurveyCard(s);
      }).join('')}</div>`;
    } else {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">Sin encuestas</div></div>';
    }
  }

  // ====== Answer Survey ======
  function renderSurveyAnswer(surveyId) {
    const user = Survey593.Auth.getCurrentUser();
    const survey = DB().getById('surveys', surveyId);
    if (!survey) return '<div class="page"><div class="empty-state"><div class="empty-state-icon">❓</div><div class="empty-state-title">Encuesta no encontrada</div><a href="#/doer" class="btn btn-primary mt-md">Volver al Dashboard</a></div></div>';

    const existing = DB().query('responses', r => r.userId === user.id && r.surveyId === surveyId);
    if (existing.length) return '<div class="page"><div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title">Ya completaste esta encuesta</div><a href="#/doer" class="btn btn-primary mt-md">Volver al Dashboard</a></div></div>';

    const questions = DB().query('questions', q => q.surveyId === surveyId).sort((a, b) => a.order - b.order);
    const provider = DB().getById('users', survey.providerId);

    return `
      <div class="page" style="max-width:800px;margin:0 auto">
        <a href="#/doer" class="btn btn-ghost btn-sm mb-md">← Volver</a>
        <div class="card mb-md">
          <div class="flex justify-between items-center">
            <div>
              <span class="badge badge-primary mb-sm">${survey.category}</span>
              <h2>${survey.title}</h2>
              <p class="text-sm text-muted mt-sm">${survey.description}</p>
              <p class="text-sm text-muted mt-sm">Por: ${provider ? provider.company || provider.name : 'Anónimo'} · ~${survey.estimatedTime} min</p>
            </div>
            <div style="text-align:right">
              <div class="text-success font-bold text-xl">+$${survey.rewardPerResponse.toFixed(2)}</div>
              <div class="text-xs text-muted">recompensa</div>
            </div>
          </div>
        </div>

        <div class="mb-md">
          <div class="flex justify-between items-center mb-sm">
            <span class="text-sm font-semibold">Progreso</span>
            <span class="text-sm text-muted" id="progress-text">0 de ${questions.length}</span>
          </div>
          <div class="progress progress-lg"><div class="progress-bar" id="survey-progress" style="width:0%"></div></div>
        </div>

        <form id="survey-form" onsubmit="return Survey593.Doer.submitSurvey(event, '${surveyId}')">
          ${questions.map((q, i) => renderQuestion(q, i)).join('')}
          <div class="flex justify-between mt-lg">
            <a href="#/doer" class="btn btn-outline">Cancelar</a>
            <button type="submit" class="btn btn-primary btn-lg" id="submit-survey-btn">Enviar respuestas ✓</button>
          </div>
        </form>
      </div>
    `;
  }

  function renderQuestion(q, index) {
    let inputHtml = '';
    switch (q.type) {
      case 'multiple':
        inputHtml = `<div class="question-options">${q.options.map((opt, i) => `
          <label class="option-item" onclick="this.querySelector('input').checked=true;document.querySelectorAll('[name=\\'${q.id}\\']').forEach(el=>el.closest('.option-item').classList.remove('selected'));this.classList.add('selected');Survey593.Doer.updateProgress()">
            <input type="radio" name="${q.id}" value="${opt}" ${q.required ? 'required' : ''}>
            <span>${opt}</span>
          </label>
        `).join('')}</div>`;
        break;
      case 'likert':
        inputHtml = `<div class="likert-scale">${q.labels.map((label, i) => `
          <div class="likert-item" onclick="document.querySelectorAll('[data-likert=\\'${q.id}\\']').forEach(el=>el.classList.remove('selected'));this.classList.add('selected');document.getElementById('likert-val-${q.id}').value=${i + 1};Survey593.Doer.updateProgress()" data-likert="${q.id}">
            <div style="font-size:1.25rem;margin-bottom:4px">${i + 1}</div>
            <div>${label}</div>
          </div>
        `).join('')}</div>
        <input type="hidden" id="likert-val-${q.id}" name="${q.id}" value="">`;
        break;
      case 'yesno':
        inputHtml = `<div class="question-options" style="flex-direction:row;gap:12px">
          <label class="option-item" style="flex:1;justify-content:center" onclick="this.querySelector('input').checked=true;document.querySelectorAll('[name=\\'${q.id}\\']').forEach(el=>el.closest('.option-item').classList.remove('selected'));this.classList.add('selected');Survey593.Doer.updateProgress()">
            <input type="radio" name="${q.id}" value="Sí" ${q.required ? 'required' : ''}><span>👍 Sí</span>
          </label>
          <label class="option-item" style="flex:1;justify-content:center" onclick="this.querySelector('input').checked=true;document.querySelectorAll('[name=\\'${q.id}\\']').forEach(el=>el.closest('.option-item').classList.remove('selected'));this.classList.add('selected');Survey593.Doer.updateProgress()">
            <input type="radio" name="${q.id}" value="No" ${q.required ? 'required' : ''}><span>👎 No</span>
          </label>
        </div>`;
        break;
      case 'text':
        inputHtml = `<textarea class="form-input" name="${q.id}" placeholder="Escribe tu respuesta aquí..." rows="3" oninput="Survey593.Doer.updateProgress()" ${q.required ? 'required' : ''}></textarea>`;
        break;
    }
    return `
      <div class="question-block animate-in animate-delay-${Math.min(index, 4)}">
        <div class="question-num">Pregunta ${index + 1} ${q.required ? '<span style="color:var(--error)">*</span>' : '<span class="text-muted">(opcional)</span>'}</div>
        <div class="question-text">${q.text}</div>
        ${inputHtml}
      </div>
    `;
  }

  function updateProgress() {
    const form = document.getElementById('survey-form');
    if (!form) return;
    const questions = form.querySelectorAll('.question-block');
    let answered = 0;
    questions.forEach(qBlock => {
      const radios = qBlock.querySelectorAll('input[type="radio"]');
      const hiddens = qBlock.querySelectorAll('input[type="hidden"]');
      const textareas = qBlock.querySelectorAll('textarea');
      if (radios.length && [...radios].some(r => r.checked)) answered++;
      else if (hiddens.length && hiddens[0].value) answered++;
      else if (textareas.length && textareas[0].value.trim()) answered++;
    });
    const total = questions.length;
    const pct = Utils().percentage(answered, total);
    const progressBar = document.getElementById('survey-progress');
    const progressText = document.getElementById('progress-text');
    if (progressBar) progressBar.style.width = pct + '%';
    if (progressText) progressText.textContent = `${answered} de ${total}`;
  }

  function submitSurvey(e, surveyId) {
    e.preventDefault();
    const user = Survey593.Auth.getCurrentUser();
    const survey = DB().getById('surveys', surveyId);
    const questions = DB().query('questions', q => q.surveyId === surveyId);
    const form = document.getElementById('survey-form');
    const formData = new FormData(form);
    const answers = {};
    
    questions.forEach(q => {
      let val = formData.get(q.id);
      if (q.type === 'likert') val = Number(val) || null;
      answers[q.id] = val || '';
    });

    // Validate required
    for (const q of questions) {
      if (q.required && !answers[q.id]) {
        Toast().warning('Campos requeridos', `Por favor responde la pregunta: "${Utils().truncate(q.text, 50)}"`);
        return false;
      }
    }

    // Save response
    DB().insert('responses', { surveyId, userId: user.id, answers, verified: user.verified, completedAt: new Date().toISOString() });

    // Update survey stats
    DB().update('surveys', surveyId, { actualResponses: survey.actualResponses + 1, spent: survey.spent + survey.rewardPerResponse });

    // Add transaction
    DB().insert('transactions', { userId: user.id, type: 'income', amount: survey.rewardPerResponse, description: `Encuesta: ${survey.title}`, surveyId, status: 'completed' });

    // Update user balance and stats
    DB().update('users', user.id, { balance: user.balance + survey.rewardPerResponse, surveysCompleted: (user.surveysCompleted || 0) + 1 });

    // Show success modal
    Survey593.Modal.show('🎉 ¡Encuesta completada!', `
      <div style="text-align:center;padding:16px 0">
        <div style="font-size:3rem;margin-bottom:16px">🎉</div>
        <p style="font-size:1.125rem;font-weight:600;margin-bottom:8px">¡Gracias por tu participación!</p>
        <p class="text-muted mb-md">Tu opinión ayuda a tomar mejores decisiones.</p>
        <div class="wallet-balance" style="padding:20px;margin-bottom:16px">
          <div class="wallet-currency">Has ganado</div>
          <div class="wallet-amount text-success">+$${survey.rewardPerResponse.toFixed(2)}</div>
        </div>
        <p class="text-sm text-muted">Nuevo saldo: <strong>$${(user.balance + survey.rewardPerResponse).toFixed(2)}</strong></p>
      </div>
    `, `<button class="btn btn-primary btn-block" onclick="Survey593.Modal.hide();window.location.hash='#/doer'">Volver al Dashboard</button>`);

    return false;
  }

  // ====== Wallet ======
  function renderWallet() {
    const user = Survey593.Auth.getCurrentUser();
    const transactions = DB().query('transactions', t => t.userId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const totalEarned = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalWithdrawn = transactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Math.abs(t.amount), 0);
    const pending = transactions.filter(t => t.status === 'pending').reduce((s, t) => s + Math.abs(t.amount), 0);

    return `
      <div class="page">
        <div class="page-header">
          <div><h1 class="page-title">Mi Wallet 💰</h1><p class="page-subtitle">Administra tus ganancias</p></div>
          <button class="btn btn-primary" onclick="Survey593.Doer.requestWithdrawal()">📤 Solicitar Retiro</button>
        </div>

        <div class="wallet-balance mb-lg animate-in">
          <div class="wallet-currency">Saldo Disponible</div>
          <div class="wallet-amount">$${user.balance.toFixed(2)}</div>
          ${pending > 0 ? `<div class="text-sm text-warning mt-sm">⏳ $${pending.toFixed(2)} en retiro pendiente</div>` : ''}
        </div>

        <div class="grid grid-3 mb-lg">
          <div class="kpi-card accent-success animate-in animate-delay-1">
            <div class="kpi-value text-success">$${totalEarned.toFixed(2)}</div>
            <div class="kpi-label">Total Ganado</div>
          </div>
          <div class="kpi-card accent-secondary animate-in animate-delay-2">
            <div class="kpi-value">$${totalWithdrawn.toFixed(2)}</div>
            <div class="kpi-label">Total Retirado</div>
          </div>
          <div class="kpi-card accent-warning animate-in animate-delay-3">
            <div class="kpi-value">${transactions.filter(t => t.type === 'income').length}</div>
            <div class="kpi-label">Pagos Recibidos</div>
          </div>
        </div>

        <h3 class="mb-md">Historial de Transacciones</h3>
        <div class="card">
          ${transactions.length ? transactions.map(t => `
            <div class="transaction-item">
              <div class="transaction-icon ${t.type === 'income' ? 'income' : t.status === 'pending' ? 'pending' : 'expense'}">
                ${t.type === 'income' ? '↓' : '↑'}
              </div>
              <div class="transaction-info">
                <div class="transaction-name">${t.description}</div>
                <div class="transaction-date">${Utils().formatDate(t.createdAt)} · <span class="badge badge-${t.status === 'completed' ? 'success' : 'warning'} badge-dot">${t.status === 'completed' ? 'Completado' : 'Pendiente'}</span></div>
              </div>
              <div class="transaction-amount ${t.amount > 0 ? 'positive' : 'negative'}">
                ${t.amount > 0 ? '+' : ''}$${Math.abs(t.amount).toFixed(2)}
              </div>
            </div>
          `).join('') : '<div class="empty-state"><div class="empty-state-icon">💰</div><div class="empty-state-title">Sin transacciones</div><div class="empty-state-text">Completa encuestas para empezar a ganar.</div></div>'}
        </div>
      </div>
    `;
  }

  function requestWithdrawal() {
    const user = Survey593.Auth.getCurrentUser();
    if (user.balance < 5) {
      Toast().warning('Saldo insuficiente', 'Necesitas al menos $5.00 para solicitar un retiro.');
      return;
    }
    Survey593.Modal.show('Solicitar Retiro', `
      <div class="form-group">
        <label class="form-label">Monto a retirar</label>
        <input type="number" class="form-input" id="withdrawal-amount" min="5" max="${user.balance}" step="0.01" value="${user.balance.toFixed(2)}">
        <div class="form-hint">Mínimo $5.00 · Disponible: $${user.balance.toFixed(2)}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Método de pago</label>
        <select class="form-input" id="withdrawal-method">
          <option value="bank">Transferencia bancaria</option>
          <option value="wallet">Billetera digital</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>
    `, `
      <button class="btn btn-outline" onclick="Survey593.Modal.hide()">Cancelar</button>
      <button class="btn btn-primary" onclick="Survey593.Doer.processWithdrawal()">Confirmar Retiro</button>
    `);
  }

  function processWithdrawal() {
    const user = Survey593.Auth.getCurrentUser();
    const amount = parseFloat(document.getElementById('withdrawal-amount').value);
    if (!amount || amount < 5 || amount > user.balance) {
      Toast().error('Error', 'Monto inválido');
      return;
    }
    DB().insert('transactions', { userId: user.id, type: 'withdrawal', amount: -amount, description: 'Retiro a ' + document.getElementById('withdrawal-method').selectedOptions[0].text, status: 'pending' });
    DB().update('users', user.id, { balance: user.balance - amount });
    Survey593.Modal.hide();
    Toast().success('Retiro solicitado', `$${amount.toFixed(2)} será procesado en 24-48h`);
    window.location.hash = '#/doer/wallet';
    Survey593.App.render();
  }

  // ====== Profile ======
  function renderProfile() {
    const user = Survey593.Auth.getCurrentUser();
    return `
      <div class="page" style="max-width:700px">
        <div class="page-header"><div><h1 class="page-title">Mi Perfil</h1><p class="page-subtitle">Información personal y verificación</p></div></div>
        <div class="card mb-lg" style="text-align:center;padding:40px">
          <div class="avatar avatar-xl" style="background:${user.avatarColor};margin:0 auto 16px;font-size:2rem">${Utils().getInitials(user.name)}</div>
          <h2>${user.name}</h2>
          <p class="text-muted">${user.email}</p>
          <div class="mt-sm">${user.verified ? '<span class="badge badge-success badge-dot">Identidad Verificada</span>' : '<span class="badge badge-warning badge-dot">Pendiente de Verificación</span>'}</div>
        </div>
        <div class="card">
          <h3 class="mb-md">Datos Personales</h3>
          <form onsubmit="return Survey593.Doer.updateProfile(event)">
            <div class="form-row">
              <div class="form-group"><label class="form-label">Ciudad</label><input type="text" class="form-input" id="profile-city" value="${user.city || ''}"></div>
              <div class="form-group"><label class="form-label">Edad</label><input type="number" class="form-input" id="profile-age" value="${user.age || ''}"></div>
            </div>
            <div class="form-group"><label class="form-label">Género</label>
              <select class="form-input" id="profile-gender"><option value="">Seleccionar</option><option value="M" ${user.gender==='M'?'selected':''}>Masculino</option><option value="F" ${user.gender==='F'?'selected':''}>Femenino</option><option value="O" ${user.gender==='O'?'selected':''}>Otro</option><option value="N" ${user.gender==='N'?'selected':''}>Prefiero no decir</option></select>
            </div>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </form>
        </div>
      </div>
    `;
  }

  function updateProfile(e) {
    e.preventDefault();
    const user = Survey593.Auth.getCurrentUser();
    DB().update('users', user.id, {
      city: document.getElementById('profile-city').value,
      age: parseInt(document.getElementById('profile-age').value) || null,
      gender: document.getElementById('profile-gender').value
    });
    Toast().success('Perfil actualizado', 'Tus datos se han guardado correctamente.');
    return false;
  }

  // ====== Verification ======
  function renderVerification() {
    const user = Survey593.Auth.getCurrentUser();
    if (user.verified) return `<div class="page"><div class="empty-state"><div class="empty-state-icon">🛡️</div><div class="empty-state-title">Tu identidad ya está verificada</div><div class="empty-state-text">Tienes acceso completo a todas las encuestas.</div><a href="#/doer" class="btn btn-primary mt-md">Ir al Dashboard</a></div></div>`;
    return `
      <div class="page" style="max-width:600px;margin:0 auto">
        <div class="page-header"><div><h1 class="page-title">Verificación de Identidad 🛡️</h1><p class="page-subtitle">Verifica tu identidad para acceder a encuestas premium</p></div></div>
        <div class="card">
          <div style="text-align:center;padding:24px">
            <div style="font-size:3rem;margin-bottom:16px">🛡️</div>
            <h3 class="mb-sm">¿Por qué verificar tu identidad?</h3>
            <p class="text-muted mb-lg">La verificación garantiza datos de calidad y te da acceso a encuestas mejor pagadas.</p>
            <div style="text-align:left" class="mb-lg">
              <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Encuestas premium</div><div class="transaction-date">Accede a encuestas con mayor recompensa</div></div></div>
              <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Retiros más rápidos</div><div class="transaction-date">Procesa tus retiros en menos de 24h</div></div></div>
              <div class="transaction-item"><div class="transaction-icon income">✓</div><div class="transaction-info"><div class="transaction-name">Badge de confianza</div><div class="transaction-date">Las empresas prefieren respuestas verificadas</div></div></div>
            </div>
            <button class="btn btn-primary btn-lg btn-block" onclick="Survey593.Doer.simulateVerification()">Iniciar Verificación</button>
          </div>
        </div>
      </div>
    `;
  }

  function simulateVerification() {
    const user = Survey593.Auth.getCurrentUser();
    DB().update('users', user.id, { verified: true });
    Toast().success('¡Verificación completada!', 'Tu identidad ha sido verificada exitosamente.');
    window.location.hash = '#/doer';
    Survey593.App.render();
  }

  return {
    renderDashboard, renderSurveysList, renderSurveyAnswer, renderWallet,
    renderProfile, renderVerification, submitSurvey, updateProgress,
    requestWithdrawal, processWithdrawal, updateProfile, filterSurveys,
    simulateVerification
  };
})();
