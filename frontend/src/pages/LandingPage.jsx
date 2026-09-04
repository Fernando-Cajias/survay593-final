import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Building2,
  Users,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  MapPin,
  Sliders,
  Download,
  School,
  GraduationCap,
  Coins,
  ChevronRight,
  Check,
  Layers,
  Globe,
  FileText,
  Lock,
  Award,
  Search,
  Zap,
  Briefcase,
  Smartphone,
  PieChart,
  HelpCircle,
} from 'lucide-react';

// =========================================================================
// DATOS DEMOSTRATIVOS INTERACTIVOS PARA EL DASHBOARD EMPRESARIAL
// =========================================================================
const INDUSTRY_STUDIES = [
  {
    id: 'retail',
    tag: 'Consumo Masivo & Retail',
    icon: ShoppingBagIcon,
    title: 'Estudio de Hábitos de Compra y Percepción de Marca 2026',
    sponsor: 'Corporación Retail Andina',
    sampleSize: '1,850 respuestas verificadas',
    completionRate: '98.6%',
    avgTime: '3.2 min',
    insights: [
      { label: 'Supermercados físicos', value: 58, color: 'bg-teal-500' },
      { label: 'Canales digitales / Apps', value: 27, color: 'bg-emerald-400' },
      { label: 'Tiendas de barrio', value: 15, color: 'bg-indigo-400' },
    ],
    npsScore: '+48 (Excelente)',
    demographics: {
      pichincha: '38%',
      guayas: '36%',
      azuay: '14%',
      otras: '12%',
    },
    keyFinding: 'El 72% de los consumidores en Quito y Guayaquil prioriza marcas locales con envases ecológicos.',
  },
  {
    id: 'education',
    tag: 'Sector Educativo (Colegios y Universidades)',
    icon: School,
    title: 'Auditoría de Clima Académico y Satisfacción Docente Quimestre II',
    sponsor: 'Colegio y Unidad Educativa Benalcázar',
    sampleSize: '940 respuestas (Padres y Alumnos)',
    completionRate: '99.1%',
    avgTime: '4.5 min',
    insights: [
      { label: 'Calidad pedagógica alta', value: 64, color: 'bg-indigo-500' },
      { label: 'Satisfacción con plataformas', value: 24, color: 'bg-teal-400' },
      { label: 'Requiere soporte extracuricular', value: 12, color: 'bg-amber-400' },
    ],
    npsScore: '+56 (Liderazgo)',
    demographics: {
      pichincha: '85%',
      guayas: '8%',
      azuay: '4%',
      otras: '3%',
    },
    keyFinding: 'La satisfacción de los padres subió 18 puntos al digitalizar reportes de rendimiento quimestral.',
  },
  {
    id: 'fintech',
    tag: 'Banca & Medios de Pago',
    icon: Coins,
    title: 'Penetración de Billeteras Digitales y Pagos QR en Ecuador',
    sponsor: 'Fintech Ecuador Group',
    sampleSize: '2,400 usuarios bancarizados',
    completionRate: '97.8%',
    avgTime: '2.8 min',
    insights: [
      { label: 'DeUna / Banco Pichincha', value: 52, color: 'bg-teal-500' },
      { label: 'Tarjetas Débito contactless', value: 31, color: 'bg-emerald-400' },
      { label: 'Efectivo billetes/monedas', value: 17, color: 'bg-slate-500' },
    ],
    npsScore: '+62 (Muy Alto)',
    demographics: {
      pichincha: '35%',
      guayas: '40%',
      azuay: '15%',
      otras: '10%',
    },
    keyFinding: 'El 83% de los encuestados menores de 35 años prefiere pagar con QR en comercios locales.',
  },
  {
    id: 'health',
    tag: 'Salud & Servicios Médicos',
    icon: ShieldCheck,
    title: 'Evaluación de Experiencia y Disponibilidad en Cadenas de Farmacias',
    sponsor: 'Grupo Salud Integral',
    sampleSize: '1,200 clientes urbanos',
    completionRate: '98.2%',
    avgTime: '3.6 min',
    insights: [
      { label: 'Disponibilidad de stock', value: 61, color: 'bg-emerald-500' },
      { label: 'Rapidez en caja y atención', value: 25, color: 'bg-teal-400' },
      { label: 'Descuentos con afiliados', value: 14, color: 'bg-indigo-400' },
    ],
    npsScore: '+41 (Favorable)',
    demographics: {
      pichincha: '36%',
      guayas: '34%',
      azuay: '18%',
      otras: '12%',
    },
    keyFinding: 'El 65% valora la entrega a domicilio en menos de 45 minutos para medicamentos recurrentes.',
  },
];

function ShoppingBagIcon(props) {
  return <Briefcase {...props} />;
}

export const LandingPage = () => {
  const navigate = useNavigate();

  // Selected Tab in Interactive Preview
  const [activeTabId, setActiveTabId] = useState('retail');
  const activeStudy = useMemo(
    () => INDUSTRY_STUDIES.find((s) => s.id === activeTabId) || INDUSTRY_STUDIES[0],
    [activeTabId]
  );

  // Simulator State
  const [simObjective, setSimObjective] = useState('mercado');
  const [simRegion, setSimRegion] = useState('nacional');
  const [simSampleSize, setSimSampleSize] = useState(500);

  // Dynamic calculations for simulator
  const simMarginError = useMemo(() => {
    if (simSampleSize >= 2000) return '± 1.8%';
    if (simSampleSize >= 1000) return '± 2.5%';
    if (simSampleSize >= 500) return '± 3.8%';
    return '± 5.2%';
  }, [simSampleSize]);

  const simEstimatedHours = useMemo(() => {
    if (simSampleSize >= 2000) return '24 a 36 horas';
    if (simSampleSize >= 1000) return '16 a 24 horas';
    if (simSampleSize >= 500) return '8 a 16 horas';
    return '4 a 8 horas';
  }, [simSampleSize]);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Background Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-teal-500/10 via-indigo-500/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[800px] -right-40 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP CORPORATE NAVIGATION BAR                                          */}
      {/* ========================================================================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070B14]/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
                <span className="text-teal-400 font-black text-lg tracking-tighter">593</span>
              </div>
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-tight leading-none block">
                SURVEY <span className="text-teal-400">593</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase block mt-0.5">
                Market Intelligence · Ecuador
              </span>
            </div>
          </Link>

          {/* Nav Links Desktop */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#soluciones" className="hover:text-white transition-colors">Soluciones</a>
            <a href="#demo" className="hover:text-white transition-colors">BI Studio</a>
            <a href="#simulador" className="hover:text-white transition-colors">Simulador</a>
            <a href="#ecosistema" className="hover:text-white transition-colors">Ecosistema</a>
            <a href="#seguridad" className="hover:text-white transition-colors">Seguridad</a>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition-colors"
          >
            Iniciar Sesión
          </Link>

          <Link to="/login">
            <Button
              variant="primary"
              className="py-2 px-4 text-xs font-bold shadow-lg shadow-teal-500/20 flex items-center gap-2"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Portal Empresarial</span>
            </Button>
          </Link>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: LA PROPUESTA DE VALOR QUE VENDE                          */}
      {/* ========================================================================= */}
      <header className="pt-32 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10 text-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-teal-300 text-xs font-bold mb-6 shadow-sm animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping" />
          <span>Inteligencia de Mercado y Analítica Demográfica en Tiempo Real · Ecuador</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] max-w-4xl mx-auto mb-6">
          Decisiones Estratégicas Basadas en la{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
            Opinión Real del Mercado Ecuatoriano
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          Conectamos a empresas, marcas de consumo masivo, colegios y universidades con miles de ciudadanos verificados en las 24 provincias. Obtén datos representativos, segmentación precisa y tableros interactivos en menos de 24 horas.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              variant="primary"
              className="w-full sm:w-auto py-3.5 px-7 font-black text-sm shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 group"
            >
              <Building2 className="w-4 h-4" />
              <span>Crear Estudio Empresarial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <a href="#demo" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-sm transition-all flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>Explorar Demo de Analítica en Vivo</span>
            </button>
          </a>

          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 font-semibold text-xs transition-all flex items-center justify-center gap-2">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Comunidad de Encuestados 593</span>
            </button>
          </Link>
        </div>

        {/* Key Platform Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-teal-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">+25,000</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Ciudadanos y hogares verificados en todo el país</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">&lt; 24h</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Tiempo promedio de entrega de resultados representativos</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">24 Provincias</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Cobertura urbana y rural segmentada por cantones</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-teal-300 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">99.4%</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Precisión antifraude con validación biométrica/dispositivo</p>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE LIVE MARKET INTELLIGENCE PREVIEW (THE ENTERPRISE HOOK)     */}
      {/* ========================================================================= */}
      <section id="demo" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Survey 593 Business Intelligence Studio</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Analítica que Transforma la Incertidumbre en Rentabilidad
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Selecciona un sector económico y descubre cómo las organizaciones líderes monitorean el pulso del consumidor ecuatoriano.
          </p>
        </div>

        {/* Industry Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {INDUSTRY_STUDIES.map((study) => {
            const Icon = study.icon;
            const isSelected = study.id === activeTabId;
            return (
              <button
                key={study.id}
                onClick={() => setActiveTabId(study.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-500/20 scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{study.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Dashboard Card Display */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl relative">
          
          {/* Header of Active Study */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  {activeStudy.tag}
                </span>
                <span className="text-xs text-slate-400 font-semibold">Cliente: {activeStudy.sponsor}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activeStudy.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 block">Muestra Recolectada</span>
                <span className="text-xs font-bold text-teal-400">{activeStudy.sampleSize}</span>
              </div>
              <Link to="/login">
                <Button size="sm" variant="primary" className="text-xs font-bold">
                  Lanzar Estudio Similar 🚀
                </Button>
              </Link>
            </div>
          </div>

          {/* Grid of Visual Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-start">
            
            {/* Primary Distribution Bars (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <PieChart className="w-3.5 h-3.5 text-teal-400" />
                  <span>Distribución de Respuestas Verificadas</span>
                </h4>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {activeStudy.completionRate} tasa de finalización
                </span>
              </div>

              {/* Animated Progress Bars */}
              <div className="space-y-3 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
                {activeStudy.insights.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.label}</span>
                      <span className="text-white font-bold">{item.value}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Strategic Insight Box */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-200 text-xs flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-bold block mb-0.5">Hallazgo Clave de Mercado:</strong>
                  <span>{activeStudy.keyFinding}</span>
                </div>
              </div>
            </div>

            {/* Demographic Breakdown & NPS (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Cobertura Territorial Ecuatoriana</span>
              </h4>

              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Pichincha / Quito</span>
                    <span className="text-base font-black text-white block mt-0.5">{activeStudy.demographics.pichincha}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Guayas / Gye</span>
                    <span className="text-base font-black text-white block mt-0.5">{activeStudy.demographics.guayas}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Azuay / Cuenca</span>
                    <span className="text-base font-black text-white block mt-0.5">{activeStudy.demographics.azuay}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Otras 21 Provincias</span>
                    <span className="text-base font-black text-white block mt-0.5">{activeStudy.demographics.otras}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Índice de Lealtad (NPS)</span>
                    <span className="text-sm font-black text-teal-400">{activeStudy.npsScore}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Tiempo Promedio</span>
                    <span className="text-xs font-bold text-white">{activeStudy.avgTime}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SIMULADOR DE ESTUDIO INTERACTIVO (CALCULADORA DE MUESTRA)              */}
      {/* ========================================================================= */}
      <section id="simulador" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="bg-gradient-to-br from-slate-900 via-[#0C1425] to-slate-950 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              <Sliders className="w-3.5 h-3.5" />
              <span>Calculadora Muestral & Cotizador Inmediato</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Simula tu Próximo Estudio de Mercado en Segundos
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Define el alcance de tu investigación y estima el nivel de representatividad estadística y tiempo de recolección en el territorio ecuatoriano.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Muestreo probabilístico con controles por cuotas de edad y género</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Exportación instantánea a Excel, PDF ejecutivo y conectores PowerBI</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Garantía de cero respuestas duplicadas por huella digital</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Controls (6 Cols) */}
          <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-6">
            
            {/* 1. Tipo de Estudio */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                1. Objetivo de la Investigación
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'mercado', label: 'Estudio de Mercado' },
                  { id: 'producto', label: 'Validación de Producto' },
                  { id: 'educacion', label: 'Sector Educativo' },
                  { id: 'nps', label: 'Satisfacción y NPS' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSimObjective(item.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border text-left ${
                      simObjective === item.id
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Región Territorial */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                2. Cobertura Geográfica
              </label>
              <select
                value={simRegion}
                onChange={(e) => setSimRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-400"
              >
                <option value="nacional">Ecuador Nacional (24 Provincias)</option>
                <option value="quito">Quito y Valles (Pichincha)</option>
                <option value="guayaquil">Guayaquil, Samborondón y Durán (Guayas)</option>
                <option value="cuenca">Cuenca y Región Austral (Azuay)</option>
                <option value="eje-central">Eje Central (Ambato, Riobamba, Latacunga)</option>
              </select>
            </div>

            {/* 3. Slider de Tamaño Muestral */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <label className="font-bold text-slate-300">3. Tamaño Muestral Deseado</label>
                <span className="text-teal-400 font-black text-sm">{simSampleSize} encuestados</span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="100"
                value={simSampleSize}
                onChange={(e) => setSimSampleSize(Number(e.target.value))}
                className="w-full accent-teal-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>100</span>
                <span>500</span>
                <span>1,000</span>
                <span>2,500+</span>
              </div>
            </div>

            {/* Dynamic Result Summary Card */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-3 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Margen de Error (95% IC)</span>
                <span className="text-base font-black text-white block mt-0.5">{simMarginError}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Entrega de Resultados</span>
                <span className="text-base font-black text-teal-400 block mt-0.5">{simEstimatedHours}</span>
              </div>
            </div>

            {/* Action CTA */}
            <Link to="/login" className="block">
              <Button variant="primary" className="w-full py-3 font-bold text-xs shadow-lg shadow-teal-500/20">
                Iniciar Campaña con esta Muestra 🚀
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SOLUCIONES POR INDUSTRIA & LÓGICA DE MERCADO                           */}
      {/* ========================================================================= */}
      <section id="soluciones" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Soluciones Corporativas a Medida</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Diseñado para los Desafíos Estratégicos de Ecuador
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Survey 593 no es un generador de encuestas genérico. Es una infraestructura integral adaptada a la dinámica comercial, educativa y regulatoria de nuestro país.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Empresas & Retail */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShoppingBagIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                Empresas & Consumo Masivo
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Pruebas de concepto, elasticidad de precios, auditorías en punto de venta y recordación de campañas publicitarias.
              </p>
            </div>
            <ul className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-teal-400" />
                <span>Segmentación por NSE y ciudad</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-teal-400" />
                <span>Feedback antes de lanzar a percha</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Sector Educativo Multi-Tenant */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                Colegios & Universidades
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Módulo multi-inquilino para evaluación docente, clima escolar, sondeos a padres de familia y comités de acreditación.
              </p>
            </div>
            <ul className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-indigo-400" />
                <span>Filtro por períodos académicos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-indigo-400" />
                <span>Reportes ejecutivos para rectorados</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Banca & Servicios Financieros */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Banca, Seguros & Fintech
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Medición de experiencia en canales digitales, adopción de transferencias interbancarias y percepción de seguridad.
              </p>
            </div>
            <ul className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Métricas de adopción de pagos QR</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>NPS transaccional continuo</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Consultoras & Agencias */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                Consultoras & Agencias
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Infraestructura de trabajo de campo a demanda. Olvídate de brigadas físicas costosas o bases de datos desactualizadas.
              </p>
            </div>
            <ul className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-teal-400" />
                <span>Exportación a PDF y Excel en 1 clic</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-teal-400" />
                <span>Muestreo representativo garantizado</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EL ECOSISTEMA: EL VÍNCULO EMPRESA ⇄ CIUDADANÍA (EL ENGANCHE)          */}
      {/* ========================================================================= */}
      <section id="ecosistema" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 lg:p-12 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-2">
              El Modelo Bidireccional Survey 593
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              ¿Por Qué Nuestro Modelo Genera Datos Más Precisos?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
              Las encuestas tradicionales sufren de bajas tasas de respuesta o respuestas fraudulentas. Nuestro ecosistema alinea los incentivos de empresas y ciudadanos con total transparencia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            
            {/* Paso 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 font-black text-base flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-white">La Organización Diseña y Segmenta</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Utiliza nuestras plantillas probadas o crea preguntas específicas. Define tu público por ciudad, edad y sector en el panel corporativo.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 font-black text-base flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-white">Ciudadanos Reales Responden</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Miles de encuestados reciben la invitación en sus celulares. Al responder con honestidad, acumulan micro-recompensas directas a sus cuentas bancarias ecuatorianas.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 font-black text-base flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-white">Datos en Tiempo Real y Cero Bots</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nuestros algoritmos validan respuestas duplicadas y tiempos de lectura. Los resultados se procesan al instante en gráficos exportables.
              </p>
            </div>

          </div>

          {/* Respondent Trust Callout */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 via-slate-900 to-indigo-500/10 border border-teal-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-sm font-bold text-white">¿Eres ciudadano y quieres participar en la Comunidad 593?</h4>
              <p className="text-xs text-slate-400">
                Tu opinión ayuda a mejorar los productos y servicios del país. Retira tus fondos acumulados a Banco Pichincha, Guayaquil, Produbanco o DeUna.
              </p>
            </div>
            <Link to="/login" className="shrink-0">
              <Button size="sm" variant="outline" className="text-xs font-bold">
                Unirme como Encuestado 👤
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SEGURIDAD & COMPROMISO INSTITUCIONAL                                    */}
      {/* ========================================================================= */}
      <section id="seguridad" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <ShieldCheck className="w-10 h-10 text-teal-400 mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Seguridad y Privacidad de Grado Empresarial
          </h2>
          <p className="text-slate-400 text-xs mt-2">
            Cumplimos con los más altos estándares de protección de datos personales y seguridad informática en Ecuador.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 text-left">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Lock className="w-5 h-5 text-teal-400 mb-3" />
            <h4 className="text-xs font-bold text-white mb-1">Cifrado de Extremo a Extremo</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Comunicaciones cifradas mediante TLS 256-bit y almacenamiento protegido en arquitectura en la nube de alta disponibilidad.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Award className="w-5 h-5 text-emerald-400 mb-3" />
            <h4 className="text-xs font-bold text-white mb-1">Anonimización de Encuestados</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Las empresas reciben datos demográficos consolidados; los datos personales y de identidad del ciudadano permanecen bajo estricta confidencialidad.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-indigo-400 mb-3" />
            <h4 className="text-xs font-bold text-white mb-1">Prevención Activa de Fraude</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bloqueo inteligente de respuestas sospechosas, control de velocidad de respuesta (speeder checks) y verificación por dispositivo único.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BANNER FINAL CTA                                                       */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="p-8 lg:p-14 rounded-3xl bg-gradient-to-tr from-teal-900/60 via-slate-900 to-indigo-950/60 border border-teal-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
          
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 relative z-10 max-w-3xl mx-auto">
            Comienza a Tomar Decisiones Basadas en Datos Reales Hoy Mismo
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mb-8 relative z-10">
            Crea tu cuenta empresarial en 1 minuto. Publica tu primer estudio o solicita una demostración guiada para tu organización.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto py-3.5 px-8 text-sm font-black shadow-xl shadow-teal-500/25">
                Crear Cuenta Empresarial Gratis 🚀
              </Button>
            </Link>

            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all">
                Ingresar a mi Cuenta Existente
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER CORPORATIVO                                                     */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-8 bg-slate-950 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center font-black text-slate-950 text-xs">
                593
              </div>
              <span className="font-black text-white text-sm">SURVEY 593</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Infraestructura de inteligencia de mercado, encuestas y analítica ciudadana para el Ecuador.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-3">Plataforma</h5>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#soluciones" className="hover:text-white transition-colors">Empresas & Retail</a></li>
              <li><a href="#soluciones" className="hover:text-white transition-colors">Colegios & Universidades</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">BI Studio</a></li>
              <li><a href="#simulador" className="hover:text-white transition-colors">Calculadora de Muestra</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-3">Territorio 593</h5>
            <ul className="space-y-2 text-[11px]">
              <li><span>Pichincha / Quito y Valles</span></li>
              <li><span>Guayas / Guayaquil y Samborondón</span></li>
              <li><span>Azuay / Cuenca y Austro</span></li>
              <li><span>Cobertura Nacional 24 Provincias</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-3">Cumplimiento & Soporte</h5>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/login" className="hover:text-white transition-colors">Acceso de Clientes</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Portal de Encuestados</Link></li>
              <li><span className="text-slate-400">Términos de Servicio y Privacidad</span></li>
              <li><span className="text-slate-400">Seguridad SSL 256-bit</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Survey 593 Enterprise. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Hecho para el mercado ecuatoriano 🇪🇨</span>
            <span>•</span>
            <span>Versión 2.5 Enterprise SaaS</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
