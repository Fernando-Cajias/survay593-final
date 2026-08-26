import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, ShieldCheck, UserX } from 'lucide-react';

export const AdminUsers = () => {
  const { users } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = users.filter((u) => {
    const matchText =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchText && matchRole;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Gestión de Usuarios 👥</h1>
        <p className="text-xs text-slate-400 mt-1">Control de perfiles, permisos y estado de verificación KYC.</p>
      </div>

      {/* Filter bar */}
      <div className="glass-card p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-stitch border border-slate-700 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Rol:</span>
          {['all', 'doer', 'provider', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                filterRole === r ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r === 'all' ? 'Todos' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
            <tr>
              <th className="p-4">Usuario</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Estado KYC</th>
              <th className="p-4">Saldo / Fondos</th>
              <th className="p-4">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                    style={{ backgroundColor: u.avatarColor || '#0D9488' }}
                  >
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={u.role === 'provider' ? 'secondary' : u.role === 'admin' ? 'warning' : 'primary'}>
                    {u.role}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant={u.verified ? 'success' : 'neutral'} dot>
                    {u.verified ? 'Verificado' : 'Sin KYC'}
                  </Badge>
                </td>
                <td className="p-4 font-bold text-emerald-400">${(u.balance || 0).toFixed(2)}</td>
                <td className="p-4 text-slate-400">
                  {new Date(u.createdAt).toLocaleDateString('es-EC')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
