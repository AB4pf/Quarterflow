# QuarterFlow (Vision-project)

A planner for college students on semester or quarter systems — tracks
courses, assignments, and workload so busy weeks don't sneak up on you.

## Tech stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: MySQL
- Docker Compose for local dev

## Project structure

```
backend/     Express API, MySQL access, authentication
frontend/    React app skeleton (no UI/UX yet — build on top of this)
docker-compose.yml
.env.example
```

## Getting started

1. Copy the env file and fill in real values (especially `JWT_SECRET`):
   ```
   cp .env.example .env
   ```
2. Start everything:
   ```
   docker compose up --build
   ```
3. Services:
   - Backend: http://localhost:4000 (health check at `/health`)
   - Frontend: http://localhost:5173
   - MySQL: localhost:3306

The `users` table is created automatically on first boot via
`backend/src/db/init.sql`.

## Auth API (already implemented)

| Method | Route              | Body                                | Auth |
|--------|---------------------|--------------------------------------|------|
| POST   | `/api/auth/register` | `{ email, password, name }`         | none |
| POST   | `/api/auth/login`    | `{ email, password }`               | none |
| GET    | `/api/auth/me`       | —                                    | Bearer token |

Successful register/login return `{ token, user }`. Pass the token as
`Authorization: Bearer <token>` on protected routes.

A minimal frontend API wrapper for these lives in
`frontend/src/api/auth.ts` — no components or styling included on
purpose, so the team can build their own UI/UX on top of it.

## Local dev without Docker

**Backend**
```
cd backend
npm install
npm run dev
```

**Frontend**
```
cd frontend
npm install
npm run dev
```

You'll need a local MySQL instance and matching `.env` values if you
skip Docker.

## Branching

- `development` is the default branch. Open a pull request to merge
  into it — direct pushes are blocked.
