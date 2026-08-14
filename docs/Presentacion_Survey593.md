# Diapositivas: Defensa de Arquitectura - Survey 593

*Instrucción para el equipo: Utilicen este contenido estructurado para armar las diapositivas de la defensa final (pueden copiarlo en PowerPoint, Canva o Google Slides).*

---

## Diapositiva 1: Portada
**Título:** Survey 593 - Arquitectura y Plataforma de Monetización de Datos
**Subtítulo:** Proyecto #1 del Ecosistema Kolab
**Autores:** Equipo de Arquitectura y Desarrollo (Tu nombre y el equipo)
**Fecha:** (Insertar Fecha)

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

## Diapositiva 4: Modelo de Negocio (¿Cómo ganamos todos?)
- 🏢 **Providers (Empresas/Campañas):** Ganan al obtener datos 100% reales, altamente segmentados y resultados con gráficos en tiempo real, a una fracción del costo tradicional.
- 👤 **Doers (Usuarios):** Ganan dinero depositado en sus wallets por cada encuesta respondida honestamente. ¡Su opinión tiene valor financiero!
- ⚙️ **Dueños / Kolab:** Ganan a través de un **fee de transacción** (margen retenido entre lo que paga la empresa y lo que se deposita al usuario) y al enriquecer la base de datos central del ecosistema.

*Ejemplo Práctico:* Supermaxi paga $500 por 500 encuestas ($1 c/u). El usuario recibe $0.70 por responder; Kolab retiene $0.30 por procesamiento ($150 de ganancia pura por campaña).

---

## Diapositiva 5: Retos Arquitectónicos y NFRs
**¿Cuáles fueron los retos principales al diseñar esta plataforma financiera/datos?**
1. **Seguridad / Anti-fraude:** Evitar que bots o usuarios múltiples vacíen el presupuesto de las empresas.
   - *Solución:* Integración de proveedor KYC (Know Your Customer) y motor de calidad de datos ARCO+.
2. **Alta Disponibilidad:** Los clientes B2B deben ver sus dashboards en tiempo real, sin interrupciones.
3. **Escalabilidad y Rendimiento:** Procesar picos de cientos de usuarios respondiendo encuestas simultáneamente tras una notificación push.

---

## Diapositiva 6: Arquitectura de Alto Nivel (Modelo C4)
*(Insertar la imagen del Diagrama de Contexto C1 o Contenedores C2 que está en el DDA)*
- **Plataforma Core (SPA + API + DB):** Donde viven los 3 paneles (Doer, Provider, Admin).
- **Integraciones Clave:** 
  - *Stripe/Kushki* (Pagos).
  - *KYC Provider* (Validación de identidad).
  - *Kolab Core* (Single Sign-On).

---

## Diapositiva 7: Infraestructura en la Nube (La Solución)
*(Insertar Diagrama de Despliegue en AWS del DDA)*
- **Frontend SPA:** Alojado en Amazon S3 + CloudFront (Velocidad global, costo marginal).
- **Backend API:** AWS Fargate (Serverless Containers). Nos permite auto-escalar cuando enviamos notificaciones push masivas, sin pagar servidores ociosos.
- **Base de Datos (RDS PostgreSQL):** Asegura transacciones financieras ACID para las wallets de los usuarios.
- **Redis (ElastiCache):** Acelera la entrega de resultados estadísticos a los dashboards de las empresas.

---

## Diapositiva 8: Decisiones Clave (Trade-offs / ADRs)
**Reto:** "Las miles de respuestas entrantes podrían bloquear el dashboard de lectura de las empresas."
**Decisión Estratégica (ADR-002):** Implementar el patrón CQRS (separación de lectura y escritura) mediante una *Read Replica* en PostgreSQL.
- **Lo que sacrificamos:** Consistencia estricta (los gráficos pueden tener 1 o 2 segundos de retraso).
- **Lo que ganamos:** Escalabilidad comercial y 99.99% de disponibilidad en picos de tráfico extremo, garantizando la satisfacción del cliente empresarial.

---

## Diapositiva 9: Demo de la Plataforma
- Arquitectura implementada en una SPA con ruteo local.
- Panel de Encuestados, Panel de Empresas y Panel Administrativo (Kolab).
- *(Mostrar en vivo o con capturas de pantalla la plataforma que ya se construyó en HTML/JS/CSS).*
- Link al repositorio de GitHub para revisar el código fuente.

---

## Diapositiva 10: Conclusión y Preguntas
- Survey 593 no es solo una app; es infraestructura de datos monetizada.
- Arquitectura Cloud-Native lista para escalar y libre de fraude.
- **¡Gracias! ¿Tienen alguna pregunta?**
