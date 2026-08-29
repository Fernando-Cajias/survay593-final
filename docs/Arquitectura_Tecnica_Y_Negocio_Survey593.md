# Documento Maestro de Justificación Técnica, Arquitectura y Modelo de Negocio — Survey 593

**Proyecto #1 del Ecosistema Kolab**  
**Scrum Master & Lead Architect:** Fernando Cajías  
**Equipo de Desarrollo:** 8 Integrantes (5to, 3er y 1er Semestre)  
**Versión de Producción:** 1.0.0 (Desplegada en Vercel + Supabase)

---

## 1. Justificación Técnica y Arquitectura de Software

### 1.1. ¿Cómo se construyó y por qué? (Decisiones Arquitectónicas)
El sistema se diseñó bajo una arquitectura **Cloud-Native / Jamstack desacoplada**, dividida estrictamente en dos capas independientes:

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA CLIENTE (FRONTEND)                  │
│   • React 18 + Vite 6 + Tailwind CSS                        │
│   • SPA Enrutada con React Router DOM                       │
│   • Motor Gráfico Chart.js 4 (Pastel, Radar, Polar, Barras) │
│   • No-Code BI Studio (HTML5 Drag & Drop Nativo)            │
│   • CDN Global con Despliegue Automatizado (Vercel)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST (PostgREST)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 CAPA DATOS & BACKEND (SUPABASE)             │
│   • Base de Datos Relacional PostgreSQL 15 (AWS us-east-1)  │
│   • Row Level Security (RLS) para aislamiento multi-tenant  │
│   • Ledger Financiero Transaccional (Transacciones ACID)    │
│   • Conexión vía @supabase/supabase-js con pooling 6543     │
└─────────────────────────────────────────────────────────────┘
```

#### Justificación del "Por qué" de cada tecnología:

1. **¿Por qué React 18 + Vite en lugar de Angular o Vanilla JS?**
   * **Curva de aprendizaje del equipo:** De los 8 integrantes, 5 son de primer semestre. Angular impone una barrera altísima (RxJS complejo, decorators, inyección de dependencias estricta). React permite descomponer la aplicación en componentes atómicos y reutilizables (`Button`, `Badge`, `KpiCard`, `Modal`) donde los estudiantes junior pueden construir pantallas sin tocar el núcleo del sistema.
   * **Velocidad de compilación (Vite):** HMR (Hot Module Replacement) instantáneo en milisegundos, reduciendo la fricción en el desarrollo diario.

2. **¿Por qué Supabase (PostgreSQL) y NO Firebase (NoSQL)?**
   * **Integridad Financiera (ACID):** Survey 593 gestiona billeteras virtuales reales y pagos a encuestados. Una base de datos NoSQL documental como Firebase Firestore no garantiza consistencia relacional estricta en transferencias de saldo, arriesgando pagos dobles o retiros fantasmas. PostgreSQL garantiza atomicidad e integridad referencial.
   * **Row Level Security (RLS):** Las reglas de acceso a los datos no se programan con middleware frágil en un backend; se aplican directamente en las tablas de PostgreSQL, garantizando que ninguna empresa pueda ver los datos crudos o privados de otra.

3. **¿Por qué HTML5 Drag & Drop Nativo en el No-Code BI Studio?**
   * **Cero peso adicional (Zero Dependencies):** No se usaron librerías pesadas externas de Drag & Drop que ralentizan el navegador. La API nativa del navegador garantiza 60 FPS al arrastrar y soltar widgets en el lienzo.

---

## 2. Propósito, Misión y Visión

* **MTP (Propósito Masivo Transformador):** Democratizar la monetización de datos primarios en el Ecuador, transformando la opinión de los ciudadanos en ingresos económicos reales y dotando a las empresas de inteligencia de mercado sin fraude.
* **Misión:** Conectar a empresas y entidades investigadoras que necesitan información verídica con una comunidad de ciudadanos dispuestos a monetizar su tiempo y conocimiento, eliminando el fraude de bots mediante verificación KYC.
* **Visión:** Convertirse en el "Vendedor Interno de Datos" y motor analítico del Ecosistema Kolab, alimentando con perfiles demográficos reales a los próximos 15 proyectos de la organización.

---

## 3. Equipo de Desarrollo & Metodología Scrum

El proyecto se ejecutó en 4 Sprints bajo la metodología ágil **Scrum**, distribuyendo la carga según el nivel formativo para maximizar la productividad sin frustrar a los desarrolladores novatos:

| Integrante | Nivel | Rol en el Proyecto | Aporte Concreto |
| :--- | :--- | :--- | :--- |
| **Fernando Cajías** | 5to Semestre | **Scrum Master & Lead Architect** | Arquitectura SPA, No-Code BI Studio Drag & Drop, Enrutador y DevOps (Vercel / Supabase). |
| **Jordy Santillán** | 5to Semestre | **Data Architect & Backend Lead** | Esquema DDL en PostgreSQL, RLS, capa transaccional de billeteras y sincronización de datos. |
| **Dennis Toapanta** | 3er Semestre | **Frontend Dev & Lead QA** | Wizard de encuestas en 4 pasos, integración Chart.js y pruebas funcionales. |
| **Óscar Males** | 1er Semestre | **Junior UI Developer** | Design System Stitch, componentes visuales, Glassmorphism y responsive design. |
| **Antony Cayambe** | 1er Semestre | **Junior Developer** | Formulario reproductor de encuestas, validación de preguntas Likert y barras de progreso. |
| **Antony Jarrín** | 1er Semestre | **Junior UX / Data Researcher** | Redacción de la Landing Page y diseño de las encuestas seed del mercado ecuatoriano. |
| **Dennis Villasis** | 1er Semestre | **Junior Developer** | Pantallas de login/registro, validación de contraseñas y flujo KYC de identidad. |
| **Calixto Carrera** | 1er Semestre | **Junior Data & QA Analyst** | Exportación de datos a CSV, verificación ARCO+ y pruebas de usabilidad. |

---

## 4. Nicho de Mercado Objetivo (¿Quiénes lo usarán profesionalmente?)

En lugar de competir genéricamente contra gigantes internacionales como SurveyMonkey o Google Forms, Survey 593 se enfoca en un **nicho de alto impacto y desatendido en Ecuador**:

### 🎯 Nicho Primario: PyMEs, Emprendimientos y Marcas de Retail/Moda
* **El Problema:** Las PyMEs ecuatorianas no tienen $5,000 USD para contratar a CEDATOS o Kantar. Recurren a Google Forms en grupos de WhatsApp, obteniendo respuestas sesgadas de amigos o familiares ("datos basura").
* **La Solución Survey 593:** Pueden lanzar una campaña con apenas $50 o $100 USD y recibir 30 a 100 respuestas de clientes reales de su ciudad (Quito, Guayaquil, Cuenca) en 24 horas, visualizando los resultados en su **Dashboard Studio** personalizado.

### 🎯 Nicho Secundario: Agencias de Marketing Digital y Consultoras Políticas Locales
* **El Problema:** Para campañas políticas a concejalías o alcaldías, medir la percepción ciudadana en barrios específicos toma semanas de trabajo de campo costoso.
* **La Solución Survey 593:** Segmentación demográfica instantánea por ciudad y género, con entrega de datos verificados en tiempo real.

---

## 5. Estrategia de Marketing & Adquisición (Go-To-Market)

Para lograr tracción rápida sin un presupuesto millonario, aplicamos una estrategia de **Growth Hacking en dos frentes**:

### 👥 Frente B2C: Captación de Encuestados (Oferta)
1. **Marketing de Guerrilla Universitario:** Campañas en campus y grupos de Telegram/WhatsApp de universidades de Quito y Guayaquil (estudiantes buscando ingresos flexibles en tiempos muertos).
2. **Viralidad por Referidos ("Invita y Gana"):** Bono de $0.50 acreditado a la billetera virtual del usuario cada vez que un amigo invitado complete su primera encuesta verificada.
3. **Contenido Orgánico en TikTok / Reels:** Videos tipo *"Cómo ganar $20 a la semana respondiendo preguntas desde tu celular en Ecuador con retiro directo a Banco Pichincha o DeUna"*. La prueba social del pago genera adopción inmediata.

### 🏢 Frente B2B: Captación de Empresas y Clientes (Demanda)
1. **Estrategia "Freemium / Gancho de Entrada":** Las primeras 15 respuestas de cualquier encuesta nueva son gratuitas, permitiendo a la empresa probar el **No-Code BI Studio** sin riesgo.
2. **Prospección en LinkedIn:** Contacto directo con directores de Marketing y Brand Managers de empresas locales ofreciendo estudios de benchmarking en 48 horas.
3. **Webinars & Talleres Prácticos:** "Cómo validar tu próximo producto con datos reales antes de invertir tu capital".

---

## 6. Modelo de Negocio (¿Cómo generamos dinero?)

Survey 593 opera bajo un modelo de monetización híbrido **Marketplace + SaaS B2B**:

```
        EMPRESA PAGA               SURVEY 593 (PLATAFORMA)          ENCUESTADO RECIBE
    ┌──────────────────┐           ┌──────────────────────┐        ┌──────────────────┐
    │  $3.50 por cada  │ ───────►  │  Retiene el 30%-40%  │ ─────► │  $2.00 a $2.50   │
    │  respuesta real  │           │  Margen Neto: $1.00  │        │  directo a saldo │
    └──────────────────┘           └──────────────────────┘        └──────────────────┘
```

1. **Margen por Respuesta Verificada (Take-Rate / Spread del 30% al 40%):**
   * La empresa paga $3.50 por respuesta obtenida.
   * El encuestado recibe $2.25 en su billetera virtual.
   * **Ganancia neta Survey 593:** $1.25 por cada respuesta procesada. Con 10,000 respuestas al mes, esto genera **$12,500 USD de ingreso neto recurrente**.

2. **Suscripción SaaS "BI Studio Pro" para Empresas ($49 / mes):**
   * Acceso al lienzo Drag & Drop con widgets ilimitados.
   * Exportación automatizada a formatos ejecutivos (CSV, PDF, Excel).
   * Filtros demográficos avanzados en tiempo real.

3. **Comisión por Retiro de Fondos:**
   * Tarifa de procesamiento de $0.50 o 2.5% por transferencia bancaria hacia cuentas locales.

4. **Sinergia con el Ecosistema Kolab:**
   * Survey 593 monetiza proveyendo estudios de mercado a los otros 15 proyectos Kolab, reduciendo a cero su costo de adquisición de clientes y convirtiéndose en el activo de datos más valioso de la organización.
