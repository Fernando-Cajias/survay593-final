import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { INITIAL_USERS } from '../services/seedData';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'survey593_react_user';
const USERS_STORAGE_KEY = 'survey593_react_users';

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

  // Secure login validating email & password
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

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
      setCurrentUser(user);
      return { success: true, user };
    }

    return {
      success: false,
      message: 'Correo electrónico o contraseña incorrectos. Por favor verifica tus credenciales.',
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
