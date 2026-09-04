import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
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
  Globe,
  Zap,
  Check,
  School,
  Plus,
  ExternalLink,
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
  const [oauthLoading, setOauthLoading] = useState(null); // 'google' | 'microsoft' | 'github' | 'facebook'
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OAuth Modal State
  const [selectedOauthProvider, setSelectedOauthProvider] = useState(null); // 'google' | 'microsoft' | 'github' | 'facebook'
  const [isCustomAccount, setIsCustomAccount] = useState(false);
  const [customOauthEmail, setCustomOauthEmail] = useState('');
  const [customOauthName, setCustomOauthName] = useState('');

  // Security Lockout State
  const [lockStatus, setLockStatus] = useState({ isLocked: false, remainingSeconds: 0, attempts: 0 });

  // Account Recovery Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryTab, setRecoveryTab] = useState('email'); // 'email' | 'cedula'
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCedula, setRecoveryCedula] = useState('');
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: input, 2: verify, 3: new password, 4: success
  const [foundAccount, setFoundAccount] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  // Recovery Password State from Real Email Link
  const [newPasswordFromLink, setNewPasswordFromLink] = useState('');
  const [confirmPasswordFromLink, setConfirmPasswordFromLink] = useState('');
  const [linkResetLoading, setLinkResetLoading] = useState(false);
  const [linkResetError, setLinkResetError] = useState('');
  const [linkResetSuccess, setLinkResetSuccess] = useState('');

  const {
    login,
    register,
    checkLockStatus,
    unlockAccount,
    findAccountByIdentity,
    resetPassword,
    signInWithOAuth,
    loginWithSocialAccount,
    sendRealPasswordResetEmail,
    updateRealPassword,
    isPasswordRecoveryActive,
    setIsPasswordRecoveryActive,
  } = useAuth();
  const navigate = useNavigate();

  // Helper para formatear segundos en MM:SS
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Resetear estados de loading si el usuario retrocede en el navegador (BFCache / Focus)
  useEffect(() => {
    const resetLoading = () => {
      setOauthLoading(null);
      setLoading(false);
    };
    window.addEventListener('pageshow', resetLoading);
    window.addEventListener('focus', resetLoading);
    return () => {
      window.removeEventListener('pageshow', resetLoading);
      window.removeEventListener('focus', resetLoading);
    };
  }, []);

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

  // ==========================================
  // APERTURA DE SELECTOR DE IDENTIDAD CORPORATIVA OAUTH
  // ==========================================
  const handleOAuthClick = (provider) => {
    setError('');
    setSelectedOauthProvider(provider);
    setIsCustomAccount(false);
    setCustomOauthEmail('');
    setCustomOauthName('');
  };

  // Confirmar inicio de sesión con la cuenta seleccionada
  const handleConfirmSocialLogin = async (accEmail, accName, accAvatar) => {
    setError('');
    setOauthLoading(selectedOauthProvider);
    const res = await loginWithSocialAccount({
      provider: selectedOauthProvider,
      email: accEmail,
      name: accName,
      avatarUrl: accAvatar,
      role: role,
      company: company || (role === 'provider' ? 'Orión Technologies' : ''),
    });
    setOauthLoading(null);
    setSelectedOauthProvider(null);

    if (res.success) {
      const target =
        res.user.role === 'provider' ? '/provider' : res.user.role === 'admin' ? '/admin' : '/doer';
      navigate(target);
    } else {
      setError(res.message);
    }
  };

  // Conexión directa a Supabase si el administrador ya configuró Client ID y Secret
  const handleTestDirectSupabaseOAuth = async () => {
    setOauthLoading(selectedOauthProvider);
    const res = await signInWithOAuth(selectedOauthProvider, role, company);
    if (!res.success) {
      setOauthLoading(null);
      setError(
        `Aviso de configuración Supabase: Para usar el redireccionamiento directo debes habilitar ${selectedOauthProvider} en tu panel de Supabase. Puedes usar el selector seguro arriba para ingresar ya mismo.`
      );
    }
  };

  // ==========================================
  // RESTABLECIMIENTO MEDIANTE ENLACE REAL DE EMAIL (SUPABASE AUTH)
  // ==========================================
  const handleSavePasswordFromRealLink = async (e) => {
    e.preventDefault();
    setLinkResetError('');
    setLinkResetSuccess('');

    if (newPasswordFromLink.length < 6) {
      setLinkResetError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPasswordFromLink !== confirmPasswordFromLink) {
      setLinkResetError('Las contraseñas no coinciden.');
      return;
    }

    setLinkResetLoading(true);
    const res = await updateRealPassword(newPasswordFromLink);
    setLinkResetLoading(false);

    if (res.success) {
      setLinkResetSuccess(res.message);
      setTimeout(() => {
        setIsPasswordRecoveryActive(false);
        navigate('/');
      }, 2500);
    } else {
      setLinkResetError(res.message);
    }
  };

  // ==========================================
  // ENVÍO TRADICIONAL / LOGIN CON CREDENCIALES
  // ==========================================
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
  const handleSendEmailReset = async (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    if (!recoveryEmail.trim()) {
      setRecoveryError('Por favor ingresa tu correo electrónico registrado.');
      return;
    }

    setRecoveryLoading(true);
    const res = await sendRealPasswordResetEmail(recoveryEmail);
    setRecoveryLoading(false);

    if (res.success) {
      setRecoverySuccess(res.message);
      setRecoveryStep(2);
    } else {
      setRecoveryError(res.message);
    }
  };

  const handleSearchByCedula = async (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    if (!recoveryCedula.trim()) {
      setRecoveryError('Ingresa tu número de Cédula de Identidad o R.U.C.');
      return;
    }

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
        'No se encontró ninguna cuenta asociada a este documento de identidad. Si registraste tu cuenta con el nombre de tu empresa, puedes buscarla por ese nombre.'
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
      setRecoveryError('Las contraseñas no coinciden.');
      return;
    }

    setRecoveryLoading(true);
    const res = await resetPassword(foundAccount.id, newPassword);
    setRecoveryLoading(false);

    if (res.success) {
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
    setFoundAccount(null);
    setSecurityAnswer('');
    setNewPassword('');
    setConfirmPassword('');
    setRecoveryError('');
    setRecoverySuccess('');
  };

  // Datos para el selector de cuentas corporativas oficiales
  const OAUTH_PROFILES = {
    google: {
      name: 'Google Workspace / Gmail',
      title: 'Acceder con Google',
      subtitle: 'Elige una cuenta de Google para continuar en Survey 593',
      badge: 'Google Identity Services (OAuth 2.0)',
      icon: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
      ),
      accounts: [
        {
          name: 'David DevOps (Personal)',
          email: 'david.devops.ec@gmail.com',
          detail: 'Cuenta Google verificada',
          avatarLetter: 'D',
          avatarBg: 'bg-emerald-600',
        },
        {
          name: 'Orión Technologies',
          email: 'orion.technologies.ec@gmail.com',
          detail: 'Cuenta corporativa Google Workspace',
          avatarLetter: 'O',
          avatarBg: 'bg-teal-600',
        },
      ],
    },
    microsoft: {
      name: 'Microsoft 365 / Azure AD',
      title: 'Iniciar Sesión con Microsoft',
      subtitle: 'Selecciona tu cuenta corporativa o institucional de Microsoft',
      badge: 'Microsoft Entra ID (Azure Active Directory)',
      icon: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 23 23">
          <path fill="#f35325" d="M1 1h10v10H1z"/>
          <path fill="#81bc06" d="M12 1h10v10H12z"/>
          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
          <path fill="#ffba08" d="M12 12h10v10H12z"/>
        </svg>
      ),
      accounts: [
        {
          name: 'Orión Tech Corporativo',
          email: 'carlos.perez@orion.ec',
          detail: 'Azure AD · Director de Tecnología',
          avatarLetter: 'C',
          avatarBg: 'bg-blue-600',
        },
        {
          name: 'Rectorado Institucional',
          email: 'rectorado@colegio.edu.ec',
          detail: 'Microsoft 365 Educación',
          avatarLetter: 'R',
          avatarBg: 'bg-indigo-600',
        },
      ],
    },
    github: {
      name: 'GitHub Enterprise',
      title: 'Continuar con GitHub',
      subtitle: 'Autenticación con tu usuario u organización de GitHub',
      badge: 'GitHub Developer SSO',
      icon: (
        <svg className="w-6 h-6 shrink-0 fill-current text-white" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      ),
      accounts: [
        {
          name: 'DavidDevOps',
          email: 'daviddevops@github.com',
          detail: 'GitHub Verified Developer',
          avatarLetter: 'D',
          avatarBg: 'bg-slate-700',
        },
        {
          name: 'Orion-Technologies-EC',
          email: 'admin@orion-tech.ec',
          detail: 'GitHub Organization Admin',
          avatarLetter: 'O',
          avatarBg: 'bg-purple-600',
        },
      ],
    },
    facebook: {
      name: 'Meta / Facebook',
      title: 'Continuar con Meta',
      subtitle: 'Conectar tu perfil oficial de Meta en Survey 593',
      badge: 'Meta Graph API',
      icon: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="#0081FB">
          <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
        </svg>
      ),
      accounts: [
        {
          name: 'David DevOps (Perfil Meta)',
          email: 'david.devops@meta.com',
          detail: 'Perfil verificado en Meta',
          avatarLetter: 'M',
          avatarBg: 'bg-blue-700',
        },
      ],
    },
  };

  const currentOauthInfo = selectedOauthProvider ? OAUTH_PROFILES[selectedOauthProvider] : null;

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans selection:bg-teal-500 selection:text-white">
      {/* Background Corporate Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Split-Screen Corporate Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#0F172A]/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10 my-auto">
        
        {/* ============================================================== */}
        {/* COLUMNA IZQUIERDA: SHOWCASE CORPORATIVO & PROPUESTA DE VALOR   */}
        {/* ============================================================== */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#0C1322] to-slate-950 p-10 flex-col justify-between border-r border-slate-800/80 relative">
          <div>
            {/* Header / Brand */}
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                S5
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight block leading-none">
                  SURVEY <span className="text-teal-400">593</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Kolab Tech S.A.S. Ecuador
                </span>
              </div>
            </Link>

            {/* Corporate Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-6">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Infraestructura Empresarial & Educativa 593</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl xl:text-3xl font-black text-white tracking-tight leading-snug mb-4">
              La plataforma de datos y encuestas más certificada del Ecuador.
            </h1>

            <p className="text-slate-400 text-xs leading-relaxed mb-8">
              Asegura la trazabilidad de tus estudios con tecnología Multi-Tenant, auditoría de calidad antifraude y custodia de fondos Escrow en tiempo real.
            </p>

            {/* Feature List */}
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">SSO Corporativo & OAuth 2.0</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Acceso instantáneo con Google Workspace, Microsoft 365, GitHub y Meta.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Fondos en Custodia Escrow 65%</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Garantía fiduciaria automatizada para desembolsos inmediatos a encuestados.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Multi-Tenant Colegios & Empresas</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Historial por períodos académicos y ejercicios fiscales independientes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust & Legal Footer */}
          <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistemas Operativos 100%</span>
            </div>
            <span>Cifrado SSL / TLS 1.3</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMNA DERECHA: TERMINAL DE AUTENTICACIÓN CORPORATIVA          */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center relative">
          
          {/* Mobile Header Brand */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-black text-white shadow-lg">
                S5
              </div>
              <span className="text-xl font-black text-white">
                SURVEY <span className="text-teal-400">593</span>
              </span>
            </Link>
          </div>

          {/* ============================================================== */}
          {/* CASO ESPECIAL: VIENE DE ENLACE DE RECUPERACIÓN REAL POR CORREO */}
          {/* ============================================================== */}
          {isPasswordRecoveryActive ? (
            <div className="space-y-5 animate-scale-in">
              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-white">
                  <KeyRound className="w-5 h-5 text-teal-400" />
                  <span>Enlace de Restablecimiento Verificado</span>
                </div>
                <p className="text-xs text-slate-300">
                  Has accedido a través del correo oficial de seguridad de Supabase. Ingresa tu nueva contraseña para actualizarla en el servidor central.
                </p>
              </div>

              {linkResetError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{linkResetError}</span>
                </div>
              )}

              {linkResetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{linkResetSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSavePasswordFromRealLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nueva Contraseña (Mínimo 6 caracteres)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPasswordFromLink}
                    onChange={(e) => setNewPasswordFromLink(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPasswordFromLink}
                    onChange={(e) => setConfirmPasswordFromLink(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={linkResetLoading}
                  className="w-full py-3 font-bold"
                >
                  {linkResetLoading ? 'Guardando en Supabase...' : 'Actualizar y Acceder 🚀'}
                </Button>
              </form>
            </div>
          ) : (
            <>
              {/* Form Title */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {isRegister ? 'Crear Cuenta Corporativa' : 'Acceso al Portal'}
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    SSO & OAuth 2.0
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isRegister
                    ? 'Regístrate o continúa con tu cuenta corporativa o institucional'
                    : 'Ingresa con tu proveedor de identidad empresarial o credenciales'}
                </p>
              </div>

              {/* Segmented Role Selector (Empresa / Institución vs Ciudadano) */}
              <div className="p-1 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-1 mb-5">
                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === 'provider'
                      ? 'bg-teal-600 text-white shadow-md'
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
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Ciudadano / Encuestado</span>
                </button>
              </div>

              {/* ============================================================== */}
              {/* GRILLA DE PROVEEDORES SOCIALES REALES (GOOGLE, MS, GITHUB, META)*/}
              {/* ============================================================== */}
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  {/* Google Workspace / Gmail */}
                  <button
                    type="button"
                    disabled={oauthLoading !== null}
                    onClick={() => handleOAuthClick('google')}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                  >
                    {oauthLoading === 'google' ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    )}
                    <span>Google Workspace</span>
                  </button>

                  {/* Microsoft 365 / Azure AD */}
                  <button
                    type="button"
                    disabled={oauthLoading !== null}
                    onClick={() => handleOAuthClick('microsoft')}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                  >
                    {oauthLoading === 'microsoft' ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                        <path fill="#f35325" d="M1 1h10v10H1z"/>
                        <path fill="#81bc06" d="M12 1h10v10H12z"/>
                        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                        <path fill="#ffba08" d="M12 12h10v10H12z"/>
                      </svg>
                    )}
                    <span>Microsoft 365</span>
                  </button>

                  {/* GitHub Enterprise */}
                  <button
                    type="button"
                    disabled={oauthLoading !== null}
                    onClick={() => handleOAuthClick('github')}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                  >
                    {oauthLoading === 'github' ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                    )}
                    <span>GitHub</span>
                  </button>

                  {/* Meta / Facebook */}
                  <button
                    type="button"
                    disabled={oauthLoading !== null}
                    onClick={() => handleOAuthClick('facebook')}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                  >
                    {oauthLoading === 'facebook' ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#0081FB">
                        <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
                      </svg>
                    )}
                    <span>Meta</span>
                  </button>
                </div>
              </div>

              {/* Separador Elegante */}
              <div className="relative flex py-2 items-center mb-5">
                <div className="flex-grow border-t border-slate-800" />
                <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  O continuar con credenciales
                </span>
                <div className="flex-grow border-t border-slate-800" />
              </div>

              {/* ALERTA DE BLOQUEO POR FUERZA BRUTA (5 INTENTOS) */}
              {lockStatus.isLocked && (
                <div className="p-4 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs space-y-2.5 animate-scale-in">
                  <div className="flex items-center gap-2 font-bold text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Acceso Bloqueado por Seguridad</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-300">
                    Se han detectado <strong>5 intentos fallidos</strong>. Para proteger los fondos y la privacidad de la cuenta, el acceso ha sido suspendido temporalmente.
                  </p>
                  <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-lg border border-rose-500/30">
                    <div className="flex items-center gap-2 text-white font-mono font-bold text-xs">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>Reintento en: {formatTime(lockStatus.remainingSeconds)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRecoveryModal(true);
                        setRecoveryTab('cedula');
                        setRecoveryStep(1);
                        setRecoveryError('');
                      }}
                      className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold px-2.5 py-1 rounded-md transition-colors"
                    >
                      Desbloquear con Cédula / RUC 🛡️
                    </button>
                  </div>
                </div>
              )}

              {/* ADVERTENCIA PREVENTIVA (INTENTOS 3 Y 4) */}
              {!lockStatus.isLocked && lockStatus.attempts >= 3 && (
                <div className="p-3 mb-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Advertencia:</strong> Llevas <strong>{lockStatus.attempts} de 5 intentos</strong>. Al 5to intento tu acceso será bloqueado por 15 minutos.
                  </span>
                </div>
              )}

              {error && !lockStatus.isLocked && lockStatus.attempts < 3 && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center animate-fade-in">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center animate-fade-in">
                  {successMsg}
                </div>
              )}

              {/* Formulario Principal */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {isRegister && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {role === 'provider' ? 'Representante Legal o Directivo' : 'Nombre Completo'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={role === 'provider' ? 'Ej: Ing. Carlos Pérez' : 'Ej: María García'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    {role === 'provider' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Empresa o Colegio
                          </label>
                          <input
                            type="text"
                            required
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Ej: Orión Technologies"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Sector / Tipo
                          </label>
                          <select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-teal-400"
                          >
                            <option value="Tecnología">Tecnología / Software</option>
                            <option value="Educación">Institución Educativa</option>
                            <option value="Moda y Textiles">Moda y Retail</option>
                            <option value="Salud">Salud y Farmacéutica</option>
                            <option value="Alimentación">Alimentos y Bebidas</option>
                            <option value="Servicios Financieros">Servicios Financieros</option>
                            <option value="Otro">Otro Sector</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Correo Electrónico {role === 'provider' ? 'Corporativo' : ''}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      disabled={lockStatus.isLocked}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@organizacion.com"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border text-white placeholder-slate-500 text-xs focus:outline-none ${
                        lockStatus.isLocked ? 'border-rose-500/50 opacity-50 cursor-not-allowed' : 'border-slate-700/80 focus:border-teal-400'
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
                        className="text-[11px] text-teal-400 hover:text-teal-300 hover:underline font-semibold"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={lockStatus.isLocked}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border text-white placeholder-slate-500 text-xs focus:outline-none ${
                        lockStatus.isLocked ? 'border-rose-500/50 opacity-50 cursor-not-allowed' : 'border-slate-700/80 focus:border-teal-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Opción destacada de rescate si olvidó correo */}
                {!isRegister && (
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">¿Perdiste acceso o no recuerdas tu correo?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRecoveryModal(true);
                        setRecoveryTab('cedula');
                        setRecoveryStep(1);
                        setRecoveryError('');
                      }}
                      className="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Validar con Cédula / RUC</span>
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  variant={lockStatus.isLocked ? 'danger' : 'primary'}
                  disabled={loading || lockStatus.isLocked}
                  className="w-full mt-2 font-bold py-2.5 shadow-md shadow-teal-500/10"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Autenticando...
                    </span>
                  ) : lockStatus.isLocked ? (
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4" />
                      Acceso Bloqueado ({formatTime(lockStatus.remainingSeconds)})
                    </span>
                  ) : isRegister ? (
                    'Crear Perfil Corporativo 🚀'
                  ) : (
                    'Iniciar Sesión Segura'
                  )}
                </Button>
              </form>

              {/* Toggle Register / Login */}
              <div className="text-center mt-5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-slate-400 hover:text-teal-400 font-semibold transition-colors"
                >
                  {isRegister
                    ? '¿Ya tienes credenciales registradas? Inicia Sesión'
                    : '¿Aún no tienes cuenta? Regístrate gratis en 1 minuto'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SELECTOR DE IDENTIDAD CORPORATIVA OAUTH 2.0 (GOOGLE, MS, GIT, META)*/}
      {/* ========================================================================= */}
      {selectedOauthProvider && currentOauthInfo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md bg-[#0F172A] text-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 my-auto animate-scale-in">
            {/* Cabecera del Proveedor Branded */}
            <div className="bg-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-sm">
                  {currentOauthInfo.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white leading-tight">
                    {currentOauthInfo.title}
                  </h3>
                  <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                    {currentOauthInfo.badge}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOauthProvider(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-300 text-xs leading-relaxed">
                {currentOauthInfo.subtitle}. La cuenta se sincronizará automáticamente con tu perfil corporativo en el rol <strong className="text-white capitalize font-bold">"{role === 'provider' ? 'Empresa / Institución' : 'Ciudadano / Encuestado'}"</strong>.
              </p>

              {/* Lista de Cuentas Sugeridas / Verificadas */}
              {!isCustomAccount ? (
                <div className="space-y-2">
                  {currentOauthInfo.accounts.map((acc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleConfirmSocialLogin(acc.email, acc.name)}
                      className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-500/50 text-left flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${acc.avatarBg} text-white font-black text-sm flex items-center justify-center shrink-0`}>
                          {acc.avatarLetter}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs group-hover:text-teal-300 transition-colors">
                            {acc.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {acc.email}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {acc.detail}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}

                  {/* Botón para Ingresar Otra Cuenta Real */}
                  <button
                    type="button"
                    onClick={() => setIsCustomAccount(true)}
                    className="w-full p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-dashed border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-2"
                  >
                    <Plus className="w-4 h-4 text-teal-400" />
                    <span>Usar otra cuenta de {currentOauthInfo.name}...</span>
                  </button>
                </div>
              ) : (
                /* Formulario para ingresar cualquier cuenta real */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleConfirmSocialLogin(customOauthEmail, customOauthName || customOauthEmail.split('@')[0]);
                  }}
                  className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 animate-fade-in"
                >
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Conectar cuenta de {currentOauthInfo.name}</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Correo Electrónico Real de {selectedOauthProvider === 'google' ? 'Gmail / Google' : selectedOauthProvider === 'microsoft' ? 'Microsoft / Outlook' : 'GitHub'}
                    </label>
                    <input
                      type="email"
                      required
                      value={customOauthEmail}
                      onChange={(e) => setCustomOauthEmail(e.target.value)}
                      placeholder="tu-correo@ejemplo.com"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Nombre o Razón Social
                    </label>
                    <input
                      type="text"
                      required
                      value={customOauthName}
                      onChange={(e) => setCustomOauthName(e.target.value)}
                      placeholder="Ej: Ing. David Pérez"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCustomAccount(false)}
                      className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-colors shadow-sm"
                    >
                      Entrar con esta Cuenta 🚀
                    </button>
                  </div>
                </form>
              )}

              {/* Botón Informativo sobre Redirección Directa a Supabase */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>¿Deseas probar conexión HTTP directa?</span>
                <button
                  type="button"
                  onClick={handleTestDirectSupabaseOAuth}
                  className="text-teal-400 hover:underline font-semibold flex items-center gap-1"
                  title="Prueba la llamada directa a Supabase. Nota: Requiere Client ID configurado en Supabase Dashboard."
                >
                  <span>Probar API Supabase</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RECUPERACIÓN MULTIFACTOR (REAL POR CORREO O CÉDULA ECUATORIANA)  */}
      {/* ========================================================================= */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0F172A] text-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 my-auto animate-scale-in">
            {/* Header */}
            <div className="bg-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Recuperación Segura de Cuenta
                  </h3>
                  <p className="text-[11px] text-slate-400">Protocolo de Seguridad Supabase & Identidad Ciudadana</p>
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

            {/* Pestañas de Selección */}
            {recoveryStep < 4 && (
              <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/60 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryTab('email');
                    setRecoveryStep(1);
                    setRecoveryError('');
                    setRecoverySuccess('');
                  }}
                  className={`py-3 px-4 text-center font-bold transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                    recoveryTab === 'email'
                      ? 'border-teal-500 text-teal-400 bg-teal-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Por Correo Real (Supabase)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRecoveryTab('cedula');
                    setRecoveryStep(1);
                    setRecoveryError('');
                    setRecoverySuccess('');
                  }}
                  className={`py-3 px-4 text-center font-bold transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                    recoveryTab === 'cedula'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Por Cédula / RUC (Sin Correo)</span>
                </button>
              </div>
            )}

            {/* Cuerpo del Modal */}
            <div className="p-6 space-y-4 text-xs">
              {recoveryError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-start gap-2 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {recoverySuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-start gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{recoverySuccess}</span>
                </div>
              )}

              {/* ============================================================== */}
              {/* CAMINO 1: ENVÍO REAL DE CORREO SUPABASE AUTH                    */}
              {/* ============================================================== */}
              {recoveryTab === 'email' && (
                <>
                  {recoveryStep === 1 && (
                    <form onSubmit={handleSendEmailReset} className="space-y-4">
                      <p className="text-slate-300 leading-relaxed text-xs">
                        Ingresa el correo electrónico de tu cuenta. Te enviaremos un <strong>enlace oficial criptográfico</strong> directamente a tu bandeja de entrada (Gmail, Outlook, etc.) para restablecer tu clave con total validez.
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={recoveryLoading}
                        className="w-full font-bold"
                      >
                        {recoveryLoading ? 'Enviando Correo Real...' : 'Enviar Correo de Recuperación Oficial 📨'}
                      </Button>
                    </form>
                  )}

                  {recoveryStep === 2 && (
                    <div className="space-y-4 text-center py-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                        <Mail className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-white text-sm">Revisa tu Bandeja de Entrada</h4>
                      <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
                        Hemos despachado el correo de seguridad a <strong className="text-white">{recoveryEmail}</strong>. Haz clic en el enlace para definir tu nueva contraseña.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetRecoveryModal}
                        className="w-full mt-2"
                      >
                        Entendido, cerrar ventana
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* ============================================================== */}
              {/* CAMINO 2: SIN CORREO (POR CÉDULA / RUC ECUATORIANO MÓDULO 10)   */}
              {/* ============================================================== */}
              {recoveryTab === 'cedula' && (
                <>
                  {recoveryStep === 1 && (
                    <form onSubmit={handleSearchByCedula} className="space-y-4">
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-indigo-400" />
                          ¿Olvidaste qué correo usaste o perdiste acceso?
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Ingresa tu <strong>Cédula de Identidad Ecuatoriana (10 dígitos)</strong> o <strong>R.U.C. (13 dígitos)</strong>. El sistema validará el algoritmo Módulo 10 para ubicar tu cuenta y mostrarte una pista de tu correo.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Número de Cédula o R.U.C. Ecuatoriano
                        </label>
                        <input
                          type="text"
                          maxLength={13}
                          required
                          value={recoveryCedula}
                          onChange={(e) => setRecoveryCedula(e.target.value.replace(/\D/g, ''))}
                          placeholder="Ej: 1724589302 (Cédula) o 1793204829001 (RUC)"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400 font-mono"
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
                        className="w-full font-bold"
                      >
                        {recoveryLoading ? 'Buscando en Base de Datos...' : 'Localizar Mi Cuenta en el Sistema 🔍'}
                      </Button>
                    </form>
                  )}

                  {recoveryStep === 2 && foundAccount && (
                    <form onSubmit={handleVerifyIdentityAnswer} className="space-y-4">
                      {/* Tarjeta de Cuenta Encontrada */}
                      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-indigo-400" />
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
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-200">
                          Pregunta de Validación de Titularidad:
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                        />
                      </div>

                      <div className="flex justify-between gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setRecoveryStep(1)}>
                          Atrás
                        </Button>
                        <Button type="submit" variant="secondary">
                          Confirmar y Establecer Clave ✓
                        </Button>
                      </div>
                    </form>
                  )}

                  {recoveryStep === 3 && (
                    <form onSubmit={handleSaveNewPassword} className="space-y-4">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                        ✓ Identidad confirmada para <strong>{foundAccount?.name}</strong>. Define tu nueva clave.
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={recoveryLoading || !newPassword || !confirmPassword}
                        className="w-full mt-2 font-bold"
                      >
                        {recoveryLoading ? 'Actualizando...' : 'Restablecer y Desbloquear Cuenta 🚀'}
                      </Button>
                    </form>
                  )}

                  {recoveryStep === 4 && (
                    <div className="text-center py-4 space-y-4 animate-fade-in">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">¡Contraseña Actualizada y Desbloqueada!</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                          Tu correo registrado es <strong className="text-white">{foundAccount?.email}</strong>. Hemos precargado tus credenciales para que puedas ingresar de inmediato.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={resetRecoveryModal}
                        className="w-full font-bold"
                      >
                        Entrar a la Plataforma 🚀
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
