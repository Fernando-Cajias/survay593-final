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

  // Secure login validating email & password with anti-brute force protection
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

    // First check local state
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail && u.password === password);

    // If not found in local cache, query Supabase in real time
    if (!user && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .eq('password', password)
          .single();

        if (data && !error) {
          user = {
            id: data.id,
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            company: data.company,
            industry: data.industry,
            cedula: data.cedula || null,
            ruc: data.ruc || null,
            age: data.age,
            city: data.city,
            gender: data.gender,
            verified: data.verified,
            balance: parseFloat(data.balance) || 0,
            surveysCompleted: data.surveys_completed || 0,
            streak: data.streak || 0,
            avatarColor: data.avatar_color || '#0D9488',
            createdAt: data.created_at,
          };
          setUsers((prev) => [...prev.filter((u) => u.id !== user.id), user]);
        }
      } catch (err) {
        console.warn('Error verifying login on Supabase:', err);
      }
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

  // Secure registration creating real profile in Supabase
  const register = async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();

    // Check email uniqueness locally
    const existsLocally = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (existsLocally) {
      return { success: false, message: 'Este correo electrónico ya está registrado en la plataforma.' };
    }

    // Check uniqueness in Supabase
    if (isSupabaseConfigured) {
      try {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existing) {
          return { success: false, message: 'Este correo electrónico ya está registrado en la plataforma.' };
        }
      } catch (err) {
        console.warn('Error checking existing email:', err);
      }
    }

    const newUser = {
      id: `user_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: userData.role || 'doer',
      company: userData.company ? userData.company.trim() : null,
      industry: userData.industry ? userData.industry.trim() : null,
      city: userData.city || 'Quito',
      gender: userData.gender || 'F',
      balance: userData.role === 'provider' ? 500.0 : (userData.initialBalance ? parseFloat(userData.initialBalance) : 0.0),
      verified: false,
      surveysCompleted: 0,
      streak: 0,
      avatarColor: userData.role === 'provider' ? '#0D9488' : '#6366F1',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Save directly to Supabase PostgreSQL
    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').insert([
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
            age: newUser.age,
            verified: false,
            balance: newUser.balance,
            surveys_completed: 0,
            streak: 0,
            avatar_color: newUser.avatarColor,
          },
        ]);
      } catch (err) {
        console.error('Error saving user to Supabase:', err);
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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        updateProfile,
        checkLockStatus,
        unlockAccount,
        findAccountByIdentity,
        resetPassword,
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
