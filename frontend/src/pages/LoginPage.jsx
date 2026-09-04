import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  KeyRound,
  Sparkles,
  Check,
  Globe,
  BarChart3,
  Users,
} from 'lucide-react';

export const LoginPage = () => {
  const {
    login,
    register,
    checkLockStatus,
    signInWithOAuth,
    sendRealPasswordResetEmail,
    updateRealPassword,
    isPasswordRecoveryActive,
    setIsPasswordRecoveryActive,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Active view: 'login' | 'register' | 'forgot-password' | 'update-password'
  const [view, setView] = useState('login');

  // Form fields
  const [role, setRole] = useState('provider'); // 'provider' | 'doer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [oauthWarning, setOauthWarning] = useState('');

  // Password recovery states
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);

  // Security Lockout State
  const [lockStatus, setLockStatus] = useState({ isLocked: false, remainingSeconds: 0, attempts: 0 });

  // Detect recovery URL parameter
  useEffect(() => {
    if (
      isPasswordRecoveryActive ||
      location.search.includes('type=recovery') ||
      window.location.hash.includes('type=recovery')
    ) {
      setView('update-password');
    }
  }, [isPasswordRecoveryActive, location]);

  // Check account lockout whenever email changes
  useEffect(() => {
    if (!email.trim()) {
      setLockStatus({ isLocked: false, remainingSeconds: 0, attempts: 0 });
      return;
    }
    const status = checkLockStatus(email);
    setLockStatus(status);
  }, [email, checkLockStatus]);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockStatus.isLocked || lockStatus.remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockStatus((prev) => {
        if (prev.remainingSeconds <= 1) {
          return { isLocked: false, remainingSeconds: 0, attempts: 0 };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockStatus.isLocked, lockStatus.remainingSeconds]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Reset errors when switching views
  const switchView = (newView) => {
    setError('');
    setSuccessMsg('');
    setOauthWarning('');
    setView(newView);
  };

  // ==========================================
  // HANDLERS
  // ==========================================

  // 1. INICIAR SESIÓN REAL
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (lockStatus.isLocked) {
      setError(`Cuenta bloqueada temporalmente por seguridad. Reintenta en ${formatTime(lockStatus.remainingSeconds)}.`);
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
      if (res.isLocked) {
        setLockStatus({ isLocked: true, remainingSeconds: res.remainingSeconds, attempts: res.attempts });
        setError(res.message);
      } else {
        setError(res.message || 'Correo electrónico o contraseña incorrectos.');
      }
    }
  };

  // 2. REGISTRO REAL (EMPRESAS O CIUDADANOS)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (role === 'provider' && !company.trim()) {
      setError('Por favor ingresa el nombre de tu empresa o institución.');
      return;
    }

    setLoading(true);
    const res = await register({
      name: name.trim() || (role === 'provider' ? company : email.split('@')[0]),
      email: email.trim(),
      password,
      role,
      company: role === 'provider' ? company.trim() : '',
    });
    setLoading(false);

    if (res.success) {
      const target =
        res.user.role === 'provider' ? '/provider' : res.user.role === 'admin' ? '/admin' : '/doer';
      navigate(target);
    } else {
      setError(res.message || 'Error al crear la cuenta. Intenta nuevamente.');
    }
  };

  // 3. RECUPERACIÓN REAL POR EMAIL (SUPABASE AUTH)
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!recoveryEmail.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }

    setRecoveryLoading(true);
    const res = await sendRealPasswordResetEmail(recoveryEmail.trim());
    setRecoveryLoading(false);

    if (res.success) {
      setRecoverySent(true);
    } else {
      setError(res.message || 'No se pudo enviar el correo de recuperación.');
    }
  };

  // 4. GUARDAR NUEVA CONTRASEÑA (DESDE ENLACE DE EMAIL)
  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setUpdatePasswordLoading(true);
    const res = await updateRealPassword(newPassword);
    setUpdatePasswordLoading(false);

    if (res.success) {
      setSuccessMsg('¡Contraseña actualizada exitosamente! Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        setIsPasswordRecoveryActive(false);
        switchView('login');
      }, 2500);
    } else {
      setError(res.message || 'Error al actualizar la contraseña.');
    }
  };

  // 5. INICIO DE SESIÓN CON PROVEEDORES OFICIALES
  const handleSocialClick = async (provider) => {
    setError('');
    setOauthWarning('');
    setOauthLoading(provider);

    const res = await signInWithOAuth(provider, role, company);
    setOauthLoading(null);

    if (res.isNotEnabled) {
      const names = { google: 'Google Workspace', microsoft: 'Microsoft 365', github: 'GitHub' };
      setOauthWarning(
        `El acceso directo con ${names[provider] || provider} aún no está activado en el servidor de Supabase. Puedes ingresar o registrarte con tu correo y contraseña.`
      );
    } else if (!res.success && res.message) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans selection:bg-teal-500 selection:text-white">
      {/* Background Subtle Gradient Lights */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">

        {/* ========================================================================= */}
        {/* COLUMNA IZQUIERDA: SHOWCASE CORPORATIVO B2B                                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 p-8 lg:p-12 bg-gradient-to-br from-slate-900/90 via-[#0B1222] to-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 group mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
                  <span className="text-teal-400 font-black text-lg tracking-tighter">593</span>
                </div>
              </div>
              <div className="text-left">
                <span className="text-lg font-black text-white tracking-tight leading-none block">
                  SURVEY <span className="text-teal-400">593</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                  Enterprise Platform
                </span>
              </div>
            </Link>

            {/* Tagline */}
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug mb-4">
              La plataforma de investigación y encuestas para{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
                Ecuador
              </span>
            </h1>
            <p className="text-slate-400 text-xs lg:text-sm leading-relaxed mb-8">
              Empresas, colegios, universidades y entidades públicas toman decisiones informadas con respuestas ciudadanas verificadas y analítica en tiempo real.
            </p>

            {/* Trust Badges */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 text-teal-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Seguridad y Encriptación Bancaria</h2>
                  <p className="text-[11px] text-slate-400">Protección SSL/TLS 256-bit y contraseñas hasheadas en base de datos.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Resultados y Segmentación 593</h2>
                  <p className="text-[11px] text-slate-400">Métricas demográficas por provincias, ciudades y sectores clave.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Comunidad de Encuestados Activa</h2>
                  <p className="text-[11px] text-slate-400">Miles de ciudadanos completan encuestas diarias con recompensas reales.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-8 mt-8 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} Survey 593</span>
            <span>Versión 2.5 Enterprise</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMNA DERECHA: FORMULARIO PRINCIPAL LIMPIO Y MODERNO                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-slate-900/40">

          {/* MENSAJES DE ALERTA GLOBALES */}
          {error && (
            <div className="p-3.5 mb-6 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 mb-6 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          {oauthWarning && (
            <div className="p-3.5 mb-6 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{oauthWarning}</span>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VISTA 1: INICIAR SESIÓN                                               */}
          {/* ===================================================================== */}
          {view === 'login' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
                <p className="text-slate-400 text-xs mt-1">
                  Ingresa a tu panel de control de Survey 593 con tus credenciales.
                </p>
              </div>

              {/* Botones de Proveedores Sociales */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    disabled={oauthLoading !== null}
                    onClick={() => handleSocialClick('google')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {oauthLoading === 'google' ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    )}
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    disabled={oauthLoading !== null}
                    onClick={() => handleSocialClick('microsoft')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {oauthLoading === 'microsoft' ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 23 23">
                        <path fill="#f35325" d="M1 1h10v10H1z"/>
                        <path fill="#81bc06" d="M12 1h10v10H12z"/>
                        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                        <path fill="#ffba08" d="M12 12h10v10H12z"/>
                      </svg>
                    )}
                    <span>Microsoft</span>
                  </button>

                  <button
                    type="button"
                    disabled={oauthLoading !== null}
                    onClick={() => handleSocialClick('github')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {oauthLoading === 'github' ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                    )}
                    <span>GitHub</span>
                  </button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-slate-900/90 text-slate-400 font-medium">o con correo electrónico</span>
                  </div>
                </div>
              </div>

              {/* Formulario de Login */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Alerta de bloqueo */}
                {lockStatus.isLocked && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-200">
                      <Clock className="w-4 h-4 text-rose-400" />
                      <span>Acceso bloqueado por seguridad</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Se registraron 5 intentos incorrectos. Reintento disponible en <strong>{formatTime(lockStatus.remainingSeconds)}</strong>.
                    </p>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      disabled={lockStatus.isLocked}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@organizacion.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setRecoveryEmail(email);
                        switchView('forgot-password');
                      }}
                      className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={lockStatus.isLocked}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || lockStatus.isLocked}
                  className="w-full py-2.5 font-bold text-xs"
                >
                  {loading ? 'Verificando credenciales...' : 'Iniciar Sesión'}
                </Button>
              </form>

              {/* Toggle a Registro */}
              <div className="pt-4 text-center border-t border-slate-800/80">
                <p className="text-xs text-slate-400">
                  ¿Aún no tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => switchView('register')}
                    className="text-teal-400 hover:text-teal-300 font-bold transition-colors ml-1"
                  >
                    Crear cuenta gratis
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VISTA 2: CREAR CUENTA                                                 */}
          {/* ===================================================================== */}
          {view === 'register' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Crear Cuenta</h2>
                <p className="text-slate-400 text-xs mt-1">
                  Regístrate en Survey 593 y comienza a investigar o participar hoy.
                </p>
              </div>

              {/* Selector de Rol Segmented */}
              <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === 'provider'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Empresa / Institución</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doer')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === 'doer'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Ciudadano / Encuestado</span>
                </button>
              </div>

              {/* Formulario de Registro */}
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {role === 'provider' ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nombre de la Empresa o Institución
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Ej: Banco Pichincha, Colegio Benalcázar"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nombre del Representante o Administrador
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ej: Ing. Carlos Pérez"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: David Cajías"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-400 placeholder-slate-500"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@correo.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contraseña (mínimo 6 caracteres)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full py-2.5 font-bold text-xs"
                >
                  {loading ? 'Creando cuenta...' : role === 'provider' ? 'Registrar Empresa / Institución' : 'Registrarme como Encuestado'}
                </Button>
              </form>

              {/* Toggle a Login */}
              <div className="pt-4 text-center border-t border-slate-800/80">
                <p className="text-xs text-slate-400">
                  ¿Ya tienes una cuenta registrada?{' '}
                  <button
                    type="button"
                    onClick={() => switchView('login')}
                    className="text-teal-400 hover:text-teal-300 font-bold transition-colors ml-1"
                  >
                    Iniciar Sesión
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VISTA 3: RECUPERAR CONTRASEÑA (ESTÁNDAR CORPORATIVO POR CORREO)        */}
          {/* ===================================================================== */}
          {view === 'forgot-password' && (
            <div className="space-y-6">
              {!recoverySent ? (
                <>
                  <div>
                    <button
                      type="button"
                      onClick={() => switchView('login')}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors mb-4"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Volver al inicio de sesión</span>
                    </button>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Recuperar Contraseña</h2>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Ingresa el correo electrónico asociado a tu cuenta. Te enviaremos un enlace oficial para que puedas restablecer tu contraseña.
                    </p>
                  </div>

                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          placeholder="nombre@correo.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={recoveryLoading}
                      className="w-full py-2.5 font-bold text-xs"
                    >
                      {recoveryLoading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
                    </Button>
                  </form>
                </>
              ) : (
                /* Pantalla de Confirmación de Correo Enviado */
                <div className="text-center space-y-4 py-4 animate-scale-in">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">¡Revisa tu bandeja de entrada!</h2>
                    <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                      Hemos enviado un enlace de recuperación a <strong className="text-white">{recoveryEmail}</strong>. Sigue las instrucciones del correo para definir tu nueva contraseña.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setRecoverySent(false);
                        switchView('login');
                      }}
                      className="w-full font-bold text-xs"
                    >
                      Volver al inicio de sesión
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* VISTA 4: DEFINIR NUEVA CONTRASEÑA (DESDE ENLACE DE RECUPERACIÓN)        */}
          {/* ===================================================================== */}
          {view === 'update-password' && (
            <div className="space-y-6">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Nueva Contraseña</h2>
                <p className="text-slate-400 text-xs mt-1">
                  Ingresa tu nueva contraseña para volver a ingresar a tu cuenta de Survey 593.
                </p>
              </div>

              <form onSubmit={handleUpdatePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={updatePasswordLoading}
                  className="w-full py-2.5 font-bold text-xs"
                >
                  {updatePasswordLoading ? 'Guardando contraseña...' : 'Actualizar Contraseña y Entrar'}
                </Button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
