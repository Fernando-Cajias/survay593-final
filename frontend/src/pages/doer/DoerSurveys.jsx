import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Clock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const DoerSurveys = () => {
  const { currentUser } = useAuth();
  const { surveys, responses } = useDatabase();
  const [tab, setTab] = useState('available'); // 'available' | 'completed'

  const myResponses = responses.filter((r) => r.userId === currentUser.id);
  const answeredSurveyIds = myResponses.map((r) => r.surveyId);

  const availableSurveys = surveys.filter((s) => s.status === 'active' && !answeredSurveyIds.includes(s.id));
  const completedSurveys = surveys.filter((s) => answeredSurveyIds.includes(s.id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Explorador de Encuestas 📋</h1>
          <p className="text-xs text-slate-400 mt-1">Elige una encuesta para empezar a generar ganancias en tu wallet.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-800/80 p-1 rounded-stitch border border-slate-700/60">
          <button
            onClick={() => setTab('available')}
            className={`px-4 py-1.5 rounded-stitch text-xs font-bold transition-all ${
              tab === 'available' ? 'bg-primary text-white shadow-glow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Disponibles ({availableSurveys.length})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`px-4 py-1.5 rounded-stitch text-xs font-bold transition-all ${
              tab === 'completed' ? 'bg-primary text-white shadow-glow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Completadas ({completedSurveys.length})
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {tab === 'available' &&
          availableSurveys.map((survey) => (
            <div key={survey.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="primary">{survey.category}</Badge>
                  <span className="text-base font-black text-emerald-400">
                    +${survey.rewardPerResponse?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-1 rounded-stitch border border-emerald-500/20 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Fondo Financiado por Empresa · Recompensa en Custodia (Escrow)</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{survey.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">{survey.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{survey.estimatedTime} min</span>
                </div>
                <Link to={`/doer/survey/${survey.id}`}>
                  <Button size="sm" variant="primary" icon={ArrowRight}>
                    Responder Encuesta
                  </Button>
                </Link>
              </div>
            </div>
          ))}

        {tab === 'completed' &&
          completedSurveys.map((survey) => {
            const resp = myResponses.find((r) => r.surveyId === survey.id);
            return (
              <div key={survey.id} className="glass-card p-6 opacity-85 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="success" dot>
                      Completada
                    </Badge>
                    <span className="text-xs text-slate-400 font-semibold">
                      {resp ? new Date(resp.completedAt).toLocaleDateString('es-EC') : ''}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{survey.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{survey.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Recompensa acreditada (+${survey.rewardPerResponse?.toFixed(2)})</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
