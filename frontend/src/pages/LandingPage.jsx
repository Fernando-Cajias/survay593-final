import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShieldCheck, DollarSign, BarChart3, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0B1121] text-slate-100 flex flex-col justify-between">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0B1121]/80 backdrop-blur-md border-b border-slate-800/80 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-stitch bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-base shadow-glow-sm">
            S5
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">Survey 593</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Características
          </a>
          <a href="#how" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Cómo Funciona
          </a>
          <Link to="/login">
            <Button size="sm" variant="primary">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 text-center max-w-5xl mx-auto overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary-light text-xs font-bold mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ecosistema Kolab · Proyecto #1</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6 animate-slide-up">
          Monetiza tu opinión.{' '}
          <span className="bg-gradient-to-r from-primary-light via-teal-300 to-secondary-light bg-clip-text text-transparent">
            Datos reales, decisiones reales.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
          Survey 593 conecta a empresas y campañas con ciudadanos dispuestos a compartir su opinión verídica. Sin
          intermediarios. Sin fraude de bots.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16 animate-slide-up">
          <Link to="/login">
            <Button size="xl" variant="primary" icon={ArrowRight}>
              Comenzar Ahora
            </Button>
          </Link>
          <a href="#how">
            <Button size="xl" variant="outline">
              ¿Cómo funciona?
            </Button>
          </a>
        </div>

        {/* Counter Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-10 border-t border-slate-800">
          <div>
            <div className="text-3xl font-black text-primary-light">593+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Usuarios Activos</div>
          </div>
          <div>
            <div className="text-3xl font-black text-secondary-light">1,200+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Encuestas Completadas</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400">$15K+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Pagados a Encuestados</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-3">¿Por qué Survey 593?</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Datos verificados + opiniones auténticas = inteligencia de negocios certera
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center">
              <div className="w-14 h-14 rounded-stitch-lg bg-primary/10 border border-primary/20 text-primary-light flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Identidad Verificada</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Cada encuestado pasa por un proceso de verificación (KYC) para asegurar que cada respuesta provenga de una persona real.
              </p>
            </div>

            <div className="glass-card p-8 text-center">
              <div className="w-14 h-14 rounded-stitch-lg bg-secondary/10 border border-secondary/20 text-secondary-light flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Monetización Justa</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Los ciudadanos reciben abonos inmediatos a su billetera virtual por cada encuesta completada. ¡Tu tiempo tiene valor!
              </p>
            </div>

            <div className="glass-card p-8 text-center">
              <div className="w-14 h-14 rounded-stitch-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">No-Code BI Studio</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Las empresas pueden armar sus propios tableros personalizados arrastrando gráficos de Pastel, Radar y KPIs en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-3">¿Cómo funciona?</h2>
          <p className="text-slate-400 text-sm">3 pasos simples para empezar</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-glow-sm">
              1
            </div>
            <h3 className="font-bold text-white text-base">Crea tu Cuenta</h3>
            <p className="text-sm text-slate-400">
              Regístrate en segundos como ciudadano (Doer) o como empresa investigadora (Provider).
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-glow-sm">
              2
            </div>
            <h3 className="font-bold text-white text-base">Interactúa</h3>
            <p className="text-sm text-slate-400">
              Responde encuestas remuneradas o publica tus propias campañas con preguntas segmentadas.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-glow-sm">
              3
            </div>
            <h3 className="font-bold text-white text-base">Gana & Analiza</h3>
            <p className="text-sm text-slate-400">
              Retira tus ganancias bancarias o visualiza dashboards ejecutivos en vivo con filtros demográficos.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-400">
        <p>© 2026 Survey 593 · Ecosistema Kolab · Todos los derechos reservados.</p>
        <p className="mt-1 text-slate-400">Hecho con 💚 para democratizar la monetización de datos en Ecuador.</p>
      </footer>
    </div>
  );
};
