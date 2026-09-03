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
} from 'lucide-react';

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

  // Payment Gateway States
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'transfer' | 'balance'
  const [isFinancing, setIsFinancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser.company || currentUser.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

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

    // Validations based on chosen payment method
    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 15) {
        setErrorMsg('Por favor ingresa un número de tarjeta de crédito/débito válido (16 dígitos).');
        return;
      }
      if (!cardExpiry.trim() || !cardExpiry.includes('/')) {
        setErrorMsg('Ingresa la fecha de expiración en formato MM/AA.');
        return;
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        setErrorMsg('Ingresa el código de seguridad CVV (3 o 4 dígitos).');
        return;
      }
    } else if (paymentMethod === 'transfer') {
      if (!transferRef.trim()) {
        setErrorMsg('Por favor ingresa el número de referencia o comprobante de tu transferencia bancaria.');
        return;
      }
    } else if (paymentMethod === 'balance') {
      if ((currentUser.balance || 0) < totalInvestment) {
        setErrorMsg(
          `Tu saldo corporativo actual es de $${(currentUser.balance || 0).toFixed(2)} USD, pero la campaña requiere $${totalInvestment.toFixed(2)} USD. Elige pagar con Tarjeta o Transferencia Bancaria.`
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

      // Generate B2B Corporate Invoice & Receipt
      const receipt = {
        invoiceNumber: `FAC-001-002-00${Math.floor(100000 + Math.random() * 900000)}`,
        authCodeSRI: `179320482900120260830${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        companyName: currentOrg?.name || currentUser.company || 'Orión Technologies',
        companyRepresentative: currentUser.name,
        companyEmail: currentUser.email,
        campaignTitle: title,
        targetResponses,
        rewardPerResponse,
        escrowFund,
        platformFee,
        totalInvestment,
        paymentMethod:
          paymentMethod === 'card'
            ? `Tarjeta de Crédito/Débito terminada en •••• ${cardNumber.slice(-4)}`
            : paymentMethod === 'transfer'
            ? `Transferencia ${transferBank} (Ref: ${transferRef})`
            : 'Débito de Saldo Corporativo en Plataforma',
        date: new Date().toISOString(),
        surveyId: createdSurvey.id,
      };

      setIsFinancing(false);
      setPaymentSuccessReceipt(receipt);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
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

      {/* Step 4: PASARELA DE PAGO REAL (Tarjeta o Transferencia Bancaria Directa) */}
      {step === 4 && (
        <div className="glass-card p-6 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">4. Pasarela de Pago & Fondeo de Campaña</h3>
              <p className="text-xs text-slate-400">
                Paga de forma segura para activar el estudio y reservar los fondos de los encuestados.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total a Pagar:</span>
              <div className="text-xl font-black text-primary-light font-mono">${totalInvestment.toFixed(2)} USD</div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-stitch bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Selector de Método de Pago */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Elige cómo deseas pagar:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Opción 1: Tarjeta de Crédito / Débito */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-stitch border text-left transition-all ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/10 text-white shadow-glow-sm'
                    : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5 text-primary-light mb-1.5" />
                <div className="text-xs font-bold text-white">Tarjeta de Crédito/Débito</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Visa, Mastercard, Diners</div>
              </button>

              {/* Opción 2: Transferencia Bancaria Directa */}
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3.5 rounded-stitch border text-left transition-all ${
                  paymentMethod === 'transfer'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-glow-sm'
                    : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Building2 className="w-5 h-5 text-emerald-400 mb-1.5" />
                <div className="text-xs font-bold text-white">Transferencia Bancaria</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Banco Pichincha / Produbanco</div>
              </button>

              {/* Opción 3: Saldo Pre-pagado */}
              <button
                type="button"
                onClick={() => setPaymentMethod('balance')}
                className={`p-3.5 rounded-stitch border text-left transition-all ${
                  paymentMethod === 'balance'
                    ? 'border-secondary bg-secondary/10 text-white shadow-glow-sm'
                    : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Wallet className="w-5 h-5 text-secondary-light mb-1.5" />
                <div className="text-xs font-bold text-white">Saldo en Cuenta</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ${(currentUser.balance || 0).toFixed(2)} USD disponibles
                </div>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CASO 1: FORMULARIO PASARELA TARJETA DE CRÉDITO / DÉBITO                   */}
          {/* ========================================================================= */}
          {paymentMethod === 'card' && (
            <div className="p-5 rounded-stitch-lg bg-slate-900/90 border border-slate-700/80 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Pasarela de Pago Segura con Cifrado SSL 256-bit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black tracking-widest text-slate-400">VISA / MASTERCARD</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre en la Tarjeta</label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Ej: ORIÓN TECHNOLOGIES S.A."
                  className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Número de Tarjeta</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength="19"
                    required
                    value={cardNumber}
                    onChange={(e) => {
                      // Format with spaces: 4444 4444 4444 4444
                      const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                      setCardNumber(val);
                    }}
                    placeholder="4000 1234 5678 9010"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-stitch bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary font-mono tracking-wider"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha de Expiración</label>
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
                    placeholder="MM/AA (ej: 08/28)"
                    className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary font-mono text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Código de Seguridad (CVV)</label>
                  <input
                    type="password"
                    maxLength="4"
                    required
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary font-mono text-center"
                  />
                </div>
              </div>

              <div className="p-3 rounded-stitch bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Total a debitar de tu tarjeta:</span>
                <span className="text-emerald-400 font-bold text-sm">${totalInvestment.toFixed(2)} USD</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASO 2: TRANSFERENCIA BANCARIA EMPRESARIAL (DATOS OFICIALES DE KOLAB)      */}
          {/* ========================================================================= */}
          {paymentMethod === 'transfer' && (
            <div className="p-5 rounded-stitch-lg bg-slate-900/90 border border-emerald-500/40 space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 border-b border-slate-800 pb-2.5">
                <Building2 className="w-4 h-4" />
                <span>Datos Bancarios para Transferencia Empresarial (Red SPI Ecuador)</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-stitch border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Institución Financiera:</span>
                  <span className="font-bold text-white">BANCO PICHINCHA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Tipo de Cuenta:</span>
                  <span className="font-semibold text-white">Cuenta Corriente Empresarial</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded-stitch border border-slate-700">
                  <span className="text-slate-300 font-medium">Número de Cuenta:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400 text-sm">2100849201</span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copiar número de cuenta"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Beneficiario / Razón Social:</span>
                  <span className="font-bold text-white">KOLAB TECH S.A.S.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">R.U.C.:</span>
                  <span className="font-mono text-slate-200">1793204829001</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Correo para Notificación:</span>
                  <span className="font-semibold text-primary-light">facturacion@kolab.ec</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-bold">Monto Exacto a Transferir:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">${totalInvestment.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Registro de la Transferencia Realizada */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-slate-300">
                  Registra los datos de tu comprobante de transferencia:
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Banco desde el que transferiste</label>
                    <select
                      value={transferBank}
                      onChange={(e) => setTransferBank(e.target.value)}
                      className="w-full px-3 py-2 rounded-stitch bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="Produbanco">Produbanco</option>
                      <option value="Banco Pichincha">Banco Pichincha</option>
                      <option value="Banco Guayaquil">Banco Guayaquil</option>
                      <option value="Banco del Pacífico">Banco del Pacífico</option>
                      <option value="Cooperativa JEP">Cooperativa JEP</option>
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
                      className="w-full px-3 py-2 rounded-stitch bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASO 3: SALDO PRE-CARGADO EN CUENTA CORPORATIVA                          */}
          {/* ========================================================================= */}
          {paymentMethod === 'balance' && (
            <div className="p-5 rounded-stitch-lg bg-slate-900/90 border border-slate-700/80 space-y-3 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Saldo Disponible en tu Cuenta:</span>
                <span className="font-mono font-bold text-white text-sm">${(currentUser.balance || 0).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Valor de la Campaña:</span>
                <span className="font-mono font-bold text-primary-light text-sm">-${totalInvestment.toFixed(2)} USD</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between">
                <span className="text-slate-400">Saldo Restante tras publicar:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ${Math.max(0, (currentUser.balance || 0) - totalInvestment).toFixed(2)} USD
                </span>
              </div>
            </div>
          )}

          {/* Botones de Navegación y Pago */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(3)}>
              Atrás
            </Button>
            <Button
              size="lg"
              variant="primary"
              disabled={isFinancing}
              onClick={handlePublishAndFinance}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black hover:opacity-90 shadow-lg shadow-emerald-500/20 text-xs sm:text-sm"
            >
              {isFinancing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Procesando Pago con Pasarela Bancaria...
                </span>
              ) : paymentMethod === 'card' ? (
                `Pagar $${totalInvestment.toFixed(2)} USD con Tarjeta y Activar 🚀`
              ) : paymentMethod === 'transfer' ? (
                `Registrar Transferencia y Activar Campaña 🚀`
              ) : (
                `Debitar $${totalInvestment.toFixed(2)} USD y Activar Campaña 🚀`
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE COMPROBANTE OFICIAL B2B / FACTURA ELECTRÓNICA DE PAGO            */}
      {/* ========================================================================= */}
      {paymentSuccessReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-stitch-xl shadow-2xl overflow-hidden animate-scale-in border border-slate-200 my-auto">
            {/* Header Factura */}
            <div className="bg-[#0D9488] p-5 text-white text-center">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 stroke-[3] text-white" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-teal-100">
                Comprobante de Pago & Fondeo Escrow B2B
              </div>
              <h3 className="text-xl font-black">Campaña Financiada y Activa</h3>
              <p className="text-xs text-teal-100 mt-0.5">Survey 593 · Kolab Tech S.A.S.</p>
            </div>

            {/* Cuerpo de la Factura */}
            <div className="p-6 space-y-3.5 text-xs">
              <div className="text-center py-2.5 bg-slate-50 rounded-stitch border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Monto Fondeado en Custodia</div>
                <div className="text-3xl font-black text-slate-950 font-mono">
                  ${paymentSuccessReceipt.totalInvestment.toFixed(2)} USD
                </div>
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ✓ Pago Verificado · Fondos en Escrow
                </span>
              </div>

              <div className="space-y-2 text-slate-600 divide-y divide-slate-100">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-medium">Factura Nº:</span>
                  <span className="font-mono font-bold text-slate-900">{paymentSuccessReceipt.invoiceNumber}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 font-medium">Empresa Cliente:</span>
                  <span className="font-bold text-slate-900">{paymentSuccessReceipt.companyName}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 font-medium">Campaña Creada:</span>
                  <span className="font-semibold text-slate-800">{paymentSuccessReceipt.campaignTitle}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 font-medium">Método de Pago:</span>
                  <span className="font-medium text-slate-800">{paymentSuccessReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 font-medium">Bolsa Encuestados (65%):</span>
                  <span className="font-mono font-bold text-emerald-700">${paymentSuccessReceipt.escrowFund.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 font-medium">Comisión Plataforma (35%):</span>
                  <span className="font-mono text-slate-700">${paymentSuccessReceipt.platformFee.toFixed(2)} USD</span>
                </div>
              </div>

              {/* QR */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between bg-slate-50 p-2 rounded-stitch text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                  <QrCode className="w-7 h-7 text-slate-700" />
                  <div>
                    <p className="font-bold text-slate-800">Autorización SRI Electrónica</p>
                    <p className="font-mono text-[9px]">{paymentSuccessReceipt.authCodeSRI.slice(0, 22)}...</p>
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Botones */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-stitch bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Factura</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/provider/campaigns')}
                className="flex-1 py-2.5 rounded-stitch bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors text-center"
              >
                Ver Mi Campaña 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
