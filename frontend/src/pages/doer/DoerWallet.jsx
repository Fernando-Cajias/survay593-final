import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  Download,
  Check,
  ExternalLink,
} from 'lucide-react';

export const DoerWallet = () => {
  const { currentUser, updateProfile } = useAuth();
  const { transactions, requestWithdrawal } = useDatabase();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('Produbanco');
  const [accountNumber, setAccountNumber] = useState('20004884874');
  const [accountType, setAccountType] = useState('Ahorros');
  const [msg, setMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Selected transaction for the official banking voucher receipt
  const [selectedTxnVoucher, setSelectedTxnVoucher] = useState(null);

  const myTxns = transactions.filter((t) => t.userId === currentUser.id);

  const handleWithdraw = (e) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      setMsg('Ingresa un monto válido para transferir');
      return;
    }
    if (withdrawAmount > (currentUser.balance || 0)) {
      setMsg('Saldo insuficiente para este retiro');
      return;
    }

    setIsProcessing(true);

    // Simulate real banking gateway handshake (SPI / BCE)
    setTimeout(() => {
      const description = `Retiro a cuenta ${bank} - ${accountNumber}`;
      requestWithdrawal(currentUser.id, withdrawAmount, description);
      updateProfile({ balance: (currentUser.balance || 0) - withdrawAmount });

      setIsProcessing(false);
      setShowWithdrawModal(false);

      // Generate immediate official banking voucher
      const newVoucher = {
        id: `SPI-BCE-${Date.now().toString().slice(-8)}`,
        amount: withdrawAmount,
        bank,
        accountNumber,
        accountType,
        recipientName: currentUser.name || 'Titular de Cuenta',
        recipientEmail: currentUser.email,
        date: new Date().toISOString(),
        status: 'completed',
        description,
        authCode: `AUTH-EC-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setSelectedTxnVoucher(newVoucher);
      setAmount('');
      setMsg('');
    }, 1200);
  };

  // Open voucher for an existing transaction
  const handleOpenExistingVoucher = (t) => {
    const parts = t.description.split(' - ');
    const bankName = parts[0]?.replace('Retiro a cuenta ', '') || 'Banco Produbanco';
    const accNum = parts[1] || '20004884874';

    const voucher = {
      id: `SPI-BCE-${t.id ? t.id.slice(-8) : '84920194'}`,
      amount: Math.abs(t.amount),
      bank: bankName,
      accountNumber: accNum,
      accountType: 'Ahorros / Corriente',
      recipientName: currentUser.name || 'David',
      recipientEmail: currentUser.email,
      date: t.createdAt,
      status: t.status || 'completed',
      description: t.description,
      authCode: `AUTH-EC-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setSelectedTxnVoucher(voucher);
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Wallet Summary Card */}
      <div className="glass-card p-8 bg-gradient-to-br from-primary/15 via-slate-800 to-secondary/15 border-primary/30 text-center relative overflow-hidden shadow-2xl">
        <div className="text-xs font-bold uppercase tracking-widest text-primary-light mb-2">
          Billetera Virtual Survey 593 · Cuenta Oficial
        </div>
        <div className="text-5xl font-black text-white tracking-tight mb-2">
          ${(currentUser.balance || 0).toFixed(2)}
        </div>
        <p className="text-xs text-slate-400 mb-6">Fondos disponibles para transferencia bancaria inmediata (Red SPI / DeUna)</p>

        <Button
          size="lg"
          variant="primary"
          icon={Building2}
          onClick={() => {
            setAmount(currentUser.balance && currentUser.balance > 0 ? currentUser.balance.toString() : '5.00');
            setShowWithdrawModal(true);
          }}
          disabled={(currentUser.balance || 0) <= 0}
        >
          Solicitar Retiro Bancario
        </Button>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Historial de Transacciones</h2>
          <span className="text-xs text-slate-400">Haz clic en cualquier retiro para ver su comprobante</span>
        </div>

        <div className="glass-card divide-y divide-slate-800">
          {myTxns.map((t) => (
            <div
              key={t.id}
              onClick={() => handleOpenExistingVoucher(t)}
              className="p-4.5 flex items-center justify-between hover:bg-slate-800/60 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-stitch flex items-center justify-center ${
                    t.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-primary/10 text-primary-light border border-primary/20'
                  }`}
                >
                  {t.type === 'income' ? (
                    <ArrowDownRight className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-primary-light transition-colors flex items-center gap-2">
                    <span>{t.description}</span>
                    <FileText className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(t.createdAt).toLocaleDateString('es-EC', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>

              <div className="text-right flex items-center gap-4">
                <div>
                  <div
                    className={`text-base font-black ${
                      t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {t.type === 'income' ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                  </div>
                  <Badge variant={t.status === 'completed' ? 'success' : 'warning'} className="text-[10px]">
                    {t.status === 'completed' ? 'Completado' : 'Pendiente'}
                  </Badge>
                </div>
                <div className="hidden sm:block text-xs text-primary-light font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver Recibo →
                </div>
              </div>
            </div>
          ))}

          {myTxns.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No tienes transacciones registradas aún.
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Formulario de Solicitud de Retiro */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="🏦 Retiro a Cuenta Bancaria (Transferencia SPI)"
      >
        <form onSubmit={handleWithdraw} className="space-y-4">
          {msg && <div className="p-2.5 rounded-stitch bg-rose-500/10 text-rose-400 text-xs font-bold">{msg}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Monto a Transferir ($ USD)</label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max={currentUser.balance || 0}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 5.00"
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary font-bold"
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Saldo disponible en Billetera: ${(currentUser.balance || 0).toFixed(2)} USD
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Institución Bancaria</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
              >
                <option value="Produbanco">Produbanco</option>
                <option value="Banco Pichincha">Banco Pichincha</option>
                <option value="Banco Guayaquil">Banco Guayaquil</option>
                <option value="Banco del Pacífico">Banco del Pacífico</option>
                <option value="DeUna / Billetera Digital">DeUna / Billetera Digital</option>
                <option value="Cooperativa JEP">Cooperativa JEP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Cuenta</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
              >
                <option value="Ahorros">Ahorros</option>
                <option value="Corriente">Corriente</option>
                <option value="Billetera Móvil">Billetera Móvil</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Número de Cuenta / Teléfono</label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Ej: 20004884874"
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div className="p-3 rounded-stitch bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Comisión de transferencia:</span>
              <span className="text-emerald-400 font-bold">$0.00 (Gratis vía Kolab Pay)</span>
            </div>
            <div className="flex justify-between">
              <span>Tiempo de liquidación:</span>
              <span className="text-slate-300 font-semibold">Inmediato (Red SPI Banco Central)</span>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={isProcessing} className="w-full mt-4">
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Conectando con Red Interbancaria SPI...
              </span>
            ) : (
              'Confirmar Transferencia Bancaria'
            )}
          </Button>
        </form>
      </Modal>

      {/* MODAL 2: COMPROBANTE OFICIAL BANCARIO (Voucher Interbancario SPI / BCE) */}
      {selectedTxnVoucher && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-stitch-xl shadow-2xl overflow-hidden animate-scale-in border border-slate-200">
            {/* Header del Voucher Bancario */}
            <div className="bg-[#0D9488] p-5 text-white text-center relative">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                <Check className="w-7 h-7 stroke-[3] text-white" />
              </div>
              <div className="text-[11px] font-black uppercase tracking-widest text-teal-100">
                Sistema de Pagos Interbancarios (SPI)
              </div>
              <h3 className="text-xl font-black">Transferencia Exitosa</h3>
              <p className="text-xs text-teal-100 mt-0.5">Banco Central del Ecuador · Red Financiera Nacional</p>
            </div>

            {/* Cuerpo del Voucher */}
            <div className="p-6 space-y-4 text-xs">
              {/* Monto Central */}
              <div className="text-center py-3 bg-slate-50 rounded-stitch border border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Monto Liquidado</div>
                <div className="text-3xl font-black text-slate-950 font-mono">
                  ${selectedTxnVoucher.amount.toFixed(2)} USD
                </div>
                <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Acreditado en Cuenta</span>
                </div>
              </div>

              {/* Detalles de la Transacción */}
              <div className="space-y-2.5 divide-y divide-slate-100 text-slate-600">
                <div className="flex justify-between pt-1">
                  <span className="font-medium text-slate-500">Nº de Autorización SPI:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedTxnVoucher.authCode}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="font-medium text-slate-500">Referencia de Liquidación:</span>
                  <span className="font-mono font-semibold text-slate-900">{selectedTxnVoucher.id}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="font-medium text-slate-500">Fecha y Hora:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedTxnVoucher.date).toLocaleString('es-EC', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="font-medium text-slate-500">Institución Destino:</span>
                  <span className="font-bold text-slate-900">{selectedTxnVoucher.bank}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="font-medium text-slate-500">Cuenta Acreditada:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedTxnVoucher.accountNumber} ({selectedTxnVoucher.accountType})
                  </span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="font-medium text-slate-500">Beneficiario:</span>
                  <span className="font-bold text-slate-900">{selectedTxnVoucher.recipientName}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="font-medium text-slate-500">Institución Emisora:</span>
                  <span className="font-semibold text-slate-800">Kolab Tech S.A.S. (RUC 1793204829001)</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="font-medium text-slate-500">Concepto:</span>
                  <span className="font-semibold text-slate-800">Liquidación Survey 593</span>
                </div>
              </div>

              {/* Código QR de Validación Fiscal / Bancaria */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 p-2.5 rounded-stitch">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-slate-700" />
                  <div className="text-[10px] text-slate-500 leading-tight">
                    <p className="font-bold text-slate-800">Validación Electrónica</p>
                    <p>Firma digital BCE válida</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sin Retención</span>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex gap-2">
              <button
                onClick={handlePrintVoucher}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-stitch bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / PDF</span>
              </button>

              <button
                onClick={() => setSelectedTxnVoucher(null)}
                className="flex-1 py-2.5 rounded-stitch bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs transition-colors text-center"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
