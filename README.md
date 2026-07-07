# AYN Security Tasks

AYN Security is a Web/PWA-ready foundation for security task management across malls, factories, compounds, and logistics sites.

Sprint 1 delivers:

- Next.js App Router + TypeScript + Tailwind CSS
- Secure login API with signed HTTP-only cookies
- Role-based redirects for `admin`, `supervisor`, `guard`, and `management`
- Basic empty dashboards for each role
- TiDB/MySQL connection layer using `mysql2`
- SQL schema for the core MVP tables

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/DATABASE?ssl={\"rejectUnauthorized\":true}"
AUTH_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
COOKIE_SECURE="false"
```

Use `COOKIE_SECURE=false` for local development over `http://localhost:3000`. Use `true` on Vercel.

3. Create the database tables in TiDB Cloud by running `db/schema.sql`.

4. Generate a password hash for your first Admin user:

```bash
npm run hash-password -- "StrongPasswordHere"
```

5. Insert the first Admin user manually in TiDB:

```sql
INSERT INTO users (full_name, email, password_hash, role, status)
VALUES ('AYN Admin', 'admin@example.com', 'PASTE_HASH_HERE', 'admin', 'active');
```

6. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000/login`.

## Role Redirects

- `admin` -> `/admin`
- `supervisor` -> `/supervisor`
- `guard` -> `/guard`
- `management` -> `/dashboard`

## API Routes

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/health/db`
- `GET /api/dashboard/summary`
- `GET/POST /api/tasks`
- `GET/POST /api/incidents`
- `GET/POST /api/checkpoints`

## Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Add `DATABASE_URL`, `AUTH_SECRET`, and `COOKIE_SECURE=true` to Vercel Environment Variables.
4. Deploy. Vercel will build the Next.js app automatically.

## TiDB Cloud

Create a TiDB Cloud cluster, copy the MySQL-compatible connection string, and use it as `DATABASE_URL`. Keep secrets in `.env.local` locally and Vercel Environment Variables in production.
