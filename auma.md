Below is the **updated, granular Build Manual** for **AUMA V1**, rewritten to follow your **Codebase Definition Template** structure  and updated to include:

* **GHL Panel build location**: an external web app you build + host (`apps/panel`)
* **Two GHL surfaces**:

  1. **Left‑nav Custom Menu Link** (Embedded Page/iFrame) → “full AUMA”
  2. **Dashboard Embed widget** → “AUMA Today”
* **Location‑scoped MVP** (with optional deep-link to a specific loan via `loan_id`)
* **Team + licensed assistants** (role + authority split)
* **Provider‑neutral core** (adapters for GHL + Google Workspace)

This is written so a builder can execute without inventing details.

---

# 1. Project Identity

## Project Name

**AUMA**

## Project Type

* [x] Full‑Stack Application
* [x] API/Backend Service
* [x] Web Application

## One‑Line Description

AUMA is a provider‑neutral mortgage operations engine that enforces compliance-by-code and surfaces a team work queue inside GoHighLevel, while storing evidence artifacts in Google Workspace.

## Core Purpose

AUMA’s core purpose is to increase MLO/team throughput without compliance drift by making every action pass through a decision engine that evaluates role, license authority, supervision policy, field security tiers, and scrub gates. AUMA produces an immutable audit trail of decisions and events for review.

AUMA is not “a set of workflows.” It is a **core engine** that uses workflows/webhooks as triggers and uses a hosted panel as the product UI.

## Version

Current Version: **v1.0.0 (Pilot MVP)**
Release Date: **Pilot-driven**

---

# 2. Technical Foundation

## Primary Language(s)

* **TypeScript** (95%)
* **SQL** (5%)

## Runtime Environment

* **Node.js 20.x** (API + workers)
* **Browser** (embedded panel in GHL)

## Framework(s)

* **API:** Fastify (Node) — chosen for speed + schema-first patterns.
* **Panel:** Next.js — chosen for stable hosted UI + routing.
* **DB:** Postgres + Prisma — chosen for relational auditability and migrations.

## Key Dependencies

| Dependency   |       Version | Purpose              | Critical? |
| ------------ | ------------: | -------------------- | --------- |
| fastify      | pinned stable | API server           | Yes       |
| prisma       | pinned stable | ORM + migrations     | Yes       |
| zod          | pinned stable | schema validation    | Yes       |
| jsonwebtoken | pinned stable | panel session tokens | Yes       |
| googleapis   | pinned stable | Drive/Docs API       | Yes       |
| pino         | pinned stable | logs                 | Yes       |
| next         | pinned stable | panel app            | Yes       |
| react        | pinned stable | UI                   | Yes       |

---

# 3. Architecture Overview

## Architectural Pattern

* [x] Modular Monolith (core) + Adapters (connectors)
* [x] Event-driven (immutable event log + decisions)
* [ ] Microservices (not for V1)

## High-Level Architecture Diagram

```
GHL (location/subaccount)
  ├─ Left-nav Custom Menu Link  ──>  https://panel.yourdomain.com/ghl/app?locationId=...&userEmail=...
  ├─ Dashboard Embed Widget     ──>  https://panel.yourdomain.com/ghl/widget?locationId=...&userEmail=...
  ├─ Workflows (Custom Webhook/Code) ──> AUMA API /webhooks or /commands
  └─ Messaging events (webhooks)     ──> AUMA API /integrations/ghl/webhooks

AUMA Panel (hosted by you)
  ├─ Next.js UI (full + widget modes)
  └─ Calls AUMA Core API (bootstrap + commands)

AUMA Core API (hosted by you)
  ├─ Tenant/User/Loan/Policy
  ├─ Decision engine (ALLOW/BLOCK/ESCALATE)
  ├─ Field tier enforcement
  ├─ Scrub gates (stage transition guards)
  ├─ Requirements engine
  ├─ Approval queue
  ├─ Alerts ingestion + feed output
  └─ Adapters:
       ├─ GHL adapter (optional writebacks in V1)
       └─ Google Workspace adapter (Drive/Docs)

Postgres (Supabase OK)
Google Workspace (Drive/Docs)
n8n (optional) for alert ingestion
```

## Data Flow

1. User opens AUMA from GHL left-nav or sees AUMA Today widget on dashboard.
2. Panel app creates a **panel session** with AUMA API using location/user context.
3. Panel calls bootstrap → renders location-scoped queues and actions.
4. User clicks action → panel calls AUMA `/commands`.
5. AUMA evaluates and returns **ALLOW/BLOCK/ESCALATE**, logs Decision + Event.
6. If allowed, AUMA executes side effects through adapters and updates state.
7. GHL workflows/webhooks send events (PSA uploaded, messages, etc.) into AUMA to keep the system current.
8. Google Workspace is used to store artifacts and the “Heart of the File” evidence doc.

## State Management

* **Server:** Supabase [Postgres] is authoritative
* **Client:** panel holds only view state; always re-fetch bootstrap after actions

---

# 4. Directory Structure

## Root Structure

```
auma/
  apps/
    api/        # AUMA Core API (Fastify)
    panel/      # Hosted Panel UI (Next.js) for GHL embed + dashboard widget
  packages/
    shared/     # shared types/schemas for API + panel
  infra/
    docker/     # compose files
    deploy/     # caddy/nginx configs
    scripts/    # onboarding scripts
  docs/
    product/
    api/
    ghl/
    google/
    n8n/
```

## File Naming Conventions

* React components: `PascalCase.tsx`
* Domain logic: `camelCase.ts`
* Zod schemas: `*.schema.ts`
* Tests: `*.test.ts`

---

# 5. Core Modules & Components

## Module Map (API)

1. **Auth** (`apps/api/src/auth/`)

   * tenant API key verification (server-to-server)
   * panel session creation (short JWT)
2. **Tenancy** (`apps/api/src/domain/tenant/`)

   * tenant CRUD + policy storage
3. **Users** (`apps/api/src/domain/users/`)

   * role + license_status + supervision link
4. **Loans** (`apps/api/src/domain/loans/`)

   * loan lifecycle, assignment, external refs
5. **Decision Engine** (`apps/api/src/domain/decision/`)

   * capability mapping + evaluation
6. **Field Tier Enforcement** (`apps/api/src/domain/fields/`)

   * server-side filtering of read/write
7. **Scrub Gates** (`apps/api/src/domain/scrub/`)

   * stage transition prerequisites
8. **Requirements** (`apps/api/src/domain/requirements/`)

   * rules engine for dynamic document requirements
9. **Approvals** (`apps/api/src/domain/approvals/`)

   * release queue
10. **Alerts** (`apps/api/src/domain/alerts/`)

* ingestion + query + RSS output

11. **Adapters**

* `adapters/ghl/` (workflow writebacks optional)
* `adapters/google/` (Drive + Docs)

## Module Map (Panel)

* `apps/panel/src/app/ghl/app/page.tsx` → **full AUMA** (left-nav)
* `apps/panel/src/app/ghl/widget/page.tsx` → **AUMA Today widget** (dashboard)
* `apps/panel/src/components/`

  * `LoanQueueTable`
  * `ApprovalsQueue`
  * `PrioritiesList`
  * `AlertsStream`
  * `ActionButtons`
  * `SearchBox`
  * `UserBadge`

---

# 6. Configuration Management

## Environment Variables

### API (`apps/api/.env`)

| Variable                   | Required        | Purpose                             |
| -------------------------- | --------------- | ----------------------------------- |
| DATABASE_URL               | Yes             | Supabase [Postgres] connection                 |
| ENCRYPTION_KEY_HEX         | Yes             | encrypt integration secrets at rest |
| TENANT_KEY_HASH_SALT       | Yes             | hash tenant API keys                |
| PANEL_BASE_URL             | Yes             | used for deep links                 |
| CORS_ALLOWED_ORIGINS       | Yes             | panel domains                       |
| GOOGLE_OAUTH_CLIENT_ID     | Yes (Workspace) | Google OAuth                        |
| GOOGLE_OAUTH_CLIENT_SECRET | Yes (Workspace) | Google OAuth                        |
| GOOGLE_OAUTH_REDIRECT_URI  | Yes (Workspace) | callback URL                        |
| GHL_WEBHOOK_SECRET         | Yes (webhooks)  | verify inbound webhook calls        |

### Panel (`apps/panel/.env`)

| Variable                      | Required | Purpose               |
| ----------------------------- | -------- | --------------------- |
| NEXT_PUBLIC_AUMA_API_BASE_URL | Yes      | where panel calls API |
| NEXT_PUBLIC_PANEL_MODE        | No       | default mode          |

## Feature Flags (V1)

* `ENABLE_GHL_WRITEBACK=false` (default OFF in V1; turn ON later)
* `ENABLE_ALERTS=true`
* `ENABLE_APPROVALS=true`
* `ENABLE_GOOGLE_WORKSPACE=true`

---

# 7. Data Layer

## Database

**Supabase** [postgres 16]

## Core Models (must exist)

* Tenant
* User (role + license_status)
* Integration (provider configs + encrypted secrets)
* Loan
* LoanField (key/value + tier)
* Decision (immutable)
* Event (immutable)
* Requirement
* Approval
* AlertItem
* Artifact

## Field Tiers (must be enforced server-side)

* Tier0 Admin (safe for assistants)
* Tier1 Substantive (restricted)
* Tier2 Restricted (rates/terms/payment, etc.)

---

# 8. External Integrations

## GoHighLevel

You will use three GHL “interfaces” in V1:

1. **Custom Menu Link (Embedded Page / iFrame)**

   * Used to surface the full AUMA panel.

2. **Dashboard Embed Widget**

   * Used to surface the AUMA Today snapshot.

3. **Workflows + Webhooks**

   * Used to push events to AUMA (PSA uploaded, red-flag evaluation triggers, etc.)

## Google Workspace

* Drive folder provisioning per loan
* Google Doc template → “Heart of the File”
* Artifact upload/linking

## n8n (for alerts)

* Gmail label polling → POST alert items to AUMA

---

# 9. Authentication & Authorization

## Authentication (V1)

### Server-to-server

* Tenant API Key (sent by n8n, admin scripts, webhook processors)

### Panel session (browser)

* Short-lived **panel session JWT**
* Never ship tenant API keys into the browser.

## Authorization (V1)

All commands pass through:

* role (Owner/LO/Assistant)
* license_status (Licensed/Unlicensed)
* supervision policy (tenant JSON)
* loan assignment (who owns the file)
* scrub gates (stage transitions)
* field tiers (read/write filtering)

---

# 10. Build & Development

## Package Manager

pnpm

## Local Setup (no guessing)

1. Install:

* Node 20.x
* pnpm
* Docker Desktop

2. Start Postgres:

```bash
docker compose -f infra/docker/docker-compose.local.yml up -d
```

3. Install dependencies:

```bash
pnpm install
```

4. Run migrations:

```bash
pnpm --filter api prisma migrate dev
```

5. Start API:

```bash
pnpm --filter api dev
```

6. Start panel:

```bash
pnpm --filter panel dev
```

---

# 11. Testing Strategy

## Unit tests must cover (P0)

* decision engine allow/block/escalate
* field tier read/write filtering
* scrub gate blocking
* approvals creation + enforcement

## Integration tests must cover (P0)

* create tenant/user/loan
* panel session issuance
* bootstrap returns correct model for role/license
* commands log event + decision immutably

## E2E (P1)

* panel renders in widget mode and full mode
* click actions show correct states

---

# 12. Code Quality & Standards

* ESLint + Prettier
* TS strict mode enabled
* Conventional commits

---

# 13. Deployment & DevOps

## Hosting

* API + panel hosted by you (Hetzner recommended for pilot)
* Cloudflare for DNS + TLS
* Supabase for Postgres

## Domains (explicit)

* `https://api.auma.launchmaniac.com`
* `https://panel.auma.launchmaniac.com`

## Reverse proxy (Caddy or Nginx)

* Route `/` on api domain → API container
* Route `/` on panel domain → Next.js container

---

# 14. Monitoring & Observability

* Request logs with: tenant_id, location_id, user_id, loan_id
* Error tracking: Sentry recommended
* Health endpoint: `GET /health`

---

# 15. Documentation

Must maintain:

* `/docs/api/openapi.yaml`
* `/docs/ghl/setup.md` (CML + dashboard embed + workflows)
* `/docs/google/setup.md` (OAuth + folder template + doc template)
* `/docs/pilot/onboarding.md`

---

# 16. Development Workflow

* `main` = deploy
* `feat/*` branches
* PR requires tests for decision/scrub changes

---

# 17. Common Tasks & Recipes

## Add a capability

1. Add to `capabilities.ts`
2. Map command→capability
3. Add tests
4. Update panel action list renderer

## Add a scrub gate

1. Add prereq list for stage transition
2. Add tests
3. Ensure bootstrap returns missing prerequisites in “reasons”

---

# 18. Known MVP Limitations

* The panel is location-scoped by default (record-scoped deep linking is optional via `loan_id`).
* Some GHL triggers may vary by account plan; you must implement fallbacks (below).

---

# 19. Performance Considerations

* Bootstrap must be < 500ms p95 in pilot.
* DB indices on tenant_id, location_id mapping, loan assignment, created_at.

---

# 20. Security Checklist

* Never embed tenant API keys in panel JS
* Encrypt integration secrets at rest
* Rate limit session creation + commands
* Audit log immutability: no updates allowed

---

# 21. Team & Contacts

Fill with your team.

---

# 22. Reference Links

Keep your internal links in `/docs/`.

---

# 23. Change Log

* v1.0.0 initial pilot manual (this doc)

---

# 24. Appendices

## Appendix A — Exact AUMA Endpoints (Updated for both GHL surfaces + location scope)

### Panel Session (browser)

**POST** `/v1/integrations/ghl/panel/session`

**Request**

```json
{
  "locationId": "GHL_LOCATION_ID",
  "userEmail": "user@example.com",
  "userName": "First Last"
}
```

**Response**

```json
{
  "panelSessionJwt": "eyJhbGciOi..."
}
```

### Bootstrap (location-scoped; optional loan_id)

**GET** `/v1/integrations/ghl/panel/bootstrap?loanId=<optional>&q=<optional>`

**Auth**
`Authorization: Bearer <panelSessionJwt>`

**Response (PanelModel)**

```json
{
  "context": {"locationId":"...","user":{"role":"ASSISTANT","licenseStatus":"LICENSED"}},
  "queues": {"myLoans":[...], "teamLoans":[...]},
  "priorities":[...],
  "requirements":[...],
  "approvals":[...],
  "alerts":[...],
  "actions":[{"id":"PROMOTE_LEAD_TO_LOAN","enabled":true,"reason":null}],
  "activity":[...]
}
```

### Core Admin / Data

* `POST /v1/tenants`
* `POST /v1/tenants/:tenantSlug/users`
* `POST /v1/tenants/:tenantSlug/integrations`
* `POST /v1/tenants/:tenantSlug/loans`
* `GET /v1/tenants/:tenantSlug/loans/:loanId`
* `POST /v1/tenants/:tenantSlug/loans/:loanId/commands`
* `POST /v1/tenants/:tenantSlug/loans/:loanId/events`

### Requirements / Approvals / Alerts

* `GET /v1/tenants/:tenantSlug/loans/:loanId/requirements`
* `POST /v1/tenants/:tenantSlug/loans/:loanId/requirements/recalculate`
* `GET /v1/tenants/:tenantSlug/approvals`
* `POST /v1/tenants/:tenantSlug/approvals/:approvalId/decision`
* `POST /v1/tenants/:tenantSlug/alerts/items`
* `GET /v1/tenants/:tenantSlug/alerts`

### GHL Inbound Webhooks (events)

**POST** `/v1/integrations/ghl/webhooks`

* Used for inbound message events, outbound message events, etc.
* Verify signature using `GHL_WEBHOOK_SECRET`.

---

## Appendix B — Where the GHL Panel is Built, Hosted, and Surfaced (No ambiguity)

### Built

* **Code location:** `apps/panel/` (Next.js)
* You build **two routes**:

  * `/ghl/app` → full AUMA (left-nav)
  * `/ghl/widget` → AUMA Today (dashboard)

### Hosted

* **Your infrastructure**
* Domain example: `https://panel.auma.yourdomain.com`

### Surfaced inside GHL (both)

1. **Custom Menu Link**

   * Title: `AUMA`
   * URL: `https://panel.auma.yoursomain.com/ghl/app?locationId=<dynamic>&userEmail=<dynamic>&userName=<dynamic>`
   * Mode: Embedded Page (iFrame)

2. **Dashboard Embed Widget**

   * URL: `https://panel.auma.yourdomain.com/ghl/widget?locationId=<dynamic>&userEmail=<dynamic>&userName=<dynamic>`

---

## Appendix C — Exact GHL Configuration Steps (Pilot)

### C1) Create the left-nav AUMA entry (Custom Menu Link)

1. In your **Agency** view, open **Settings → Custom Menu Links**.
2. Create a new link:

   * Name: `AUMA`
   * Open in: **Embedded Page**
   * URL: paste your panel `/ghl/app` URL.
3. Insert dynamic values for:

   * Location ID
   * User email
   * User name
     (Use the UI’s dynamic/merge-field picker so you don’t guess token syntax.)
4. Save and confirm it appears in the target sub-account.

### C2) Add the dashboard “AUMA Today” widget

1. In the sub-account, open **Dashboard** → **Edit**
2. Add widget → **Embed**
3. Use URL embed and paste `/ghl/widget` URL with the same dynamic values.
4. Save.

### C3) PSA workflow trigger (fallback-friendly)

Because trigger names vary, implement V1 with two options:

**Option 1 (preferred):** Trigger on “File uploaded” / “Document received” if available
→ call AUMA command `PROMOTE_LEAD_TO_LOAN`.

**Option 2 (always works):** Add a custom field checkbox `PSA_RECEIVED=true`
→ workflow triggers on field change → call AUMA.

### C4) Message red-flag evaluation

* Send inbound message payloads to AUMA via webhook ingestion.
* AUMA runs keyword checks and produces:

  * escalation task creation
  * action disabling in panel until acknowledged

---

## Appendix D — Panel UI Spec (Full + Widget)

### Full (`/ghl/app`)

Sections:

1. User badge + location
2. Search (borrower name/email/phone/loan ID)
3. My Work Queue
4. Team Queue (Owner/LO only)
5. Approvals
6. Priorities
7. Alerts
8. Actions (gated)
9. Activity

### Widget (`/ghl/widget`)

Sections:

1. Approvals count + top 3
2. Top 5 priorities
3. New high-severity alerts
4. Button: “Open AUMA” → deep link to `/ghl/app`

---

Relevant Frameworks:

* Provider‑Neutral Core with Adapter Packs
* Fat Core / Thin Client Surfaces
* Role vs Authority (licensed assistants)
* Capability‑Based Access Control + Field Tiering
* State Machine with Scrub Gates
* Two-Surface UX: Full App + Dashboard Widget
