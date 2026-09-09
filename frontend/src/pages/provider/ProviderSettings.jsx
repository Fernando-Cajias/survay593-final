import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Building2,
  School,
  Mail,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { AccountCancellationModal } from '../../components/account/AccountCancellationModal';
import { Link } from 'react-router-dom';

export const ProviderSettings = () => {
  const { currentUser, updateProfile } = useAuth();
  const { currentOrg, updateOrganization } = useOrganization();

  const [companyName, setCompanyName] = useState(currentOrg?.name || currentUser.company || currentUser.name || '');
  const [ruc, setRuc] = useState(currentUser.ruc || currentOrg?.ruc || '1790012345001');
  const [industry, setIndustry] = useState(currentUser.industry || currentOrg?.type || 'Educación Superior');
  const [city, setCity] = useState(currentUser.city || currentOrg?.city || 'Quito');
  const [representative, setRepresentative] = useState(currentOrg?.rectorName || currentUser.name || '');
  const [saved, setSaved] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const balance = parseFloat(currentUser?.balance) || 0;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      company: companyName,
      ruc,
      industry,
      city,
    });
    if (currentOrg && updateOrganization) {
      updateOrganization({
        name: companyName,
        ruc,
        city,
        rectorName: representative,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            Configuración de la Entidad ⚙️
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de datos corporativos, representante legal, finanzas y estado de cuenta institucional.
          </p>
        </div>
        <Badge variant="secondary" dot>
          {currentOrg?.category === 'education' ? 'Institución Educativa' : 'Organización Verificada'}
        </Badge>
      </div>

      {saved && (
        <div className="p-3.5 rounded-stitch bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> Datos institucionales actualizados correctamente en el sistema central.
        </div>
      )}

      {/* Resumen Financiero Rápido */}
      <div className="glass-card p-5 border-l-4 border-l-primary flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Fondos y Presupuesto Corporativo
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              ${balance.toFixed(2)} USD
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/provider/billing"
            className="px-4 py-2 rounded-stitch bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-primary-light" /> Gestionar Facturación & Pagos
          </Link>
        </div>
      </div>

      {/* Formulario de Datos Corporativos */}
      <form onSubmit={handleSave} className="glass-card p-6 space-y-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" /> Información Tributaria & Representación (Ecuador)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Razón Social / Nombre Comercial <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              RUC Institucional (13 dígitos) <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              placeholder="1790012345001"
              maxLength={13}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Sector / Industria
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
            >
              <option value="Educación Superior">Educación Superior (Universidades / Institutos)</option>
              <option value="Educación Básica y Bachillerato">Educación Básica y Bachillerato</option>
              <option value="Tecnología & Telecomunicaciones">Tecnología & Telecomunicaciones</option>
              <option value="Banca & Finanzas">Banca & Finanzas</option>
              <option value="Consumo Masivo & Retail">Consumo Masivo & Retail</option>
              <option value="Salud & Farmacéutica">Salud & Farmacéutica</option>
              <option value="Sector Público & ONG">Sector Público & ONG</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ciudad Sede Principal
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
            >
              <option value="Quito">Quito</option>
              <option value="Guayaquil">Guayaquil</option>
              <option value="Cuenca">Cuenca</option>
              <option value="Ambato">Ambato</option>
              <option value="Santo Domingo">Santo Domingo</option>
              <option value="Manta">Manta</option>
              <option value="Loja">Loja</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Representante Legal / Rector(a)
            </label>
            <input
              type="text"
              value={representative}
              onChange={(e) => setRepresentative(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Correo Institucional del Administrador (No editable)
            </label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900/50 border border-slate-800 text-slate-500 text-xs cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" size="sm" className="font-bold">
            Guardar Configuración
          </Button>
        </div>
      </form>

      {/* Zona de Peligro & Finiquito Legal: Darse de Baja */}
      <div className="p-6 rounded-stitch bg-red-950/20 border border-red-500/30 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Zona de Peligro: Darse de Baja y Desvinculación Empresarial
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Si tu institución o empresa decide dejar de operar en la plataforma Survey 593, puedes solicitar la cancelación del registro, cierre de campañas y finiquito financiero formal.
            </p>
          </div>
          {balance > 0 && (
            <Badge variant="warning" className="shrink-0">
              Saldo Restante: ${balance.toFixed(2)} USD
            </Badge>
          )}
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Auditoría Contable y Consecuencias:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
            <li>Todas las encuestas y estudios de mercado activos serán pausados y cerrados inmediatamente.</li>
            <li>Se emitirá un <strong>Acta de Finiquito Digital Corporativa</strong> con código de verificación para respaldo legal y tributario (SRI).</li>
            {balance > 0 ? (
              <li className="text-amber-300 font-medium">
                Los ${balance.toFixed(2)} USD remanentes de tu presupuesto podrán ser transferidos formalmente a la cuenta bancaria de tu empresa en Ecuador o acordados mediante finiquito.
              </li>
            ) : (
              <li>Tu cuenta no mantiene saldos pendientes por liquidar.</li>
            )}
          </ul>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setIsCancelModalOpen(true)}
            className="px-4 py-2.5 rounded-stitch bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 hover:border-red-500 text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" /> Darse de Baja de la Plataforma
          </button>
        </div>
      </div>

      {/* Modal de Cancelación & Finiquito */}
      <AccountCancellationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
};
