import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PlusCircle, BarChart3, Clock, DollarSign } from 'lucide-react';

export const ProviderCampaigns = () => {
  const { currentUser } = useAuth();
  const { surveys } = useDatabase();

  const mySurveys = surveys.filter((s) => s.providerId === currentUser.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Mis Campañas 📋</h1>
          <p className="text-xs text-slate-400 mt-1">Administra tus encuestas activas y finalizadas.</p>
        </div>
        <Link to="/provider/create">
          <Button size="sm" variant="primary" icon={PlusCircle}>
            Nueva Encuesta
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {mySurveys.map((survey) => {
          const pct = survey.targetResponses
            ? Math.round((survey.actualResponses / survey.targetResponses) * 100)
            : 0;

          return (
            <div key={survey.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={survey.status === 'active' ? 'success' : 'neutral'} dot>
                    {survey.status === 'active' ? 'Activa' : 'Finalizada'}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(survey.createdAt).toLocaleDateString('es-EC')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{survey.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{survey.description}</p>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>Respuestas:</span>
                    <span>
                      {survey.actualResponses} / {survey.targetResponses} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="text-xs text-slate-400 font-medium">
                  Presupuesto: <strong className="text-white">${survey.budget}</strong>
                </div>
                <Link to={`/provider/results/${survey.id}`}>
                  <Button size="sm" variant="primary" icon={BarChart3}>
                    Ver Resultados
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
