import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { KpiCard } from '../../components/ui/KpiCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  CreditCard,
  DollarSign,
  Wallet,
  ArrowUpRight,
  Plus,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const ProviderBilling = () => {
  const { currentUser, updateProfile } = useAuth();
  const { surveys } = useDatabase();

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('250.00');
  const [payMethod, setPayMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const mySurveys = surveys.filter((s) => s.providerId === currentUser.id);
  const totalBudget = mySurveys.reduce((s, sv) => s + (sv.budget || 0), 0);
  const totalSpent = mySurveys.reduce((s, sv) => s + (sv.spent || 0), 0);
  const activeEscrow = mySurveys
    .filter((s) => s.status === 'active')
    .reduce((s, sv) => s + (sv.escrowBalance || (sv.budget - sv.spent) || 0), 0);

  const handleTopUp = (e) => {
    e.preventDefault();
    const addVal = parseFloat(topUpAmount);
    if (!addVal || addVal <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const newBal = (currentUser.balance || 0) + addVal;
      updateProfile({ balance: newBal });
      setIsProcessing(false);
      setSuccessMsg(`¡Fondos acreditados con éxito! Se añadieron $${addVal.toFixed(2)} USD a tu cuenta corporativa.`);

      setTimeout(() => {
        setSuccessMsg('');
        setShowTopUpModal(false);
      }, 1500);
    }, 1100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Facturación y Presupuestos Empresariales 💳</h1>
          <p className="text-xs text-slate-400 mt-1">
            Control de fondos en custodia (Escrow), gastos de investigación y saldo corporativo.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowTopUpModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
        >
          Recargar Saldo Corporativo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KpiCard
          title="Saldo Disponible en Cuenta"
          value={`$${(currentUser.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="Listo para financiar nuevos estudios"
          icon={Wallet}
          accent="primary"
        />
        <KpiCard
          title="Fondos en Custodia (Escrow)"
          value={`$${activeEscrow.toFixed(2)}`}
          subtitle="Reservado para encuestados activos"
          icon={Lock}
          accent="warning"
        />
        <KpiCard
          title="Total Liquidado a Ciudadanos"
          value={`$${totalSpent.toFixed(2)}`}
          subtitle="Pagado en respuestas verificadas"
          icon={DollarSign}
          accent="secondary"
        />
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 rounded-stitch-lg bg-slate-900/60 border border-slate-700/60 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <span className="font-bold text-white">Protocolo de Fondos Protegidos (Escrow):</span> Las empresas fondean sus
          estudios por adelantado. Los valores destinados a encuestados se congelan en custodia y solo se debitan cuando un
          ciudadano real completa satisfactoriamente el cuestionario. Cero cobros por respuestas descartadas o bots.
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-4">Desglose de Campañas y Presupuestos</h2>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="p-4">Campaña / Estudio</th>
                <th className="p-4">Presupuesto Fondeado</th>
                <th className="p-4">Liquidado a Usuarios</th>
                <th className="p-4">Fondo Restante en Custodia</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {mySurveys.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white text-sm">{s.title}</td>
                  <td className="p-4 text-slate-300 font-semibold">${s.budget?.toFixed(2) || '0.00'}</td>
                  <td className="p-4 text-slate-300 font-semibold">${s.spent?.toFixed(2) || '0.00'}</td>
                  <td className="p-4 text-emerald-400 font-bold">
                    ${((s.budget || 0) - (s.spent || 0)).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <Badge variant={s.status === 'active' ? 'success' : 'neutral'} dot>
                      {s.status === 'active' ? 'Financiada y Activa' : s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Recarga Corporativa */}
      <Modal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        title="💳 Recargar Saldo Corporativo para Campañas"
      >
        {successMsg ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-white">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleTopUp} className="space-y-4 text-xs">
            <p className="text-slate-300">
              Ingresa el monto que deseas añadir a la cuenta corporativa de tu empresa para financiar futuros estudios.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Monto a Recargar ($ USD)</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {['150.00', '350.00', '700.00'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTopUpAmount(val)}
                    className={`py-2 rounded-stitch border text-center font-bold transition-colors ${
                      topUpAmount === val
                        ? 'border-primary bg-primary/20 text-primary-light'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    ${val} USD
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="50"
                min="50"
                required
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Método de Fondeo</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2.5 rounded-stitch bg-slate-900 border border-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="pm"
                    checked={payMethod === 'card'}
                    onChange={() => setPayMethod('card')}
                    className="text-primary focus:ring-0"
                  />
                  <CreditCard className="w-4 h-4 text-primary-light" />
                  <span className="text-white font-semibold">Tarjeta de Crédito Corporativa (Visa / Mastercard)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-stitch bg-slate-900 border border-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="pm"
                    checked={payMethod === 'transfer'}
                    onChange={() => setPayMethod('transfer')}
                    className="text-primary focus:ring-0"
                  />
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-semibold">Transferencia Directa Banco Pichincha / Produbanco</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isProcessing}
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
            >
              {isProcessing ? 'Procesando Fondeo Bancario...' : `Acreditar $${topUpAmount} USD a mi Cuenta`}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
