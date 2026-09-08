#!/usr/bin/env node
/**
 * ==============================================================================
 * SURVEY 593 — SCRIPT MAESTRO DE DIAGNÓSTICO, MIGRACIÓN Y DESPLIEGUE EMPRESARIAL
 * ==============================================================================
 * Este script verifica la conexión con la base de datos Supabase PostgreSQL,
 * comprueba la existencia de las tablas y aplica las migraciones necesarias
 * para dejar la aplicación lista en el servidor de la empresa.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// 1. CREDENCIALES OFICIALES DE SUPABASE POSTGRESQL EMPRESARIAL
const CONFIG = {
  projectId: 'rytdfmxkttelvvndehkp',
  supabaseUrl: 'https://rytdfmxkttelvvndehkp.supabase.co',
  dbUser: 'postgres.rytdfmxkttelvvndehkp',
  dbPassword: process.env.DB_PASSWORD || 'survay593sql',
  dbHost: 'aws-0-us-east-1.pooler.supabase.com',
  dbPort: 6543,
  dbName: 'postgres',
  connectionString: 'postgresql://postgres.rytdfmxkttelvvndehkp:survay593sql@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
};

console.log('\n==============================================================================');
console.log('🚀 SURVEY 593 · VERIFICACIÓN Y DESPLIEGUE EN SERVIDOR EMPRESARIAL');
console.log('==============================================================================');
console.log(`📍 Proyecto Supabase ID: ${CONFIG.projectId}`);
console.log(`🌐 Supabase URL:        ${CONFIG.supabaseUrl}`);
console.log(`🗄️  Host Base de Datos:  ${CONFIG.dbHost}:${CONFIG.dbPort}`);
console.log(`👤 Usuario DB:          ${CONFIG.dbUser}`);
console.log('==============================================================================\n');

async function runDeploy() {
  const client = new Client({
    connectionString: CONFIG.connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    console.log('⏳ Conectando al motor PostgreSQL de Supabase...');
    await client.connect();
    console.log('✅ ¡Conexión establecida exitosamente con el servidor PostgreSQL!\n');

    // 2. Comprobar tablas públicas existentes
    console.log('🔍 Inspeccionando tablas de la base de datos...');
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const existingTables = tablesRes.rows.map(r => r.table_name);
    console.log(`📊 Tablas detectadas (${existingTables.length}):`, existingTables.join(', '));

    const REQUIRED_TABLES = ['profiles', 'surveys', 'questions', 'responses', 'transactions', 'custom_dashboards'];
    const missingTables = REQUIRED_TABLES.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log(`\n⚠️ Faltan las siguientes tablas: ${missingTables.join(', ')}`);
      console.log('🛠️ Ejecutando schema.sql para crear tablas requeridas...');
      const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('🎉 ¡Esquema de base de datos aplicado correctamente!');
      } else {
        console.warn('⚠️ No se encontró backend/supabase/schema.sql localmente.');
      }
    } else {
      console.log('✅ Todas las tablas requeridas por el sistema existen y están operativas.\n');
    }

    // 3. Métricas del sistema en tiempo real
    const profilesCount = await client.query('SELECT COUNT(*) FROM profiles;');
    const surveysCount = await client.query('SELECT COUNT(*) FROM surveys;');
    const responsesCount = await client.query('SELECT COUNT(*) FROM responses;');

    console.log('📈 ESTADO ACTUAL DEL SISTEMA:');
    console.log(`   • Usuarios / Perfiles registrados: ${profilesCount.rows[0].count}`);
    console.log(`   • Encuestas / Campañas activas:    ${surveysCount.rows[0].count}`);
    console.log(`   • Respuestas ciudadanas capturadas: ${responsesCount.rows[0].count}\n`);

    // 4. Asegurar archivo .env en frontend
    const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env');
    const envContent = `# SURVEY 593 — CONFIGURACIÓN DE CONEXIÓN A SUPABASE EMPRESARIAL
VITE_SUPABASE_URL=${CONFIG.supabaseUrl}
# Coloca la Anon Key de tu panel de Supabase si deseas autenticación directa por nube
VITE_SUPABASE_ANON_KEY=sb_publishable_rytdfmxkttelvvndehkp
`;

    if (!fs.existsSync(frontendEnvPath)) {
      fs.writeFileSync(frontendEnvPath, envContent, 'utf8');
      console.log('📝 Creado archivo frontend/.env con las credenciales configuradas.');
    } else {
      console.log('ℹ️ Archivo frontend/.env ya existe.');
    }

    console.log('\n==============================================================================');
    console.log('🎯 SISTEMA LISTO PARA PRODUCCIÓN / SERVIDOR DE LA EMPRESA');
    console.log('==============================================================================');
    console.log('Comandos siguientes para desplegar en el servidor:');
    console.log('  1. cd frontend');
    console.log('  2. npm install');
    console.log('  3. npm run build');
    console.log('  4. Copiar carpeta "dist" al directorio web del servidor (/var/www/html o Nginx)');
    console.log('==============================================================================\n');

  } catch (err) {
    console.error('\n❌ ERROR DURANTE LA VERIFICACIÓN:', err.message);
  } finally {
    await client.end();
  }
}

runDeploy();
