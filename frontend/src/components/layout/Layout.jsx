import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';

export const Layout = ({ allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const defaultRoute =
      currentUser.role === 'provider' ? '/provider' : currentUser.role === 'admin' ? '/admin' : '/doer';
    return <Navigate to={defaultRoute} replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B1121] flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
