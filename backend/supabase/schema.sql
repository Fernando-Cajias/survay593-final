-- ==============================================================================
-- SURVEY 593 — ESQUEMA COMPLETO DE BASE DE DATOS (SUPABASE POSTGRESQL)
-- Proyecto #1 Ecosistema Kolab
-- ==============================================================================

-- 1. TABLA: PROFILES / USUARIOS (Doers, Providers, Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('doer', 'provider', 'admin')),
    company VARCHAR(255),
    industry VARCHAR(100),
    age INT,
    city VARCHAR(100) DEFAULT 'Quito',
    gender VARCHAR(10) DEFAULT 'F',
    verified BOOLEAN DEFAULT FALSE,
    balance NUMERIC(12, 2) DEFAULT 0.00,
    surveys_completed INT DEFAULT 0,
    streak INT DEFAULT 0,
    avatar_color VARCHAR(50) DEFAULT '#0D9488',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA: SURVEYS (Campañas de Encuestas)
CREATE TABLE IF NOT EXISTS public.surveys (
    id TEXT PRIMARY KEY,
    provider_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'draft')),
    reward_per_response NUMERIC(10, 2) DEFAULT 1.00,
    budget NUMERIC(12, 2) DEFAULT 100.00,
    spent NUMERIC(12, 2) DEFAULT 0.00,
    target_responses INT DEFAULT 50,
    actual_responses INT DEFAULT 0,
    estimated_time INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: QUESTIONS (Preguntas del Cuestionario)
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    survey_id TEXT REFERENCES public.surveys(id) ON DELETE CASCADE,
    question_order INT DEFAULT 1,
    type VARCHAR(50) NOT NULL CHECK (type IN ('multiple', 'likert', 'yesno', 'text')),
    text TEXT NOT NULL,
    required BOOLEAN DEFAULT TRUE,
    options JSONB DEFAULT '[]'::jsonb,
    scale INT DEFAULT 5,
    labels JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: RESPONSES (Respuestas Verificadas de Encuestados)
CREATE TABLE IF NOT EXISTS public.responses (
    id TEXT PRIMARY KEY,
    survey_id TEXT REFERENCES public.surveys(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    verified BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: TRANSACTIONS (Billetera Virtual & Ledger Financiero)
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'withdrawal')),
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA: CUSTOM_DASHBOARDS (Tableros Creados con No-Code BI Studio)
CREATE TABLE IF NOT EXISTS public.custom_dashboards (
    id TEXT PRIMARY KEY,
    provider_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    widgets JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) Y POLÍTICAS DE ACCESO
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_dashboards ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura y escritura para clientes anónimos/autenticados de la app
CREATE POLICY "Acceso total a profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a surveys" ON public.surveys FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a questions" ON public.questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a responses" ON public.responses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a custom_dashboards" ON public.custom_dashboards FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- DATOS INICIALES (SEED DATA DEL MERCADO ECUATORIANO)
-- ==============================================================================

-- Usuarios demo
INSERT INTO public.profiles (id, name, email, password, role, company, industry, age, city, gender, verified, balance, surveys_completed, streak, avatar_color)
VALUES
    ('prov_1', 'Textil Andina S.A.', 'admin@textilandina.ec', 'demo123', 'provider', 'Textil Andina', 'Moda y Textiles', NULL, 'Quito', 'F', true, 5000.00, 0, 0, '#0D9488'),
    ('prov_2', 'Campaña Progreso 2026', 'director@progreso2026.ec', 'demo123', 'provider', 'Partido Progreso', 'Política', NULL, 'Guayaquil', 'M', true, 12000.00, 0, 0, '#6366F1'),
    ('prov_3', 'ClínicaVida', 'gerencia@clinicavida.ec', 'demo123', 'provider', 'ClínicaVida', 'Salud', NULL, 'Cuenca', 'F', true, 3500.00, 0, 0, '#EC4899'),
    ('doer_1', 'María García López', 'maria@email.com', 'demo123', 'doer', NULL, NULL, 28, 'Quito', 'F', true, 47.50, 12, 5, '#F59E0B'),
    ('doer_2', 'Carlos Mendoza', 'carlos@email.com', 'demo123', 'doer', NULL, NULL, 35, 'Guayaquil', 'M', true, 32.00, 8, 3, '#EF4444'),
    ('doer_3', 'Ana Lucía Herrera', 'ana@email.com', 'demo123', 'doer', NULL, NULL, 22, 'Cuenca', 'F', true, 15.75, 5, 1, '#8B5CF6'),
    ('doer_4', 'Roberto Paz Torres', 'roberto@email.com', 'demo123', 'doer', NULL, NULL, 42, 'Quito', 'M', false, 8.25, 3, 0, '#10B981'),
    ('admin_1', 'Admin Kolab', 'admin@kolab.ec', 'admin123', 'admin', 'Kolab', 'Tecnología', NULL, 'Quito', 'M', true, 0.00, 0, 0, '#3B82F6')
ON CONFLICT (id) DO NOTHING;

-- Encuestas demo
INSERT INTO public.surveys (id, provider_id, title, description, category, status, reward_per_response, budget, spent, target_responses, actual_responses, estimated_time)
VALUES
    ('surv_1', 'prov_1', 'Preferencias de Moda Urbana 2026', 'Ayúdanos a entender las tendencias de moda casual y sostenible.', 'Moda', 'active', 3.50, 350.00, 42.00, 100, 12, 5),
    ('surv_2', 'prov_2', 'Percepción del Servicio Público en tu Ciudad', 'Queremos conocer tu opinión sobre el transporte, seguridad y salud pública.', 'Gobierno', 'active', 2.50, 500.00, 20.00, 200, 8, 7),
    ('surv_3', 'prov_3', 'Experiencia del Paciente - ClínicaVida', 'Tu opinión médica nos ayuda a mejorar la atención de consultas y emergencias.', 'Salud', 'active', 4.00, 200.00, 32.00, 50, 8, 4)
ON CONFLICT (id) DO NOTHING;

-- Preguntas de Encuesta 1 (Moda)
INSERT INTO public.questions (id, survey_id, question_order, type, text, required, options, scale, labels)
VALUES
    ('q1_1', 'surv_1', 1, 'multiple', '¿Qué estilo de ropa prefieres para el día a día?', true, '["Casual urbano", "Deportivo", "Formal-casual", "Bohemio", "Minimalista"]'::jsonb, NULL, NULL),
    ('q1_2', 'surv_1', 2, 'likert', '¿Qué tan importante es para ti que la ropa sea producida de forma sostenible?', true, NULL, 5, '["Nada importante", "Poco", "Neutral", "Importante", "Muy importante"]'::jsonb),
    ('q1_3', 'surv_1', 3, 'multiple', '¿Cuánto gastas mensualmente en ropa?', true, '["Menos de $30", "$30 - $60", "$60 - $100", "$100 - $200", "Más de $200"]'::jsonb, NULL, NULL),
    ('q1_4', 'surv_1', 4, 'yesno', '¿Comprarías ropa de una marca nueva ecuatoriana con buenas reseñas?', true, NULL, NULL, NULL),
    ('q1_5', 'surv_1', 5, 'text', '¿Qué marca de ropa local recomiendas y por qué?', false, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Respuestas iniciales
INSERT INTO public.responses (id, survey_id, user_id, answers, verified)
VALUES
    ('resp_1', 'surv_1', 'doer_1', '{"q1_1": "Casual urbano", "q1_2": 4, "q1_3": "$60 - $100", "q1_4": "Sí", "q1_5": "Pinto, excelente calidad."}'::jsonb, true),
    ('resp_2', 'surv_1', 'doer_2', '{"q1_1": "Deportivo", "q1_2": 3, "q1_3": "$30 - $60", "q1_4": "Sí", "q1_5": ""}'::jsonb, true),
    ('resp_3', 'surv_1', 'doer_3', '{"q1_1": "Minimalista", "q1_2": 5, "q1_3": "$100 - $200", "q1_4": "Sí", "q1_5": "Marcas independientes de diseño."}'::jsonb, true)
ON CONFLICT (id) DO NOTHING;

-- Transacciones iniciales de Wallet
INSERT INTO public.transactions (id, user_id, type, amount, description, status)
VALUES
    ('txn_1', 'doer_1', 'income', 3.50, 'Encuesta completada: Moda Urbana', 'completed'),
    ('txn_2', 'doer_1', 'income', 2.50, 'Encuesta completada: Servicio Público', 'completed'),
    ('txn_3', 'doer_1', 'withdrawal', -25.00, 'Retiro bancario a Banco Pichincha', 'completed')
ON CONFLICT (id) DO NOTHING;

-- Tablero Demo de No-Code BI Studio
INSERT INTO public.custom_dashboards (id, provider_id, title, description, widgets)
VALUES
    ('dash_1', 'prov_1', 'Tablero Estratégico de Moda & Consumo', 'Dashboard con pastel, radar de ángulos y métricas de gasto.', '[
        {"id": "w_1", "type": "kpi", "title": "Muestra Total Recolectada", "surveyId": "surv_1", "colSpan": 1, "config": {"metric": "total_responses", "label": "Encuestados Verificados"}},
        {"id": "w_2", "type": "kpi", "title": "Índice de Sostenibilidad", "surveyId": "surv_1", "questionId": "q1_2", "colSpan": 1, "config": {"metric": "avg_likert", "label": "Promedio sobre 5.0 ★"}},
        {"id": "w_3", "type": "pie", "title": "Preferencia de Estilo de Ropa (Pastel)", "surveyId": "surv_1", "questionId": "q1_1", "colSpan": 1, "config": {}},
        {"id": "w_4", "type": "radar", "title": "Perfil de Consumo & Sostenibilidad (Radar)", "surveyId": "surv_1", "questionId": "q1_2", "colSpan": 1, "config": {"label": "Sensibilidad Sostenible"}},
        {"id": "w_5", "type": "bar", "title": "Distribución de Gasto Mensual ($)", "surveyId": "surv_1", "questionId": "q1_3", "colSpan": 2, "config": {}}
    ]'::jsonb)
ON CONFLICT (id) DO NOTHING;
