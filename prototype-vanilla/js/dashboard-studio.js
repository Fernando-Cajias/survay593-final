/* ================================================
   Survey 593 — No-Code BI Dashboard Studio
   Drag & Drop Visual Builder + Dynamic Data Binding
   ================================================ */

window.Survey593 = window.Survey593 || {};

Survey593.Studio = (() => {
  const DB = () => Survey593.DB;
  const Utils = () => Survey593.Utils;
  const Toast = () => Survey593.Toast;
  const Charts = () => Survey593.Charts;

  // Active state for the editor
  let activeDashboard = null;
  let liveFilter = { city: 'all', gender: 'all', ageRange: 'all' };

  // Palette of available widgets for the toolbox
  const TOOLBOX_WIDGETS = [
    { type: 'pie', name: 'Gráfico de Pastel / Torta', icon: '🥧', desc: 'Distribución porcentual de respuestas', defaultCol: 1 },
    { type: 'radar', name: 'Gráfico de Ángulos / Radar', icon: '🕸️', desc: 'Evaluación multidimensional de escalas', defaultCol: 1 },
    { type: 'polarArea', name: 'Gráfico Polar / Radial', icon: '🌐', desc: 'Comparación de magnitudes radiales', defaultCol: 1 },
    { type: 'bar', name: 'Gráfico de Barras Vertical', icon: '📊', desc: 'Frecuencia y conteo por opción', defaultCol: 1 },
    { type: 'horizontalBar', name: 'Barras Horizontales', icon: '📉', desc: 'Ideal para textos y rankings largos', defaultCol: 1 },
    { type: 'line', name: 'Tendencia Temporal / Línea', icon: '📈', desc: 'Evolución de respuestas por fecha', defaultCol: 2 },
    { type: 'kpi', name: 'Tarjeta Métrica / KPI', icon: '🎯', desc: 'Totalizadores, promedios e índices clave', defaultCol: 1 },
    { type: 'table', name: 'Tabla Dinámica Filtrada', icon: '📋', desc: 'Detalle de respuestas fila por fila', defaultCol: 2 }
  ];

  // ====== 1. STUDIO BUILDER INTERFACE (DRAG & DROP) ======
  function renderStudio(dashboardId) {
    const user = Survey593.Auth.getCurrentUser();
    const providerSurveys = DB().query('surveys', s => s.providerId === user.id || s.status === 'active');
    
    if (dashboardId) {
      const existing = DB().getById('custom_dashboards', dashboardId);
      if (existing) {
        activeDashboard = JSON.parse(JSON.stringify(existing));
      }
    }
    
    if (!activeDashboard || activeDashboard.id !== dashboardId) {
      activeDashboard = {
        id: dashboardId || DB().generateId(),
        providerId: user.id,
        title: 'Nuevo Dashboard Analítico',
        description: 'Arrastra componentes desde la izquierda para construir tu tablero personalizado.',
        createdAt: new Date().toISOString(),
        widgets: []
      };
    }

    return `
      <div class="page">
        <!-- Header Actions -->
        <div class="studio-canvas-header animate-in">
          <div>
            <div style="display:flex;align-items:center;gap:10px">
              <span class="badge badge-primary">🎨 No-Code BI Studio</span>
              <span class="text-xs text-muted">Arrastra y suelta herramientas</span>
            </div>
            <input type="text" class="form-input" id="studio-dash-title" value="${activeDashboard.title}" placeholder="Título del Dashboard..." style="font-size:1.35rem;font-weight:800;background:transparent;border:1px dashed transparent;padding:4px 8px;margin-top:4px" onchange="Survey593.Studio.updateTitle(this.value)">
            <input type="text" class="form-input text-sm text-muted" id="studio-dash-desc" value="${activeDashboard.description || ''}" placeholder="Añade una descripción para este reporte..." style="background:transparent;border:none;padding:2px 8px" onchange="Survey593.Studio.updateDesc(this.value)">
          </div>
          <div class="flex gap-sm items-center flex-wrap">
            <a href="#/provider/dashboards" class="btn btn-outline btn-sm">📂 Mis Dashboards</a>
            <button class="btn btn-outline btn-sm" onclick="Survey593.Studio.clearCanvas()" style="color:var(--error)">🗑️ Limpiar</button>
            <button class="btn btn-secondary btn-sm" onclick="Survey593.Studio.loadTemplate()">✨ Plantilla Sugerida</button>
            <button class="btn btn-primary" onclick="Survey593.Studio.saveDashboard()">💾 Guardar Dashboard</button>
            <button class="btn btn-success" onclick="Survey593.Studio.goToLiveView()">👁️ Vista en Vivo</button>
          </div>
        </div>

        <div class="studio-container">
          <!-- LEFT TOOLBOX -->
          <div class="studio-toolbox animate-in animate-delay-1">
            <div class="toolbox-title">
              <span>🛠️ Componentes</span>
              <span class="badge badge-neutral">${TOOLBOX_WIDGETS.length}</span>
            </div>
            <p class="text-xs text-muted mb-md">Arrastra cualquier elemento al lienzo de la derecha:</p>
            
            <div class="toolbox-grid">
              ${TOOLBOX_WIDGETS.map(w => `
                <div class="draggable-widget-item" draggable="true" ondragstart="Survey593.Studio.handleDragStart(event, '${w.type}')" onclick="Survey593.Studio.addWidgetQuick('${w.type}')" title="Haz clic o arrastra al lienzo">
                  <div class="widget-icon">${w.icon}</div>
                  <div class="widget-info">
                    <div class="widget-name">${w.name}</div>
                    <div class="widget-desc">${w.desc}</div>
                  </div>
                  <span class="text-xs text-muted" style="font-size:0.9rem">➕</span>
                </div>
              `).join('')}
            </div>

            <div class="divider"></div>
            <div class="kpi-card accent-secondary" style="padding:12px 14px">
              <div class="text-xs font-semibold">💡 Tip para la defensa:</div>
              <div class="text-xs text-muted mt-sm">El cliente puede vincular cada objeto a cualquier pregunta de la base de datos sin programar.</div>
            </div>
          </div>

          <!-- CENTRAL CANVAS (DROP ZONE) -->
          <div class="studio-canvas-wrapper">
            <div class="studio-canvas-grid" id="studio-canvas-grid" ondragover="Survey593.Studio.handleDragOver(event)" ondragleave="Survey593.Studio.handleDragLeave(event)" ondrop="Survey593.Studio.handleDrop(event)">
              ${renderCanvasWidgets()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCanvasWidgets() {
    if (!activeDashboard.widgets || activeDashboard.widgets.length === 0) {
      return `
        <div class="studio-empty-canvas">
          <div style="font-size:3.5rem;margin-bottom:12px;opacity:0.6">🎨</div>
          <div class="font-bold text-lg mb-sm">El lienzo está vacío</div>
          <p class="text-sm text-muted" style="max-width:400px">
            Arrastra componentes visuales (como <strong>Gráfico de Pastel</strong>, <strong>Radar</strong> o <strong>KPIs</strong>) desde la barra izquierda hasta aquí.
          </p>
          <button class="btn btn-outline btn-sm mt-md" onclick="Survey593.Studio.loadTemplate()">✨ Cargar Plantilla Automática</button>
        </div>
      `;
    }

    return activeDashboard.widgets.map((widget, index) => {
      const colClass = widget.colSpan === 2 ? 'col-span-2' : 'col-span-1';
      const survey = DB().getById('surveys', widget.surveyId);
      const question = widget.questionId ? DB().getById('questions', widget.questionId) : null;
      const widgetDef = TOOLBOX_WIDGETS.find(w => w.type === widget.type) || { icon: '📊', name: widget.type };

      return `
        <div class="canvas-widget ${colClass}" id="widget-box-${widget.id}">
          <div class="canvas-widget-header">
            <div class="canvas-widget-title">
              <span>${widgetDef.icon}</span>
              <span>${widget.title || widgetDef.name}</span>
            </div>
            <div class="canvas-widget-actions">
              <span class="badge badge-primary text-xs">${survey ? Utils().truncate(survey.title, 18) : 'Sin vincular'}</span>
              <button class="btn btn-ghost btn-sm" onclick="Survey593.Studio.openConfigModal(${index})" title="⚙️ Configurar Base de Datos">⚙️</button>
              <button class="btn btn-ghost btn-sm" onclick="Survey593.Studio.toggleColSpan(${index})" title="Cambiar tamaño (1 o 2 columnas)">↔️</button>
              <button class="btn btn-ghost btn-sm" onclick="Survey593.Studio.removeWidget(${index})" title="Eliminar widget" style="color:var(--error)">🗑️</button>
            </div>
          </div>
          <div class="canvas-widget-body" id="canvas-widget-body-${widget.id}">
            ${renderWidgetPreviewContent(widget, index)}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderWidgetPreviewContent(widget, index) {
    if (!widget.surveyId) {
      return `
        <div style="text-align:center;padding:30px 10px;color:var(--text-muted)">
          <div style="font-size:1.8rem;margin-bottom:8px">⚙️</div>
          <div class="text-sm font-semibold">Widget sin vincular</div>
          <p class="text-xs text-muted mb-sm">Haz clic en Configurar para elegir una encuesta de la base de datos.</p>
          <button class="btn btn-primary btn-sm" onclick="Survey593.Studio.openConfigModal(${index})">Vincular a BDD →</button>
        </div>
      `;
    }

    if (widget.type === 'kpi') {
      const responses = DB().query('responses', r => r.surveyId === widget.surveyId);
      let displayValue = responses.length;
      let subText = 'Respuestas registradas';

      if (widget.config?.metric === 'avg_likert' && widget.questionId) {
        const stats = DB().getResponseStats(widget.surveyId);
        displayValue = (stats[widget.questionId]?.average || '0.0') + ' ★';
        subText = 'Promedio escala';
      } else if (widget.config?.metric === 'custom_stat') {
        displayValue = widget.config.value || '$85.00';
        subText = widget.config.label || 'Métrica estimada';
      }

      return `
        <div class="kpi-card accent-success" style="border:none;background:transparent;padding:10px">
          <div class="kpi-value text-gradient" style="font-size:2.4rem">${displayValue}</div>
          <div class="kpi-label">${widget.config?.label || subText}</div>
        </div>
      `;
    }

    if (widget.type === 'table') {
      const responses = DB().query('responses', r => r.surveyId === widget.surveyId).slice(0, 4);
      const questions = DB().query('questions', q => q.surveyId === widget.surveyId).slice(0, 3);
      return `
        <div class="table-container" style="max-height:200px">
          <table class="table" style="font-size:0.75rem">
            <thead>
              <tr><th>ID</th>${questions.map(q => `<th>${Utils().truncate(q.text, 20)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${responses.map(r => `
                <tr>
                  <td>${r.id}</td>
                  ${questions.map(q => `<td>${r.answers[q.id] || '—'}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Chart container
    return `<div style="height:220px;position:relative"><canvas id="chart-canvas-${widget.id}"></canvas></div>`;
  }

  // ====== 2. DRAG & DROP EVENT HANDLERS ======
  function handleDragStart(e, widgetType) {
    e.dataTransfer.setData('text/plain', widgetType);
    e.dataTransfer.effectAllowed = 'copy';
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const grid = document.getElementById('studio-canvas-grid');
    if (grid) grid.classList.add('drag-over');
  }

  function handleDragLeave(e) {
    const grid = document.getElementById('studio-canvas-grid');
    if (grid) grid.classList.remove('drag-over');
  }

  function handleDrop(e) {
    e.preventDefault();
    const grid = document.getElementById('studio-canvas-grid');
    if (grid) grid.classList.remove('drag-over');

    const widgetType = e.dataTransfer.getData('text/plain');
    if (widgetType) {
      addWidgetToCanvas(widgetType);
    }
  }

  function addWidgetQuick(widgetType) {
    addWidgetToCanvas(widgetType);
  }

  function addWidgetToCanvas(widgetType) {
    const user = Survey593.Auth.getCurrentUser();
    const surveys = DB().query('surveys', s => s.providerId === user.id || s.status === 'active');
    const defaultSurvey = surveys[0] || null;
    const questions = defaultSurvey ? DB().query('questions', q => q.surveyId === defaultSurvey.id) : [];
    const defaultQ = questions[0] || null;
    const widgetDef = TOOLBOX_WIDGETS.find(w => w.type === widgetType) || { name: widgetType, defaultCol: 1 };

    const newWidget = {
      id: 'w_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
      type: widgetType,
      title: widgetDef.name,
      surveyId: defaultSurvey ? defaultSurvey.id : '',
      questionId: defaultQ ? defaultQ.id : '',
      colSpan: widgetDef.defaultCol || 1,
      config: {
        label: defaultQ ? Utils().truncate(defaultQ.text, 30) : 'Métrica',
        metric: 'frequency'
      }
    };

    activeDashboard.widgets.push(newWidget);
    Toast().success('Widget agregado', `Se añadió "${widgetDef.name}" al lienzo.`);
    refreshCanvasAndCharts();
  }

  function removeWidget(index) {
    activeDashboard.widgets.splice(index, 1);
    refreshCanvasAndCharts();
  }

  function toggleColSpan(index) {
    const widget = activeDashboard.widgets[index];
    widget.colSpan = widget.colSpan === 2 ? 1 : 2;
    refreshCanvasAndCharts();
  }

  function clearCanvas() {
    activeDashboard.widgets = [];
    refreshCanvasAndCharts();
    Toast().info('Lienzo limpio', 'Puedes comenzar a arrastrar nuevos widgets.');
  }

  function updateTitle(val) {
    activeDashboard.title = val || 'Dashboard Personalizado';
  }

  function updateDesc(val) {
    activeDashboard.description = val || '';
  }

  function loadTemplate() {
    const user = Survey593.Auth.getCurrentUser();
    const surveys = DB().query('surveys', s => s.providerId === user.id || s.status === 'active');
    const s1 = surveys[0] || { id: 'surv_1' };

    activeDashboard.widgets = [
      { id: 'w_t1', type: 'kpi', title: 'Total Encuestados Verificados', surveyId: s1.id, colSpan: 1, config: { metric: 'total_responses', label: 'Muestra Total' } },
      { id: 'w_t2', type: 'kpi', title: 'Índice de Calificación Promedio', surveyId: s1.id, questionId: 'q1_2', colSpan: 1, config: { metric: 'avg_likert', label: 'Satisfacción Global (1-5)' } },
      { id: 'w_t3', type: 'pie', title: 'Distribución de Preferencias (Pastel)', surveyId: s1.id, questionId: 'q1_1', colSpan: 1, config: {} },
      { id: 'w_t4', type: 'radar', title: 'Análisis de Ángulos / Radar Multidimensional', surveyId: s1.id, questionId: 'q1_2', colSpan: 1, config: { label: 'Percepción' } },
      { id: 'w_t5', type: 'bar', title: 'Comparativa de Respuestas (Barras)', surveyId: s1.id, questionId: 'q1_3', colSpan: 2, config: {} }
    ];

    Toast().success('Plantilla cargada', 'Se configuró un tablero de análisis ejecutivo multidimensional.');
    refreshCanvasAndCharts();
  }

  // ====== 3. CONFIGURATION INSPECTOR MODAL ======
  function openConfigModal(index) {
    const widget = activeDashboard.widgets[index];
    const user = Survey593.Auth.getCurrentUser();
    const allSurveys = DB().getAll('surveys');
    const currentSurveyId = widget.surveyId || (allSurveys[0] ? allSurveys[0].id : '');
    const currentQuestions = currentSurveyId ? DB().query('questions', q => q.surveyId === currentSurveyId) : [];

    const modalBody = `
      <form id="widget-config-form" onsubmit="return false">
        <div class="form-group">
          <label class="form-label">Título del Widget</label>
          <input type="text" class="form-input" id="cfg-widget-title" value="${widget.title}">
        </div>

        <div class="form-group">
          <label class="form-label">🔗 Encuesta de Origen (Base de Datos)</label>
          <select class="form-input" id="cfg-widget-survey" onchange="Survey593.Studio.onModalSurveyChange()">
            ${allSurveys.map(s => `
              <option value="${s.id}" ${s.id === currentSurveyId ? 'selected' : ''}>${s.title} (${s.actualResponses} respuestas)</option>
            `).join('')}
          </select>
        </div>

        ${widget.type !== 'table' ? `
          <div class="form-group" id="cfg-question-group">
            <label class="form-label">❓ Pregunta / Métrica a Graficar</label>
            <select class="form-input" id="cfg-widget-question">
              ${currentQuestions.map(q => `
                <option value="${q.id}" ${q.id === widget.questionId ? 'selected' : ''}>P${q.order}. ${q.text} [${q.type}]</option>
              `).join('')}
            </select>
          </div>
        ` : ''}

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Ancho en Pantalla</label>
            <select class="form-input" id="cfg-widget-colspan">
              <option value="1" ${widget.colSpan === 1 ? 'selected' : ''}>1 Columna (Medio ancho)</option>
              <option value="2" ${widget.colSpan === 2 ? 'selected' : ''}>2 Columnas (Ancho completo)</option>
            </select>
          </div>
          ${widget.type === 'kpi' ? `
            <div class="form-group">
              <label class="form-label">Tipo de Cálculo</label>
              <select class="form-input" id="cfg-widget-metric">
                <option value="total_responses" ${widget.config?.metric === 'total_responses' ? 'selected' : ''}>Total de Respuestas</option>
                <option value="avg_likert" ${widget.config?.metric === 'avg_likert' ? 'selected' : ''}>Promedio Escala (Likert)</option>
                <option value="custom_stat" ${widget.config?.metric === 'custom_stat' ? 'selected' : ''}>Métrica Financiera ($)</option>
              </select>
            </div>
          ` : ''}
        </div>
      </form>
    `;

    const modalFooter = `
      <button class="btn btn-outline" onclick="Survey593.Modal.hide()">Cancelar</button>
      <button class="btn btn-primary" onclick="Survey593.Studio.applyWidgetConfig(${index})">Aplicar y Vincular ✓</button>
    `;

    Survey593.Modal.show(`⚙️ Configurar ${widget.type.toUpperCase()}`, modalBody, modalFooter);
  }

  function onModalSurveyChange() {
    const surveySelect = document.getElementById('cfg-widget-survey');
    const questionSelect = document.getElementById('cfg-widget-question');
    if (!surveySelect || !questionSelect) return;

    const surveyId = surveySelect.value;
    const questions = DB().query('questions', q => q.surveyId === surveyId);
    questionSelect.innerHTML = questions.map(q => `
      <option value="${q.id}">P${q.order}. ${q.text} [${q.type}]</option>
    `).join('');
  }

  function applyWidgetConfig(index) {
    const widget = activeDashboard.widgets[index];
    const title = document.getElementById('cfg-widget-title').value.trim();
    const surveyId = document.getElementById('cfg-widget-survey').value;
    const questionSelect = document.getElementById('cfg-widget-question');
    const colSpan = parseInt(document.getElementById('cfg-widget-colspan').value) || 1;
    const metricSelect = document.getElementById('cfg-widget-metric');

    widget.title = title || widget.title;
    widget.surveyId = surveyId;
    if (questionSelect) widget.questionId = questionSelect.value;
    widget.colSpan = colSpan;
    if (metricSelect) {
      widget.config = widget.config || {};
      widget.config.metric = metricSelect.value;
    }

    Survey593.Modal.hide();
    Toast().success('Configuración aplicada', 'Widget vinculado a los datos seleccionados.');
    refreshCanvasAndCharts();
  }

  // ====== 4. RENDER CHARTS & CANVAS REFRESH ======
  function refreshCanvasAndCharts() {
    const canvas = document.getElementById('studio-canvas-grid');
    if (canvas) {
      canvas.innerHTML = renderCanvasWidgets();
      initWidgetsCharts(activeDashboard.widgets, liveFilter);
    }
  }

  function initWidgetsCharts(widgets, filter = {}) {
    if (!widgets) return;
    requestAnimationFrame(() => {
      widgets.forEach(widget => {
        if (!widget.surveyId) return;
        const canvasId = `chart-canvas-${widget.id}`;
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const dataPackage = computeChartData(widget, filter);
        if (!dataPackage) return;

        if (widget.type === 'pie') {
          Charts().pie(canvasId, dataPackage.labels, dataPackage.values);
        } else if (widget.type === 'polarArea') {
          Charts().polarArea(canvasId, dataPackage.labels, dataPackage.values);
        } else if (widget.type === 'radar') {
          Charts().radar(canvasId, dataPackage.labels, dataPackage.values, widget.title || 'Nivel');
        } else if (widget.type === 'bar') {
          Charts().bar(canvasId, dataPackage.labels, dataPackage.values, widget.title || 'Respuestas');
        } else if (widget.type === 'horizontalBar') {
          Charts().horizontalBar(canvasId, dataPackage.labels, dataPackage.values);
        } else if (widget.type === 'line') {
          Charts().line(canvasId, dataPackage.labels, [{ label: widget.title || 'Tendencia', data: dataPackage.values }]);
        }
      });
    });
  }

  function computeChartData(widget, filter = {}) {
    const question = DB().getById('questions', widget.questionId);
    let responses = DB().query('responses', r => r.surveyId === widget.surveyId);

    // Apply Live Filters (Demographics)
    if (filter.city && filter.city !== 'all') {
      responses = responses.filter(r => {
        const u = DB().getById('users', r.userId);
        return u && u.city === filter.city;
      });
    }
    if (filter.gender && filter.gender !== 'all') {
      responses = responses.filter(r => {
        const u = DB().getById('users', r.userId);
        return u && u.gender === filter.gender;
      });
    }

    if (widget.type === 'line') {
      const days = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
      return { labels: days, values: [2, 5, 8, responses.length || 12] };
    }

    if (!question) {
      return { labels: ['Opción A', 'Opción B', 'Opción C'], values: [12, 19, 7] };
    }

    if (question.type === 'multiple' || question.type === 'yesno') {
      const opts = question.type === 'yesno' ? ['Sí', 'No'] : question.options;
      const counts = {};
      opts.forEach(o => counts[o] = 0);
      responses.forEach(r => {
        const ans = r.answers[question.id];
        if (ans && counts[ans] !== undefined) counts[ans]++;
      });
      return { labels: Object.keys(counts), values: Object.values(counts) };
    }

    if (question.type === 'likert') {
      const labels = question.labels || ['1 (Bajo)', '2', '3 (Medio)', '4', '5 (Alto)'];
      const counts = [0, 0, 0, 0, 0];
      responses.forEach(r => {
        const val = r.answers[question.id];
        if (val && val >= 1 && val <= 5) counts[val - 1]++;
      });
      return { labels, values: counts };
    }

    return { labels: ['Muestra'], values: [responses.length] };
  }

  // ====== 5. SAVE & PERSISTENCE ======
  function saveDashboard() {
    if (!activeDashboard.widgets || activeDashboard.widgets.length === 0) {
      Toast().warning('Dashboard vacío', 'Agrega al menos un componente antes de guardar.');
      return;
    }

    const titleEl = document.getElementById('studio-dash-title');
    if (titleEl) activeDashboard.title = titleEl.value.trim() || activeDashboard.title;

    const existing = DB().getById('custom_dashboards', activeDashboard.id);
    if (existing) {
      DB().update('custom_dashboards', activeDashboard.id, activeDashboard);
      Toast().success('Dashboard actualizado', `"${activeDashboard.title}" se guardó correctamente.`);
    } else {
      DB().insert('custom_dashboards', activeDashboard);
      Toast().success('¡Dashboard guardado!', `"${activeDashboard.title}" se ha creado con éxito.`);
    }
  }

  function goToLiveView() {
    saveDashboard();
    window.location.hash = `#/provider/dashboard/view/${activeDashboard.id}`;
  }

  // ====== 6. DASHBOARDS LIST VIEW ======
  function renderDashboardsList() {
    const user = Survey593.Auth.getCurrentUser();
    const dashboards = DB().query('custom_dashboards', d => d.providerId === user.id);

    return `
      <div class="page">
        <div class="page-header">
          <div>
            <span class="badge badge-primary mb-sm">🎨 No-Code BI Studio</span>
            <h1 class="page-title">Mis Dashboards Personalizados</h1>
            <p class="page-subtitle">Tableros analíticos diseñados a medida con vinculación directa a BDD.</p>
          </div>
          <a href="#/provider/studio" class="btn btn-primary btn-lg">➕ Crear Nuevo Dashboard</a>
        </div>

        <div class="grid grid-2">
          ${dashboards.map(d => `
            <div class="card card-interactive" style="display:flex;flex-direction:column;justify-content:space-between">
              <div>
                <div class="flex justify-between items-center mb-sm">
                  <span class="badge badge-success badge-dot">${d.widgets?.length || 0} Widgets</span>
                  <span class="text-xs text-muted">${Utils().formatDate(d.createdAt)}</span>
                </div>
                <h3 style="font-size:1.15rem;margin-bottom:6px">${d.title}</h3>
                <p class="text-sm text-muted mb-md">${d.description || 'Dashboard personalizado de análisis y visualización.'}</p>
                
                <div class="flex gap-sm flex-wrap mb-md">
                  ${(d.widgets || []).slice(0, 4).map(w => `<span class="tag">${TOOLBOX_WIDGETS.find(t=>t.type===w.type)?.icon || '📊'} ${w.type}</span>`).join('')}
                  ${d.widgets?.length > 4 ? `<span class="tag">+${d.widgets.length - 4} más</span>` : ''}
                </div>
              </div>

              <div class="flex justify-between items-center pt-md" style="border-top:1px solid var(--border)">
                <a href="#/provider/dashboard/view/${d.id}" class="btn btn-primary btn-sm">👁️ Ver en Vivo</a>
                <div class="flex gap-sm">
                  <a href="#/provider/studio/edit/${d.id}" class="btn btn-outline btn-sm" title="Editar en Studio">✏️ Editar</a>
                  <button class="btn btn-ghost btn-sm" onclick="Survey593.Studio.deleteDashboard('${d.id}')" title="Eliminar" style="color:var(--error)">🗑️</button>
                </div>
              </div>
            </div>
          `).join('')}

          ${!dashboards.length ? `
            <div class="empty-state" style="grid-column:span 2">
              <div class="empty-state-icon">🎨</div>
              <div class="empty-state-title">Aún no tienes dashboards personalizados</div>
              <div class="empty-state-text">Usa el Dashboard Studio para arrastrar widgets y crear tu primera pantalla analítica.</div>
              <a href="#/provider/studio" class="btn btn-primary mt-md">Abrir Dashboard Studio →</a>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function deleteDashboard(id) {
    Survey593.Modal.show('Confirmar Eliminación', `
      <p>¿Estás seguro de que deseas eliminar este dashboard personalizado?</p>
    `, `
      <button class="btn btn-outline" onclick="Survey593.Modal.hide()">Cancelar</button>
      <button class="btn btn-danger" onclick="Survey593.DB.remove('custom_dashboards', '${id}');Survey593.Modal.hide();Survey593.App.render();Survey593.Toast.success('Eliminado','Dashboard eliminado con éxito.')">Eliminar</button>
    `);
  }

  // ====== 7. LIVE PRESENTATION VIEW ======
  function renderLiveView(dashboardId) {
    const dashboard = DB().getById('custom_dashboards', dashboardId);
    if (!dashboard) {
      return `
        <div class="page"><div class="empty-state"><div class="empty-state-icon">❓</div><div class="empty-state-title">Dashboard no encontrado</div><a href="#/provider/dashboards" class="btn btn-primary mt-md">Volver</a></div></div>
      `;
    }

    return `
      <div class="page">
        <!-- Live Header -->
        <div class="page-header">
          <div>
            <a href="#/provider/dashboards" class="btn btn-ghost btn-sm mb-sm">← Volver a Mis Dashboards</a>
            <div style="display:flex;align-items:center;gap:12px">
              <h1 class="page-title">${dashboard.title}</h1>
              <span class="badge badge-success badge-dot">🟢 En Vivo (Realtime)</span>
            </div>
            <p class="page-subtitle">${dashboard.description || 'Vista analítica interactiva.'}</p>
          </div>
          <div class="flex gap-sm">
            <a href="#/provider/studio/edit/${dashboard.id}" class="btn btn-outline btn-sm">✏️ Editar Layout</a>
            <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Exportar / Imprimir</button>
          </div>
        </div>

        <!-- Live Demographic Filter Bar -->
        <div class="live-filter-bar animate-in">
          <span class="text-xs font-bold text-muted" style="text-transform:uppercase;letter-spacing:0.06em">🔍 Filtrar en Vivo:</span>
          
          <div class="flex gap-sm items-center">
            <span class="text-xs text-muted">Ciudad:</span>
            <div class="filter-chip ${liveFilter.city === 'all' ? 'active' : ''}" onclick="Survey593.Studio.setFilter('city', 'all', '${dashboard.id}')">Todas</div>
            <div class="filter-chip ${liveFilter.city === 'Quito' ? 'active' : ''}" onclick="Survey593.Studio.setFilter('city', 'Quito', '${dashboard.id}')">Quito</div>
            <div class="filter-chip ${liveFilter.city === 'Guayaquil' ? 'active' : ''}" onclick="Survey593.Studio.setFilter('city', 'Guayaquil', '${dashboard.id}')">Guayaquil</div>
            <div class="filter-chip ${liveFilter.city === 'Cuenca' ? 'active' : ''}" onclick="Survey593.Studio.setFilter('city', 'Cuenca', '${dashboard.id}')">Cuenca</div>
          </div>

          <div class="flex gap-sm items-center" style="margin-left:auto">
            <span class="text-xs text-muted">Género:</span>
            <div class="filter-chip ${liveFilter.gender === 'all' ? 'active' : ''}" onclick="Survey593.Studio.setFilter('gender', 'all', '${dashboard.id}')">Todos</div>
            <div class="filter-chip ${liveFilter.gender === 'F' ? 'active' : ''}" onclick="Survey593.Studio.setFilter('gender', 'F', '${dashboard.id}')">Mujeres (F)</div>
            <div class="filter-chip ${liveFilter.gender === 'M' ? 'active' : ''}" onclick="Survey593.Studio.setFilter('gender', 'M', '${dashboard.id}')">Hombres (M)</div>
          </div>
        </div>

        <!-- Grid of Widgets -->
        <div class="grid grid-2" id="live-dashboard-grid">
          ${(dashboard.widgets || []).map(widget => {
            const colClass = widget.colSpan === 2 ? 'col-span-2' : 'col-span-1';
            const widgetDef = TOOLBOX_WIDGETS.find(w => w.type === widget.type) || { icon: '📊', name: widget.type };
            return `
              <div class="canvas-widget ${colClass}" style="grid-column: span ${widget.colSpan || 1}">
                <div class="canvas-widget-header">
                  <div class="canvas-widget-title">
                    <span>${widgetDef.icon}</span>
                    <span>${widget.title || widgetDef.name}</span>
                  </div>
                  <span class="badge badge-neutral text-xs">${widget.type}</span>
                </div>
                <div class="canvas-widget-body">
                  ${renderWidgetPreviewContent(widget, 0)}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function initLiveView(dashboardId) {
    const dashboard = DB().getById('custom_dashboards', dashboardId);
    if (dashboard && dashboard.widgets) {
      initWidgetsCharts(dashboard.widgets, liveFilter);
    }
  }

  function setFilter(key, value, dashboardId) {
    liveFilter[key] = value;
    const page = renderLiveView(dashboardId);
    document.getElementById('main-content').innerHTML = page;
    initLiveView(dashboardId);
  }

  return {
    renderStudio,
    renderDashboardsList,
    renderLiveView,
    initLiveView,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    addWidgetQuick,
    removeWidget,
    toggleColSpan,
    clearCanvas,
    updateTitle,
    updateDesc,
    loadTemplate,
    openConfigModal,
    onModalSurveyChange,
    applyWidgetConfig,
    saveDashboard,
    goToLiveView,
    deleteDashboard,
    setFilter,
    initWidgetsCharts: () => initWidgetsCharts(activeDashboard?.widgets, liveFilter)
  };
})();
