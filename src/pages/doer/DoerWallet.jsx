import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Wallet, ArrowDownRight, ArrowUpRight, Building2, CheckCircle2 } from 'lucide-react';

export const DoerWallet = () => {
  const { currentUser, updateProfile } = useAuth();
  const { transactions, requestWithdrawal } = useDatabase();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('Banco Pichincha');
  const [accountNumber, setAccountNumber] = useState('');
  const [msg, setMsg] = useState('');

  const myTxns = transactions.filter((t) => t.userId === currentUser.id);

  const handleWithdraw = (e) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      setMsg('Ingresa un monto válido');
      return;
    }
    if (withdrawAmount > (currentUser.balance || 0)) {
      setMsg('Saldo insuficiente para este retiro');
      return;
    }

    requestWithdrawal(currentUser.id, withdrawAmount, `${bank} - ${accountNumber}`);
    updateProfile({ balance: (currentUser.balance || 0) - withdrawAmount });

    setShowWithdrawModal(false);
    setAmount('');
    setAccountNumber('');
    setMsg('');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Wallet Card */}
      <div className="glass-card p-8 bg-gradient-to-br from-primary/15 via-slate-800 to-secondary/15 border-primary/30 text-center relative overflow-hidden">
        <div className="text-xs font-bold uppercase tracking-widest text-primary-light mb-2">
          Billetera Virtual Survey 593
        </div>
        <div className="text-5xl font-black text-white tracking-tight mb-2">
          ${(currentUser.balance || 0).toFixed(2)}
        </div>
        <p className="text-xs text-slate-400 mb-6">Fondos disponibles para transferencia inmediata</p>

        <Button
          size="lg"
          variant="primary"
          icon={Building2}
          onClick={() => setShowWithdrawModal(true)}
          disabled={(currentUser.balance || 0) <= 0}
        >
          Solicitar Retiro Bancario
        </Button>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Historial de Transacciones</h2>

        <div className="glass-card divide-y divide-slate-800">
          {myTxns.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-stitch flex items-center justify-center ${
                    t.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {t.type === 'income' ? (
                    <ArrowDownRight className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.description}</div>
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

              <div className="text-right">
                <div
                  className={`text-base font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                  {t.type === 'income' ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                </div>
                <Badge variant={t.status === 'completed' ? 'success' : 'warning'} className="text-[10px]">
                  {t.status === 'completed' ? 'Completado' : 'Pendiente'}
                </Badge>
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

      {/* Withdrawal Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="🏦 Solicitar Retiro a Cuenta Bancaria"
      >
        <form onSubmit={handleWithdraw} className="space-y-4">
          {msg && <div className="p-2.5 rounded-stitch bg-rose-500/10 text-rose-400 text-xs font-bold">{msg}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Monto a Retirar ($ USD)</label>
            <input
              type="number"
              step="0.5"
              max={currentUser.balance || 0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ej: 20.00"
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
            <div className="text-[11px] text-slate-400 mt-1">Saldo disponible: ${(currentUser.balance || 0).toFixed(2)}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Institución Bancaria</label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            >
              <option value="Banco Pichincha">Banco Pichincha</option>
              <option value="Banco Guayaquil">Banco Guayaquil</option>
              <option value="Produbanco">Produbanco</option>
              <option value="Banco del Pacífico">Banco del Pacífico</option>
              <option value="DeUna / Billetera Digital">DeUna / Billetera Digital</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Número de Cuenta / Teléfono</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Ej: 2200192837"
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-4">
            Confirmar y Transferir
          </Button>
        </form>
      </Modal>
    </div>
  );
};
