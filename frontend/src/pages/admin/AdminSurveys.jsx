import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Badge } from '../../components/ui/Badge';

export const AdminSurveys = () => {
  const { surveys, responses } = useDatabase();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Auditoría Global de Encuestas 📋</h1>
        <p className="text-xs text-slate-400 mt-1">Supervisión de todas las campañas en el ecosistema.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
            <tr>
              <th className="p-4">Título</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Respuestas</th>
              <th className="p-4">Presupuesto</th>
              <th className="p-4">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs">
            {surveys.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-white text-sm">{s.title}</td>
                <td className="p-4">
                  <Badge variant="primary">{s.category}</Badge>
                </td>
                <td className="p-4">
                  <Badge variant={s.status === 'active' ? 'success' : 'neutral'} dot>
                    {s.status}
                  </Badge>
                </td>
                <td className="p-4 font-bold text-white">
                  {s.actualResponses} / {s.targetResponses}
                </td>
                <td className="p-4 text-slate-300 font-semibold">${s.budget}</td>
                <td className="p-4 text-slate-400">
                  {new Date(s.createdAt).toLocaleDateString('es-EC')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
