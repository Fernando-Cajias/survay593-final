import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DoerProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [name, setName] = useState(currentUser.name || '');
  const [city, setCity] = useState(currentUser.city || 'Quito');
  const [age, setAge] = useState(currentUser.age || 25);
  const [gender, setGender] = useState(currentUser.gender || 'F');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, city, age: parseInt(age), gender });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
    </div>
  );
};
