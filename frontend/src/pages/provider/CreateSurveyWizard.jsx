import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
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
} from 'lucide-react';

export const CreateSurveyWizard = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const { addSurvey } = useDatabase();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Moda');
  const [estimatedTime, setEstimatedTime] = useState(3);
  const [rewardPerResponse, setRewardPerResponse] = useState(2.5);
  const [targetResponses, setTargetResponses] = useState(100);

  // Financial Escrow Calculations
  const escrowFund = (parseFloat(rewardPerResponse) || 0) * (parseInt(targetResponses) || 0);
  const platformFee = escrowFund * 0.35; // 35% take rate for platform
  const totalInvestment = escrowFund + platformFee;

  const [paymentMethod, setPaymentMethod] = useState('balance'); // 'balance' | 'card' | 'transfer'
  const [isFinancing, setIsFinancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [questions, setQuestions] = useState([
    {
      type: 'multiple',
      text: '¿Con qué frecuencia compras productos de esta categoría en tu ciudad?',
      required: true,
      options: ['Semanalmente', 'Mensualmente', 'Cada 3 a 6 meses', 'Rara vez'],
    },
    {
      type: 'likert',
      text: '¿Qué tan satisfecho estás con la variedad y precios actuales del mercado?',
      required: true,
      scale: 5,
      labels: ['1 (Muy insatisfecho)', '2', '3', '4', '5 (Muy satisfecho)'],
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

  const handlePublishAndFinance = () => {
    setErrorMsg('');

    // Check if corporate balance is sufficient when paying via balance
    if (paymentMethod === 'balance' && (currentUser.balance || 0) < totalInvestment) {
      setErrorMsg(
        `Saldo corporativo insuficiente ($${(currentUser.balance || 0).toFixed(2)} USD). Requiere $${totalInvestment.toFixed(2)} USD o selecciona pagar con tarjeta corporativa.`
      );
      return;
    }

    setIsFinancing(true);

    setTimeout(() => {
      // 1. Deduct funds from company corporate account if balance method
      if (paymentMethod === 'balance') {
        const remainingBalance = (currentUser.balance || 0) - totalInvestment;
        updateProfile({ balance: remainingBalance });
      }

      // 2. Register survey in database with active funded status & escrow
      const surveyData = {
        providerId: currentUser.id,
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

      addSurvey(surveyData, questions);

      setIsFinancing(false);
      navigate('/provider/campaigns');
    }, 1200);
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
          Configura tu cuestionario, fondea la bolsa de recompensas en custodia y obtén datos en 24 horas.
        </p>
      </div>

      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between p-4 glass-card">
        {[
          { num: 1, label: 'Información' },
          { num: 2, label: 'Presupuesto & Escrow' },
          { num: 3, label: 'Preguntas' },
          { num: 4, label: 'Financiamiento & Publicar' },
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
          <h3 className="text-base font-bold text-white mb-2">1. Información de la Campaña</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Estudio</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Estudio de Mercado de Chaquetas Impermeables en Quito"
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
                <option value="Moda y Calzado">Moda y Calzado</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Alimentación y Bebidas">Alimentación y Bebidas</option>
                <option value="Salud y Bienestar">Salud y Bienestar</option>
                <option value="Política y Percepción">Política y Percepción</option>
                <option value="Banca y Finanzas">Banca y Finanzas</option>
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
            Define la recompensa por persona y las respuestas deseadas. El sistema separa la bolsa de pagos garantizados.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recompensa al Encuestado ($ USD / persona)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.5"
                value={rewardPerResponse}
                onChange={(e) => setRewardPerResponse(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Recomendado: $2.00 a $3.50 por estudio rápido.</span>
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
              <span className="text-[10px] text-slate-400 mt-1 block">Mínimo 10 encuestados verificados.</span>
            </div>
          </div>

          {/* Desglose Financiero Transparente */}
          <div className="p-5 rounded-stitch-lg bg-slate-950/80 border border-slate-700/80 my-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Desglose Financiero del Estudio (Modelo Pre-Pago Escrow)</span>
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
                <strong>Garantía de Custodia:</strong> Los <strong>${escrowFund.toFixed(2)} USD</strong> se reservan en un fondo inmutable. Solo se liberan a las billeteras de los ciudadanos a medida que envíen respuestas verificadas sin bots.
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
            <span className="text-xs text-slate-400">Recomendado: 3 a 7 preguntas</span>
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
              Siguiente: Financiar & Publicar
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Financing & Final Publish */}
      {step === 4 && (
        <div className="glass-card p-6 space-y-5 animate-fade-in">
          <h3 className="text-base font-bold text-white mb-1">4. Financiamiento Previo y Publicación</h3>
          <p className="text-xs text-slate-400">
            Para activar la campaña y reservar las recompensas de los ciudadanos, confirma el método de pre-pago empresarial.
          </p>

          {errorMsg && (
            <div className="p-3 rounded-stitch bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Resumen del Contrato */}
          <div className="p-4 rounded-stitch bg-slate-900/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-slate-400">Campaña:</div>
              <div className="font-bold text-white truncate">{title}</div>
            </div>
            <div>
              <div className="text-slate-400">Muestra:</div>
              <div className="font-bold text-white">{targetResponses} personas</div>
            </div>
            <div>
              <div className="text-slate-400">Bolsa Usuarios:</div>
              <div className="font-bold text-emerald-400">${escrowFund.toFixed(2)} USD</div>
            </div>
            <div>
              <div className="text-slate-400">Total a Pagar:</div>
              <div className="font-black text-primary-light text-sm">${totalInvestment.toFixed(2)} USD</div>
            </div>
          </div>

          {/* Selector de Método de Pago Empresarial */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Selecciona Método de Pago Empresarial:
            </label>

            <div className="space-y-2.5">
              {/* Opción 1: Saldo Corporativo */}
              <div
                onClick={() => setPaymentMethod('balance')}
                className={`p-3.5 rounded-stitch border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'balance'
                    ? 'border-primary bg-primary/10 text-white shadow-glow-sm'
                    : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-primary-light" />
                  <div>
                    <div className="text-xs font-bold text-white">Saldo en Cuenta Corporativa Survey 593</div>
                    <div className="text-[11px] text-slate-400">
                      Saldo disponible: ${(currentUser.balance || 0).toFixed(2)} USD
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">Débito Inmediato</span>
                </div>
              </div>

              {/* Opción 2: Tarjeta Corporativa */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-stitch border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/10 text-white shadow-glow-sm'
                    : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-secondary-light" />
                  <div>
                    <div className="text-xs font-bold text-white">Tarjeta de Crédito Corporativa (Visa / Mastercard)</div>
                    <div className="text-[11px] text-slate-400">Procesado vía Kushki / Stripe Ecuador (Cero comisión adicional)</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-300">En Línea</span>
                </div>
              </div>

              {/* Opción 3: Transferencia Bancaria */}
              <div
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3.5 rounded-stitch border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'transfer'
                    ? 'border-primary bg-primary/10 text-white shadow-glow-sm'
                    : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-teal-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Transferencia Bancaria Empresarial (Produbanco / Pichincha)</div>
                    <div className="text-[11px] text-slate-400">Acreditación directa a cuenta Kolab Tech S.A.S.</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-300">Red SPI</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(3)}>
              Atrás
            </Button>
            <Button
              size="lg"
              variant="primary"
              disabled={isFinancing}
              onClick={handlePublishAndFinance}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black hover:opacity-90 shadow-lg shadow-emerald-500/20"
            >
              {isFinancing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Financiando y Publicando Campaña...
                </span>
              ) : (
                `Pagar $${totalInvestment.toFixed(2)} USD y Activar Campaña 🚀`
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
