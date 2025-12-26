# StackNews Codebase Definition

## Purpose
This document provides a comprehensive technical blueprint for the StackNews codebase. Use alongside `STACKNEWS-WORKSPACE.md` for dynamic project tracking.

---

## 1. Project Identity

### Project Name
StackNews

### Project Type
- [x] Web Application
- [ ] Mobile Application
- [x] API/Backend Service
- [ ] CLI Tool
- [ ] Library/Package
- [ ] Desktop Application
- [x] Full-Stack Application
- [ ] Microservice
- [ ] Other: ___________

### One-Line Description
Real-time financial and economic data dashboard aggregating official government data sources into a Bloomberg-lite experience.

### Core Purpose
StackNews is a financial intelligence dashboard that democratizes access to economic data typically reserved for institutional investors. It pulls from official government sources (Treasury, BLS, Census, USITC, Federal Reserve) and market data providers to create a comprehensive view of US economic health.

The project serves investors, analysts, journalists, and anyone wanting real-time visibility into national debt, treasury yields, labor statistics, inflation metrics, and market indices without expensive terminal subscriptions.

Built on the "no fake data" principle - if an API fails, we show nothing rather than placeholder or stale data. All data comes from authoritative sources with clear provenance.

### Version
Current Version: v0.0.1
Release Date: December 2025

---

## 2. Technical Foundation

### Primary Language(s)
- **Language:** TypeScript
- **Version:** 5.x (via Astro)
- **Percentage of Codebase:** 95%

- **Language:** CSS (Tailwind)
- **Version:** 4.x
- **Percentage of Codebase:** 5%

### Runtime Environment
- **Environment:** Cloudflare Workers (Edge Runtime)
- **Version:** V8 Isolates (Workers Runtime)
- **Target Platforms:** Web browsers (all modern), Server-side edge

### Framework(s)
- **Primary Framework:** Astro
- **Version:** 5.16.x
- **Purpose:** Server-side rendering with Islands Architecture for minimal JS shipping

- **Secondary Framework:** React
- **Version:** 18.3.x
- **Purpose:** Interactive components (data panels, charts) via Astro Islands

### Key Dependencies

| Dependency | Version | Purpose | Critical? |
|------------|---------|---------|-----------|
| `astro` | ^5.16.4 | Core SSR framework | Yes |
| `@astrojs/cloudflare` | ^12.6.12 | Edge deployment adapter | Yes |
| `@astrojs/react` | ^4.4.2 | React islands integration | Yes |
| `react` | ^18.3.1 | Interactive UI components | Yes |
| `react-dom` | ^18.3.1 | React DOM rendering | Yes |
| `tailwindcss` | ^4.1.17 | Utility-first CSS | Yes |
| `@tailwindcss/vite` | ^4.1.17 | Vite plugin for Tailwind | Yes |
| `date-fns` | ^4.1.0 | Date formatting utilities | No |
| `lucide-react` | ^0.556.0 | Icon library | No |

---

## 3. Architecture Overview

### Architectural Pattern
- [ ] Monolithic
- [ ] Microservices
- [x] Serverless
- [x] JAMstack
- [ ] Modular Monolith
- [ ] Event-Driven
- [ ] Layered Architecture
- [ ] Other: ___________

### High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Client                          │
│  (Astro SSR + React Islands: HeroMetrics, Panels, LiveWire)    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge (Workers)                    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ Static HTML │  │  API Routes │  │  Response Caching       │ │
│  │   (SSR)     │  │ /api/*.json │  │  (s-maxage headers)     │ │
│  └─────────────┘  └──────┬──────┘  └─────────────────────────┘ │
└──────────────────────────┼──────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ↓               ↓               ↓
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  Government APIs │ │  Market APIs │ │   RSS Feeds      │
│                  │ │              │ │                  │
│ - Treasury Fiscal│ │ - Yahoo Fin  │ │ - White House    │
│ - BLS (Labor)    │ │   (indices,  │ │ - Congress       │
│ - Census         │ │    crypto,   │ │ - Federal Reserve│
│ - USITC EDIS     │ │    commodit) │ │ - SEC/CFTC       │
│ - Fed Reserve    │ │              │ │ - State Dept     │
│ - Treasury Yield │ │              │ │ - DOJ/FBI        │
└──────────────────┘ └──────────────┘ └──────────────────┘
```

### Data Flow
1. **Entry Point:** Browser requests page or API endpoint
2. **Edge Processing:** Cloudflare Worker checks cache, renders SSR if needed
3. **API Aggregation:** API routes fetch from external data sources with caching
4. **Client Hydration:** React islands hydrate for interactivity
5. **Refresh Loop:** Client polls API endpoints at configured intervals (60s default)

### State Management
- **Approach:** React useState/useEffect per component (no global state)
- **Scope:** Client-side only, each panel manages its own data state
- **Caching:** Server-side via Cache-Control headers, client-side via localStorage

---

## 4. Directory Structure

### Root Structure
```
stacknews-astro/
├── src/                  # Application source code
│   ├── components/       # UI components (Astro + React)
│   ├── layouts/          # Page layout templates
│   ├── lib/              # Data fetching services & utilities
│   ├── pages/            # Routes and API endpoints
│   └── styles/           # Global CSS
├── public/               # Static assets (favicon, images)
├── scripts/              # Build/deployment utilities
├── dist/                 # Production build output
├── infrastructure/       # Cloudflare config templates
└── .wrangler/            # Wrangler local state
```

### Key Directory Purposes

**`/src/components/`**
- Purpose: All UI components organized by framework
- Key subdirectories:
  - `/src/components/astro/` - Server-rendered Astro components (Header, Sidebar, FeedGrid)
  - `/src/components/react/` - Interactive React islands (Panels, Charts, LiveWire)

**`/src/lib/`**
- Purpose: Data fetching services and shared utilities
- Organization: One file per data source/domain
- Key files:
  - `treasury-fiscal.ts` - Treasury FiscalData API client
  - `bls.ts` - Bureau of Labor Statistics API client
  - `yahoo.ts` - Yahoo Finance market data
  - `constants.ts` - Feed definitions (78KB of RSS feed configs)
  - `cache.ts` - Caching utilities
  - `types.ts` - TypeScript interfaces

**`/src/pages/api/`**
- Purpose: API route handlers (serverless functions)
- Organization: Nested by domain (treasury/, gdelt/, nasa/, etc.)
- Pattern: `[name].json.ts` files export GET handlers

**`/scripts/`**
- Purpose: Development and deployment utilities
- Key files:
  - `verify-env.mjs` - Environment variable validation
  - `smoke.mjs` - Smoke test runner
  - `warm-feeds.mjs` - Cache warming utility

### File Naming Conventions
- Components: `PascalCase.tsx` (React) or `PascalCase.astro`
- Utilities/Services: `kebab-case.ts`
- API Routes: `kebab-case.json.ts`
- Types: Defined in `types.ts` or co-located
- Constants: Defined in `constants.ts`

---

## 5. Core Modules & Components

### Module Map

1. **Treasury Module** (`/src/lib/treasury-fiscal.ts`, `/src/lib/treasury.ts`, `/src/lib/yield-curve.ts`)
   - **Purpose:** Fetches national debt, cash balance, interest rates, yield curve
   - **Key Files:**
     - `treasury-fiscal.ts` - FiscalData API client (debt, cash, rates)
     - `yield-curve.ts` - Treasury yield curve data
   - **Dependencies:** cache.ts
   - **Exports:** `fetchTreasuryFiscalData()`, `fetchYieldCurve()`

2. **BLS Module** (`/src/lib/bls.ts`)
   - **Purpose:** Bureau of Labor Statistics data (unemployment, CPI, PPI, productivity)
   - **Key Files:**
     - `bls.ts` - BLS API client with series definitions
   - **Dependencies:** cache.ts, types.ts
   - **Exports:** `fetchBLSData()`

3. **Market Module** (`/src/lib/yahoo.ts`)
   - **Purpose:** Stock indices, crypto, commodities via Yahoo Finance
   - **Dependencies:** cache.ts
   - **Exports:** `fetchMarketData()`

4. **Feeds Module** (`/src/lib/feeds.ts`, `/src/lib/constants.ts`)
   - **Purpose:** RSS feed aggregation from 400+ government sources
   - **Key Files:**
     - `constants.ts` - Feed URL definitions organized by category
     - `feeds.ts` - RSS parsing and aggregation logic
   - **Exports:** `fetchFeeds()`, `FEED_CATEGORIES`

5. **EDIS Module** (`/src/lib/edis.ts`)
   - **Purpose:** USITC trade investigation documents
   - **Exports:** `fetchEDISData()`

### Entry Points
- **Main Entry:** `/src/pages/index.astro` - Homepage dashboard
- **API Entries:** `/src/pages/api/*.json.ts` - Data API endpoints

### Critical Components/Classes

**HeroMetrics** (`/src/components/react/HeroMetrics.tsx`)
- **Purpose:** Top banner with 8 key economic indicators
- **Props:** None (self-contained data fetching)
- **Usage:** Homepage hero section
- **Dependencies:** DebtCounter, API endpoints

**TreasuryPanel** (`/src/components/react/TreasuryPanel.tsx`)
- **Purpose:** National debt counter, operating cash, interest rates
- **Dependencies:** DebtCounter, Sparkline, treasury-fiscal API

**LaborPanel** (`/src/components/react/LaborPanel.tsx`)
- **Purpose:** BLS data display (unemployment, JOLTS, CPI, PPI, productivity)
- **Dependencies:** bls API endpoint

**LiveWire** (`/src/components/react/LiveWire.tsx`)
- **Purpose:** Real-time scrolling news feed from government RSS sources
- **Dependencies:** feeds API endpoint

**StateUnemploymentPanel** (`/src/components/react/StateUnemploymentPanel.tsx`)
- **Purpose:** Heat map of all 50 states + DC unemployment rates
- **Dependencies:** bls API endpoint

---

## 6. Configuration Management

### Environment Variables

| Variable Name | Required? | Default | Purpose | Example |
|---------------|-----------|---------|---------|---------|
| `BLS_API_KEY` | Yes | None | BLS API authentication | `abc123...` |
| `FRED_API_KEY` | No | None | Federal Reserve data (backup) | `xyz789...` |
| `EIA_API_KEY` | No | None | Energy Information Admin | `eia123...` |
| `NASA_API_KEY` | No | `DEMO_KEY` | NASA APIs | `nasa456...` |

### Configuration Files
- **Location:** Root directory
- **Format:** JSON/JSONC for Wrangler, JS for Astro
- **Key Files:**
  - `astro.config.mjs` - Astro framework configuration
  - `wrangler.jsonc` - Cloudflare Workers configuration
  - `tsconfig.json` - TypeScript configuration
  - `.nvmrc` - Node version specification (20)

### Feature Flags
- **System:** Environment-based (no external service)
- **Key Flags:** None currently implemented

---

## 7. Data Layer

### Database(s)
**No traditional database** - This is an API aggregation layer.

All data is:
1. Fetched from external APIs at request time
2. Cached via HTTP headers (Cloudflare edge cache)
3. Optionally cached client-side (localStorage)

### Caching
- **System:** Cloudflare Edge Cache + Browser Cache + localStorage
- **What's Cached:** All API responses
- **TTL Strategy:**

| Data Type | Server Cache | Client Cache | Rationale |
|-----------|--------------|--------------|-----------|
| Treasury Fiscal | 30 min | 5 min (localStorage) | Updates infrequently |
| BLS Data | 30 min | None | Monthly releases |
| Market Data | 60 sec | None | Real-time importance |
| RSS Feeds | 5 min | None | Frequent updates |
| Yield Curve | 60 min | None | Daily updates |

---

## 8. External Integrations

### APIs & Services

| Service | Purpose | Authentication | Documentation |
|---------|---------|----------------|---------------|
| Treasury FiscalData | National debt, cash, rates | None (public) | [api.fiscaldata.treasury.gov](https://api.fiscaldata.treasury.gov) |
| BLS Public Data | Labor statistics | API Key | [bls.gov/developers](https://www.bls.gov/developers/) |
| Yahoo Finance | Market indices, crypto | None (scraping) | Unofficial |
| GDELT | Global news events | None (public) | [gdeltproject.org](https://www.gdeltproject.org/) |
| USITC EDIS | Trade investigations | None (public) | [edis.usitc.gov](https://edis.usitc.gov/) |
| NASA APIs | Solar/planetary data | API Key | [api.nasa.gov](https://api.nasa.gov/) |
| Government RSS | 400+ news feeds | None (public) | Various .gov sites |

### Webhooks
**None** - All data is pull-based via polling.

---

## 9. Authentication & Authorization

### Authentication Method
- [x] None (public site)

This is a **public read-only dashboard** with no user accounts or protected routes.

### Security Considerations
- No user authentication needed
- API keys stored in Cloudflare secrets (not in code)
- CORS restricted to same-origin
- Security headers configured via Cloudflare Transform Rules
- Rate limiting handled by upstream APIs

---

## 10. Build & Development

### Package Manager
- **Tool:** npm
- **Version:** 10.x
- **Lock File:** `package-lock.json`

### Build Process

**Development Build:**
```bash
npm run dev
```
- Hot reload: Yes
- Source maps: Yes
- Port: 4321

**Production Build:**
```bash
npm run build
```
- Output location: `/dist/`
- Minification: Yes
- Tree shaking: Yes (via Vite)

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `astro dev` | Start development server |
| `build` | `astro build` | Production build |
| `preview` | `astro preview` | Preview production build |
| `deploy` | `npm run build && npx wrangler pages deploy...` | Build and deploy |
| `env:verify` | `node scripts/verify-env.mjs` | Validate environment |
| `smoke` | `node scripts/smoke.mjs` | Run smoke tests |
| `warm` | `node scripts/warm-feeds.mjs` | Warm feed caches |

---

## 11. Testing Strategy

### Testing Framework(s)
- **Unit Tests:** None currently (needs implementation)
- **Integration Tests:** None currently
- **E2E Tests:** None currently
- **Smoke Tests:** Custom script (`scripts/smoke.mjs`)

### Test Organization
- Location: Needs `/tests/` directory
- Naming: TBD
- Coverage Target: TBD

### Running Tests
```bash
# Smoke test (validates API endpoints respond)
npm run smoke

# Environment validation
npm run env:verify
```

### Mocking Strategy
- Not yet implemented
- External APIs would need mocking for unit tests

---

## 12. Code Quality & Standards

### Linting
- **Tool:** ESLint (via Astro)
- **Config:** Astro defaults
- **Rules:** Standard TypeScript rules

### Formatting
- **Tool:** Prettier (implicit via editor)
- **Integration:** Manual/editor-based

### Type Checking
- **System:** TypeScript
- **Strictness:** Standard (not strict mode)
- **Check Command:** `npx tsc --noEmit`

### Git Hooks
- **Tool:** None currently configured
- **Recommendation:** Add Husky for pre-commit linting

### Commit Conventions
- **Style:** Conventional Commits (informal)
- **Format:** `type: description`
- **Types:** feat, fix, docs, chore, refactor

---

## 13. Deployment & DevOps

### Hosting Platform
- **Platform:** Cloudflare Pages (Workers Runtime)
- **Region:** Global (edge deployment)
- **URL:** https://stacknews.org

### Deployment Process
**Trigger:** Manual via CLI or push to main (if configured)

**Pipeline Steps:**
1. Run `npm run build`
2. Wrangler uploads to Cloudflare
3. Edge deployment propagates globally (~30 seconds)

### Environments

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| Development | localhost:4321 | any | Local development |
| Preview | *.stacknews-astro.pages.dev | any | PR previews |
| Production | stacknews.org | main | Live application |

### CI/CD
- **Platform:** Manual (Wrangler CLI)
- **Config Location:** `wrangler.jsonc`
- **Recommendation:** Add GitHub Actions for automated deploys

### Environment Variables Management
- **Tool:** Cloudflare Dashboard + Wrangler secrets
- **Access:** Account owner only

---

## 14. Monitoring & Observability

### Logging
- **System:** Console (Cloudflare Workers logs)
- **Levels:** info, warn, error
- **Storage:** Cloudflare dashboard (real-time tail)

### Error Tracking
- **Service:** Console errors only
- **Recommendation:** Add Sentry for production

### Performance Monitoring
- **Tool:** Cloudflare Analytics (built-in)
- **Metrics Tracked:**
  - Request count
  - Response time (p50, p99)
  - Cache hit rate
  - Error rate

### Uptime Monitoring
- **Service:** None currently
- **Recommendation:** Add UptimeRobot for `/api/treasury-fiscal.json`

---

## 15. Documentation

### Code Documentation
- **Style:** Inline comments, JSDoc for complex functions
- **Coverage:** Key functions documented
- **Generation:** None

### API Documentation
- **Format:** This document + inline comments
- **Location:** README.md, this file
- **Auto-generated:** No

### Project Documentation
- **README.md** - Basic overview and setup
- **CHANGELOG.md** - Version history
- **STACKNEWS-WORKSPACE.md** - Dynamic project tracking
- **STACKNEWS-Codebase-Definition.md** - This document

---

## 16. Development Workflow

### Getting Started

**Prerequisites:**
- Node.js 20+
- npm 10+
- Cloudflare account (for deployment)

**Setup Steps:**
```bash
# 1. Clone repository
cd /Users/geoffreyflores/stacknews-astro

# 2. Install dependencies
npm install

# 3. Set up environment (optional - works without keys)
# Add BLS_API_KEY to wrangler.jsonc or Cloudflare dashboard

# 4. Start development server
npm run dev

# 5. Open browser
open http://localhost:4321
```

### Daily Development Commands
```bash
# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy
# Or with explicit credentials:
env CLOUDFLARE_EMAIL="office@launchmaniac.com" CLOUDFLARE_API_KEY="[key]" npx wrangler pages deploy dist --project-name=stacknews-astro --commit-dirty=true
```

### Branch Strategy
- **Model:** Trunk-based (simple)
- **Main Branch:** `main`
- **Feature Branches:** `feat/feature-name` (as needed)

### Pull Request Process
1. Create feature branch from main
2. Make changes and commit
3. Test locally with `npm run dev`
4. Build to verify: `npm run build`
5. Deploy to preview URL
6. Merge to main after verification

---

## 17. Common Tasks & Recipes

### Add a New Data Panel
1. Create service in `/src/lib/[source].ts`
2. Create API endpoint `/src/pages/api/[source].json.ts`
3. Create React panel `/src/components/react/[Source]Panel.tsx`
4. Add to `/src/pages/index.astro` with `client:load`
5. Update constants.ts if RSS-based

### Add a New RSS Feed Category
1. Edit `/src/lib/constants.ts`
2. Add feed URLs to appropriate category array
3. Feeds automatically included in aggregation

### Adding API Endpoints
```typescript
// /src/pages/api/example.json.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const data = await fetchData();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=300' // 5 min edge cache
    }
  });
};
```

### Debugging
**Development:**
- Browser DevTools for React components
- Console.log in API routes (visible in terminal)
- Network tab to inspect API responses

**Production:**
- `wrangler tail` for real-time logs
- Cloudflare dashboard for analytics

---

## 18. Known Issues & Limitations

### Current Limitations
1. **No historical charts** - All data is point-in-time, no trend visualization
2. **No user preferences** - No dark mode toggle, no saved filters
3. **No test coverage** - Smoke tests only

### Known Bugs

| Issue | Severity | Status | Workaround |
|-------|----------|--------|------------|
| Yahoo Finance rate limits | Low | Mitigated | 60s polling interval |
| BLS API monthly lag | Info | Expected | Data released monthly |

### Technical Debt
1. **Add test suite**
   - Impact: No automated regression testing
   - Plan: Implement Vitest for unit tests

2. **Consolidate caching logic**
   - Impact: Caching patterns inconsistent across modules
   - Plan: Create unified cache utility

---

## 19. Performance Considerations

### Bundle Size
- **Target:** < 200KB gzipped (main JS)
- **Current:** ~150KB (React + islands)
- **Optimization Strategies:**
  - Astro Islands (React only loads where needed)
  - Tree shaking via Vite
  - No heavy charting libraries (custom Sparkline)

### Load Time
- **Target:** < 2s Time to Interactive
- **Current:** ~1.5s (edge-cached)
- **Key Factors:** Edge caching, SSR, minimal JS

### Scalability
- **Current Capacity:** Unlimited (Cloudflare edge)
- **Bottlenecks:** Upstream API rate limits
- **Scaling Strategy:** Already horizontally scaled via edge

---

## 20. Security Checklist

- [x] Environment variables secured (Cloudflare secrets)
- [x] HTTPS enforced in production (Cloudflare)
- [x] Input validation on API parameters
- [N/A] SQL injection protection (no database)
- [x] XSS prevention (React escaping)
- [N/A] CSRF protection (no mutations)
- [x] Rate limiting (upstream APIs + Cloudflare)
- [N/A] Authentication (public site)
- [x] Security headers configured (CSP, X-Frame-Options, etc.)
- [x] Dependencies regularly updated

---

## 21. Team & Contacts

### Project Ownership
- **Product Owner:** Geoffrey Flores
- **Tech Lead:** Geoffrey Flores
- **Primary Maintainer:** Geoffrey Flores

### Communication Channels
- **Issues:** ClickUp (Launch Control workspace)
- **Support:** support@launchmaniac.com
- **Phone:** (725) 444-8200

---

## 22. Reference Links

### External Documentation
- Astro Docs: https://docs.astro.build
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Treasury FiscalData: https://fiscaldata.treasury.gov/api-documentation/
- BLS API: https://www.bls.gov/developers/

### Related Projects
- None currently

---

## 23. Change Log

### Version History

**v0.0.1 - December 2025**
- Added: Initial release with Treasury, BLS, Market panels
- Added: 400+ government RSS feed aggregation
- Added: State unemployment heat map
- Added: Yield curve visualization
- Added: EDIS trade investigation feeds
- Added: Tooltips for all economic indicators

---

## 24. Appendices

### A. Glossary
- **BLS:** Bureau of Labor Statistics
- **CPI:** Consumer Price Index (inflation measure)
- **EDIS:** Electronic Document Information System (USITC)
- **JOLTS:** Job Openings and Labor Turnover Survey
- **PPI:** Producer Price Index
- **SSR:** Server-Side Rendering
- **TTL:** Time To Live (cache duration)
- **VIX:** Volatility Index

### B. API Endpoints Reference

| Method | Endpoint | Purpose | Cache TTL |
|--------|----------|---------|-----------|
| GET | `/api/treasury-fiscal.json` | Debt, cash, rates | 30 min |
| GET | `/api/treasury/yield-curve.json` | Yield curve data | 60 min |
| GET | `/api/bls.json` | Labor, inflation, productivity | 30 min |
| GET | `/api/market.json` | Indices, crypto, commodities | 60 sec |
| GET | `/api/feeds.json` | RSS feed aggregation | 5 min |
| GET | `/api/edis.json` | USITC trade data | 30 min |
| GET | `/api/gdelt/events.json` | Global news events | 5 min |
| GET | `/api/gdelt/stability.json` | Country stability | 5 min |
| GET | `/api/nasa/solar.json` | Solar weather | 30 min |
| GET | `/api/nasa/planetary.json` | Planetary data | 60 min |
| GET | `/api/arxiv.json` | Research papers | 30 min |
| GET | `/api/eia.json` | Energy data | 30 min |

### C. React Component Hierarchy
```
index.astro
├── Header.astro
├── Sidebar.astro (CategoryNav)
├── HeroMetrics.tsx [client:load]
│   └── DebtCounter.tsx
├── TreasuryPanel.tsx [client:load]
│   ├── DebtCounter.tsx
│   └── Sparkline.tsx
├── LaborPanel.tsx [client:load]
├── StateUnemploymentPanel.tsx [client:load]
├── MarketPanel.tsx [client:load]
├── YieldCurvePanel.tsx [client:load]
│   └── Sparkline.tsx
├── CryptoPanel.tsx [client:load]
├── CommoditiesPanel.tsx [client:load]
├── FeedLoader.tsx [client:load]
└── LiveWire.tsx [client:load]
```

---

**Document Maintenance:**
- Last Updated: 2025-12-26
- Updated By: Claude Code
- Next Review: 2026-01-26

---

**Product of Launch Maniac LLC, Las Vegas, Nevada**
**(725) 444-8200 | support@launchmaniac.com**
