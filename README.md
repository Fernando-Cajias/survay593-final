# Survey 593 — Ecosistema Kolab

![Survey 593 Logo](https://img.shields.io/badge/Survey%20593-Kolab%20Ecosystem-0D9488?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Producci%C3%B3n%20En%20Vivo-10B981?style=for-the-badge)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://survay593-final.vercel.app)
[![Supabase Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

Survey 593 es una plataforma en la nube de inteligencia de mercado y democratización de monetización de datos. Permite a empresas obtener *insights* reales del mercado en tiempo real mediante un **No-Code BI Studio Drag & Drop**, mientras recompensa financieramente a los ciudadanos verificados por su opinión. Este proyecto actúa como el pilar de recolección de datos ("vendedor interno") para los futuros 15 proyectos del Ecosistema Kolab.

🌐 **Enlace Oficial de Producción en Vivo:** [https://survay593-final.vercel.app](https://survay593-final.vercel.app)

## 📁 Documentación de Arquitectura y Estrategia de Negocio
- [Presentacion_Ejecutiva_Para_Empresa.md](./docs/Presentacion_Ejecutiva_Para_Empresa.md): Presentación Ejecutiva y Comercial para Empresa (sin código, enfoque en negocio, marketing y objeción de usuarios).
- [Arquitectura_Tecnica_Y_Negocio_Survey593.md](./docs/Arquitectura_Tecnica_Y_Negocio_Survey593.md): Justificación técnica formal, decisiones de arquitectura, nicho y modelo financiero.
- [DDA_Survey593.md](./docs/DDA_Survey593.md): Documento de Diseño de Arquitectura (C4, DDD, NFRs, Cloud AWS/Supabase).
- [Plan_Scrum_Equipo.md](./docs/Plan_Scrum_Equipo.md): Distribución de roles y módulos Scrum para los 8 integrantes del equipo.
- [Presentacion_Survey593.md](./docs/Presentacion_Survey593.md): Guion de 10 diapositivas para la defensa final.

## 📁 Estructura del Proyecto

El repositorio está organizado de forma modular para desacoplar el Frontend, el Backend y la documentación:

```
AUTOMATIZACION/
├── frontend/               # Aplicación oficial en React 18 + Vite + Tailwind CSS
│   ├── src/                # Componentes, Páginas, Contexts y Servicios
│   ├── index.html          # Entry point Vite
│   ├── package.json        # Dependencias (React, Tailwind, Lucide, Chart.js)
│   ├── tailwind.config.js  # Design System tokens
│   └── vite.config.js      # Configuración de Vite
├── backend/                # Configuración de Backend, APIs y Supabase / PostgreSQL
│   └── README.md           # Guía de arquitectura de base de datos
├── docs/                   # Documentación de Arquitectura, DDA y Plan Scrum
│   ├── DDA_Survey593.md    # Documento de Diseño Arquitectónico (C4, NFRs, Cloud)
│   ├── Plan_Scrum_Equipo.md# Distribución de tareas para los 8 integrantes
│   └── Presentacion_Survey593.md # Diapositivas de defensa
└── prototype-vanilla/      # Prototipo inicial en HTML/CSS/JS para referencia rápida
```

## 🚀 Cómo Ejecutar el Frontend Oficial (React + Vite)

### Requisitos Previos
- **Node.js:** v18 o superior (recomendado v20+)
- **npm:** v9 o superior

### Pasos para ejecutar:
1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/Fernando-Cajias/survay593-final.git
   cd survay593-final
   ```
2. Entra a la carpeta del frontend e instala dependencias (solo la primera vez):
   ```bash
   cd frontend
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 🔑 Credenciales de Demostración
El sistema autogenerará una base de datos local (seed) la primera vez que lo abras. Usa los botones rápidos en la pantalla de "Iniciar Sesión" o las siguientes credenciales manuales para probar los distintos roles:

| Perfil / Rol | Correo Electrónico | Contraseña |
|--------------|---------------------|------------|
| 👤 **Encuestado (Doer)** | `maria@email.com` | `demo123` |
| 🏢 **Empresa (Provider)** | `admin@textilandina.ec` | `demo123` |
| 🔧 **Administrador (Kolab)** | `admin@kolab.ec` | `admin123` |

## 🛠️ Tecnologías y Módulos del Prototipo
- **🎨 No-Code BI Studio:** Motor visual con Drag & Drop nativo para que las empresas diseñen sus propios Dashboards personalizados (Gráficos de Pastel, Radar multidimensional, Barras, Polar y Tarjetas KPI) vinculados directamente a la base de datos sin programar.
- **Frontend UI:** HTML5 semántico y CSS3 puro (variables CSS, Glassmorphism, CSS Grid/Flexbox).
- **Lógica de Negocio:** JavaScript ES6+ (Patrón Módulo, SPA Hash-router).
- **Visualización Analítica:** [Chart.js 4.x](https://www.chartjs.org/) (Pie, Radar, PolarArea, Bar, Line).
- **Tipografía:** [Inter](https://fonts.google.com/specimen/Inter) de Google Fonts.
- **Estado de Base de Datos:** `window.localStorage` simulando un motor de Base de Datos Relacional y NoSQL (`custom_dashboards`).

## 👥 Equipo de Desarrollo y Arquitectura (Scrum Team)

| Integrante | Semestre | Rol Scrum | Módulos Asignados |
|------------|----------|-----------|-------------------|
| **Fernando Cajías** | 5to Semestre | **Scrum Master & Lead Architect** | Router SPA (`js/app.js`), No-Code BI Studio Drag & Drop (`js/dashboard-studio.js`), DevOps & Git |
| **Jordy Santillán** | 5to Semestre | **Data Architect & Backend Lead** | Capa BDD (`js/db.js`), Billetera / Wallet (`js/doer.js`), Esquema Relacional & ARCO+ |
| **Dennis Toapanta** | 3er Semestre | **Frontend Dev & Lead QA** | Wizard Creación de Encuestas (`js/provider.js`), Chart.js (`js/components.js`), Plan QA |
| **Óscar Males** | 1er Semestre | **Junior UI Developer** | Design System, Variables CSS, Glassmorphism & Responsive Design (`styles/main.css`) |
| **Antony Cayambe** | 1er Semestre | **Junior Developer** | Módulo de Respuesta de Encuestas & Validación de Formularios (`js/doer.js`) |
| **Antony Jarrín** | 1er Semestre | **Junior UX / Data Researcher** | Landing Page (`index.html`) & Banco de Datos de Demostración / Seed (`js/db.js`) |
| **Dennis Villasis** | 1er Semestre | **Junior Developer** | Autenticación, Login/Registro & Verificación de Identidad KYC (`js/auth.js`) |
| **Calixto Carrera** | 1er Semestre | **Junior Data & QA Analyst** | Exportación de Reportes CSV (`js/provider.js`), Calidad de Datos & Pruebas Manuales |

📄 *Consulta el detalle completo de tareas y entregables en el [Plan Scrum del Equipo](./docs/Plan_Scrum_Equipo.md).*
