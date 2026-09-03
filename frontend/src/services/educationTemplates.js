/**
 * educationTemplates.js
 * Banco de Plantillas de Encuestas Educativas Pre-armadas
 * Para que el Rector/Director presione 1 solo botón y la encuesta se cree automáticamente.
 * 
 * Survey 593 · Multi-Tenant · Sector Educativo Ecuador
 */

export const EDUCATION_TEMPLATES = [
  {
    id: 'eval_docente',
    name: 'Evaluación Docente',
    icon: '👩‍🏫',
    description: 'Los padres de familia evalúan el desempeño pedagógico, la claridad y el trato del docente.',
    category: 'Evaluación Docente',
    estimatedTime: 3,
    rewardPerResponse: 1.50,
    questions: [
      {
        type: 'likert',
        text: '¿Cómo califica la claridad con la que el/la docente explica los temas en clase?',
        required: true,
        scale: 5,
        labels: ['1 (Muy deficiente)', '2 (Deficiente)', '3 (Aceptable)', '4 (Bueno)', '5 (Excelente)'],
      },
      {
        type: 'likert',
        text: '¿El/la docente muestra respeto, paciencia y empatía con los estudiantes?',
        required: true,
        scale: 5,
        labels: ['1 (Nunca)', '2 (Rara vez)', '3 (A veces)', '4 (Casi siempre)', '5 (Siempre)'],
      },
      {
        type: 'likert',
        text: '¿Qué tan satisfecho está con las tareas y evaluaciones que envía el docente?',
        required: true,
        scale: 5,
        labels: ['1 (Muy insatisfecho)', '2', '3', '4', '5 (Muy satisfecho)'],
      },
      {
        type: 'multiple',
        text: '¿En qué área considera que el docente necesita mejorar?',
        required: true,
        options: [
          'Metodología de enseñanza',
          'Comunicación con padres',
          'Puntualidad y asistencia',
          'Manejo de tecnología',
          'Ninguna, está bien así',
        ],
      },
      {
        type: 'text',
        text: '¿Tiene algún comentario adicional sobre el desempeño del docente? (Opcional)',
        required: false,
      },
    ],
  },
  {
    id: 'clima_escolar',
    name: 'Clima Escolar y Convivencia',
    icon: '🏫',
    description: 'Mide el ambiente institucional: seguridad, respeto, convivencia y bienestar estudiantil.',
    category: 'Clima Escolar',
    estimatedTime: 4,
    rewardPerResponse: 2.00,
    questions: [
      {
        type: 'likert',
        text: '¿Su hijo/a se siente seguro/a y respetado/a dentro de la institución educativa?',
        required: true,
        scale: 5,
        labels: ['1 (Totalmente en desacuerdo)', '2', '3', '4', '5 (Totalmente de acuerdo)'],
      },
      {
        type: 'yesno',
        text: '¿Su hijo/a ha experimentado o presenciado alguna situación de acoso, bullying o discriminación en la institución?',
        required: true,
      },
      {
        type: 'likert',
        text: '¿Cómo califica la comunicación entre la institución y los padres de familia?',
        required: true,
        scale: 5,
        labels: ['1 (Muy mala)', '2 (Mala)', '3 (Regular)', '4 (Buena)', '5 (Excelente)'],
      },
      {
        type: 'likert',
        text: '¿Qué tan satisfecho está con las instalaciones físicas (aulas, canchas, baños, laboratorios)?',
        required: true,
        scale: 5,
        labels: ['1 (Muy insatisfecho)', '2', '3', '4', '5 (Muy satisfecho)'],
      },
      {
        type: 'multiple',
        text: '¿Qué aspecto del clima escolar considera que se debe mejorar con urgencia?',
        required: true,
        options: [
          'Disciplina y normas de convivencia',
          'Seguridad en el ingreso/salida',
          'Limpieza e higiene',
          'Atención psicológica (DECE)',
          'Resolución de conflictos entre estudiantes',
          'Ninguno, todo está bien',
        ],
      },
      {
        type: 'text',
        text: '¿Desea compartir alguna observación sobre el ambiente escolar? (Anónimo y confidencial)',
        required: false,
      },
    ],
  },
  {
    id: 'satisfaccion_servicios',
    name: 'Satisfacción de Servicios Escolares',
    icon: '📦',
    description: 'Evalúa la calidad de servicios como transporte, alimentación, útiles escolares y atención administrativa.',
    category: 'Servicios Escolares',
    estimatedTime: 3,
    rewardPerResponse: 1.50,
    questions: [
      {
        type: 'likert',
        text: '¿Qué tan satisfecho está con el servicio de transporte escolar?',
        required: true,
        scale: 5,
        labels: ['1 (Muy insatisfecho)', '2', '3', '4', '5 (Muy satisfecho)'],
      },
      {
        type: 'yesno',
        text: '¿Considera razonable y justificada la lista de útiles escolares solicitada por la institución?',
        required: true,
      },
      {
        type: 'likert',
        text: '¿Cómo califica la calidad y variedad del servicio de bar/cafetería escolar?',
        required: true,
        scale: 5,
        labels: ['1 (Muy mala)', '2', '3', '4', '5 (Excelente)'],
      },
      {
        type: 'likert',
        text: '¿Qué tan eficiente es la atención administrativa (secretaría, colecturía, rectorado)?',
        required: true,
        scale: 5,
        labels: ['1 (Muy lenta)', '2', '3', '4', '5 (Muy eficiente)'],
      },
      {
        type: 'multiple',
        text: '¿Qué servicio adicional le gustaría que ofrezca la institución?',
        required: false,
        options: [
          'Actividades extracurriculares (deportes, música, arte)',
          'Clases de refuerzo académico',
          'Servicio de psicología y orientación',
          'Escuela para padres',
          'Plataforma digital de seguimiento académico',
          'Ninguno adicional',
        ],
      },
    ],
  },
  {
    id: 'percepcion_padres',
    name: 'Percepción General de Padres',
    icon: '👨‍👩‍👧‍👦',
    description: 'Encuesta rápida de satisfacción general para obtener el pulso de la comunidad educativa.',
    category: 'Satisfacción General',
    estimatedTime: 2,
    rewardPerResponse: 1.00,
    questions: [
      {
        type: 'likert',
        text: 'En general, ¿qué tan satisfecho está con la educación que recibe su hijo/a en esta institución?',
        required: true,
        scale: 5,
        labels: ['1 (Muy insatisfecho)', '2', '3', '4', '5 (Muy satisfecho)'],
      },
      {
        type: 'yesno',
        text: '¿Recomendaría esta institución educativa a otros padres de familia?',
        required: true,
      },
      {
        type: 'multiple',
        text: '¿Cuál es la principal fortaleza de esta institución?',
        required: true,
        options: [
          'Calidad académica',
          'Valores y formación integral',
          'Infraestructura y tecnología',
          'Seguridad y ambiente',
          'Atención personalizada',
          'Precio / Relación costo-beneficio',
        ],
      },
      {
        type: 'text',
        text: '¿Qué es lo que más le gustaría que mejore la institución para el próximo período?',
        required: false,
      },
    ],
  },
];

export const BUSINESS_TEMPLATES = [
  {
    id: 'estudio_mercado_sucursal',
    name: 'Estudio de Mercado y Ubicación de Sucursal',
    icon: '📍',
    description: 'Evalúa la viabilidad y demanda de consumidores para abrir un nuevo local o sucursal comercial.',
    category: 'Estudio de Mercado',
    estimatedTime: 3,
    rewardPerResponse: 1.50,
    questions: [
      {
        type: 'multiple',
        text: '¿Con qué frecuencia visita o consume productos/servicios de este sector?',
        required: true,
        options: [
          'Varias veces por semana',
          'Una vez por semana',
          'Cada 15 días',
          'Una vez al mes',
          'Casi nunca',
        ],
      },
      {
        type: 'likert',
        text: '¿Qué tan conveniente le resultaría contar con una sucursal en su sector o zona de residencia?',
        required: true,
        scale: 5,
        labels: ['1 (Nada conveniente)', '2', '3', '4', '5 (Muy conveniente)'],
      },
      {
        type: 'multiple',
        text: '¿Qué factor considera más determinante al elegir un establecimiento comercial?',
        required: true,
        options: [
          'Precios y promociones',
          'Calidad de producto/servicio',
          'Cercanía y parqueadero',
          'Rapidez y atención al cliente',
          'Seguridad de la zona',
        ],
      },
      {
        type: 'yesno',
        text: '¿Estaría dispuesto a visitar la nueva sucursal durante el mes de inauguración?',
        required: true,
      },
      {
        type: 'text',
        text: '¿Qué servicio o valor agregado le gustaría que ofrezca este nuevo establecimiento?',
        required: false,
      },
    ],
  },
  {
    id: 'satisfaccion_cliente_csat',
    name: 'Satisfacción del Cliente y Calidad (CSAT / NPS)',
    icon: '⭐',
    description: 'Mide la experiencia de compra, atención recibida y probabilidad de recomendación de la marca.',
    category: 'Satisfacción de Clientes',
    estimatedTime: 2,
    rewardPerResponse: 1.00,
    questions: [
      {
        type: 'likert',
        text: '¿Cómo califica su nivel general de satisfacción con nuestra empresa / servicio?',
        required: true,
        scale: 5,
        labels: ['1 (Muy insatisfecho)', '2', '3', '4', '5 (Completamente satisfecho)'],
      },
      {
        type: 'likert',
        text: '¿Qué tan probable es que recomiende nuestros servicios a un colega, amigo o familiar?',
        required: true,
        scale: 5,
        labels: ['1 (Improbable)', '2', '3', '4', '5 (Totalmente seguro)'],
      },
      {
        type: 'yesno',
        text: '¿El tiempo de espera o entrega cumplió con sus expectativas?',
        required: true,
      },
      {
        type: 'text',
        text: '¿Qué podríamos hacer para mejorar su próxima experiencia con nosotros?',
        required: false,
      },
    ],
  },
  {
    id: 'clima_laboral',
    name: 'Clima Laboral y Diagnóstico de Personal',
    icon: '👥',
    description: 'Mide el bienestar, liderazgo, herramientas y compromiso de los colaboradores de la empresa.',
    category: 'Clima Laboral',
    estimatedTime: 4,
    rewardPerResponse: 2.00,
    questions: [
      {
        type: 'likert',
        text: '¿Siente que cuenta con las herramientas y recursos necesarios para realizar su trabajo eficientemente?',
        required: true,
        scale: 5,
        labels: ['1 (Totalmente en desacuerdo)', '2', '3', '4', '5 (Totalmente de acuerdo)'],
      },
      {
        type: 'likert',
        text: '¿Cómo califica la comunicación y el apoyo por parte de su líder o supervisor directo?',
        required: true,
        scale: 5,
        labels: ['1 (Muy deficiente)', '2', '3', '4', '5 (Excelente)'],
      },
      {
        type: 'yesno',
        text: '¿Se siente motivado y valorado en su puesto actual dentro de la organización?',
        required: true,
      },
      {
        type: 'multiple',
        text: '¿En qué área considera que la empresa debería enfocar sus mejoras de clima interno?',
        required: true,
        options: [
          'Equilibrio trabajo-vida personal',
          'Oportunidades de capacitación y crecimiento',
          'Beneficios e incentivos',
          'Infraestructura y puestos de trabajo',
          'Comunicación interna y feedback',
        ],
      },
    ],
  },
  {
    id: 'test_producto_nuevo',
    name: 'Validación de Nuevo Producto / Servicio',
    icon: '🚀',
    description: 'Prueba la aceptación de mercado, disposición a pagar y atributos clave antes del lanzamiento.',
    category: 'Innovación y Producto',
    estimatedTime: 3,
    rewardPerResponse: 1.50,
    questions: [
      {
        type: 'likert',
        text: '¿Qué tan atractivo e innovador le parece el concepto de este nuevo producto/servicio?',
        required: true,
        scale: 5,
        labels: ['1 (Poco atractivo)', '2', '3', '4', '5 (Muy atractivo)'],
      },
      {
        type: 'yesno',
        text: '¿Compraría o contrataría este servicio dentro de los próximos 3 meses si estuviera disponible?',
        required: true,
      },
      {
        type: 'multiple',
        text: '¿Cuál considera que es el principal beneficio de esta propuesta?',
        required: true,
        options: [
          'Ahorro de tiempo',
          'Ahorro de dinero / mejor precio',
          'Mayor calidad o tecnología',
          'Comodidad y accesibilidad',
          'Exclusividad',
        ],
      },
      {
        type: 'text',
        text: '¿Tiene alguna sugerencia para que este producto resuelva mejor sus necesidades?',
        required: false,
      },
    ],
  },
];

// Default academic periods for Ecuador
export const DEFAULT_ACADEMIC_PERIODS = [
  { name: 'Año Lectivo 2023-2024', startDate: '2023-09-01', endDate: '2024-07-15' },
  { name: 'Año Lectivo 2024-2025', startDate: '2024-09-01', endDate: '2025-07-15' },
  { name: 'Año Lectivo 2025-2026', startDate: '2025-09-01', endDate: '2026-07-15' },
  { name: 'Año Lectivo 2026-2027', startDate: '2026-09-01', endDate: '2027-07-15' },
];

// Get current academic period based on today's date
export const getCurrentPeriod = () => {
  const now = new Date();
  return DEFAULT_ACADEMIC_PERIODS.find((p) => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    return now >= start && now <= end;
  }) || DEFAULT_ACADEMIC_PERIODS[DEFAULT_ACADEMIC_PERIODS.length - 1];
};
