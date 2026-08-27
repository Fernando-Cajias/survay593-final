import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ChartRenderer } from '../../components/charts/ChartRenderer';
import { ArrowLeft, Edit, Printer, Filter, Sparkles } from 'lucide-react';

export const LiveDashboardView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users } = useAuth();
  const { customDashboards, questions, responses, surveys } = useDatabase();

  const dashboard = customDashboards.find((d) => d.id === id);

  const [filterCity, setFilterCity] = useState('all');
  const [filterGender, setFilterGender] = useState('all');

  if (!dashboard) {
    return (
      <div className="p-8 text-center glass-card max-w-md mx-auto my-12">
        <h2 className="text-xl font-bold text-white mb-2">Dashboard no encontrado</h2>
        <Button onClick={() => navigate('/provider/dashboards')}>Volver a Mis Dashboards</Button>
      </div>
    );
  }

  // Filter calculation
  const getFilteredChartData = (w) => {
    const q = questions.find((item) => item.id === w.questionId);
    let surveyResponses = responses.filter((r) => r.surveyId === w.surveyId);

    // Apply Live Demographic Filters
    if (filterCity !== 'all') {
      surveyResponses = surveyResponses.filter((r) => {
        const u = users.find((user) => user.id === r.userId);
        return u && u.city === filterCity;
      });
    }

    if (filterGender !== 'all') {
      surveyResponses = surveyResponses.filter((r) => {
        const u = users.find((user) => user.id === r.userId);
        return u && u.gender === filterGender;
      });
    }

    if (w.type === 'line') {
      return {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        values: [2, 5, 8, surveyResponses.length || 10],
      };
    }

    if (!q) {
      return { labels: ['Opción A', 'Opción B', 'Opción C'], values: [10, 15, 8] };
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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/provider/dashboards')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Mis Dashboards
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">{dashboard.title}</h1>
            <Badge variant="success" dot>
              🟢 Modo Presentación / En Vivo
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">{dashboard.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/provider/studio/edit/${dashboard.id}`}>
            <Button size="sm" variant="outline" icon={Edit}>
              Editar Layout
            </Button>
          </Link>
          <Button size="sm" variant="primary" icon={Printer} onClick={() => window.print()}>
            Exportar / Imprimir
          </Button>
        </div>
      </div>

      {/* Interactive Demographic Filter Bar */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4 border-l-4 border-l-primary">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Filter className="w-4 h-4 text-primary-light" />
          <span>Filtros Demográficos en Vivo:</span>
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">Ciudad:</span>
          {['all', 'Quito', 'Guayaquil', 'Cuenca'].map((city) => (
            <button
              key={city}
              onClick={() => setFilterCity(city)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                filterCity === city
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {city === 'all' ? 'Todas' : city}
            </button>
          ))}
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-1.5 sm:ml-auto">
          <span className="text-xs text-slate-400">Género:</span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'F', label: 'Mujeres (F)' },
            { id: 'M', label: 'Hombres (M)' },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setFilterGender(g.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                filterGender === g.id
                  ? 'bg-secondary text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboard.widgets?.map((widget) => {
          const dataPkg = getFilteredChartData(widget);

          return (
            <div
              key={widget.id}
              className={`glass-card p-6 flex flex-col justify-between ${
                widget.colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-sm font-bold text-white">{widget.title}</h3>
                <Badge variant="neutral" className="text-[10px]">
                  {widget.type}
                </Badge>
              </div>

              <div className="min-h-[220px] flex items-center justify-center">
                {widget.type === 'kpi' ? (
                  <div className="text-center py-6">
                    <div className="text-5xl font-black text-emerald-400 mb-1">
                      {widget.config?.metric === 'avg_likert'
                        ? '4.2 ★'
                        : responses.filter((r) => r.surveyId === widget.surveyId).length}
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      {widget.config?.label || 'Muestra Filtrada'}
                    </div>
                  </div>
                ) : (
                  <ChartRenderer
                    type={widget.type}
                    labels={dataPkg.labels}
                    data={dataPkg.values}
                    title={widget.title}
                    height={220}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
