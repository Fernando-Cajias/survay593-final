import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { useOrganization } from '../../context/OrganizationContext';
import { EDUCATION_TEMPLATES, BUSINESS_TEMPLATES, DEFAULT_ACADEMIC_PERIODS, getCurrentPeriod } from '../../services/educationTemplates';
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
  Briefcase,
  GraduationCap,
  Factory,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   Tipo de Organización: Educativa vs Empresa
   ═══════════════════════════════════════════════════ */
const ORG_TYPES = [
  {
    key: 'education',
    icon: '🏫',
    IconComp: GraduationCap,
    title: 'Institución Educativa',
    subtitle: 'Escuela, Colegio, Unidad Educativa, Instituto, Universidad',
    description: 'Encuestas de evaluación docente, clima escolar, satisfacción de servicios y percepción de padres de familia.',
    color: 'primary',
  },
  {
    key: 'business',
    icon: '🏢',
    IconComp: Briefcase,
    title: 'Empresa / Organización',
    subtitle: 'Empresa privada, ONG, Gobierno, Comercio, Servicios',
    description: 'Encuestas de mercado, satisfacción de clientes, investigación de productos, clima laboral y estudios de viabilidad.',
    color: 'secondary',
  },
];

const INSTITUTION_TYPES = ['Escuela', 'Colegio', 'Unidad Educativa', 'Instituto Técnico', 'Universidad'];
const BUSINESS_TYPES = ['Empresa Privada', 'Microempresa', 'PYME', 'Corporación', 'ONG / Fundación', 'Entidad Pública', 'Comercio', 'Startup'];
const INDUSTRIES = ['Tecnología', 'Educación', 'Salud', 'Comercio', 'Alimentos', 'Turismo', 'Construcción', 'Transporte', 'Servicios Financieros', 'Consultoría', 'Manufactura', 'Agricultura', 'Otro'];
const CITIES = ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Santo Domingo', 'Manta', 'Loja', 'Riobamba', 'Machala', 'Esmeraldas'];

export const OnboardingInstitution = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addSurvey } = useDatabase();
  const { createOrganization } = useOrganization();

  const [step, setStep] = useState(0); // 0 = type selection

  // Step 0: Organization type
  const [orgCategory, setOrgCategory] = useState(null); // 'education' | 'business'

  // Step 1: Organization Data
  const [orgName, setOrgName] = useState('');
  const [orgSubType, setOrgSubType] = useState('');
  const [orgCity, setOrgCity] = useState('Quito');
  const [orgAddress, setOrgAddress] = useState('');
  const [leaderName, setLeaderName] = useState(currentUser?.name || '');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgEmail, setOrgEmail] = useState(currentUser?.email || '');
  // Business-only
  const [industry, setIndustry] = useState('');
  const [ruc, setRuc] = useState('');

  // Step 2: Academic Period (education only)
  const currentDefault = getCurrentPeriod();
  const [selectedPeriodIdx, setSelectedPeriodIdx] = useState(
    DEFAULT_ACADEMIC_PERIODS.findIndex((p) => p.name === currentDefault?.name)
  );

  // Step 3: Template
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const isEducation = orgCategory === 'education';

  const handleSelectType = (key) => {
    setOrgCategory(key);
    setOrgSubType(key === 'education' ? 'Unidad Educativa' : 'Empresa Privada');
    setIndustry(key === 'education' ? 'Educación' : '');
    setStep(1);
  };

  // Total steps: education = 4 (0,1,2,3), business = 3 (0,1,3) — business skips period step
  const totalSteps = isEducation ? 3 : 2;
  const getStepLabel = (num) => {
    if (isEducation) {
      return { 1: 'Datos de la Institución', 2: 'Período Académico', 3: 'Encuesta Inicial' }[num];
    }
    return { 1: 'Datos de la Empresa', 2: 'Encuesta Inicial' }[num];
  };

  const handleNext = () => {
    if (isEducation) {
      setStep(step + 1);
    } else {
      // Business: skip period step (jump from 1 to 3)
      setStep(step === 1 ? 3 : step + 1);
    }
  };

  const handleBack = () => {
    if (isEducation) {
      setStep(step - 1);
    } else {
      setStep(step === 3 ? 1 : step - 1);
    }
  };

  const handleFinish = async () => {
    setIsCreating(true);

    const typeSlug = orgSubType.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');

    // 1. Create organization (tenant)
    const org = await createOrganization({
      name: orgName,
      type: typeSlug,
      category: orgCategory,
      city: orgCity,
      address: orgAddress,
      rectorName: leaderName,
      phone: orgPhone,
      email: orgEmail,
      industry: isEducation ? 'Educación' : industry,
      ruc: ruc || null,
    });

    // 2. If a template was selected, create the survey automatically
    if (selectedTemplate) {
      const allTemplates = [...EDUCATION_TEMPLATES, ...BUSINESS_TEMPLATES];
      const tpl = allTemplates.find((t) => t.id === selectedTemplate);
      if (tpl) {
        const periodLabel = isEducation
          ? DEFAULT_ACADEMIC_PERIODS[selectedPeriodIdx]?.name || 'Actual'
          : 'Ejercicio 2026';

        const surveyData = {
          providerId: currentUser.id,
          tenantId: org.id,
          title: `${tpl.name} - ${orgName} (${periodLabel})`,
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
        onClick={() => (step === 0 ? navigate('/provider') : setStep(0))}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {step === 0 ? 'Volver al Dashboard' : 'Cambiar tipo de organización'}
      </button>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary-light text-xs font-bold mb-3">
          <Building2 className="w-4 h-4" />
          <span>Configuración Multi-Tenant · Survey 593</span>
        </div>
        <h1 className="text-2xl font-black text-white">
          {step === 0 ? '¿Qué tipo de organización deseas registrar?' : isEducation ? 'Registrar Institución Educativa 🏫' : 'Registrar Empresa / Organización 🏢'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {step === 0
            ? 'Survey 593 se adapta a tu tipo de organización con plantillas y métricas especializadas.'
            : `Configura tu ${isEducation ? 'colegio o escuela' : 'empresa'} y comienza a obtener inteligencia estratégica.`}
        </p>
      </div>

      {/* ====== STEP 0: Tipo de Organización ====== */}
      {step === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in">
          {ORG_TYPES.map((t) => (
            <div
              key={t.key}
              onClick={() => handleSelectType(t.key)}
              className="glass-card p-6 cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all hover:shadow-glow-sm group"
            >
              <div className="text-4xl mb-3">{t.icon}</div>
              <h3 className="text-lg font-black text-white mb-1 group-hover:text-primary-light transition-colors">{t.title}</h3>
              <p className="text-[11px] text-slate-400 mb-3">{t.subtitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-primary-light font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Seleccionar <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step Indicator (steps 1+) */}
      {step >= 1 && (
        <div className="flex items-center justify-between p-4 glass-card">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((num) => {
            const actualStep = isEducation ? num : (num === 1 ? 1 : 3); // map display step to actual step
            const displayStep = num;
            const isActive = isEducation ? step === num : (num === 1 ? step === 1 : step === 3);
            const isDone = isEducation ? step > num : (num === 1 ? step > 1 : false);
            const StepIcon = num === 1 ? Building2 : num === totalSteps ? FileText : Calendar;

            return (
              <div key={num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-glow-sm scale-110'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : displayStep}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {getStepLabel(num)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ====== STEP 1: Datos de la Organización ====== */}
      {step === 1 && (
        <div className="glass-card p-6 space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-light" />
            {isEducation ? '1. Datos de la Institución Educativa' : '1. Datos de la Empresa'}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isEducation ? 'Nombre de la Institución *' : 'Nombre o Razón Social *'}
            </label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder={isEducation ? 'Ej: Unidad Educativa "San Gabriel"' : 'Ej: Orión Technologies S.A.S.'}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isEducation ? 'Tipo de Institución' : 'Tipo de Organización'}
              </label>
              <select
                value={orgSubType}
                onChange={(e) => setOrgSubType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              >
                {(isEducation ? INSTITUTION_TYPES : BUSINESS_TYPES).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad</label>
              <select
                value={orgCity}
                onChange={(e) => setOrgCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Business-only: Industry + RUC */}
          {!isEducation && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Industria / Sector</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Seleccionar...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">R.U.C. (Opcional)</label>
                <input
                  type="text"
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value)}
                  placeholder="1793204829001"
                  maxLength={13}
                  className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección (Opcional)</label>
            <input
              type="text"
              value={orgAddress}
              onChange={(e) => setOrgAddress(e.target.value)}
              placeholder={isEducation ? 'Ej: Av. América N32-121 y Mariana de Jesús' : 'Ej: Av. 6 de Diciembre N45-234'}
              className="w-full px-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isEducation ? 'Nombre del Rector/Director *' : 'Representante Legal *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  placeholder={isEducation ? 'Ej: Lic. María Fernanda López' : 'Ej: Ing. Carlos Pérez'}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={orgPhone}
                  onChange={(e) => setOrgPhone(e.target.value)}
                  placeholder="02-2543210"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isEducation ? 'Correo Institucional' : 'Correo Corporativo'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                placeholder={isEducation ? 'rectorado@sangabriel.edu.ec' : 'info@orion.ec'}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(0)}>Cambiar Tipo</Button>
            <Button variant="primary" disabled={!orgName.trim() || !leaderName.trim()} onClick={handleNext} icon={ArrowRight}>
              {isEducation ? 'Siguiente: Período Académico' : 'Siguiente: Encuesta Inicial'}
            </Button>
          </div>
        </div>
      )}

      {/* ====== STEP 2: Período Académico (SOLO Educación) ====== */}
      {step === 2 && isEducation && (
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
              <strong className="text-white">Inteligencia Multi-Año:</strong> Al finalizar cada período, podrás comparar las métricas de satisfacción, clima escolar y evaluación docente con los períodos anteriores para medir la mejora continua.
            </span>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>Atrás</Button>
            <Button variant="primary" onClick={handleNext} icon={ArrowRight}>
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
            {isEducation ? '3' : '2'}. Lanza Tu Primera Encuesta (Opcional)
          </h3>
          <p className="text-xs text-slate-400">
            {isEducation
              ? 'Selecciona una plantilla educativa y tu encuesta se creará automáticamente con preguntas profesionales listas para enviar a los padres de familia.'
              : 'Selecciona una plantilla y tu encuesta se creará automáticamente. También puedes omitir este paso y crear encuestas personalizadas después.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(isEducation ? EDUCATION_TEMPLATES : BUSINESS_TEMPLATES).map((tpl) => {
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
            <Button variant="outline" onClick={handleBack}>Atrás</Button>
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
                  Configurando...
                </span>
              ) : selectedTemplate ? (
                isEducation ? 'Crear Institución y Lanzar Encuesta 🚀' : 'Crear Empresa y Lanzar Encuesta 🚀'
              ) : (
                isEducation ? 'Crear Institución y Continuar 🏫' : 'Crear Empresa y Continuar 🏢'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
