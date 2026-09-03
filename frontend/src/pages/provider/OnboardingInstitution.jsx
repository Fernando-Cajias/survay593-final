import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { useOrganization } from '../../context/OrganizationContext';
import { EDUCATION_TEMPLATES, DEFAULT_ACADEMIC_PERIODS, getCurrentPeriod } from '../../services/educationTemplates';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  School,
  MapPin,
  Phone,
  Mail,
  User,
  Sparkles,
} from 'lucide-react';

export const OnboardingInstitution = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addSurvey } = useDatabase();
  const { createOrganization } = useOrganization();

  const [step, setStep] = useState(1);

  // Step 1: Institution Data
  const [instName, setInstName] = useState('');
  const [instType, setInstType] = useState('Unidad Educativa');
  const [instCity, setInstCity] = useState('Quito');
  const [instAddress, setInstAddress] = useState('');
  const [rectorName, setRectorName] = useState(currentUser?.name || '');
  const [instPhone, setInstPhone] = useState('');
  const [instEmail, setInstEmail] = useState(currentUser?.email || '');

  // Step 2: Academic Period
  const currentDefault = getCurrentPeriod();
  const [selectedPeriodIdx, setSelectedPeriodIdx] = useState(
    DEFAULT_ACADEMIC_PERIODS.findIndex((p) => p.name === currentDefault?.name)
  );

  // Step 3: Template
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleFinish = async () => {
    setIsCreating(true);

    // 1. Create organization (tenant)
    const org = await createOrganization({
      name: instName,
      type: instType.toLowerCase().replace(/\s+/g, '_'),
      city: instCity,
      address: instAddress,
      rectorName,
      phone: instPhone,
      email: instEmail,
    });

    // 2. If a template was selected, create the survey automatically
    if (selectedTemplate) {
      const tpl = EDUCATION_TEMPLATES.find((t) => t.id === selectedTemplate);
      if (tpl) {
        const surveyData = {
          providerId: currentUser.id,
          tenantId: org.id,
          title: `${tpl.name} - ${instName} (${DEFAULT_ACADEMIC_PERIODS[selectedPeriodIdx]?.name || 'Actual'})`,
          description: tpl.description,
          category: tpl.category,
          estimatedTime: tpl.estimatedTime,
          rewardPerResponse: tpl.rewardPerResponse,
          targetResponses: 50,
          budget: tpl.rewardPerResponse * 50 * 1.35,
          escrowBalance: tpl.rewardPerResponse * 50,
          platformFee: tpl.rewardPerResponse * 50 * 0.35,
          status: 'active',
        };
        await addSurvey(surveyData, tpl.questions);
      }
    }

    setIsCreating(false);
    navigate('/provider');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <button
        onClick={() => navigate('/provider')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
      </button>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary-light text-xs font-bold mb-3">
          <School className="w-4 h-4" />
          <span>Configuración Multi-Tenant · Sector Educativo</span>
        </div>
        <h1 className="text-2xl font-black text-white">Registrar Mi Institución Educativa 🏫</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configura tu colegio o escuela en 3 pasos y comienza a obtener inteligencia institucional.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between p-4 glass-card">
        {[
          { num: 1, label: 'Datos de la Institución', icon: Building2 },
          { num: 2, label: 'Período Académico', icon: Calendar },
          { num: 3, label: 'Encuesta Inicial', icon: FileText },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                step === s.num
                  ? 'bg-primary text-white shadow-glow-sm scale-110'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-white' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ====== STEP 1: Datos de la Institución ====== */}
      {step === 1 && (
        <div className="glass-card p-6 space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-light" />
            1. Datos de la Institución Educativa
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Institución *</label>
            <input
              type="text"
              required
              value={instName}
              onChange={(e) => setInstName(e.target.value)}
              placeholder='Ej: Unidad Educativa "San Gabriel"'
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Institución</label>
              <select
                value={instType}
                onChange={(e) => setInstType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="Escuela">Escuela</option>
                <option value="Colegio">Colegio</option>
                <option value="Unidad Educativa">Unidad Educativa</option>
                <option value="Instituto Técnico">Instituto Técnico</option>
                <option value="Universidad">Universidad</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad</label>
              <select
                value={instCity}
                onChange={(e) => setInstCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="Quito">Quito</option>
                <option value="Guayaquil">Guayaquil</option>
                <option value="Cuenca">Cuenca</option>
                <option value="Ambato">Ambato</option>
                <option value="Santo Domingo">Santo Domingo</option>
                <option value="Manta">Manta</option>
                <option value="Loja">Loja</option>
                <option value="Riobamba">Riobamba</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección (Opcional)</label>
            <input
              type="text"
              value={instAddress}
              onChange={(e) => setInstAddress(e.target.value)}
              placeholder="Ej: Av. América N32-121 y Mariana de Jesús"
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Rector/Director *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={rectorName}
                  onChange={(e) => setRectorName(e.target.value)}
                  placeholder="Ej: Lic. María Fernanda López"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Institucional</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={instPhone}
                  onChange={(e) => setInstPhone(e.target.value)}
                  placeholder="02-2543210"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Institucional</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={instEmail}
                onChange={(e) => setInstEmail(e.target.value)}
                placeholder="rectorado@sangabriel.edu.ec"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="primary" disabled={!instName.trim() || !rectorName.trim()} onClick={() => setStep(2)} icon={ArrowRight}>
              Siguiente: Período Académico
            </Button>
          </div>
        </div>
      )}

      {/* ====== STEP 2: Período Académico ====== */}
      {step === 2 && (
        <div className="glass-card p-6 space-y-5 animate-fade-in">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-light" />
            2. Selecciona el Período Académico Activo
          </h3>
          <p className="text-xs text-slate-400">
            Survey 593 organizará todas las encuestas y resultados por año lectivo para que puedas comparar la evolución de tu institución año tras año.
          </p>

          <div className="space-y-2.5">
            {DEFAULT_ACADEMIC_PERIODS.map((period, idx) => {
              const isSelected = idx === selectedPeriodIdx;
              const isCurrentDefault = period.name === currentDefault?.name;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPeriodIdx(idx)}
                  className={`p-4 rounded-stitch border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-glow-sm'
                      : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                      isSelected ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{period.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(period.startDate).toLocaleDateString('es-EC', { month: 'long', year: 'numeric' })}
                        {' → '}
                        {new Date(period.endDate).toLocaleDateString('es-EC', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  {isCurrentDefault && (
                    <Badge variant="success" className="text-[10px]">Período Actual</Badge>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-stitch bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary-light flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Inteligencia Multi-Año:</strong> Al finalizar cada período, podrás comparar las métricas de satisfacción, clima escolar y evaluación docente con los períodos anteriores para medir la mejora continua de tu institución.
            </span>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
            <Button variant="primary" onClick={() => setStep(3)} icon={ArrowRight}>
              Siguiente: Encuesta Inicial
            </Button>
          </div>
        </div>
      )}

      {/* ====== STEP 3: Plantilla de Encuesta Inicial ====== */}
      {step === 3 && (
        <div className="glass-card p-6 space-y-5 animate-fade-in">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-light" />
            3. Lanza Tu Primera Encuesta (Opcional)
          </h3>
          <p className="text-xs text-slate-400">
            Selecciona una plantilla y tu encuesta se creará automáticamente con preguntas profesionales listas para enviar a los padres de familia. También puedes omitir este paso y crear encuestas personalizadas después.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EDUCATION_TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(isSelected ? null : tpl.id)}
                  className={`p-4 rounded-stitch border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-glow-sm'
                      : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{tpl.icon}</div>
                  <div className="text-sm font-bold text-white mb-1">{tpl.name}</div>
                  <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">{tpl.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="font-semibold">{tpl.questions.length} preguntas</span>
                    <span>·</span>
                    <span>{tpl.estimatedTime} min</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-bold">${tpl.rewardPerResponse.toFixed(2)} / resp.</span>
                  </div>
                  {isSelected && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-primary-light font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Seleccionada</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>Atrás</Button>
            <Button
              size="lg"
              variant="primary"
              disabled={isCreating}
              onClick={handleFinish}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black hover:opacity-90 shadow-lg"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Configurando Institución...
                </span>
              ) : selectedTemplate ? (
                'Crear Institución y Lanzar Encuesta 🚀'
              ) : (
                'Crear Institución y Continuar 🏫'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
