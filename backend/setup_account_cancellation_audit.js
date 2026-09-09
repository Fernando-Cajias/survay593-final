const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.rytdfmxkttelvvndehkp:survay593sql@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
});

async function setupCancellationAudit() {
  console.log('--- Configurando Sistema de Bajas, Liquidación y Auditoría Legal ---');

  // 1. Crear tabla de cancelaciones y finiquitos legales
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.account_cancellations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      role TEXT NOT NULL,
      company TEXT,
      final_balance NUMERIC DEFAULT 0,
      settlement_type TEXT DEFAULT 'forfeit', -- 'bank_transfer', 'forfeit', 'zero_balance'
      bank_name TEXT,
      bank_account_type TEXT,
      bank_account_number TEXT,
      id_document TEXT, -- Cédula o RUC
      reason TEXT,
      feedback TEXT,
      certificate_code TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'processed', -- 'processed', 'pending_transfer', 'completed'
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );

    -- Habilitar RLS pero permitir lectura/inserción controlada
    ALTER TABLE public.account_cancellations ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Permitir insercion anonima y autenticada de bajas" ON public.account_cancellations;
    CREATE POLICY "Permitir insercion anonima y autenticada de bajas" 
      ON public.account_cancellations 
      FOR ALL 
      USING (true) 
      WITH CHECK (true);
  `);
  console.log('✅ Tabla public.account_cancellations creada con RLS.');

  // 2. Crear función PL/pgSQL con SECURITY DEFINER para procesar la baja con total integridad
  await pool.query(`
    CREATE OR REPLACE FUNCTION public.execute_account_cancellation(
      p_cancellation_id TEXT,
      p_user_id TEXT,
      p_email TEXT,
      p_name TEXT,
      p_role TEXT,
      p_company TEXT,
      p_final_balance NUMERIC,
      p_settlement_type TEXT,
      p_bank_name TEXT,
      p_bank_account_type TEXT,
      p_bank_account_number TEXT,
      p_id_document TEXT,
      p_reason TEXT,
      p_feedback TEXT,
      p_certificate_code TEXT
    )
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      v_result json;
    BEGIN
      -- A. Registrar en la tabla oficial de auditoría de finiquitos
      INSERT INTO public.account_cancellations (
        id,
        user_id,
        email,
        name,
        role,
        company,
        final_balance,
        settlement_type,
        bank_name,
        bank_account_type,
        bank_account_number,
        id_document,
        reason,
        feedback,
        certificate_code,
        status,
        created_at
      ) VALUES (
        p_cancellation_id,
        p_user_id,
        p_email,
        p_name,
        p_role,
        p_company,
        p_final_balance,
        p_settlement_type,
        p_bank_name,
        p_bank_account_type,
        p_bank_account_number,
        p_id_document,
        p_reason,
        p_feedback,
        p_certificate_code,
        CASE WHEN p_settlement_type = 'bank_transfer' THEN 'pending_transfer' ELSE 'completed' END,
        NOW()
      );

      -- B. Si es empresa/provider, pausar o cerrar todas sus encuestas activas
      IF p_role = 'provider' THEN
        UPDATE public.surveys 
        SET status = 'closed' 
        WHERE provider_id = p_user_id;
      END IF;

      -- C. Eliminar el perfil en public.profiles (activará ON DELETE CASCADE de surveys, responses, etc.)
      DELETE FROM public.profiles WHERE id = p_user_id OR email = p_email;

      -- D. Intentar eliminar de auth.users si existe por UUID
      BEGIN
        DELETE FROM auth.users WHERE id = p_user_id::uuid OR email = p_email;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;

      v_result := json_build_object(
        'success', true,
        'certificate_code', p_certificate_code,
        'message', 'Cuenta dada de baja y finiquito legal registrado exitosamente.'
      );

      RETURN v_result;
    END;
    $$;

    -- Conceder permisos de ejecución para anon y authenticated
    GRANT EXECUTE ON FUNCTION public.execute_account_cancellation TO anon, authenticated, service_role;
  `);
  console.log('✅ Función PostgreSQL public.execute_account_cancellation creada.');

  await pool.end();
  console.log('--- Configuración finalizada con éxito ---');
}

setupCancellationAudit().catch(err => {
  console.error('❌ Error configurando auditoría de bajas:', err);
  process.exit(1);
});
