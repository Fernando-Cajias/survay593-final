# Plan de Asignación de Roles y Módulos Scrum — Survey 593
**Ecosistema Kolab · Proyecto #1**
**Scrum Master:** Fernando Cajías (5to Semestre)
**Equipo Total:** 8 Integrantes

---

## 🎯 Estructura Organizacional del Equipo

Para maximizar la eficiencia y el aprendizaje de los compañeros de semestres iniciales sin sobrecargarlos, el proyecto se organiza bajo la metodología **Scrum** con una división clara de responsabilidades según nivel formativo:

```
                      ┌────────────────────────────────────────┐
                      │    FERNANDO CAJÍAS (5to Semestre)      │
                      │     Scrum Master & Lead Architect      │
                      └──────────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
  ┌──────────────┴──────────────┐                 ┌──────────────┴──────────────┐
  │   JORDY SANTILLÁN (5to)     │                 │   DENNIS TOAPANTA (3ro)     │
  │   Data Architect & Backend  │                 │  Frontend Dev & Lead QA     │
  └──────────────┬──────────────┘                 └──────────────┬──────────────┘
                 │                                               │
  ┌──────────────┴───────────────────────────────────────────────┴──────────────┐
  │                        DESARROLLADORES JUNIOR (1er Semestre)                │
  │  • Óscar Males (UI & Design System)      • Antony Cayambe (Validación Forms)│
  │  • Antony Jarrín (Landing & Data Seed)   • Dennis Villasis (Auth & KYC)     │
  │  • Calixto Carrera (Exportación & QA)                                       │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Matriz Detallada de Asignación por Integrante

### 1. 👑 Fernando Cajías (5to Semestre)
* **Rol Scrum:** Scrum Master & Arquitecto Principal / Full-Stack Lead.
* **Archivos / Módulos a Cargo:** 
  * `js/app.js` (Enrutador SPA, Guards de autenticación y resolución de rutas dinámicas).
  * `js/dashboard-studio.js` (Motor No-Code BI Studio, arquitectura Drag & Drop y lienzo interactivo).
  * `index.html` (Arquitectura general y orquestación de scripts).
* **Entregables Concretos:**
  * Liderazgo de ceremonias Scrum (Daily, Sprint Planning, Sprint Review).
  * Construcción del motor de arrastre y soltar (Drag & Drop) y vinculación a BDD.
  * Defensa del Documento de Diseño de Arquitectura (DDA) ante el tutor.
  * Gestión del repositorio de GitHub, ramas y control de versiones.

---

### 2. 🏛️ Jordy Santillán (5to Semestre)
* **Rol Scrum:** Arquitecto de Datos & Backend Lead.
* **Archivos / Módulos a Cargo:**
  * `js/db.js` (Capa de abstracción de base de datos relacional y colecciones NoSQL).
  * `js/doer.js` - *Submódulo de Billetera Financiera & Wallet*.
  * `docs/DDA_Survey593.md` (Diseño de base de datos relacional PostgreSQL / Supabase, diseño de contratos OpenAPI y matriz de infraestructura Cloud AWS).
* **Entregables Concretos:**
  * Lógica transaccional de billeteras (abonos por encuesta, retiros y saldo).
  * Definición de esquemas de datos relacionales (Usuarios, Encuestas, Respuestas, Transacciones).
  * Implementación de reglas de seguridad y cumplimiento de derechos ARCO+.

---

### 3. 🧪 Dennis Toapanta (3er Semestre)
* **Rol Scrum:** Desarrollador Frontend Intermedio & Lead de QA / Testing.
* **Archivos / Módulos a Cargo:**
  * `js/provider.js` (Wizard de creación de encuestas paso a paso de 4 fases).
  * `js/components.js` (Integración de motor gráfico Chart.js: Barras, Pastel, Radar, Polar y Líneas).
* **Entregables Concretos:**
  * Desarrollo del asistente interactivo (Wizard) para que las empresas creen cuestionarios dinámicos.
  * Plan de pruebas y casos de prueba E2E (Playwright / Cypress) y pruebas de rendimiento con k6.
  * Control de calidad y verificación de renderizado de gráficos estadísticos.

---

### 4. 🎨 Óscar Males (1er Semestre)
* **Rol Scrum:** Desarrollador Junior / UI & Design System.
* **Archivos / Módulos a Cargo:**
  * `styles/main.css` (Design System, paleta de colores Teal / Dark Mode y estilos de componentes).
* **Entregables Concretos:**
  * Estilizado de botones, tarjetas KPI con Glassmorphism y badges de estado.
  * Adaptabilidad Responsive (media queries para visualización en teléfonos y tablets).
  * Micro-interacciones y animaciones de transición en la interfaz.

---

### 5. 📝 Antony Cayambe (1er Semestre)
* **Rol Scrum:** Desarrollador Junior / Formularios & Validación de Respuestas.
* **Archivos / Módulos a Cargo:**
  * `js/doer.js` - *Submódulo de Ejecución de Encuestas (`survey-answer`)*.
* **Entregables Concretos:**
  * Renderizado interactivo de los 4 tipos de preguntas (Opción múltiple, Escala Likert de 1 a 5, Sí/No, y Texto abierto).
  * Barra de progreso en tiempo real que avanza conforme el usuario contesta.
  * Validaciones de cliente para evitar el envío de preguntas obligatorias vacías.

---

### 6. 🌐 Antony Jarrín (1er Semestre)
* **Rol Scrum:** Desarrollador Junior / Landing Page & Levantamiento de Datos Seed.
* **Archivos / Módulos a Cargo:**
  * `js/app.js` - *Submódulo Landing Page (`renderLanding`)*.
  * `js/db.js` - *Banco de Preguntas y Datos de Demostración (Seed Data)*.
* **Entregables Concretos:**
  * Construcción de la Landing Page pública (Hero section, Propuesta de valor, "¿Cómo funciona?", Estadísticas y Call to Action).
  * Investigación y redacción de las 5 encuestas demo del mercado ecuatoriano (Moda, Transporte público, Salud en clínicas, Hábitos digitales).

---

### 7. 🔐 Dennis Villasis (1er Semestre)
* **Rol Scrum:** Desarrollador Junior / Autenticación & Verificación de Identidad (KYC).
* **Archivos / Módulos a Cargo:**
  * `js/auth.js` (Formularios de Login, Registro y selección de rol).
  * `js/doer.js` - *Submódulo de Perfil y Verificación de Cédula/Identidad*.
* **Entregables Concretos:**
  * Formulario conmutador de Inicio de Sesión y Registro con validación de contraseñas.
  * Botones de acceso rápido para cuentas de demostración (María, Textil Andina, Admin Kolab).
  * Pantalla de verificación de identidad con checklist de beneficios y simulación de KYC.

---

### 8. 📊 Calixto Carrera (1er Semestre)
* **Rol Scrum:** Desarrollador Junior / Exportación de Datos & Pruebas Funcionales.
* **Archivos / Módulos a Cargo:**
  * `js/provider.js` - *Módulo de Exportación CSV / Reportes*.
  * `js/admin.js` - *Submódulo de Calidad de Datos y Auditoría*.
* **Entregables Concretos:**
  * Generación y descarga automática de archivos CSV con las respuestas de cada encuesta.
  * Ejecución de matriz de pruebas manuales (Cross-browser testing en Chrome, Edge y Firefox).
  * Verificación de la tabla de usuarios y filtros de búsqueda en el panel administrativo.

---

## 📅 Distribución de Sprints (Cronograma de Trabajo)

| Sprint | Duración | Foco Principal | Responsables Clave |
|--------|----------|----------------|--------------------|
| **Sprint 1** | Semana 1 - 2 | Arquitectura base, Design System, Landing Page y Autenticación | Fernando C., Jordy S., Óscar M., Dennis V., Antony J. |
| **Sprint 2** | Semana 3 - 4 | Creador de Encuestas, Motor de Respuestas y Billetera Financiera | Dennis T., Antony C., Jordy S., Calixto C. |
| **Sprint 3** | Semana 5 - 6 | **No-Code BI Dashboard Studio (Drag & Drop)**, Gráficos y Exportación | Fernando C., Dennis T., Calixto C., Óscar M. |
| **Sprint 4** | Semana 7 - 8 | Pruebas de Calidad (QA), Verificación ARCO+ y Preparación de Defensa | Todo el equipo liderado por Fernando C. y Dennis T. |
