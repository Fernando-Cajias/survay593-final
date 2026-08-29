const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runMigration() {
  const sql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');

  const connectionStrings = [
    'postgresql://postgres.rytdfmxkttelvvndehkp:survay593sql@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
    'postgresql://postgres.rytdfmxkttelvvndehkp:survay593sql@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
    'postgresql://postgres:survay593sql@db.rytdfmxkttelvvndehkp.supabase.co:5432/postgres',
  ];

  let connected = false;

  for (const connStr of connectionStrings) {
    console.log(`Intentando conectar a: ${connStr.replace(/:[^:@]+@/, ':****@')}...`);
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });

    try {
      await client.connect();
      console.log('✅ ¡Conexión exitosa a PostgreSQL!');
      console.log('Ejecutando script de migración schema.sql...');
      await client.query(sql);
      console.log('🎉 ¡Migración completada exitosamente en Supabase!');
      await client.end();
      connected = true;
      break;
    } catch (err) {
      console.log('❌ Falló conexión con este endpoint:', err.message);
      try { await client.end(); } catch (e) {}
    }
  }

  if (!connected) {
    console.log('⚠️ No se pudo conectar directamente por puerto PostgreSQL. El usuario puede ejecutar el script en el SQL Editor.');
  }
}

runMigration();
