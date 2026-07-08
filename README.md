# AYN Security Tasks

AYN Security is a Web/PWA-ready security operations platform for malls, factories, compounds, ports, and logistics sites.

The product vision is simple:

> العين ترى، تسجل، تصعّد، وتغلق المهمة بالدليل.

AYN turns verbal and paper-based security follow-up into a live operational system where every task, QR checkpoint, incident, escalation, and closure has an accountable evidence trail.

## Operating Roles

| Role | Function |
| --- | --- |
| Admin | Create sites, users, checkpoints, and permissions. |
| Security Supervisor | Assign tasks, monitor patrols, review incidents, and escalate when needed. |
| Security Guard | Execute tasks, scan QR checkpoints, upload images, and record notes. |
| Management | View dashboards, KPIs, reports, SLA status, and escalations. |

Public registration is intentionally disabled. Users are created by Admin only because AYN is a closed security system, not an open public app.

## Core Functions

### Security Site Structure

AYN models every secured location as:

```text
Client -> Site -> Zone -> Checkpoint
```

Example:

```text
Company / Mall
-> 20 West Mall
-> Parking Zone
-> Gate 01 / Fire Exit / CCTV Room / Roof Access
```

Every checkpoint has its own QR code for patrol proof.

### Security Tasks

Task types in V1:

| Type | Example |
| --- | --- |
| Patrol Task | Visit selected checkpoints every hour. |
| Fixed Post Task | Confirm presence at a gate or entrance. |
| Incident Task | Fight, theft, unauthorized access. |
| Checklist Task | Fire extinguishers, emergency doors, exits. |
| Escort Task | Escort visitor or contractor. |
| Urgent Task | Immediate supervisor intervention. |

Task status flow:

```text
Pending -> In Progress -> Submitted -> Approved / Rejected / Escalated
```

### QR Patrol

When a guard scans a checkpoint QR code, AYN records:

- Guard name
- Checkpoint
- Time
- GPS when available
- Optional image
- Note
- Late/on-time flag

### Incidents

Incident reports include:

- Incident type
- Severity: `Low`, `Medium`, `High`, `Critical`
- Location
- Description
- Images
- Action taken
- Escalation
- Closure status

### Dashboard

Management dashboard tracks:

- Tasks today
- Completion rate
- Late tasks
- Open incidents
- Guard performance
- Most problematic checkpoints
- Incidents by severity
- Patrol compliance %

## MVP V1 Scope

The first production version stays simple and strong:

- Login
- Users & roles
- Sites / zones / checkpoints
- Create task
- Guard task list
- QR check-in
- Incident report
- Supervisor approval
- Basic dashboard

V2 candidates include AI, Walkie Talkie, Face Recognition, Maps, and native mobile apps.

Sprint 1 delivers:

- Next.js App Router + TypeScript + Tailwind CSS
- Secure login API with signed HTTP-only cookies
- Role-based redirects for `admin`, `supervisor`, `guard`, and `management`
- Admin-only user creation after the first bootstrap account
- Basic responsive dashboards for each role
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

Or seed/update a bootstrap admin through the app script when `DATABASE_URL` is available:

```bash
npm run seed-admin -- "admin" "123"
```

Use `123` only as a temporary bootstrap password, then replace it with a stronger password.

After that first bootstrap account, create all additional users from `/admin`. Public registration is intentionally not available.

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
- `GET/POST /api/users` (admin only)
- `GET/POST /api/clients`
- `GET/POST /api/sites`
- `GET/POST /api/zones`
- `GET/POST /api/tasks`
- `POST /api/tasks/:id/approval`
- `GET/POST /api/incidents`
- `GET/POST /api/checkpoints`
- `POST /api/qr-checkins`

## Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Add `DATABASE_URL`, `AUTH_SECRET`, and `COOKIE_SECURE=true` to Vercel Environment Variables.
4. Deploy. Vercel will build the Next.js app automatically.

## TiDB Cloud

Create a TiDB Cloud cluster, copy the MySQL-compatible connection string, and use it as `DATABASE_URL`. Keep secrets in `.env.local` locally and Vercel Environment Variables in production.
