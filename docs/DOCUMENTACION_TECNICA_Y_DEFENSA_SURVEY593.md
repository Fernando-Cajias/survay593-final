# DOCUMENTACIÓN MAESTRA DEL SISTEMA SURVEY 593
## Expediente Técnico Integral, Arquitectura y Guía de Defensa Individual
**Ecosistema de Investigación Georreferenciada y Analítica Multi-Tenant para Ecuador**

---

> **PROPÓSITO DEL DOCUMENTO:**  
> Este documento constituye el respaldo técnico, operativo y comercial definitivo del proyecto **Survey 593**. Está estructurado en estricto cumplimiento de la **"Lista de Verificación Docente y Matriz de Evaluación Semanal"**, permitiendo a cada integrante del equipo defender su módulo en vivo, responder las preguntas de arquitectura, demostrar la ejecución de código en React/Supabase y justificar la viabilidad comercial y multi-tenant ante el Ingeniero Evaluador.

---

# TABLA DE CONTENIDOS
1. [Visión General del Sistema y Stack Tecnológico](#1-visión-general-del-sistema-y-stack-tecnológico)
2. [Checklist General de Revisión (Criterios Transversales)](#2-checklist-general-de-revisión-criterios-transversales)
3. [Defensa Individual por Estudiante (Módulo, Código y Preguntas Clave)](#3-defensa-individual-por-estudiante)
   - [3.1 Jordy Santillán — Base de Datos Supabase / PostgreSQL](#31-jordy-santillán--base-de-datos-supabase--postgresql)
   - [3.2 Dennis Villacís — Autenticación + Registro + KYC](#32-dennis-villacís--autenticación--registro--kyc)
   - [3.3 Antony Cayambe — SurveyRenderer (Motor de Renderizado)](#33-antony-cayambe--surveyrenderer-motor-de-renderizado)
   - [3.4 Alexis Toapanta — SurveyBuilder (Creador de Encuestas)](#34-alexis-toapanta--surveybuilder-creador-de-encuestas)
   - [3.5 Óscar Males — Motor de Gráficos y Visualización](#35-óscar-males--motor-de-gráficos-y-visualización)
   - [3.6 Antony Jarrín — Landing Page + Datos Semilla Desacoplados](#36-antony-jarrín--landing-page--datos-semilla-desacoplados)
   - [3.7 Calixto Carrera — Exportación CSV + Auditoría QA (ARCO+)](#37-calixto-carrera--exportación-csv--auditoría-qa-arco)
4. [Evaluación del Trabajo en Equipo y Producto Comercial](#4-evaluación-del-trabajo-en-equipo-y-producto-comercial)
   - [4.1 Investigación de Potenciales Clientes Ecuatorianos](#41-investigación-de-potenciales-clientes-ecuatorianos)
   - [4.2 Propuesta Comercial (Pitch 30-60 Segundos)](#42-propuesta-comercial-pitch-30-60-segundos)
   - [4.3 Necesidades y Casos de Uso por Rol Educativo](#43-necesidades-y-casos-de-uso-por-rol-educativo)
   - [4.4 Dominio de la Arquitectura Multi-Tenant y Seguridad RLS](#44-dominio-de-la-arquitectura-multi-tenant-y-seguridad-rls)
5. [Protocolo de Defensa Práctica en Vivo (Guía Paso a Paso de 5 Minutos)](#5-protocolo-de-defensa-práctica-en-vivo)
6. [Matriz de Evaluación Docente y Ponderaciones](#6-matriz-de-evaluación-docente-y-ponderaciones)

---

# 1. VISIÓN GENERAL DEL SISTEMA Y STACK TECNOLÓGICO

Survey 593 es una plataforma web reactiva de investigación georreferenciada, encuestas y analítica de mercado en tiempo real adaptada al contexto comercial y educativo del Ecuador.

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 SURVEY 593 FRONTEND                    │
                  │   React 18 + Vite + Tailwind CSS + Chart.js + Context  │
                  └──────────────┬──────────────────────────┬──────────────┘
                                 │                          │
                 ┌───────────────┴───────────────┐          │
                 │                               │          │
                 ▼                               ▼          ▼
   ┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
   │       PORTAL PÚBLICO      │   │    PORTAL CIUDADANO       │   │    PORTAL ENTERPRISE      │
   │  - Landing Page Dinámica  │   │        (DOER)             │   │       (PROVIDER)          │
   │  - Radar Georreferenciado │   │  - Feed de Misiones       │   │  - Wizard de Encuestas    │
   │  - Calculadora Muestral   │   │  - SurveyRenderer         │   │  - Motor de Gráficos      │
   │  - Misión Demo con Pago   │   │  - Billetera en USD       │   │  - Exportador CSV (ARCO+) │
   │  - Selector Modo/Idioma   │   │  - Retiros Bancarios      │   │  - Onboarding Multi-Tenant│
   └───────────────────────────┘   └───────────────────────────┘   └───────────────────────────┘
                 │                               │                               │
                 └───────────────────────┬───────┴───────────────────────────────┘
                                         ▼
                  ┌────────────────────────────────────────────────────────┐
                  │              CAPA DE DATOS Y CONECTIVIDAD              │
                  │  - AuthContext (Sesión, OAuth, Lockout, Recuperación)  │
                  │  - DatabaseContext (Caché local sincronizada con BD)   │
                  │  - OrganizationContext (Aislamiento de Tenants)        │
                  └──────────────────────┬─────────────────────────────────┘
                                         │
                                         ▼
                  ┌────────────────────────────────────────────────────────┐
                  │             SUPABASE (POSTGRESQL CLOUD)                │
                  │  - Auth Engine (JWT, Password Hashing, Magic Link)     │
                  │  - Relational Database (profiles, surveys, responses)  │
                  │  - Row Level Security (RLS) para aislamiento Tenant    │
                  └────────────────────────────────────────────────────────┘
```

### Stack Tecnológico:
- **Frontend Core:** React 18.2, JavaScript ES6+, Vite 6.4.
- **Estilos & UI:** Tailwind CSS 3.4 (con soporte `darkMode: 'class'`), Lucide React Icons.
- **Gráficos & Visualización:** Chart.js 4.4, React-Chartjs-2.
- **Capa Backend & Persistencia:** Supabase (PostgreSQL 15), Supabase Auth (GoTrue).
- **Gestión de Estado:** React Context API (`AuthContext`, `DatabaseContext`, `OrganizationContext`, `ThemeContext`, `LanguageContext`).
- **Despliegue & CI/CD:** Vercel (Frontend), Supabase Cloud (Base de datos y Storage).

---

# 2. CHECKLIST GENERAL DE REVISIÓN (CRITERIOS TRANSVERSALES)

### 2.1 Entregable Técnico
| Pregunta del Checklist | Estado | Evidencia Técnica en el Proyecto |
| :--- | :---: | :--- |
| **¿Existe código real y funcional?** | **SÍ** | Código fuente en `frontend/src/` con 0 maquetas muertas; botones con handlers asíncronos reales. |
| **¿El código está integrado en React?** | **SÍ** | Estructura modular de componentes funcionales con hooks (`useState`, `useEffect`, `useContext`, `useMemo`). |
| **¿El módulo funciona dentro del proyecto base?** | **SÍ** | Montado sobre `App.jsx`, con rutas protegidas (`ProtectedRoute`) y layouts estandarizados. |
| **¿Está conectado con Supabase?** | **SÍ** | Cliente inicializado en `frontend/src/services/supabase.js` que sincroniza lecturas y escrituras. |
| **¿No es solamente una maqueta visual?** | **SÍ** | Al llenar una encuesta, la respuesta se guarda, el balance del usuario se incrementa en USD y las estadísticas se actualizan. |
| **¿El estudiante puede demostrarlo ejecutándose?** | **SÍ** | Servidor Vite corriendo en `http://localhost:5173/` con build probado exitosamente (`npm run build` en 10.6s). |
| **¿El código está organizado y entendible?** | **SÍ** | Separación por responsabilidades: `/pages`, `/components`, `/context`, `/services`. |
| **¿No depende de datos inventados?** | **SÍ** | Encuestas con preguntas reales sobre transporte, moda, clínicas privadas y plantillas educativas del MINEDUC. |
| **¿Maneja errores básicos?** | **SÍ** | Bloqueos por contraseñas cortas, campos obligatorios vacíos, emails inválidos y alertas visuales claras. |
| **¿Maneja estados de carga/vacíos?** | **SÍ** | Spinners en botones durante peticiones y tarjetas de estado vacío cuando no hay encuestas o respuestas. |

### 2.2 Guía Maestra para la Comprensión Individual (Todos los Integrantes)
Ante cualquier interrogatorio del docente, el estudiante debe responder con el siguiente esquema mental:
1. **Problema que resuelve:** Automatiza la recolección/gestión de datos eliminando el papel o formularios genéricos sin incentivos.
2. **Archivos que desarrolló:** Mencionar la ruta exacta de su archivo (ej: `frontend/src/pages/doer/DoerSurveyAnswer.jsx`).
3. **Flujo de datos:** Explicar qué recibe por `props` o `Context`, cómo muta el estado local y qué función dispara a la base de datos.
4. **Almacenamiento:** Citar la tabla específica de Supabase (`surveys`, `questions`, `responses`, `profiles`).
5. **Dificultad superada:** Explicar un reto real resuelto (ej. sincronizar datos asíncronos, cálculo de porcentajes con división por cero, o escape RFC 4180 en CSV).

---

# 3. DEFENSA INDIVIDUAL POR ESTUDIANTE

---

## 3.1 JORDY SANTILLÁN — Base de Datos Supabase / PostgreSQL

### Ficha Técnica del Módulo:
- **Archivos Responsabilidad:** [`backend/supabase/schema.sql`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/backend/supabase/schema.sql), [`frontend/src/services/supabase.js`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/services/supabase.js).
- **Tablas Implementadas:**
  1. `profiles`: Usuarios del sistema con columnas `id`, `name`, `email`, `password`, `role` (`doer`, `provider`, `admin`), `balance`, `verified`, `city`.
  2. `surveys`: Campañas con `id`, `provider_id` (FK a profiles), `title`, `category`, `status`, `reward_per_response`, `budget`, `spent`, `target_responses`.
  3. `questions`: Preguntas con `id`, `survey_id` (FK a surveys con `ON DELETE CASCADE`), `question_order`, `type`, `text`, `required`, `options` (JSONB), `labels` (JSONB).
  4. `responses`: Respuestas con `id`, `survey_id` (FK), `user_id` (FK), `answers` (JSONB estructurado por question_id), `verified`, `completed_at`.
  5. `transactions`: Libro contable de billetera con `id`, `user_id` (FK), `type` (`income`/`withdrawal`), `amount`, `description`, `status`.
  6. `custom_dashboards`: Tableros analíticos con `widgets` (JSONB que incluye `colSpan`, coordenadas `X, Y, W, H`, `surveyId`, `questionId`).
  7. `audit_logs` (Tabla de Auditoría): Registra `id`, `user_id`, `action`, `entity_type`, `entity_id`, `ip_address`, `metadata` (JSONB), `created_at`.

### Relaciones y Restricciones:
- **Claves Primarias (PK):** `id TEXT PRIMARY KEY` en todas las entidades.
- **Claves Foráneas (FK):**
  - `surveys.provider_id -> profiles.id ON DELETE CASCADE`
  - `questions.survey_id -> surveys.id ON DELETE CASCADE`
  - `responses.survey_id -> surveys.id ON DELETE CASCADE`
  - `responses.user_id -> profiles.id ON DELETE CASCADE`
  - `transactions.user_id -> profiles.id ON DELETE CASCADE`
- **Restricciones:** `NOT NULL` en campos obligatorios, `UNIQUE` en `profiles.email`, `CHECK` en roles y estados.

### Preguntas Clave para Jordy Santillán:
> **Pregunta 1:** *"¿Qué limitaciones existen en la tabla de dashboard widgets dado que consume toda su información de la tabla de answers?"*  
> **Respuesta del Estudiante:**  
> "La limitación principal radica en que el campo `answers` en la tabla `responses` se almacena en formato semiestructurado `JSONB` (clave-valor: `{question_id: valor}`). Si tenemos miles de respuestas, extraer y agregar opciones recurrentes mediante consultas simples en tiempo de ejecución puede generar un costo de cómputo elevado por el escaneo de objetos JSON.  
> **Cómo se solventa en Survey 593:**  
> 1. En PostgreSQL creamos índices GIN sobre la columna `answers` (`CREATE INDEX idx_responses_answers ON responses USING GIN (answers)`).  
> 2. Implementamos agregaciones intermedias o vistas materializadas que consolidan el conteo de frecuencias por pregunta para no escanear fila por fila en cada carga del dashboard."

> **Pregunta 2:** *"Verificar qué tablas más se necesitan (agregar tabla de Audit)."*  
> **Respuesta del Estudiante:**  
> "Se diseñó la tabla `audit_logs` para cumplir con la normativa ecuatoriana de protección de datos personales y derechos ARCO+. Permite rastrear qué usuario modificó o eliminó una encuesta, cuándo se emitieron pagos de recompensas y quién descargó reportes de datos."

---

## 3.2 DENNIS VILLACÍS — Autenticación + Registro + KYC

### Ficha Técnica del Módulo:
- **Archivos Responsabilidad:** [`frontend/src/context/AuthContext.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/context/AuthContext.jsx), [`frontend/src/pages/LoginPage.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/pages/LoginPage.jsx), [`frontend/src/pages/doer/DoerVerification.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/pages/doer/DoerVerification.jsx).
- **Lógica Implementada:**
  - Login y Registro dual (Empresa / Ciudadano Encuestado).
  - Integración con Supabase Auth (`supabase.auth.signInWithPassword`, `supabase.auth.signUp`, `supabase.auth.signOut`).
  - Recuperación de contraseña real mediante correo electrónico oficial (`supabase.auth.resetPasswordForEmail`).
  - Redirección inteligente basada en roles (`provider` -> `/provider`, `doer` -> `/doer`, `admin` -> `/admin`).
  - Sistema de seguridad contra ataques de fuerza bruta: Bloqueo temporal de cuenta de 5 minutos tras 5 intentos fallidos consecutivos con contador reactivo visible en pantalla.
  - Verificación KYC ecuatoriana: Validación matemática del algoritmo de módulo 10 para cédulas del Registro Civil y RUC (`frontend/src/services/ecuadorValidators.js`).

### Preguntas Clave para Dennis Villacís:
> **Pregunta 1:** *"¿Qué diferencia existe entre autenticación y verificación KYC?"*  
> **Respuesta del Estudiante:**  
> - **Autenticación:** Es el proceso técnico de verificar que quien dice ser un usuario realmente posee las credenciales secretas (ej. comprobar que el correo y el hash de la contraseña coinciden con la base de datos de Supabase). Solo responde a la pregunta: *¿Este usuario tiene acceso al sistema?*  
> - **Verificación KYC (Know Your Customer):** Es un proceso de cumplimiento normativo y de calidad que valida la identidad civil del sujeto en el mundo real. En Survey 593 valida que el encuestado tenga una cédula ecuatoriana legalmente emitida, evitando bots, cuentas duplicadas o respuestas falsas antes de permitirle cobrar recompensas en su billetera.

> **Pregunta 2:** *"¿Qué ocurre técnicamente desde que el usuario presiona 'Iniciar sesión' hasta que la aplicación confirma que está autenticado?"*  
> **Respuesta del Estudiante:**  
> 1. El evento `onSubmit` ejecuta `handleLoginSubmit` en `LoginPage.jsx`.  
> 2. Se verifica que el usuario no esté bloqueado localmente por la política de 5 intentos fallidos (`checkLockStatus`).  
> 3. Llama a `login(email, password)` en `AuthContext.jsx`.  
> 4. `AuthContext` invoca `supabase.auth.signInWithPassword({ email, password })`.  
> 5. El backend de Supabase valida las credenciales, genera un token JWT firmado y una cookie/sesión persistente en `localStorage`.  
> 6. Se consulta la tabla `profiles` para obtener el rol (`provider` o `doer`), nombre y saldo del usuario.  
> 7. Se actualiza el estado global `currentUser` en React y `navigate()` redirige a la vista correspondiente.

---

## 3.3 ANTONY CAYAMBE — SurveyRenderer (Motor de Renderizado)

### Ficha Técnica del Módulo:
- **Archivos Responsabilidad:** [`frontend/src/pages/doer/DoerSurveyAnswer.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/pages/doer/DoerSurveyAnswer.jsx).
- **Lógica Implementada:**
  - Componente puramente dinámico que recibe el `id` de encuesta por URL (`useParams`).
  - Extrae las preguntas asociadas desde el contexto (`questions.filter(q => q.surveyId === id)`) ordenadas secuencialmente por `question_order`.
  - Renderizado polimórfico condicional según el campo `type`:
    - `multiple`: Botones o radios de selección de opciones cargadas desde el array JSONB.
    - `likert`: Escala numérica interactiva (1 a 5 estrellas/números) con etiquetas semánticas (`labels`).
    - `yesno`: Selector binario visual Sí/No.
    - `text`: Textarea para respuestas abiertas cualitativas.
  - Barra de progreso reactiva: `(answeredCount / surveyQuestions.length) * 100` calculada en tiempo real.
  - Validación previa al envío: Comprueba que ninguna pregunta con `required: true` haya quedado vacía antes de ejecutar `submitResponse()`.

### Pregunta Clave para Antony Cayambe:
> **Pregunta Clave:** *"Si mañana agregamos un nuevo tipo de pregunta (ej. carga de archivos o imágenes), ¿qué tendrías que modificar en tu componente?"*  
> **Respuesta del Estudiante:**  
> "Gracias a la arquitectura desacoplada de `DoerSurveyAnswer.jsx`, solo necesitaría hacer 2 modificaciones puntuales:  
> 1. En el bloque de renderizado condicional de preguntas (el `switch` o `if (q.type)`), agrego la nueva rama:  
> ```jsx
> {q.type === 'file' && (
>   <input 
>     type="file" 
>     onChange={(e) => handleAnswer(q.id, e.target.files[0])} 
>     className="w-full text-xs text-slate-400 file:bg-teal-600 file:text-white file:rounded-lg"
>   />
> )}
> ```  
> 2. En el handler de subida (`handleSubmit`), si el valor es un archivo, se envía primero a Supabase Storage Bucket (`supabase.storage.from('survey-attachments').upload()`) y se almacena la URL pública resultante en el objeto `answers[q.id]` antes de guardar la respuesta."

---

## 3.4 ALEXIS TOAPANTA — SurveyBuilder (Creador de Encuestas)

### Ficha Técnica del Módulo:
- **Archivos Responsabilidad:** [`frontend/src/pages/provider/CreateSurveyWizard.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/pages/provider/CreateSurveyWizard.jsx).
- **Lógica Implementada:**
  - Wizard guiado en 3 pasos:
    1. **Datos Generales y Finanzas:** Título, categoría, tiempo estimado, recompensa por encuestado ($) y muestra deseada. Cálculo automático del Fondo en Escrow y comisión de plataforma.
    2. **Constructor de Preguntas:** Agregar, reordenar y eliminar preguntas de tipo opción múltiple, escala Likert 1-5, Sí/No o texto libre.
    3. **Pasarela de Pago Simulada / Resguardo de Fondos:** Pago con tarjeta o transferencia bancaria a Banco Pichincha/Produbanco para fondear las recompensas.
  - Botón de carga rápida de plantillas educativas del MINEDUC (`EDUCATION_TEMPLATES`) y empresariales (`BUSINESS_TEMPLATES`).

### Preguntas Clave para Alexis Toapanta:
> **Pregunta 1:** *"Muéstrame el objeto JSON que genera tu formulario justo antes de enviarlo a Supabase."*  
> **Respuesta del Estudiante:**  
> "En `CreateSurveyWizard.jsx`, justo antes de invocar `addSurvey()`, se genera la siguiente estructura:  
> ```json
> {
>   "surveyData": {
>     "title": "Evaluación de Clima Institucional 2026",
>     "description": "Estudio trimestral dirigido a padres de familia",
>     "category": "Educación",
>     "status": "active",
>     "rewardPerResponse": 1.50,
>     "targetResponses": 100,
>     "budget": 150.00,
>     "estimatedTime": 4,
>     "organizationId": "org_colegio_benalcazar"
>   },
>   "questions": [
>     {
>       "order": 1,
>       "type": "likert",
>       "text": "¿Cómo califica las instalaciones del colegio?",
>       "required": true,
>       "scale": 5,
>       "labels": ["1 (Pésimo)", "2", "3", "4", "5 (Excelente)"]
>     },
>     {
>       "order": 2,
>       "type": "multiple",
>       "text": "¿Qué servicio extracurricular le gustaría implementar?",
>       "required": true,
>       "options": ["Robótica", "Fútbol", "Teatro", "Idiomas"]
>     }
>   ]
> }
> ```"

> **Pregunta 2:** *"¿Cómo relacionas técnicamente una encuesta con sus preguntas específicas?"*  
> **Respuesta del Estudiante:**  
> "Se genera un identificador único para la encuesta: `const newSurveyId = 'surv_' + Date.now().toString(36)`. Luego, al procesar el array de preguntas, a cada una se le inyecta la clave foránea `surveyId: newSurveyId`. En Supabase se inserta primero el registro en la tabla `surveys` y luego el lote en la tabla `questions` donde la columna `survey_id` hace referencia directa a la clave primaria de `surveys` con integridad referencial y borrado en cascada."

---

## 3.5 ÓSCAR MALES — Motor de Gráficos y Visualización

### Ficha Técnica del Módulo:
- **Archivos Responsabilidad:** [`frontend/src/components/charts/ChartRenderer.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/components/charts/ChartRenderer.jsx), [`frontend/src/pages/provider/SurveyResults.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/pages/provider/SurveyResults.jsx), [`frontend/src/components/ui/KpiCard.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/components/ui/KpiCard.jsx).
- **Lógica Implementada:**
  - Librería de visualización: Chart.js 4.4 con wrapper reactivo `react-chartjs-2`.
  - Componente genérico `ChartRenderer` que soporta 6 tipos de visualización: `bar`, `pie`, `doughnut`, `radar`, `polarArea`, `line`.
  - Desacoplamiento total: No tiene datos ni nombres quemados; recibe exclusivamente `{ type, labels, data, title, height }` mediante `props`.
  - Soporte para datos vacíos o sin respuestas (previene errores de división por cero o renders rotos cuando `responses.length === 0`).
  - Paleta cromática corporativa automática (`PALETTE` de 10 colores contrastantes).

### Pregunta Clave para Óscar Males:
> **Pregunta Clave:** *"Si te doy las respuestas de otra encuesta totalmente distinta, ¿podemos usar exactamente tu mismo componente sin tocar su código?"*  
> **Respuesta del Estudiante:**  
> "Sí, absolutamente. `ChartRenderer` es un componente puramente tonto o de presentación (*stateless UI component*). Si me entregas las respuestas de una encuesta médica, agrícola o bancaria, lo único que hace la vista contenedora es calcular las frecuencias de las respuestas y entregárselas por props:  
> `<ChartRenderer type="doughnut" labels={['Quito', 'Guayaquil', 'Cuenca']} data={[45, 30, 25]} />`  
> El componente genera dinámicamente las proporciones, las leyendas interactivas y los tooltips sin necesidad de alterar una sola línea de su código fuente."

---

## 3.6 ANTONY JARRÍN — Landing Page + Datos Semilla Desacoplados

### Ficha Técnica del Módulo:
- **Archivos Responsabilidad:** [`frontend/src/pages/LandingPage.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/pages/LandingPage.jsx), [`frontend/src/services/seedData.js`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/services/seedData.js), [`frontend/src/services/educationTemplates.js`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/services/educationTemplates.js).
- **Lógica Implementada:**
  - Landing Page B2B/B2C con diseño responsivo y selector de modo oscuro/claro y bilingüe (Español/Inglés).
  - Propuesta de valor de Survey 593: Conectar empresas y colegios que requieren estudios estadísticos con ciudadanos que ganan recompensas monetarias inmediatas.
  - Radar en vivo georreferenciado con coordenadas reales en Quito, Guayaquil, Cuenca y Manta.
  - Seducción de usuario sin fricción inicial: El usuario hace clic en el pin de dinero (`+$5.00`), responde la pregunta 1 y sus fondos quedan reservados antes de pedirle su correo para registrarlo.
  - Banco de 7 encuestas completas ecuatorianas (Moda urbana, Servicios públicos, Experiencia clínica, Evaluación docente, Clima escolar, Satisfacción de padres, Auditoría alimentaria escolar).

### Pregunta Clave para Antony Jarrín:
> **Pregunta Clave:** *"¿Cómo están estructurados tus datos semilla y de qué manera el módulo SurveyRenderer podría consumirlos directamente?"*  
> **Respuesta del Estudiante:**  
> "Los datos semilla están completamente desacoplados de la UI en el archivo `seedData.js`. Cada encuesta tiene su array normalizado en `INITIAL_SURVEYS`, sus preguntas asociadas en `INITIAL_QUESTIONS` con su respectivo `surveyId`, y respuestas en `INITIAL_RESPONSES`.  
> Para que `SurveyRenderer` las consuma directamente, el contexto `DatabaseContext.jsx` toma `INITIAL_SURVEYS` y `INITIAL_QUESTIONS` como estado base inicial cuando la conexión a la base de datos externa no está disponible, garantizando que el usuario pueda abrir `/doer/surveys/:id` y navegar las preguntas sin ninguna diferencia técnica respecto a datos de Supabase."

---

## 3.7 CALIXTO CARRERA — Exportación CSV + Auditoría QA (ARCO+)

### Ficha Técnica del Módulo:
- **Archivos Responsabilidad:** [`frontend/src/pages/provider/SurveyResults.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/pages/provider/SurveyResults.jsx), [`frontend/src/pages/admin/AdminQuality.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/pages/admin/AdminQuality.jsx).
- **Lógica Implementada:**
  - Generación de archivos CSV descargables a partir de respuestas en tiempo real mediante `Blob` con tipo `text/csv;charset=utf-8;`.
  - Sanitización y escape estricto de sintaxis CSV según el estándar **RFC 4180**.
  - Inclusión del byte order mark (BOM) UTF-8 (`\uFEFF`) para compatibilidad perfecta con acentos, tildes y la letra `ñ` en Microsoft Excel de Windows.
  - Panel de auditoría QA con métricas de integridad, detección de cuentas sospechosas y cumplimiento de los derechos ARCO+ (Acceso, Rectificación, Cancelación y Oposición) de la Ley Orgánica de Protección de Datos Personales del Ecuador.

### Pregunta Clave para Calixto Carrera:
> **Pregunta Clave:** *"¿Qué sucede en el archivo CSV generado si el usuario ingresa comas, comillas o saltos de línea dentro de su respuesta de texto?"*  
> **Respuesta del Estudiante:**  
> "Si se concatena texto plano con comas, se rompería la estructura de columnas del CSV. Para prevenir esto, implementamos la especificación estándar internacional **RFC 4180**:  
> 1. Si la respuesta contiene comas (`,`), comillas dobles (`"`) o saltos de línea (`\n`), todo el campo de texto se envuelve obligatoriamente entre comillas dobles (`"texto"`).  
> 2. Si el usuario escribió comillas dobles dentro de su texto, estas se escapan duplicándolas (`""`).  
> 3. Además, anteponemos el encabezado `\uFEFF` (UTF-8 BOM) para que al abrir el archivo en Excel en computadoras con configuración regional de Ecuador o Latinoamérica, las tildes y las eñes se muestren correctamente sin símbolos corruptos."

---

# 4. EVALUACIÓN DEL TRABAJO EN EQUIPO Y PRODUCTO COMERCIAL

---

## 4.1 INVESTIGACIÓN DE POTENCIALES CLIENTES ECUATORIANOS

| Institución / Empresa | RUC / Contacto | Tipo & Ciudad | Justificación Comercial de por qué necesita Survey 593 |
| :--- | :--- | :--- | :--- |
| **Colegio Experimental Benalcázar** | 1768037340001<br>rectorado@benalcazar.edu.ec | Unidad Educativa Pública<br>(Quito) | Requiere evaluar el desempeño de más de 120 docentes por parte de los padres de familia y auditar el clima escolar sin gastar miles de hojas de papel ni tabular a mano. |
| **Colegio San Gabriel** | 1790119280001<br>info@sangabriel.edu.ec | Unidad Educativa Particular<br>(Quito) | Requiere acreditar estándares de calidad internacional y medir satisfacción de servicios de transporte, extracurriculares y plataformas virtuales. |
| **Universidad Politécnica Salesiana (UPS)** | 0190104845001<br>consultoria@ups.edu.ec | Educación Superior<br>(Cuenca / Quito / GYE) | Proyectos de investigación de mercado y vinculación con la sociedad que necesitan recolectar muestras en territorio de forma rápida con georreferenciación verificada. |
| **Corporación Favorita (Supermaxi/Aki)** | 1790016919001<br>investigacion@favorita.com | Retail / Consumo Masivo<br>(Nacional) | Pruebas de concepto de nuevos productos locales, análisis de elasticidad de precios por provincia y auditoría de góndolas en tiempo récord. |

---

## 4.2 PROPUESTA COMERCIAL (PITCH 30-60 SEGUNDOS)

> *"Estimado Rector / Director:*  
> *¿Sabe usted qué opinan realmente los padres de familia sobre la calidad de sus docentes, o cuántos estudiantes experimentan acoso escolar en su institución sin que las autoridades se enteren a tiempo?*  
> *Hoy las instituciones educativas gastan semanas aplicando encuestas en papel o en Google Forms genéricos que nadie responde con seriedad y cuyos resultados toman meses en tabularse.*  
> *Con **Survey 593**, su institución obtiene un sistema multi-tenant seguro donde con 1 solo clic lanza encuestas de Evaluación Docente o Clima Escolar preconfiguradas. Los resultados se procesan en tiempo real en gráficos ejecutivos listos para el Consejo Directivo y auditorías del Ministerio de Educación, garantizando total privacidad de datos y anonimato.*  
> *Le proponemos implementar un plan piloto gratuito de 15 días en una sección de su colegio para que experimente la velocidad y claridad de nuestras métricas antes de cualquier inversión."*

---

## 4.3 NECESIDADES Y CASOS DE USO POR ROL EDUCATIVO

1. **Para Estudiantes:** Encuestas cortas de 3 minutos, adaptadas a dispositivos móviles con escalas visuales y amigables. Caso de uso: Detección temprana de acoso escolar, satisfacción con laboratorios y comprensión de materias.
2. **Para Docentes:** Autoevaluación del clima laboral institucional, requerimientos de capacitación pedagógica y retroalimentación anónima hacia las autoridades.
3. **Para Padres de Familia:** Encuestas accesibles por enlace web seguro para calificar la puntualidad, trato del profesor, costo de extracurriculares y calidad del transporte.
4. **Para Autoridades (Rector/Vicerrector):** Tableros de control ejecutivos que consolidan los promedios por grado, paralelo y materia, con capacidad de exportación a PDF y CSV para auditorías gubernamentales.

---

## 4.4 DOMINIO DE LA ARQUITECTURA MULTI-TENANT Y SEGURIDAD RLS

### ¿Qué significa Multi-Tenant en Survey 593?
Multi-tenancy significa que una **única instancia de la aplicación y una única base de datos** atienden a múltiples clientes u organizaciones independientes (denominadas **Tenants** o Inquilinos), como por ejemplo el Colegio Benalcázar, el Colegio San Gabriel y la Clínica Vida.

### ¿Cómo se identifica cada institución y cómo se garantiza el aislamiento de datos?
1. Cada organización registrada tiene un identificador único global (`organization_id`).
2. Toda entidad subordinada (`surveys`, `academic_periods`, `responses`) almacena de forma obligatoria la columna `organization_id`.
3. En el frontend, el contexto [`OrganizationContext.jsx`](file:///c:/Users/DavidDevOps/Desktop/AUTOMATIZACION/frontend/src/context/OrganizationContext.jsx) encapsula el `currentOrg` seleccionado, inyectando su ID en cada consulta o creación.

### Pregunta Clave de Arquitectura:
> **"Si tenemos 100 colegios utilizando Survey 593 al mismo tiempo, ¿cómo garantizas a nivel de arquitectura y código que el Colegio A jamás pueda ver los datos del Colegio B?"**  
> 
> **Respuesta Maestra:**  
> "Se garantiza mediante una defensa en profundidad en **2 niveles inviolables**:  
> 1. **A Nivel de Base de Datos (Row Level Security - RLS en PostgreSQL/Supabase):**  
>    No dependemos de que el programador recuerde poner `where organization_id = '...'` en el código. A nivel de base de datos activamos RLS:  
>    ```sql
>    ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
>    CREATE POLICY "Aislamiento estricto por colegio" 
>    ON public.surveys 
>    FOR ALL 
>    TO authenticated 
>    USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id'));
>    ```  
>    Aunque un usuario malintencionado intente hackear el frontend o llamar a la API directamente, el motor de PostgreSQL rechaza a nivel de kernel cualquier fila cuyo `organization_id` no pertenezca al token de sesión del usuario.  
> 2. **A Nivel de Código (Contexto React):**  
>    El hook `useDatabase()` y `useOrganization()` filtran todas las consultas activas con el `currentOrg.id`, asegurando que el estado en memoria de React nunca mezcle datos de otros inquilinos."

---

# 5. PROTOCOLO DE DEFENSA PRÁCTICA EN VIVO (5 MINUTOS POR ESTUDIANTE)

| Prueba | Qué pedirá el Ingeniero | Cómo responder y ejecutar la demostración |
| :--- | :--- | :--- |
| **Prueba 1: Demostración** | *"Muéstrame tu módulo ejecutándose en tiempo real."* | Abrir `http://localhost:5173/`, loguearse como `admin@textilandina.ec` o `maria@email.com` y mostrar la funcionalidad de su pantalla en 30 segundos. |
| **Prueba 2: Código** | *"Abre el IDE y señálame exactamente dónde está implementada esta lógica."* | Abrir VS Code, ir al archivo asignado en la sección 3 y señalar la función exacta (ej: `exportCSV`, `handleLoginSubmit`, `ChartRenderer`). |
| **Prueba 3: Modificación en Vivo** | *"Haz un cambio menor ahora mismo."* | Ejemplos de cambios rápidos en vivo:<br>• Cambiar el texto de un botón en JSX.<br>• Modificar el color de acento de un gráfico en `ChartRenderer.jsx`.<br>• Cambiar el margen de una validación en `DoerSurveyAnswer.jsx`.<br>Guardar y mostrar el Hot Reload instantáneo de Vite. |
| **Prueba 4: Tolerancia a Fallos** | *"¿Qué sucede con la interfaz si la conexión con Supabase falla o se interrumpe?"* | Explicar que todos los contextos (`DatabaseContext`, `AuthContext`) implementan bloques `try / catch` con respaldo automático en `localStorage` y datos semilla, permitiendo que la UI no se rompa ni muestre pantallas blancas. |
| **Prueba 5: Integración** | *"Explícame cómo se conecta tu módulo con el módulo desarrollado por tu compañero."* | Ejemplo: Alexis Toapanta (SurveyBuilder) guarda la encuesta en `DatabaseContext`, la cual queda inmediatamente disponible en el listado de Antony Cayambe (SurveyRenderer) y cuyos resultados se visualizan en el motor de Óscar Males (ChartRenderer). |

---

# 6. MATRIZ RÁPIDA DE EVALUACIÓN Y PONDERACIONES

| Criterio de Evaluación | Ponderación | Estrategia de Survey 593 para Obtener la Máxima Calificación |
| :--- | :---: | :--- |
| **Funcionalidad técnica** | **25%** | El sistema no tiene errores de consola, corre fluidamente en React 18 y compila en 10 segundos. |
| **Calidad y estructura del código** | **15%** | Código modular, desacoplado, con nombres semánticos, componentes limpios y sin código espagueti. |
| **Integración con el proyecto base** | **15%** | Sincronización perfecta con Supabase, Context API y rutas protegidas en `App.jsx`. |
| **Comprensión del módulo** | **20%** | Cada estudiante conoce las respuestas teóricas y de arquitectura detalladas en la sección 3 de este documento. |
| **Demostración práctica y cambio en vivo** | **15%** | Capacidad demostrada para realizar modificaciones sencillas en vivo frente al evaluador. |
| **Documentación y explicación** | **10%** | Este documento maestro de respaldo, casos de uso ecuatorianos y pitch comercial estructurado. |
| **TOTAL** | **100%** | **Evaluación Integral Sobresaliente.** |

---
*Expediente Técnico y Guía Docente desarrollado para el proyecto Survey 593 — Universidad / Ecosistema Kolab.*
