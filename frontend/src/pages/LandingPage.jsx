import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import {
  MapPin,
  DollarSign,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  Compass,
  TrendingUp,
  ChevronRight,
  Gift,
  X,
  Lock,
  Mail,
  User,
  Zap,
} from 'lucide-react';

// Oportunidades reales con geolocalización en Ecuador
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
    coordinates: { top: '38%', left: '46%' },
    question1: '¿En cuál de estos lugares compraste ropa o calzado en los últimos 3 meses?',
    options1: [
      'C.C. El Jardín o CCI (Norte)',
      'Quicentro Shopping / Mall El Jardín',
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
    coordinates: { top: '32%', left: '50%' },
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
    coordinates: { top: '65%', left: '35%' },
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
    coordinates: { top: '78%', left: '48%' },
    question1: '¿Qué factor consideras más importante al elegir una cafetería para pasar la tarde?',
    options1: [
      'Calidad del café de especialidad',
      'Buen internet y ambiente tranquilo para trabajar',
      'Precios accesibles y promociones',
      'Variedad de postres y snacks tradicionales',
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
    coordinates: { top: '50%', left: '72%' },
    question1: '¿Cuál es tu método de pago preferido para compras diarias en tiendas físicas?',
    options1: [
      'DeUna / Transferencia directa Banco Pichincha',
      'Tarjeta de débito o crédito física',
      'Efectivo billetes y monedas',
      'Billeteras virtuales (Payphone / PeiGo)',
    ],
  },
];

export const LandingPage = () => {
  const [selectedCity, setSelectedCity] = useState('Todos');
  const [activeMission, setActiveMission] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [step, setStep] = useState(1); // 1: responder pregunta gancho, 2: registro para cobrar

  // Form fields for instant claim
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const filteredOpportunities =
    selectedCity === 'Todos'
      ? OPPORTUNITIES
      : OPPORTUNITIES.filter((o) => o.city === selectedCity || o.city === 'Todo Ecuador');

  const totalRewardsAvailable = OPPORTUNITIES.reduce((acc, curr) => acc + curr.reward, 0);

  const handleOpenMission = (opp) => {
    setActiveMission(opp);
    setSelectedAnswer(null);
    setStep(1);
    setError('');
  };

  const handleSelectOption = (opt) => {
    setSelectedAnswer(opt);
    // Smooth transition to step 2 after selecting the hook answer
    setTimeout(() => {
      setStep(2);
    }, 450);
  };

  const handleClaimMoney = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Por favor ingresa todos los campos para acreditar tu saldo.');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      password,
      role: 'doer',
      city: activeMission.city === 'Todo Ecuador' ? 'Quito' : activeMission.city,
      initialBalance: activeMission.reward,
    });
    setLoading(false);

    if (res.success) {
      // Direct redirect to their wallet with the money in it!
      navigate('/doer/wallet');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1121] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0B1121]/90 backdrop-blur-md border-b border-slate-800/80 px-6 md:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-stitch bg-gradient-to-br from-emerald-400 via-primary to-secondary flex items-center justify-center font-black text-white text-lg shadow-glow-sm">
            S5
          </div>
          <div>
            <span className="font-black text-lg text-white tracking-tight">Survey 593</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              En Vivo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 rounded-stitch border border-slate-700 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-primary-light" />
            <span>Soy Empresa (BI Studio)</span>
          </Link>
          <Link to="/login">
            <Button size="sm" variant="primary">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Seductive Hero with Live Money Map */}
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Top Urgency / Value Banner */}
        <div className="text-center max-w-3xl mx-auto mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold mb-4 shadow-glow-sm">
            <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
            <span>${totalRewardsAvailable.toFixed(2)} USD disponibles ahora mismo en recompensas directas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
            Gana dinero hoy.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-primary-light bg-clip-text text-transparent">
              Sin formularios aburridos.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Las mejores marcas de Ecuador pagan por saber qué piensas. Haz clic en cualquier punto de dinero en el mapa,
            responde 3 preguntas y <strong>recibe tu saldo en tu cuenta bancaria o DeUna</strong>.
          </p>
        </div>

        {/* City Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {['Todos', 'Quito', 'Guayaquil', 'Cuenca', 'Todo Ecuador'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCity === city
                  ? 'bg-emerald-500 text-slate-950 shadow-glow-sm scale-105'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {city === 'Todos' ? '🗺️ Todo el Mapa' : city === 'Todo Ecuador' ? '⚡ Desde Casa (Online)' : `📍 ${city}`}
            </button>
          ))}
        </div>

        {/* The Interactive Radar & Opportunities Canvas */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Visual Interactive Map (7 Cols) */}
          <div className="lg:col-span-7 bg-[#111C33] border border-slate-700/80 rounded-stitch-xl p-5 relative overflow-hidden shadow-2xl min-h-[480px] flex flex-col justify-between">
            {/* Background Map Grid & Radar Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-emerald-500/10 rounded-full pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 border border-primary/20 rounded-full pointer-events-none" />

            {/* Header of Map */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Radar en Tiempo Real · Ecuador
                </span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {filteredOpportunities.length} misiones activas
              </div>
            </div>

            {/* Map Canvas with Floating Pulsing Money Pins */}
            <div className="relative z-10 my-4 h-[350px] w-full bg-slate-950/60 rounded-stitch-lg border border-slate-800/80 overflow-hidden flex items-center justify-center">
              {/* Silhouette outline hint */}
              <div className="text-slate-800 text-[90px] font-black select-none pointer-events-none tracking-widest opacity-20">
                ECUADOR
              </div>

              {/* Dynamic Money Pins */}
              {filteredOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  style={{ top: opp.coordinates.top, left: opp.coordinates.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  onClick={() => handleOpenMission(opp)}
                >
                  {/* Glowing Radar Waves */}
                  <span className="absolute -inset-2 rounded-full bg-emerald-400/20 animate-ping" />
                  
                  {/* Pin Bubble */}
                  <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 border border-emerald-300 hover:scale-115 transition-transform duration-200">
                    <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
                    <span>+{opp.reward.toFixed(2)}</span>
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded-stitch bg-[#0F172A] border border-emerald-500/40 shadow-xl text-center z-30 pointer-events-none animate-scale-in">
                    <p className="text-[11px] font-bold text-white leading-tight">{opp.title}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-1">
                      {opp.locationName} · {opp.timeMinutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Payout Ticker at Bottom */}
            <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-slate-300">Último cobro:</span>
                <span className="text-emerald-400 font-semibold truncate">
                  David C. en Quito retiró $15.00 a Banco Pichincha hace 3 min
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">100% Verificado</span>
            </div>
          </div>

          {/* Opportunities List & Fast Action Feed (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Haz clic en una para ganar de una</span>
              </h2>
              <span className="text-xs text-slate-400">Toca para abrir</span>
            </div>

            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => handleOpenMission(opp)}
                className="p-4 rounded-stitch-lg bg-[#182238] hover:bg-[#1E2D4A] border border-slate-700/60 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-md hover:shadow-emerald-500/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-primary-light flex-shrink-0" />
                      <span className="truncate">{opp.locationName}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
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
                    <div className="text-base font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-stitch border border-emerald-500/30">
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

            {/* Banner for Business Owners / Employers */}
            <div className="p-4 rounded-stitch-lg bg-gradient-to-br from-primary/15 via-slate-900 to-secondary/15 border border-primary/30 mt-4 text-center">
              <p className="text-xs font-bold text-white mb-1">¿Tienes un negocio o necesitas hacer un estudio?</p>
              <p className="text-[11px] text-slate-300 mb-3">
                Lanza tu encuesta en este mapa y obtén respuestas de clientes reales en 24 horas.
              </p>
              <Link to="/login">
                <Button size="sm" variant="secondary" className="w-full text-xs">
                  Publicar Campaña en Survey 593 🚀
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* POPUP / MODAL: LA MISIÓN DE SEDUCCIÓN (El Gancho Interactivo) */}
      {activeMission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#182238] border border-emerald-500/40 rounded-stitch-xl p-6 sm:p-8 shadow-2xl relative animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setActiveMission(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-stitch hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: El Gancho (Responder 1 sola pregunta interactiva) */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{activeMission.locationName}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{activeMission.title}</h3>

                <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-stitch-lg border border-slate-800 mb-6">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Recompensa al completar</div>
                    <div className="text-2xl font-black text-emerald-400 flex items-center">
                      +${activeMission.reward.toFixed(2)} USD
                    </div>
                  </div>
                  <div className="border-l border-slate-700 pl-4 text-xs text-slate-300">
                    <p className="font-semibold">{activeMission.sponsor}</p>
                    <p className="text-[11px] text-slate-400">Tiempo estimado: {activeMission.timeMinutes} minutos</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-light mb-2">
                    Pregunta 1 de 4 (Toca tu respuesta para comenzar):
                  </p>
                  <p className="text-sm font-semibold text-white mb-3">{activeMission.question1}</p>

                  <div className="space-y-2">
                    {activeMission.options1.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left p-3.5 rounded-stitch border transition-all text-xs font-medium ${
                          selectedAnswer === opt
                            ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold shadow-glow-sm'
                            : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        <span className="inline-block w-5 font-bold text-emerald-400">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-center text-slate-400 mt-4">
                  ⚡ Tu dinero se reserva de inmediato al presionar una opción.
                </p>
              </div>
            )}

            {/* STEP 2: El Registro en el Momento Justo (Seducción Inversa) */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-black text-white text-center mb-1">
                  ¡Excelente! Tu primera respuesta fue guardada
                </h3>
                <p className="text-xs text-center text-slate-300 mb-5">
                  Tus <span className="font-extrabold text-emerald-400 text-sm">+${activeMission.reward.toFixed(2)} USD</span> están
                  reservados. ¿A qué correo te acreditamos tu dinero?
                </p>

                {error && (
                  <div className="p-3 mb-4 rounded-stitch bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleClaimMoney} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tu Nombre Completo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Daniel Morales"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Correo Electrónico (para tu Billetera)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Crea tu Contraseña</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-stitch bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:opacity-90 shadow-lg shadow-emerald-500/20"
                  >
                    {loading ? (
                      'Acreditando tus fondos...'
                    ) : (
                      `Reclamar mis $${activeMission.reward.toFixed(2)} USD y Ver Billetera 🚀`
                    )}
                  </Button>
                </form>

                <p className="text-[10px] text-center text-slate-400 mt-4">
                  🔒 Cero spam. Tu saldo queda registrado en tu billetera con retiro disponible a cuentas bancarias locales.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trust & Quality Highlights */}
      <section className="py-12 px-6 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-stitch-lg bg-slate-800/40 border border-slate-700/60">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold text-white text-sm mb-1">Sin Fraudes ni Bots</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verificamos cada respuesta y cada retiro con cédula ecuatoriana (KYC) para asegurar datos legítimos.
            </p>
          </div>

          <div className="p-6 rounded-stitch-lg bg-slate-800/40 border border-slate-700/60">
            <DollarSign className="w-8 h-8 text-primary-light mx-auto mb-3" />
            <h3 className="font-bold text-white text-sm mb-1">Cobro Directo a Bancos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Retira tus ganancias acumuladas hacia Banco Pichincha, Guayaquil, Produbanco o DeUna.
            </p>
          </div>

          <div className="p-6 rounded-stitch-lg bg-slate-800/40 border border-slate-700/60">
            <TrendingUp className="w-8 h-8 text-secondary-light mx-auto mb-3" />
            <h3 className="font-bold text-white text-sm mb-1">No-Code BI Studio para Empresas</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Las empresas diseñan sus tableros arrastrando gráficos de radar, pastel y barras en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 Survey 593 · Ecosistema Kolab · Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};
