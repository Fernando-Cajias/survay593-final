import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const LANG_KEY = 'survey593_lang';

export const TRANSLATIONS = {
  es: {
    nav: {
      radar: 'Radar en Vivo',
      solutions: 'Soluciones B2B',
      biStudio: 'BI Studio',
      simulator: 'Simulador',
      ecosystem: 'Ecosistema',
      security: 'Seguridad',
      signIn: 'Iniciar Sesión',
      portalEnterprise: 'Portal Empresarial',
      enterpriseShort: 'Empresas',
    },
    hero: {
      categoryPill: 'Ecosistema de Investigación Georreferenciada · Ecuador',
      titleStart: 'Decisiones Estratégicas Basadas en la ',
      titleHighlight: 'Opinión Real del Mercado Ecuatoriano',
      subtitle: 'Empresas y colegios publican misiones y estudios representativos en el mapa; miles de ciudadanos verificados responden en tiempo real recibiendo compensaciones directas.',
      availableTickerStart: '',
      availableTickerEnd: 'USD disponibles ahora mismo en misiones y estudios activos',
      stats: {
        citizens: '+25,000',
        citizensDesc: 'Ciudadanos y hogares verificados en todo el país',
        delivery: '< 24h',
        deliveryDesc: 'Tiempo promedio de entrega de resultados representativos',
        provinces: '24 Provincias',
        provincesDesc: 'Cobertura urbana y rural segmentada por cantones',
        antifraud: '99.4%',
        antifraudDesc: 'Precisión antifraude con validación biométrica/dispositivo',
      },
    },
    radar: {
      filters: {
        all: '🗺️ Todo el Mapa',
        online: '⚡ Desde Casa (Online)',
      },
      headerTitle: 'Radar en Tiempo Real · Misiones en Ecuador',
      activePoints: 'puntos activos en mapa',
      lastPayout: 'Última acreditación:',
      verifiedBadge: '100% Verificado',
      feedTitle: 'Haz clic para explorar y participar de una',
      touchHint: 'Toca para abrir',
      startBtn: 'Iniciar',
      enterpriseBoxTitle: '¿Tienes un negocio, colegio o empresa?',
      enterpriseBoxDesc: 'Lanza tu estudio o encuesta geolocalizada en este mapa y obtén respuestas de clientes reales en 24 horas.',
      enterpriseBoxBtn: 'Publicar Estudio Empresarial en Survey 593 🚀',
    },
    missionModal: {
      rewardLabel: 'Recompensa al completar',
      instructionsTitle: 'Instrucciones de la Misión:',
      questionStep: 'Pregunta 1 de 3 (Toca tu respuesta para comenzar):',
      instantReserveHint: '⚡ Tu saldo se reserva inmediatamente al presionar una opción.',
      step2Title: '¡Excelente! Tu primera respuesta fue guardada',
      step2DescStart: 'Tus',
      step2DescEnd: 'USD están reservados. ¿A qué correo te acreditamos tus fondos?',
      nameLabel: 'Tu Nombre Completo',
      emailLabel: 'Correo Electrónico (para tu Billetera)',
      passLabel: 'Crea tu Contraseña',
      passPlaceholder: 'Mínimo 6 caracteres',
      claimBtn: 'Reclamar mis',
      claimBtnEnd: 'USD y Ver Billetera 🚀',
      loadingBtn: 'Acreditando tus fondos...',
      securityFooter: '🔒 Retiro disponible hacia Banco Pichincha, Guayaquil, Produbanco o DeUna.',
    },
    biStudio: {
      tag: 'Survey 593 Business Intelligence Studio',
      title: 'Analítica que Transforma Respuestas en Rentabilidad',
      subtitle: 'Selecciona un sector económico y descubre cómo las organizaciones líderes monitorean el pulso del mercado ecuatoriano.',
      clientLabel: 'Cliente:',
      sampleLabel: 'Muestra Recolectada',
      launchSimilarBtn: 'Lanzar Estudio Similar 🚀',
      distributionTitle: 'Distribución de Respuestas Verificadas',
      completionLabel: 'tasa de finalización',
      keyFindingTitle: 'Hallazgo Clave de Mercado:',
      coverageTitle: 'Cobertura Territorial Ecuatoriana',
      npsLabel: 'Índice de Lealtad (NPS)',
      avgTimeLabel: 'Tiempo Promedio',
    },
    simulator: {
      tag: 'Calculadora Muestral & Cotizador Inmediato',
      title: 'Simula tu Próximo Estudio de Mercado en Segundos',
      subtitle: 'Define el alcance de tu investigación y estima el nivel de representatividad estadística y tiempo de recolección en el territorio ecuatoriano.',
      check1: 'Muestreo probabilístico con controles por cuotas de edad y género',
      check2: 'Exportación instantánea a Excel, PDF ejecutivo y conectores PowerBI',
      check3: 'Garantía de cero respuestas duplicadas por huella digital',
      step1Title: '1. Objetivo de la Investigación',
      objectives: {
        mercado: 'Estudio de Mercado',
        producto: 'Validación de Producto',
        educacion: 'Sector Educativo',
        nps: 'Satisfacción y NPS',
      },
      step2Title: '2. Cobertura Geográfica',
      regions: {
        nacional: 'Ecuador Nacional (24 Provincias)',
        quito: 'Quito y Valles (Pichincha)',
        guayaquil: 'Guayaquil, Samborondón y Durán (Guayas)',
        cuenca: 'Cuenca y Región Austral (Azuay)',
        central: 'Eje Central (Ambato, Riobamba, Latacunga)',
      },
      step3Title: '3. Tamaño Muestral Deseado',
      respondents: 'encuestados',
      errorMarginLabel: 'Margen de Error (95% IC)',
      deliveryTimeLabel: 'Entrega de Resultados',
      ctaBtn: 'Iniciar Campaña con esta Muestra 🚀',
    },
    solutions: {
      tag: 'Soluciones Corporativas a Medida',
      title: 'Diseñado para los Desafíos Estratégicos de Ecuador',
      subtitle: 'Survey 593 no es un formulario genérico. Es una infraestructura integral adaptada a la dinámica comercial, educativa y regulatoria de nuestro país.',
      retail: {
        title: 'Empresas & Consumo Masivo',
        desc: 'Pruebas de concepto, elasticidad de precios, auditorías en punto de venta y recordación de campañas publicitarias.',
        b1: 'Segmentación por NSE y ciudad',
        b2: 'Feedback antes de lanzar a percha',
      },
      education: {
        title: 'Colegios & Universidades',
        desc: 'Módulo multi-inquilino para evaluación docente, clima escolar, sondeos a padres de familia y comités de acreditación.',
        b1: 'Filtro por períodos académicos',
        b2: 'Reportes ejecutivos para rectorados',
      },
      fintech: {
        title: 'Banca, Seguros & Fintech',
        desc: 'Medición de experiencia en canales digitales, adopción de transferencias interbancarias y percepción de seguridad.',
        b1: 'Métricas de adopción de pagos QR',
        b2: 'NPS transaccional continuo',
      },
      agency: {
        title: 'Consultoras & Agencias',
        desc: 'Infraestructura de trabajo de campo a demanda. Olvídate de brigadas físicas costosas o bases de datos desactualizadas.',
        b1: 'Exportación a PDF y Excel en 1 clic',
        b2: 'Muestreo representativo garantizado',
      },
    },
    security: {
      title: 'Seguridad y Privacidad de Grado Empresarial',
      subtitle: 'Cumplimos con los más altos estándares de protección de datos personales y seguridad informática en Ecuador.',
      c1Title: 'Cifrado de Extremo a Extremo',
      c1Desc: 'Comunicaciones cifradas mediante TLS 256-bit y almacenamiento protegido en arquitectura en la nube de alta disponibilidad.',
      c2Title: 'Anonimización de Encuestados',
      c2Desc: 'Las empresas reciben datos demográficos consolidados; los datos personales y de identidad del ciudadano permanecen bajo estricta confidencialidad.',
      c3Title: 'Prevención Activa de Fraude',
      c3Desc: 'Bloqueo inteligente de respuestas sospechosas, control de velocidad de respuesta (speeder checks) y verificación por dispositivo único.',
    },
    ctaBanner: {
      title: 'Comienza a Tomar Decisiones Basadas en Datos Reales Hoy Mismo',
      subtitle: 'Crea tu cuenta empresarial en 1 minuto. Publica tu primer estudio geolocalizado o solicita una demostración guiada para tu organización.',
      createBtn: 'Crear Cuenta Empresarial Gratis 🚀',
      loginBtn: 'Ingresar a mi Cuenta Existente',
    },
    footer: {
      desc: 'Infraestructura de inteligencia de mercado, encuestas y analítica ciudadana para el Ecuador.',
      platformTitle: 'Plataforma',
      territoryTitle: 'Territorio 593',
      complianceTitle: 'Cumplimiento & Soporte',
      copyright: 'Survey 593 Enterprise. Todos los derechos reservados.',
      madeFor: 'Hecho para el mercado ecuatoriano 🇪🇨',
    },
    auth: {
      loginTitle: 'Iniciar Sesión',
      loginSubtitle: 'Ingresa a tu panel de control de Survey 593 con tus credenciales.',
      registerTitle: 'Crear Cuenta',
      registerSubtitle: 'Regístrate en Survey 593 y comienza a investigar o participar hoy.',
      forgotTitle: 'Recuperar Contraseña',
      forgotSubtitle: 'Ingresa tu correo electrónico registrado y te enviaremos un enlace oficial para restablecer tu contraseña.',
      newPassTitle: 'Nueva Contraseña',
      newPassSubtitle: 'Ingresa tu nueva contraseña para volver a ingresar a tu cuenta de Survey 593.',
      emailLabel: 'Correo Electrónico',
      passLabel: 'Contraseña',
      nameLabel: 'Nombre Completo',
      companyLabel: 'Nombre de la Empresa o Institución',
      roleProvider: 'Empresa / Institución',
      roleDoer: 'Ciudadano / Encuestado',
      forgotLink: '¿Olvidaste tu contraseña?',
      loginBtn: 'Iniciar Sesión',
      registerBtn: 'Crear Cuenta',
      verifyBtn: 'Enviar enlace de recuperación',
      savePassBtn: 'Actualizar Contraseña y Entrar',
      haveAccount: '¿Ya tienes una cuenta registrada?',
      noAccount: '¿Aún no tienes una cuenta?',
      backToLogin: 'Volver al inicio de sesión',
      backHome: 'Volver al Inicio',
      sidebarTitle: 'La plataforma de investigación y encuestas para',
      sidebarSubtitle: 'Empresas, colegios, universidades y entidades públicas toman decisiones informadas con respuestas ciudadanas verificadas y analítica en tiempo real.',
      badge1Title: 'Seguridad y Encriptación Bancaria',
      badge1Desc: 'Protección SSL/TLS 256-bit y contraseñas hasheadas en base de datos.',
      badge2Title: 'Resultados y Segmentación 593',
      badge2Desc: 'Métricas demográficas por provincias, ciudades y sectores clave.',
      badge3Title: 'Comunidad de Encuestados Activa',
      badge3Desc: 'Miles de ciudadanos completan encuestas diarias con recompensas reales.',
      orEmail: 'o con correo electrónico',
      verifying: 'Verificando credenciales...',
      creatingAccount: 'Creando cuenta...',
      registerProviderBtn: 'Registrar Empresa / Institución',
      registerDoerBtn: 'Registrarme como Encuestado',
      repNameLabel: 'Nombre del Representante o Administrador',
      repNamePlaceholder: 'Ej: Ing. Carlos Pérez',
      companyPlaceholder: 'Ej: Banco Pichincha, Colegio Benalcázar',
      checkInboxTitle: '¡Revisa tu bandeja de entrada!',
      checkInboxDesc: 'Hemos enviado un enlace de recuperación a',
      checkInboxDescEnd: 'Sigue las instrucciones del correo para definir tu nueva contraseña.',
      confirmPassLabel: 'Confirmar Nueva Contraseña',
      savingPass: 'Guardando contraseña...',
    },
  },
  en: {
    nav: {
      radar: 'Live Radar',
      solutions: 'B2B Solutions',
      biStudio: 'BI Studio',
      simulator: 'Simulator',
      ecosystem: 'Ecosystem',
      security: 'Security',
      signIn: 'Sign In',
      portalEnterprise: 'Enterprise Portal',
      enterpriseShort: 'Business',
    },
    hero: {
      categoryPill: 'Geolocated Research Ecosystem · Ecuador',
      titleStart: 'Strategic Decisions Driven by the ',
      titleHighlight: 'Real Voice of the Ecuadorian Market',
      subtitle: 'Companies and academic institutions launch representative missions and surveys on the map; thousands of verified citizens respond in real-time receiving direct rewards.',
      availableTickerStart: '',
      availableTickerEnd: 'USD available right now in active research missions and surveys',
      stats: {
        citizens: '+25,000',
        citizensDesc: 'Verified citizens and households across the country',
        delivery: '< 24h',
        deliveryDesc: 'Average delivery time for statistically representative findings',
        provinces: '24 Provinces',
        provincesDesc: 'Urban and rural coverage segmented by municipalities',
        antifraud: '99.4%',
        antifraudDesc: 'Anti-fraud precision with biometric/device validation',
      },
    },
    radar: {
      filters: {
        all: '🗺️ Entire Map',
        online: '⚡ From Home (Online)',
      },
      headerTitle: 'Real-Time Radar · Active Missions in Ecuador',
      activePoints: 'active points on map',
      lastPayout: 'Latest payout:',
      verifiedBadge: '100% Verified',
      feedTitle: 'Click to explore and participate immediately',
      touchHint: 'Tap to open',
      startBtn: 'Start',
      enterpriseBoxTitle: 'Own a business, school, or institution?',
      enterpriseBoxDesc: 'Launch your geolocated survey on this map and get verified responses from real consumers within 24 hours.',
      enterpriseBoxBtn: 'Publish Business Survey on Survey 593 🚀',
    },
    missionModal: {
      rewardLabel: 'Reward upon completion',
      instructionsTitle: 'Mission Instructions:',
      questionStep: 'Question 1 of 3 (Tap your answer to begin):',
      instantReserveHint: '⚡ Your reward balance is reserved immediately when you select an option.',
      step2Title: 'Great job! Your first answer has been recorded',
      step2DescStart: 'Your',
      step2DescEnd: 'USD are reserved. Which email address should we credit your reward to?',
      nameLabel: 'Your Full Name',
      emailLabel: 'Email Address (for your Wallet)',
      passLabel: 'Create a Password',
      passPlaceholder: 'Minimum 6 characters',
      claimBtn: 'Claim my',
      claimBtnEnd: 'USD and View Wallet 🚀',
      loadingBtn: 'Crediting your funds...',
      securityFooter: '🔒 Payouts available to Banco Pichincha, Guayaquil, Produbanco, or DeUna.',
    },
    biStudio: {
      tag: 'Survey 593 Business Intelligence Studio',
      title: 'Analytics that Turn Raw Responses into Profitability',
      subtitle: 'Select an economic sector to discover how leading organizations monitor consumer sentiment across Ecuador.',
      clientLabel: 'Client:',
      sampleLabel: 'Collected Sample',
      launchSimilarBtn: 'Launch Similar Study 🚀',
      distributionTitle: 'Verified Response Distribution',
      completionLabel: 'completion rate',
      keyFindingTitle: 'Key Market Finding:',
      coverageTitle: 'Ecuadorian Territorial Coverage',
      npsLabel: 'Net Promoter Score (NPS)',
      avgTimeLabel: 'Average Time',
    },
    simulator: {
      tag: 'Sample Calculator & Instant Quote',
      title: 'Simulate Your Next Market Research in Seconds',
      subtitle: 'Define your research scope and estimate statistical confidence intervals and field collection time across Ecuador.',
      check1: 'Probability sampling with demographic age and gender quotas',
      check2: 'Instant export to Excel, executive PDF, and PowerBI connectors',
      check3: 'Guaranteed zero duplicate responses via digital device fingerprinting',
      step1Title: '1. Research Objective',
      objectives: {
        mercado: 'Market Research',
        producto: 'Product Validation',
        educacion: 'Education Sector',
        nps: 'Satisfaction & NPS',
      },
      step2Title: '2. Geographical Scope',
      regions: {
        nacional: 'Ecuador National (24 Provinces)',
        quito: 'Quito & Valleys (Pichincha)',
        guayaquil: 'Guayaquil, Samborondón & Durán (Guayas)',
        cuenca: 'Cuenca & Southern Region (Azuay)',
        central: 'Central Corridor (Ambato, Riobamba, Latacunga)',
      },
      step3Title: '3. Desired Sample Size',
      respondents: 'respondents',
      errorMarginLabel: 'Margin of Error (95% CI)',
      deliveryTimeLabel: 'Estimated Delivery',
      ctaBtn: 'Launch Campaign with this Sample 🚀',
    },
    solutions: {
      tag: 'Tailored Enterprise Solutions',
      title: 'Engineered for Ecuador’s Strategic Landscape',
      subtitle: 'Survey 593 is not a generic questionnaire tool. It is an end-to-end intelligence infrastructure built for Ecuador’s commercial, academic, and demographic reality.',
      retail: {
        title: 'Retail & Consumer Goods',
        desc: 'Concept testing, price elasticity, point-of-sale audits, and ad recall measurement.',
        b1: 'Socioeconomic status and city segmentation',
        b2: 'Actionable feedback before shelf deployment',
      },
      education: {
        title: 'Schools & Universities',
        desc: 'Multi-tenant module for faculty evaluation, school climate audits, parent surveys, and accreditation boards.',
        b1: 'Academic terms and quarters filtering',
        b2: 'Executive summary reports for leadership',
      },
      fintech: {
        title: 'Banking, Insurance & Fintech',
        desc: 'Customer experience tracking in digital channels, interbank transfer adoption, and transaction security perception.',
        b1: 'QR code and mobile payment adoption metrics',
        b2: 'Continuous transactional NPS tracking',
      },
      agency: {
        title: 'Consulting & Agencies',
        desc: 'On-demand fieldwork infrastructure. Say goodbye to costly physical field crews or outdated databases.',
        b1: '1-click export to PDF and Excel',
        b2: 'Guaranteed statistically representative sampling',
      },
    },
    security: {
      title: 'Enterprise-Grade Security and Privacy',
      subtitle: 'We strictly comply with international data protection and privacy standards within the Ecuadorian framework.',
      c1Title: 'End-to-End Encryption',
      c1Desc: 'All data transmissions are encrypted via 256-bit TLS with high-availability cloud storage.',
      c2Title: 'Respondent Anonymization',
      c2Desc: 'Organizations receive aggregated demographic data; individual personal identities remain strictly confidential.',
      c3Title: 'Active Fraud Prevention',
      c3Desc: 'Smart detection of fraudulent responses, speeder checks, and unique device fingerprinting.',
    },
    ctaBanner: {
      title: 'Start Making Decisions Grounded in Real Data Today',
      subtitle: 'Create your enterprise account in 1 minute. Launch your first geolocated survey or request a guided demo for your team.',
      createBtn: 'Create Free Business Account 🚀',
      loginBtn: 'Sign In to Existing Account',
    },
    footer: {
      desc: 'Market intelligence, survey, and citizen analytics infrastructure for Ecuador.',
      platformTitle: 'Platform',
      territoryTitle: '593 Territory',
      complianceTitle: 'Compliance & Support',
      copyright: 'Survey 593 Enterprise. All rights reserved.',
      madeFor: 'Built for the Ecuadorian market 🇪🇨',
    },
    auth: {
      loginTitle: 'Sign In',
      loginSubtitle: 'Access your Survey 593 control dashboard with your credentials.',
      registerTitle: 'Create Account',
      registerSubtitle: 'Sign up for Survey 593 and start researching or participating today.',
      forgotTitle: 'Reset Password',
      forgotSubtitle: 'Enter your registered email address and we will send an official link to securely reset your password.',
      newPassTitle: 'New Password',
      newPassSubtitle: 'Enter your new password to regain access to your Survey 593 account.',
      emailLabel: 'Email Address',
      passLabel: 'Password',
      nameLabel: 'Full Name',
      companyLabel: 'Company or Institution Name',
      roleProvider: 'Business / Institution',
      roleDoer: 'Citizen / Respondent',
      forgotLink: 'Forgot your password?',
      loginBtn: 'Sign In',
      registerBtn: 'Create Account',
      verifyBtn: 'Send Recovery Link',
      savePassBtn: 'Update Password & Enter',
      haveAccount: 'Already have an account?',
      noAccount: 'Don’t have an account yet?',
      backToLogin: 'Back to Sign In',
      backHome: 'Back to Home',
      sidebarTitle: 'The research and survey platform for',
      sidebarSubtitle: 'Companies, schools, universities, and public institutions make informed decisions with verified citizen responses and real-time analytics.',
      badge1Title: 'Bank-Grade Security & Encryption',
      badge1Desc: '256-bit SSL/TLS protection and securely hashed passwords in database.',
      badge2Title: '593 Targeting & Demographics',
      badge2Desc: 'Demographic metrics by provinces, cities, and key sectors.',
      badge3Title: 'Active Respondent Community',
      badge3Desc: 'Thousands of verified citizens complete daily surveys with real cash rewards.',
      orEmail: 'or with email',
      verifying: 'Verifying credentials...',
      creatingAccount: 'Creating account...',
      registerProviderBtn: 'Register Business / Institution',
      registerDoerBtn: 'Register as Respondent',
      repNameLabel: 'Representative or Admin Name',
      repNamePlaceholder: 'E.g., Carlos Perez, Director',
      companyPlaceholder: 'E.g., Banco Pichincha, Harvard College',
      checkInboxTitle: 'Check your inbox!',
      checkInboxDesc: 'We have sent a recovery link to',
      checkInboxDescEnd: 'Follow the instructions in the email to set your new password.',
      confirmPassLabel: 'Confirm New Password',
      savingPass: 'Saving password...',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'es' || saved === 'en') return saved;
      return 'es'; // Spanish default for Ecuador
    } catch {
      return 'es';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, language);
      document.documentElement.lang = language;
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  // Safe nested translation lookup helper e.g. t('nav.solutions')
  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = TRANSLATIONS[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to Spanish or provided fallback
        let fbCurrent = TRANSLATIONS['es'];
        for (const fbKey of keys) {
          if (fbCurrent && fbCurrent[fbKey] !== undefined) {
            fbCurrent = fbCurrent[fbKey];
          } else {
            return fallback || path;
          }
        }
        return fbCurrent;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
