import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { KpiCard } from '../../components/ui/KpiCard';
import { ChartRenderer } from '../../components/charts/ChartRenderer';
import { ArrowLeft, Download, ClipboardList, BarChart3, DollarSign, Target } from 'lucide-react';

export const SurveyResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { surveys, questions, responses } = useDatabase();

  const mySurveys = surveys.filter((s) => s.providerId === currentUser.id);

  if (!id) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-black text-white">Resultados de Investigación 📈</h1>
          <p className="text-xs text-slate-400 mt-1">Selecciona una encuesta para ver su desglose estadístico.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {mySurveys.map((s) => (
            <div key={s.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="primary">{s.category}</Badge>
                  <span className="text-xs text-emerald-400 font-bold">
                    {s.actualResponses} / {s.targetResponses} respuestas
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{s.description}</p>
              </div>
              <Link to={`/provider/results/${s.id}`}>
                <Button size="sm" variant="primary" className="w-full">
                  Ver Análisis Completo →
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const survey = surveys.find((s) => s.id === id);
  const surveyQuestions = questions.filter((q) => q.surveyId === id);
  const surveyResponses = responses.filter((r) => r.surveyId === id);

  if (!survey) {
    return (
      <div className="p-8 text-center glass-card max-w-md mx-auto my-12">
        <h2 className="text-xl font-bold text-white mb-2">Encuesta no encontrada</h2>
        <Button onClick={() => navigate('/provider/results')}>Volver al listado</Button>
      </div>
    );
  }

  const exportCSV = () => {
    const headers = ['ID_Respuesta', 'Fecha', ...surveyQuestions.map((q) => `"${q.text}"`)];
    const rows = surveyResponses.map((r) => [
      r.id,
      new Date(r.completedAt).toLocaleDateString('es-EC'),
      ...surveyQuestions.map((q) => `"${r.answers?.[q.id] || ''}"`),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${survey.title.replace(/\s+/g, '_')}_resultados.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/provider/results')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Resultados
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">{survey.title}</h1>
            <Badge variant="primary">{survey.category}</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">{survey.description}</p>
        </div>

        <Button size="sm" variant="primary" icon={Download} onClick={exportCSV}>
          📥 Exportar CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KpiCard
          title="Muestra Recolectada"
          value={surveyResponses.length}
          subtitle={`De ${survey.targetResponses} objetivo`}
          icon={ClipboardList}
          accent="primary"
        />
        <KpiCard
          title="Presupuesto Ejecutado"
          value={`$${(survey.spent || 0).toFixed(2)}`}
          subtitle={`De $${survey.budget} total`}
          icon={DollarSign}
          accent="warning"
        />
        <KpiCard
          title="Porcentaje de Completado"
          value={`${Math.round((surveyResponses.length / (survey.targetResponses || 1)) * 100)}%`}
          subtitle="Tasa de recolección"
          icon={Target}
          accent="success"
        />
      </div>

      {/* Questions Breakdown */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white">Análisis por Pregunta</h2>

        {surveyQuestions.map((q, idx) => {
          if (q.type === 'multiple' || q.type === 'yesno') {
            const opts = q.type === 'yesno' ? ['Sí', 'No'] : q.options || [];
            const counts = {};
            opts.forEach((o) => (counts[o] = 0));
            surveyResponses.forEach((r) => {
              const val = r.answers?.[q.id];
              if (val && counts[val] !== undefined) counts[val]++;
            });

            return (
              <div key={q.id} className="glass-card p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white">
                    P{idx + 1}. {q.text}
                  </h3>
                  <Badge variant="neutral">{q.type === 'yesno' ? 'Sí / No' : 'Opción Múltiple'}</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <ChartRenderer
                    type="pie"
                    labels={Object.keys(counts)}
                    data={Object.values(counts)}
                    height={220}
                  />
                  <div className="space-y-2">
                    {Object.entries(counts).map(([opt, count]) => {
                      const pct = surveyResponses.length
                        ? Math.round((count / surveyResponses.length) * 100)
                        : 0;
                      return (
                        <div key={opt} className="p-2.5 rounded-stitch bg-slate-900/60 flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-semibold">{opt}</span>
                          <span className="text-white font-bold">
                            {count} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          if (q.type === 'likert') {
            const counts = [0, 0, 0, 0, 0];
            let sum = 0;
            let totalAnswers = 0;
            surveyResponses.forEach((r) => {
              const val = r.answers?.[q.id];
              if (val && val >= 1 && val <= 5) {
                counts[val - 1]++;
                sum += val;
                totalAnswers++;
              }
            });
            const avg = totalAnswers ? (sum / totalAnswers).toFixed(1) : '0.0';

            return (
              <div key={q.id} className="glass-card p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white">
                    P{idx + 1}. {q.text}
                  </h3>
                  <Badge variant="primary">Promedio: {avg} ★</Badge>
                </div>

                <ChartRenderer
                  type="bar"
                  labels={q.labels || ['1 (Bajo)', '2', '3', '4', '5 (Alto)']}
                  data={counts}
                  title="Frecuencia Likert"
                  height={220}
                />
              </div>
            );
          }

          if (q.type === 'text') {
            const textAnswers = surveyResponses.map((r) => r.answers?.[q.id]).filter(Boolean);

            return (
              <div key={q.id} className="glass-card p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white">
                    P{idx + 1}. {q.text}
                  </h3>
                  <Badge variant="neutral">Texto Abierto</Badge>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {textAnswers.map((txt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-stitch bg-slate-900/60 border-l-2 border-l-primary text-xs text-slate-300 italic"
                    >
                      "{txt}"
                    </div>
                  ))}
                  {textAnswers.length === 0 && (
                    <p className="text-xs text-slate-500">Sin respuestas de texto aún.</p>
                  )}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
