import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, CheckCircle2, FileText, Upload } from 'lucide-react';

export const DoerVerification = () => {
  const { currentUser, updateProfile } = useAuth();
  const [docNumber, setDocNumber] = useState('1720394851');
  const [verified, setVerified] = useState(currentUser.verified || false);
  const [success, setSuccess] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    updateProfile({ verified: true });
    setVerified(true);
    setSuccess(true);
  };

  return (
    <div className="max-w-xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Verificación de Identidad (KYC) 🛡️</h1>
        <p className="text-xs text-slate-400 mt-1">
          Eliminamos el fraude validando la identidad de nuestros encuestados para garantizar datos 100% reales.
        </p>
      </div>

      <div className="glass-card p-6 border-l-4 border-l-primary space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary-light" /> Beneficios de una cuenta verificada:
        </h3>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
          <li>Acceso a encuestas premium con pagos de hasta <strong>$5.00 USD</strong>.</li>
          <li>Retiros bancarios prioritarios sin límite de monto diario.</li>
          <li>Insignia de confianza en el ecosistema Kolab.</li>
        </ul>
      </div>

      {verified ? (
        <div className="glass-card p-8 text-center bg-emerald-500/10 border-emerald-500/30">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">¡Tu cuenta está 100% Verificada!</h2>
          <p className="text-xs text-slate-400">Has superado la validación de identidad KYC de Survey 593.</p>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="glass-card p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Número de Cédula de Identidad (Ecuador)
            </label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="17xxxxxxxx"
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Foto Frontal de la Cédula</label>
            <div className="p-6 rounded-stitch border-2 border-dashed border-slate-700 text-center bg-slate-900/40 hover:border-primary cursor-pointer transition-colors">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-300">Arrastra una imagen o haz clic para subir</div>
              <div className="text-[10px] text-slate-500 mt-1">PNG, JPG o PDF hasta 5MB</div>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
            Verificar Identidad Ahora
          </Button>
        </form>
      )}
    </div>
  );
};
