import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const AdminQuality = () => {
  const arcoChecklist = [
    { name: 'Acceso a Datos Personales', desc: 'Los usuarios pueden descargar su historial de respuestas en formato CSV.', status: 'compliant' },
    { name: 'Rectificación de Perfil', desc: 'Edición libre de datos demográficos desde el panel de usuario.', status: 'compliant' },
    { name: 'Cancelación / Olvido', desc: 'Opción de solicitar el borrado permanente de datos personales.', status: 'compliant' },
    { name: 'Oposición de Segmentación', desc: 'Consentimiento explícito al responder encuestas corporativas.', status: 'compliant' },
    { name: 'Portabilidad y Transparencia (+)', desc: 'Esquema de datos estándar compatible con los otros 15 proyectos Kolab.', status: 'compliant' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white">Calidad de Datos & Cumplimiento ARCO+ ✨</h1>
        <p className="text-xs text-slate-400 mt-1">Supervisión de privacidad y cumplimiento normativo de protección de datos personales.</p>
      </div>

      <div className="glass-card p-6 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white">Estado del Sistema: 100% Conforme</h3>
            <p className="text-xs text-slate-400">Todas las políticas de protección de datos ecuatorianas y directivas ARCO+ están activas.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-white">Checklist de Cumplimiento ARCO+</h2>
        {arcoChecklist.map((item, idx) => (
          <div key={idx} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
            <Badge variant="success" dot>Cumple</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
