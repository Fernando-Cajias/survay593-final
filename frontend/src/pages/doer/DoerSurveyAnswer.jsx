import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, CheckCircle2, DollarSign } from 'lucide-react';

export const DoerSurveyAnswer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const { surveys, questions, submitResponse } = useDatabase();

  const survey = surveys.find((s) => s.id === id);
  const surveyQuestions = questions
    .filter((q) => q.surveyId === id)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!survey) {
    return (
      <div className="p-8 text-center glass-card">
        <h2 className="text-xl font-bold text-white mb-2">Encuesta no encontrada</h2>
        <Button onClick={() => navigate('/doer/surveys')}>Volver al listado</Button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent = surveyQuestions.length
    ? Math.round((answeredCount / surveyQuestions.length) * 100)
    : 0;

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check required questions
    for (const q of surveyQuestions) {
      if (q.required && (answers[q.id] === undefined || answers[q.id] === '')) {
        setError(`Por favor responde la pregunta obligatoria: "${q.text}"`);
        return;
      }
    }

    const reward = survey.rewardPerResponse || 1.0;
    submitResponse(survey.id, currentUser.id, answers, reward);

    // Update current user balance & streak
    updateProfile({
      balance: (currentUser.balance || 0) + reward,
      surveysCompleted: (currentUser.surveysCompleted || 0) + 1,
      streak: (currentUser.streak || 0) + 1,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-12 text-center glass-card p-8 animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">¡Encuesta Completada!</h2>
        <p className="text-xs text-slate-400 mb-6">Tus respuestas han sido verificadas y registradas con éxito.</p>

        <div className="p-4 rounded-stitch bg-slate-800/80 border border-slate-700/60 mb-6">
          <div className="text-xs text-slate-400 font-semibold mb-1">Recompensa Abonada:</div>
          <div className="text-3xl font-black text-emerald-400">+${(survey.rewardPerResponse || 0).toFixed(2)}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Nuevo saldo: ${(currentUser.balance || 0).toFixed(2)}
          </div>
        </div>

        <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/doer/wallet')}>
          Ver mi Billetera →
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/doer/surveys')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al listado
        </button>
        <div className="flex items-center justify-between">
          <Badge variant="primary">{survey.category}</Badge>
          <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> Recompensa: +${survey.rewardPerResponse?.toFixed(2)}
          </span>
        </div>
        <h1 className="text-2xl font-black text-white mt-2">{survey.title}</h1>
        <p className="text-xs text-slate-400 mt-1">{survey.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4">
        <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
          <span>Progreso de la encuesta</span>
          <span>
            {answeredCount} de {surveyQuestions.length} respondidas ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-stitch bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
          {error}
        </div>
      )}

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {surveyQuestions.map((q, idx) => (
          <div key={q.id} className="glass-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primary-light uppercase tracking-wider">
                  Pregunta {idx + 1}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {q.text} {q.required && <span className="text-rose-400">*</span>}
                </h3>
              </div>
              <Badge variant="neutral">{q.type === 'likert' ? 'Escala 1-5' : q.type}</Badge>
            </div>

            {/* Multiple Choice */}
            {q.type === 'multiple' && (
              <div className="space-y-2 pt-2">
                {q.options?.map((opt, i) => (
                  <label
                    key={i}
                    onClick={() => handleAnswer(q.id, opt)}
                    className={`flex items-center gap-3 p-3.5 rounded-stitch border cursor-pointer transition-all ${
                      answers[q.id] === opt
                        ? 'border-primary bg-primary/10 text-white font-semibold'
                        : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      checked={answers[q.id] === opt}
                      onChange={() => {}}
                      className="accent-primary"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Likert Scale (1 - 5) */}
            {q.type === 'likert' && (
              <div className="pt-2">
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAnswer(q.id, val)}
                      className={`py-3 px-2 rounded-stitch border text-center font-bold text-sm transition-all ${
                        answers[q.id] === val
                          ? 'border-primary bg-primary text-white shadow-glow-sm'
                          : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1 mt-2">
                  <span>{q.labels?.[0] || '1 (Muy bajo)'}</span>
                  <span>{q.labels?.[4] || '5 (Muy alto)'}</span>
                </div>
              </div>
            )}

            {/* Yes / No */}
            {q.type === 'yesno' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {['Sí', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAnswer(q.id, opt)}
                    className={`py-3 rounded-stitch border text-center font-bold text-sm transition-all ${
                      answers[q.id] === opt
                        ? 'border-primary bg-primary text-white shadow-glow-sm'
                        : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Text Open */}
            {q.type === 'text' && (
              <div className="pt-2">
                <textarea
                  rows={3}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="w-full p-3 rounded-stitch bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            )}
          </div>
        ))}

        <Button type="submit" size="xl" variant="primary" className="w-full">
          Finalizar y Reclamar Recompensa 🚀
        </Button>
      </form>
    </div>
  );
};
