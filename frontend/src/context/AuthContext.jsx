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

  // Load live users from Supabase on mount if configured
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

          // If current user is logged in, refresh their data
          if (currentUser) {
            const fresh = mappedUsers.find((u) => u.id === currentUser.id);
            if (fresh) setCurrentUser(fresh);
          }
        }
      } catch (err) {
        console.warn('Could not sync users from Supabase, using local state:', err);
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

  const login = (email, password) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Credenciales incorrectas' };
  };

  const loginAs = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false };
  };

  const register = async (userData) => {
    const exists = users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'El correo electrónico ya está registrado' };
    }

    const newUser = {
      id: `user_${Date.now().toString(36)}`,
      ...userData,
      balance: userData.role === 'provider' ? 1000 : 0,
      verified: false,
      surveysCompleted: 0,
      streak: 0,
      avatarColor: '#0D9488',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Sync to Supabase in background
    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').insert([
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role,
            company: newUser.company || null,
            industry: newUser.industry || null,
            city: newUser.city || 'Quito',
            gender: newUser.gender || 'F',
            verified: false,
            balance: newUser.balance,
            surveys_completed: 0,
            streak: 0,
            avatar_color: newUser.avatarColor,
          },
        ]);
      } catch (err) {
        console.warn('Error saving user to Supabase:', err);
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

    // Sync to Supabase
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
        loginAs,
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
