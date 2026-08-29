import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def create_defense_guide_pdf(filename="Guia_Interna_Preguntas_Empresario.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY = colors.HexColor("#0D9488")
    SECONDARY = colors.HexColor("#6366F1")
    DARK_BG = colors.HexColor("#0F172A")
    TEXT_DARK = colors.HexColor("#1E293B")
    TEXT_MUTED = colors.HexColor("#475569")
    BOX_BORDER = colors.HexColor("#CBD5E1")
    ALERT_BG = colors.HexColor("#FEF2F2")
    ALERT_BORDER = colors.HexColor("#F87171")
    ALERT_TEXT = colors.HexColor("#991B1B")
    SUCCESS_BG = colors.HexColor("#F0FDF4")
    SUCCESS_BORDER = colors.HexColor("#4ADE80")
    SUCCESS_TEXT = colors.HexColor("#166534")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=TEXT_DARK,
        spaceAfter=6
    )
    
    confidential_badge = ParagraphStyle(
        'Confidential',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#DC2626"),
        spaceAfter=12
    )
    
    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )
    
    q_title_style = ParagraphStyle(
        'QuestionTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=DARK_BG,
        spaceBefore=6,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    italic_style = ParagraphStyle(
        'ItalicText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=TEXT_MUTED,
        spaceAfter=4
    )

    answer_box_style = ParagraphStyle(
        'AnswerText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=SUCCESS_TEXT
    )

    danger_box_style = ParagraphStyle(
        'DangerText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=ALERT_TEXT
    )
    
    term_title = ParagraphStyle(
        'TermTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=PRIMARY
    )

    term_desc = ParagraphStyle(
        'TermDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=TEXT_DARK
    )

    story = []

    # Title & Header
    story.append(Paragraph("GUÍA INTERNA Y ESTRATÉGICA DE DEFENSA", title_style))
    story.append(Paragraph("Survey 593 · Respuestas Clave ante Empresarios y Glosario Ejecutivo", subtitle_style))
    story.append(Paragraph("🔒 DOCUMENTO INTERNO Y CONFIDENCIAL — EQUIPO SCRUM SURVEY 593", confidential_badge))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))

    intro_p = (
        "<b>Propósito de esta guía:</b> Preparar al equipo para responder con máxima solvencia, tranquilidad "
        "y autoridad técnica ante las preguntas de negocio que cualquier empresario o directivo ('el Ingeniero') "
        "suele realizar. Permite transformar dudas u objeciones en demostraciones de rigor, seguridad y visión financiera."
    )
    story.append(Paragraph(intro_p, body_style))
    story.append(Spacer(1, 4))

    # SECTION 1: TOP QUESTIONS
    story.append(Paragraph("PARTE 1: LAS 8 PREGUNTAS CLAVE DEL EMPRESARIO Y CÓMO RESPONDER", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BOX_BORDER, spaceAfter=6))

    questions_data = [
        {
            "q": "1. '¿Ya alguna persona ha usado la aplicación o todavía no hay nadie?'",
            "danger": "NUNCA digas con timidez: 'No, nadie la ha usado aún...' ni inventes números falsos (destruye la confianza).",
            "answer": (
                "<b>CÓMO RESPONDER CON AUTORIDAD Y SOLVENCIA:</b><br/>"
                "&quot;Ingeniero, hasta el día de hoy el proyecto se encontraba estrictamente en la <b>Fase 1: Ingeniería y Blindaje de Seguridad</b>. "
                "Meter usuarios a responder encuestas y cobrar dinero antes de tener la base de datos asegurada en AWS, "
                "el enrutador en la nube y el sistema anti-fraude listo, hubiera sido una grave irresponsabilidad financiera que le "
                "habría costado dinero a la empresa.<br/><br/>"
                "Hoy la plataforma está <b>100% construida, probada y desplegada en producción</b>. A partir de este momento iniciamos el "
                "<b>Plan de Lanzamiento Piloto Controlado de 7 Días</b>: los primeros 3 días incorporamos una cohorte cerrada de 50 usuarios "
                "verificados para auditar que los retiros bancarios funcionen al centavo; y los días 4 a 7 abrimos la primera campaña con "
                "una empresa aliada (ej. Textil Andina). La plataforma está lista desde hoy para recibir a 1,000 usuarios sin que el servidor falle.&quot;"
            )
        },
        {
            "q": "2. '¿Por qué una empresa nos va a pagar a nosotros si puede usar Google Forms que es gratis?'",
            "danger": "No respondas solo: 'Es que nuestra interfaz es más bonita'. A un empresario le importan los números y las ventas.",
            "answer": (
                "<b>CÓMO RESPONDER CON AUTORIDAD Y SOLVENCIA:</b><br/>"
                "&quot;Ingeniero, Google Forms tiene un problema fatal: <b>no tiene incentivo económico</b>. Nadie llena un Google Forms a menos "
                "que sean amigos o familiares complacientes; eso genera 'datos basura' y sesgados que hacen perder dinero.<br/><br/>"
                "Survey 593 le garantiza a la empresa <b>100 respuestas de clientes reales de su ciudad en menos de 24 horas</b> porque remuneramos "
                "su tiempo. Y además, en vez de un Excel aburrido, le entregamos nuestro <b>No-Code BI Studio</b> para que el gerente "
                "arrastre gráficos de pastel, radar y barras y presente resultados en vivo a su directorio.&quot;"
            )
        },
        {
            "q": "3. '¿Cómo evitan que la gente cree cuentas falsas y se robe la plata de las empresas?'",
            "danger": "No digas: 'Confiamos en que la gente no engañe' ni hables de tecnicismos incomprensibles.",
            "answer": (
                "<b>CÓMO RESPONDER CON AUTORIDAD Y SOLVENCIA:</b><br/>"
                "&quot;Implementamos una <b>Triple Barrera Anti-Fraude</b>:<br/>"
                "1. <b>Verificación KYC:</b> El encuestado debe validar su identidad y cédula real para poder retirar fondos.<br/>"
                "2. <b>Control de Dispositivo e IP:</b> El sistema detecta e impide que una misma máquina intente responder dos veces.<br/>"
                "3. <b>Filtro de Velocidad:</b> Si alguien responde en 5 segundos sin leer, el algoritmo invalida la respuesta "
                "automáticamente y no le abona dinero. Así la empresa solo paga por respuestas humanas auténticas.&quot;"
            )
        },
        {
            "q": "4. '¿Cómo ganamos dinero nosotros? ¿Cuánto nos queda limpio en el bolsillo?'",
            "danger": "No inventes números al azar ni digas 'cobramos por banners de publicidad'.",
            "answer": (
                "<b>CÓMO RESPONDER CON AUTORIDAD Y SOLVENCIA:</b><br/>"
                "&quot;Tenemos un modelo probado de <b>Spread Transaccional del 35% al 40%</b>:<br/>"
                "• La empresa paga $3.50 por cada respuesta verificada.<br/>"
                "• El ciudadano recibe $2.25 en su billetera virtual.<br/>"
                "• <b>Nosotros retenemos $1.25 neto por cada respuesta.</b> Con solo 10 estudios medianos al mes (10,000 respuestas), "
                "nos quedan <b>$12,500 USD limpios de ganancia</b>.<br/>"
                "• Aparte cobramos una suscripción de $49/mes a empresas por tableros ilimitados y una comisión del 2.5% al retirar a cuentas bancarias.&quot;"
            )
        },
        {
            "q": "5. '¿Qué pasa si el servidor se cae cuando 5,000 personas entren al mismo tiempo?'",
            "danger": "No digas: 'Ojalá no se caiga' ni sugieras comprar servidores físicos costosos.",
            "answer": (
                "<b>CÓMO RESPONDER CON AUTORIDAD Y SOLVENCIA:</b><br/>"
                "&quot;Esa fue la razón por la que diseñamos una arquitectura <b>Serverless en la Nube</b>. La pantalla está alojada en <b>Vercel</b>, "
                "que tiene servidores réplica en todo el continente; si entran 5,000 personas al mismo tiempo, la carga se reparte sola en milisegundos. "
                "Y la base de datos está en <b>AWS (Amazon Web Services) con Supabase</b> con un sistema de pooling que soporta picos masivos de tráfico "
                "sin costar una fortuna cuando la app esté en reposo.&quot;"
            )
        },
        {
            "q": "6. '¿Cómo me aseguro de que la plata de los pagos y las billeteras no se pierda o se duplique?'",
            "danger": "No digas: 'El código está bien hecho'. Da la justificación de contabilidad financiera.",
            "answer": (
                "<b>CÓMO RESPONDER CON AUTORIDAD Y SOLVENCIA:</b><br/>"
                "&quot;Por eso descartamos bases de datos informales y elegimos <b>PostgreSQL Relacional</b>. Funciona bajo el estándar "
                "bancario <b>ACID</b>: cada centavo tiene un asiento contable de partida doble. Si una transferencia se interrumpe a mitad de camino, "
                "el sistema revierte la operación automáticamente. Es imposible que un usuario retire dos veces o que un saldo quede en el aire.&quot;"
            )
        },
        {
            "q": "7. '¿Cuánto dinero necesitamos para arrancar el marketing y conseguir usuarios?'",
            "danger": "No pidas miles de dólares en pauta publicitaria a ciegas.",
            "answer": (
                "<b>CÓMO RESPONDER CON AUTORIDAD Y SOLVENCIA:</b><br/>"
                "&quot;Iniciamos con una estrategia de <b>Growth Hacking de bajo costo (menos de $150 USD)</b>:<br/>"
                "1. <b>Programa de Referidos Viral:</b> Cada usuario gana $0.50 si invita a un amigo y este completa una encuesta. Crecimiento exponencial boca a boca.<br/>"
                "2. <b>Marketing Universitario:</b> Activaciones en campus de Quito y Guayaquil (estudiantes que buscan ingresos en horas libres).<br/>"
                "3. <b>TikTok con Prueba de Pago:</b> Videos cortos mostrando retiros reales a DeUna o Banco Pichincha. La prueba del dinero real atrae a miles de encuestados sin pagar pauta.&quot;"
            )
        },
        {
            "q": "8. '¿A quién le vamos a vender primero aquí en Ecuador?'",
            "danger": "No digas: 'A todo el mundo' (quien le vende a todos, no le vende a nadie).",
            "answer": (
                "<b>CÓMO RESPONDER CON AUTORIDAD Y SOLVENCIA:</b><br/>"
                "&quot;Nos enfocamos en un nicho desatendido: <b>PyMEs de Moda, Calzado y Alimentos locales</b>.<br/>"
                "Por ejemplo, una fábrica de ropa en Atuntaqui/Quito (como Textil Andina) que va a sacar una línea de chaquetas juveniles y duda "
                "entre tela impermeable o algodón, y si cobrar $45 o $60 USD. Por $150 USD en Survey 593 valida la demanda en 24 horas con 100 jóvenes "
                "de su ciudad antes de gastar $15,000 en cortar tela a ciegas. Le ahorramos miles de dólares y se vuelve cliente fiel.&quot;"
            )
        }
    ]

    for item in questions_data:
        q_elements = []
        q_elements.append(Paragraph(item['q'], q_title_style))
        
        # Danger warning table
        danger_t = Table([[Paragraph("⚠️ <b>ERROR A EVITAR:</b> " + item['danger'], danger_box_style)]], colWidths=[520])
        danger_t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), ALERT_BG),
            ('BOX', (0,0), (-1,-1), 1, ALERT_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        q_elements.append(danger_t)
        q_elements.append(Spacer(1, 3))
        
        # Success answer table
        ans_t = Table([[Paragraph(item['answer'], answer_box_style)]], colWidths=[520])
        ans_t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), SUCCESS_BG),
            ('BOX', (0,0), (-1,-1), 1, SUCCESS_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        q_elements.append(ans_t)
        q_elements.append(Spacer(1, 8))
        
        story.append(KeepTogether(q_elements))

    story.append(PageBreak())

    # SECTION 2: GLOSSARY / DICCIONARIO TÉCNICO-EMPRESARIAL
    story.append(Paragraph("PARTE 2: DICCIONARIO TÉCNICO-EMPRESARIAL", h1_style))
    story.append(Paragraph("Traducción de conceptos técnicos a lenguaje de negocios y metáforas cotidianas para dialogar con el Ingeniero:", italic_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BOX_BORDER, spaceAfter=8))

    glossary = [
        ("Frontend (React + Vite)", "La vitrina, el mostrador y los muebles de la tienda. Es todo lo que el cliente ve, toca y usa en la pantalla de su celular o computadora."),
        ("Backend (Supabase / APIs)", "La bodega, la caja fuerte y la oficina de contabilidad. Está en la parte de atrás, donde se guardan los datos y se procesan los pagos."),
        ("PostgreSQL (Base de Datos)", "Un libro contable gigante con candado de banco, donde cada registro está amarrado a otro para que no haya descuadres de dinero."),
        ("Vercel (Nube / Cloud CDN)", "Tener 50 sucursales en todo el mundo. Si entra un cliente desde Guayaquil o Quito, la página le abre al segundo porque se descarga desde el servidor más cercano."),
        ("No-Code BI Studio", "Un juego de piezas Lego para ejecutivos. El cliente arrastra gráficos de pastel o radar a la pantalla sin escribir código y ve sus métricas en vivo."),
        ("API (Application Interface)", "El mesero de un restaurante. Lleva el pedido del cliente desde la mesa (pantalla) hasta la cocina (base de datos) y regresa con el plato servido."),
        ("KYC (Know Your Customer)", "El guardia de seguridad bancario. Valida la cédula de la persona para asegurarse de que es un ciudadano real de carne y hueso y no un bot."),
        ("ACID (Atomicidad Contable)", "La regla de oro financiera: un cobro o transferencia pasa completo o se cancela entero. Jamás se queda una transacción a medias ni se pierde saldo."),
        ("CI/CD (Despliegue Continuo)", "Una banda transportadora automatizada. Cada cambio o mejora que programamos en la oficina se sube a internet en 30 segundos sin apagar el sistema."),
        ("Take-Rate / Spread", "La comisión neta del negocio. La diferencia entre lo que la empresa nos paga por la encuesta ($3.50) y lo que le transferimos al usuario ($2.25)."),
        ("Google Antigravity & Stitch", "Nuestras herramientas de Inteligencia Artificial que nos permitieron diseñar y programar con la velocidad de un equipo de 20 ingenieros."),
        ("NotebookLM", "El asistente de IA de Google que nos ayudó a resumir leyes de privacidad de datos (ARCO+) y especificaciones del Ecosistema Kolab sin errores.")
    ]

    glossary_table_data = []
    for term, definition in glossary:
        p_term = Paragraph(f"<b>{term}</b>", term_title)
        p_def = Paragraph(definition, term_desc)
        glossary_table_data.append([p_term, p_def])

    g_table = Table(glossary_table_data, colWidths=[150, 370])
    g_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, BOX_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    story.append(g_table)
    story.append(Spacer(1, 10))

    # Footer note
    footer_p = (
        "<b>Recomendación Final:</b> Lleva este PDF guardado en tu teléfono, tablet o impreso. "
        "Si el Ingeniero hace preguntas punzantes, mantén la calma, recuerda la analogía cotidiana y responde "
        "demostrando que cada decisión técnica se tomó para cuidar el dinero y asegurar el éxito del negocio."
    )
    story.append(Paragraph(footer_p, italic_style))

    doc.build(story)
    print(f"PDF generado con éxito: {filename}")

if __name__ == "__main__":
    create_defense_guide_pdf()
