import React from 'react';
import { Layers, Database, ArrowUpRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const AdminEcosystem = () => {
  const projects = [
    { num: 1, name: 'Survey 593', status: 'Activo (Core)', desc: 'Motor de recolección y monetización de datos primarios.', dataSync: 'Fuente Primaria' },
    { num: 2, name: 'Kolab Auth SSO', status: 'En Integración', desc: 'Sistema único de autenticación para todos los módulos.', dataSync: 'Lectura Perfiles' },
    { num: 3, name: 'Kolab Market', status: 'Planificado', desc: 'E-commerce de productos locales segmentados con datos de consumo.', dataSync: 'Insights Hábitos' },
    { num: 4, name: 'Kolab Health BI', status: 'Planificado', desc: 'Analítica preventiva basada en encuestas de salud pública.', dataSync: 'Insights Médicos' },
    { num: 5, name: 'Kolab Fintech', status: 'Planificado', desc: 'Microcréditos y billeteras digitales para encuestados activos.', dataSync: 'Historial Wallets' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white">Ecosistema Kolab (16 Proyectos) 🌱</h1>
        <p className="text-xs text-slate-400 mt-1">
          Survey 593 actúa como el vendedor y motor de datos primarios para toda la suite de productos Kolab.
        </p>
      </div>

      <div className="glass-card p-6 border-l-4 border-l-primary flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-primary-light uppercase tracking-wider">Proyecto Pilar #1</div>
          <h2 className="text-lg font-black text-white mt-0.5">Survey 593 Data Hub</h2>
          <p className="text-xs text-slate-400 mt-1">Alimentando perfiles demográficos verificados a los próximos 15 proyectos.</p>
        </div>
        <Badge variant="primary" dot>Activo</Badge>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-white">Interconexión con Proyectos del Ecosistema</h2>
        {projects.map((p) => (
          <div key={p.num} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-stitch bg-slate-800 flex items-center justify-center font-bold text-xs text-primary-light">
                #{p.num}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {p.name}
                  <span className="text-[10px] font-semibold text-slate-400">({p.dataSync})</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
              </div>
            </div>
            <Badge variant={p.status.includes('Activo') ? 'success' : 'neutral'}>{p.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
