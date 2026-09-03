import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  User,
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Clock,
  KeyRound,
  Search,
  CheckCircle2,
  HelpCircle,
  X,
  FileText,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { validateEcuadorianCedula, validateEcuadorianRuc, maskEmail } from '../services/ecuadorValidators';

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
  const [cedulaOrRuc, setCedulaOrRuc] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Security Lockout State
  const [lockStatus, setLockStatus] = useState({ isLocked: false, remainingSeconds: 0, attempts: 0 });

  // Account Recovery Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryTab, setRecoveryTab] = useState('email'); // 'email' | 'cedula'
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCedula, setRecoveryCedula] = useState('');
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: input, 2: verify, 3: new password, 4: success
  const [recoveryOtpInput, setRecoveryOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [foundAccount, setFoundAccount] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const { login, register, checkLockStatus, unlockAccount, findAccountByIdentity, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Helper para formatear segundos en MM:SS
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Consultar estado de bloqueo cuando cambia el correo
  useEffect(() => {
    if (!email.trim()) {
      setLockStatus({ isLocked: false, remainingSeconds: 0, attempts: 0 });
      return;
    }
    const status = checkLockStatus(email);
    setLockStatus(status);
  }, [email, checkLockStatus]);

  // Cronómetro regresivo cuando la cuenta está bloqueada
  useEffect(() => {
    if (!lockStatus.isLocked || lockStatus.remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockStatus((prev) => {
        if (prev.remainingSeconds <= 1) {
          return { isLocked: false, remainingSeconds: 0, attempts: 0 };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockStatus.isLocked, lockStatus.remainingSeconds]);

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
        cedula: role === 'doer' ? cedulaOrRuc : null,
        ruc: role === 'provider' ? cedulaOrRuc : null,
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
        setLockStatus({ isLocked: false, remainingSeconds: 0, attempts: 0 });
        const target =
          res.user.role === 'provider' ? '/provider' : res.user.role === 'admin' ? '/admin' : '/doer';
        navigate(target);
      } else {
        if (res.isLocked) {
          setLockStatus({
            isLocked: true,
            remainingSeconds: res.remainingSeconds,
            attempts: res.attempts,
          });
        } else {
          setLockStatus((prev) => ({ ...prev, attempts: res.attempts || 0 }));
        }
        setError(res.message);
      }
    }
  };

  // ==========================================
  // FLUJO DE RECUPERACIÓN DE CUENTA / CLAVE
  // ==========================================
  const handleSendEmailOtp = async (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    if (!recoveryEmail.trim()) {
      setRecoveryError('Por favor ingresa tu correo electrónico.');
      return;
    }

    setRecoveryLoading(true);
    const search = await findAccountByIdentity(recoveryEmail);
    setRecoveryLoading(false);

    if (!search.success) {
      setRecoveryError(search.message);
      return;
    }

    // Generar código OTP de 6 dígitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setFoundAccount(search.user);
    setRecoveryStep(2);
    setRecoverySuccess(`Código de seguridad generado para ${search.user.maskedEmail}`);
  };

  const handleVerifyEmailOtp = (e) => {
    e.preventDefault();
    setRecoveryError('');
    if (recoveryOtpInput.trim() !== generatedOtp.trim()) {
      setRecoveryError('El código ingresado es incorrecto. Verifica los 6 dígitos.');
      return;
    }
    setRecoveryStep(3);
  };

  const handleSearchByCedula = async (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    if (!recoveryCedula.trim()) {
      setRecoveryError('Ingresa tu número de Cédula de Identidad o R.U.C.');
      return;
    }

    // Validar con Módulo 10 si tiene 10 dígitos (cédula) o 13 (RUC)
    const cleanId = recoveryCedula.trim();
    if (cleanId.length === 10) {
      const cedulaCheck = validateEcuadorianCedula(cleanId);
      if (!cedulaCheck.valid) {
        setRecoveryError(`Error de formato: ${cedulaCheck.error}`);
        return;
      }
    } else if (cleanId.length === 13) {
      const rucCheck = validateEcuadorianRuc(cleanId);
      if (!rucCheck.valid) {
        setRecoveryError(`Error de formato: ${rucCheck.error}`);
        return;
      }
    }

    setRecoveryLoading(true);
    const search = await findAccountByIdentity(cleanId);
    setRecoveryLoading(false);

    if (!search.success) {
      setRecoveryError(
        'No se encontró ninguna cuenta asociada a este documento de identidad. Si no registraste tu cédula, prueba buscar por el nombre de tu empresa o tu correo.'
      );
      return;
    }

    setFoundAccount(search.user);
    setRecoveryStep(2);
  };

  const handleVerifyIdentityAnswer = (e) => {
    e.preventDefault();
    setRecoveryError('');

    if (!securityAnswer.trim()) {
      setRecoveryError('Por favor responde la pregunta de verificación.');
      return;
    }

    // Validar ciudad de residencia registrada o nombre
    const expectedCity = (foundAccount.city || 'quito').toLowerCase();
    const expectedName = (foundAccount.name || '').toLowerCase();
    const cleanAnswer = securityAnswer.trim().toLowerCase();

    if (
      cleanAnswer === expectedCity ||
      expectedName.includes(cleanAnswer) ||
      cleanAnswer.includes(expectedCity)
    ) {
      setRecoveryStep(3);
      setRecoveryError('');
    } else {
      setRecoveryError(
        'La información ingresada no coincide con los registros oficiales de esta cuenta. Intenta nuevamente.'
      );
    }
  };

  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    setRecoveryError('');

    if (!newPassword || newPassword.length < 6) {
      setRecoveryError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setRecoveryError('Las contraseñas no coinciden. Verifícalas.');
      return;
    }

    setRecoveryLoading(true);
    const res = await resetPassword(foundAccount.id, newPassword);
    setRecoveryLoading(false);

    if (res.success) {
      // Desbloquear estado de bloqueo si existía
      unlockAccount(foundAccount.email);
      setLockStatus({ isLocked: false, remainingSeconds: 0, attempts: 0 });
      setEmail(foundAccount.email);
      setPassword(newPassword);
      setRecoveryStep(4);
    } else {
      setRecoveryError(res.message);
    }
  };

  const resetRecoveryModal = () => {
    setShowRecoveryModal(false);
    setRecoveryStep(1);
    setRecoveryOtpInput('');
    setGeneratedOtp('');
    setFoundAccount(null);
    setSecurityAnswer('');
    setNewPassword('');
    setConfirmPassword('');
    setRecoveryError('');
    setRecoverySuccess('');
  };

  return (
    <div className="min-h-screen bg-[#0B1121] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700/60 rounded-stitch-xl p-6 sm:p-8 shadow-2xl relative z-10 animate-scale-in">
        {/* Brand Header */}
        <div className="text-center mb-6">
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

        {/* ALERTA DE BLOQUEO POR FUERZA BRUTA (5 INTENTOS) */}
        {lockStatus.isLocked && (
          <div className="p-4 mb-5 rounded-stitch bg-rose-500/15 border-2 border-rose-500/50 text-rose-300 text-xs space-y-2.5 animate-scale-in">
            <div className="flex items-center gap-2 font-bold text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>Acceso Bloqueado por Seguridad</span>
            </div>
            <p className="text-[11px] leading-relaxed text-rose-300">
              Se han detectado <strong>5 intentos fallidos consecutivos</strong>. Para proteger los fondos en custodia y la información de esta cuenta, el acceso ha sido suspendido temporalmente.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-900/90 p-2.5 rounded-stitch border border-rose-500/30">
              <div className="flex items-center gap-2 text-white font-mono font-bold text-xs">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>Tiempo restante: {formatTime(lockStatus.remainingSeconds)}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowRecoveryModal(true);
                  setRecoveryTab('cedula');
                  setRecoveryStep(1);
                  setRecoveryError('');
                }}
                className="w-full sm:w-auto text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-stitch transition-colors shadow-sm"
              >
                Desbloquear con Cédula / RUC 🛡️
              </button>
            </div>
          </div>
        )}

        {/* ADVERTENCIA PREVENTIVA (INTENTOS 3 Y 4) */}
        {!lockStatus.isLocked && lockStatus.attempts >= 3 && (
          <div className="p-3 mb-5 rounded-stitch bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Advertencia de Seguridad:</strong> Llevas <strong>{lockStatus.attempts} de 5 intentos</strong>. Al 5to intento tu acceso será bloqueado por 15 minutos.
            </span>
          </div>
        )}

        {error && !lockStatus.isLocked && lockStatus.attempts < 3 && (
          <div className="p-3 mb-5 rounded-stitch bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center animate-fade-in">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-5 rounded-stitch bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center animate-fade-in">
            {successMsg}
          </div>
        )}

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              {/* Selector de Rol */}
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
                    <div className="text-xs font-bold">Empresa / Institución</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Publica estudios & BI</div>
                  </button>
                </div>
              </div>

              {/* Nombre */}
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

              {/* Cédula o RUC para Registro */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {role === 'provider' ? 'R.U.C. de la Empresa (Opcional)' : 'Cédula de Identidad (Para cobro de recompensas)'}
                </label>
                <input
                  type="text"
                  maxLength={role === 'provider' ? 13 : 10}
                  value={cedulaOrRuc}
                  onChange={(e) => setCedulaOrRuc(e.target.value.replace(/\D/g, ''))}
                  placeholder={role === 'provider' ? '1793204829001' : '1724589302'}
                  className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Campos específicos de Empresa */}
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
                      placeholder="Ej: Orión Technologies"
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
                      className="w-full px-3 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="Tecnología">Tecnología</option>
                      <option value="Educación">Educación</option>
                      <option value="Moda y Textiles">Moda y Textiles</option>
                      <option value="Salud">Salud</option>
                      <option value="Alimentación">Alimentación</option>
                      <option value="Comercio">Comercio</option>
                      <option value="Servicios Financieros">Servicios Financieros</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Correo Electrónico */}
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
                disabled={lockStatus.isLocked}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border text-white placeholder-slate-500 text-sm focus:outline-none ${
                  lockStatus.isLocked ? 'border-rose-500/50 opacity-50 cursor-not-allowed' : 'border-slate-700 focus:border-primary'
                }`}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-300">Contraseña</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => {
                    setShowRecoveryModal(true);
                    setRecoveryEmail(email);
                    setRecoveryStep(1);
                    setRecoveryError('');
                  }}
                  className="text-[11px] text-primary-light hover:underline font-semibold"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={lockStatus.isLocked}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-9 pr-10 py-2.5 rounded-stitch bg-slate-900 border text-white placeholder-slate-500 text-sm focus:outline-none ${
                  lockStatus.isLocked ? 'border-rose-500/50 opacity-50 cursor-not-allowed' : 'border-slate-700 focus:border-primary'
                }`}
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

          {/* Opción destacada para usuarios que perdieron su correo o clave */}
          {!isRegister && (
            <div className="p-2.5 rounded-stitch bg-slate-900/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">¿No recuerdas tu correo o perdiste acceso?</span>
              <button
                type="button"
                onClick={() => {
                  setShowRecoveryModal(true);
                  setRecoveryTab('cedula');
                  setRecoveryStep(1);
                  setRecoveryError('');
                }}
                className="text-[11px] text-primary-light hover:text-white font-bold flex items-center gap-1 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Recuperar con Cédula / RUC</span>
              </button>
            </div>
          )}

          {/* Botón de Submit */}
          <Button
            type="submit"
            size="lg"
            variant={lockStatus.isLocked ? 'danger' : 'primary'}
            disabled={loading || lockStatus.isLocked}
            className="w-full mt-3 font-bold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </span>
            ) : lockStatus.isLocked ? (
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                Acceso Bloqueado ({formatTime(lockStatus.remainingSeconds)})
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
          <span>Protegido con Control de Fuerza Bruta & Cifrado SSL 256-bit</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL DE RECUPERACIÓN MULTIFACTOR (CORREO O CÉDULA / RUC ECUATORIANO)      */}
      {/* ========================================================================= */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#1E293B] text-slate-100 rounded-stitch-xl shadow-2xl overflow-hidden border border-slate-700 my-auto animate-scale-in">
            {/* Cabecera del Modal */}
            <div className="bg-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-stitch bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Recuperación Segura de Cuenta
                  </h3>
                  <p className="text-[11px] text-slate-400">Survey 593 · Protocolo de Seguridad Ciudadana</p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetRecoveryModal}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas de Selección: Correo vs Cédula / RUC */}
            {recoveryStep < 4 && (
              <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-900/50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryTab('email');
                    setRecoveryStep(1);
                    setRecoveryError('');
                  }}
                  className={`py-3 px-4 text-center font-bold transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                    recoveryTab === 'email'
                      ? 'border-primary text-primary-light bg-primary/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Por Correo Electrónico</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRecoveryTab('cedula');
                    setRecoveryStep(1);
                    setRecoveryError('');
                  }}
                  className={`py-3 px-4 text-center font-bold transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                    recoveryTab === 'cedula'
                      ? 'border-secondary text-secondary-light bg-secondary/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Por Cédula / RUC (Sin Correo)</span>
                </button>
              </div>
            )}

            {/* Mensajes de Error y Éxito */}
            <div className="p-6 space-y-4 text-xs">
              {recoveryError && (
                <div className="p-3 rounded-stitch bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-start gap-2 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {recoverySuccess && (
                <div className="p-3 rounded-stitch bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-start gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{recoverySuccess}</span>
                </div>
              )}

              {/* ============================================================== */}
              {/* CAMINO 1: RECUPERACIÓN CON CORREO ELECTRÓNICO                   */}
              {/* ============================================================== */}
              {recoveryTab === 'email' && (
                <>
                  {recoveryStep === 1 && (
                    <form onSubmit={handleSendEmailOtp} className="space-y-4">
                      <p className="text-slate-400 leading-relaxed text-xs">
                        Ingresa el correo asociado a tu cuenta. Te generaremos un código de verificación de 6 dígitos para autorizar el cambio de clave.
                      </p>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Correo Electrónico Registrado
                        </label>
                        <input
                          type="email"
                          required
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          placeholder="tu-correo@ejemplo.com"
                          className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={recoveryLoading}
                        className="w-full"
                      >
                        {recoveryLoading ? 'Buscando Cuenta...' : 'Enviar Código de Seguridad 📨'}
                      </Button>
                    </form>
                  )}

                  {recoveryStep === 2 && (
                    <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
                      <div className="p-3 bg-slate-900 rounded-stitch border border-slate-700 text-xs">
                        <span className="text-slate-400 block text-[11px]">Código de Verificación Simulado:</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono text-xl font-black text-emerald-400 tracking-widest">
                            {generatedOtp}
                          </span>
                          <button
                            type="button"
                            onClick={() => setRecoveryOtpInput(generatedOtp)}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
                          >
                            Auto-rellenar
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Ingresa los 6 dígitos recibidos
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={recoveryOtpInput}
                          onChange={(e) => setRecoveryOtpInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="123456"
                          className="w-full px-3.5 py-2.5 text-center font-mono text-lg font-bold rounded-stitch bg-slate-900 border border-slate-700 text-white tracking-widest focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="flex justify-between gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setRecoveryStep(1)}>
                          Atrás
                        </Button>
                        <Button type="submit" variant="primary" disabled={recoveryOtpInput.length !== 6}>
                          Verificar Código ✓
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* ============================================================== */}
              {/* CAMINO 2: RECUPERACIÓN SIN CORREO (POR CÉDULA / RUC ECUATORIANO) */}
              {/* ============================================================== */}
              {recoveryTab === 'cedula' && (
                <>
                  {recoveryStep === 1 && (
                    <form onSubmit={handleSearchByCedula} className="space-y-4">
                      <div className="p-3 bg-slate-900/80 rounded-stitch border border-slate-700 text-xs text-slate-300 space-y-1">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-secondary-light" />
                          ¿Olvidaste tu correo o perdiste acceso a tu bandeja?
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Tu número de <strong>Cédula de Identidad</strong> o <strong>R.U.C.</strong> es único. Ingrésalo para que el sistema localice tu cuenta registrada en Ecuador y te permita recuperarla.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Número de Cédula (10 dígitos) o R.U.C. (13 dígitos)
                        </label>
                        <input
                          type="text"
                          maxLength={13}
                          required
                          value={recoveryCedula}
                          onChange={(e) => setRecoveryCedula(e.target.value.replace(/\D/g, ''))}
                          placeholder="Ej: 1724589302 (Cédula) o 1793204829001 (RUC)"
                          className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-secondary font-mono"
                        />
                        {recoveryCedula.length === 10 && (
                          <div className="mt-1 text-[11px]">
                            {validateEcuadorianCedula(recoveryCedula).valid ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Cédula ecuatoriana válida (Módulo 10)
                              </span>
                            ) : (
                              <span className="text-rose-400">
                                ⚠ {validateEcuadorianCedula(recoveryCedula).error}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        variant="secondary"
                        disabled={recoveryLoading || recoveryCedula.length < 10}
                        className="w-full"
                      >
                        {recoveryLoading ? 'Buscando en Registros...' : 'Buscar Mi Cuenta en el Sistema 🔍'}
                      </Button>
                    </form>
                  )}

                  {recoveryStep === 2 && foundAccount && (
                    <form onSubmit={handleVerifyIdentityAnswer} className="space-y-4">
                      {/* Tarjeta de Cuenta Encontrada */}
                      <div className="p-4 rounded-stitch bg-secondary/10 border border-secondary/30 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-secondary-light" />
                          <span className="font-bold text-white text-sm">¡Cuenta Localizada con Éxito!</span>
                        </div>
                        <div className="text-xs space-y-1 text-slate-300">
                          <p><strong className="text-slate-400">Titular:</strong> {foundAccount.name}</p>
                          <p><strong className="text-slate-400">Correo Registrado:</strong> <span className="font-mono text-emerald-400 font-bold">{foundAccount.maskedEmail}</span></p>
                          {foundAccount.company && (
                            <p><strong className="text-slate-400">Empresa:</strong> {foundAccount.company}</p>
                          )}
                        </div>
                      </div>

                      {/* Pregunta de Verificación */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-200">
                          Pregunta de Seguridad de Identidad:
                        </label>
                        <p className="text-[11px] text-slate-400">
                          Para verificar que eres el propietario legítimo, confirma tu <strong>ciudad de residencia</strong> registrada (ej: Quito, Guayaquil, Cuenca):
                        </p>
                        <input
                          type="text"
                          required
                          value={securityAnswer}
                          onChange={(e) => setSecurityAnswer(e.target.value)}
                          placeholder="Escribe tu ciudad..."
                          className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-secondary"
                        />
                      </div>

                      <div className="flex justify-between gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setRecoveryStep(1)}>
                          Atrás
                        </Button>
                        <Button type="submit" variant="secondary">
                          Confirmar Identidad y Continuar ✓
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* ============================================================== */}
              {/* PASO 3 COMÚN: ESTABLECER NUEVA CONTRASEÑA                      */}
              {/* ============================================================== */}
              {recoveryStep === 3 && (
                <form onSubmit={handleSaveNewPassword} className="space-y-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-stitch text-xs text-emerald-300">
                    ✓ Identidad confirmada para <strong>{foundAccount?.name}</strong>. Ahora define tu nueva contraseña.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nueva Contraseña (Mínimo 6 caracteres)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={recoveryLoading || !newPassword || !confirmPassword}
                    className="w-full mt-2"
                  >
                    {recoveryLoading ? 'Actualizando...' : 'Restablecer y Desbloquear Cuenta 🚀'}
                  </Button>
                </form>
              )}

              {/* ============================================================== */}
              {/* PASO 4: ÉXITO TOTAL Y RETORNO AL LOGIN                         */}
              {/* ============================================================== */}
              {recoveryStep === 4 && (
                <div className="text-center py-4 space-y-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">¡Contraseña Actualizada y Cuenta Desbloqueada!</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Tu correo registrado es <strong className="text-white">{foundAccount?.email}</strong>. Hemos colocado tus nuevas credenciales en el formulario para que puedas ingresar de inmediato.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={resetRecoveryModal}
                    className="w-full"
                  >
                    Entrar a la Plataforma 🚀
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
