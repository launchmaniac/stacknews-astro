# StackNews

Real-time information aggregator with cyber-terminal aesthetic.

Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com

## Project Structure

```text
/
├── public/
├── src/
│   ├── components/
│   │   ├── astro/       # Astro components (Header, Sidebar, etc.)
│   │   └── react/       # React islands (data panels, feeds, clock)
│   │       ├── TreasuryPanel.tsx   # Debt, cash, interest rate
│   │       ├── MarketPanel.tsx     # S&P 500, DOW, NASDAQ, VIX
│   │       ├── CryptoPanel.tsx     # BTC, ETH, SOL prices
│   │       ├── CommoditiesPanel.tsx # Gold, Silver, Oil, Gas
│   │       ├── YieldCurvePanel.tsx # Treasury yield curve rates
│   │       ├── FeedLoader.tsx      # RSS feed display
│   │       └── LiveWire.tsx        # Live feed sidebar
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── constants.ts # Feed configurations
│   │   ├── yahoo.ts     # Yahoo Finance API wrapper
│   │   ├── fred.ts      # FRED API wrapper
│   │   ├── treasury-fiscal.ts # Treasury FiscalData API
│   │   ├── yield-curve.ts # Daily yield curve data
│   │   └── types.ts     # TypeScript interfaces
│   ├── pages/
│   │   ├── api/         # Server-side API endpoints
│   │   │   ├── feeds.json.ts       # RSS feed aggregator
│   │   │   ├── treasury.json.ts    # Treasury metrics
│   │   │   ├── market.json.ts      # Market indices, crypto, commodities
│   │   │   └── treasury/yield-curve.json.ts # Yield curve rates
│   │   └── index.astro  # Main dashboard
│   └── styles/
│       └── global.css   # Design system tokens and styles
└── package.json
```

## Commands

All commands are run from the root of the project:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start local dev server at `localhost:4321`   |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview build locally before deploying       |

## Deployment

Deployed to Cloudflare Pages at stacknews.org

### Architecture Overview

```
Browser -> Cloudflare Edge Cache -> Cloudflare Pages (thin proxy) -> Hetzner RSS Service -> Redis -> External RSS Sources
```

**Hetzner RSS Service** (December 2025): All RSS feed fetching and caching has been moved to a dedicated Hetzner server (`rss.stacknews.launchmaniac.com`). This resolves TreasuryDirect and other government feeds that block Cloudflare IPs. Cloudflare Pages acts as a thin proxy with edge caching.

### Hetzner Backend

- **RSS Service:** https://rss.stacknews.launchmaniac.com
- **Repository:** https://github.com/launchmaniac/stacknews-rss
- **Stack:** Hono + TypeScript + Redis 7
- **Location:** `/opt/stacknews-rss/` on Hetzner server
- **Redis:** Shared Redis at `/opt/shared-services/` with `stacknews:` key prefix

### Current Bindings (wrangler.toml)

- **KV Binding:** `STACKNEWS_KV` → `8f9f004bf39a4e92ac3c21ebf1545d68` (fallback cache)
- **Secret:** `HETZNER_API_KEY` → Bearer token for Hetzner RSS service

Project names and Wrangler files
- Pages project: defined in `wrangler.jsonc` as `stacknews-astro` (used by `wrangler pages ...`).
- Workers CLI name: `wrangler.toml` keeps `name = "stacknews"` (not used by Pages deploys; retained for clarity and CLI ergonomics).
- Compatibility date is aligned across files (`2024-12-01`) to avoid runtime drift.

## Tech Stack

- Astro (SSR mode)
- React (client islands)
- Tailwind CSS v4
- Cloudflare Pages/Workers

## Local Development

- Prereqs
  - Node LTS (see `.nvmrc`, engines in `package.json`).
  - Copy `.dev.vars.example` to `.dev.vars` and populate: `FRED_API_KEY`, `NASA_API_KEY`, `EIA_API_KEY`, `WARM_SECRET`.
  - Install deps: `npm install`.

- Run
  - `npm run dev` (Astro + Cloudflare adapter with `platformProxy` so Pages bindings/secrets are available in dev).

- Validate
  - Env/bindings sanity: `npm run env:verify`.
  - Production smoke checks: `npm run smoke` (set `SMOKE_ORIGIN` to override origin).

## Configuration

- Secrets
  - Set `FRED_API_KEY` as a Cloudflare secret/binding. For local dev with the Cloudflare platform proxy enabled, add it to `.dev.vars`. For production, run: `wrangler secret put FRED_API_KEY`.
  - The Treasury and macro endpoints read the key from `locals.runtime.env.FRED_API_KEY` at runtime. No secrets are committed in source.

- Caching
  - Feed API responses include `Cache-Control: public, s-maxage=300, stale-while-revalidate=600, stale-if-error=86400` headers.
  - Primary cache: Cloudflare Edge Cache (5 minutes for feeds)
  - Secondary cache: Hetzner Redis (category-specific TTLs: 3-30 minutes)
  - Fallback: Cloudflare KV for stale data during outages

    - Hetzner RSS Service (primary)
      - All RSS fetching is handled by Hetzner at `rss.stacknews.launchmaniac.com`
      - Cloudflare Pages forwards requests with Bearer authentication
      - Background scheduler refreshes categories every 30 seconds
      - Redis caching with distributed locks prevents thundering herd

- KV fallback (optional, recommended)
  - Create (or reuse) a KV namespace titled `STACKNEWS_KV` and set its id in `wrangler.toml`.
  - Used as fallback when Hetzner is unavailable.
  - Keys:
    - `categorydata:<category>` → `{ feeds, stream?, ts }`
    - `treasury:v1` → `{ data, ts }`

Verification
- After deploy, verify endpoints and caching:
  - `curl -sI 'https://stacknews.org/api/treasury/yield-curve.json?days=60' | egrep -i 'http/|cache-control|x-cache'`
  - `curl -sI 'https://stacknews.org/api/feeds.json?category=TREASURY' | egrep -i 'x-cache|x-upstream'`
  - Expected: `x-upstream: hetzner` confirms Hetzner backend is active
- Verify security headers are present:
  - `curl -sI https://stacknews.org | egrep -i 'strict|content-security|referrer|permissions|x-frame|nosniff'`

    Notes
    - If you see a build log like "Enabling sessions with Cloudflare KV with the 'SESSION' KV binding", sessions remain disabled in `astro.config.mjs`; the log is informational.
    - No fake/filler data policy: the UI renders nothing until real data exists (no "loading" or "syncing" placeholders). Panels/widgets appear only when actual data is present.

## Operations

- Deploy (production)
  - `npm run build`
  - `npx wrangler pages deploy --project-name stacknews-astro ./dist`

- Secrets (Pages)
  - Set or update: `npx wrangler pages secret put FRED_API_KEY --project-name stacknews-astro`
  - Repeat for: `NASA_API_KEY`, `EIA_API_KEY`, `WARM_SECRET`.

- Bindings (source-controlled)
  - Edit `wrangler.toml` for bindings:
    - KV: `[[kv_namespaces]]` with `binding = "STACKNEWS_KV"`, and `id = "<namespace_id>"`.
  - Re-deploy Pages to apply.

    - Hetzner RSS Service (external)
      - Repository: https://github.com/launchmaniac/stacknews-rss
      - Server: `/opt/stacknews-rss/` on Hetzner (5.78.152.218)
      - Deploy: `cd /opt/stacknews-rss && git pull && docker compose --env-file .env up -d --build`
      - Logs: `docker logs stacknews-rss -f`
      - Health: `curl https://rss.stacknews.launchmaniac.com/health`
      - Redis: Shared at `/opt/shared-services/` with `stacknews:` key prefix

    - View deployments and tail logs
  - Latest production deployment (API):
    - `curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \`
    - `  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/pages/projects/stacknews-astro/deployments?environment=production&per_page=1" | jq .`
  - Tail specific deployment:
    - `npx wrangler pages deployment tail --project-name stacknews-astro --environment production --deployment-id <id>`

    - Sanity checks
  - Caching headers: `curl -sI 'https://stacknews.org/api/treasury/yield-curve.json?days=60' | egrep -i 'http/|cache-control|x-cache'`
  - Feed rotation: `curl -s 'https://stacknews.org/api/feeds.json?category=ALL' | jq '._cache'`
      - Security headers: `curl -sI https://stacknews.org | egrep -i 'strict|content-security|referrer|permissions|x-frame|nosniff'`

    - Rollback (quick guidance)
      - Identify previous good deployment via API/UI (see commands above).
      - Option A: check out the commit corresponding to the good deployment and redeploy: `npm run build && npx wrangler pages deploy --project-name stacknews-astro ./dist`.
      - Option B: use Pages UI to promote a previous deployment.

    - Security headers (Terraform)
      - `export CLOUDFLARE_API_TOKEN=...`
      - Initialize: `terraform -chdir=infrastructure/terraform/cloudflare init`
      - Apply (production/defaults):
        - `terraform -chdir=infrastructure/terraform/cloudflare apply -auto-approve -var="zone_id=<ZONE_ID>" -var="environment=production" -var="enable_csp=true" -var="csp_mode=enforce"`
      - Apply (staging/report-only CSP):
        - `terraform -chdir=infrastructure/terraform/cloudflare apply -auto-approve -var="zone_id=<ZONE_ID>" -var="environment=staging" -var="enable_csp=true" -var="csp_mode=report-only"`
      - Apply (development/permissive CSP):
        - `terraform -chdir=infrastructure/terraform/cloudflare apply -auto-approve -var="zone_id=<ZONE_ID>" -var="environment=development" -var="enable_csp=true" -var="csp_mode=enforce"`
      - Override CSP explicitly (optional):
        - Add `-var="csp='<your policy>'"` to override the environment default.
      - Script execution & hydration
        - Astro React islands bootstrap with inline scripts. The default Terraform templates therefore include `'unsafe-inline'` in `script-src` for production/staging (see `csp_prod`/`csp_staging`). If you override CSP, either keep that allowance or supply a nonce/hash through Cloudflare Transform Rules so hydration can run.
        - Keep `connect-src 'self'` unless you truly need cross-origin browser calls; all data loads should flow through `/api/*` functions so we maintain a single trust boundary.
      - Re-capture live ruleset snapshot for drift detection:
        - `node scripts/fetch-security-headers-live.mjs --zone-id <ZONE_ID>`
        - Output: `scripts/security-headers.live.json`
      - Note: Terraform/transcripts referenced here are maintained externally; commands are kept for operator convenience.

- Troubleshooting
  - If bindings don’t appear at runtime, confirm `wrangler.toml` has correct `[[services]]` and `[[kv_namespaces]]` blocks and redeploy.
  - If KV namespace was recreated, update its `id` in `wrangler.toml`.
  - If endpoints return slow or error, confirm Cache API and KV fallbacks by inspecting `X-Cache` and `_cache` markers.
