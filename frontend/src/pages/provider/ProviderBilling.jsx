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
  QrCode,
  Sparkles,
  ExternalLink,
  Receipt,
} from 'lucide-react';
import { KushkiCheckoutModal } from '../../components/payments/KushkiCheckoutModal';
import { DeUnaCheckoutModal } from '../../components/payments/DeUnaCheckoutModal';

export const ProviderBilling = () => {
  const { currentUser, updateProfile } = useAuth();
  const { surveys, transactions, addCorporateTopUp } = useDatabase();

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('250.00');
  const [payMethod, setPayMethod] = useState('kushki'); // 'kushki' | 'deuna' | 'transfer'
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Modales de Pasarelas
  const [showKushkiModal, setShowKushkiModal] = useState(false);
  const [showDeUnaModal, setShowDeUnaModal] = useState(false);

  const mySurveys = surveys.filter((s) => s.providerId === currentUser.id);
  const totalBudget = mySurveys.reduce((s, sv) => s + (sv.budget || 0), 0);
  const totalSpent = mySurveys.reduce((s, sv) => s + (sv.spent || 0), 0);
  const activeEscrow = mySurveys
    .filter((s) => s.status === 'active')
    .reduce((s, sv) => s + (sv.escrowBalance || (sv.budget - sv.spent) || 0), 0);

  // Transacciones corporativas (topups o gastos)
  const myTxns = transactions.filter((t) => t.userId === currentUser.id);

  const handleStartPayment = (e) => {
    e.preventDefault();
    const addVal = parseFloat(topUpAmount);
    if (!addVal || addVal <= 0) return;

    setShowTopUpModal(false);

    if (payMethod === 'kushki') {
      setShowKushkiModal(true);
    } else if (payMethod === 'deuna') {
      setShowDeUnaModal(true);
    } else {
      // Transferencia bancaria directa
      setIsProcessing(true);
      setTimeout(async () => {
        const ref = `TRANSF-EC-${Date.now().toString(36).toUpperCase()}`;
        const newBal = (currentUser.balance || 0) + addVal;
        await updateProfile({ balance: newBal });
        if (addCorporateTopUp) {
          await addCorporateTopUp(currentUser.id, addVal, 'bank_transfer', ref, 'Transferencia Interbancaria Directa');
        }
        setIsProcessing(false);
        setSuccessMsg(`¡Fondos acreditados! Se agregaron $${addVal.toFixed(2)} USD vía transferencia interbancaria.`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }, 1200);
    }
  };

  const handlePaymentSuccess = async (result) => {
    const addVal = parseFloat(result.amount) || parseFloat(topUpAmount);
    const newBal = (currentUser.balance || 0) + addVal;
    await updateProfile({ balance: newBal });

    if (addCorporateTopUp) {
      await addCorporateTopUp(
        currentUser.id,
        addVal,
        result.provider,
        result.referenceCode,
        result.provider === 'kushki'
          ? `Recarga Kushki Pagos (${result.cardBrand || 'Tarjeta'})`
          : `Recarga Billetera Móvil DeUna! (${result.mobilePhone || 'QR'})`
      );
    }

    setSuccessMsg(
      `¡Recarga exitosa! Se acreditaron $${addVal.toFixed(2)} USD procesados por ${
        result.provider === 'kushki' ? 'Kushki Gateway' : 'DeUna! Banco Pichincha'
      }. Ref: ${result.referenceCode}`
    );
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Facturación y Presupuestos Empresariales 💳</h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de fondos en custodia (Escrow), pagos con Kushki, DeUna! y transferencias interbancarias del Ecuador.
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

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
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

      {/* Explanatory Banner & Pasarelas Integradas */}
      <div className="p-4 rounded-stitch-lg bg-slate-900/60 border border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white">Fondos Protegidos (Escrow):</span> Las empresas fondean sus
            estudios por adelantado. Los valores se debitan únicamente cuando ciudadanos reales completan satisfactoriamente
            las preguntas.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Pasarelas:</span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
            KUSHKI
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-bold font-mono">
            ¡DeUna!
          </span>
        </div>
      </div>

      {/* Desglose de Campañas y Presupuestos */}
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
              {mySurveys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">
                    No registras campañas activas creadas todavía.
                  </td>
                </tr>
              ) : (
                mySurveys.map((s) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de Recargas & Transacciones con Pasarelas */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary-light" /> Historial de Recargas y Pagos Realizados
        </h2>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="p-4">Fecha</th>
                <th className="p-4">Concepto / Descripción</th>
                <th className="p-4">Pasarela / Canal</th>
                <th className="p-4">Ref. Comprobante</th>
                <th className="p-4">Monto ($ USD)</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-mono">
              {myTxns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500 font-sans">
                    Aún no registras pagos o recargas en el sistema.
                  </td>
                </tr>
              ) : (
                myTxns.map((t) => {
                  const isKushki = t.paymentProvider === 'kushki' || (t.description && t.description.toLowerCase().includes('kushki'));
                  const isDeUna = t.paymentProvider === 'deuna' || (t.description && t.description.toLowerCase().includes('deuna'));

                  return (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-slate-400 font-sans">
                        {new Date(t.createdAt).toLocaleDateString('es-EC')}
                      </td>
                      <td className="p-4 font-bold text-white font-sans">{t.description}</td>
                      <td className="p-4">
                        {isKushki ? (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/30">
                            KUSHKI GATEWAY
                          </span>
                        ) : isDeUna ? (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold text-[10px] border border-yellow-400/30">
                            DEUNA! QR
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                            TRANSFERENCIA SPI
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-300 text-[11px]">{t.referenceCode || t.id}</td>
                      <td className="p-4 font-bold text-emerald-400 font-sans">
                        +${Math.abs(t.amount || 0).toFixed(2)} USD
                      </td>
                      <td className="p-4 font-sans">
                        <Badge variant="success" dot>
                          Aprobado
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Selector de Recarga Corporativa */}
      <Modal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        title="💳 Recargar Saldo Corporativo para Campañas"
      >
        <form onSubmit={handleStartPayment} className="space-y-4 text-xs">
          <p className="text-slate-300">
            Selecciona el monto y la pasarela autorizada de Ecuador con la que deseas fondear tu cuenta empresarial:
          </p>

          {/* Seleccionar Monto */}
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

          {/* Seleccionar Pasarela de Pago */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Plataforma de Pago Autorizada en Ecuador:
            </label>
            <div className="space-y-2.5">
              {/* Opción 1: KUSHKI */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  payMethod === 'kushki'
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={payMethod === 'kushki'}
                  onChange={() => setPayMethod('kushki')}
                  className="mt-1 text-cyan-400 focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                      Kushki Gateway
                      <Badge variant="secondary" className="text-[10px] bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                        Tarjetas & Diferidos
                      </Badge>
                    </span>
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tarjetas de Crédito / Débito (Visa, Mastercard, Diners, Amex). Difiere hasta 6 meses sin intereses.
                  </p>
                </div>
              </label>

              {/* Opción 2: DEUNA! */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  payMethod === 'deuna'
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={payMethod === 'deuna'}
                  onChange={() => setPayMethod('deuna')}
                  className="mt-1 text-emerald-400 focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                      Billetera Móvil DeUna!
                      <Badge variant="secondary" className="text-[10px] bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                        Banco Pichincha
                      </Badge>
                    </span>
                    <QrCode className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Escanea el código QR desde tu app DeUna! o solicita cobro directo a tu número celular. 0% comisión.
                  </p>
                </div>
              </label>

              {/* Opción 3: Transferencia Directa */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  payMethod === 'transfer'
                    ? 'bg-slate-800/70 border-slate-600 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={payMethod === 'transfer'}
                  onChange={() => setPayMethod('transfer')}
                  className="mt-1 text-primary focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Transferencia Directa SPI</span>
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Transferencia interbancaria Banco Pichincha, Produbanco, Guayaquil o Pacífico.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isProcessing}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs"
          >
            Continuar con el Pago de ${topUpAmount} USD
          </Button>
        </form>
      </Modal>

      {/* Modal de Checkout Kushki */}
      <KushkiCheckoutModal
        isOpen={showKushkiModal}
        onClose={() => setShowKushkiModal(false)}
        amount={topUpAmount}
        onSuccess={handlePaymentSuccess}
      />

      {/* Modal de Checkout DeUna! */}
      <DeUnaCheckoutModal
        isOpen={showDeUnaModal}
        onClose={() => setShowDeUnaModal(false)}
        amount={topUpAmount}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
