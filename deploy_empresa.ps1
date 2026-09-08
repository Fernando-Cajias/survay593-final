# ==============================================================================
# SURVEY 593 — SCRIPT DE DESPLIEGUE AUTOMÁTICO EN SERVIDOR WINDOWS / POWERSHELL
# ==============================================================================
# Ejecución: .\deploy_empresa.ps1
# ==============================================================================

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "  SURVEY 593 — DESPLIEGUE AUTOMÁTICO EN SERVIDOR EMPRESARIAL" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan

# 1. Verificar Node.js y npm
Write-Host "`n[Paso 1/4] Verificando entorno de ejecución..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js no está instalado en este servidor. Descárgalo de https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js versión: $(node -v)" -ForegroundColor Green

# 2. Diagnóstico y conexión a la base de datos Supabase
Write-Host "`n[Paso 2/4] Conectando y verificando base de datos Supabase PostgreSQL..." -ForegroundColor Yellow
node backend/deploy_server.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "ADVERTENCIA: La conexión directa a PostgreSQL reportó alertas, continuando con el build..." -ForegroundColor Yellow
}

# 3. Instalación de dependencias del frontend
Write-Host "`n[Paso 3/4] Instalando dependencias de frontend (npm install)..." -ForegroundColor Yellow
Set-Location -Path frontend
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR al instalar dependencias de npm." -ForegroundColor Red
    Set-Location -Path ..
    exit 1
}

# 4. Compilación del proyecto para producción
Write-Host "`n[Paso 4/4] Compilando frontend para producción (npm run build)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR al compilar el proyecto." -ForegroundColor Red
    Set-Location -Path ..
    exit 1
}

Set-Location -Path ..

Write-Host "`n==============================================================================" -ForegroundColor Cyan
Write-Host "  ¡COMPILACIÓN EXITOSA! APLICACIÓN LISTA PARA SERVIDOR" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "Los archivos optimizados para producción están en: frontend/dist" -ForegroundColor White
Write-Host "Puedes servirlos mediante IIS, Nginx, Apache o el comando: npm run preview" -ForegroundColor White
Write-Host "==============================================================================`n" -ForegroundColor Cyan
