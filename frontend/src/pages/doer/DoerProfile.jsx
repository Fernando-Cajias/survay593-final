import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, ShieldCheck, CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { AccountCancellationModal } from '../../components/account/AccountCancellationModal';

export const DoerProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [name, setName] = useState(currentUser.name || '');
  const [city, setCity] = useState(currentUser.city || 'Quito');
  const [age, setAge] = useState(currentUser.age || 25);
  const [gender, setGender] = useState(currentUser.gender || 'F');
  const [saved, setSaved] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, city, age: parseInt(age), gender });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const balance = parseFloat(currentUser?.balance) || 0;

  return (
    <div className="max-w-xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Mi Perfil de Usuario 👤</h1>
          <p className="text-xs text-slate-400 mt-1">Mantén tu información demográfica actualizada para recibir más encuestas.</p>
        </div>
        <Badge variant={currentUser.verified ? 'success' : 'warning'} dot>
          {currentUser.verified ? 'Verificado KYC' : 'Sin Verificar'}
        </Badge>
      </div>

      {saved && (
        <div className="p-3 rounded-stitch bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Perfil guardado correctamente.
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico (No editable)</label>
          <input
            type="email"
            disabled
            value={currentUser.email}
            className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900/50 border border-slate-800 text-slate-500 text-sm cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad de Residencia</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            >
              <option value="Quito">Quito</option>
              <option value="Guayaquil">Guayaquil</option>
              <option value="Cuenca">Cuenca</option>
              <option value="Ambato">Ambato</option>
              <option value="Manta">Manta</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Edad</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Género</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
          >
            <option value="F">Femenino (F)</option>
            <option value="M">Masculino (M)</option>
            <option value="Otro">Otro / No especificar</option>
          </select>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full mt-4">
          Guardar Cambios
        </Button>
      </form>

      {/* Zona de Peligro & Finiquito Legal: Darse de Baja */}
      <div className="p-6 rounded-stitch bg-red-950/20 border border-red-500/30 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Zona de Peligro: Darse de Baja
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Si ya no deseas formar parte de la plataforma Survey 593, puedes solicitar el cierre definitivo de tu cuenta y la supresión de tus datos personales conforme a la LOPDP del Ecuador.
            </p>
          </div>
          {balance > 0 && (
            <Badge variant="warning" className="shrink-0">
              Saldo: ${balance.toFixed(2)} USD
            </Badge>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Liquidación Financiera y Finiquito:
          </div>
          <p className="text-slate-400">
            {balance > 0
              ? `Dispones de un saldo de $${balance.toFixed(2)} USD. Al iniciar el proceso de baja, podrás ingresar tu cuenta bancaria ecuatoriana para solicitar la liquidación de haberes o acordar el finiquito correspondiente.`
              : 'Tu cuenta no registra saldos pendientes. La baja definitiva se procesará de forma inmediata con emisión de comprobante de desvinculación.'}
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setIsCancelModalOpen(true)}
            className="px-4 py-2.5 rounded-stitch bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 hover:border-red-500 text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" /> Darse de Baja de la Plataforma
          </button>
        </div>
      </div>

      {/* Modal de Cancelación & Finiquito */}
      <AccountCancellationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
};
