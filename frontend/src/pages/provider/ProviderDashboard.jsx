import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { useOrganization } from '../../context/OrganizationContext';
import { KpiCard } from '../../components/ui/KpiCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ChartRenderer } from '../../components/charts/ChartRenderer';
import {
  PlusCircle,
  Palette,
  ClipboardList,
  BarChart3,
  DollarSign,
  Target,
  School,
  Calendar,
  Building2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { surveys } = useDatabase();
  const { currentOrg, currentPeriod, periods, switchPeriod } = useOrganization();

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

  // No org registered yet → prompt onboarding
  const needsOnboarding = !currentOrg;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Institution Header with Period Selector */}
      {currentOrg ? (
        <div className="glass-card p-5 bg-gradient-to-r from-primary/10 via-slate-800/50 to-secondary/10 border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-stitch bg-primary/20 border border-primary/40 flex items-center justify-center">
                <School className="w-6 h-6 text-primary-light" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">{currentOrg.name}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Building2 className="w-3 h-3" />
                  <span>{currentOrg.type === 'school' ? 'Escuela' : currentOrg.type === 'unidad_educativa' ? 'Unidad Educativa' : currentOrg.type === 'colegio' ? 'Colegio' : 'Institución'}</span>
                  <span>·</span>
                  <span>{currentOrg.city}</span>
                  {currentOrg.rectorName && (
                    <>
                      <span>·</span>
                      <span>Dir: {currentOrg.rectorName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Period Selector */}
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-stitch border border-slate-700">
                <Calendar className="w-4 h-4 text-primary-light" />
                <select
                  value={currentPeriod?.id || ''}
                  onChange={(e) => switchPeriod(e.target.value)}
                  className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
                >
                  {periods.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900">
                      {p.name} {p.isCurrent ? '(Actual)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <Link to="/provider/studio">
                <Button size="sm" variant="secondary" icon={Palette}>
                  BI Studio
                </Button>
              </Link>
              <Link to="/provider/create">
                <Button size="sm" variant="primary" icon={PlusCircle}>
                  Nueva Encuesta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Onboarding Prompt */
        <div className="glass-card p-8 text-center border-dashed border-2 border-primary/40 bg-primary/5">
          <School className="w-12 h-12 text-primary-light mx-auto mb-3" />
          <h2 className="text-xl font-black text-white mb-2">¡Bienvenido! Configura tu Institución Educativa</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
            Registra los datos de tu colegio o escuela para activar el sistema Multi-Tenant y comenzar a crear encuestas con plantillas educativas profesionales.
          </p>
          <Button
            size="lg"
            variant="primary"
            icon={ArrowRight}
            onClick={() => navigate('/provider/onboarding')}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black"
          >
            Registrar Mi Institución en 3 Pasos 🏫
          </Button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <KpiCard
          title="Encuestas Activas"
          value={activeSurveys.length}
          subtitle={currentPeriod ? currentPeriod.name : 'Todas las campañas'}
          icon={ClipboardList}
          accent="primary"
        />
        <KpiCard
          title="Respuestas Totales"
          value={totalResponses}
          subtitle="Datos recopilados verificados"
          icon={BarChart3}
          accent="secondary"
        />
        <KpiCard
          title="Inversión Realizada"
          value={`$${totalSpent.toFixed(2)}`}
          subtitle="Liquidado a encuestados"
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
          <h2 className="text-lg font-bold text-white">
            {currentOrg ? `Encuestas de ${currentOrg.name}` : 'Mis Campañas de Investigación'}
          </h2>
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
                      ${s.spent?.toFixed(0) || 0} / ${s.budget?.toFixed(0) || 0}
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

              {mySurveys.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 text-xs">
                    {needsOnboarding
                      ? 'Registra tu institución para comenzar a crear encuestas educativas.'
                      : 'Aún no has creado ninguna encuesta. ¡Crea tu primera campaña!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
