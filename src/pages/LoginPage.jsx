import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { User, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('doer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');

  const { login, register, loginAs } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!email || !password || !name) {
        setError('Por favor completa todos los campos requeridos');
        return;
      }
      const res = register({ email, password, name, company, role });
      if (res.success) {
        navigate(role === 'provider' ? '/provider' : '/doer');
      } else {
        setError(res.message);
      }
    } else {
      if (!email || !password) {
        setError('Ingresa tu correo y contraseña');
        return;
      }
      const res = login(email, password);
      if (res.success) {
        const target = res.user.role === 'provider' ? '/provider' : res.user.role === 'admin' ? '/admin' : '/doer';
        navigate(target);
      } else {
        setError(res.message);
      }
    }
  };

  const handleQuickDemo = (userId, targetRole) => {
    loginAs(userId);
    navigate(targetRole === 'provider' ? '/provider' : targetRole === 'admin' ? '/admin' : '/doer');
  };

  return (
    <div className="min-h-screen bg-[#0B1121] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#1E293B] border border-slate-700/60 rounded-stitch-xl p-8 shadow-2xl relative z-10 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-stitch bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-xl mx-auto mb-3 shadow-glow-sm">
            S5
          </div>
          <h2 className="text-2xl font-black text-white">{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister ? 'Únete a la red de Survey 593' : 'Accede a tus encuestas y dashboards'}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-5 rounded-stitch bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              {/* Role selector */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setRole('doer')}
                  className={`p-3 rounded-stitch border text-center transition-all ${
                    role === 'doer'
                      ? 'border-primary bg-primary/10 text-primary-light font-bold shadow-glow-sm'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <User className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs">Encuestado (Doer)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`p-3 rounded-stitch border text-center transition-all ${
                    role === 'provider'
                      ? 'border-secondary bg-secondary/10 text-secondary-light font-bold'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <Building2 className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs">Empresa (Provider)</div>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {role === 'provider' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Empresa</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ej: Corporación Andina"
                    className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <Button type="submit" size="lg" variant="primary" className="w-full mt-2">
            {isRegister ? 'Completar Registro' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-primary-light hover:underline font-semibold"
          >
            {isRegister ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate gratis'}
          </button>
        </div>

        {/* Quick Demo Logins */}
        <div className="mt-8 pt-6 border-t border-slate-700/60">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            Acceso Rápido para Demostración:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo('doer_1', 'doer')}
              className="p-2 rounded-stitch bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 text-xs font-medium text-center transition-colors"
            >
              👤 María G.
              <div className="text-[10px] text-slate-400">Encuestado</div>
            </button>
            <button
              onClick={() => handleQuickDemo('prov_1', 'provider')}
              className="p-2 rounded-stitch bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 text-xs font-medium text-center transition-colors"
            >
              🏢 Textil Andina
              <div className="text-[10px] text-slate-400">Empresa</div>
            </button>
            <button
              onClick={() => handleQuickDemo('admin_1', 'admin')}
              className="p-2 rounded-stitch bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 text-xs font-medium text-center transition-colors"
            >
              🔧 Admin Kolab
              <div className="text-[10px] text-slate-400">SuperAdmin</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
