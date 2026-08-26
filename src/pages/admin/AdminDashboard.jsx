import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { KpiCard } from '../../components/ui/KpiCard';
import { Badge } from '../../components/ui/Badge';
import { ChartRenderer } from '../../components/charts/ChartRenderer';
import { Users, ClipboardList, ShieldCheck, DollarSign, Layers } from 'lucide-react';

export const AdminDashboard = () => {
  const { users } = useAuth();
  const { surveys, responses, transactions } = useDatabase();

  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.verified).length;
  const totalResponses = responses.length;
  const totalVolume = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Panel de Administración Kolab 🔧</h1>
        <p className="text-xs text-slate-400 mt-1">Supervisión central del Proyecto #1 (Survey 593) y calidad de datos.</p>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <KpiCard
          title="Usuarios Registrados"
          value={totalUsers}
          subtitle={`${verifiedUsers} con verificación KYC`}
          icon={Users}
          accent="primary"
        />
        <KpiCard
          title="Encuestas Totales"
          value={surveys.length}
          subtitle={`${surveys.filter((s) => s.status === 'active').length} activas en red`}
          icon={ClipboardList}
          accent="secondary"
        />
        <KpiCard
          title="Respuestas Registradas"
          value={totalResponses}
          subtitle="100% validadas anti-fraude"
          icon={ShieldCheck}
          accent="success"
        />
        <KpiCard
          title="Volumen Transaccional"
          value={`$${totalVolume.toFixed(2)}`}
          subtitle="Comisiones y pagos monetizados"
          icon={DollarSign}
          accent="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Distribución de Usuarios por Rol</h3>
          <ChartRenderer
            type="doughnut"
            labels={['Encuestados (Doers)', 'Empresas (Providers)', 'Admins']}
            data={[
              users.filter((u) => u.role === 'doer').length,
              users.filter((u) => u.role === 'provider').length,
              users.filter((u) => u.role === 'admin').length,
            ]}
            height={220}
          />
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-white mb-4">Volumen de Actividad Mensual</h3>
          <ChartRenderer
            type="bar"
            labels={['Mayo', 'Junio', 'Julio', 'Agosto']}
            data={[120, 240, 380, 520]}
            title="Encuestas procesadas"
            height={220}
          />
        </div>
      </div>
    </div>
  );
};
