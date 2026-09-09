import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  User,
  ShieldCheck,
  PlusCircle,
  BarChart3,
  CreditCard,
  Palette,
  FolderKanban,
  Users,
  Sparkles,
  Layers,
  LogOut,
  School,
  Building2,
  Settings,
} from 'lucide-react';

export const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const { currentOrg } = useOrganization();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const getMenuItems = () => {
    switch (currentUser.role) {
      case 'doer':
        return [
          {
            section: 'Principal',
            items: [
              { label: 'Dashboard', icon: LayoutDashboard, path: '/doer' },
              { label: 'Encuestas', icon: ClipboardList, path: '/doer/surveys' },
              { label: 'Mi Wallet', icon: Wallet, path: '/doer/wallet' },
            ],
          },
          {
            section: 'Cuenta',
            items: [
              { label: 'Mi Perfil', icon: User, path: '/doer/profile' },
              { label: 'Verificación KYC', icon: ShieldCheck, path: '/doer/verification' },
            ],
          },
        ];
      case 'provider':
        return [
          {
            section: currentOrg?.category === 'education' ? 'Panel Institucional' : 'Panel Empresa',
            items: [
              { label: 'Dashboard', icon: LayoutDashboard, path: '/provider' },
              {
                label: currentOrg ? 'Mi Organización' : 'Registrar Organización',
                icon: currentOrg?.category === 'education' ? School : Building2,
                path: '/provider/onboarding',
              },
              { label: 'Crear Encuesta', icon: PlusCircle, path: '/provider/create' },
              { label: 'Mis Campañas', icon: ClipboardList, path: '/provider/campaigns' },
            ],
          },
          {
            section: 'No-Code BI Studio',
            items: [
              { label: 'Dashboard Studio', icon: Palette, path: '/provider/studio' },
              { label: 'Mis Dashboards', icon: FolderKanban, path: '/provider/dashboards' },
            ],
          },
          {
            section: 'Análisis & Finanzas',
            items: [
              { label: 'Resultados', icon: BarChart3, path: '/provider/results' },
              { label: 'Facturación', icon: CreditCard, path: '/provider/billing' },
              { label: 'Configuración & Cuenta', icon: Settings, path: '/provider/settings' },
            ],
          },
        ];
      case 'admin':
        return [
          {
            section: 'Gestión',
            items: [
              { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
              { label: 'Usuarios', icon: Users, path: '/admin/users' },
              { label: 'Encuestas', icon: ClipboardList, path: '/admin/surveys' },
            ],
          },
          {
            section: 'Ecosistema',
            items: [
              { label: 'Calidad ARCO+', icon: Sparkles, path: '/admin/quality' },
              { label: 'Kolab 16 Proyectos', icon: Layers, path: '/admin/ecosystem' },
            ],
          },
        ];
      default:
        return [];
    }
  };

  const menuSections = getMenuItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileLink = currentUser.role === 'provider' ? '/provider/settings' : currentUser.role === 'doer' ? '/doer/profile' : '/admin';

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-stitch bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-extrabold text-white text-lg shadow-glow-sm">
            S5
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-extrabold text-white text-base tracking-tight leading-none">Survey 593</h2>
            {currentUser.role === 'provider' && currentOrg ? (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
                <span className="text-[11px] text-slate-300 font-semibold truncate block" title={currentOrg.name}>
                  {currentOrg.name}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-primary-light font-semibold uppercase tracking-wider block mt-0.5">
                {currentUser.role === 'provider' ? 'Organización' : currentUser.role === 'admin' ? 'Admin Kolab' : 'Encuestado'}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuSections.map((sec, i) => (
            <div key={i}>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                {sec.section}
              </div>
              <div className="space-y-1">
                {sec.items.map((item, j) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/doer' && item.path !== '/provider' && item.path !== '/admin' && location.pathname.startsWith(item.path));

                  return (
                    <Link
                      key={j}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-stitch text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-glow-sm font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between p-2 rounded-stitch bg-slate-800/60 border border-slate-700/50">
          <Link
            to={profileLink}
            title="Ir a mi configuración"
            className="flex items-center gap-2.5 min-w-0 hover:opacity-85 transition-opacity flex-1 mr-2"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
              style={{ backgroundColor: currentUser.avatarColor || '#0D9488' }}
            >
              {currentUser.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-stitch hover:bg-slate-700/60 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
