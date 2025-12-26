# StackNews Project Workspace

**Purpose:** Dynamic workspace for tracking StackNews development progress. Use alongside `stacknews.md` (the static technical blueprint).

**Companion Document:** `stacknews.md` - Technical specification and codebase definition

**Update Frequency:** Daily to weekly

---

## Project: StackNews

**Status:** Active
**Start Date:** 2025-06-01
**Target Launch:** Launched (Live)
**Current Phase:** Live and Iterating

### Quick Links
- **Codebase Definition:** [stacknews.md](./stacknews.md)
- **Repository:** /Users/geoffreyflores/stacknews-astro
- **Live Site (Production):** https://stacknews.org
- **Cloudflare Pages:** https://stacknews-astro.pages.dev

### Project Management Integration

**Sync Status:** Synced

**Configuration (ClickUp):**
- **Workspace ID:** `9011026386`
- **Space ID:** `90171746569` (Launch Control)
- **Folder ID:** `90174587764` (StackNews.org)
- **Development List:** `901708301767`
- **Infrastructure List:** `901708301768`
- **Product Development List:** `901708330743`

**Last Synced:** 2025-12-26
**Sync Method:** MCP via Claude Code

---

## Current Phase

- [x] Discovery and Planning
- [x] MVP Development (Core Architecture)
- [x] Feature Development (In Progress)
- [ ] Beta Testing
- [x] Production Ready
- [x] Live and Iterating

**Phase Description:** Full-featured financial data dashboard live at stacknews.org. Core infrastructure complete. Continuously adding data feeds, improving UX, and optimizing performance.

---

## Project Snapshot

### What We're Building
A real-time financial and economic data aggregator that pulls from official government sources (Treasury, BLS, Census, USITC) and market data to provide a comprehensive dashboard for tracking US economic health. Target audience: investors, analysts, and anyone wanting a Bloomberg-lite experience without the price tag.

### Tech Stack Summary
- **Frontend:** Astro 5 + React 18 (Islands Architecture)
- **Styling:** Tailwind CSS 4
- **Hosting:** Cloudflare Pages (Edge Runtime)
- **Data Sources:**
  - Treasury FiscalData API (debt, cash, interest rates)
  - BLS API (labor, inflation, productivity)
  - Yahoo Finance (market indices, crypto, commodities)
  - GDELT (global news events)
  - USITC EDIS (trade investigations)
  - NASA APIs (solar/planetary data)
  - Government RSS feeds (White House, Congress, Fed, etc.)

*(For full technical details, see stacknews.md)*

---

## Epics

| Epic | ID | Priority | Status | URL |
|------|----|----------|--------|-----|
| Initial Deployment | 86dyrx5x3 | High | Complete | [Link](https://app.clickup.com/t/86dyrx5x3) |
| DNS & Domain Setup | 86dyrx5x9 | High | Complete | [Link](https://app.clickup.com/t/86dyrx5x9) |
| Security Headers | 86dyrxhbx | High | Complete | [Link](https://app.clickup.com/t/86dyrxhbx) |
| Homepage Data Windows | 86dytzq5v | High | Complete | [Link](https://app.clickup.com/t/86dytzq5v) |
| BLS API Integration | 86dyzzmjc | High | Complete | [Link](https://app.clickup.com/t/86dyzzmjc) |
| EDIS Integration | 86dz00k5z | Normal | Complete | [Link](https://app.clickup.com/t/86dz00k5z) |
| Feed Performance | 86dyu085d | Normal | Complete | [Link](https://app.clickup.com/t/86dyu085d) |
| Yield Curve Fix | 86dyzzdv6 | High | Complete | [Link](https://app.clickup.com/t/86dyzzdv6) |

---

## This Week: 2025-12-26

**Week Focus:** UX Improvements - Tooltips and Performance

### In Progress

- [ ] **Additional Data Source Integrations**
  - **Description:** Explore adding more government data feeds
  - **Status:** Backlog
  - **Priority:** Normal

### Completed This Week

- [x] **Add Tooltips to Overview Page Metrics** - 2025-12-26
  - **What Was Done:** Added native browser tooltips to all 8 panels (HeroMetrics, Treasury, Labor, StateUnemployment, Market, YieldCurve, Crypto, Commodities) with explanatory text for each metric
  - **Outcome:** Users can now hover over any data card to understand what that economic indicator measures

- [x] **Fix Total Public Debt Loading Performance** - 2025-12-26
  - **What Was Done:** Increased server cache TTL from 5 to 30 minutes, added localStorage client-side caching
  - **Outcome:** Debt counter loads instantly from cache on subsequent visits

### Completed Previously

- [x] **EDIS Integration** - 2025-12-24
  - **Outcome:** USITC trade investigation feeds now display in sidebar

- [x] **BLS API Integration** - 2025-12-23
  - **Outcome:** Full labor market panel with unemployment, JOLTS, CPI, PPI, productivity metrics

- [x] **State Unemployment Panel** - 2025-12-22
  - **Outcome:** Heat map visualization of all 50 states + DC + territories

### Backlog (Next Up)

1. [ ] **Historical Data Charts**
   - **Why Critical:** Users want to see trends over time
   - **Epic:** Data Visualization
   - **Priority:** Normal

2. [ ] **Search Functionality Enhancement**
   - **Why Critical:** Help users find specific feeds quickly
   - **Epic:** UX Improvements
   - **Priority:** Normal

3. [ ] **Mobile Responsiveness Audit**
   - **Why Critical:** Significant mobile traffic expected
   - **Epic:** UX Improvements
   - **Priority:** High

---

## Decision Log

### 2025-12-26 - Native Browser Tooltips vs Custom Component

**Context:**
Needed to add explanatory tooltips to help users understand economic indicators.

**Decision Made:** Use native HTML `title` attributes instead of custom tooltip components.

**Rationale:** Simpler implementation, no additional bundle size, works on all devices including mobile (long-press), no accessibility concerns.

**Implementation:** Added `title` attributes to card container divs with lookup objects for dynamic content (BLS_TOOLTIPS, INDEX_TOOLTIPS, CRYPTO_TOOLTIPS, etc.)

### 2025-12-20 - Astro Islands Architecture

**Context:**
Choosing frontend framework for real-time data dashboard.

**Decision Made:** Astro 5 with React Islands for interactive components.

**Rationale:** Server-side rendering for SEO, minimal JS shipped to client, React only loads for components that need interactivity (panels, charts).

**Implementation:** Static Astro pages with `client:load` React components for data panels.

---

## Technical Health Dashboard

**Overall Health:** Healthy (v0.0.1)

### Build and Tests Status
- [x] Build passing
- [ ] All tests passing (0 tests - needs test suite)
- [x] Type checking clean
- [x] Linting clean
- [ ] Compliance/Audit Score: Pending

---

## Environment Status

### Development Environment
- **Status:** Operational
- **URL:** http://localhost:4321
- **Branch:** main
- **Database:** None (API-driven)

### Staging Environment
- **URL:** https://stacknews-astro.pages.dev (latest deployment preview)
- **Status:** Deployed

### Production Environment
- **URL:** https://stacknews.org
- **Status:** Active
- **Cloudflare:** Proxied, caching enabled

---

## Quick Command Reference

### Most Used Commands
```bash
# Start Development Server
npm run dev

# Build for Production
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Or manual deploy with credentials
env CLOUDFLARE_EMAIL="office@launchmaniac.com" CLOUDFLARE_API_KEY="cf43a8e42364256342900c41ae7da7c4ef6d4" npx wrangler pages deploy dist --project-name=stacknews-astro --commit-dirty=true

# Verify Environment Variables
npm run env:verify

# Warm Feed Caches
npm run warm

# Smoke Test
npm run smoke
```

### Cloudflare DNS Management
```bash
# List DNS records
CLOUDFLARE_EMAIL="office@launchmaniac.com" CLOUDFLARE_API_KEY="cf43a8e42364256342900c41ae7da7c4ef6d4" cli4 /zones/:stacknews.org/dns_records
```

---

## API Endpoints

| Endpoint | Description | Cache TTL |
|----------|-------------|-----------|
| `/api/treasury-fiscal.json` | Debt, cash, interest rates | 30 min |
| `/api/treasury/yield-curve.json` | Treasury yield curve | 60 min |
| `/api/bls.json` | Labor, inflation, productivity | 30 min |
| `/api/market.json` | Indices, crypto, commodities | 60 sec |
| `/api/feeds.json` | Government RSS aggregation | 5 min |
| `/api/edis.json` | USITC trade investigations | 30 min |
| `/api/gdelt/events.json` | Global news events | 5 min |

---

## Context for AI Sessions

**When starting a new Claude Code session:**

1. This is an Astro 5 + React project deployed to Cloudflare Pages
2. All data comes from external APIs - no database
3. Caching is critical - use appropriate TTLs to balance freshness vs API rate limits
4. The site is live at stacknews.org - changes deploy immediately
5. Follow the "no fake data" policy - if an API fails, show nothing rather than placeholder data
6. Use native browser features (title attributes, etc.) over heavy JS libraries when possible
