# Ein Security Operations Platform

Arabic name: عين

Tagline: **See. Control. Prove.**

Ein is a commercial multi-tenant SaaS platform for audit-ready security operations. This repository currently implements only:

- Sprint 0: Project Foundation
- Sprint 1: Authentication & Multi-Tenant

Future operational modules are intentionally not implemented yet.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- TiDB Cloud / MySQL-compatible database
- Secure HTTP-only cookie authentication
- bcrypt password hashing via `bcryptjs`
- Role-based access control
- Multi-tenant data model
- Vercel-ready deployment

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/DATABASE?sslaccept=strict"
AUTH_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
NEXT_PUBLIC_APP_NAME="Ein"
NEXT_PUBLIC_APP_AR_NAME="عين"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
UPLOAD_PROVIDER="placeholder"
COOKIE_SECURE="false"
```

Use `COOKIE_SECURE=false` locally over HTTP. Use secure cookies in production.

## Local Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Prisma

Schema: `prisma/schema.prisma`

Implemented models:

- `Tenant`
- `User`
- `AuditLog`

Tenant data is scoped by `tenantId`. Super admins may access global admin views; tenant users are bound to their tenant.

## Demo Seed Users

All seeded users use the development/demo password:

```text
Ein@123456
```

Change this before production use.

| Email | Role | Redirect |
| --- | --- | --- |
| `superadmin@ein.app` | `super_admin` | `/admin` |
| `tenantadmin@demo.ein.app` | `tenant_admin` | `/dashboard` |
| `manager@demo.ein.app` | `security_manager` | `/dashboard` |
| `supervisor@demo.ein.app` | `supervisor` | `/supervisor` |
| `gate@demo.ein.app` | `gate_officer` | `/gate` |
| `guard@demo.ein.app` | `guard` | `/guard` |
| `viewer@demo.ein.app` | `viewer` | `/dashboard` |

## API Routes

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/admin/tenants`
- `POST /api/admin/tenants`
- `GET /api/admin/users`
- `POST /api/admin/users`

## Pages

- `/` public placeholder home
- `/login`
- `/admin` super admin only
- `/dashboard` tenant admin, security manager, viewer
- `/supervisor` supervisor only
- `/gate` gate officer only
- `/guard` guard only
- `/unauthorized`

## Not Implemented Yet

The following roadmap items are intentionally placeholders only:

- Gate operations
- Patrol
- Tasks
- Incidents
- Reports
- Evidence archive
- Subscription management
- Landing page / commercial demo request
- Payment
- File upload
- AI
- WhatsApp
- Hardware integrations

## Vercel Notes

Add these environment variables in Vercel:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_AR_NAME`
- `NEXT_PUBLIC_APP_URL`
- `UPLOAD_PROVIDER`

Run Prisma migrations against your TiDB/MySQL database before production use.

## TiDB Notes

Use the TiDB Cloud MySQL-compatible connection string as `DATABASE_URL`. Keep secrets in local `.env.local` and Vercel Environment Variables.
