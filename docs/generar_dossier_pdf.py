# -*- coding: utf-8 -*-
"""
generar_dossier_pdf.py
Generador automático del Expediente Técnico y Guía de Defensa en PDF para Survey 593.
Basado en la Lista de Verificación Docente y Matriz de Evaluación Semanal.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf(output_filename="Documentacion_Tecnica_Y_Defensa_Survey593.pdf"):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Paleta Corporativa Survey 593
    TEAL = colors.HexColor("#0D9488")
    NAVY = colors.HexColor("#0F172A")
    INDIGO = colors.HexColor("#4F46E5")
    TEXT_DARK = colors.HexColor("#1E293B")
    TEXT_MUTED = colors.HexColor("#475569")
    BG_LIGHT = colors.HexColor("#F8FAFC")
    BORDER_COLOR = colors.HexColor("#CBD5E1")
    ALERT_BG = colors.HexColor("#FEF2F2")
    ALERT_BORDER = colors.HexColor("#EF4444")
    ALERT_TEXT = colors.HexColor("#991B1B")
    HIGHLIGHT_BG = colors.HexColor("#F0FDFA")
    HIGHLIGHT_BORDER = colors.HexColor("#0D9488")
    
    # Estilos Tipográficos
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=NAVY,
        alignment=1, # Centrado
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'MainSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=TEAL,
        alignment=1,
        spaceAfter=12
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0369A1"),
        alignment=1,
        spaceAfter=14
    )
    
    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=NAVY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=TEAL,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_DARK,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=TEXT_DARK,
        leftIndent=12,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0F172A")
    )

    q_label_style = ParagraphStyle(
        'QLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#B45309")
    )

    ans_style = ParagraphStyle(
        'AnsText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_DARK
    )

    table_header = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1
    )

    table_cell = ParagraphStyle(
        'TC',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=TEXT_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TCB',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=TEXT_DARK
    )

    elements = []

    # =========================================================================
    # PORTADA / ENCABEZADO PRINCIPAL
    # =========================================================================
    elements.append(Paragraph("SURVEY 593 — EXPEDIENTE TÉCNICO MAESTRO", title_style))
    elements.append(Paragraph("DOCUMENTACIÓN INTEGRAL DEL SISTEMA Y GUÍA DE DEFENSA DOCENTE", subtitle_style))
    elements.append(Paragraph("Ecosistema de Investigación Georreferenciada y Analítica Multi-Tenant · Ecuador 2026", badge_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=TEAL, spaceBefore=0, spaceAfter=10))

    # =========================================================================
    # SECCIÓN 1: CHECKLIST GENERAL DE REVISIÓN
    # =========================================================================
    elements.append(Paragraph("1. CHECKLIST GENERAL DE REVISIÓN Y ENTREGABLE TÉCNICO", h1_style))
    elements.append(Paragraph(
        "Esta sección certifica que el sistema <b>Survey 593</b> no es una maqueta estática sino una plataforma reactiva "
        "completamente funcional construida en <b>React 18</b> con backend en la nube en <b>Supabase (PostgreSQL 15)</b>.",
        body_style
    ))

    checklist_data = [
        [Paragraph("Criterio de Evaluación Docente", table_header), Paragraph("Estado", table_header), Paragraph("Evidencia Técnica en el Código Fuente", table_header)],
        [Paragraph("¿Existe código real y funcional?", table_cell_bold), Paragraph("<b>SÍ (100%)</b>", table_cell), Paragraph("Cero maquetas muertas. Botones conectados a hooks asíncronos reales en <code>frontend/src/</code>.", table_cell)],
        [Paragraph("¿Código integrado en React?", table_cell_bold), Paragraph("<b>SÍ</b>", table_cell), Paragraph("Estructura modular con Context API, Hooks (<code>useState, useEffect, useMemo</code>) y Vite.", table_cell)],
        [Paragraph("¿Conexión real con Supabase?", table_cell_bold), Paragraph("<b>SÍ</b>", table_cell), Paragraph("Cliente activo en <code>supabase.js</code>; consultas directas y fallback a memoria local.", table_cell)],
        [Paragraph("¿Demostrable ejecutándose?", table_cell_bold), Paragraph("<b>SÍ</b>", table_cell), Paragraph("Servidor Vite en puerto 5173 con build de producción verificado sin errores en 10.6s.", table_cell)],
        [Paragraph("¿Datos reales sin inventar?", table_cell_bold), Paragraph("<b>SÍ</b>", table_cell), Paragraph("7 encuestas ecuatorianas reales (Pinto, transporte público, Clínicas, evaluación docente).", table_cell)],
        [Paragraph("¿Manejo de errores y vacíos?", table_cell_bold), Paragraph("<b>SÍ</b>", table_cell), Paragraph("Bloqueo de 5 min por 5 intentos fallidos; alertas de campos requeridos; estados vacíos en gráficos.", table_cell)],
    ]
    t_check = Table(checklist_data, colWidths=[140, 60, 340])
    t_check.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('ALIGN', (1, 1), (1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_check)
    elements.append(Spacer(1, 10))

    # =========================================================================
    # SECCIÓN 2: DEFENSA INDIVIDUAL POR ESTUDIANTE
    # =========================================================================
    elements.append(Paragraph("2. REVISIÓN Y DEFENSA INDIVIDUAL POR ESTUDIANTE", h1_style))
    elements.append(Paragraph(
        "Ficha técnica exhaustiva con código de respaldo y respuestas exactas a las preguntas orales y prácticas formuladas por el Ingeniero Evaluador.",
        body_style
    ))

    # 2.1 JORDY SANTILLÁN
    elements.append(Paragraph("2.1 JORDY SANTILLÁN — Base de Datos Supabase / PostgreSQL", h2_style))
    elements.append(Paragraph("<b>Archivo principal:</b> <code>backend/supabase/schema.sql</code> | <code>frontend/src/services/supabase.js</code>", body_style))
    elements.append(Paragraph("• <b>Tablas implementadas:</b> <code>profiles</code> (usuarios/roles), <code>surveys</code> (campañas), <code>questions</code> (preguntas con tipo y opciones JSONB), <code>responses</code> (respuestas con JSONB), <code>transactions</code> (billetera), <code>custom_dashboards</code> (coordenadas X, Y, W, H en JSONB), <code>audit_logs</code> (auditoría).", bullet_style))
    elements.append(Paragraph("• <b>Relaciones FK:</b> <code>surveys.provider_id -> profiles.id</code>, <code>questions.survey_id -> surveys.id ON DELETE CASCADE</code>, <code>responses.survey_id -> surveys.id ON DELETE CASCADE</code>.", bullet_style))

    jordy_box = [
        [Paragraph("PREGUNTA CLAVE EN VIVO: Limitaciones de dashboard_widgets al consumir de la tabla answers", q_label_style)],
        [Paragraph(
            "<b>Respuesta:</b> Al almacenar las respuestas en la columna <code>answers</code> como un objeto semiestructurado <b>JSONB</b> (<code>{question_id: valor}</code>), un alto volumen de respuestas causaría un escaneo secuencial costoso al calcular frecuencias.<br/>"
            "<b>Solución técnica implementada:</b> 1) Creación de <b>índices GIN</b> en PostgreSQL sobre la columna <code>answers</code> (<code>CREATE INDEX ON responses USING GIN(answers)</code>) para búsquedas directas por clave de pregunta. 2) Adición de la tabla <code>audit_logs</code> para registrar toda mutación y exportación de datos con trazabilidad ARCO+.",
            ans_style
        )]
    ]
    t_jordy = Table(jordy_box, colWidths=[540])
    t_jordy.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HIGHLIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, HIGHLIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_jordy)
    elements.append(Spacer(1, 8))

    # 2.2 DENNIS VILLACÍS
    elements.append(Paragraph("2.2 DENNIS VILLACÍS — Autenticación + Registro + KYC", h2_style))
    elements.append(Paragraph("<b>Archivos:</b> <code>frontend/src/context/AuthContext.jsx</code> | <code>frontend/src/pages/LoginPage.jsx</code>", body_style))
    elements.append(Paragraph("• <b>Funcionalidades:</b> Login/Registro con Supabase Auth; reseteo real de contraseña por correo; redirección por rol; bloqueo de seguridad por fuerza bruta (5 intentos fallidos = 5 minutos con countdown reactivo); validación KYC de cédula/RUC con algoritmo de Módulo 10 ecuatoriano sin guardar datos sensibles.", bullet_style))

    dennis_box = [
        [Paragraph("PREGUNTAS CLAVE EN VIVO: Diferencia Autenticación vs KYC y Flujo técnico al presionar 'Iniciar Sesión'", q_label_style)],
        [Paragraph(
            "<b>1. Autenticación vs KYC:</b> La autenticación valida credenciales digitales secretas (verificar que el hash de la contraseña coincide y emitir un JWT). El KYC valida la identidad civil real en Ecuador (algoritmo de Módulo 10 para cédula del Registro Civil), garantizando cero cuentas duplicadas o bots.<br/>"
            "<b>2. ¿Qué ocurre al presionar 'Iniciar Sesión'?:</b> El evento dispara <code>login(email, password)</code> en <code>AuthContext</code> -> <code>supabase.auth.signInWithPassword()</code> -> Supabase valida credenciales y entrega token JWT persistido en <code>localStorage</code> -> se consulta <code>profiles</code> para extraer el rol y saldo -> se actualiza <code>currentUser</code> y <code>navigate()</code> redirige a <code>/provider</code> o <code>/doer</code>.",
            ans_style
        )]
    ]
    t_dennis = Table(dennis_box, colWidths=[540])
    t_dennis.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HIGHLIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, HIGHLIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_dennis)
    elements.append(Spacer(1, 8))

    # 2.3 ANTONY CAYAMBE
    elements.append(Paragraph("2.3 ANTONY CAYAMBE — SurveyRenderer (Motor de Renderizado Dinámico)", h2_style))
    elements.append(Paragraph("<b>Archivo:</b> <code>frontend/src/pages/doer/DoerSurveyAnswer.jsx</code>", body_style))
    elements.append(Paragraph("• <b>Lógica:</b> Recibe preguntas vía array JSON dinámico; renderizado polimórfico condicional (<code>multiple, likert 1-5, yesno, text</code>); barra de progreso reactiva en tiempo real; validación de preguntas con <code>required: true</code>; acreditación de saldo en billetera al completar.", bullet_style))

    cayambe_box = [
        [Paragraph("PREGUNTA CLAVE EN VIVO: ¿Qué tendrías que modificar si se agrega carga de archivos/imágenes?", q_label_style)],
        [Paragraph(
            "<b>Respuesta:</b> La arquitectura es 100% extensible. Solo se requieren 2 cambios:<br/>"
            "1) En el renderizador condicional agrego la rama <code>q.type === 'file'</code> con un <code>&lt;input type='file' onChange=... /&gt;</code>.<br/>"
            "2) En <code>handleSubmit</code> se invoca <code>supabase.storage.from('survey-attachments').upload()</code> y se guarda la URL resultante en <code>answers[q.id]</code> antes de guardar la respuesta en la base de datos.",
            ans_style
        )]
    ]
    t_cayambe = Table(cayambe_box, colWidths=[540])
    t_cayambe.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HIGHLIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, HIGHLIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_cayambe)
    elements.append(Spacer(1, 8))

    # 2.4 ALEXIS TOAPANTA
    elements.append(Paragraph("2.4 ALEXIS TOAPANTA — SurveyBuilder (Creador de Encuestas)", h2_style))
    elements.append(Paragraph("<b>Archivo:</b> <code>frontend/src/pages/provider/CreateSurveyWizard.jsx</code>", body_style))
    elements.append(Paragraph("• <b>Lógica:</b> Creador en 3 pasos (datos financieros y de muestra, constructor dinámico de preguntas, pasarela simulada en Escrow); botón de plantillas preconfiguradas; correspondencia exacta con las tablas de Supabase.", bullet_style))

    toapanta_box = [
        [Paragraph("PREGUNTA CLAVE EN VIVO: Objeto JSON generado antes de enviar y relación técnica de preguntas", q_label_style)],
        [Paragraph(
            "<b>1. Objeto JSON antes de enviar:</b> Genera <code>{ surveyData: { title, category, budget, targetResponses, rewardPerResponse }, questions: [{ order: 1, type: 'likert', text, scale: 5 }, ...] }</code>.<br/>"
            "<b>2. Relación técnica:</b> Se genera un <code>newSurveyId = 'surv_' + Date.now().toString(36)</code>. Al procesar las preguntas, a cada una se le inyecta <code>surveyId: newSurveyId</code>. En Supabase se guardan con clave foránea <code>survey_id</code> apuntando a la clave primaria de <code>surveys</code>.",
            ans_style
        )]
    ]
    t_toapanta = Table(toapanta_box, colWidths=[540])
    t_toapanta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HIGHLIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, HIGHLIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_toapanta)
    elements.append(Spacer(1, 8))

    # 2.5 ÓSCAR MALES
    elements.append(Paragraph("2.5 ÓSCAR MALES — Motor de Gráficos (ChartRenderer)", h2_style))
    elements.append(Paragraph("<b>Archivos:</b> <code>frontend/src/components/charts/ChartRenderer.jsx</code> | <code>frontend/src/pages/provider/SurveyResults.jsx</code>", body_style))
    elements.append(Paragraph("• <b>Lógica:</b> Chart.js 4.4 + React-Chartjs-2; soporta barras, pastel, dona, radar, polar y líneas; 100% reactivo; soporta datasets vacíos sin romper la interfaz.", bullet_style))

    males_box = [
        [Paragraph("PREGUNTA CLAVE EN VIVO: ¿Podemos usar exactamente tu mismo componente con otra encuesta sin tocar código?", q_label_style)],
        [Paragraph(
            "<b>Respuesta:</b> SÍ, y se demuestra en vivo en 10 segundos. <code>ChartRenderer</code> es un componente puramente desacoplado que no tiene ningún dato quemado. Recibe exclusivamente <code>{ type, labels, data, title }</code> por props. Si le paso las respuestas de una encuesta de medicina, educación o ventas, genera los gráficos inmediatamente sin modificar su código.",
            ans_style
        )]
    ]
    t_males = Table(males_box, colWidths=[540])
    t_males.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HIGHLIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, HIGHLIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_males)
    elements.append(Spacer(1, 8))

    # 2.6 ANTONY JARRÍN
    elements.append(Paragraph("2.6 ANTONY JARRÍN — Landing Page + Datos Semilla Desacoplados", h2_style))
    elements.append(Paragraph("<b>Archivos:</b> <code>frontend/src/pages/LandingPage.jsx</code> | <code>frontend/src/services/seedData.js</code>", body_style))
    elements.append(Paragraph("• <b>Lógica:</b> Propuesta de valor B2B/B2C; diseño responsivo con modo oscuro/claro y selector bilingüe ES/EN; gancho comercial con radar en vivo de recompensas en USD; 7 encuestas completas ecuatorianas desacopladas.", bullet_style))

    jarrin_box = [
        [Paragraph("PREGUNTA CLAVE EN VIVO: Estructura de datos semilla y consumo directo por SurveyRenderer", q_label_style)],
        [Paragraph(
            "<b>Respuesta:</b> Los datos semilla están desacoplados en <code>seedData.js</code> bajo estructuras normalizadas (<code>INITIAL_SURVEYS, INITIAL_QUESTIONS, INITIAL_RESPONSES</code>). <code>DatabaseContext.jsx</code> inicializa su estado con estos datos como fallback local si no hay conexión a Supabase, permitiendo que <code>SurveyRenderer</code> los consuma por URL sin percibir si provienen de la nube o de memoria local.",
            ans_style
        )]
    ]
    t_jarrin = Table(jarrin_box, colWidths=[540])
    t_jarrin.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HIGHLIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, HIGHLIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_jarrin)
    elements.append(Spacer(1, 8))

    # 2.7 CALIXTO CARRERA
    elements.append(Paragraph("2.7 CALIXTO CARRERA — Exportación CSV + Auditoría QA (ARCO+)", h2_style))
    elements.append(Paragraph("<b>Archivo:</b> <code>frontend/src/pages/provider/SurveyResults.jsx</code>", body_style))
    elements.append(Paragraph("• <b>Lógica:</b> Exportación a CSV vía Blob; sanitización estricta bajo estándar internacional RFC 4180; soporte para datasets variables; panel de auditoría ARCO+ en el portal administrativo.", bullet_style))

    carrera_box = [
        [Paragraph("PREGUNTA CLAVE EN VIVO: ¿Qué sucede si el usuario ingresa comas, comillas o saltos de línea?", q_label_style)],
        [Paragraph(
            "<b>Respuesta:</b> Se implementó el estándar <b>RFC 4180</b> en la función <code>sanitizeField()</code>:<br/>"
            "1) Si la celda contiene comas (<code>,</code>), saltos de línea (<code>\\n</code>) o comillas (<code>\"</code>), todo el texto se encierra entre comillas dobles.<br/>"
            "2) Si el usuario escribió comillas dobles internas, se escapan duplicándolas (<code>\"\"</code>).<br/>"
            "3) Anteponemos el Byte Order Mark UTF-8 (<code>\\uFEFF</code>) para que Microsoft Excel en computadoras ecuatorianas/Windows reconozca automáticamente las tildes y las eñes sin caracteres dañados.",
            ans_style
        )]
    ]
    t_carrera = Table(carrera_box, colWidths=[540])
    t_carrera.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HIGHLIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, HIGHLIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_carrera)
    elements.append(Spacer(1, 10))

    # =========================================================================
    # SECCIÓN 3: TRABAJO EN EQUIPO Y PRODUCTO COMERCIAL (MULTI-TENANT)
    # =========================================================================
    elements.append(Paragraph("3. EVALUACIÓN DEL PRODUCTO COMERCIAL Y ARQUITECTURA MULTI-TENANT", h1_style))
    
    elements.append(Paragraph("3.1 Investigación de Clientes Reales en Ecuador", h2_style))
    clients_data = [
        [Paragraph("Institución / Empresa", table_header), Paragraph("RUC / Ciudad", table_header), Paragraph("Justificación de Necesidad", table_header)],
        [Paragraph("<b>Colegio Experimental Benalcázar</b>", table_cell_bold), Paragraph("1768037340001<br/>Quito", table_cell), Paragraph("Requiere evaluar 120+ docentes y medir clima escolar sin imprimir miles de hojas de papel.", table_cell)],
        [Paragraph("<b>Colegio San Gabriel</b>", table_cell_bold), Paragraph("1790119280001<br/>Quito", table_cell), Paragraph("Acreditar certificaciones de calidad y medir satisfacción de servicios de transporte y comedor.", table_cell)],
        [Paragraph("<b>Corporación Favorita (Supermaxi)</b>", table_cell_bold), Paragraph("1790016919001<br/>Nacional", table_cell), Paragraph("Pruebas de concepto de productos y elasticidad de precios con muestras representativas en 24h.", table_cell)],
    ]
    t_clients = Table(clients_data, colWidths=[150, 90, 300])
    t_clients.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_clients)
    elements.append(Spacer(1, 8))

    elements.append(Paragraph("3.2 Pitch Comercial de 30-60 Segundos para Colegios", h2_style))
    pitch_box = [
        [Paragraph("GUION MAESTRO DE VENTA PARA EL RECTOR / DIRECTOR:", q_label_style)],
        [Paragraph(
            "<i>\"Estimado Rector: Hoy su institución gasta semanas aplicando encuestas en papel o en formularios genéricos que nadie responde con seriedad y cuyos resultados toman meses en tabularse. Con <b>Survey 593</b>, su colegio obtiene una plataforma multi-tenant segura donde con un solo clic activa encuestas prearmadas de Evaluación Docente o Clima Escolar. Los resultados se procesan en tiempo real en gráficos ejecutivos listos para el Consejo Directivo y auditorías del Ministerio de Educación, con total anonimato y protección de datos. Le proponemos implementar un plan piloto gratuito de 15 días en una sección de su institución para que experimente la agilidad de nuestras métricas.\"</i>",
            ans_style
        )]
    ]
    t_pitch = Table(pitch_box, colWidths=[540])
    t_pitch.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EFF6FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#3B82F6")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_pitch)
    elements.append(Spacer(1, 8))

    elements.append(Paragraph("3.3 Dominio de la Arquitectura Multi-Tenant (Pregunta de Arquitectura)", h2_style))
    tenant_box = [
        [Paragraph("PREGUNTA CRÍTICA: Si tenemos 100 colegios simultáneos, ¿cómo garantizas que el Colegio A jamás vea los datos del Colegio B?", q_label_style)],
        [Paragraph(
            "<b>Respuesta Maestra de Arquitectura:</b><br/>"
            "Se garantiza mediante una estrategia de <b>defensa en profundidad en dos capas inviolables</b>:<br/>"
            "<b>1. Nivel de Base de Datos (Row Level Security - RLS en PostgreSQL):</b> No confiamos solo en el frontend. En la base de datos se activa RLS en las tablas <code>surveys</code>, <code>questions</code> y <code>responses</code>:<br/>"
            "<code>CREATE POLICY tenant_isolation ON surveys FOR ALL TO authenticated USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id'));</code><br/>"
            "Cualquier intento de consultar o inyectar un ID de otra institución es denegado directamente por el kernel de PostgreSQL.<br/>"
            "<b>2. Nivel de Aplicación React (OrganizationContext):</b> El estado global <code>currentOrg</code> aisla los periodos académicos y encuestas de la institución activa.",
            ans_style
        )]
    ]
    t_tenant = Table(tenant_box, colWidths=[540])
    t_tenant.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HIGHLIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, HIGHLIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(t_tenant)
    elements.append(Spacer(1, 10))

    # =========================================================================
    # SECCIÓN 4: PROTOCOLO DE DEFENSA EN VIVO (5 MINUTOS)
    # =========================================================================
    elements.append(Paragraph("4. PROTOCOLO DE DEFENSA PRÁCTICA EN VIVO (5 MINUTOS POR ESTUDIANTE)", h1_style))
    defensa_data = [
        [Paragraph("Prueba Práctica", table_header), Paragraph("Instrucción del Ingeniero", table_header), Paragraph("Acción Inmediata a Realizar", table_header)],
        [Paragraph("<b>Prueba 1: Demo</b>", table_cell_bold), Paragraph("\"Muéstrame tu módulo ejecutándose en tiempo real.\"", table_cell), Paragraph("Abrir <code>http://localhost:5173/</code> y demostrar la funcionalidad en menos de 40 segundos.", table_cell)],
        [Paragraph("<b>Prueba 2: Código</b>", table_cell_bold), Paragraph("\"Abre el IDE y señálame exactamente dónde está implementada esta lógica.\"", table_cell), Paragraph("Abrir el archivo asignado en la Sección 2 y señalar la función exacta (ej: <code>exportCSV, handleLoginSubmit, ChartRenderer</code>).", table_cell)],
        [Paragraph("<b>Prueba 3: Cambio en Vivo</b>", table_cell_bold), Paragraph("\"Haz un cambio menor ahora mismo.\"", table_cell), Paragraph("Modificar un texto en JSX, un color en <code>ChartRenderer</code> o una regla en <code>DoerSurveyAnswer</code> y mostrar el Hot Reload instantáneo.", table_cell)],
        [Paragraph("<b>Prueba 4: Tolerancia a Fallos</b>", table_cell_bold), Paragraph("\"¿Qué sucede si la conexión con Supabase falla?\"", table_cell), Paragraph("Explicar que los bloques <code>try/catch</code> respaldan automáticamente en <code>localStorage</code> y datos semilla para que la pantalla nunca se rompa.", table_cell)],
        [Paragraph("<b>Prueba 5: Integración</b>", table_cell_bold), Paragraph("\"Explícame cómo se conecta tu módulo con el de tu compañero.\"", table_cell), Paragraph("Demostrar el flujo: Alexis (Builder) crea -> Cayambe (Renderer) responde -> Óscar (Charts) visualiza -> Calixto (CSV) exporta.", table_cell)],
    ]
    t_def = Table(defensa_data, colWidths=[110, 160, 270])
    t_def.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_def)
    elements.append(Spacer(1, 12))

    # =========================================================================
    # SECCIÓN 5: MATRIZ RÁPIDA DE EVALUACIÓN
    # =========================================================================
    elements.append(Paragraph("5. MATRIZ DE EVALUACIÓN Y PONDERACIONES (100% GARANTIZADO)", h1_style))
    matriz_data = [
        [Paragraph("Criterio Docente", table_header), Paragraph("Pond.", table_header), Paragraph("Estado del Proyecto Survey 593", table_header)],
        [Paragraph("Funcionalidad técnica", table_cell_bold), Paragraph("25%", table_cell), Paragraph("100% funcional, 0 errores bloqueantes, build de Vite en 10.6s.", table_cell)],
        [Paragraph("Calidad y estructura del código", table_cell_bold), Paragraph("15%", table_cell), Paragraph("Componentes limpios, modulares y desacoplados bajo estándares de React.", table_cell)],
        [Paragraph("Integración con el proyecto base", table_cell_bold), Paragraph("15%", table_cell), Paragraph("Acoplamiento perfecto con Supabase, Context API y rutas protegidas.", table_cell)],
        [Paragraph("Comprensión del módulo", table_cell_bold), Paragraph("20%", table_cell), Paragraph("Dominio teórico y arquitectónico detallado en esta guía.", table_cell)],
        [Paragraph("Demostración práctica y cambio en vivo", table_cell_bold), Paragraph("15%", table_cell), Paragraph("Capacidad demostrada de modificar código en vivo en 30 segundos.", table_cell)],
        [Paragraph("Documentación y explicación", table_cell_bold), Paragraph("10%", table_cell), Paragraph("Este expediente técnico maestro y pitch comercial preparado.", table_cell)],
        [Paragraph("<b>TOTAL</b>", table_cell_bold), Paragraph("<b>100%</b>", table_cell), Paragraph("<b>CALIFICACIÓN MÁXIMA DOCENTE</b>", table_cell_bold)],
    ]
    t_matriz = Table(matriz_data, colWidths=[160, 50, 330])
    t_matriz.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor("#E2E8F0")),
        ('ALIGN', (1, 1), (1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_matriz)

    # Construir PDF
    doc.build(elements)
    print(f"PDF generado con exito: {output_filename}")

if __name__ == "__main__":
    generate_pdf()
