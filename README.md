# Sports Tournament Manager

Aplicación web para gestionar torneos, equipos, jugadores, partidos y pagos. El proyecto incluye un frontend React + TypeScript y una API Express con autenticación JWT y persistencia mediante Prisma.

## Requisitos

- Node.js 18 o superior
- npm

## Ejecutar en local

Instala las dependencias del frontend desde la raíz:

```sh
npm install
```

En otra terminal, instala y configura el backend:

```sh
cd backend
npm install
```

Crea `backend/.env` copiando `backend/.env.example`. En PowerShell:

```powershell
Copy-Item .env.example .env
```

Inicializa la base de datos SQLite local y arranca la API:

```sh
npm run db:push
npm run dev
```

La API queda disponible en `http://localhost:4000`. En una segunda terminal, desde la raíz del proyecto, arranca el frontend:

```sh
npm run dev
```

Vite muestra la dirección local, normalmente `http://localhost:5173`.

## Autenticación y datos

El registro almacena contraseñas con bcrypt y el login verifica las credenciales en el backend. La API emite JWT y limita los torneos al usuario autenticado. En desarrollo, Prisma usa SQLite en `backend/prisma/dev.db`; los archivos de entorno y la base de datos local están excluidos de Git.

Antes de desplegar, configura un `JWT_SECRET` aleatorio y largo, `DATABASE_URL` para una base PostgreSQL gestionada y `VITE_API_URL` con la URL pública de la API. No publiques archivos `.env` ni secretos en GitHub.

## Scripts

- Raíz: `npm run dev`, `npm run build`, `npm run preview`
- Backend: `npm run dev`, `npm run build`, `npm run db:push`, `npm run db:studio`
