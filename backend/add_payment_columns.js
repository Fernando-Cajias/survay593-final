const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.rytdfmxkttelvvndehkp:survay593sql@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
});

async function migrate() {
  console.log('--- Agregando columnas de pasarelas de pago a public.transactions ---');
  await pool.query(`
    ALTER TABLE public.transactions 
    ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50) DEFAULT 'bank_transfer',
    ADD COLUMN IF NOT EXISTS reference_code VARCHAR(100);
  `);
  console.log('✅ Columnas payment_provider y reference_code creadas correctamente.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('❌ Error migrando tabla transactions:', err);
  process.exit(1);
});
