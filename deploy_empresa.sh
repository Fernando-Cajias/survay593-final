#!/bin/bash
# ==============================================================================
# SURVEY 593 — SCRIPT DE DESPLIEGUE AUTOMÁTICO EN SERVIDOR LINUX / UBUNTU
# ==============================================================================
# Ejecución: chmod +x deploy_empresa.sh && ./deploy_empresa.sh
# ==============================================================================

set -e

echo "=============================================================================="
echo "  SURVEY 593 — DESPLIEGUE AUTOMÁTICO EN SERVIDOR EMPRESARIAL (LINUX)"
echo "=============================================================================="

# 1. Comprobar Node.js y npm
echo -e "\n[Paso 1/4] Verificando entorno Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no encontrado. Instala Node.js 18+ antes de continuar."
    exit 1
fi
echo "Node.js versión: $(node -v)"

# 2. Diagnóstico y conexión a la base de datos Supabase
echo -e "\n[Paso 2/4] Verificando tablas en Supabase PostgreSQL..."
node backend/deploy_server.js || true

# 3. Instalación de dependencias
echo -e "\n[Paso 3/4] Instalando dependencias de frontend (npm install)..."
cd frontend
npm install

# 4. Compilación
echo -e "\n[Paso 4/4] Compilando frontend para producción (npm run build)..."
npm run build

cd ..

echo -e "\n=============================================================================="
echo "  ¡DESPLIEGUE EXITOSO! APLICACIÓN LISTA PARA SERVIR"
echo "=============================================================================="
echo "Los archivos listos para servir están en: $(pwd)/frontend/dist"
echo "Para desplegar en Nginx, copia el contenido a /var/www/html/:"
echo "  sudo cp -r frontend/dist/* /var/www/html/"
echo "==============================================================================\n"
