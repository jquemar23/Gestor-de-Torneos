# Sports Tournament Manager Backend

## Requisitos

- Node.js 18+
- SQLite (para desarrollo local)

## Instalación

```bash
npm install
npx prisma db push
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores.

## Endpoints principales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tournaments`
- `POST /api/tournaments`
- `PUT /api/tournaments/:id`
- `DELETE /api/tournaments/:id`
