import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { KpiCard } from '../../components/ui/KpiCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Wallet, ClipboardList, Flame, ArrowRight, Clock, DollarSign } from 'lucide-react';

export const DoerDashboard = () => {
  const { currentUser } = useAuth();
  const { surveys, responses } = useDatabase();

  const myResponses = responses.filter((r) => r.userId === currentUser.id);
  const answeredSurveyIds = myResponses.map((r) => r.surveyId);
  const availableSurveys = surveys.filter((s) => s.status === 'active' && !answeredSurveyIds.includes(s.id));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">¡Hola, {currentUser.name}! 👋</h1>
          <p className="text-xs text-slate-400 mt-1">
            Gana dinero respondiendo encuestas verificadas y monetiza tu opinión.
          </p>
        </div>
        <Link to="/doer/surveys">
          <Button size="sm" variant="primary" icon={ClipboardList}>
            Explorar Encuestas
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <KpiCard
          title="Saldo Disponible"
          value={`$${(currentUser.balance || 0).toFixed(2)}`}
          subtitle="Listo para retirar a cuenta"
          icon={Wallet}
          accent="success"
        />
        <KpiCard
          title="Completadas"
          value={myResponses.length}
          subtitle="Encuestas remuneradas"
          icon={ClipboardList}
          accent="primary"
        />
        <KpiCard
          title="Racha Activa"
          value={`${currentUser.streak || 0} Días`}
          subtitle="¡Bono de +10% en pagos!"
          icon={Flame}
          accent="warning"
        />
        <KpiCard
          title="Disponibles"
          value={availableSurveys.length}
          subtitle="Nuevas oportunidades hoy"
          icon={DollarSign}
          accent="secondary"
        />
      </div>

      {/* Available Surveys Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Encuestas Disponibles para Ti</h2>
          <Link to="/doer/surveys" className="text-xs text-primary-light font-semibold hover:underline">
            Ver todas →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {availableSurveys.slice(0, 4).map((survey) => (
            <div key={survey.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="primary">{survey.category}</Badge>
                  <span className="text-base font-black text-emerald-400">
                    +${survey.rewardPerResponse?.toFixed(2)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{survey.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{survey.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{survey.estimatedTime} min</span>
                </div>
                <Link to={`/doer/survey/${survey.id}`}>
                  <Button size="sm" variant="primary" icon={ArrowRight}>
                    Responder
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {availableSurveys.length === 0 && (
            <div className="col-span-2 text-center py-12 glass-card">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-base font-bold text-white">¡Estás al día!</h3>
              <p className="text-xs text-slate-400 mt-1">Has completado todas las encuestas disponibles por ahora.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
