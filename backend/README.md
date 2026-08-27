# Survey 593 — Backend & Base de Datos

Este directorio está reservado para el backend de la plataforma y la configuración de **Supabase / PostgreSQL**.

## 📌 Tecnologías Planificadas
- **Base de Datos:** PostgreSQL (Cloud con Supabase o local con Docker).
- **Backend / APIs:** Supabase Edge Functions / Node.js (Express o NestJS).
- **Autenticación:** Supabase Auth (JWT con soporte para Single Sign-On del Ecosistema Kolab).
- **Control de Acceso:** Row Level Security (RLS) en PostgreSQL para aislamiento de datos entre empresas y encuestados.

## 📁 Estructura Futura Sugerida
```
backend/
├── supabase/
│   ├── migrations/     # Scripts SQL DDL de tablas (users, surveys, responses, wallets)
│   ├── seed.sql        # Datos de prueba iniciales
│   └── config.toml     # Configuración del CLI de Supabase
├── src/                # (Opcional si se usan microservicios Express / NestJS)
└── README.md
```
