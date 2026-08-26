import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ChartRenderer } from '../../components/charts/ChartRenderer';
import {
  Palette,
  PieChart,
  Radar as RadarIcon,
  BarChart2,
  BarChartHorizontal,
  TrendingUp,
  Target,
  Table,
  Plus,
  Trash2,
  Settings,
  Eye,
  Save,
  Sparkles,
  MoveHorizontal,
  FolderKanban,
} from 'lucide-react';

const TOOLBOX_ITEMS = [
  { type: 'pie', name: 'Gráfico de Pastel / Torta', icon: PieChart, desc: 'Distribución porcentual de opciones', defaultCol: 1 },
  { type: 'radar', name: 'Gráfico de Ángulos / Radar', icon: RadarIcon, desc: 'Evaluación multidimensional de escalas', defaultCol: 1 },
  { type: 'polarArea', name: 'Gráfico Polar Radial', icon: PieChart, desc: 'Comparativa de magnitudes polares', defaultCol: 1 },
  { type: 'bar', name: 'Barras Verticales', icon: BarChart2, desc: 'Frecuencia y conteo por respuesta', defaultCol: 1 },
  { type: 'horizontalBar', name: 'Barras Horizontales', icon: BarChartHorizontal, desc: 'Ideal para rankings y opciones largas', defaultCol: 1 },
  { type: 'line', name: 'Tendencia Temporal (Línea)', icon: TrendingUp, desc: 'Evolución de respuestas por fecha', defaultCol: 2 },
  { type: 'kpi', name: 'Tarjeta Métrica / KPI', icon: Target, desc: 'Totalizadores y promedios clave', defaultCol: 1 },
  { type: 'table', name: 'Tabla Dinámica', icon: Table, desc: 'Detalle de respuestas en tiempo real', defaultCol: 2 },
];

export const DashboardStudio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { surveys, questions, responses, customDashboards, saveCustomDashboard } = useDatabase();

  const existing = id ? customDashboards.find((d) => d.id === id) : null;

  const [dashboard, setDashboard] = useState(() => {
    if (existing) return JSON.parse(JSON.stringify(existing));
    return {
      id: id || `dash_${Date.now().toString(36)}`,
      providerId: currentUser.id,
      title: 'Nuevo Dashboard Analítico',
      description: 'Tablero personalizado creado con el No-Code BI Studio.',
      widgets: [],
    };
  });

  const [selectedWidgetIdx, setSelectedWidgetIdx] = useState(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Widget config form state
  const [cfgTitle, setCfgTitle] = useState('');
  const [cfgSurveyId, setCfgSurveyId] = useState('');
  const [cfgQuestionId, setCfgQuestionId] = useState('');
  const [cfgColSpan, setCfgColSpan] = useState(1);
  const [cfgMetric, setCfgMetric] = useState('frequency');

  // Drag & drop handlers
  const handleDragStart = (e, widgetType) => {
    e.dataTransfer.setData('text/plain', widgetType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const widgetType = e.dataTransfer.getData('text/plain');
    if (widgetType) addWidget(widgetType);
  };

  const addWidget = (widgetType) => {
    const defaultSurvey = surveys.find((s) => s.providerId === currentUser.id) || surveys[0];
    const surveyQs = defaultSurvey ? questions.filter((q) => q.surveyId === defaultSurvey.id) : [];
    const defaultQ = surveyQs[0];
    const def = TOOLBOX_ITEMS.find((t) => t.type === widgetType);

    const newWidget = {
      id: `w_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      type: widgetType,
      title: def?.name || widgetType,
      surveyId: defaultSurvey?.id || '',
      questionId: defaultQ?.id || '',
      colSpan: def?.defaultCol || 1,
      config: {
        metric: 'frequency',
        label: defaultQ?.text || 'Métrica',
      },
    };

    setDashboard((prev) => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }));
  };

  const removeWidget = (idx) => {
    setDashboard((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((_, i) => i !== idx),
    }));
  };

  const toggleColSpan = (idx) => {
    setDashboard((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w, i) => (i === idx ? { ...w, colSpan: w.colSpan === 2 ? 1 : 2 } : w)),
    }));
  };

  const openConfig = (idx) => {
    const w = dashboard.widgets[idx];
    setSelectedWidgetIdx(idx);
    setCfgTitle(w.title || '');
    setCfgSurveyId(w.surveyId || surveys[0]?.id || '');
    setCfgQuestionId(w.questionId || '');
    setCfgColSpan(w.colSpan || 1);
    setCfgMetric(w.config?.metric || 'frequency');
    setConfigModalOpen(true);
  };

  const applyConfig = () => {
    if (selectedWidgetIdx === null) return;
    setDashboard((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w, i) =>
        i === selectedWidgetIdx
          ? {
              ...w,
              title: cfgTitle,
              surveyId: cfgSurveyId,
              questionId: cfgQuestionId,
              colSpan: parseInt(cfgColSpan),
              config: { ...w.config, metric: cfgMetric },
            }
          : w
      ),
    }));
    setConfigModalOpen(false);
  };

  const loadTemplate = () => {
    const s1 = surveys[0] || { id: 'surv_1' };
    const qList = questions.filter((q) => q.surveyId === s1.id);

    setDashboard((prev) => ({
      ...prev,
      title: 'Tablero Ejecutivo Multidimensional (Template)',
      widgets: [
        {
          id: 'w_t1',
          type: 'kpi',
          title: 'Total Encuestados Verificados',
          surveyId: s1.id,
          colSpan: 1,
          config: { metric: 'total_responses', label: 'Muestra Total' },
        },
        {
          id: 'w_t2',
          type: 'kpi',
          title: 'Índice de Aprobación Promedio',
          surveyId: s1.id,
          questionId: qList[1]?.id || '',
          colSpan: 1,
          config: { metric: 'avg_likert', label: 'Satisfacción Global (1 a 5)' },
        },
        {
          id: 'w_t3',
          type: 'pie',
          title: 'Distribución de Preferencias (Pastel)',
          surveyId: s1.id,
          questionId: qList[0]?.id || '',
          colSpan: 1,
          config: {},
        },
        {
          id: 'w_t4',
          type: 'radar',
          title: 'Evaluación Multidimensional (Radar)',
          surveyId: s1.id,
          questionId: qList[1]?.id || '',
          colSpan: 1,
          config: { label: 'Percepción' },
        },
        {
          id: 'w_t5',
          type: 'bar',
          title: 'Comparativa de Segmentos (Barras)',
          surveyId: s1.id,
          questionId: qList[2]?.id || '',
          colSpan: 2,
          config: {},
        },
      ],
    }));
  };

  const handleSave = () => {
    saveCustomDashboard(dashboard);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleGoLive = () => {
    saveCustomDashboard(dashboard);
    navigate(`/provider/dashboard/view/${dashboard.id}`);
  };

  // Helper to calculate data for preview
  const getWidgetChartData = (w) => {
    const q = questions.find((item) => item.id === w.questionId);
    const surveyResponses = responses.filter((r) => r.surveyId === w.surveyId);

    if (w.type === 'line') {
      return {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        values: [3, 6, 9, surveyResponses.length || 12],
      };
    }

    if (!q) {
      return { labels: ['Opción A', 'Opción B', 'Opción C'], values: [12, 19, 7] };
    }

    if (q.type === 'multiple' || q.type === 'yesno') {
      const opts = q.type === 'yesno' ? ['Sí', 'No'] : q.options || [];
      const counts = {};
      opts.forEach((o) => (counts[o] = 0));
      surveyResponses.forEach((r) => {
        const val = r.answers?.[q.id];
        if (val && counts[val] !== undefined) counts[val]++;
      });
      return { labels: Object.keys(counts), values: Object.values(counts) };
    }

    if (q.type === 'likert') {
      const labels = q.labels || ['1 (Bajo)', '2', '3', '4', '5 (Alto)'];
      const counts = [0, 0, 0, 0, 0];
      surveyResponses.forEach((r) => {
        const val = r.answers?.[q.id];
        if (val && val >= 1 && val <= 5) counts[val - 1]++;
      });
      return { labels, values: counts };
    }

    return { labels: ['Muestra'], values: [surveyResponses.length] };
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Studio Header */}
      <div className="glass-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" dot>
              🎨 No-Code BI Studio
            </Badge>
            <span className="text-xs text-slate-400">Constructor de Pantallas Drag & Drop</span>
          </div>
          <input
            type="text"
            value={dashboard.title}
            onChange={(e) => setDashboard({ ...dashboard, title: e.target.value })}
            className="text-xl font-black text-white bg-transparent border-b border-dashed border-slate-700 focus:border-primary focus:outline-none px-1 py-0.5"
            placeholder="Título del Dashboard..."
          />
        </div>

        <div className="flex items-center gap-3">
          <Link to="/provider/dashboards">
            <Button size="sm" variant="outline" icon={FolderKanban}>
              Mis Dashboards
            </Button>
          </Link>
          <Button size="sm" variant="secondary" onClick={loadTemplate} icon={Sparkles}>
            Plantilla Sugerida
          </Button>
          <Button size="sm" variant="primary" onClick={handleSave} icon={Save}>
            Guardar
          </Button>
          <Button size="sm" variant="success" onClick={handleGoLive} icon={Eye}>
            Vista en Vivo
          </Button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 rounded-stitch bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center animate-fade-in">
          ✓ Dashboard guardado exitosamente en la base de datos.
        </div>
      )}

      {/* Main Studio Container */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Toolbox */}
        <div className="w-full lg:w-72 glass-card p-5 shrink-0 sticky top-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">🛠️ Componentes</h3>
            <Badge variant="neutral">{TOOLBOX_ITEMS.length}</Badge>
          </div>
          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
            Arrastra cualquier objeto al lienzo o haz clic para añadirlo:
          </p>

          <div className="space-y-2">
            {TOOLBOX_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  onClick={() => addWidget(item.type)}
                  className="flex items-center gap-3 p-3 rounded-stitch bg-slate-900/60 border border-dashed border-slate-700/80 hover:border-primary hover:bg-primary/5 hover:translate-x-1 cursor-grab active:cursor-grabbing transition-all select-none group"
                >
                  <div className="w-8 h-8 rounded-stitch bg-slate-800 flex items-center justify-center text-primary-light group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-200 truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-primary-light" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Central Canvas (Drop Zone) */}
        <div className="flex-1 w-full">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`min-h-[480px] p-6 rounded-stitch-xl border-2 border-dashed transition-all grid grid-cols-1 md:grid-cols-2 gap-5 ${
              isDragOver
                ? 'border-primary bg-primary/10 shadow-glow'
                : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            {dashboard.widgets.map((widget, idx) => {
              const survey = surveys.find((s) => s.id === widget.surveyId);
              const dataPkg = getWidgetChartData(widget);

              return (
                <div
                  key={widget.id}
                  className={`glass-card p-5 flex flex-col justify-between relative group ${
                    widget.colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1'
                  }`}
                >
                  {/* Widget Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{widget.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-primary-light bg-primary/10 px-2 py-0.5 rounded-full">
                        {survey?.title ? survey.title.slice(0, 16) + '...' : 'Sin vincular'}
                      </span>
                      <button
                        onClick={() => openConfig(idx)}
                        title="⚙️ Configurar datos"
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleColSpan(idx)}
                        title="Cambiar ancho (1 o 2 columnas)"
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <MoveHorizontal className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeWidget(idx)}
                        title="Eliminar widget"
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Widget Body */}
                  <div className="min-h-[220px] flex items-center justify-center">
                    {widget.type === 'kpi' ? (
                      <div className="text-center py-6">
                        <div className="text-4xl font-black text-emerald-400 mb-1">
                          {widget.config?.metric === 'avg_likert'
                            ? '4.2 ★'
                            : responses.filter((r) => r.surveyId === widget.surveyId).length}
                        </div>
                        <div className="text-xs font-semibold text-slate-400">
                          {widget.config?.label || 'Muestra de Respuestas'}
                        </div>
                      </div>
                    ) : widget.type === 'table' ? (
                      <div className="w-full text-xs overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="text-[10px] uppercase text-slate-400 bg-slate-900/60">
                            <tr>
                              <th className="p-2">ID</th>
                              <th className="p-2">Respuesta</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {responses
                              .filter((r) => r.surveyId === widget.surveyId)
                              .slice(0, 3)
                              .map((r) => (
                                <tr key={r.id}>
                                  <td className="p-2 text-slate-400">{r.id}</td>
                                  <td className="p-2 text-slate-200">
                                    {String(Object.values(r.answers || {})[0] || 'Completado')}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <ChartRenderer
                        type={widget.type}
                        labels={dataPkg.labels}
                        data={dataPkg.values}
                        title={widget.title}
                        height={200}
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {dashboard.widgets.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center text-center py-16 text-slate-400">
                <Palette className="w-12 h-12 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">El lienzo está vacío</h3>
                <p className="text-xs max-w-sm text-slate-400 mb-4">
                  Arrastra widgets desde el panel izquierdo (como <strong>Pastel</strong>, <strong>Radar</strong> o{' '}
                  <strong>KPIs</strong>) para empezar a diseñar tu pantalla.
                </p>
                <Button size="sm" variant="outline" onClick={loadTemplate} icon={Sparkles}>
                  Cargar Plantilla Sugerida
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Config Modal */}
      <Modal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        title="⚙️ Vincular Widget a la Base de Datos"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Widget</label>
            <input
              type="text"
              value={cfgTitle}
              onChange={(e) => setCfgTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              🔗 Encuesta Fuente (Base de Datos)
            </label>
            <select
              value={cfgSurveyId}
              onChange={(e) => setCfgSurveyId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            >
              {surveys.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.actualResponses} respuestas)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ❓ Pregunta / Campo a Graficar
            </label>
            <select
              value={cfgQuestionId}
              onChange={(e) => setCfgQuestionId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            >
              {questions
                .filter((q) => q.surveyId === cfgSurveyId)
                .map((q) => (
                  <option key={q.id} value={q.id}>
                    P{q.order}. {q.text} [{q.type}]
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ancho del Widget</label>
              <select
                value={cfgColSpan}
                onChange={(e) => setCfgColSpan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="1">1 Columna (Medio ancho)</option>
                <option value="2">2 Columnas (Ancho completo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Cálculo</label>
              <select
                value={cfgMetric}
                onChange={(e) => setCfgMetric(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="frequency">Distribución de Frecuencia</option>
                <option value="avg_likert">Promedio de Escala (1-5)</option>
                <option value="total_responses">Total de Muestra</option>
              </select>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={applyConfig} className="w-full mt-4">
            Aplicar y Vincular ✓
          </Button>
        </div>
      </Modal>
    </div>
  );
};
