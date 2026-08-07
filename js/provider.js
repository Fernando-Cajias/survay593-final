/* ================================================
   Survey 593 — Provider Panel (Empresa)
   Dashboard, Create Survey, Results, Campaigns
   ================================================ */

window.Survey593 = window.Survey593 || {};

Survey593.Provider = (() => {
  const DB = () => Survey593.DB;
  const Utils = () => Survey593.Utils;
  const Toast = () => Survey593.Toast;

  // ====== Dashboard ======
  function renderDashboard() {
    const user = Survey593.Auth.getCurrentUser();
    const surveys = DB().query('surveys', s => s.providerId === user.id);
    const activeSurveys = surveys.filter(s => s.status === 'active');
    const totalResponses = surveys.reduce((s, sv) => s + sv.actualResponses, 0);
    const totalSpent = surveys.reduce((s, sv) => s + sv.spent, 0);
    const avgCompletion = surveys.length ? Math.round(surveys.reduce((s, sv) => s + Utils().percentage(sv.actualResponses, sv.targetResponses), 0) / surveys.length) : 0;

    // Chart data: responses per survey
    const chartLabels = surveys.filter(s => s.status === 'active').map(s => Utils().truncate(s.title, 20));
    const chartData = surveys.filter(s => s.status === 'active').map(s => s.actualResponses);

    // Responses over time (simulated)
    const days = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const responsesByDay = days.map(() => Math.floor(Math.random() * 8) + 1);

    return `
      <div class="page">
        <div class="page-header">
          <div><h1 class="page-title">Dashboard Empresarial 📊</h1><p class="page-subtitle">${user.company || user.name} · ${user.industry || 'Empresa'}</p></div>
          <a href="#/provider/create" class="btn btn-primary">✏️ Crear Encuesta</a>
        </div>

        <div class="grid grid-4">
          <div class="kpi-card animate-in">
            <div class="kpi-header"><div><div class="kpi-value">${activeSurveys.length}</div><div class="kpi-label">Encuestas Activas</div></div><div class="kpi-icon">📋</div></div>
          </div>
          <div class="kpi-card accent-secondary animate-in animate-delay-1">
            <div class="kpi-header"><div><div class="kpi-value">${totalResponses}</div><div class="kpi-label">Respuestas Totales</div></div><div class="kpi-icon">📊</div></div>
          </div>
          <div class="kpi-card accent-warning animate-in animate-delay-2">
            <div class="kpi-header"><div><div class="kpi-value">$${totalSpent.toFixed(0)}</div><div class="kpi-label">Invertido</div></div><div class="kpi-icon">💰</div></div>
          </div>
          <div class="kpi-card accent-success animate-in animate-delay-3">
            <div class="kpi-header"><div><div class="kpi-value">${avgCompletion}%</div><div class="kpi-label">Completado Promedio</div></div><div class="kpi-icon">🎯</div></div>
          </div>
        </div>

        <div class="grid grid-2 mt-lg">
          <div class="chart-card animate-in animate-delay-2">
            <div class="chart-card-header"><span class="chart-card-title">Respuestas por Encuesta</span></div>
            <div style="height:260px"><canvas id="chart-responses-by-survey"></canvas></div>
          </div>
          <div class="chart-card animate-in animate-delay-3">
            <div class="chart-card-header"><span class="chart-card-title">Tendencia Semanal</span></div>
            <div style="height:260px"><canvas id="chart-weekly-trend"></canvas></div>
          </div>
        </div>

        <div class="mt-lg">
          <div class="flex justify-between items-center mb-md"><h3>Mis Campañas</h3><a href="#/provider/campaigns" class="btn btn-ghost btn-sm">Ver todas →</a></div>
          <div class="table-container">
            <table class="table">
              <thead><tr><th>Encuesta</th><th>Estado</th><th>Respuestas</th><th>Presupuesto</th><th>Progreso</th><th>Acciones</th></tr></thead>
              <tbody>
                ${surveys.map(s => `
                  <tr>
                    <td><div class="font-semibold">${Utils().truncate(s.title, 35)}</div><div class="text-xs text-muted">${s.category}</div></td>
                    <td><span class="badge badge-${s.status==='active'?'success':s.status==='draft'?'warning':'neutral'} badge-dot">${s.status==='active'?'Activa':s.status==='draft'?'Borrador':'Finalizada'}</span></td>
                    <td>${s.actualResponses}/${s.targetResponses}</td>
                    <td>$${s.spent.toFixed(0)} / $${s.budget}</td>
                    <td style="min-width:120px"><div class="progress"><div class="progress-bar" style="width:${Utils().percentage(s.actualResponses, s.targetResponses)}%"></div></div></td>
                    <td><a href="#/provider/results/${s.id}" class="btn btn-ghost btn-sm">📈 Ver</a></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function initDashboardCharts() {
    const user = Survey593.Auth.getCurrentUser();
    const surveys = DB().query('surveys', s => s.providerId === user.id && s.status === 'active');
    const labels = surveys.map(s => Utils().truncate(s.title, 18));
    const data = surveys.map(s => s.actualResponses);
    Survey593.Charts.bar('chart-responses-by-survey', labels, data, 'Respuestas');

    const days = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    Survey593.Charts.line('chart-weekly-trend', days, [{ label:'Respuestas', data: days.map(() => Math.floor(Math.random() * 8) + 1) }]);
  }

  // ====== Create Survey ======
  let wizardStep = 1;
  let newSurvey = { title: '', description: '', category: '', targetResponses: 100, rewardPerResponse: 2.5, budget: 250, estimatedTime: 5, questions: [] };

  function renderCreateSurvey() {
    wizardStep = 1;
    newSurvey = { title: '', description: '', category: '', targetResponses: 100, rewardPerResponse: 2.5, budget: 250, estimatedTime: 5, questions: [] };
    return `
      <div class="page" style="max-width:800px;margin:0 auto">
        <a href="#/provider" class="btn btn-ghost btn-sm mb-md">← Volver al Dashboard</a>
        <h1 class="page-title mb-lg">Crear Nueva Encuesta ✏️</h1>

        <div class="wizard-steps mb-lg" id="wizard-steps">
          <div class="wizard-step active"><span class="step-num">1</span><span>Información</span></div>
          <div class="wizard-line"></div>
          <div class="wizard-step"><span class="step-num">2</span><span>Presupuesto</span></div>
          <div class="wizard-line"></div>
          <div class="wizard-step"><span class="step-num">3</span><span>Preguntas</span></div>
          <div class="wizard-line"></div>
          <div class="wizard-step"><span class="step-num">4</span><span>Revisar</span></div>
        </div>

        <div id="wizard-content">${renderWizardStep1()}</div>
      </div>
    `;
  }

  function renderWizardStep1() {
    return `
      <div class="card animate-in">
        <h3 class="mb-md">Información Básica</h3>
        <div class="form-group"><label class="form-label">Título de la encuesta</label><input type="text" class="form-input" id="wiz-title" placeholder="Ej: Preferencias de Consumo 2026" value="${newSurvey.title}"></div>
        <div class="form-group"><label class="form-label">Descripción</label><textarea class="form-input" id="wiz-desc" rows="3" placeholder="Describe el propósito de la encuesta...">${newSurvey.description}</textarea></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Categoría</label>
            <select class="form-input" id="wiz-category"><option value="">Seleccionar</option><option value="Moda" ${newSurvey.category==='Moda'?'selected':''}>Moda</option><option value="Tecnología" ${newSurvey.category==='Tecnología'?'selected':''}>Tecnología</option><option value="Salud" ${newSurvey.category==='Salud'?'selected':''}>Salud</option><option value="Gobierno" ${newSurvey.category==='Gobierno'?'selected':''}>Gobierno</option><option value="Educación" ${newSurvey.category==='Educación'?'selected':''}>Educación</option><option value="Alimentación" ${newSurvey.category==='Alimentación'?'selected':''}>Alimentación</option><option value="Finanzas" ${newSurvey.category==='Finanzas'?'selected':''}>Finanzas</option><option value="Otro" ${newSurvey.category==='Otro'?'selected':''}>Otro</option></select>
          </div>
          <div class="form-group"><label class="form-label">Tiempo estimado (min)</label><input type="number" class="form-input" id="wiz-time" min="1" max="30" value="${newSurvey.estimatedTime}"></div>
        </div>
        <div class="flex justify-between mt-lg"><div></div><button class="btn btn-primary" onclick="Survey593.Provider.nextStep()">Siguiente →</button></div>
      </div>
    `;
  }

  function renderWizardStep2() {
    return `
      <div class="card animate-in">
        <h3 class="mb-md">Presupuesto y Alcance</h3>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Recompensa por respuesta ($)</label><input type="number" class="form-input" id="wiz-reward" min="0.5" max="50" step="0.5" value="${newSurvey.rewardPerResponse}" onchange="Survey593.Provider.calcBudget()"></div>
          <div class="form-group"><label class="form-label">Respuestas objetivo</label><input type="number" class="form-input" id="wiz-target" min="10" max="10000" value="${newSurvey.targetResponses}" onchange="Survey593.Provider.calcBudget()"></div>
        </div>
        <div class="kpi-card accent-success mt-md mb-lg">
          <div class="kpi-label">Presupuesto Total Estimado</div>
          <div class="kpi-value text-success" id="wiz-budget-display">$${newSurvey.budget.toFixed(2)}</div>
          <div class="text-xs text-muted mt-sm">= Recompensa × Respuestas</div>
        </div>
        <div class="flex justify-between mt-lg">
          <button class="btn btn-outline" onclick="Survey593.Provider.prevStep()">← Anterior</button>
          <button class="btn btn-primary" onclick="Survey593.Provider.nextStep()">Siguiente →</button>
        </div>
      </div>
    `;
  }

  function renderWizardStep3() {
    return `
      <div class="card animate-in">
        <h3 class="mb-md">Preguntas (${newSurvey.questions.length})</h3>
        <div id="questions-list">
          ${newSurvey.questions.map((q, i) => `
            <div class="question-block" style="padding:16px">
              <div class="flex justify-between items-center">
                <div><span class="badge badge-primary">${q.type}</span> <strong class="ml-sm">${q.text}</strong></div>
                <button class="btn btn-ghost btn-sm" onclick="Survey593.Provider.removeQuestion(${i})" style="color:var(--error)">🗑️</button>
              </div>
            </div>
          `).join('')}
        </div>
        ${newSurvey.questions.length === 0 ? '<div class="empty-state" style="padding:24px"><div class="empty-state-icon">📝</div><div class="empty-state-title">Sin preguntas</div><div class="empty-state-text">Agrega al menos una pregunta.</div></div>' : ''}
        
        <div class="divider"></div>
        <h4 class="mb-md">Agregar Pregunta</h4>
        <div class="form-group"><label class="form-label">Tipo de pregunta</label>
          <select class="form-input" id="add-q-type" onchange="Survey593.Provider.toggleOptions()">
            <option value="multiple">Opción múltiple</option><option value="likert">Escala Likert</option><option value="yesno">Sí / No</option><option value="text">Texto abierto</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Texto de la pregunta</label><input type="text" class="form-input" id="add-q-text" placeholder="Escribe la pregunta..."></div>
        <div id="options-container">
          <div class="form-group"><label class="form-label">Opciones (separadas por coma)</label><input type="text" class="form-input" id="add-q-options" placeholder="Opción 1, Opción 2, Opción 3..."></div>
        </div>
        <div class="check-group"><input type="checkbox" id="add-q-required" checked><label for="add-q-required">Obligatoria</label></div>
        <button class="btn btn-outline mt-md" onclick="Survey593.Provider.addQuestion()">➕ Agregar Pregunta</button>

        <div class="flex justify-between mt-lg">
          <button class="btn btn-outline" onclick="Survey593.Provider.prevStep()">← Anterior</button>
          <button class="btn btn-primary" onclick="Survey593.Provider.nextStep()" ${newSurvey.questions.length === 0 ? 'disabled' : ''}>Siguiente →</button>
        </div>
      </div>
    `;
  }

  function renderWizardStep4() {
    return `
      <div class="card animate-in">
        <h3 class="mb-lg">Revisar y Publicar</h3>
        <div class="grid grid-2 gap-md mb-lg">
          <div><div class="form-label">Título</div><p class="font-semibold">${newSurvey.title}</p></div>
          <div><div class="form-label">Categoría</div><span class="badge badge-primary">${newSurvey.category}</span></div>
          <div><div class="form-label">Descripción</div><p class="text-sm text-muted">${newSurvey.description}</p></div>
          <div><div class="form-label">Tiempo Estimado</div><p>${newSurvey.estimatedTime} min</p></div>
        </div>
        <div class="divider"></div>
        <div class="grid grid-3 gap-md mb-lg">
          <div class="kpi-card accent-success"><div class="kpi-value">$${newSurvey.rewardPerResponse.toFixed(2)}</div><div class="kpi-label">Por Respuesta</div></div>
          <div class="kpi-card accent-secondary"><div class="kpi-value">${newSurvey.targetResponses}</div><div class="kpi-label">Objetivo</div></div>
          <div class="kpi-card accent-warning"><div class="kpi-value">$${newSurvey.budget.toFixed(0)}</div><div class="kpi-label">Presupuesto Total</div></div>
        </div>
        <div class="divider"></div>
        <h4 class="mb-md">${newSurvey.questions.length} Preguntas</h4>
        ${newSurvey.questions.map((q, i) => `<div class="question-block" style="padding:12px 16px"><span class="text-sm font-semibold text-primary">${i + 1}.</span> ${q.text} <span class="badge badge-neutral">${q.type}</span></div>`).join('')}
        <div class="flex justify-between mt-lg">
          <button class="btn btn-outline" onclick="Survey593.Provider.prevStep()">← Anterior</button>
          <div class="flex gap-sm">
            <button class="btn btn-outline" onclick="Survey593.Provider.publishSurvey('draft')">💾 Guardar borrador</button>
            <button class="btn btn-primary btn-lg" onclick="Survey593.Provider.publishSurvey('active')">🚀 Publicar Encuesta</button>
          </div>
        </div>
      </div>
    `;
  }

  function nextStep() {
    if (wizardStep === 1) {
      newSurvey.title = document.getElementById('wiz-title').value.trim();
      newSurvey.description = document.getElementById('wiz-desc').value.trim();
      newSurvey.category = document.getElementById('wiz-category').value;
      newSurvey.estimatedTime = parseInt(document.getElementById('wiz-time').value) || 5;
      if (!newSurvey.title || !newSurvey.description || !newSurvey.category) { Toast().warning('Campos requeridos', 'Completa todos los campos.'); return; }
    } else if (wizardStep === 2) {
      newSurvey.rewardPerResponse = parseFloat(document.getElementById('wiz-reward').value) || 2.5;
      newSurvey.targetResponses = parseInt(document.getElementById('wiz-target').value) || 100;
      newSurvey.budget = newSurvey.rewardPerResponse * newSurvey.targetResponses;
    } else if (wizardStep === 3) {
      if (newSurvey.questions.length === 0) { Toast().warning('Sin preguntas', 'Agrega al menos una pregunta.'); return; }
    }
    wizardStep = Math.min(wizardStep + 1, 4);
    updateWizard();
  }

  function prevStep() {
    wizardStep = Math.max(wizardStep - 1, 1);
    updateWizard();
  }

  function updateWizard() {
    const content = document.getElementById('wizard-content');
    const steps = document.querySelectorAll('.wizard-step');
    const lines = document.querySelectorAll('.wizard-line');
    steps.forEach((s, i) => { s.classList.remove('active','completed'); if (i + 1 < wizardStep) s.classList.add('completed'); if (i + 1 === wizardStep) s.classList.add('active'); });
    lines.forEach((l, i) => l.classList.toggle('active', i + 1 < wizardStep));
    const renderers = [renderWizardStep1, renderWizardStep2, renderWizardStep3, renderWizardStep4];
    content.innerHTML = renderers[wizardStep - 1]();
  }

  function calcBudget() {
    const reward = parseFloat(document.getElementById('wiz-reward').value) || 0;
    const target = parseInt(document.getElementById('wiz-target').value) || 0;
    const display = document.getElementById('wiz-budget-display');
    if (display) display.textContent = '$' + (reward * target).toFixed(2);
  }

  function toggleOptions() {
    const type = document.getElementById('add-q-type').value;
    const container = document.getElementById('options-container');
    container.style.display = (type === 'multiple') ? 'block' : 'none';
  }

  function addQuestion() {
    const type = document.getElementById('add-q-type').value;
    const text = document.getElementById('add-q-text').value.trim();
    if (!text) { Toast().warning('Campo requerido', 'Escribe la pregunta.'); return; }
    const q = { type, text, required: document.getElementById('add-q-required').checked, order: newSurvey.questions.length + 1 };
    if (type === 'multiple') {
      const opts = document.getElementById('add-q-options').value.split(',').map(o => o.trim()).filter(Boolean);
      if (opts.length < 2) { Toast().warning('Opciones', 'Agrega al menos 2 opciones separadas por coma.'); return; }
      q.options = opts;
    } else if (type === 'likert') {
      q.scale = 5;
      q.labels = ['Muy bajo','Bajo','Neutral','Alto','Muy alto'];
    }
    newSurvey.questions.push(q);
    Toast().success('Pregunta agregada', `"${Utils().truncate(text, 40)}"`);
    updateWizard();
  }

  function removeQuestion(index) {
    newSurvey.questions.splice(index, 1);
    updateWizard();
  }

  function publishSurvey(status) {
    const user = Survey593.Auth.getCurrentUser();
    const surveyData = DB().insert('surveys', {
      providerId: user.id, title: newSurvey.title, description: newSurvey.description,
      category: newSurvey.category, status, rewardPerResponse: newSurvey.rewardPerResponse,
      budget: newSurvey.budget, spent: 0, targetResponses: newSurvey.targetResponses,
      actualResponses: 0, estimatedTime: newSurvey.estimatedTime,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
    });
    newSurvey.questions.forEach(q => {
      DB().insert('questions', { ...q, surveyId: surveyData.id });
    });
    Toast().success(status === 'active' ? '🚀 Encuesta publicada' : '💾 Borrador guardado', newSurvey.title);
    window.location.hash = '#/provider';
    Survey593.App.render();
  }

  // ====== Results ======
  function renderResults(surveyId) {
    if (!surveyId) return renderResultsList();
    const survey = DB().getById('surveys', surveyId);
    if (!survey) return '<div class="page"><div class="empty-state"><div class="empty-state-icon">❓</div><div class="empty-state-title">Encuesta no encontrada</div></div></div>';
    const stats = DB().getResponseStats(surveyId);
    const responses = DB().query('responses', r => r.surveyId === surveyId);
    const questions = DB().query('questions', q => q.surveyId === surveyId).sort((a, b) => a.order - b.order);

    return `
      <div class="page">
        <a href="#/provider" class="btn btn-ghost btn-sm mb-md">← Volver</a>
        <div class="page-header">
          <div>
            <span class="badge badge-primary">${survey.category}</span>
            <h1 class="page-title mt-sm">${survey.title}</h1>
            <p class="page-subtitle">${responses.length} respuestas de ${survey.targetResponses} objetivo</p>
          </div>
          <button class="btn btn-outline" onclick="Survey593.Provider.exportCSV('${surveyId}')">📥 Exportar CSV</button>
        </div>

        <div class="grid grid-3 mb-lg">
          <div class="kpi-card accent-success"><div class="kpi-value">${responses.length}</div><div class="kpi-label">Respuestas</div></div>
          <div class="kpi-card accent-secondary"><div class="kpi-value">${Utils().percentage(responses.length, survey.targetResponses)}%</div><div class="kpi-label">Completado</div></div>
          <div class="kpi-card accent-warning"><div class="kpi-value">$${survey.spent.toFixed(0)}</div><div class="kpi-label">Invertido</div></div>
        </div>

        ${questions.map((q, i) => {
          const stat = stats[q.id];
          if (!stat) return '';
          const chartId = `chart-q-${i}`;
          if (q.type === 'multiple' || q.type === 'yesno') {
            const labels = Object.keys(stat.data);
            const values = Object.values(stat.data);
            return `
              <div class="chart-card mb-md animate-in animate-delay-${Math.min(i, 4)}">
                <div class="chart-card-header"><span class="chart-card-title">P${q.order}. ${q.text}</span><span class="badge badge-neutral">${q.type === 'yesno' ? 'Sí/No' : 'Opción múltiple'}</span></div>
                <div class="grid grid-2" style="align-items:center">
                  <div style="height:220px"><canvas id="${chartId}"></canvas></div>
                  <div>${labels.map((l, j) => `<div class="flex justify-between items-center" style="padding:6px 0;border-bottom:1px solid var(--border)"><span class="text-sm">${l}</span><span class="font-semibold">${values[j]}</span></div>`).join('')}</div>
                </div>
              </div>
            `;
          } else if (q.type === 'likert') {
            return `
              <div class="chart-card mb-md animate-in animate-delay-${Math.min(i, 4)}">
                <div class="chart-card-header"><span class="chart-card-title">P${q.order}. ${q.text}</span><span class="badge badge-info">Promedio: ${stat.average}</span></div>
                <div style="height:200px"><canvas id="${chartId}"></canvas></div>
              </div>
            `;
          } else if (q.type === 'text') {
            return `
              <div class="card mb-md animate-in animate-delay-${Math.min(i, 4)}">
                <div class="flex justify-between items-center mb-md"><span class="font-semibold">P${q.order}. ${q.text}</span><span class="badge badge-neutral">Texto abierto</span></div>
                ${stat.data.length ? stat.data.map(t => `<div style="padding:10px 14px;background:var(--bg-alt);border-radius:var(--radius);margin-bottom:8px;font-size:0.875rem;border-left:3px solid var(--primary)">"${t}"</div>`).join('') : '<p class="text-muted text-sm">Sin respuestas de texto.</p>'}
              </div>
            `;
          }
          return '';
        }).join('')}
      </div>
    `;
  }

  function initResultsCharts(surveyId) {
    const questions = DB().query('questions', q => q.surveyId === surveyId).sort((a, b) => a.order - b.order);
    const stats = DB().getResponseStats(surveyId);
    questions.forEach((q, i) => {
      const stat = stats[q.id];
      const chartId = `chart-q-${i}`;
      if (q.type === 'multiple' || q.type === 'yesno') {
        Survey593.Charts.doughnut(chartId, Object.keys(stat.data), Object.values(stat.data));
      } else if (q.type === 'likert') {
        const labels = q.labels || [1,2,3,4,5].map(String);
        Survey593.Charts.bar(chartId, labels, Object.values(stat.data));
      }
    });
  }

  function renderResultsList() {
    const user = Survey593.Auth.getCurrentUser();
    const surveys = DB().query('surveys', s => s.providerId === user.id && s.actualResponses > 0);
    return `
      <div class="page">
        <div class="page-header"><div><h1 class="page-title">Resultados 📈</h1><p class="page-subtitle">Selecciona una encuesta para ver los resultados</p></div></div>
        <div class="grid grid-2">
          ${surveys.map(s => `
            <div class="survey-card" onclick="window.location.hash='#/provider/results/${s.id}'">
              <div class="survey-card-header"><span class="badge badge-primary">${s.category}</span><span class="badge badge-success">${s.actualResponses} respuestas</span></div>
              <div class="survey-card-title">${s.title}</div>
              <div class="progress mt-sm"><div class="progress-bar" style="width:${Utils().percentage(s.actualResponses, s.targetResponses)}%"></div></div>
            </div>
          `).join('')}
          ${!surveys.length ? '<div class="empty-state"><div class="empty-state-icon">📊</div><div class="empty-state-title">Sin resultados aún</div><div class="empty-state-text">Publica una encuesta para comenzar a recopilar datos.</div></div>' : ''}
        </div>
      </div>
    `;
  }

  function exportCSV(surveyId) {
    const survey = DB().getById('surveys', surveyId);
    const questions = DB().query('questions', q => q.surveyId === surveyId).sort((a, b) => a.order - b.order);
    const responses = DB().query('responses', r => r.surveyId === surveyId);
    const headers = ['ID', 'Fecha', ...questions.map(q => q.text)];
    const rows = responses.map(r => {
      const user = DB().getById('users', r.userId);
      return [r.id, Utils().formatDate(r.completedAt), ...questions.map(q => r.answers[q.id] || '')];
    });
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${survey.title.replace(/\s/g, '_')}_resultados.csv`;
    a.click(); URL.revokeObjectURL(url);
    Toast().success('CSV exportado', `${responses.length} respuestas descargadas.`);
  }

  // ====== Campaigns ======
  function renderCampaigns() {
    const user = Survey593.Auth.getCurrentUser();
    const surveys = DB().query('surveys', s => s.providerId === user.id);
    return `
      <div class="page">
        <div class="page-header">
          <div><h1 class="page-title">Mis Campañas</h1><p class="page-subtitle">${surveys.length} encuestas creadas</p></div>
          <a href="#/provider/create" class="btn btn-primary">✏️ Nueva Encuesta</a>
        </div>
        <div class="grid grid-2">
          ${surveys.map(s => `
            <div class="card card-interactive">
              <div class="flex justify-between items-center mb-sm">
                <span class="badge badge-${s.status==='active'?'success':s.status==='draft'?'warning':'neutral'} badge-dot">${s.status==='active'?'Activa':s.status==='draft'?'Borrador':'Finalizada'}</span>
                <span class="text-sm text-muted">${Utils().formatDate(s.createdAt)}</span>
              </div>
              <h3 style="font-size:1.0625rem">${s.title}</h3>
              <p class="text-sm text-muted mb-md">${Utils().truncate(s.description, 80)}</p>
              <div class="progress mb-sm"><div class="progress-bar" style="width:${Utils().percentage(s.actualResponses, s.targetResponses)}%"></div></div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-muted">${s.actualResponses}/${s.targetResponses} respuestas</span>
                <div class="flex gap-sm">
                  ${s.actualResponses > 0 ? `<a href="#/provider/results/${s.id}" class="btn btn-ghost btn-sm">📈</a>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ====== Billing ======
  function renderBilling() {
    const user = Survey593.Auth.getCurrentUser();
    const surveys = DB().query('surveys', s => s.providerId === user.id);
    const totalSpent = surveys.reduce((s, sv) => s + sv.spent, 0);
    const totalBudget = surveys.reduce((s, sv) => s + sv.budget, 0);
    return `
      <div class="page">
        <div class="page-header"><div><h1 class="page-title">Facturación 💳</h1><p class="page-subtitle">Resumen de gastos e inversión</p></div></div>
        <div class="grid grid-3 mb-lg">
          <div class="kpi-card animate-in"><div class="kpi-value">$${user.balance.toLocaleString()}</div><div class="kpi-label">Saldo de Cuenta</div></div>
          <div class="kpi-card accent-warning animate-in animate-delay-1"><div class="kpi-value">$${totalSpent.toFixed(0)}</div><div class="kpi-label">Total Invertido</div></div>
          <div class="kpi-card accent-secondary animate-in animate-delay-2"><div class="kpi-value">$${totalBudget.toFixed(0)}</div><div class="kpi-label">Presupuesto Asignado</div></div>
        </div>
        <h3 class="mb-md">Desglose por Encuesta</h3>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Encuesta</th><th>Presupuesto</th><th>Gastado</th><th>Restante</th><th>Estado</th></tr></thead>
            <tbody>
              ${surveys.map(s => `<tr>
                <td class="font-semibold">${Utils().truncate(s.title, 30)}</td>
                <td>$${s.budget.toFixed(0)}</td>
                <td>$${s.spent.toFixed(0)}</td>
                <td class="${s.budget - s.spent > 0 ? 'text-success' : 'text-error'}">$${(s.budget - s.spent).toFixed(0)}</td>
                <td><span class="badge badge-${s.status==='active'?'success':'warning'}">${s.status}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  return {
    renderDashboard, initDashboardCharts, renderCreateSurvey, renderResults,
    initResultsCharts, renderResultsList, renderCampaigns, renderBilling,
    nextStep, prevStep, calcBudget, addQuestion, removeQuestion, toggleOptions,
    publishSurvey, exportCSV
  };
})();
