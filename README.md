# Survey 593 — Ecosistema Kolab

![Survey 593 Logo](https://img.shields.io/badge/Survey%20593-Kolab%20Ecosystem-0D9488?style=for-the-badge)

Survey 593 es una plataforma (Prototipo SPA) de democratización de monetización de datos. Permite a empresas obtener *insights* reales del mercado en tiempo real, mientras recompensa financieramente a los usuarios (Doers) verificados por su opinión. Este proyecto actúa como el pilar de recolección de datos ("vendedor interno") para los futuros proyectos del Ecosistema Kolab.

## 📁 Documentación de Arquitectura (Entregable Final)
En la carpeta `/docs` encontrarás los documentos requeridos para la defensa final:
- [DDA_Survey593.md](./docs/DDA_Survey593.md): Documento de Diseño de Arquitectura (C4, DDD, NFRs, Cloud).
- [Presentacion_Survey593.md](./docs/Presentacion_Survey593.md): Guion y estructura para las diapositivas de defensa.

## 🚀 Cómo Ejecutar el Proyecto Localmente

El prototipo actual está diseñado como una **Single Page Application (SPA)** pura utilizando HTML5, CSS3 y JavaScript ES6+, con `localStorage` actuando como la base de datos temporal (con datos precargados para demostración). No requiere instalación de dependencias, Node.js ni bases de datos externas.

### Requisitos Previos
- Un navegador web moderno (Google Chrome, Firefox, Edge o Safari).
- (Opcional) Visual Studio Code con la extensión "Live Server" para recarga en vivo.

### Pasos para ejecutar:
1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/Fernando-Cajias/survay593-final.git
   ```
2. Entra a la carpeta del proyecto:
   ```bash
   cd survay593-final
   ```
3. Abre el archivo `index.html` en tu navegador.
   - **Opción A (Rápida):** Haz doble clic en el archivo `index.html` desde tu explorador de archivos.
   - **Opción B (Recomendada):** Si usas VS Code, haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.

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

## 👥 Equipo
- Arquitectura y Desarrollo del Ecosistema Kolab.
