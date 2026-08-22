# Diapositivas: Defensa de Arquitectura - Survey 593

*Instrucción para el equipo: Utilicen este contenido estructurado para armar las diapositivas de la defensa final (pueden copiarlo en PowerPoint, Canva o Google Slides).*

---

## Diapositiva 1: Portada
**Título:** Survey 593 - Arquitectura y Plataforma de Monetización de Datos
**Subtítulo:** Proyecto #1 del Ecosistema Kolab
**Autores:** Equipo de Arquitectura y Desarrollo Fernando Cajias , Jordy Santillan , Dennis Villasis, Dennis Toapanta, Calixto Carrera, Antony Cayambe, Oscar Males, Antony Jarrin
**Fecha:** 11 septiembre de 2026

---

## Diapositiva 2: El Problema (Visión General)
- **El mercado tradicional está roto:** Las empresas y campañas políticas pagan altas sumas ($) y esperan semanas para obtener estudios de mercado que a menudo sufren de sesgos, datos falsos o respuestas automatizadas.
- **La oportunidad perdida:** Miles de ciudadanos generan datos diariamente sin recibir una retribución justa por su tiempo u opinión.

---

## Diapositiva 3: Nuestra Solución (Survey 593)
- **¿Qué es?** Una plataforma Open SaaS que actúa como puente directo entre quien necesita información y quien está dispuesto a darla.
- **Transparencia y Cero Fraudes:** Validamos a cada usuario y recompensamos directamente sus respuestas verificadas.
- **Propósito Estratégico:** Survey 593 es el "vendedor interno de datos" del Ecosistema Kolab, proveyendo bases de datos confiables y diversas para alimentar otros 15 proyectos futuros.

---

## Diapositiva 4: La Gran Innovación (No-Code BI Studio Drag & Drop)
- **Más allá de un simple dashboard estático:** Los clientes empresariales no quieren reportes rígidos prediseñados.
- **Empoderamiento Total:** Integramos un **Constructor Visual No-Code** donde el cliente arrastra widgets (Gráficos de Pastel, Radar/Ángulos, Barras, Polar y Tarjetas KPI) a un lienzo interactivo.
- **Data Binding Automático:** El usuario selecciona la encuesta, la pregunta y el tipo de cálculo, vinculándose inmediatamente con la base de datos sin escribir una sola línea de código.

---

## Diapositiva 5: Modelo de Negocio (¿Cómo ganamos todos?)
- 🏢 **Providers (Empresas/Campañas):** Ganan al obtener datos 100% reales y diseñar sus propios dashboards a medida para juntas directivas.
- 👤 **Doers (Usuarios):** Ganan dinero depositado en sus wallets por cada encuesta respondida honestamente. ¡Su opinión tiene valor financiero!
- ⚙️ **Dueños / Kolab:** Ganan a través de un **fee de transacción** (margen retenido entre lo que paga la empresa y lo que se deposita al usuario) y al enriquecer la base de datos central del ecosistema.

*Ejemplo Práctico:* Supermaxi paga $500 por 500 encuestas ($1 c/u). El usuario recibe $0.70 por responder; Kolab retiene $0.30 por procesamiento ($150 de ganancia pura por campaña).

---

## Diapositiva 6: Retos Arquitectónicos y NFRs
**¿Cuáles fueron los retos principales al diseñar esta plataforma financiera/datos?**
1. **Seguridad / Anti-fraude:** Evitar que bots o usuarios múltiples vacíen el presupuesto de las empresas.
   - *Solución:* Integración de proveedor KYC (Know Your Customer) y motor de calidad de datos ARCO+.
2. **Alta Disponibilidad:** Los clientes B2B deben ver sus dashboards en tiempo real, sin interrupciones.
3. **Escalabilidad y Rendimiento:** Procesar picos de cientos de usuarios respondiendo encuestas simultáneamente tras una notificación push.

---

## Diapositiva 7: Arquitectura de Alto Nivel (Modelo C4)
*(Insertar la imagen del Diagrama de Contexto C1 o Contenedores C2 que está en el DDA)*
- **Plataforma Core (SPA + API + DB):** Donde viven los 3 paneles (Doer, Provider, Admin) y el nuevo No-Code Studio.
- **Integraciones Clave:** 
  - *Stripe/Kushki* (Pagos).
  - *KYC Provider* (Validación de identidad).
  - *Kolab Core* (Single Sign-On).

---

## Diapositiva 8: Infraestructura en la Nube & Decisiones (ADRs)
- **Frontend SPA:** Alojado en Amazon S3 + CloudFront (Velocidad global, costo marginal).
- **Backend API:** AWS Fargate (Serverless Containers). Nos permite auto-escalar cuando enviamos notificaciones push masivas.
- **Base de Datos (RDS PostgreSQL):** Transacciones financieras ACID para las wallets de los usuarios.
- **ADR-003 (No-Code BI Engine):** Motor declarativo JSON para persistir y renderizar tableros personalizados al vuelo.

---

## Diapositiva 9: Estrategia de Calidad (QA) y Roadmap de Producción
- **Plan de Pruebas (QA):**
  - *E2E Automatizado:* **Playwright / Cypress** para simular visualmente flujos de encuestas y drag-and-drop.
  - *Pruebas Unitarias:* **Vitest / Jest** para validación matemática de wallets y compensaciones.
  - *Pruebas de Carga:* **k6** para simular 5,000 usuarios concurrentes.
- **Framework para Producción (Ideal para Juniors):**
  - **Frontend:** **React + Vite + Tailwind CSS** (Curva de aprendizaje suave, componentes modulares y gran ecosistema de Drag & Drop vs la complejidad de Angular).
  - **Backend & BDD:** **Supabase (PostgreSQL Cloud)** (Autenticación lista, seguridad de base de datos relacional y APIs automáticas sin sobrecargar a desarrolladores novatos).

---

## Diapositiva 10: Demo en Vivo y Conclusión
- **Demostración Práctica:**
  - 1. Responder encuesta como Doer y recibir saldo en Wallet.
  - 2. Abrir el **Dashboard Studio No-Code**, arrastrar widgets de Pastel y Radar, y vincularlos a datos reales.
  - 3. Ver el Dashboard en Modo Presentación con filtros demográficos en vivo.
- **Conclusión:** Survey 593 no es solo una app; es un motor de Business Intelligence y monetización de datos.
- **¡Gracias! ¿Tienen alguna pregunta?**
