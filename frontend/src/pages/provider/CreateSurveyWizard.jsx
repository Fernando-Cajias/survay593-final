import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { useOrganization } from '../../context/OrganizationContext';
import { EDUCATION_TEMPLATES, BUSINESS_TEMPLATES } from '../../services/educationTemplates';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  Wallet,
  Lock,
  DollarSign,
  AlertCircle,
  FileText,
  Printer,
  QrCode,
  ExternalLink,
  Check,
  Copy,
  Clock,
  Sparkles,
  School,
  X,
  Smartphone,
} from 'lucide-react';

// Detección automática de franquicia de tarjeta (Ecuador y global)
const detectCardBrand = (number) => {
  const clean = (number || '').replace(/\D/g, '');
  if (clean.startsWith('4')) return { brand: 'VISA', label: 'Visa' };
  if (/^(5[1-5]|2[2-7])/.test(clean)) return { brand: 'MASTERCARD', label: 'Mastercard' };
  if (/^3[47]/.test(clean)) return { brand: 'AMEX', label: 'American Express' };
  if (/^3(0[0-5]|[68])/.test(clean)) return { brand: 'DINERS', label: 'Diners Club' };
  return { brand: 'GENERIC', label: 'Tarjeta' };
};

export const CreateSurveyWizard = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const { addSurvey } = useDatabase();
  const { currentOrg, currentPeriod } = useOrganization();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tecnología');
  const [estimatedTime, setEstimatedTime] = useState(3);
  const [rewardPerResponse, setRewardPerResponse] = useState(2.5);
  const [targetResponses, setTargetResponses] = useState(50);

  // Financial Escrow Calculations
  const escrowFund = (parseFloat(rewardPerResponse) || 0) * (parseInt(targetResponses) || 0);
  const platformFee = escrowFund * 0.35; // 35% platform fee
  const totalInvestment = escrowFund + platformFee;

  // Payment Gateway States ('balance' | 'kushki' | 'deuna' | 'transfer')
  const [paymentMethod, setPaymentMethod] = useState(
    (currentUser?.balance || 0) >= totalInvestment ? 'balance' : 'kushki'
  );
  const [isFinancing, setIsFinancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState(null);

  // Kushki Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser.company || currentUser.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardIdDoc, setCardIdDoc] = useState(currentUser.ruc || currentUser.cedula || '1790012345001');
  const [installments, setInstallments] = useState('1');

  // DeUna form state
  const [deunaTab, setDeUnaTab] = useState('qr'); // 'qr' | 'phone'
  const [deunaPhone, setDeUnaPhone] = useState('0991234567');
  const [deunaPushSent, setDeUnaPushSent] = useState(false);
  const [deunaQrReference] = useState(`DU-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);

  // Bank transfer form state
  const [transferBank, setTransferBank] = useState('Produbanco');
  const [transferRef, setTransferRef] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const [questions, setQuestions] = useState([
    {
      type: 'multiple',
      text: '¿En qué sector de la ciudad te resultaría más cómodo visitar una nueva sucursal?',
      required: true,
      options: ['Norte (La Carolina / C.C. El Jardín)', 'Centro Histórico / C.C. El Recreo', 'Valles (Cumbayá / Tumbaco)', 'Sur de la ciudad'],
    },
    {
      type: 'likert',
      text: '¿Qué tan probable es que adquieras servicios tecnológicos en esta nueva sucursal?',
      required: true,
      scale: 5,
      labels: ['1 (Poco probable)', '2', '3', '4', '5 (Muy probable)'],
    },
  ]);

  // Question builder state
  const [newQType, setNewQType] = useState('multiple');
  const [newQText, setNewQText] = useState('');
  const [newQOptions, setNewQOptions] = useState('Opción 1, Opción 2, Opción 3');
  const [newQRequired, setNewQRequired] = useState(true);

  const handleAddQuestion = () => {
    if (!newQText.trim()) return;

    const q = {
      type: newQType,
      text: newQText.trim(),
      required: newQRequired,
    };

    if (newQType === 'multiple') {
      q.options = newQOptions
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    } else if (newQType === 'likert') {
      q.scale = 5;
      q.labels = ['1 (Muy bajo)', '2', '3', '4', '5 (Muy alto)'];
    }

    setQuestions([...questions, q]);
    setNewQText('');
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('2100849201');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handlePublishAndFinance = () => {
    setErrorMsg('');

    const cardInfo = detectCardBrand(cardNumber);

    // Validations based on chosen payment method
    if (paymentMethod === 'kushki') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (!cleanNum || cleanNum.length < 15) {
        setErrorMsg('Por favor ingresa los 16 dígitos de tu tarjeta en el formulario de Kushki.');
        return;
      }
      if (!cardExpiry.trim() || !cardExpiry.includes('/')) {
        setErrorMsg('Ingresa la fecha de vencimiento de tu tarjeta en formato MM/AA.');
        return;
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        setErrorMsg('Ingresa el código CVV de seguridad de 3 dígitos de tu tarjeta.');
        return;
      }
      if (!cardIdDoc.trim()) {
        setErrorMsg('Ingresa tu número de Cédula o RUC para la factura electrónica.');
        return;
      }
    } else if (paymentMethod === 'deuna') {
      if (deunaTab === 'phone') {
        const cleanPhone = deunaPhone.replace(/\D/g, '');
        if (cleanPhone.length !== 10 || !cleanPhone.startsWith('09')) {
          setErrorMsg('Por favor ingresa un número celular de Ecuador válido (ej: 0991234567).');
          return;
        }
      }
    } else if (paymentMethod === 'transfer') {
      if (!transferRef.trim()) {
        setErrorMsg('Por favor ingresa el número de referencia o comprobante de tu transferencia bancaria.');
        return;
      }
    } else if (paymentMethod === 'balance') {
      if ((currentUser.balance || 0) < totalInvestment) {
        setErrorMsg(
          `Tu saldo actual es de $${(currentUser.balance || 0).toFixed(2)} USD, pero se requieren $${totalInvestment.toFixed(2)} USD. Puedes pagar la diferencia con Kushki o DeUna!.`
        );
        return;
      }
    }

    setIsFinancing(true);

    // Realistic banking processing timeout
    setTimeout(() => {
      // Deduct balance if using prepay balance
      if (paymentMethod === 'balance') {
        const remaining = (currentUser.balance || 0) - totalInvestment;
        updateProfile({ balance: remaining });
      }

      // Prepare campaign
      const surveyData = {
        providerId: currentUser.id,
        tenantId: currentOrg?.id || null,
        periodId: currentPeriod?.id || null,
        title,
        description,
        category,
        estimatedTime: parseInt(estimatedTime),
        rewardPerResponse: parseFloat(rewardPerResponse),
        targetResponses: parseInt(targetResponses),
        budget: totalInvestment,
        escrowBalance: escrowFund,
        platformFee: platformFee,
        status: 'active',
      };

      const createdSurvey = addSurvey(surveyData, questions);

      // Description of payment method for invoice
      let paymentLabel = 'Débito de Saldo Corporativo en Plataforma';
      if (paymentMethod === 'kushki') {
        paymentLabel = `Kushki Gateway - ${cardInfo.label} •••• ${cardNumber.replace(/\s/g, '').slice(-4)} (${
          installments === '1' ? 'Corriente' : `${installments} meses diferido`
        })`;
      } else if (paymentMethod === 'deuna') {
        paymentLabel = `Billetera Móvil DeUna! Banco Pichincha (Ref: ${deunaQrReference})`;
      } else if (paymentMethod === 'transfer') {
        paymentLabel = `Transferencia Bancaria Directa ${transferBank} (Ref: ${transferRef})`;
      }

      // Generate B2B Corporate Invoice & Receipt
      const receipt = {
        invoiceNumber: `FAC-001-002-00${Math.floor(100000 + Math.random() * 900000)}`,
        authCodeSRI: `179320482900120260830${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        companyName: currentOrg?.name || currentUser.company || 'Orión Technologies',
        companyRepresentative: currentUser.name,
        companyEmail: currentUser.email,
        ruc: currentOrg?.ruc || (currentUser.company ? '1793204829001' : '1724589301001'),
        address: currentOrg?.address || `${currentOrg?.city || 'Quito'}, Ecuador`,
        campaignTitle: title,
        targetResponses,
        rewardPerResponse,
        escrowFund,
        platformFee,
        totalInvestment,
        paymentMethod: paymentLabel,
        date: new Date().toISOString(),
        surveyId: createdSurvey.id,
      };

      setIsFinancing(false);
      setPaymentSuccessReceipt(receipt);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className={`space-y-6 ${paymentSuccessReceipt ? 'print:hidden' : ''}`}>
        <button
          onClick={() => navigate('/provider')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </button>

      <div>
        <h1 className="text-2xl font-black text-white">Crear y Financiar Campaña de Estudio ✏️</h1>
        <p className="text-xs text-slate-400 mt-1">
          {currentUser.company ? `${currentUser.company} · ` : ''}Fondea el presupuesto en custodia (Escrow) y activa tu estudio en 24 horas.
        </p>
      </div>

      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between p-4 glass-card">
        {[
          { num: 1, label: 'Información' },
          { num: 2, label: 'Presupuesto & Escrow' },
          { num: 3, label: 'Preguntas' },
          { num: 4, label: 'Pasarela de Pago' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                step === s.num
                  ? 'bg-primary text-white shadow-glow-sm scale-110'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? 'text-white' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Info */}
      {step === 1 && (
        <div className="glass-card p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">1. Información de la Campaña</h3>
            {currentOrg && (
              <span className="text-xs text-primary-light font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {currentOrg.name}
              </span>
            )}
          </div>

          {/* Quick Template Selector Banner */}
          <div className="p-4 rounded-stitch bg-gradient-to-r from-primary/15 via-slate-900 to-secondary/15 border border-primary/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sparkles className="w-4 h-4 text-primary-light" />
                <span>¿Deseas lanzar tu encuesta en 1 clic? Selecciona una Plantilla:</span>
              </div>
              <Badge variant="primary" className="text-[10px]">
                {currentOrg?.category === 'education' ? 'Colegios & Escuelas' : 'Empresas & Negocios'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {(currentOrg?.category === 'education' ? EDUCATION_TEMPLATES : BUSINESS_TEMPLATES).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    const periodSuffix = currentPeriod ? ` (${currentPeriod.name})` : '';
                    const orgPrefix = currentOrg?.name ? `${currentOrg.name} - ` : '';
                    setTitle(`${tpl.name} - ${orgPrefix}${periodSuffix}`.trim());
                    setDescription(tpl.description);
                    setCategory(tpl.category);
                    setEstimatedTime(tpl.estimatedTime);
                    setRewardPerResponse(tpl.rewardPerResponse);
                    setQuestions(tpl.questions);
                  }}
                  className="p-2.5 rounded-stitch bg-slate-900/80 hover:bg-primary/20 border border-slate-700 hover:border-primary/60 text-left transition-all group"
                >
                  <div className="text-xl mb-1">{tpl.icon}</div>
                  <div className="text-xs font-bold text-white group-hover:text-primary-light line-clamp-1">{tpl.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tpl.questions.length} preguntas · ${tpl.rewardPerResponse.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Estudio</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Estudio de Mercado para Nueva Sucursal en Quito - Orión"
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción / Propósito</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica a los encuestados el objetivo de esta investigación..."
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sector / Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="Tecnología">Tecnología</option>
                <option value="Moda y Calzado">Moda y Calzado</option>
                <option value="Alimentación y Restaurantes">Alimentación y Restaurantes</option>
                <option value="Salud y Medicina">Salud y Medicina</option>
                <option value="Banca y Finanzas">Banca y Finanzas</option>
                <option value="Educación y Formación">Educación y Formación</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tiempo Estimado (Minutos)</label>
              <input
                type="number"
                min="1"
                max="15"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              disabled={!title.trim()}
              onClick={() => setStep(2)}
              icon={ArrowRight}
            >
              Siguiente: Presupuesto & Escrow
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Budget & Escrow Breakdown */}
      {step === 2 && (
        <div className="glass-card p-6 space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-white mb-1">2. Presupuesto y Custodia de Fondos (Escrow)</h3>
          <p className="text-xs text-slate-400">
            Define cuánto recibirá cada ciudadano por su tiempo y la cantidad de respuestas verificadas que necesitas.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recompensa por Encuestado ($ USD / persona)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.5"
                value={rewardPerResponse}
                onChange={(e) => setRewardPerResponse(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">El encuestado recibe este valor íntegro en su wallet.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Muestra Objetivo (Nº de Personas)
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={targetResponses}
                onChange={(e) => setTargetResponses(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Mínimo 10 encuestados verificados sin bots.</span>
            </div>
          </div>

          {/* Desglose Financiero */}
          <div className="p-5 rounded-stitch-lg bg-slate-950/80 border border-slate-700/80 my-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Desglose Financiero Transparente (Fondo Pre-Pago Escrow)</span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-800">
              <div className="flex justify-between pt-1">
                <span className="text-slate-300">💰 Bolsa de Recompensas en Custodia (Para Usuarios):</span>
                <span className="font-mono font-bold text-emerald-400">${escrowFund.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-300">🏢 Tarifa de Plataforma Survey 593 (35% Take-Rate):</span>
                <span className="font-mono font-semibold text-slate-300">${platformFee.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between pt-2.5 text-sm font-black border-t border-slate-700">
                <span className="text-white">Inversión Total a Financiar:</span>
                <span className="text-primary-light font-mono text-base">${totalInvestment.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-stitch border border-slate-800 flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Garantía de Custodia (Escrow):</strong> Los <strong>${escrowFund.toFixed(2)} USD</strong> se congelan en una bolsa protegida. Solo se debitan a las billeteras de los ciudadanos a medida que envían respuestas verificadas con validación anti-fraude.
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Atrás
            </Button>
            <Button variant="primary" onClick={() => setStep(3)} icon={ArrowRight}>
              Siguiente: Diseñar Preguntas
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Questions */}
      {step === 3 && (
        <div className="glass-card p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">3. Preguntas del Cuestionario ({questions.length})</h3>
            <span className="text-xs text-slate-400">Recomendado: 2 a 5 preguntas</span>
          </div>

          {/* List */}
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={i} className="p-4 rounded-stitch bg-slate-900/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-primary-light uppercase tracking-wider">
                    P{i + 1}. [{q.type}]
                  </span>
                  <div className="text-sm font-semibold text-white mt-0.5">{q.text}</div>
                </div>
                <button
                  onClick={() => handleRemoveQuestion(i)}
                  className="text-slate-400 hover:text-rose-400 p-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Question Builder */}
          <div className="p-5 rounded-stitch bg-slate-900/90 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">➕ Agregar Nueva Pregunta</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tipo de Pregunta</label>
                <select
                  value={newQType}
                  onChange={(e) => setNewQType(e.target.value)}
                  className="w-full px-3 py-2 rounded-stitch bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
                >
                  <option value="multiple">Opción Múltiple</option>
                  <option value="likert">Escala Likert (1 a 5)</option>
                  <option value="yesno">Sí / No</option>
                  <option value="text">Texto Abierto</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Texto de la Pregunta</label>
                <input
                  type="text"
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="¿Cuál es tu opinión sobre...?"
                  className="w-full px-3 py-2 rounded-stitch bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {newQType === 'multiple' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Opciones (separadas por coma)
                </label>
                <input
                  type="text"
                  value={newQOptions}
                  onChange={(e) => setNewQOptions(e.target.value)}
                  className="w-full px-3 py-2 rounded-stitch bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <Button size="sm" variant="secondary" onClick={handleAddQuestion} icon={Plus}>
              Añadir Pregunta
            </Button>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              Atrás
            </Button>
            <Button
              variant="primary"
              disabled={questions.length === 0}
              onClick={() => setStep(4)}
              icon={ArrowRight}
            >
              Siguiente: Pasarela de Pago
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: PASARELA DE PAGO Y FONDEO PROFESIONAL (Kushki, DeUna, Saldo y Transferencia) */}
      {step === 4 && (
        <div className="glass-card p-6 space-y-6 animate-fade-in">
          {/* Encabezado Descansado y Claro */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">4. Fondeo y Activación de tu Estudio</h3>
                <Badge variant="primary" className="text-[10px]">
                  Paso Final
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Elige tu forma de pago preferida para reservar los incentivos de los ciudadanos y lanzar la encuesta.
              </p>
            </div>
            <div className="sm:text-right bg-slate-900/80 p-3 rounded-xl border border-slate-800 sm:border-0 sm:p-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total a Invertir:</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">${totalInvestment.toFixed(2)} USD</div>
            </div>
          </div>

          {/* Resumen Financiero Transparente y Amigable */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/20 text-primary-light flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Muestra Contratada</div>
                <div className="text-sm font-black text-white">{targetResponses} respuestas</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Recompensa x Persona</div>
                <div className="text-sm font-black text-white">${rewardPerResponse.toFixed(2)} USD c/u</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Garantía Escrow</div>
                <div className="text-xs font-semibold text-slate-300">100% Protegido (Reembolsable)</div>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Selector de Método de Pago (Grid de 4 Opciones Nítidas) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
              Selecciona cómo deseas pagar tu estudio:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Opción 1: Saldo Disponible en Cuenta */}
              <button
                type="button"
                onClick={() => setPaymentMethod('balance')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  paymentMethod === 'balance'
                    ? 'border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-950/40'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                {(currentUser?.balance || 0) >= totalInvestment && (
                  <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                    Recomendado 1 Clic
                  </span>
                )}
                <Wallet className="w-6 h-6 text-emerald-400 mb-2" />
                <div className="text-xs font-black text-white">Saldo en Cuenta</div>
                <div className="text-[11px] text-emerald-400 font-mono font-bold mt-0.5">
                  ${(currentUser?.balance || 0).toFixed(2)} USD
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Sin trámites ni tarjetas</div>
              </button>

              {/* Opción 2: Kushki Gateway (Tarjetas & Diferidos) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('kushki')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === 'kushki'
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-950/40'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-6 h-6 text-cyan-400 mb-2" />
                <div className="text-xs font-black text-white">Kushki Gateway</div>
                <div className="text-[11px] text-cyan-300 font-bold mt-0.5">Tarjetas & Diferidos</div>
                <div className="text-[10px] text-slate-400 mt-1">Visa, Mastercard, Diners, Amex</div>
              </button>

              {/* Opción 3: Billetera Digital DeUna! */}
              <button
                type="button"
                onClick={() => setPaymentMethod('deuna')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  paymentMethod === 'deuna'
                    ? 'border-yellow-400 bg-yellow-950/30 shadow-lg shadow-yellow-950/40'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                  0% Comisión
                </span>
                <QrCode className="w-6 h-6 text-yellow-400 mb-2" />
                <div className="text-xs font-black text-white">Billetera ¡DeUna!</div>
                <div className="text-[11px] text-yellow-300 font-bold mt-0.5">Banco Pichincha</div>
                <div className="text-[10px] text-slate-400 mt-1">Código QR o desde tu celular</div>
              </button>

              {/* Opción 4: Transferencia Directa SPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === 'transfer'
                    ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <Building2 className="w-6 h-6 text-primary-light mb-2" />
                <div className="text-xs font-black text-white">Transferencia SPI</div>
                <div className="text-[11px] text-primary-light font-bold mt-0.5">Banca en Línea</div>
                <div className="text-[10px] text-slate-400 mt-1">Pichincha / Produbanco</div>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CASO 1: SALDO EN CUENTA (PAGO RÁPIDO 1-CLIC)                              */}
          {/* ========================================================================= */}
          {paymentMethod === 'balance' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Fondeo Directo con Saldo Corporativo Disponible</span>
                </div>
                <Badge variant="success" dot>Acreditación Instantánea</Badge>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Saldo actual en tu cuenta:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    ${(currentUser?.balance || 0).toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between items-center text-primary-light">
                  <span>Costo total de la campaña (Incentivos + Fee):</span>
                  <span className="font-mono font-bold text-sm">
                    -${totalInvestment.toFixed(2)} USD
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                  <span className="font-bold text-slate-300">Saldo remanente tras publicar:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">
                    ${Math.max(0, (currentUser?.balance || 0) - totalInvestment).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                💡 <strong className="text-slate-300">Comodidad garantizada:</strong> Al hacer clic en el botón de abajo, tu estudio se activará de forma inmediata sin necesidad de ingresar números de tarjeta ni salir de la plataforma.
              </p>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASO 2: KUSHKI GATEWAY (TARJETAS & DIFERIDOS ECUADOR)                     */}
          {/* ========================================================================= */}
          {paymentMethod === 'kushki' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Kushki Gateway · Cifrado Bancario y Diferidos Nacionales</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  PCI-DSS Level 1
                </span>
              </div>

              {/* Formulario Amigable de Tarjeta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Nombre como figura en la tarjeta <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Ej: TEXTIL ANDINA S.A. o JUAN PÉREZ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white uppercase text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Número de Tarjeta (16 dígitos) <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength="19"
                      required
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                      placeholder="4000 1234 5678 9010"
                      className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono tracking-wider"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <span className="absolute right-3 top-2.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {detectCardBrand(cardNumber).label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Vencimiento (MM/AA) <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength="5"
                      required
                      value={cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length >= 2) val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                        setCardExpiry(val);
                      }}
                      placeholder="08/28"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Código CVV <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="password"
                      maxLength="4"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Cédula / RUC (SRI) <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cardIdDoc}
                      onChange={(e) => setCardIdDoc(e.target.value)}
                      placeholder="1790012345001"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Plan de Pago / Cuotas
                    </label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-semibold"
                    >
                      <option value="1">1 pago corriente (${totalInvestment.toFixed(2)} USD)</option>
                      <option value="3">3 meses sin intereses (${(totalInvestment / 3).toFixed(2)}/mes)</option>
                      <option value="6">6 meses diferido (${(totalInvestment / 6 * 1.04).toFixed(2)}/mes)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Total a debitar de tu tarjeta:</span>
                <span className="text-cyan-300 font-black text-sm font-mono">${totalInvestment.toFixed(2)} USD</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASO 3: BILLETERA MÓVIL ¡DEUNA! (BANCO PICHINCHA)                         */}
          {/* ========================================================================= */}
          {paymentMethod === 'deuna' && (
            <div className="p-5 rounded-2xl bg-[#0B171F] border border-yellow-400/40 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <QrCode className="w-4 h-4 text-yellow-400" />
                  <span>Billetera Móvil ¡DeUna! · Banco Pichincha (Ecuador)</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold border border-yellow-400/40">
                  Liquidación 0% Comisión
                </span>
              </div>

              {/* Selector de Modo: QR vs Celular */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setDeUnaTab('qr')}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    deunaTab === 'qr'
                      ? 'bg-gradient-to-r from-yellow-400 to-emerald-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" /> Escanear Código QR
                </button>
                <button
                  type="button"
                  onClick={() => setDeUnaTab('phone')}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    deunaTab === 'phone'
                      ? 'bg-gradient-to-r from-yellow-400 to-emerald-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> Cobro a mi Celular
                </button>
              </div>

              {deunaTab === 'qr' && (
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  {/* QR Code Container */}
                  <div className="p-3 bg-white rounded-2xl w-40 h-40 flex items-center justify-center shrink-0 border-4 border-yellow-400 shadow-xl relative">
                    <QrCode className="w-32 h-32 text-slate-950" />
                    <div className="absolute w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center font-black text-slate-950 text-[9px] border border-slate-900">
                      !D
                    </div>
                  </div>

                  {/* Instrucciones 1-2-3 Fáciles de Entender */}
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>¿Cómo pagar en 3 pasos sencillos?</span>
                    </div>
                    <ol className="space-y-1.5 text-slate-300 text-[11px]">
                      <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                        <span>Abre tu aplicación <strong>DeUna!</strong> en tu celular.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                        <span>Toca en <strong>"Escanear QR"</strong> y enfoca este código en pantalla.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                        <span>Confirma el valor exacto de <strong className="text-emerald-400 font-mono">${totalInvestment.toFixed(2)} USD</strong>.</span>
                      </li>
                    </ol>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Ref: <span className="font-mono text-yellow-300">{deunaQrReference}</span>
                    </div>
                  </div>
                </div>
              )}

              {deunaTab === 'phone' && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Número Celular Registrado en DeUna! (Ecuador)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="tel"
                          maxLength={10}
                          value={deunaPhone}
                          onChange={(e) => setDeUnaPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="0991234567"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-yellow-400"
                        />
                        <Smartphone className="w-4 h-4 text-yellow-400 absolute left-3 top-3" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeUnaPushSent(true)}
                        className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs transition-colors shrink-0"
                      >
                        {deunaPushSent ? '¡Notificación Enviada!' : 'Enviar Notificación'}
                      </button>
                    </div>
                  </div>

                  {deunaPushSent && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Revisa tu app DeUna en el celular <strong>{deunaPhone}</strong> y pulsa "Aprobar Pago". Luego presiona el botón verde de abajo.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASO 4: TRANSFERENCIA BANCARIA EMPRESARIAL (RED SPI)                       */}
          {/* ========================================================================= */}
          {paymentMethod === 'transfer' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-primary/40 space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-primary-light border-b border-slate-800 pb-2.5">
                <Building2 className="w-4 h-4" />
                <span>Datos Bancarios Oficiales para Transferencia Directa (Red SPI Ecuador)</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Institución Financiera:</span>
                  <span className="font-bold text-white">BANCO PICHINCHA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Tipo de Cuenta:</span>
                  <span className="font-semibold text-white">Cuenta Corriente Empresarial</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-slate-300 font-medium">Número de Cuenta:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400 text-sm">2100849201</span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                      title="Copiar número de cuenta"
                    >
                      {copiedAccount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Beneficiario / Razón Social:</span>
                  <span className="font-bold text-white">SURVEY 593 S.A.S. / KOLAB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">R.U.C.:</span>
                  <span className="font-mono text-slate-200">1793204829001</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-bold">Monto Exacto a Transferir:</span>
                  <span className="font-mono font-black text-emerald-400 text-base">${totalInvestment.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Registro de la Referencia */}
              <div className="space-y-3 pt-1 text-xs">
                <label className="block text-xs font-bold text-slate-300">
                  Registra el comprobante de tu transferencia:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Banco Origen</label>
                    <select
                      value={transferBank}
                      onChange={(e) => setTransferBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="Produbanco">Produbanco</option>
                      <option value="Banco Pichincha">Banco Pichincha</option>
                      <option value="Banco Guayaquil">Banco Guayaquil</option>
                      <option value="Banco del Pacífico">Banco del Pacífico</option>
                      <option value="Cooperativa JEP">Cooperativa JEP</option>
                      <option value="Otro Banco Nacional">Otro Banco Nacional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Número de Referencia / Comprobante</label>
                    <input
                      type="text"
                      required
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      placeholder="Ej: REF-4920194"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones de Navegación y Acción Final Destacada */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setStep(3)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Volver a Preguntas
            </Button>
            <Button
              size="lg"
              variant="primary"
              disabled={isFinancing}
              onClick={handlePublishAndFinance}
              className={`font-black text-xs sm:text-sm border-0 shadow-xl ${
                paymentMethod === 'kushki'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:opacity-95'
                  : paymentMethod === 'deuna'
                  ? 'bg-gradient-to-r from-yellow-400 to-emerald-400 text-slate-950 hover:opacity-95'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-95'
              }`}
            >
              {isFinancing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Activando Campaña y Procesando Fondos...
                </span>
              ) : paymentMethod === 'balance' ? (
                `Activar con mi Saldo Disponible ($${totalInvestment.toFixed(2)} USD) 🚀`
              ) : paymentMethod === 'kushki' ? (
                `Pagar $${totalInvestment.toFixed(2)} USD con Kushki y Activar 🚀`
              ) : paymentMethod === 'deuna' ? (
                `Confirmar Pago DeUna! y Activar Campaña 🚀`
              ) : (
                `Registrar Transferencia y Activar Campaña 🚀`
              )}
            </Button>
          </div>
        </div>
      )}

      {/* End of wizard form wrapper */}
      </div>

      {/* ========================================================================= */}
      {/* MODAL DE FACTURA ELECTRÓNICA OFICIAL B2B (RIDE SRI ECUADOR)               */}
      {/* ========================================================================= */}
      {paymentSuccessReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-fade-in overflow-y-auto printable-modal-overlay">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden animate-scale-in border border-slate-300 my-auto printable-invoice">
            {/* Barra superior de acciones (Sólo visible en pantalla) */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Comprobante Electrónico Autorizado (RIDE SRI)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-stitch bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentSuccessReceipt(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Cerrar vista"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Documento Oficial de Factura (Optimizado para Pantalla e Impresión A4) */}
            <div className="p-5 sm:p-7 space-y-4 bg-white text-slate-900 text-xs">
              {/* Encabezado RIDE: Emisor (Izquierda) + Recuadro SRI (Derecha) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start border-b border-slate-200 pb-4">
                {/* Datos del Emisor */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-teal-700 text-white font-black text-lg flex items-center justify-center shadow-sm">
                      S5
                    </div>
                    <div>
                      <h2 className="text-base font-black tracking-tight text-slate-900 leading-none">
                        KOLAB TECH S.A.S.
                      </h2>
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                        Plataforma Survey 593 Ecuador
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 space-y-0.5 pt-1.5 leading-relaxed">
                    <p><strong className="text-slate-800">Dirección Matriz:</strong> Av. República del Salvador N34-127 y Naciones Unidas, Edificio Kolab Tower, Piso 8, Quito - Ecuador</p>
                    <p><strong className="text-slate-800">Teléfono:</strong> (02) 298-4500 · <strong className="text-slate-800">Email:</strong> facturacion@kolab.ec</p>
                    <p><strong className="text-slate-800">Obligado a Llevar Contabilidad:</strong> SÍ</p>
                    <p><strong className="text-slate-800">Régimen Tributario:</strong> Régimen General de Sociedades</p>
                  </div>
                </div>

                {/* Recuadro Oficial SRI */}
                <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 text-xs space-y-1">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                    <span className="font-mono text-[11px] font-bold text-slate-700">R.U.C.:</span>
                    <span className="font-mono font-black text-xs text-slate-950">1793204829001</span>
                  </div>
                  <div className="text-center py-0.5">
                    <span className="text-sm font-black tracking-wider text-slate-900 block">FACTURA ELECTRÓNICA</span>
                    <span className="font-mono font-bold text-slate-700 text-[11px]">No. {paymentSuccessReceipt.invoiceNumber}</span>
                  </div>
                  <div className="space-y-0.5 text-[9px] text-slate-600 pt-1 border-t border-slate-200">
                    <p><strong className="text-slate-800">NÚMERO DE AUTORIZACIÓN SRI:</strong></p>
                    <p className="font-mono font-bold text-slate-900 break-all text-[9px] leading-tight">{paymentSuccessReceipt.authCodeSRI}</p>
                    <div className="flex justify-between pt-0.5">
                      <span><strong className="text-slate-800">FECHA:</strong> {new Date(paymentSuccessReceipt.date).toLocaleString('es-EC')}</span>
                      <span><strong className="text-slate-800">AMBIENTE:</strong> PRODUCCIÓN</span>
                    </div>
                    <div className="flex justify-between">
                      <span><strong className="text-slate-800">EMISIÓN:</strong> NORMAL</span>
                      <span><strong className="text-slate-800">TIPO:</strong> ELECTRÓNICA</span>
                    </div>
                  </div>

                  {/* Clave de Acceso y Código de Barras Representativo */}
                  <div className="pt-1.5 border-t border-slate-200 text-center">
                    <span className="text-[8px] font-bold uppercase text-slate-500 block mb-0.5">Clave de Acceso SRI</span>
                    <div className="h-5 w-full flex items-center justify-center gap-[2px] overflow-hidden px-1 py-0.5 bg-white border border-slate-200 rounded">
                      {Array.from({ length: 42 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-full bg-slate-900 ${idx % 3 === 0 ? 'w-[2.5px]' : idx % 2 === 0 ? 'w-[1.5px]' : 'w-[1px]'}`}
                        />
                      ))}
                    </div>
                    <p className="font-mono text-[8px] text-slate-700 mt-0.5 truncate">{paymentSuccessReceipt.authCodeSRI}</p>
                  </div>
                </div>
              </div>

              {/* Información del Cliente / Adquirente */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/80 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-medium block text-[9px] uppercase">Razón Social / Cliente:</span>
                  <span className="font-black text-slate-900 text-xs">{paymentSuccessReceipt.companyName}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[9px] uppercase">RUC / C.I. del Cliente:</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{paymentSuccessReceipt.ruc}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[9px] uppercase">Dirección:</span>
                  <span className="font-medium text-slate-800">{paymentSuccessReceipt.address}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[9px] uppercase">Correo Electrónico:</span>
                  <span className="font-medium text-slate-800">{paymentSuccessReceipt.companyEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[9px] uppercase">Fecha de Emisión:</span>
                  <span className="font-medium text-slate-800">{new Date(paymentSuccessReceipt.date).toLocaleDateString('es-EC', { dateStyle: 'long' })}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[9px] uppercase">Estado de Fondos:</span>
                  <span className="text-emerald-700 font-bold">Acreditado en Custodia Escrow</span>
                </div>
              </div>

              {/* Tabla de Detalle de Ítems Fondeados y Comisiones */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[9px]">
                    <tr>
                      <th className="p-2">Cod.</th>
                      <th className="p-2 text-center">Cant.</th>
                      <th className="p-2">Descripción del Concepto</th>
                      <th className="p-2 text-right">Precio Unit.</th>
                      <th className="p-2 text-right">Desc.</th>
                      <th className="p-2 text-right">Total USD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    <tr>
                      <td className="p-2 font-mono text-slate-500">ESC-593</td>
                      <td className="p-2 text-center font-semibold text-slate-700">1.00</td>
                      <td className="p-2">
                        <div className="font-bold text-slate-900">Custodia de Fondos para Encuestados (Bolsa Escrow 65%)</div>
                        <div className="text-[10px] text-slate-500">
                          Campaña: <em>"{paymentSuccessReceipt.campaignTitle}"</em> · {paymentSuccessReceipt.targetResponses} encuestados x ${paymentSuccessReceipt.rewardPerResponse.toFixed(2)} USD
                        </div>
                      </td>
                      <td className="p-2 text-right font-mono text-slate-700">${paymentSuccessReceipt.escrowFund.toFixed(2)}</td>
                      <td className="p-2 text-right font-mono text-slate-500">$0.00</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">${paymentSuccessReceipt.escrowFund.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono text-slate-500">SRV-593</td>
                      <td className="p-2 text-center font-semibold text-slate-700">1.00</td>
                      <td className="p-2">
                        <div className="font-bold text-slate-900">Comisión Tecnológica y Auditoría de Calidad Survey 593 (35%)</div>
                        <div className="text-[10px] text-slate-500">
                          Servicios SaaS, control de calidad, verificación de respuestas y gestión de pagos SPI
                        </div>
                      </td>
                      <td className="p-2 text-right font-mono text-slate-700">${paymentSuccessReceipt.platformFee.toFixed(2)}</td>
                      <td className="p-2 text-right font-mono text-slate-500">$0.00</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">${paymentSuccessReceipt.platformFee.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pie de Factura: Información Adicional + Cuadro de Subtotales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-1">
                {/* Columna Izquierda: Información Adicional y Código QR */}
                <div className="space-y-2">
                  <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-[10px] space-y-1">
                    <span className="font-bold text-slate-800 uppercase tracking-wider block text-[9px] border-b border-slate-200 pb-0.5">
                      Información Adicional & Forma de Pago
                    </span>
                    <p><strong className="text-slate-700">Forma de Pago:</strong> {paymentSuccessReceipt.paymentMethod}</p>
                    <p><strong className="text-slate-700">Plazo de Pago:</strong> 0 días (Contado inmediato)</p>
                    <p><strong className="text-slate-700">Estado de Fondos:</strong> <span className="text-emerald-700 font-bold">Verificado y en Custodia (Escrow)</span></p>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 bg-emerald-50/80 rounded-lg border border-emerald-200 text-xs">
                    <QrCode className="w-10 h-10 text-slate-800 shrink-0" />
                    <div className="text-[9px] text-slate-600 leading-tight">
                      <p className="font-bold text-emerald-950 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Comprobante con Validez Legal SRI
                      </p>
                      <p className="mt-0.5 text-slate-500">
                        Documento generado electrónicamente de conformidad con la Resolución No. NAC-DGERCGC12-00105 del Servicio de Rentas Internas del Ecuador.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Cuadro de Subtotales y Total */}
                <div className="border border-slate-200 rounded-lg overflow-hidden font-sans text-[11px]">
                  <table className="w-full">
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-slate-50">
                        <td className="p-1.5 font-medium text-slate-600">SUBTOTAL 0% (Fondos Custodia Escrow):</td>
                        <td className="p-1.5 text-right font-mono font-semibold text-slate-800">${paymentSuccessReceipt.escrowFund.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-medium text-slate-600">SUBTOTAL GRAVADO 15% (Comisión):</td>
                        <td className="p-1.5 text-right font-mono font-semibold text-slate-800">${(paymentSuccessReceipt.platformFee / 1.15).toFixed(2)}</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-1.5 font-medium text-slate-600">IVA 15%:</td>
                        <td className="p-1.5 text-right font-mono font-semibold text-slate-800">${(paymentSuccessReceipt.platformFee - paymentSuccessReceipt.platformFee / 1.15).toFixed(2)}</td>
                      </tr>
                      <tr className="bg-teal-700 text-white font-black text-xs">
                        <td className="p-2">VALOR TOTAL PAGADO:</td>
                        <td className="p-2 text-right font-mono text-sm">${paymentSuccessReceipt.totalInvestment.toFixed(2)} USD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Barra inferior de acciones (Sólo visible en pantalla) */}
            <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row gap-2 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 px-4 rounded-stitch bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Factura Oficial / Guardar en PDF</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/provider/campaigns')}
                className="flex-1 py-2 px-4 rounded-stitch bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Ver Mi Campaña Activa 🚀</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentSuccessReceipt(null)}
                className="py-2 px-4 rounded-stitch bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs transition-colors"
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
