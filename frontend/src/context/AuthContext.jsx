import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { INITIAL_USERS } from '../services/seedData';
import { maskEmail } from '../services/ecuadorValidators';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'survey593_react_user';
const USERS_STORAGE_KEY = 'survey593_react_users';
const SECURITY_LOCKS_KEY = 'survey593_security_locks';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 900; // 15 minutos de bloqueo por fuerza bruta

// Helper para leer bloqueos de localStorage
const getSecurityLocks = () => {
  try {
    const data = localStorage.getItem(SECURITY_LOCKS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// Helper para guardar bloqueos
const saveSecurityLocks = (locks) => {
  try {
    localStorage.setItem(SECURITY_LOCKS_KEY, JSON.stringify(locks));
  } catch (err) {
    console.warn('Could not save security locks:', err);
  }
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [isPasswordRecoveryActive, setIsPasswordRecoveryActive] = useState(false);

  // Escuchar eventos de Supabase Auth (OAuth login, password recovery, refresh)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Verificar si la URL actual viene de un callback de recuperación de contraseña
    if (window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery')) {
      setIsPasswordRecoveryActive(true);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Evento de Autenticación Supabase:', event, session?.user?.email);

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecoveryActive(true);
      }

      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        const supaUser = session.user;
        const supaEmail = (supaUser.email || '').toLowerCase();
        const pendingRole = sessionStorage.getItem('survey593_oauth_role') || 'doer';
        const pendingCompany = sessionStorage.getItem('survey593_oauth_company') || '';

        // Buscar perfil existente en la tabla profiles
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', supaEmail)
            .maybeSingle();

          let appUser;
          if (profile) {
            appUser = {
              id: profile.id,
              name: profile.name || supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || 'Usuario',
              email: profile.email,
              role: profile.role || pendingRole,
              company: profile.company || pendingCompany,
              industry: profile.industry || 'Tecnología',
              city: profile.city || 'Quito',
              verified: true,
              balance: parseFloat(profile.balance) || 0,
              surveysCompleted: profile.surveys_completed || 0,
              streak: profile.streak || 0,
              avatarColor: profile.avatar_color || '#0D9488',
              avatarUrl: supaUser.user_metadata?.avatar_url || null,
              createdAt: profile.created_at,
            };
          } else {
            // Crear perfil en profiles si es primer login con Google / Microsoft / GitHub / Meta
            const fullName =
              supaUser.user_metadata?.full_name ||
              supaUser.user_metadata?.name ||
              supaEmail.split('@')[0];

            appUser = {
              id: supaUser.id,
              name: fullName,
              email: supaEmail,
              role: pendingRole,
              company: pendingCompany,
              industry: 'Tecnología',
              city: 'Quito',
              gender: 'O',
              age: 25,
              verified: true,
              balance: pendingRole === 'provider' ? 1000 : 5.0,
              surveysCompleted: 0,
              streak: 1,
              avatarColor: '#0D9488',
              avatarUrl: supaUser.user_metadata?.avatar_url || null,
              createdAt: new Date().toISOString(),
            };

            await supabase.from('profiles').insert([
              {
                id: appUser.id,
                name: appUser.name,
                email: appUser.email,
                role: appUser.role,
                company: appUser.company,
                industry: appUser.industry,
                city: appUser.city,
                verified: appUser.verified,
                balance: appUser.balance,
              },
            ]);
          }

          setCurrentUser(appUser);
          setUsers((prev) => [...prev.filter((u) => u.email !== supaEmail), appUser]);
          resetFailedAttempts(supaEmail);
        } catch (err) {
          console.warn('Error sincronizando perfil OAuth:', err);
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Load live users from Supabase on mount
  useEffect(() => {
    async function loadSupabaseUsers() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (!error && data && data.length > 0) {
          const mappedUsers = data.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            password: u.password,
            role: u.role,
            company: u.company,
            industry: u.industry,
            age: u.age,
            city: u.city,
            gender: u.gender,
            verified: u.verified,
            balance: parseFloat(u.balance) || 0,
            surveysCompleted: u.surveys_completed || 0,
            streak: u.streak || 0,
            avatarColor: u.avatar_color || '#0D9488',
            createdAt: u.created_at,
          }));
          setUsers(mappedUsers);

          if (currentUser) {
            const fresh = mappedUsers.find((u) => u.id === currentUser.id);
            if (fresh) setCurrentUser(fresh);
          }
        }
      } catch (err) {
        console.warn('Could not sync users from Supabase:', err);
      }
    }

    loadSupabaseUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  // Consultar estado de bloqueo por email o identificador
  const checkLockStatus = (emailOrId) => {
    if (!emailOrId) return { isLocked: false, remainingSeconds: 0, attempts: 0 };
    const key = emailOrId.trim().toLowerCase();
    const locks = getSecurityLocks();
    const lock = locks[key];
    if (!lock) return { isLocked: false, remainingSeconds: 0, attempts: 0 };

    const attempts = lock.attempts || 0;
    if (lock.lockedUntil) {
      const now = Date.now();
      const diff = Math.ceil((lock.lockedUntil - now) / 1000);
      if (diff > 0) {
        return { isLocked: true, remainingSeconds: diff, attempts };
      } else {
        // Expiró el bloqueo temporal
        delete lock.lockedUntil;
        lock.attempts = 0;
        saveSecurityLocks(locks);
        return { isLocked: false, remainingSeconds: 0, attempts: 0 };
      }
    }
    return { isLocked: false, remainingSeconds: 0, attempts };
  };

  // Registrar intento fallido
  const recordFailedAttempt = (emailOrId) => {
    if (!emailOrId) return { isLocked: false, remainingSeconds: 0, attempts: 1 };
    const key = emailOrId.trim().toLowerCase();
    const locks = getSecurityLocks();
    const lock = locks[key] || { attempts: 0 };
    lock.attempts = (lock.attempts || 0) + 1;
    lock.lastAttempt = Date.now();

    if (lock.attempts >= MAX_FAILED_ATTEMPTS) {
      lock.lockedUntil = Date.now() + (LOCKOUT_DURATION_SECONDS * 1000);
      locks[key] = lock;
      saveSecurityLocks(locks);
      return {
        isLocked: true,
        remainingSeconds: LOCKOUT_DURATION_SECONDS,
        attempts: lock.attempts,
        remainingAttempts: 0,
        message: 'Acceso bloqueado por seguridad tras 5 intentos fallidos. Espera 15 minutos o desbloquea tu cuenta verificando tu identidad.',
      };
    }

    locks[key] = lock;
    saveSecurityLocks(locks);
    const remaining = MAX_FAILED_ATTEMPTS - lock.attempts;
    return {
      isLocked: false,
      remainingSeconds: 0,
      attempts: lock.attempts,
      remainingAttempts: remaining,
      message: 'Correo electrónico o contraseña incorrectos.',
    };
  };

  // Resetear intentos fallidos (en login exitoso o desbloqueo manual)
  const resetFailedAttempts = (emailOrId) => {
    if (!emailOrId) return;
    const key = emailOrId.trim().toLowerCase();
    const locks = getSecurityLocks();
    if (locks[key]) {
      delete locks[key];
      saveSecurityLocks(locks);
    }
  };

  // Desbloquear cuenta manualmente
  const unlockAccount = (emailOrId) => {
    resetFailedAttempts(emailOrId);
    return { success: true, message: 'La cuenta ha sido desbloqueada exitosamente.' };
  };

  // Búsqueda de cuenta por Identidad (Correo, Cédula de Identidad, RUC o Empresa)
  const findAccountByIdentity = async (identifier) => {
    if (!identifier) return { success: false, message: 'Ingresa un identificador válido.' };
    const clean = identifier.trim().toLowerCase();

    // 1. Buscar en cache local
    let user = users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        (u.cedula && u.cedula.trim() === identifier.trim()) ||
        (u.ruc && u.ruc.trim() === identifier.trim()) ||
        (u.company && u.company.toLowerCase() === clean) ||
        (u.name && u.name.toLowerCase() === clean)
    );

    // 2. Si no está en local, buscar en Supabase
    if (!user && isSupabaseConfigured) {
      try {
        const { data: byEmail } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', clean)
          .maybeSingle();

        if (byEmail) {
          user = byEmail;
        } else {
          const { data: byCompany } = await supabase
            .from('profiles')
            .select('*')
            .ilike('company', clean)
            .maybeSingle();
          if (byCompany) user = byCompany;
        }
      } catch (err) {
        console.warn('Error searching identity on Supabase:', err);
      }
    }

    if (user) {
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          maskedEmail: maskEmail(user.email),
          role: user.role,
          company: user.company || null,
          city: user.city || 'Quito',
          verified: Boolean(user.verified),
        },
      };
    }

    return {
      success: false,
      message: 'No encontramos ninguna cuenta registrada con esta información. Por favor verifica tus datos.',
    };
  };

  // Restablecer contraseña y desbloquear
  const resetPassword = async (userIdOrEmail, newPassword) => {
    if (!userIdOrEmail || !newPassword || newPassword.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    const clean = userIdOrEmail.trim().toLowerCase();
    const user = users.find((u) => u.id === userIdOrEmail || u.email.toLowerCase() === clean);

    if (!user) {
      return { success: false, message: 'Usuario no encontrado para restablecer contraseña.' };
    }

    // Actualizar en estado local
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, password: newPassword } : u))
    );

    // Si el usuario actual es el mismo, actualizarlo
    if (currentUser?.id === user.id) {
      setCurrentUser((prev) => ({ ...prev, password: newPassword }));
    }

    // Actualizar en Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('profiles')
          .update({ password: newPassword })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Error updating password in Supabase:', err);
      }
    }

    // Desbloquear cuenta automáticamente si estaba bloqueada
    resetFailedAttempts(user.email);

    return {
      success: true,
      message: 'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva clave.',
    };
  };

  // Secure login validating email & password with anti-brute force protection & Real Supabase Auth
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Verificar si la cuenta está bloqueada por intentos fallidos
    const lockStatus = checkLockStatus(cleanEmail);
    if (lockStatus.isLocked) {
      return {
        success: false,
        isLocked: true,
        remainingSeconds: lockStatus.remainingSeconds,
        attempts: lockStatus.attempts,
        message: `Acceso bloqueado por seguridad debido a 5 intentos fallidos consecutivos. Intenta nuevamente en ${Math.ceil(lockStatus.remainingSeconds / 60)} min o desbloquea tu cuenta verificando tu identidad.`,
      };
    }

    let user = null;

    // 2. Intentar autenticación REAL con Supabase Auth (auth.users)
    if (isSupabaseConfigured) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (authData?.user && !authError) {
          // Usuario autenticado con éxito en Supabase Auth
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          if (profile) {
            user = {
              id: profile.id,
              name: profile.name || authData.user.user_metadata?.name || 'Usuario',
              email: profile.email,
              password: password,
              role: profile.role || 'doer',
              company: profile.company || '',
              industry: profile.industry || 'Tecnología',
              cedula: profile.cedula || null,
              ruc: profile.ruc || null,
              age: profile.age || 25,
              city: profile.city || 'Quito',
              gender: profile.gender || 'O',
              verified: profile.verified ?? true,
              balance: parseFloat(profile.balance) || 0,
              surveysCompleted: profile.surveys_completed || 0,
              streak: profile.streak || 0,
              avatarColor: profile.avatar_color || '#0D9488',
              createdAt: profile.created_at || authData.user.created_at,
            };
          } else {
            const meta = authData.user.user_metadata || {};
            user = {
              id: authData.user.id,
              name: meta.name || cleanEmail.split('@')[0],
              email: cleanEmail,
              password: password,
              role: meta.role || 'doer',
              company: meta.company || '',
              industry: 'Tecnología',
              city: 'Quito',
              gender: 'O',
              age: 25,
              verified: true,
              balance: meta.role === 'provider' ? 500.0 : 0.0,
              surveysCompleted: 0,
              streak: 0,
              avatarColor: '#0D9488',
              createdAt: authData.user.created_at,
            };
            await supabase.from('profiles').upsert([
              {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                industry: user.industry,
                city: user.city,
                verified: true,
                balance: user.balance,
              },
            ]);
          }
        }
      } catch (err) {
        console.warn('Error en supabase.auth.signInWithPassword:', err);
      }
    }

    // 3. Si no inició por Supabase Auth, revisar en tabla profiles / cache local
    if (!user && isSupabaseConfigured) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .eq('password', password)
          .maybeSingle();

        if (profile) {
          user = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            password: profile.password,
            role: profile.role,
            company: profile.company,
            industry: profile.industry,
            cedula: profile.cedula || null,
            ruc: profile.ruc || null,
            age: profile.age,
            city: profile.city,
            gender: profile.gender,
            verified: profile.verified,
            balance: parseFloat(profile.balance) || 0,
            surveysCompleted: profile.surveys_completed || 0,
            streak: profile.streak || 0,
            avatarColor: profile.avatar_color || '#0D9488',
            createdAt: profile.created_at,
          };
        }
      } catch (err) {
        console.warn('Error buscando en profiles:', err);
      }
    }

    // 4. Fallback a usuarios en memoria
    if (!user) {
      user = users.find((u) => u.email.toLowerCase() === cleanEmail && u.password === password);
    }

    if (user) {
      // Limpiar intentos fallidos tras login exitoso
      resetFailedAttempts(cleanEmail);
      setCurrentUser(user);
      return { success: true, user };
    }

    // Registrar intento fallido
    const failInfo = recordFailedAttempt(cleanEmail);
    return {
      success: false,
      isLocked: failInfo.isLocked,
      remainingSeconds: failInfo.remainingSeconds,
      attempts: failInfo.attempts,
      remainingAttempts: failInfo.remainingAttempts,
      message: failInfo.isLocked
        ? failInfo.message
        : failInfo.attempts >= 3
        ? `Contraseña incorrecta. ⚠️ Advertencia: Llevas ${failInfo.attempts} de 5 intentos. Al 5to intento tu acceso será bloqueado por seguridad.`
        : 'Correo electrónico o contraseña incorrectos. Por favor verifica tus credenciales.',
    };
  };

  // Secure registration creating real auth record in Supabase Auth & profiles
  const register = async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();

    // 1. Registro REAL en Supabase Auth
    let authUser = null;
    if (isSupabaseConfigured) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: userData.password,
          options: {
            data: {
              name: userData.name.trim(),
              role: userData.role || 'doer',
              company: userData.company ? userData.company.trim() : null,
            },
          },
        });

        if (authError) {
          if (authError.message?.toLowerCase().includes('already') || authError.status === 422) {
            return { success: false, message: 'Este correo electrónico ya está registrado en la plataforma.' };
          }
          console.warn('Advertencia en Supabase Auth signUp:', authError.message);
        }

        if (authData?.user) {
          authUser = authData.user;
        }
      } catch (err) {
        console.warn('Error en supabase.auth.signUp:', err);
      }
    }

    // Check email uniqueness locally
    const existsLocally = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (existsLocally && !authUser) {
      return { success: false, message: 'Este correo electrónico ya está registrado en la plataforma.' };
    }

    const userId = authUser ? authUser.id : `user_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;

    const newUser = {
      id: userId,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: userData.role || 'doer',
      company: userData.company ? userData.company.trim() : null,
      industry: userData.industry ? userData.industry.trim() : null,
      city: userData.city || 'Quito',
      gender: userData.gender || 'F',
      cedula: userData.cedula || null,
      ruc: userData.ruc || null,
      balance: userData.role === 'provider' ? 500.0 : (userData.initialBalance ? parseFloat(userData.initialBalance) : 0.0),
      verified: true,
      surveysCompleted: 0,
      streak: 0,
      avatarColor: userData.role === 'provider' ? '#0D9488' : '#6366F1',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev.filter((u) => u.email !== cleanEmail), newUser]);
    setCurrentUser(newUser);

    // Guardar en la tabla profiles de Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').upsert([
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role,
            company: newUser.company,
            industry: newUser.industry,
            city: newUser.city,
            gender: newUser.gender,
            cedula: newUser.cedula,
            ruc: newUser.ruc,
            verified: true,
            balance: newUser.balance,
            surveys_completed: 0,
            streak: 0,
            avatar_color: newUser.avatarColor,
          },
        ]);
      } catch (err) {
        console.error('Error saving user profile to Supabase:', err);
      }
    }

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = async (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('profiles')
          .update({
            name: updated.name,
            city: updated.city,
            age: updated.age,
            gender: updated.gender,
            verified: updated.verified,
            balance: updated.balance,
            surveys_completed: updated.surveysCompleted,
            streak: updated.streak,
          })
          .eq('id', updated.id);
      } catch (err) {
        console.warn('Error updating profile in Supabase:', err);
      }
    }
  };

  // Iniciar Sesión con Proveedores Oficiales OAuth (Google, Microsoft, GitHub, Meta)
  const signInWithOAuth = async (provider, role = 'doer', company = '') => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase no está configurado.' };
    }

    try {
      sessionStorage.setItem('survey593_oauth_role', role);
      if (company) sessionStorage.setItem('survey593_oauth_company', company);

      // En Supabase, Microsoft se llama 'azure'
      const targetProvider = provider === 'microsoft' ? 'azure' : provider;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: targetProvider,
        options: {
          redirectTo: `${window.location.origin}/login`,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data?.url) {
        // Si es Google (ya activado oficialmente en Supabase), redirigir de inmediato a Google
        if (targetProvider === 'google') {
          window.location.href = data.url;
          return { success: true, data };
        }

        // Para otros proveedores aún no activados en Supabase, validar antes de redirigir
        try {
          const checkRes = await fetch(data.url);
          if (checkRes.status === 400) {
            const body = await checkRes.json().catch(() => ({}));
            if (body?.msg?.includes('provider is not enabled') || body?.error_code === 'validation_failed') {
              return {
                success: false,
                isNotEnabled: true,
                provider,
                message: `El proveedor ${provider.toUpperCase()} aún no está activado en tu panel de Supabase.`,
              };
            }
          }
        } catch (fetchErr) {
          // Si hubo error de red o CORS, continuar
        }

        // Redirigir oficialmente
        window.location.href = data.url;
        return { success: true, data };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.message || 'Error iniciando sesión con proveedor social.' };
    }
  };

  // Enviar correo real de recuperación mediante Supabase Auth
  const sendRealPasswordResetEmail = async (emailToReset) => {
    const cleanEmail = (emailToReset || '').trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
    }

    if (!isSupabaseConfigured) {
      return { success: false, message: 'El servicio de correo Supabase no está configurado.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/login?type=recovery`,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message: `¡Correo enviado! Revisa tu bandeja de entrada o spam en ${cleanEmail}. Hemos enviado el enlace oficial para que restablezcas tu contraseña de forma segura.`,
      };
    } catch (err) {
      return { success: false, message: err.message || 'No se pudo enviar el correo de recuperación.' };
    }
  };

  // Actualizar contraseña real a través de Supabase Auth
  const updateRealPassword = async (newPass) => {
    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase no está disponible.' };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPass,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data?.user?.email) {
        const uEmail = data.user.email.toLowerCase();
        await supabase
          .from('profiles')
          .update({ password: newPass })
          .eq('email', uEmail);

        resetFailedAttempts(uEmail);
      }

      setIsPasswordRecoveryActive(false);
      return {
        success: true,
        message: 'Tu contraseña ha sido actualizada y asegurada en el servidor central. Ya puedes iniciar sesión.',
      };
    } catch (err) {
      return { success: false, message: err.message || 'Error actualizando contraseña en Supabase.' };
    }
  };

  // Autenticación Social Unificada (Sincroniza con Supabase profiles en tiempo real)
  const loginWithSocialAccount = async ({ provider, email, name, avatarUrl, role = 'doer', company = '' }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Se requiere un correo electrónico válido para autenticar.' };
    }

    // 1. Buscar si ya existe en Supabase o en cache local
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user && isSupabaseConfigured) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();
        if (profile) user = profile;
      } catch (err) {
        console.warn('Error buscando perfil en Supabase:', err);
      }
    }

    if (!user) {
      // Crear nuevo usuario en Supabase con su perfil verificado
      const newId = `oauth_${provider}_${Date.now()}`;
      user = {
        id: newId,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: '',
        role: role,
        company: company || (role === 'provider' ? 'Orión Technologies' : ''),
        industry: 'Tecnología',
        city: 'Quito',
        gender: 'O',
        age: 25,
        verified: true,
        balance: role === 'provider' ? 1000 : 5.0,
        surveysCompleted: 0,
        streak: 1,
        avatarColor: provider === 'google' ? '#4285F4' : provider === 'microsoft' ? '#05A6F0' : provider === 'github' ? '#24292F' : '#0081FB',
        avatarUrl: avatarUrl || null,
        provider: provider,
        createdAt: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('profiles').upsert([
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              company: user.company,
              industry: user.industry,
              city: user.city,
              verified: true,
              balance: user.balance,
            },
          ]);
        } catch (err) {
          console.warn('Error insertando perfil en Supabase:', err);
        }
      }

      setUsers((prev) => [...prev.filter((u) => u.email !== cleanEmail), user]);
    }

    resetFailedAttempts(cleanEmail);
    setCurrentUser(user);
    return { success: true, user };
  };

  // Darse de baja y liquidación formal de cuenta con auditoría legal
  const processAccountCancellation = async ({
    reason,
    feedback,
    settlementType = 'forfeit', // 'bank_transfer', 'forfeit', 'zero_balance'
    bankDetails = {},
    idDocument = '',
  }) => {
    if (!currentUser) {
      return { success: false, message: 'No hay usuario autenticado.' };
    }

    const cancellationId = `canc_${Date.now()}`;
    const certCode = `FINIQUITO-EC-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const userToCancel = { ...currentUser };

    const cancellationRecord = {
      id: cancellationId,
      userId: userToCancel.id,
      email: userToCancel.email,
      name: userToCancel.name,
      role: userToCancel.role,
      company: userToCancel.company || '',
      finalBalance: parseFloat(userToCancel.balance) || 0,
      settlementType,
      bankName: bankDetails.bankName || '',
      bankAccountType: bankDetails.accountType || '',
      bankAccountNumber: bankDetails.accountNumber || '',
      idDocument: idDocument || '',
      reason: reason || 'Baja voluntaria de la plataforma',
      feedback: feedback || '',
      certificateCode: certCode,
      status: settlementType === 'bank_transfer' ? 'pending_transfer' : 'completed',
      createdAt: new Date().toISOString(),
    };

    // 1. Ejecutar en Supabase (función stored procedure segura)
    if (isSupabaseConfigured) {
      try {
        const { error: rpcError } = await supabase.rpc('execute_account_cancellation', {
          p_cancellation_id: cancellationId,
          p_user_id: userToCancel.id,
          p_email: userToCancel.email,
          p_name: userToCancel.name,
          p_role: userToCancel.role,
          p_company: userToCancel.company || '',
          p_final_balance: parseFloat(userToCancel.balance) || 0,
          p_settlement_type: settlementType,
          p_bank_name: bankDetails.bankName || '',
          p_bank_account_type: bankDetails.accountType || '',
          p_bank_account_number: bankDetails.accountNumber || '',
          p_id_document: idDocument || '',
          p_reason: reason || 'Baja voluntaria',
          p_feedback: feedback || '',
          p_certificate_code: certCode,
        });

        if (rpcError) {
          console.warn('RPC cancellation error, executing fallback deletion:', rpcError);
          // Fallback manual en caso de que el RPC falle
          await supabase.from('account_cancellations').insert([{
            id: cancellationId,
            user_id: userToCancel.id,
            email: userToCancel.email,
            name: userToCancel.name,
            role: userToCancel.role,
            company: userToCancel.company || '',
            final_balance: parseFloat(userToCancel.balance) || 0,
            settlement_type: settlementType,
            bank_name: bankDetails.bankName || '',
            bank_account_type: bankDetails.accountType || '',
            bank_account_number: bankDetails.accountNumber || '',
            id_document: idDocument || '',
            reason: reason || 'Baja voluntaria',
            feedback: feedback || '',
            certificate_code: certCode,
            status: settlementType === 'bank_transfer' ? 'pending_transfer' : 'completed',
          }]).catch(() => {});

          await supabase.from('profiles').delete().eq('id', userToCancel.id);
        }

        // Cerrar sesión en Supabase Auth
        await supabase.auth.signOut().catch(() => {});
      } catch (err) {
        console.warn('Error en Supabase al procesar baja:', err);
      }
    }

    // 2. Guardar comprobante de finiquito en localStorage para consulta inmediata
    try {
      localStorage.setItem('survey593_last_cancellation', JSON.stringify(cancellationRecord));
    } catch (e) {}

    // 3. Limpiar estado local del navegador
    setUsers((prev) => prev.filter((u) => u.id !== userToCancel.id && u.email !== userToCancel.email));
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);

    return {
      success: true,
      certificateCode: certCode,
      cancellationRecord,
      message: 'Cuenta dada de baja exitosamente conforme a la normativa legal.',
    };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        updateProfile,
        processAccountCancellation,
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
        isAuthenticated: Boolean(currentUser),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
