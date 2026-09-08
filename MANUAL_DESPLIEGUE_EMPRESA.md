# GUÍA MAESTRA DE DESPLIEGUE EMPRESARIAL Y CREDENCIALES
## Survey 593 — Ecosistema de Investigación y Analítica para Ecuador

Este documento contiene la totalidad de credenciales, parámetros de red y scripts automatizados para poner en marcha y desplegar el sistema **Survey 593** en cualquier infraestructura corporativa (Servidor On-Premise, Servidor Cloud Ubuntu/Debian, Windows Server, Docker o Vercel).

---

## 🔐 1. CREDENCIALES MAESTRAS DE SUPABASE POSTGRESQL

La base de datos oficial se encuentra aprovisionada en la nube con réplicas de alta disponibilidad y soporte de pooling para miles de conexiones concurrentes:

| Parámetro | Valor de Conexión | Descripción / Uso |
| :--- | :--- | :--- |
| **Proyecto Supabase ID** | `rytdfmxkttelvvndehkp` | Identificador único del proyecto en Supabase |
| **Supabase REST URL** | `https://rytdfmxkttelvvndehkp.supabase.co` | Endpoint para clientes HTTP y SDK de React |
| **Host PostgreSQL (Pooler)** | `aws-0-us-east-1.pooler.supabase.com` | Servidor PostgreSQL para conexiones empresariales |
| **Puerto PostgreSQL** | `6543` (Transaction Pooler) / `5432` (Session) | Puerto de base de datos |
| **Nombre de Base de Datos** | `postgres` | Base de datos principal |
| **Usuario PostgreSQL** | `postgres.rytdfmxkttelvvndehkp` | Usuario con privilegios de lectura/escritura y DDL |
| **Contraseña PostgreSQL** | `survay593sql` | Clave secreta de base de datos |
| **Cadena de Conexión URI** | `postgresql://postgres.rytdfmxkttelvvndehkp:survay593sql@aws-0-us-east-1.pooler.supabase.com:6543/postgres` | Para clientes tipo DBeaver, pgAdmin, Prisma, Node.js o scripts de migración |

---

## 🚀 2. SCRIPTS AUTOMATIZADOS INCLUIDOS EN EL PROYECTO

Hemos dejado listos scripts de ejecución en 1 solo comando según el sistema operativo del servidor:

### A) Diagnóstico y Verificación de la Base de Datos (Multiplataforma)
Verifica la conectividad con Supabase, comprueba las 6 tablas (`profiles`, `surveys`, `questions`, `responses`, `transactions`, `custom_dashboards`) y muestra las métricas actuales:
```bash
node backend/deploy_server.js
```

### B) Despliegue en Servidor Windows (PowerShell)
Ejecuta la verificación de la base de datos, instala dependencias de npm y compila el frontend para producción:
```powershell
.\deploy_empresa.ps1
```

### C) Despliegue en Servidor Linux / Ubuntu / Debian (Bash)
Otorga permisos de ejecución y compila todo el entorno:
```bash
chmod +x deploy_empresa.sh
./deploy_empresa.sh
```

---

## 🏢 3. OPCIONES DE DESPLIEGUE EN SERVIDOR EMPRESARIAL

### Opción 1: Servidor Web Nginx (Recomendado para Empresas con Linux)
1. Instalar Nginx en el servidor de la empresa:
   ```bash
   sudo apt update && sudo apt install -y nginx nodejs npm
   ```
2. Clonar el repositorio:
   ```bash
   git clone https://github.com/Fernando-Cajias/survey593.git
   cd survey593
   ```
3. Ejecutar el script de despliegue:
   ```bash
   chmod +x deploy_empresa.sh
   ./deploy_empresa.sh
   ```
4. Copiar la carpeta compilada al directorio raíz de Nginx:
   ```bash
   sudo cp -r frontend/dist/* /var/www/html/
   sudo cp nginx.conf /etc/nginx/sites-available/default
   sudo systemctl restart nginx
   ```
5. ¡Listo! La aplicación ya responde en el puerto 80 del servidor corporativo.

---

### Opción 2: Despliegue con Docker y Docker Compose (Containerizado)
Si la infraestructura de la empresa utiliza Docker o Kubernetes, el proyecto incluye un `Dockerfile` multi-stage y un `docker-compose.yml` listos para usar:
```bash
# Construir y levantar el contenedor en segundo plano
docker-compose up -d --build

# Ver logs de la aplicación
docker-compose logs -f
```
El contenedor expone automáticamente la aplicación optimizada sobre Nginx Alpine en el puerto `80`.

---

### Opción 3: Servidor Node.js con PM2 / Preview
Si la empresa desea servir la aplicación directamente mediante un proceso Node:
```bash
cd frontend
npm install
npm run build
npm install -g serve
serve -s dist -l 3000
```
*(O utilizando PM2 para mantener el servicio activo ante reinicios del servidor):*
```bash
npm install -g pm2
pm2 start "serve -s dist -l 3000" --name "survey593-frontend"
pm2 save
pm2 startup
```

---

### Opción 4: Despliegue en la Nube (Vercel / Netlify / Render)
1. Conectar el repositorio de GitHub: `https://github.com/Fernando-Cajias/survey593`
2. Configurar los parámetros del proyecto:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Agregar las Variables de Entorno (Environment Variables):
   - `VITE_SUPABASE_URL` = `https://rytdfmxkttelvvndehkp.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = *(Tu clave de Supabase si aplica)*

---

## 🗄️ 4. ESTRUCTURA Y MIGRACIÓN DE LA BASE DE DATOS

El archivo completo de esquema DDL con soporte de borrado en cascada, tablas normalizadas y políticas de seguridad se encuentra en:
👉 `backend/supabase/schema.sql`

Contiene:
1. `profiles`: Datos de usuario, roles (`provider`, `doer`, `admin`), saldo de billetera, verificación de identidad y ciudad.
2. `surveys`: Campañas, presupuestos, recompensas monetarias asignadas y estado (`active`, `completed`).
3. `questions`: Preguntas de opción múltiple, escala Likert 1-5, Sí/No y texto libre con opciones almacenadas en JSONB.
4. `responses`: Respuestas ciudadanas capturadas, georreferenciación y fechas de completado.
5. `transactions`: Libro contable financiero de acreditaciones y retiros bancarios.
6. `custom_dashboards`: Tableros de Business Intelligence con widgets y coordenadas en cuadrícula.
7. `Row Level Security (RLS)`: Políticas de protección de datos a nivel de motor.

---

## 📞 5. SOPORTE Y CONTACTO
- **Desarrollado para:** Ecosistema Kolab / Sector Corporativo y Educativo de Ecuador.
- **Repositorio para Colaboradores:** [https://github.com/Fernando-Cajias/survey593](https://github.com/Fernando-Cajias/survey593)
- **Repositorio Principal Protegido:** [https://github.com/Fernando-Cajias/survay593-final](https://github.com/Fernando-Cajias/survay593-final)
