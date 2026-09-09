import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

// Detección automática de franquicia de tarjeta (Ecuador y global)
const detectCardBrand = (number) => {
  const clean = number.replace(/\D/g, '');
  if (clean.startsWith('4')) return { brand: 'VISA', color: '#1A1F71', label: 'Visa' };
  if (/^(5[1-5]|2[2-7])/.test(clean)) return { brand: 'MASTERCARD', color: '#EB001B', label: 'Mastercard' };
  if (/^3[47]/.test(clean)) return { brand: 'AMEX', color: '#006FCF', label: 'American Express' };
  if (/^3(0[0-5]|[68])/.test(clean)) return { brand: 'DINERS', color: '#004B87', label: 'Diners Club' };
  if (/^6(011|5)/.test(clean)) return { brand: 'DISCOVER', color: '#FF6000', label: 'Discover' };
  return { brand: 'GENERIC', color: '#64748B', label: 'Tarjeta' };
};

export const KushkiCheckoutModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [installments, setInstallments] = useState('1'); // 1 = corriente, 3 = 3 meses, 6 = 6 meses
  
  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [processStatus, setProcessStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);

  if (!isOpen) return null;

  const cardInfo = detectCardBrand(cardNumber);
  const parsedAmount = parseFloat(amount) || 0;

  // Formato número de tarjeta con espacios
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Formato fecha de expiración MM/AA
  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.length < 15) {
      setErrorMessage('Por favor ingresa un número de tarjeta válido.');
      return;
    }

    if (!cardHolder.trim()) {
      setErrorMessage('Ingresa el nombre del titular como figura en la tarjeta.');
      return;
    }

    if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
      setErrorMessage('Ingresa una fecha de expiración válida (MM/AA).');
      return;
    }

    if (cardCvv.length < 3) {
      setErrorMessage('Ingresa el código CVV de seguridad de 3 o 4 dígitos.');
      return;
    }

    if (!idDocument.trim()) {
      setErrorMessage('Ingresa la Cédula o RUC del tarjetahabiente (exigido por SRI Ecuador).');
      return;
    }

    // Iniciar simulación de procesamiento Kushki PCI-DSS
    setStep('processing');
    setProcessStatus('Tokenizando tarjeta de forma segura en Kushki Vault...');

    setTimeout(() => {
      setProcessStatus('Verificando fondos con el banco emisor ecuatoriano...');
    }, 900);

    setTimeout(() => {
      setProcessStatus('Autorizando transacción en la red adquirente...');
    }, 1800);

    setTimeout(() => {
      const authCode = `KUSHKI-EC-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const token = `ktok_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const result = {
        provider: 'kushki',
        amount: parsedAmount,
        referenceCode: authCode,
        token,
        cardBrand: cardInfo.label,
        last4: cleanNumber.slice(-4),
        installments: installments === '1' ? 'Corriente (1 cuota)' : `${installments} meses diferido`,
        cardHolder,
        timestamp: new Date().toISOString(),
      };

      setPaymentResult(result);
      setStep('success');

      if (onSuccess) {
        onSuccess(result);
      }
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0D1526] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Kushki Header Oficial */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0E1E38] via-[#0B1528] to-[#0E1E38] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-extrabold text-sm tracking-wider shadow-glow-sm">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white tracking-tight">KUSHKI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  Pasarela Oficial Ecuador
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Checkout Corporativo Seguro PCI-DSS Nivel 1</p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= ESTADO 1: Formulario de Tarjeta Kushki ================= */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tarjeta Visual de Previsualización */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-cyan-950 border border-slate-700/60 shadow-xl overflow-hidden text-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-cyan-300 uppercase">
                    KUSHKI SMART TOKEN
                  </span>
                  <Badge variant="secondary" className="font-bold text-[10px] bg-white/10 text-white border-0">
                    {cardInfo.label}
                  </Badge>
                </div>

                <div className="font-mono text-lg tracking-widest text-slate-200">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex items-end justify-between text-xs pt-1">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Titular</span>
                    <span className="font-semibold text-slate-200 uppercase truncate max-w-[180px] block">
                      {cardHolder || 'NOMBRE Y APELLIDO'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Vence</span>
                    <span className="font-mono font-semibold text-slate-200">{cardExpiry || 'MM/AA'}</span>
                  </div>
                </div>
              </div>

              {/* Monto de la Transacción */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Monto a Fondearse:</span>
                <span className="text-lg font-black text-cyan-300 font-mono">${parsedAmount.toFixed(2)} USD</span>
              </div>

              {/* Campos de Entrada */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Número de Tarjeta <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4000 1234 5678 9010"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Nombre del Titular (como aparece en el plástico) <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="CARLOS ALBERTO MENDOZA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white uppercase text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Fecha Expiración (MM/AA) <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Código CVV <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 text-center"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Cédula o RUC (SRI) <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={idDocument}
                      onChange={(e) => setIdDocument(e.target.value)}
                      placeholder="1712345678"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Diferido / Cuotas
                    </label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="1">Corriente (1 pago)</option>
                      <option value="3">3 meses sin intereses</option>
                      <option value="6">6 meses con intereses</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botón de Pago Kushki */}
              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm border-0 shadow-lg shadow-cyan-950/50"
                >
                  Pagar ${parsedAmount.toFixed(2)} USD con Kushki <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-[10px] text-slate-500 text-center mt-2.5 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Transacción encriptada punto a punto por Kushki Pagos Ecuador.
                </p>
              </div>
            </form>
          )}

          {/* ================= ESTADO 2: Procesando con Kushki ================= */}
          {step === 'processing' && (
            <div className="py-12 px-4 text-center space-y-5 animate-fade-in">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-extrabold text-cyan-300 text-lg">
                  K
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">Procesando pago con Kushki</h3>
                <p className="text-xs text-cyan-300 font-medium animate-pulse">{processStatus}</p>
                <p className="text-[11px] text-slate-500">Por favor no cierres esta ventana ni recargues el navegador.</p>
              </div>
            </div>
          )}

          {/* ================= ESTADO 3: Pago Exitoso ================= */}
          {step === 'success' && paymentResult && (
            <div className="py-6 px-2 text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-glow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">¡Pago Aprobado por Kushki!</h3>
                <p className="text-xs text-slate-400">
                  Se acreditaron <strong className="text-emerald-400">${paymentResult.amount.toFixed(2)} USD</strong> a tu saldo corporativo.
                </p>
              </div>

              {/* Recibo Oficial Kushki */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-left space-y-2 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Nº AUTORIZACIÓN:</span>
                  <span className="text-cyan-300 font-bold">{paymentResult.referenceCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">FRANQUICIA:</span>
                  <span className="text-white font-bold">{paymentResult.cardBrand} (•••• {paymentResult.last4})</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">MODALIDAD:</span>
                  <span className="text-white">{paymentResult.installments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PASARELA:</span>
                  <span className="text-cyan-400">Kushki Pagos S.A. Ecuador</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={onClose}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
              >
                Aceptar y Volver al Panel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
