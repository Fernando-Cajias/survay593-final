import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const CreateSurveyWizard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addSurvey } = useDatabase();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Moda');
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [rewardPerResponse, setRewardPerResponse] = useState(2.5);
  const [targetResponses, setTargetResponses] = useState(100);

  const [questions, setQuestions] = useState([
    {
      type: 'multiple',
      text: '¿Con qué frecuencia compras productos de esta categoría?',
      required: true,
      options: ['Diariamente', 'Semanalmente', 'Mensualmente', 'Rara vez'],
    },
  ]);

  // Question builder state
  const [newQType, setNewQType] = useState('multiple');
  const [newQText, setNewQText] = useState('');
  const [newQOptions, setNewQOptions] = useState('Opción 1, Opción 2, Opción 3');
  const [newQRequired, setNewQRequired] = useState(true);

  const totalBudget = (parseFloat(rewardPerResponse) || 0) * (parseInt(targetResponses) || 0);

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

  const handlePublish = () => {
    const surveyData = {
      providerId: currentUser.id,
      title,
      description,
      category,
      estimatedTime: parseInt(estimatedTime),
      rewardPerResponse: parseFloat(rewardPerResponse),
      targetResponses: parseInt(targetResponses),
      budget: totalBudget,
      status: 'active',
    };

    addSurvey(surveyData, questions);
    navigate('/provider');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <button
        onClick={() => navigate('/provider')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
      </button>

      <div>
        <h1 className="text-2xl font-black text-white">Crear Nueva Encuesta ✏️</h1>
        <p className="text-xs text-slate-400 mt-1">Configura el cuestionario, define la recompensa y publica en tiempo real.</p>
      </div>

      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between p-4 glass-card">
        {[
          { num: 1, label: 'Información' },
          { num: 2, label: 'Presupuesto' },
          { num: 3, label: 'Preguntas' },
          { num: 4, label: 'Revisar' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num
                  ? 'bg-primary text-white shadow-glow-sm'
                  : step > s.num
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span
              className={`text-xs font-semibold ${
                step === s.num ? 'text-white' : 'text-slate-400'
              } hidden sm:inline`}
            >
              {s.label}
            </span>
            {i < 3 && <div className="w-10 h-0.5 bg-slate-800 hidden md:block mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1: Info */}
      {step === 1 && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">1. Información de la Campaña</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Título de la Encuesta</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Estudio de Mercado de Ropa Deportiva 2026"
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción del Estudio</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="Moda">Moda</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Salud">Salud</option>
                <option value="Gobierno">Gobierno</option>
                <option value="Alimentación">Alimentación</option>
                <option value="Finanzas">Finanzas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tiempo Estimado (Minutos)</label>
              <input
                type="number"
                min="1"
                max="30"
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
              Siguiente: Presupuesto
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Budget */}
      {step === 2 && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">2. Presupuesto y Muestra Objetivo</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recompensa por Encuestado ($ USD)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={rewardPerResponse}
                onChange={(e) => setRewardPerResponse(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Muestra de Respuestas Requeridas
              </label>
              <input
                type="number"
                min="10"
                value={targetResponses}
                onChange={(e) => setTargetResponses(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="p-4 rounded-stitch bg-emerald-500/10 border border-emerald-500/30 text-center my-4">
            <div className="text-xs text-slate-400 font-semibold mb-1">Presupuesto Total Estimado:</div>
            <div className="text-3xl font-black text-emerald-400">${totalBudget.toFixed(2)} USD</div>
            <div className="text-[10px] text-slate-400 mt-1">
              (Calculado: ${rewardPerResponse} × {targetResponses} encuestados verificados)
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Atrás
            </Button>
            <Button variant="primary" onClick={() => setStep(3)} icon={ArrowRight}>
              Siguiente: Preguntas
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Questions */}
      {step === 3 && (
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">3. Preguntas del Cuestionario ({questions.length})</h3>
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
              Siguiente: Revisar
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-base font-bold text-white mb-2">4. Resumen y Publicación</h3>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-stitch bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Título:</div>
              <div className="text-sm font-bold text-white">{title}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Categoría:</div>
              <Badge variant="primary">{category}</Badge>
            </div>
            <div>
              <div className="text-xs text-slate-400">Presupuesto Asignado:</div>
              <div className="text-sm font-bold text-emerald-400">${totalBudget.toFixed(2)} USD</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Preguntas Incluidas:</div>
              <div className="text-sm font-bold text-white">{questions.length} preguntas</div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(3)}>
              Atrás
            </Button>
            <Button size="lg" variant="success" onClick={handlePublish} icon={CheckCircle2}>
              🚀 Publicar Encuesta Ahora
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
