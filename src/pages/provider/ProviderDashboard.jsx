import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { KpiCard } from '../../components/ui/KpiCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ChartRenderer } from '../../components/charts/ChartRenderer';
import { PlusCircle, Palette, ClipboardList, BarChart3, DollarSign, Target } from 'lucide-react';

export const ProviderDashboard = () => {
  const { currentUser } = useAuth();
  const { surveys } = useDatabase();

  const mySurveys = surveys.filter((s) => s.providerId === currentUser.id);
  const activeSurveys = mySurveys.filter((s) => s.status === 'active');
  const totalResponses = mySurveys.reduce((sum, s) => sum + (s.actualResponses || 0), 0);
  const totalSpent = mySurveys.reduce((sum, s) => sum + (s.spent || 0), 0);
  const avgCompletion = mySurveys.length
    ? Math.round(
        mySurveys.reduce(
          (sum, s) => sum + (s.targetResponses ? (s.actualResponses / s.targetResponses) * 100 : 0),
          0
        ) / mySurveys.length
      )
    : 0;

  // Chart data
  const surveyLabels = activeSurveys.map((s) => (s.title.length > 20 ? s.title.slice(0, 20) + '...' : s.title));
  const surveyData = activeSurveys.map((s) => s.actualResponses || 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard Empresarial 📊</h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser.company || currentUser.name} · {currentUser.industry || 'Empresa'}
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/provider/studio">
            <Button size="sm" variant="secondary" icon={Palette}>
              🎨 No-Code BI Studio
            </Button>
          </Link>
          <Link to="/provider/create">
            <Button size="sm" variant="primary" icon={PlusCircle}>
              Crear Encuesta
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <KpiCard
          title="Encuestas Activas"
          value={activeSurveys.length}
          subtitle="Campañas en recolección"
          icon={ClipboardList}
          accent="primary"
        />
        <KpiCard
          title="Respuestas Totales"
          value={totalResponses}
          subtitle="Datos recopilados"
          icon={BarChart3}
          accent="secondary"
        />
        <KpiCard
          title="Inversión Realizada"
          value={`$${totalSpent.toFixed(2)}`}
          subtitle="Pagados a encuestados"
          icon={DollarSign}
          accent="warning"
        />
        <KpiCard
          title="Completado Promedio"
          value={`${avgCompletion}%`}
          subtitle="Tasa de avance global"
          icon={Target}
          accent="success"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Respuestas por Encuesta Activa</h3>
          <ChartRenderer type="bar" labels={surveyLabels} data={surveyData} title="Respuestas" height={240} />
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Tendencia Semanal de Respuestas</h3>
          <ChartRenderer
            type="line"
            labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']}
            data={[4, 7, 12, 18, 14, 9, 11]}
            title="Respuestas diarias"
            height={240}
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Mis Campañas de Investigación</h2>
          <Link to="/provider/campaigns" className="text-xs text-primary-light font-semibold hover:underline">
            Ver todas →
          </Link>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="p-4">Encuesta</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Respuestas</th>
                <th className="p-4">Presupuesto</th>
                <th className="p-4">Progreso</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {mySurveys.map((s) => {
                const percent = s.targetResponses ? Math.round((s.actualResponses / s.targetResponses) * 100) : 0;
                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{s.title}</div>
                      <div className="text-[11px] text-slate-400">{s.category}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={s.status === 'active' ? 'success' : 'neutral'} dot>
                        {s.status === 'active' ? 'Activa' : 'Finalizada'}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-200 font-semibold">
                      {s.actualResponses} / {s.targetResponses}
                    </td>
                    <td className="p-4 text-slate-300">
                      ${s.spent.toFixed(0)} / ${s.budget}
                    </td>
                    <td className="p-4 min-w-[120px]">
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">{percent}%</span>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/provider/results/${s.id}`}>
                        <Button size="sm" variant="ghost">
                          Ver Resultados
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
