import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  X,
  Clock,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export const DeUnaCheckoutModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [tab, setTab] = useState('qr'); // 'qr' | 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutos
  const [step, setStep] = useState('ready'); // 'ready' | 'verifying' | 'success'
  const [pushSent, setPushSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const parsedAmount = parseFloat(amount) || 0;
  const qrReference = `DU-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Temporizador de 5 minutos
  useEffect(() => {
    if (!isOpen || step === 'success') return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleCopyReference = () => {
    navigator.clipboard?.writeText(qrReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendPush = (e) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10 || !clean.startsWith('09')) {
      setErrorMessage('Ingresa un número celular válido de Ecuador (ej. 0991234567).');
      return;
    }
    setErrorMessage('');
    setPushSent(true);
  };

  const handleConfirmPayment = () => {
    setErrorMessage('');
    setStep('verifying');

    setTimeout(() => {
      const refCode = `DEUNA-EC-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const result = {
        provider: 'deuna',
        amount: parsedAmount,
        referenceCode: refCode,
        mobilePhone: phoneNumber || '0995001234',
        timestamp: new Date().toISOString(),
      };

      setPaymentResult(result);
      setStep('success');

      if (onSuccess) {
        onSuccess(result);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0C161D] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* DeUna! Header Oficial */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#07241D] via-[#0B3329] to-[#07241D] border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-emerald-400 p-0.5 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
              <span className="bg-slate-950 text-yellow-400 px-1.5 py-0.5 rounded-lg font-black tracking-tight text-xs">
                ¡DeUna!
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white tracking-tight">DeUna!</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  Banco Pichincha
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">Billetera Digital Oficial del Ecuador</p>
            </div>
          </div>
          {step !== 'verifying' && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= ESTADO LISTO / SELECCIÓN ================= */}
          {step === 'ready' && (
            <div className="space-y-5">
              {/* Tarjeta de Monto */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Total a Recargar
                  </span>
                  <span className="text-2xl font-black text-white font-mono">${parsedAmount.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-bold font-mono">
                  <Clock className="w-3.5 h-3.5 animate-pulse" /> {formattedTime}
                </div>
              </div>

              {/* Selector de Pestaña (QR vs Celular) */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setTab('qr')}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    tab === 'qr'
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" /> Escanear QR
                </button>
                <button
                  type="button"
                  onClick={() => setTab('phone')}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    tab === 'phone'
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> Cobro a Celular
                </button>
              </div>

              {/* OPCIÓN 1: Código QR Dinámico */}
              {tab === 'qr' && (
                <div className="space-y-4 text-center">
                  <div className="p-4 rounded-2xl bg-white text-slate-950 w-52 h-52 mx-auto flex flex-col items-center justify-center shadow-xl relative border-4 border-yellow-400">
                    {/* SVG QR Simulado con Logo DeUna */}
                    <div className="w-full h-full relative flex items-center justify-center">
                      <QrCode className="w-40 h-40 text-slate-900" />
                      <div className="absolute w-10 h-10 rounded-xl bg-yellow-400 border-2 border-slate-900 flex items-center justify-center shadow-md">
                        <span className="font-black text-slate-900 text-[10px]">!D</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="font-bold text-white">Escanea con tu App DeUna!</p>
                    <p className="text-[11px] text-slate-400">
                      1. Abre DeUna! ➔ 2. Presiona "Escanear" ➔ 3. Confirma el pago de ${parsedAmount.toFixed(2)}.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 bg-slate-900/90 py-1.5 px-3 rounded-lg border border-slate-800">
                    <span>Ref: <strong className="font-mono text-emerald-400">{qrReference}</strong></span>
                    <button
                      type="button"
                      onClick={handleCopyReference}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copiar código"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleConfirmPayment}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs border-0 shadow-lg shadow-emerald-950/40"
                  >
                    ¡Ya Pagé desde mi App DeUna! <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              )}

              {/* OPCIÓN 2: Cobro Directo a Celular */}
              {tab === 'phone' && (
                <div className="space-y-4">
                  {!pushSent ? (
                    <form onSubmit={handleSendPush} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Número Celular DeUna! (Ecuador) <span className="text-emerald-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            maxLength={10}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="0991234567"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-400 font-bold"
                          />
                          <Smartphone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Te enviaremos una notificación push a tu app DeUna! para que apruebes el débito.
                        </span>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs"
                      >
                        Enviar Notificación de Cobro
                      </Button>
                    </form>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3 text-center animate-fade-in">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-white">¡Solicitud de cobro enviada a tu celular!</p>
                        <p className="text-[11px] text-slate-400">
                          Revisa la notificación en el número <strong className="text-emerald-400 font-mono">{phoneNumber}</strong> y presiona "Aceptar".
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={handleConfirmPayment}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs"
                      >
                        Ya autoricé en mi App DeUna!
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= ESTADO VERIFICANDO ================= */}
          {step === 'verifying' && (
            <div className="py-12 px-4 text-center space-y-5 animate-fade-in">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-extrabold text-yellow-400 text-lg">
                  !D
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">Verificando transacción DeUna!</h3>
                <p className="text-xs text-emerald-400 font-medium animate-pulse">
                  Consultando confirmación bancaria en tiempo real...
                </p>
                <p className="text-[11px] text-slate-500">Acreditación automática en tu cuenta empresarial.</p>
              </div>
            </div>
          )}

          {/* ================= ESTADO ÉXITO ================= */}
          {step === 'success' && paymentResult && (
            <div className="py-6 px-2 text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-glow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">¡Acreditado con Éxito por DeUna!</h3>
                <p className="text-xs text-slate-400">
                  Se fondearon <strong className="text-emerald-400">${paymentResult.amount.toFixed(2)} USD</strong> en tu cuenta corporativa.
                </p>
              </div>

              {/* Recibo Oficial DeUna! */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-left space-y-2 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">REF. DEUNA:</span>
                  <span className="text-emerald-400 font-bold">{paymentResult.referenceCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">CANAL:</span>
                  <span className="text-white font-bold">Billetera Móvil DeUna! (Banco Pichincha)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">COMISIÓN:</span>
                  <span className="text-emerald-400 font-bold">$0.00 USD (0%)</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={onClose}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
              >
                Aceptar y Finalizar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
