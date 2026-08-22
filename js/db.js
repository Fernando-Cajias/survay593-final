/* ================================================
   Survey 593 — Database Layer (LocalStorage)
   Simulated relational DB with CRUD + Seed Data
   ================================================ */

window.Survey593 = window.Survey593 || {};

Survey593.DB = (() => {
  const STORAGE_KEY = 'survey593_db';

  // ====== Core CRUD ======
  function getAll(collection) {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (collection === 'custom_dashboards' && !db.custom_dashboards) {
      db.custom_dashboards = [
        {
          id: 'dash_1',
          providerId: 'prov_1',
          title: 'Tablero Estratégico de Moda & Consumo',
          description: 'Dashboard personalizado diseñado con widgets de Pastel, Radar multidimensional y métricas de gasto.',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          widgets: [
            { id: 'w_101', type: 'kpi', title: 'Muestra Total Recolectada', surveyId: 'surv_1', colSpan: 1, config: { metric: 'total_responses', label: 'Encuestados Verificados' } },
            { id: 'w_102', type: 'kpi', title: 'Índice de Sostenibilidad', surveyId: 'surv_1', questionId: 'q1_2', colSpan: 1, config: { metric: 'avg_likert', label: 'Promedio sobre 5.0' } },
            { id: 'w_103', type: 'pie', title: 'Preferencia de Estilo de Ropa', surveyId: 'surv_1', questionId: 'q1_1', colSpan: 1, config: {} },
            { id: 'w_104', type: 'radar', title: 'Perfil de Consumo & Sostenibilidad (Radar)', surveyId: 'surv_1', questionId: 'q1_2', colSpan: 1, config: { label: 'Sensibilidad Sostenible' } },
            { id: 'w_105', type: 'bar', title: 'Segmentación de Gasto Mensual ($)', surveyId: 'surv_1', questionId: 'q1_3', colSpan: 2, config: {} }
          ]
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
    return db[collection] || [];
  }

  function getById(collection, id) {
    return getAll(collection).find(item => item.id === id) || null;
  }

  function query(collection, filterFn) {
    return getAll(collection).filter(filterFn);
  }

  function insert(collection, item) {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!db[collection]) db[collection] = [];
    item.id = item.id || generateId();
    item.createdAt = item.createdAt || new Date().toISOString();
    db[collection].push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return item;
  }

  function update(collection, id, updates) {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!db[collection]) return null;
    const idx = db[collection].findIndex(item => item.id === id);
    if (idx === -1) return null;
    db[collection][idx] = { ...db[collection][idx], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db[collection][idx];
  }

  function remove(collection, id) {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!db[collection]) return false;
    db[collection] = db[collection].filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return true;
  }

  function count(collection, filterFn) {
    const items = getAll(collection);
    return filterFn ? items.filter(filterFn).length : items.length;
  }

  function generateId() {
    return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
  }

  // ====== Seed Data ======
  function seed() {
    if (localStorage.getItem(STORAGE_KEY)) return; // Already seeded

    const db = { users: [], surveys: [], questions: [], responses: [], transactions: [], notifications: [] };

    // --- Users ---
    const colors = ['#0D9488','#6366F1','#F59E0B','#EF4444','#8B5CF6','#EC4899','#10B981','#3B82F6','#F97316'];
    
    // Providers (Empresas)
    db.users.push(
      { id:'prov_1', name:'Textil Andina S.A.', email:'admin@textilandina.ec', password:'demo123', role:'provider', avatar:null, avatarColor:colors[0], company:'Textil Andina', industry:'Moda y Textiles', verified:true, balance:5000, createdAt:'2026-06-15T10:00:00Z' },
      { id:'prov_2', name:'Campaña Progreso 2026', email:'director@progreso2026.ec', password:'demo123', role:'provider', avatar:null, avatarColor:colors[1], company:'Partido Progreso', industry:'Política', verified:true, balance:12000, createdAt:'2026-06-20T14:30:00Z' },
      { id:'prov_3', name:'ClínicaVida', email:'gerencia@clinicavida.ec', password:'demo123', role:'provider', avatar:null, avatarColor:colors[5], company:'ClínicaVida', industry:'Salud', verified:true, balance:3500, createdAt:'2026-07-01T09:00:00Z' }
    );

    // Doers (Encuestados)
    db.users.push(
      { id:'doer_1', name:'María García López', email:'maria@email.com', password:'demo123', role:'doer', avatar:null, avatarColor:colors[2], age:28, city:'Quito', gender:'F', verified:true, balance:47.50, surveysCompleted:12, streak:5, createdAt:'2026-07-05T08:00:00Z' },
      { id:'doer_2', name:'Carlos Mendoza', email:'carlos@email.com', password:'demo123', role:'doer', avatar:null, avatarColor:colors[3], age:35, city:'Guayaquil', gender:'M', verified:true, balance:32.00, surveysCompleted:8, streak:3, createdAt:'2026-07-06T10:00:00Z' },
      { id:'doer_3', name:'Ana Lucía Herrera', email:'ana@email.com', password:'demo123', role:'doer', avatar:null, avatarColor:colors[4], age:22, city:'Cuenca', gender:'F', verified:true, balance:15.75, surveysCompleted:5, streak:1, createdAt:'2026-07-10T12:00:00Z' },
      { id:'doer_4', name:'Roberto Paz Torres', email:'roberto@email.com', password:'demo123', role:'doer', avatar:null, avatarColor:colors[6], age:42, city:'Quito', gender:'M', verified:false, balance:8.25, surveysCompleted:3, streak:0, createdAt:'2026-07-12T16:00:00Z' },
      { id:'doer_5', name:'Sofía Delgado', email:'sofia@email.com', password:'demo123', role:'doer', avatar:null, avatarColor:colors[7], age:31, city:'Ambato', gender:'F', verified:true, balance:61.00, surveysCompleted:18, streak:7, createdAt:'2026-07-08T09:00:00Z' }
    );

    // Admin
    db.users.push(
      { id:'admin_1', name:'Admin Kolab', email:'admin@kolab.ec', password:'admin123', role:'admin', avatar:null, avatarColor:colors[8], verified:true, createdAt:'2026-06-01T00:00:00Z' }
    );

    // --- Surveys ---
    db.surveys.push(
      { id:'surv_1', providerId:'prov_1', title:'Preferencias de Moda Urbana 2026', description:'Ayúdanos a entender las tendencias de moda que más te gustan. Tu opinión determinará nuestra próxima colección.', category:'Moda', status:'active', rewardPerResponse:3.50, budget:350, spent:42, targetResponses:100, actualResponses:12, estimatedTime:5, createdAt:'2026-07-20T10:00:00Z', expiresAt:'2026-08-30T23:59:59Z' },
      { id:'surv_2', providerId:'prov_2', title:'Percepción del Servicio Público en tu Ciudad', description:'Queremos conocer tu opinión sobre los servicios públicos de tu ciudad: transporte, seguridad, salud y educación.', category:'Gobierno', status:'active', rewardPerResponse:2.50, budget:500, spent:20, targetResponses:200, actualResponses:8, estimatedTime:7, createdAt:'2026-07-22T14:00:00Z', expiresAt:'2026-09-15T23:59:59Z' },
      { id:'surv_3', providerId:'prov_3', title:'Experiencia del Paciente - ClínicaVida', description:'Tu feedback nos ayuda a mejorar. Cuéntanos sobre tu última visita médica.', category:'Salud', status:'active', rewardPerResponse:4.00, budget:200, spent:32, targetResponses:50, actualResponses:8, estimatedTime:4, createdAt:'2026-07-25T09:00:00Z', expiresAt:'2026-08-31T23:59:59Z' },
      { id:'surv_4', providerId:'prov_1', title:'Hábitos de Consumo Digital', description:'¿Cómo compras online? Queremos conocer tus preferencias para mejorar nuestra tienda digital.', category:'Tecnología', status:'active', rewardPerResponse:3.00, budget:300, spent:15, targetResponses:100, actualResponses:5, estimatedTime:6, createdAt:'2026-07-28T11:00:00Z', expiresAt:'2026-09-10T23:59:59Z' },
      { id:'surv_5', providerId:'prov_2', title:'Prioridades para el Plan de Gobierno', description:'¿Qué temas consideras más importantes para el futuro del país?', category:'Gobierno', status:'draft', rewardPerResponse:2.00, budget:400, spent:0, targetResponses:200, actualResponses:0, estimatedTime:8, createdAt:'2026-08-01T10:00:00Z', expiresAt:'2026-10-01T23:59:59Z' }
    );

    // --- Questions ---
    // Survey 1: Moda
    db.questions.push(
      { id:'q1_1', surveyId:'surv_1', order:1, type:'multiple', text:'¿Qué estilo de ropa prefieres para el día a día?', required:true, options:['Casual urbano','Deportivo','Formal-casual','Bohemio','Minimalista'] },
      { id:'q1_2', surveyId:'surv_1', order:2, type:'likert', text:'¿Qué tan importante es para ti que la ropa sea producida de forma sostenible?', required:true, scale:5, labels:['Nada importante','Poco','Neutral','Importante','Muy importante'] },
      { id:'q1_3', surveyId:'surv_1', order:3, type:'multiple', text:'¿Cuánto gastas mensualmente en ropa?', required:true, options:['Menos de $30','$30 - $60','$60 - $100','$100 - $200','Más de $200'] },
      { id:'q1_4', surveyId:'surv_1', order:4, type:'text', text:'¿Qué marca de ropa local es tu favorita y por qué?', required:false },
      { id:'q1_5', surveyId:'surv_1', order:5, type:'yesno', text:'¿Comprarías ropa de una marca nueva si tiene buenas reseñas en redes sociales?', required:true }
    );

    // Survey 2: Servicio Público
    db.questions.push(
      { id:'q2_1', surveyId:'surv_2', order:1, type:'likert', text:'¿Cómo calificas el servicio de transporte público en tu ciudad?', required:true, scale:5, labels:['Muy malo','Malo','Regular','Bueno','Excelente'] },
      { id:'q2_2', surveyId:'surv_2', order:2, type:'likert', text:'¿Cómo calificas la seguridad en tu barrio?', required:true, scale:5, labels:['Muy inseguro','Inseguro','Neutral','Seguro','Muy seguro'] },
      { id:'q2_3', surveyId:'surv_2', order:3, type:'multiple', text:'¿Cuál consideras el problema más urgente de tu ciudad?', required:true, options:['Inseguridad','Transporte','Salud pública','Educación','Empleo','Contaminación'] },
      { id:'q2_4', surveyId:'surv_2', order:4, type:'yesno', text:'¿Has utilizado algún servicio público digital (trámites en línea)?', required:true },
      { id:'q2_5', surveyId:'surv_2', order:5, type:'text', text:'¿Qué cambio mejoraría más tu calidad de vida en la ciudad?', required:false },
      { id:'q2_6', surveyId:'surv_2', order:6, type:'likert', text:'¿Qué tan satisfecho estás con la gestión actual de tu municipio?', required:true, scale:5, labels:['Muy insatisfecho','Insatisfecho','Neutral','Satisfecho','Muy satisfecho'] }
    );

    // Survey 3: Salud
    db.questions.push(
      { id:'q3_1', surveyId:'surv_3', order:1, type:'likert', text:'¿Cómo fue el trato del personal médico durante tu última visita?', required:true, scale:5, labels:['Muy malo','Malo','Aceptable','Bueno','Excelente'] },
      { id:'q3_2', surveyId:'surv_3', order:2, type:'multiple', text:'¿Cuánto tiempo esperaste para ser atendido?', required:true, options:['Menos de 15 min','15-30 min','30-60 min','1-2 horas','Más de 2 horas'] },
      { id:'q3_3', surveyId:'surv_3', order:3, type:'yesno', text:'¿Recomendarías ClínicaVida a un familiar o amigo?', required:true },
      { id:'q3_4', surveyId:'surv_3', order:4, type:'text', text:'¿Qué aspecto de nuestro servicio podemos mejorar?', required:false }
    );

    // Survey 4: Consumo Digital
    db.questions.push(
      { id:'q4_1', surveyId:'surv_4', order:1, type:'multiple', text:'¿Con qué frecuencia compras productos en línea?', required:true, options:['Diariamente','Semanalmente','Quincenalmente','Mensualmente','Casi nunca'] },
      { id:'q4_2', surveyId:'surv_4', order:2, type:'multiple', text:'¿Qué método de pago prefieres para compras online?', required:true, options:['Tarjeta de crédito','Tarjeta de débito','Transferencia bancaria','Billetera digital','Pago contra entrega'] },
      { id:'q4_3', surveyId:'surv_4', order:3, type:'likert', text:'¿Qué tan seguro te sientes comprando en línea?', required:true, scale:5, labels:['Muy inseguro','Inseguro','Neutral','Seguro','Muy seguro'] },
      { id:'q4_4', surveyId:'surv_4', order:4, type:'yesno', text:'¿Has tenido alguna mala experiencia con compras en línea en el último año?', required:true },
      { id:'q4_5', surveyId:'surv_4', order:5, type:'text', text:'¿Qué te haría comprar más en una tienda online?', required:false }
    );

    // --- Responses (sample data for charts) ---
    const doerIds = ['doer_1','doer_2','doer_3','doer_4','doer_5'];
    const sampleResponses = [
      { surveyId:'surv_1', userId:'doer_1', answers:{'q1_1':'Casual urbano','q1_2':4,'q1_3':'$60 - $100','q1_4':'Me gusta Pinto porque es local y de calidad.','q1_5':'Sí'} },
      { surveyId:'surv_1', userId:'doer_2', answers:{'q1_1':'Deportivo','q1_2':3,'q1_3':'$30 - $60','q1_4':'','q1_5':'Sí'} },
      { surveyId:'surv_1', userId:'doer_3', answers:{'q1_1':'Minimalista','q1_2':5,'q1_3':'$100 - $200','q1_4':'Ámala, diseños increíbles y sostenibles.','q1_5':'Sí'} },
      { surveyId:'surv_1', userId:'doer_5', answers:{'q1_1':'Casual urbano','q1_2':4,'q1_3':'$60 - $100','q1_4':'','q1_5':'No'} },
      { surveyId:'surv_2', userId:'doer_1', answers:{'q2_1':2,'q2_2':3,'q2_3':'Inseguridad','q2_4':'Sí','q2_5':'Mejor transporte público.','q2_6':2} },
      { surveyId:'surv_2', userId:'doer_5', answers:{'q2_1':3,'q2_2':4,'q2_3':'Empleo','q2_4':'Sí','q2_5':'Más oportunidades de empleo.','q2_6':3} },
      { surveyId:'surv_3', userId:'doer_1', answers:{'q3_1':4,'q3_2':'15-30 min','q3_3':'Sí','q3_4':'Reducir tiempos de espera.'} },
      { surveyId:'surv_3', userId:'doer_2', answers:{'q3_1':5,'q3_2':'Menos de 15 min','q3_3':'Sí','q3_4':''} },
      { surveyId:'surv_3', userId:'doer_3', answers:{'q3_1':3,'q3_2':'30-60 min','q3_3':'Sí','q3_4':'Más personal en horario de almuerzo.'} },
      { surveyId:'surv_4', userId:'doer_5', answers:{'q4_1':'Semanalmente','q4_2':'Billetera digital','q4_3':4,'q4_4':'No','q4_5':'Envío gratis y devoluciones fáciles.'} },
      { surveyId:'surv_4', userId:'doer_1', answers:{'q4_1':'Mensualmente','q4_2':'Tarjeta de crédito','q4_3':3,'q4_4':'Sí','q4_5':'Más opciones de pago local.'} },
    ];

    sampleResponses.forEach((r, i) => {
      db.responses.push({
        id: `resp_${i+1}`,
        surveyId: r.surveyId,
        userId: r.userId,
        answers: r.answers,
        completedAt: new Date(Date.now() - (i * 86400000 * Math.random())).toISOString(),
        verified: true
      });
    });

    // --- Transactions ---
    const txns = [
      { userId:'doer_1', type:'income', amount:3.50, description:'Encuesta: Moda Urbana', surveyId:'surv_1', status:'completed' },
      { userId:'doer_1', type:'income', amount:2.50, description:'Encuesta: Servicio Público', surveyId:'surv_2', status:'completed' },
      { userId:'doer_1', type:'income', amount:4.00, description:'Encuesta: Experiencia Paciente', surveyId:'surv_3', status:'completed' },
      { userId:'doer_1', type:'income', amount:3.00, description:'Encuesta: Consumo Digital', surveyId:'surv_4', status:'completed' },
      { userId:'doer_1', type:'withdrawal', amount:-25.00, description:'Retiro a cuenta bancaria', status:'completed' },
      { userId:'doer_1', type:'income', amount:3.50, description:'Bono de racha (5 días)', status:'completed' },
      { userId:'doer_2', type:'income', amount:3.50, description:'Encuesta: Moda Urbana', surveyId:'surv_1', status:'completed' },
      { userId:'doer_2', type:'income', amount:4.00, description:'Encuesta: Experiencia Paciente', surveyId:'surv_3', status:'completed' },
      { userId:'doer_5', type:'income', amount:2.50, description:'Encuesta: Servicio Público', surveyId:'surv_2', status:'completed' },
      { userId:'doer_5', type:'income', amount:3.00, description:'Encuesta: Consumo Digital', surveyId:'surv_4', status:'completed' },
      { userId:'doer_5', type:'withdrawal', amount:-15.00, description:'Retiro a billetera digital', status:'pending' },
      { userId:'doer_3', type:'income', amount:3.50, description:'Encuesta: Moda Urbana', surveyId:'surv_1', status:'completed' },
      { userId:'doer_3', type:'income', amount:4.00, description:'Encuesta: Experiencia Paciente', surveyId:'surv_3', status:'completed' },
    ];

    txns.forEach((t, i) => {
      db.transactions.push({
        id: `txn_${i+1}`,
        ...t,
        createdAt: new Date(Date.now() - ((txns.length - i) * 86400000 * 0.7)).toISOString()
      });
    });

    // --- Notifications ---
    db.notifications.push(
      { id:'notif_1', userId:'doer_1', type:'payment', title:'Pago procesado', message:'Tu retiro de $25.00 ha sido procesado exitosamente.', read:false, createdAt:new Date(Date.now() - 3600000).toISOString() },
      { id:'notif_2', userId:'doer_1', type:'survey', title:'Nueva encuesta disponible', message:'Hábitos de Consumo Digital está disponible. ¡Gana $3.00!', read:false, createdAt:new Date(Date.now() - 7200000).toISOString() },
      { id:'notif_3', userId:'prov_1', type:'milestone', title:'Hito alcanzado', message:'Tu encuesta "Moda Urbana" ha alcanzado 10 respuestas.', read:true, createdAt:new Date(Date.now() - 86400000).toISOString() }
    );

    // --- Custom Dashboards (No-Code BI Studio) ---
    db.custom_dashboards = [
      {
        id: 'dash_1',
        providerId: 'prov_1',
        title: 'Tablero Estratégico de Moda & Consumo',
        description: 'Dashboard personalizado diseñado con widgets de Pastel, Radar multidimensional y métricas de gasto.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        widgets: [
          {
            id: 'w_101',
            type: 'kpi',
            title: 'Muestra Total Recolectada',
            surveyId: 'surv_1',
            colSpan: 1,
            config: { metric: 'total_responses', label: 'Encuestados Verificados (Quito/Gye)' }
          },
          {
            id: 'w_102',
            type: 'kpi',
            title: 'Índice de Sostenibilidad',
            surveyId: 'surv_1',
            questionId: 'q1_2',
            colSpan: 1,
            config: { metric: 'avg_likert', label: 'Promedio sobre 5.0' }
          },
          {
            id: 'w_103',
            type: 'pie',
            title: 'Preferencia de Estilo de Ropa',
            surveyId: 'surv_1',
            questionId: 'q1_1',
            colSpan: 1,
            config: {}
          },
          {
            id: 'w_104',
            type: 'radar',
            title: 'Perfil de Consumo & Sostenibilidad (Radar)',
            surveyId: 'surv_1',
            questionId: 'q1_2',
            colSpan: 1,
            config: { label: 'Sensibilidad Sostenible' }
          },
          {
            id: 'w_105',
            type: 'bar',
            title: 'Segmentación de Gasto Mensual ($)',
            surveyId: 'surv_1',
            questionId: 'q1_3',
            colSpan: 2,
            config: {}
          }
        ]
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    console.log('✅ Survey 593 DB seeded successfully');
  }

  // ====== Aggregation Helpers ======
  function sumBy(collection, filterFn, field) {
    return query(collection, filterFn).reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
  }

  function groupBy(collection, filterFn, field) {
    const items = filterFn ? query(collection, filterFn) : getAll(collection);
    return items.reduce((groups, item) => {
      const key = item[field];
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    }, {});
  }

  function getResponseStats(surveyId) {
    const questions = query('questions', q => q.surveyId === surveyId);
    const responses = query('responses', r => r.surveyId === surveyId);
    const stats = {};
    
    questions.forEach(q => {
      stats[q.id] = { question: q, data: {} };
      if (q.type === 'multiple' || q.type === 'yesno') {
        const opts = q.type === 'yesno' ? ['Sí', 'No'] : q.options;
        opts.forEach(o => { stats[q.id].data[o] = 0; });
        responses.forEach(r => {
          const ans = r.answers[q.id];
          if (ans && stats[q.id].data[ans] !== undefined) stats[q.id].data[ans]++;
        });
      } else if (q.type === 'likert') {
        for (let i = 1; i <= q.scale; i++) { stats[q.id].data[i] = 0; }
        responses.forEach(r => {
          const ans = r.answers[q.id];
          if (ans) stats[q.id].data[ans] = (stats[q.id].data[ans] || 0) + 1;
        });
        const vals = responses.map(r => r.answers[q.id]).filter(Boolean);
        stats[q.id].average = vals.length ? (vals.reduce((a,b) => a + b, 0) / vals.length).toFixed(1) : 0;
      } else if (q.type === 'text') {
        stats[q.id].data = responses.map(r => r.answers[q.id]).filter(Boolean);
      }
    });
    return stats;
  }

  // ====== Reset ======
  function resetDB() {
    localStorage.removeItem(STORAGE_KEY);
    seed();
  }

  // ====== Init ======
  seed();

  return { getAll, getById, query, insert, update, remove, count, generateId, sumBy, groupBy, getResponseStats, resetDB, seed };
})();
