import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { KpiCard } from '../../components/ui/KpiCard';
import { Badge } from '../../components/ui/Badge';
import { CreditCard, DollarSign, Wallet, ArrowUpRight } from 'lucide-react';

export const ProviderBilling = () => {
  const { currentUser } = useAuth();
  const { surveys } = useDatabase();

  const mySurveys = surveys.filter((s) => s.providerId === currentUser.id);
  const totalBudget = mySurveys.reduce((s, sv) => s + (sv.budget || 0), 0);
  const totalSpent = mySurveys.reduce((s, sv) => s + (sv.spent || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Facturación y Presupuestos 💳</h1>
        <p className="text-xs text-slate-400 mt-1">Control de inversión publicitaria y saldo de cuenta corporativa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KpiCard
          title="Saldo en Cuenta"
          value={`$${(currentUser.balance || 0).toLocaleString()}`}
          subtitle="Disponible para nuevas campañas"
          icon={Wallet}
          accent="primary"
        />
        <KpiCard
          title="Inversión Ejecutada"
          value={`$${totalSpent.toFixed(2)}`}
          subtitle="Gastado en respuestas verificadas"
          icon={DollarSign}
          accent="warning"
        />
        <KpiCard
          title="Presupuesto Comprometido"
          value={`$${totalBudget.toFixed(2)}`}
          subtitle="Total acumulado asignado"
          icon={CreditCard}
          accent="secondary"
        />
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-4">Desglose de Gastos por Encuesta</h2>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="p-4">Encuesta</th>
                <th className="p-4">Presupuesto</th>
                <th className="p-4">Gastado</th>
                <th className="p-4">Restante</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {mySurveys.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white text-sm">{s.title}</td>
                  <td className="p-4 text-slate-300 font-semibold">${s.budget}</td>
                  <td className="p-4 text-slate-300 font-semibold">${s.spent.toFixed(2)}</td>
                  <td className="p-4 text-emerald-400 font-bold">${(s.budget - s.spent).toFixed(2)}</td>
                  <td className="p-4">
                    <Badge variant={s.status === 'active' ? 'success' : 'neutral'} dot>
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
