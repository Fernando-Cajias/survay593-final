import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
} from 'lucide-react';

// =========================================================================
// OPORTUNIDADES REALES GEOLOCALIZADAS EN ECUADOR (EL RADAR DE SEDUCCIÓN)
// =========================================================================
const OPPORTUNITIES = [
  {
    id: 'opp_1',
    city: 'Quito',
    locationName: 'C.C. El Jardín / Av. Amazonas',
    title: 'Auditoría de Marcas de Ropa y Experiencia',
    sponsor: 'Textil Andina S.A.',
    reward: 5.0,
    timeMinutes: 3,
    category: 'Moda y Retail',
    missionDescription: 'Tu misión consiste en evaluar la experiencia de compra en tiendas de moda en el norte de Quito y responder 3 preguntas breves.',
    coordinates: { top: '38%', left: '46%' },
    question1: '¿En cuál de estos centros comerciales compraste ropa o calzado en los últimos 3 meses?',
    options1: [
      'C.C. El Jardín o CCI (Norte)',
      'Quicentro Shopping / La Carolina',
      'Tiendas independientes / Locales de barrio',
      'Por internet / Instagram / WhatsApp',
    ],
  },
  {
    id: 'opp_2',
    city: 'Quito',
    locationName: 'Quicentro Shopping / La Carolina',
    title: 'Preferencia de Calzado Deportivo Juvenil',
    sponsor: 'Calzado Ecuatoriano C.A.',
    reward: 3.5,
    timeMinutes: 2,
    category: 'Deportes y Estilo',
    missionDescription: 'Tu misión consiste en compartir tus preferencias de precio y marcas en calzado urbano deportivo.',
    coordinates: { top: '30%', left: '52%' },
    question1: '¿Cuánto sueles gastar en promedio en un par de zapatillas deportivas?',
    options1: [
      'Menos de $40 USD',
      'Entre $40 y $75 USD',
      'Entre $75 y $120 USD',
      'Más de $120 USD',
    ],
  },
  {
    id: 'opp_3',
    city: 'Guayaquil',
    locationName: 'Mall del Sol / Av. Joaquín Orrantia',
    title: 'Estudio de Consumo en Restaurantes y Cafés',
    sponsor: 'Grupo Gastronómico Guayas',
    reward: 10.0,
    timeMinutes: 4,
    category: 'Alimentos y Bebidas',
    missionDescription: 'Tu misión consiste en responder sobre hábitos de comida familiar y consumo en patios de comidas en Guayaquil.',
    coordinates: { top: '64%', left: '36%' },
    question1: '¿Con qué frecuencia sales a comer en centros comerciales con tu familia?',
    options1: [
      '1 a 2 veces por semana',
      'Fines de semana exclusivamente',
      '1 a 2 veces al mes',
      'Rara vez o solo ocasiones especiales',
    ],
  },
  {
    id: 'opp_4',
    city: 'Cuenca',
    locationName: 'Centro Histórico / Parque Calderón',
    title: 'Evaluación de Servicios Cafeteros y Postres',
    sponsor: 'Café Austral Cuencano',
    reward: 4.0,
    timeMinutes: 3,
    category: 'Gastronomía Local',
    missionDescription: 'Tu misión consiste en calificar el ambiente, conectividad wifi y calidad del café en cafeterías tradicionales.',
    coordinates: { top: '76%', left: '48%' },
    question1: '¿Qué factor consideras más importante al elegir una cafetería para pasar la tarde?',
    options1: [
      'Calidad del café de especialidad',
      'Buen internet y ambiente tranquilo para trabajar',
      'Precios accesibles y promociones',
      'Variedad de postres y pastelería tradicional',
    ],
  },
  {
    id: 'opp_5',
    city: 'Todo Ecuador',
    locationName: 'Online · Desde tu celular en casa',
    title: 'Encuesta Rápida de Métodos de Pago Digitales',
    sponsor: 'Fintech Ecuador Digital',
    reward: 2.5,
    timeMinutes: 2,
    category: 'Banca y Tecnología',
    missionDescription: 'Tu misión consiste en calificar la rapidez y comodidad de los pagos con código QR y transferencias inmediatas.',
    coordinates: { top: '50%', left: '68%' },
    question1: '¿Cuál es tu método de pago preferido para compras diarias en tiendas físicas?',
    options1: [
      'DeUna / Transferencia directa Banco Pichincha',
      'Tarjeta de débito o crédito física',
      'Efectivo billetes y monedas',
      'Billeteras virtuales (Payphone / PeiGo)',
    ],
  },
];

// =========================================================================
// CASOS DE ESTUDIO DEMOSTRATIVOS PARA EL BI STUDIO EMPRESARIAL
// =========================================================================
const INDUSTRY_STUDIES = [
  {
    id: 'retail',
    tag: 'Consumo Masivo & Retail',
    icon: Briefcase,
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
    tag: 'Sector Educativo (Colegios & Universidades)',
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
    tag: 'Salud & Cadenas Farmacéuticas',
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

export const LandingPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Radar Map States
  const [selectedCity, setSelectedCity] = useState('Todos');
  const [activeMission, setActiveMission] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [step, setStep] = useState(1); // 1: responder pregunta gancho, 2: registro sin fricción

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

  // Filtered Opportunities on the Radar
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
    if (simSampleSize >= 2000) return '24 a 36 horas';
    if (simSampleSize >= 1000) return '16 a 24 horas';
    if (simSampleSize >= 500) return '8 a 16 horas';
    return '4 a 8 horas';
  }, [simSampleSize]);

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
    // Transición suave al paso 2: la respuesta ya está capturada, cero fricción inicial
    setTimeout(() => {
      setStep(2);
    }, 450);
  };

  const handleClaimMoney = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Por favor ingresa todos los campos para transferir tus fondos a tu billetera.');
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
      setError(res.message || 'Error registrando la cuenta.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-teal-500/10 via-indigo-500/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[900px] -right-40 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-[140px] pointer-events-none" />

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
            <a href="#radar" className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1.5 transition-colors">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>Radar en Vivo</span>
            </a>
            <a href="#soluciones" className="hover:text-white transition-colors">Soluciones B2B</a>
            <a href="#demo" className="hover:text-white transition-colors">BI Studio</a>
            <a href="#simulador" className="hover:text-white transition-colors">Simulador</a>
            <a href="#ecosistema" className="hover:text-white transition-colors">Ecosistema</a>
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
      {/* 2. HERO: VALOR ESTRATÉGICO Y ENTRADA AL RADAR DE SEDUCCIÓN               */}
      {/* ========================================================================= */}
      <header className="pt-28 pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10 text-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-teal-300 text-xs font-bold mb-4 shadow-sm animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping" />
          <span>Ecosistema de Investigación Georreferenciada · Ecuador</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] max-w-4xl mx-auto mb-4">
          Decisiones Estratégicas Basadas en la{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
            Opinión Real del Mercado Ecuatoriano
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-xs sm:text-sm lg:text-base max-w-3xl mx-auto leading-relaxed mb-6 font-normal">
          Empresas y colegios publican misiones y estudios representativos en el mapa; miles de ciudadanos verificados responden en tiempo real recibiendo compensaciones directas.
        </p>

        {/* Quick Ticker of Available Rewards */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold mb-6 shadow-glow-sm">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>${totalRewardsAvailable.toFixed(2)} USD disponibles ahora mismo en misiones y estudios activos</span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. EL RADAR DE SEDUCCIÓN (LA VISIÓN DEL INGE: CERO TRABAS, CLIC DIRECTO)   */}
      {/* ========================================================================= */}
      <section id="radar" className="pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* City Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {['Todos', 'Quito', 'Guayaquil', 'Cuenca', 'Todo Ecuador'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCity === city
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30 scale-105 font-black'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {city === 'Todos' ? '🗺️ Todo el Mapa' : city === 'Todo Ecuador' ? '⚡ Desde Casa (Online)' : `📍 ${city}`}
            </button>
          ))}
        </div>

        {/* Radar and Missions Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Visual Interactive Radar (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0B1222] border border-slate-700/80 rounded-3xl p-5 relative overflow-hidden shadow-2xl min-h-[490px] flex flex-col justify-between">
            {/* Background Grid and Radar Waves */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-teal-500/15 rounded-full pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 border border-emerald-500/20 rounded-full pointer-events-none" />

            {/* Header of Radar */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Radar en Tiempo Real · Misiones en Ecuador
                </span>
              </div>
              <div className="text-[11px] font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                {filteredOpportunities.length} puntos activos en mapa
              </div>
            </div>

            {/* Map Canvas with Floating Pulsing Money Pins */}
            <div className="relative z-10 my-4 h-[350px] w-full bg-slate-950/70 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
              {/* Country Silhouette Watermark */}
              <div className="text-slate-800/70 text-[85px] font-black select-none pointer-events-none tracking-widest opacity-25">
                ECUADOR
              </div>

              {/* Dynamic Interactive Money Pins */}
              {filteredOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  style={{ top: opp.coordinates.top, left: opp.coordinates.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                  onClick={() => handleOpenMission(opp)}
                >
                  {/* Glowing Radar Waves */}
                  <span className="absolute -inset-2 rounded-full bg-teal-400/25 animate-ping" />
                  
                  {/* Pin Bubble */}
                  <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-xl shadow-teal-500/30 border border-teal-200 hover:scale-115 transition-transform duration-200">
                    <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
                    <span>+{opp.reward.toFixed(2)}</span>
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-2.5 rounded-xl bg-[#0F172A] border border-teal-500/40 shadow-2xl text-center z-30 pointer-events-none animate-scale-in">
                    <p className="text-[11px] font-bold text-white leading-tight">{opp.title}</p>
                    <p className="text-[10px] text-teal-400 font-semibold mt-1">
                      {opp.locationName} · {opp.timeMinutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Ticker at Bottom */}
            <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-slate-300">Última acreditación:</span>
                <span className="text-teal-400 font-semibold truncate">
                  David C. en Quito acreditó $15.00 a Banco Pichincha hace 4 min
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">100% Verificado</span>
            </div>
          </div>

          {/* Opportunities List & Enterprise Callout (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" />
                <span>Haz clic para explorar y participar de una</span>
              </h2>
              <span className="text-[11px] text-slate-400">Toca para abrir</span>
            </div>

            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => handleOpenMission(opp)}
                className="p-4 rounded-2xl bg-[#0F172A] hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group shadow-md hover:shadow-teal-500/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                      <span className="truncate">{opp.locationName}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {opp.timeMinutes} min
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">{opp.sponsor}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/30">
                      +${opp.reward.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium group-hover:text-white transition-colors flex items-center justify-end gap-0.5">
                      <span>Iniciar</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Banner for Business / Institution Owners */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-500/15 via-slate-900 to-indigo-500/15 border border-teal-500/30 mt-4 text-center space-y-2">
              <p className="text-xs font-bold text-white">¿Tienes un negocio, colegio o empresa?</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Lanza tu estudio o encuesta geolocalizada en este mapa y obtén respuestas de clientes reales en 24 horas.
              </p>
              <Link to="/login" className="block pt-1">
                <Button size="sm" variant="primary" className="w-full text-xs font-bold shadow-lg shadow-teal-500/20">
                  Publicar Estudio Empresarial en Survey 593 🚀
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0F172A] border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-scale-in my-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveMission(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* PASO 1: LA SEDUCCIÓN (CERO TRABAS, RESPONDER 1 SOLA PREGUNTA GANCHO) */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-teal-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{activeMission.locationName}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                  {activeMission.title}
                </h3>

                {/* Reward Banner */}
                <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-5">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Recompensa al completar</div>
                    <div className="text-2xl font-black text-teal-400 flex items-center">
                      +${activeMission.reward.toFixed(2)} USD
                    </div>
                  </div>
                  <div className="border-l border-slate-800 pl-4 text-xs text-slate-300">
                    <p className="font-bold text-white">{activeMission.sponsor}</p>
                    <p className="text-[11px] text-slate-400">Tiempo estimado: {activeMission.timeMinutes} minutos</p>
                  </div>
                </div>

                {/* The Inge's explanation */}
                <div className="p-3.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-200 text-xs mb-5 leading-relaxed">
                  <strong className="text-white block mb-0.5">Instrucciones de la Misión:</strong>
                  {activeMission.missionDescription}
                </div>

                {/* The First Question */}
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
                    Pregunta 1 de 3 (Toca tu respuesta para comenzar):
                  </p>
                  <p className="text-sm font-semibold text-white mb-3">{activeMission.question1}</p>

                  <div className="space-y-2">
                    {activeMission.options1.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-medium ${
                          selectedAnswer === opt
                            ? 'border-teal-400 bg-teal-500/20 text-white font-bold shadow-glow-sm'
                            : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
                        }`}
                      >
                        <span className="inline-block w-5 font-bold text-teal-400">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-center text-slate-400 mt-4">
                  ⚡ Tu saldo se reserva inmediatamente al presionar una opción.
                </p>
              </div>
            )}

            {/* PASO 2: EL REGISTRO EN EL MOMENTO JUSTO (CUANDO YA SE INTERESÓ) */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-black text-white text-center mb-1">
                  ¡Excelente! Tu primera respuesta fue guardada
                </h3>
                <p className="text-xs text-center text-slate-300 mb-5 leading-relaxed">
                  Tus <span className="font-extrabold text-teal-400 text-sm">+${activeMission.reward.toFixed(2)} USD</span> están
                  reservados. ¿A qué correo te acreditamos tus fondos?
                </p>

                {error && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleClaimMoney} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tu Nombre Completo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Daniel Morales"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Correo Electrónico (para tu Billetera)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Crea tu Contraseña</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={claimLoading}
                    className="w-full mt-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-black text-xs hover:opacity-90 shadow-lg shadow-teal-500/20 py-2.5"
                  >
                    {claimLoading ? (
                      'Acreditando tus fondos...'
                    ) : (
                      `Reclamar mis $${activeMission.reward.toFixed(2)} USD y Ver Billetera 🚀`
                    )}
                  </Button>
                </form>

                <p className="text-[10px] text-center text-slate-400 mt-4">
                  🔒 Retiro disponible hacia Banco Pichincha, Guayaquil, Produbanco o DeUna.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BUSINESS INTELLIGENCE STUDIO: DEMO EN VIVO PARA EMPRESAS Y COLEGIOS    */}
      {/* ========================================================================= */}
      <section id="demo" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Survey 593 Business Intelligence Studio</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Analítica que Transforma Respuestas en Rentabilidad
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Selecciona un sector económico y descubre cómo las organizaciones líderes monitorean el pulso del mercado ecuatoriano.
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
                <Button size="sm" variant="primary" className="text-xs font-bold shadow-lg shadow-teal-500/20">
                  Lanzar Estudio Similar 🚀
                </Button>
              </Link>
            </div>
          </div>

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
      {/* 5. SIMULADOR DE ESTUDIO INTERACTIVO (CALCULADORA DE MUESTRA)              */}
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

          <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-6">
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

            <Link to="/login" className="block">
              <Button variant="primary" className="w-full py-3 font-bold text-xs shadow-lg shadow-teal-500/20">
                Iniciar Campaña con esta Muestra 🚀
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SOLUCIONES POR INDUSTRIA & LÓGICA DE MERCADO                           */}
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
            Survey 593 no es un formulario genérico. Es una infraestructura integral adaptada a la dinámica comercial, educativa y regulatoria de nuestro país.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
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
      {/* 7. SEGURIDAD & CUMPLIMIENTO                                               */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
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
            Crea tu cuenta empresarial en 1 minuto. Publica tu primer estudio geolocalizado o solicita una demostración guiada para tu organización.
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
