import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { User, Building2, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('doer'); // 'doer' | 'provider'

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('Tecnología');
  const [city, setCity] = useState('Quito');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('F');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isRegister) {
      if (!name.trim() || !email.trim() || !password) {
        setError('Por favor completa todos los campos requeridos.');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (role === 'provider' && !company.trim()) {
        setError('Por favor ingresa el nombre o razón social de tu empresa.');
        return;
      }

      setLoading(true);
      const res = await register({
        name,
        email,
        password,
        role,
        company,
        industry,
        city,
        gender,
        age,
      });
      setLoading(false);

      if (res.success) {
        setSuccessMsg('¡Cuenta creada exitosamente! Redirigiendo a tu panel...');
        setTimeout(() => {
          navigate(role === 'provider' ? '/provider' : '/doer');
        }, 1000);
      } else {
        setError(res.message);
      }
    } else {
      if (!email.trim() || !password) {
        setError('Ingresa tu correo electrónico y contraseña.');
        return;
      }

      setLoading(true);
      const res = await login(email, password);
      setLoading(false);

      if (res.success) {
        const target =
          res.user.role === 'provider' ? '/provider' : res.user.role === 'admin' ? '/admin' : '/doer';
        navigate(target);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1121] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700/60 rounded-stitch-xl p-8 shadow-2xl relative z-10 animate-scale-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-11 h-11 rounded-stitch bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-lg shadow-glow-sm">
              S5
            </div>
          </Link>
          <h2 className="text-2xl font-black text-white">
            {isRegister ? 'Crear Cuenta Segura' : 'Iniciar Sesión'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister
              ? 'Elige tu tipo de perfil y forma parte de Survey 593'
              : 'Accede de forma segura a tus encuestas, dashboards y finanzas'}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-5 rounded-stitch bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center animate-fade-in">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-5 rounded-stitch bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center animate-fade-in">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              {/* Role selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  ¿Cómo deseas utilizar la plataforma?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('doer')}
                    className={`p-3.5 rounded-stitch border text-center transition-all ${
                      role === 'doer'
                        ? 'border-primary bg-primary/10 text-primary-light font-bold shadow-glow-sm'
                        : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1.5" />
                    <div className="text-xs font-bold">Ciudadano / Encuestado</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Monetiza tu opinión</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('provider')}
                    className={`p-3.5 rounded-stitch border text-center transition-all ${
                      role === 'provider'
                        ? 'border-secondary bg-secondary/10 text-secondary-light font-bold shadow-glow-sm'
                        : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1.5" />
                    <div className="text-xs font-bold">Empresa / Investigador</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Publica estudios & BI</div>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {role === 'provider' ? 'Nombre del Representante' : 'Nombre Completo'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'provider' ? 'Ej: Ing. Carlos Pérez' : 'Ej: María García'}
                  className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Provider Specific Fields */}
              {role === 'provider' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nombre de la Empresa
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ej: Textil Andina S.A."
                      className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Sector / Industria
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="Moda y Textiles">Moda y Textiles</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Alimentación">Alimentación</option>
                      <option value="Salud y Medicina">Salud y Medicina</option>
                      <option value="Política y Gobierno">Política y Gobierno</option>
                      <option value="Banca y Finanzas">Banca y Finanzas</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Doer Specific Fields */}
              {role === 'doer' && (
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-2.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
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
                      min="16"
                      max="99"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-2.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Género</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-2.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="F">Femenino (F)</option>
                      <option value="M">Masculino (M)</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Correo Electrónico {role === 'provider' && isRegister ? 'Corporativo' : ''}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isRegister && (
              <span className="text-[10px] text-slate-400 mt-1 block">Mínimo 6 caracteres.</span>
            )}
          </div>

          <Button type="submit" size="lg" variant="primary" disabled={loading} className="w-full mt-3">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </span>
            ) : isRegister ? (
              'Crear Perfil y Comenzar 🚀'
            ) : (
              'Iniciar Sesión Segura'
            )}
          </Button>
        </form>

        {/* Toggle Register / Login */}
        <div className="text-center mt-6 pt-5 border-t border-slate-700/60">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccessMsg('');
            }}
            className="text-xs text-primary-light hover:underline font-semibold"
          >
            {isRegister
              ? '¿Ya tienes una cuenta registrada? Inicia Sesión aquí'
              : '¿Aún no tienes cuenta? Regístrate gratis aquí'}
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Protegido con Supabase Auth & Cifrado SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
};
