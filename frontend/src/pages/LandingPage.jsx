import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
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
  School,
  GraduationCap,
  Coins,
  ChevronRight,
  Check,
  Layers,
  Globe,
  Lock,
  Award,
  Zap,
  Briefcase,
  DollarSign,
  X,
  User,
  Mail,
  PieChart,
  Sun,
  Moon,
} from 'lucide-react';

// =========================================================================
// OPORTUNIDADES REALES GEOLOCALIZADAS EN ECUADOR (EL RADAR DE SEDUCCIÓN)
// =========================================================================
const OPPORTUNITIES = [
  {
    id: 'opp_1',
    city: 'Quito',
    locationName: 'C.C. El Jardín / Av. Amazonas',
    title: {
      es: 'Auditoría de Marcas de Ropa y Experiencia',
      en: 'Fashion Brands Experience & Retail Audit',
    },
    sponsor: 'Textil Andina S.A.',
    reward: 5.0,
    timeMinutes: 3,
    category: {
      es: 'Moda y Retail',
      en: 'Fashion & Retail',
    },
    missionDescription: {
      es: 'Tu misión consiste en evaluar la experiencia de compra en tiendas de moda en el norte de Quito y responder 3 preguntas breves.',
      en: 'Your mission is to evaluate the shopping experience at fashion stores in North Quito and answer 3 short questions.',
    },
    coordinates: { top: '38%', left: '46%' },
    question1: {
      es: '¿En cuál de estos centros comerciales compraste ropa o calzado en los últimos 3 meses?',
      en: 'In which of these malls did you buy clothing or shoes in the last 3 months?',
    },
    options1: {
      es: [
        'C.C. El Jardín o CCI (Norte)',
        'Quicentro Shopping / La Carolina',
        'Tiendas independientes / Locales de barrio',
        'Por internet / Instagram / WhatsApp',
      ],
      en: [
        'El Jardín Mall or CCI (North)',
        'Quicentro Shopping / La Carolina',
        'Independent retail / Local stores',
        'Online / Instagram / WhatsApp',
      ],
    },
  },
  {
    id: 'opp_2',
    city: 'Quito',
    locationName: 'Quicentro Shopping / La Carolina',
    title: {
      es: 'Preferencia de Calzado Deportivo Juvenil',
      en: 'Youth Athletic Footwear Preferences',
    },
    sponsor: 'Calzado Ecuatoriano C.A.',
    reward: 3.5,
    timeMinutes: 2,
    category: {
      es: 'Deportes y Estilo',
      en: 'Sports & Style',
    },
    missionDescription: {
      es: 'Tu misión consiste en compartir tus preferencias de precio y marcas en calzado urbano deportivo.',
      en: 'Your mission is to share your brand and pricing preferences for urban athletic footwear.',
    },
    coordinates: { top: '30%', left: '52%' },
    question1: {
      es: '¿Cuánto sueles gastar en promedio en un par de zapatillas deportivas?',
      en: 'On average, how much do you spend on a pair of sneakers?',
    },
    options1: {
      es: [
        'Menos de $40 USD',
        'Entre $40 y $75 USD',
        'Entre $75 y $120 USD',
        'Más de $120 USD',
      ],
      en: [
        'Less than $40 USD',
        'Between $40 and $75 USD',
        'Between $75 and $120 USD',
        'Over $120 USD',
      ],
    },
  },
  {
    id: 'opp_3',
    city: 'Guayaquil',
    locationName: 'Mall del Sol / Av. Joaquín Orrantia',
    title: {
      es: 'Estudio de Consumo en Restaurantes y Cafés',
      en: 'Dining & Coffee Consumption Study',
    },
    sponsor: 'Grupo Gastronómico Guayas',
    reward: 10.0,
    timeMinutes: 4,
    category: {
      es: 'Alimentos y Bebidas',
      en: 'Food & Beverage',
    },
    missionDescription: {
      es: 'Tu misión consiste en responder sobre hábitos de comida familiar y consumo en patios de comidas en Guayaquil.',
      en: 'Your mission is to share dining habits and family spending at shopping mall food courts in Guayaquil.',
    },
    coordinates: { top: '64%', left: '36%' },
    question1: {
      es: '¿Con qué frecuencia sales a comer en centros comerciales con tu familia?',
      en: 'How often do you dine at shopping mall restaurants with your family?',
    },
    options1: {
      es: [
        '1 a 2 veces por semana',
        'Fines de semana exclusivamente',
        '1 a 2 veces al mes',
        'Rara vez o solo ocasiones especiales',
      ],
      en: [
        '1 to 2 times a week',
        'Weekends exclusively',
        '1 to 2 times a month',
        'Rarely or special occasions only',
      ],
    },
  },
  {
    id: 'opp_4',
    city: 'Cuenca',
    locationName: 'Centro Histórico / Parque Calderón',
    title: {
      es: 'Evaluación de Servicios Cafeteros y Postres',
      en: 'Specialty Coffee & Bakery Evaluation',
    },
    sponsor: 'Café Austral Cuencano',
    reward: 4.0,
    timeMinutes: 3,
    category: {
      es: 'Gastronomía Local',
      en: 'Local Gastronomy',
    },
    missionDescription: {
      es: 'Tu misión consiste en calificar el ambiente, conectividad wifi y calidad del café en cafeterías tradicionales.',
      en: 'Your mission is to rate the ambiance, wifi connectivity, and coffee quality in traditional coffee houses.',
    },
    coordinates: { top: '76%', left: '48%' },
    question1: {
      es: '¿Qué factor consideras más importante al elegir una cafetería para pasar la tarde?',
      en: 'What is the most critical factor when choosing a café for an afternoon visit?',
    },
    options1: {
      es: [
        'Calidad del café de especialidad',
        'Buen internet y ambiente tranquilo para trabajar',
        'Precios accesibles y promociones',
        'Variedad de postres y pastelería tradicional',
      ],
      en: [
        'Specialty coffee taste and quality',
        'High-speed wifi and quiet work environment',
        'Accessible pricing and deals',
        'Artisanal bakery and dessert variety',
      ],
    },
  },
  {
    id: 'opp_5',
    city: 'Todo Ecuador',
    locationName: 'Online · Desde tu celular en casa',
    title: {
      es: 'Encuesta Rápida de Métodos de Pago Digitales',
      en: 'Digital Payment Methods Quick Survey',
    },
    sponsor: 'Fintech Ecuador Digital',
    reward: 2.5,
    timeMinutes: 2,
    category: {
      es: 'Banca y Tecnología',
      en: 'Banking & Tech',
    },
    missionDescription: {
      es: 'Tu misión consiste en calificar la rapidez y comodidad de los pagos con código QR y transferencias inmediatas.',
      en: 'Your mission is to rate speed and ease of use for QR code payments and instant bank transfers.',
    },
    coordinates: { top: '50%', left: '68%' },
    question1: {
      es: '¿Cuál es tu método de pago preferido para compras diarias en tiendas físicas?',
      en: 'What is your preferred payment method for daily in-store purchases?',
    },
    options1: {
      es: [
        'DeUna / Transferencia directa Banco Pichincha',
        'Tarjeta de débito o crédito física',
        'Efectivo billetes y monedas',
        'Billeteras virtuales (Payphone / PeiGo)',
      ],
      en: [
        'DeUna / Instant Pichincha Bank transfer',
        'Physical debit or credit card',
        'Cash bills and coins',
        'Digital wallets (Payphone / PeiGo)',
      ],
    },
  },
];

// =========================================================================
// CASOS DE ESTUDIO DEMOSTRATIVOS PARA EL BI STUDIO EMPRESARIAL
// =========================================================================
const INDUSTRY_STUDIES = [
  {
    id: 'retail',
    tag: {
      es: 'Consumo Masivo & Retail',
      en: 'CPG & Retail Goods',
    },
    icon: Briefcase,
    title: {
      es: 'Estudio de Hábitos de Compra y Percepción de Marca 2026',
      en: 'Consumer Purchasing Habits & Brand Perception 2026',
    },
    sponsor: 'Corporación Retail Andina',
    sampleSize: '1,850 respuestas verificadas',
    sampleSizeEn: '1,850 verified responses',
    completionRate: '98.6%',
    avgTime: '3.2 min',
    insights: {
      es: [
        { label: 'Supermercados físicos', value: 58, color: 'bg-teal-500' },
        { label: 'Canales digitales / Apps', value: 27, color: 'bg-emerald-400' },
        { label: 'Tiendas de barrio', value: 15, color: 'bg-indigo-400' },
      ],
      en: [
        { label: 'Physical supermarkets', value: 58, color: 'bg-teal-500' },
        { label: 'Digital channels & Apps', value: 27, color: 'bg-emerald-400' },
        { label: 'Corner / neighborhood stores', value: 15, color: 'bg-indigo-400' },
      ],
    },
    npsScore: '+48 (Excelente / Excellent)',
    demographics: {
      pichincha: '38%',
      guayas: '36%',
      azuay: '14%',
      otras: '12%',
    },
    keyFinding: {
      es: 'El 72% de los consumidores en Quito y Guayaquil prioriza marcas locales con empaques ecológicos.',
      en: '72% of shoppers in Quito and Guayaquil prioritize local brands utilizing eco-friendly packaging.',
    },
  },
  {
    id: 'education',
    tag: {
      es: 'Sector Educativo (Colegios & Universidades)',
      en: 'Education (Schools & Universities)',
    },
    icon: School,
    title: {
      es: 'Auditoría de Clima Académico y Satisfacción Quimestre II',
      en: 'Academic Climate & Faculty Evaluation Audit Term II',
    },
    sponsor: 'Colegio y Unidad Educativa Benalcázar',
    sampleSize: '940 respuestas (Padres y Alumnos)',
    sampleSizeEn: '940 responses (Parents & Students)',
    completionRate: '99.1%',
    avgTime: '4.5 min',
    insights: {
      es: [
        { label: 'Calidad pedagógica alta', value: 64, color: 'bg-indigo-500' },
        { label: 'Satisfacción con plataformas', value: 24, color: 'bg-teal-400' },
        { label: 'Requiere soporte extracurricular', value: 12, color: 'bg-amber-400' },
      ],
      en: [
        { label: 'High pedagogical quality', value: 64, color: 'bg-indigo-500' },
        { label: 'Digital platform satisfaction', value: 24, color: 'bg-teal-400' },
        { label: 'Extracurricular support needed', value: 12, color: 'bg-amber-400' },
      ],
    },
    npsScore: '+56 (Liderazgo / Leader)',
    demographics: {
      pichincha: '85%',
      guayas: '8%',
      azuay: '4%',
      otras: '3%',
    },
    keyFinding: {
      es: 'La satisfacción de los padres subió 18 puntos al digitalizar reportes de rendimiento quimestral.',
      en: 'Parent satisfaction increased by 18 points after digitalizing academic term report cards.',
    },
  },
  {
    id: 'fintech',
    tag: {
      es: 'Banca & Medios de Pago',
      en: 'Banking & Payment Rails',
    },
    icon: Coins,
    title: {
      es: 'Penetración de Billeteras Digitales y Pagos QR en Ecuador',
      en: 'QR Payments & Digital Wallet Adoption in Ecuador',
    },
    sponsor: 'Fintech Ecuador Group',
    sampleSize: '2,400 usuarios bancarizados',
    sampleSizeEn: '2,400 banked consumers',
    completionRate: '97.8%',
    avgTime: '2.8 min',
    insights: {
      es: [
        { label: 'DeUna / Banco Pichincha', value: 52, color: 'bg-teal-500' },
        { label: 'Tarjetas Débito contactless', value: 31, color: 'bg-emerald-400' },
        { label: 'Efectivo billetes/monedas', value: 17, color: 'bg-slate-500' },
      ],
      en: [
        { label: 'DeUna / Pichincha Bank', value: 52, color: 'bg-teal-500' },
        { label: 'Contactless debit cards', value: 31, color: 'bg-emerald-400' },
        { label: 'Cash bills and coins', value: 17, color: 'bg-slate-500' },
      ],
    },
    npsScore: '+62 (Muy Alto / Very High)',
    demographics: {
      pichincha: '35%',
      guayas: '40%',
      azuay: '15%',
      otras: '10%',
    },
    keyFinding: {
      es: 'El 83% de los encuestados menores de 35 años prefiere pagar con QR en comercios locales.',
      en: '83% of respondents under 35 prefer paying via mobile QR code at neighborhood merchants.',
    },
  },
  {
    id: 'health',
    tag: {
      es: 'Salud & Cadenas Farmacéuticas',
      en: 'Health & Pharmacy Chains',
    },
    icon: ShieldCheck,
    title: {
      es: 'Evaluación de Experiencia y Disponibilidad en Cadenas de Farmacias',
      en: 'Customer Experience & Stock Availability in Pharmacy Retail',
    },
    sponsor: 'Grupo Salud Integral',
    sampleSize: '1,200 clientes urbanos',
    sampleSizeEn: '1,200 urban customers',
    completionRate: '98.2%',
    avgTime: '3.6 min',
    insights: {
      es: [
        { label: 'Disponibilidad de stock', value: 61, color: 'bg-emerald-500' },
        { label: 'Rapidez en caja y atención', value: 25, color: 'bg-teal-400' },
        { label: 'Descuentos con afiliados', value: 14, color: 'bg-indigo-400' },
      ],
      en: [
        { label: 'Inventory availability', value: 61, color: 'bg-emerald-500' },
        { label: 'Checkout speed & service', value: 25, color: 'bg-teal-400' },
        { label: 'Affiliate rewards & discounts', value: 14, color: 'bg-indigo-400' },
      ],
    },
    npsScore: '+41 (Favorable)',
    demographics: {
      pichincha: '36%',
      guayas: '34%',
      azuay: '18%',
      otras: '12%',
    },
    keyFinding: {
      es: 'El 65% valora la entrega a domicilio en menos de 45 minutos para medicamentos recurrentes.',
      en: '65% value under-45-minute home delivery for recurring prescription medications.',
    },
  },
];

export const LandingPage = () => {
  const { register } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Radar Map States
  const [selectedCity, setSelectedCity] = useState('Todos');
  const [activeMission, setActiveMission] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [step, setStep] = useState(1);

  // Form fields for instant claim
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  // BI Studio Tab State
  const [activeTabId, setActiveTabId] = useState('retail');
  const activeStudy = useMemo(
    () => INDUSTRY_STUDIES.find((s) => s.id === activeTabId) || INDUSTRY_STUDIES[0],
    [activeTabId]
  );

  // Simulator State
  const [simObjective, setSimObjective] = useState('mercado');
  const [simRegion, setSimRegion] = useState('nacional');
  const [simSampleSize, setSimSampleSize] = useState(500);

  // Filtered Opportunities
  const filteredOpportunities =
    selectedCity === 'Todos'
      ? OPPORTUNITIES
      : OPPORTUNITIES.filter((o) => o.city === selectedCity || o.city === 'Todo Ecuador');

  const totalRewardsAvailable = OPPORTUNITIES.reduce((acc, curr) => acc + curr.reward, 0);

  // Dynamic calculations for simulator
  const simMarginError = useMemo(() => {
    if (simSampleSize >= 2000) return '± 1.8%';
    if (simSampleSize >= 1000) return '± 2.5%';
    if (simSampleSize >= 500) return '± 3.8%';
    return '± 5.2%';
  }, [simSampleSize]);

  const simEstimatedHours = useMemo(() => {
    if (language === 'en') {
      if (simSampleSize >= 2000) return '24 to 36 hours';
      if (simSampleSize >= 1000) return '16 to 24 hours';
      if (simSampleSize >= 500) return '8 to 16 hours';
      return '4 to 8 hours';
    }
    if (simSampleSize >= 2000) return '24 a 36 horas';
    if (simSampleSize >= 1000) return '16 a 24 horas';
    if (simSampleSize >= 500) return '8 a 16 horas';
    return '4 a 8 horas';
  }, [simSampleSize, language]);

  // ==========================================
  // HANDLERS DEL FLUJO DE SEDUCCIÓN (EL INGE)
  // ==========================================
  const handleOpenMission = (opp) => {
    setActiveMission(opp);
    setSelectedAnswer(null);
    setStep(1);
    setError('');
  };

  const handleSelectOption = (opt) => {
    setSelectedAnswer(opt);
    setTimeout(() => {
      setStep(2);
    }, 450);
  };

  const handleClaimMoney = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError(language === 'en' ? 'Please fill in all fields.' : 'Por favor completa todos los campos.');
      return;
    }

    setClaimLoading(true);
    const res = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      role: 'doer',
      city: activeMission.city === 'Todo Ecuador' ? 'Quito' : activeMission.city,
      initialBalance: activeMission.reward,
    });
    setClaimLoading(false);

    if (res.success) {
      navigate('/doer/wallet');
    } else {
      setError(res.message || (language === 'en' ? 'Registration failed.' : 'Error registrando la cuenta.'));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white font-sans transition-colors duration-200 overflow-x-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1000px] h-[500px] bg-gradient-to-b from-teal-500/10 via-indigo-500/5 to-transparent rounded-full blur-[150px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP CORPORATE NAVIGATION BAR (WITH THEME & LANGUAGE SWITCHERS)         */}
      {/* ========================================================================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#070B14]/85 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-3 sm:px-8 py-3 flex items-center justify-between transition-all shadow-sm dark:shadow-none">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 p-0.5 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
                <span className="text-teal-400 font-black text-base sm:text-lg tracking-tighter">593</span>
              </div>
            </div>
            <div>
              <span className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight leading-none block">
                SURVEY <span className="text-teal-600 dark:text-teal-400">593</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase block mt-0.5">
                Market Intelligence · Ecuador
              </span>
            </div>
          </Link>

          {/* Nav Links Desktop */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#radar" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-bold flex items-center gap-1.5 transition-colors">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span>{t('nav.radar')}</span>
            </a>
            <a href="#soluciones" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.solutions')}</a>
            <a href="#demo" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.biStudio')}</a>
            <a href="#simulador" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.simulator')}</a>
            <a href="#seguridad" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.security')}</a>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="uppercase font-mono text-[11px]">{language === 'es' ? '🇪🇨 ES' : '🇺🇸 EN'}</span>
          </button>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Sign In Link */}
          <Link
            to="/login"
            className="hidden sm:inline-block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-2.5 py-1.5 transition-colors"
          >
            {t('nav.signIn')}
          </Link>

          {/* Enterprise Portal Button */}
          <Link to="/login">
            <Button
              variant="primary"
              className="py-1.5 sm:py-2 px-3 sm:px-4 text-xs font-bold shadow-md shadow-teal-500/20 flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t('nav.portalEnterprise')}</span>
              <span className="sm:hidden">{t('nav.enterpriseShort')}</span>
            </Button>
          </Link>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO: VALOR ESTRATÉGICO Y ENTRADA AL RADAR DE SEDUCCIÓN               */}
      {/* ========================================================================= */}
      <header className="pt-24 sm:pt-28 pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10 text-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-teal-700 dark:text-teal-300 text-[11px] sm:text-xs font-bold mb-4 shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-ping" />
          <span>{t('hero.categoryPill')}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-4">
          {t('hero.titleStart')}{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 dark:from-teal-400 dark:via-emerald-300 dark:to-teal-200">
            {t('hero.titleHighlight')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm lg:text-base max-w-3xl mx-auto leading-relaxed mb-6 font-normal">
          {t('hero.subtitle')}
        </p>

        {/* Quick Ticker of Available Rewards */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-6 shadow-xs">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>${totalRewardsAvailable.toFixed(2)} {t('hero.availableTickerEnd')}</span>
        </div>

        {/* Platform Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto pt-4 text-left">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{t('hero.stats.citizens')}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">{t('hero.stats.citizensDesc')}</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{t('hero.stats.delivery')}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">{t('hero.stats.deliveryDesc')}</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{t('hero.stats.provinces')}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">{t('hero.stats.provincesDesc')}</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-300 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{t('hero.stats.antifraud')}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">{t('hero.stats.antifraudDesc')}</p>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. EL RADAR DE SEDUCCIÓN (LA VISIÓN DEL INGE: CERO TRABAS, CLIC DIRECTO)   */}
      {/* ========================================================================= */}
      <section id="radar" className="py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* City Filter Pills */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 flex-wrap">
          {['Todos', 'Quito', 'Guayaquil', 'Cuenca', 'Todo Ecuador'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all ${
                selectedCity === city
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {city === 'Todos' ? t('radar.filters.all') : city === 'Todo Ecuador' ? t('radar.filters.online') : `📍 ${city}`}
            </button>
          ))}
        </div>

        {/* Radar and Missions Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Tactical Radar Screen (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0B1222] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 relative overflow-hidden shadow-sm dark:shadow-2xl flex flex-col justify-between">
            
            {/* Header of Radar */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {t('radar.headerTitle')}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-500/20">
                {filteredOpportunities.length} {t('radar.activePoints')}
              </div>
            </div>

            {/* Tactical Grid Visual with Map Silhouette & Target Rings */}
            <div className="relative z-10 my-3 h-[280px] sm:h-[350px] w-full bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
              
              {/* Tactical Radar Background Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
              
              {/* Concentric Orbital Radar Waves */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-80 sm:h-80 border border-teal-500/20 rounded-full pointer-events-none animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 sm:w-52 sm:h-52 border border-emerald-500/25 rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-teal-400/30 rounded-full pointer-events-none" />

              {/* Crosshair Tactical Axes */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-800/80 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-800/80 pointer-events-none" />

              {/* Province Coordinate Markers */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 pointer-events-none space-y-0.5">
                <span className="block font-bold text-teal-400">UIO 0°13'S 78°31'W</span>
                <span className="block text-slate-500">GYE 2°11'S 79°53'W</span>
                <span className="block text-slate-500">CUE 2°53'S 79°00'W</span>
              </div>

              {/* Dynamic Interactive Money Pins */}
              {filteredOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  style={{ top: opp.coordinates.top, left: opp.coordinates.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                  onClick={() => handleOpenMission(opp)}
                >
                  {/* Glowing Pulse Ring */}
                  <span className="absolute -inset-2 rounded-full bg-teal-400/30 animate-ping" />
                  
                  {/* Pin Bubble */}
                  <div className="relative flex items-center gap-1 bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full shadow-lg shadow-teal-500/30 border border-teal-200 hover:scale-115 transition-transform">
                    <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
                    <span>+{opp.reward.toFixed(2)}</span>
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 sm:w-52 p-2.5 rounded-xl bg-slate-950 border border-teal-500/40 shadow-xl text-center z-30 pointer-events-none animate-scale-in">
                    <p className="text-[11px] font-bold text-white leading-tight">{opp.title[language] || opp.title.es}</p>
                    <p className="text-[10px] text-teal-400 font-semibold mt-1">
                      {opp.locationName} · {opp.timeMinutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Ticker at Bottom */}
            <div className="relative z-10 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-slate-700 dark:text-slate-300">{t('radar.lastPayout')}</span>
                <span className="text-teal-600 dark:text-teal-400 font-semibold truncate">
                  David C. en Quito acreditó $15.00 a Banco Pichincha hace 4 min
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">{t('radar.verifiedBadge')}</span>
            </div>
          </div>

          {/* Opportunities List & Enterprise Callout (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{t('radar.feedTitle')}</span>
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{t('radar.touchHint')}</span>
            </div>

            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => handleOpenMission(opp)}
                className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group shadow-xs dark:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="truncate">{opp.locationName}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors line-clamp-1">
                      {opp.title[language] || opp.title.es}
                    </h3>
                    <div className="flex items-center gap-2.5 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {opp.timeMinutes} min
                      </span>
                      <span>•</span>
                      <span className="truncate">{opp.sponsor}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-black text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-500/30">
                      +${opp.reward.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium group-hover:text-teal-600 dark:group-hover:text-white transition-colors flex items-center justify-end gap-0.5">
                      <span>{t('radar.startBtn')}</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Enterprise Quick Callout Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-slate-50 to-indigo-500/10 dark:from-teal-500/15 dark:via-slate-900 dark:to-indigo-500/15 border border-teal-200 dark:border-teal-500/30 text-center space-y-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t('radar.enterpriseBoxTitle')}</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('radar.enterpriseBoxDesc')}
              </p>
              <Link to="/login" className="block pt-1">
                <Button size="sm" variant="primary" className="w-full text-xs font-bold shadow-sm">
                  {t('radar.enterpriseBoxBtn')}
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* POPUP / MODAL: LA MISIÓN DE SEDUCCIÓN (LA LÓGICA DEL INGE)                */}
      {/* ========================================================================= */}
      {activeMission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-teal-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative animate-scale-in my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveMission(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* PASO 1: RESPONDER 1 PREGUNTA GANCHO (CERO TRABAS) */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 mb-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{activeMission.locationName}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                  {activeMission.title[language] || activeMission.title.es}
                </h3>

                {/* Reward Banner */}
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 mb-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">{t('missionModal.rewardLabel')}</div>
                    <div className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400 flex items-center">
                      +${activeMission.reward.toFixed(2)} USD
                    </div>
                  </div>
                  <div className="border-l border-slate-200 dark:border-slate-800 pl-3.5 text-xs text-slate-600 dark:text-slate-300">
                    <p className="font-bold text-slate-900 dark:text-white">{activeMission.sponsor}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{activeMission.timeMinutes} min</p>
                  </div>
                </div>

                {/* Mission Instructions */}
                <div className="p-3 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 rounded-xl text-teal-800 dark:text-teal-200 text-xs mb-4 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">{t('missionModal.instructionsTitle')}</strong>
                  {activeMission.missionDescription[language] || activeMission.missionDescription.es}
                </div>

                {/* Question 1 */}
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
                    {t('missionModal.questionStep')}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2.5">
                    {activeMission.question1[language] || activeMission.question1.es}
                  </p>

                  <div className="space-y-2">
                    {(activeMission.options1[language] || activeMission.options1.es).map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-medium ${
                          selectedAnswer === opt
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/20 text-teal-900 dark:text-white font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className="inline-block w-5 font-bold text-teal-600 dark:text-teal-400">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                  {t('missionModal.instantReserveHint')}
                </p>
              </div>
            )}

            {/* PASO 2: EL REGISTRO DIRECTO PARA COBRAR */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/40 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white text-center mb-1">
                  {t('missionModal.step2Title')}
                </h3>
                <p className="text-xs text-center text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {t('missionModal.step2DescStart')}{' '}
                  <span className="font-extrabold text-teal-600 dark:text-teal-400 text-sm">
                    +${activeMission.reward.toFixed(2)} USD
                  </span>{' '}
                  {t('missionModal.step2DescEnd')}
                </p>

                {error && (
                  <div className="p-2.5 mb-3 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleClaimMoney} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('missionModal.nameLabel')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Daniel Morales"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('missionModal.emailLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('missionModal.passLabel')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('missionModal.passPlaceholder')}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={claimLoading}
                    className="w-full mt-2 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-black text-xs hover:opacity-90 shadow-md py-2.5"
                  >
                    {claimLoading ? (
                      t('missionModal.loadingBtn')
                    ) : (
                      `${t('missionModal.claimBtn')} $${activeMission.reward.toFixed(2)} ${t('missionModal.claimBtnEnd')}`
                    )}
                  </Button>
                </form>

                <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-3">
                  {t('missionModal.securityFooter')}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BUSINESS INTELLIGENCE STUDIO: DEMO EN VIVO PARA EMPRESAS Y COLEGIOS    */}
      {/* ========================================================================= */}
      <section id="demo" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-500/20 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t('biStudio.tag')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('biStudio.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2">
            {t('biStudio.subtitle')}
          </p>
        </div>

        {/* Industry Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {INDUSTRY_STUDIES.map((study) => {
            const Icon = study.icon;
            const isSelected = study.id === activeTabId;
            return (
              <button
                key={study.id}
                onClick={() => setActiveTabId(study.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-500 shadow-md scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{study.tag[language] || study.tag.es}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Dashboard Card Display */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm dark:shadow-2xl overflow-hidden backdrop-blur-xl relative">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
                  {activeStudy.tag[language] || activeStudy.tag.es}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('biStudio.clientLabel')} {activeStudy.sponsor}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {activeStudy.title[language] || activeStudy.title.es}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t('biStudio.sampleLabel')}</span>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                  {language === 'en' ? activeStudy.sampleSizeEn : activeStudy.sampleSize}
                </span>
              </div>
              <Link to="/login">
                <Button size="sm" variant="primary" className="text-xs font-bold">
                  {t('biStudio.launchSimilarBtn')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-start">
            
            {/* Primary Distribution Bars (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{t('biStudio.distributionTitle')}</span>
                </h4>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {activeStudy.completionRate} {t('biStudio.completionLabel')}
                </span>
              </div>

              <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                {(activeStudy.insights[language] || activeStudy.insights.es).map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                      <span className="text-slate-900 dark:text-white font-bold">{item.value}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/25 text-teal-900 dark:text-teal-200 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white font-bold block mb-0.5">{t('biStudio.keyFindingTitle')}</strong>
                  <span>{activeStudy.keyFinding[language] || activeStudy.keyFinding.es}</span>
                </div>
              </div>
            </div>

            {/* Demographic Breakdown & NPS (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{t('biStudio.coverageTitle')}</span>
              </h4>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="grid grid-cols-2 gap-2.5 text-center">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Pichincha</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white block">{activeStudy.demographics.pichincha}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Guayas</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white block">{activeStudy.demographics.guayas}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Azuay</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white block">{activeStudy.demographics.azuay}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Otras 21</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white block">{activeStudy.demographics.otras}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">{t('biStudio.npsLabel')}</span>
                    <span className="text-xs font-black text-teal-700 dark:text-teal-400">{activeStudy.npsScore}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">{t('biStudio.avgTimeLabel')}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{activeStudy.avgTime}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SIMULADOR DE ESTUDIO INTERACTIVO (CALCULADORA DE MUESTRA)              */}
      {/* ========================================================================= */}
      <section id="simulador" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-[#0C1425] dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-500/20">
              <Sliders className="w-3.5 h-3.5" />
              <span>{t('simulator.tag')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {t('simulator.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              {t('simulator.subtitle')}
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{t('simulator.check1')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{t('simulator.check2')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{t('simulator.check3')}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t('simulator.step1Title')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'mercado', label: t('simulator.objectives.mercado') },
                  { id: 'producto', label: t('simulator.objectives.producto') },
                  { id: 'educacion', label: t('simulator.objectives.educacion') },
                  { id: 'nps', label: t('simulator.objectives.nps') },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSimObjective(item.id)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all border text-left ${
                      simObjective === item.id
                        ? 'bg-teal-600 text-white border-teal-600 font-bold'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('simulator.step2Title')}
              </label>
              <select
                value={simRegion}
                onChange={(e) => setSimRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
              >
                <option value="nacional">{t('simulator.regions.nacional')}</option>
                <option value="quito">{t('simulator.regions.quito')}</option>
                <option value="guayaquil">{t('simulator.regions.guayaquil')}</option>
                <option value="cuenca">{t('simulator.regions.cuenca')}</option>
                <option value="central">{t('simulator.regions.central')}</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">{t('simulator.step3Title')}</label>
                <span className="text-teal-600 dark:text-teal-400 font-black text-sm">{simSampleSize} {t('simulator.respondents')}</span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="100"
                value={simSampleSize}
                onChange={(e) => setSimSampleSize(Number(e.target.value))}
                className="w-full accent-teal-600 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>100</span>
                <span>500</span>
                <span>1,000</span>
                <span>2,500+</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('simulator.errorMarginLabel')}</span>
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block">{simMarginError}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('simulator.deliveryTimeLabel')}</span>
                <span className="text-sm sm:text-base font-black text-teal-600 dark:text-teal-400 block">{simEstimatedHours}</span>
              </div>
            </div>

            <Link to="/login" className="block">
              <Button variant="primary" className="w-full py-2.5 font-bold text-xs shadow-sm">
                {t('simulator.ctaBtn')}
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SOLUCIONES POR INDUSTRIA & LÓGICA DE MERCADO                           */}
      {/* ========================================================================= */}
      <section id="soluciones" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-500/20 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>{t('solutions.tag')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('solutions.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2">
            {t('solutions.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all group flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {t('solutions.retail.title')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {t('solutions.retail.desc')}
              </p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{t('solutions.retail.b1')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{t('solutions.retail.b2')}</span>
              </li>
            </ul>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {t('solutions.education.title')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {t('solutions.education.desc')}
              </p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>{t('solutions.education.b1')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>{t('solutions.education.b2')}</span>
              </li>
            </ul>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all group flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {t('solutions.fintech.title')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {t('solutions.fintech.desc')}
              </p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('solutions.fintech.b1')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('solutions.fintech.b2')}</span>
              </li>
            </ul>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all group flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {t('solutions.agency.title')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {t('solutions.agency.desc')}
              </p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{t('solutions.agency.b1')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{t('solutions.agency.b2')}</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SEGURIDAD & CUMPLIMIENTO                                               */}
      {/* ========================================================================= */}
      <section id="seguridad" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <ShieldCheck className="w-9 h-9 text-teal-600 dark:text-teal-400 mx-auto mb-2.5" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('security.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1.5">
            {t('security.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 text-left">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
            <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2.5" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">{t('security.c1Title')}</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('security.c1Desc')}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2.5" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">{t('security.c2Title')}</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('security.c2Desc')}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2.5" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">{t('security.c3Title')}</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('security.c3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BANNER FINAL CTA                                                       */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="p-7 sm:p-12 rounded-3xl bg-gradient-to-tr from-teal-900/80 via-slate-900 to-indigo-950/80 border border-teal-500/30 text-center relative overflow-hidden shadow-xl text-white">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3 max-w-3xl mx-auto">
            {t('ctaBanner.title')}
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm max-w-2xl mx-auto mb-6">
            {t('ctaBanner.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto py-3 px-7 text-xs font-black shadow-lg">
                {t('ctaBanner.createBtn')}
              </Button>
            </Link>

            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition-all">
                {t('ctaBanner.loginBtn')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER CORPORATIVO                                                     */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-8 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center font-black text-white text-xs">
                593
              </div>
              <span className="font-black text-slate-900 dark:text-white text-sm">SURVEY 593</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-2.5">{t('footer.platformTitle')}</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#soluciones" className="hover:text-teal-600 dark:hover:text-white transition-colors">Retail</a></li>
              <li><a href="#soluciones" className="hover:text-teal-600 dark:hover:text-white transition-colors">Education</a></li>
              <li><a href="#demo" className="hover:text-teal-600 dark:hover:text-white transition-colors">BI Studio</a></li>
              <li><a href="#simulador" className="hover:text-teal-600 dark:hover:text-white transition-colors">{t('nav.simulator')}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-2.5">{t('footer.territoryTitle')}</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><span>Pichincha / Quito</span></li>
              <li><span>Guayas / Guayaquil</span></li>
              <li><span>Azuay / Cuenca</span></li>
              <li><span>24 Provincias</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-2.5">{t('footer.complianceTitle')}</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/login" className="hover:text-teal-600 dark:hover:text-white transition-colors">{t('nav.portalEnterprise')}</Link></li>
              <li><Link to="/login" className="hover:text-teal-600 dark:hover:text-white transition-colors">{t('auth.roleDoer')}</Link></li>
              <li><span>SSL 256-bit</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
          <div className="flex items-center gap-3">
            <span>{t('footer.madeFor')}</span>
            <span>•</span>
            <span>v2.5 Enterprise</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
