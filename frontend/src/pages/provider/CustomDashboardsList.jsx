import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Palette, Eye, Edit, Trash2, Plus } from 'lucide-react';

export const CustomDashboardsList = () => {
  const { currentUser } = useAuth();
  const { customDashboards, deleteCustomDashboard } = useDatabase();

  const myDashboards = customDashboards.filter(
    (d) => d.providerId === currentUser.id || !d.providerId || d.providerId === 'prov_1'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Mis Dashboards Personalizados 📂</h1>
          <p className="text-xs text-slate-400 mt-1">
            Pantallas analíticas creadas a medida para presentaciones ejecutivas y toma de decisiones.
          </p>
        </div>

        <Link to="/provider/studio">
          <Button size="sm" variant="primary" icon={Plus}>
            Crear Nuevo Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {myDashboards.map((dash) => (
          <div key={dash.id} className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="success" dot>
                  {dash.widgets?.length || 0} Widgets
                </Badge>
                <span className="text-xs text-slate-400">
                  {new Date(dash.createdAt).toLocaleDateString('es-EC')}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{dash.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {dash.description || 'Dashboard con métricas personalizadas.'}
              </p>

              {/* Widgets tag preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {dash.widgets?.slice(0, 4).map((w, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                  >
                    {w.type === 'pie' ? '🥧 Pastel' : w.type === 'radar' ? '🕸️ Radar' : w.type === 'bar' ? '📊 Barras' : '🎯 KPI'}
                  </span>
                ))}
                {dash.widgets?.length > 4 && (
                  <span className="text-[11px] text-slate-400 px-1 py-0.5">
                    +{dash.widgets.length - 4} más
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <Link to={`/provider/dashboard/view/${dash.id}`}>
                <Button size="sm" variant="primary" icon={Eye}>
                  Ver en Vivo
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Link to={`/provider/studio/edit/${dash.id}`}>
                  <Button size="sm" variant="outline" icon={Edit}>
                    Editar
                  </Button>
                </Link>
                <button
                  onClick={() => deleteCustomDashboard(dash.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                  title="Eliminar dashboard"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {myDashboards.length === 0 && (
          <div className="col-span-2 text-center py-16 glass-card">
            <Palette className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Sin dashboards creados</h3>
            <p className="text-xs text-slate-400 mb-4">Abre el Dashboard Studio para diseñar tu primera pantalla.</p>
            <Link to="/provider/studio">
              <Button size="sm" variant="primary">
                Abrir No-Code Studio →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
