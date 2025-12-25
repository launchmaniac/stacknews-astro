# StackNews Astro – Changelog

All notable changes to this project are tracked here. Dates in UTC.

## 2025-12-24

### Yield Curve API Migration (FRED API)
- **Problem:** Treasury FiscalData API endpoint `daily_treasury_yield_curve_rates` deprecated (returning 404)
- **Root Cause:** Discovered during Browser DevTools investigation - yield curve endpoint returning HTTP 525
- **Solution:** Migrated from FiscalData to FRED (Federal Reserve Economic Data) API
- **Files Modified:**
  - `src/lib/yield-curve.ts` - Complete rewrite to use FRED series
  - `src/pages/api/treasury/yield-curve.json.ts` - Added FRED_API_KEY binding support
- **FRED Series Used:**
  - DGS1MO (1-month), DGS3MO (3-month), DGS6MO (6-month)
  - DGS1 (1-year), DGS2 (2-year), DGS5 (5-year)
  - DGS10 (10-year), DGS30 (30-year)
  - T10Y2Y (10y-2y spread)
- **Result:** All yield curve data restored with proper caching (Cache API + KV fallback)
- **ClickUp Task:** 86dyzzdv6

## 2025-12-13

### Sidebar UX Improvements
- Compacted sidebar layout for 40% more visible categories without scrolling
- Reduced navigation width from 64 to 56 (w-64 -> w-56)
- Reduced padding: container p-4 -> p-2, items px-4 py-2 -> px-2.5 py-1
- Reduced spacing: space-y-1 -> space-y-0.5, gap-3 -> gap-2
- Smaller icons: 16px -> 14px
- Smaller text: text-xs -> text-[11px]
- Compacted National Debt widget padding

### Category Reorganization
- Reorganized sidebar categories with US at top for primary audience
- Order: US Government -> Global/Macro -> Americas -> Europe -> Asia -> Middle East -> Africa -> Pacific
- NASA category now visible at position 12 (was position 95)

### Treasury Feeds Restoration
- **Problem:** TreasuryDirect discontinued RSS feeds (auction_results.xml, offering_announcements.xml return 404)
- **Solution:** Replaced with Federal Register API feeds which are reliable and comprehensive
- New feeds added:
  - Federal Register (Treasury Department): https://www.federalregister.gov/api/v1/documents.rss?conditions%5Bagencies%5D%5B%5D=treasury-department
  - Federal Register (IRS): https://www.federalregister.gov/api/v1/documents.rss?conditions%5Bagencies%5D%5B%5D=internal-revenue-service
  - GAO Reports: https://www.gao.gov/rss/reports.xml
- Treasury category: 2 feeds/130 items -> 5 feeds/262 items
- **Lesson Learned:** Federal Register API is reliable fallback when agency feeds are discontinued

### New Feeds Added
- **MEXICO Category (10 feeds):**
  - Gobierno de Mexico Noticias
  - Secretaria de Hacienda (SHCP)
  - Banco de Mexico Comunicados
  - INEGI Comunicados
  - Secretaria de Energia (SENER)
  - Secretaria de Economia
  - Pemex Comunicados
  - Secretaria de Relaciones Exteriores
  - Consejo Nacional de Ciencia (CONACYT)
  - Secretaria de Medio Ambiente (SEMARNAT)
- **CRYPTO Category:**
  - CryptocurrencyFacts.com
- **STATE_DEPT Category:**
  - Federal Register (State Department)

### ClickUp Documentation
- Created tasks in StackNews.org folder (90174587764):
  - Sidebar UX Improvements (86dyv4ne1) - Completed
  - Feed Expansion (86dyv4ne5) - Completed
  - Feed Source Research Lessons Learned (86dyv4neb) - Development
  - Treasury Feeds Restoration (86dyv5d3w) - Completed

## 2025-12-12

### NASA & Space Category - Planetary Intelligence
- Created new `NASA` category with 10 RSS feeds:
  - News: NASA News Releases, NASA Image of Day, NASA Recent
  - Missions: Artemis Program, Space Station (ISS)
  - Technology: NASA Technology, NASA Aeronautics
  - Research Centers: Goddard Space Center, Jet Propulsion Lab, Goddard Climate (GISS)
- Created `/api/nasa/planetary.json` - Planetary Intelligence API
- DONKI Space Weather Integration (requires NASA_API_KEY):
  - Solar Flares with classification (A/B/C minor, M moderate, X major, X10+ extreme)
  - Coronal Mass Ejections (CME) with speed and trajectory analysis
  - Geomagnetic Storms with Kp Index (0-9 scale, G1-G5 storm levels)
  - Solar Energetic Particles, Interplanetary Shocks, High-Speed Streams
  - Threat Assessment with grid/satellite/radio blackout risk levels
- EONET Natural Event Tracker (no API key required):
  - Real-time tracking of wildfires, volcanoes, severe storms, sea ice
  - 13 event categories: drought, earthquakes, floods, landslides, etc.
  - Coordinates and magnitude data for mapping
- Query modes:
  - Combined snapshot: `/api/nasa/planetary.json`
  - Space weather: `/api/nasa/planetary.json?dataset=space-weather&days=7`
  - Earth events: `/api/nasa/planetary.json?dataset=earth-events&days=30`
  - Wildfires: `/api/nasa/planetary.json?dataset=wildfires`
  - Volcanoes: `/api/nasa/planetary.json?dataset=volcanoes`
- Energy sector relevance:
  - Solar events can damage power grids, transformers, and satellite communications
  - Kp 7+ storms can cause transformer damage
  - Wildfires threaten power lines and infrastructure
- Enhanced `src/lib/nasa.ts` with full DONKI and EONET integration
- New types: CoronalMassEjection, GeomagneticStorm, SpaceWeatherSnapshot, EonetEvent, EonetSnapshot

### ArXiv Scientific Research API
- Created `/api/arxiv.json` endpoint for scientific preprints
- OAI-PMH protocol integration with arXiv.org
- 8 preset categories:
  - `FINANCE_QUANT` - Statistical Finance, Risk Management, Portfolio Management, Mathematical Finance
  - `ECONOMETRICS` - Econometrics and General Economics
  - `AI_ML` - Artificial Intelligence, Machine Learning, Natural Language Processing
  - `CRYPTO_SECURITY` - Cryptography, Distributed Computing, Blockchain
  - `NUCLEAR_ENERGY` - Nuclear Theory, Nuclear Experiment, Plasma Physics
  - `ASTROPHYSICS` - Earth & Planetary, High Energy Astrophysics, Cosmology
  - `QUANTUM` - Quantum Physics, Quantum Computing
  - `CLIMATE_SCIENCE` - Atmospheric & Oceanic Physics, Geophysics
- Query modes:
  - By preset: `/api/arxiv.json?preset=FINANCE_QUANT`
  - By categories: `/api/arxiv.json?categories=q-fin.ST,econ.EM`
  - By keyword search: `/api/arxiv.json?search=neural+network`
  - Dashboard snapshot: `/api/arxiv.json?preset=SNAPSHOT`
- Returns paper metadata: title, authors, abstract, published date, PDF link
- New library: `src/lib/arxiv.ts` - ArXiv API integration
- New type: ArxivPaper

### GDELT Event Intelligence Expansion
- Enhanced `/api/gdelt/stability.json` endpoint
- Added CAMEO event coding taxonomy for geopolitical analysis:
  - Cooperation codes (01-08): Appeals, Aid, Diplomatic cooperation
  - Conflict codes (09-20): Demands, Threats, Protests, Military actions
- Global Stability Index (0-100 scale):
  - 80-100: High stability (cooperation dominates)
  - 60-80: Moderate stability
  - 40-60: Neutral
  - 20-40: Elevated tensions (conflict dominates)
  - 0-20: Crisis level
- 14 thematic query presets:
  - Geopolitical: MILITARY_CONFLICT, DIPLOMATIC_TENSIONS, PROTEST_CIVIL_UNREST
  - Economic: CENTRAL_BANKS, TRADE_SANCTIONS, ENERGY_GEOPOLITICS
  - Technology: AI_REGULATION, CYBER_SECURITY, SPACE_TECH
  - Climate: CLIMATE_POLICY, NATURAL_DISASTERS
  - Regional: ASIA_PACIFIC, MIDDLE_EAST, EUROPE
- Enhanced GDELT library with keyword-based queries
- Note: GDELT API availability may vary from Cloudflare Workers

### Scientific RSS Feeds
- Added 14 new feeds to RESEARCH category for educational/fact-based content:
  - EurekAlert (3 feeds): technology_engineering, physics_math, earth_environ
  - ScienceDaily (5 feeds): artificial_intelligence, energy_development, nuclear_energy, climate_weather, economics_business
  - Phys.org (2 feeds): technology-news, physics-news
  - Nature (2 feeds): Nature News, Science Magazine AAAS
  - Research Newsline (2 feeds): research-newsline, science-alerts
- Focus on peer-reviewed research and institutional sources
- Avoids opinion content per user request

### Real Estate and Construction Indicators API
- Created `/api/realestate.json` endpoint with 8 datasets:
    - `pipeline` - Construction pipeline (Permits, Starts, Completions, Under Construction)
    - `pipeline-type` - Single-family vs Multi-family breakdown
    - `fmr` - HUD Fair Market Rents for specific metro areas
    - `fmr-metros` - FMR for top 10 major metros
    - `commercial` - Commercial Real Estate Price Index (FRED COMREPUSQ159N)
    - `affordability` - Housing Affordability Index (FRED FIXHAI)
    - `caseshiller` - S&P/Case-Shiller US National Home Price Index (FRED CSUSHPINSA)
    - `snapshot` - Aggregated dashboard metrics
  - Construction pipeline visualizes three stages: Permits (leading) -> Starts -> Completions (supply)
  - Pipeline ratio analysis: permits-to-starts > 1 indicates expansion, < 1 indicates contraction
  - Current snapshot (August 2025):
    - Permits: 1,330K units (-2.3% MoM)
    - Starts: 1,307K units (-8.5% MoM)
    - Completions: 1,608K units (+8.4% MoM)
    - Case-Shiller Index: 328.94 (+1.3% YoY)
    - Affordability Index: 104.5 (median family can afford median home)
  - Data sources: FRED (PERMIT, HOUST, COMPUTSA series from Census Bureau), HUD Fair Market Rents API
  - Requires FRED_API_KEY for all construction and pricing datasets
  - New library: `src/lib/realestate.ts` - Real estate data aggregation
  - New types: ConstructionPipeline, HudFairMarketRent, CommercialRealEstateIndex, RealEstateSnapshot

## 2025-12-11
- EIA API Expansion - Comprehensive Energy Data
  - Expanded `/api/eia.json` endpoint with 6 datasets:
    - `petroleum` - Weekly crude oil stocks (existing)
    - `natgas` - Weekly natural gas storage (existing)
    - `imports` - Crude oil imports by country of origin (NEW)
    - `generation` - Electricity generation mix by fuel type (NEW)
    - `nuclear` - Nuclear facility outages (NEW)
    - `snapshot` - Aggregated dashboard metrics (NEW)
  - Imports dataset tracks top 10 source countries: Canada, Mexico, Saudi Arabia, Iraq, Colombia, Ecuador, Nigeria, Brazil, UK, Russia
  - Generation mix shows percentage by fuel: Coal, Natural Gas, Nuclear, Hydroelectric, Wind, Solar, Petroleum
  - Nuclear outages track daily capacity losses from NRC data
  - Snapshot endpoint aggregates all metrics with week-over-week changes
  - Educational focus: distinguishes financial layer (prices) from physical layer (production, storage, shipment)
  - Requires EIA_API_KEY environment variable
- Japan Category and e-Stat Integration
  - Added JAPAN category with 4 working RSS feeds:
    - Ministry of Finance (jp-mof) - 100 items
    - Bank of Japan (jp-boj) - 43 items
    - NHK News (jp-nhk) - 7 items (Japanese language)
    - Nikkei Asia (jp-nikkei) - 50 items
  - Created `/api/japan/stats.json` endpoint for Japan Statistics Dashboard (e-Stat)
  - No API key required - uses public Statistics Dashboard API
  - Presets available: `snapshot`, `unemployment`, `population`, `cpi`, `core_cpi`
  - Search capability: `?search=GDP` to find indicator codes
  - Custom queries: `?indicator=CODE&cycle=1` for any indicator
  - Current snapshot data:
    - Population: 123,210,000
    - Unemployment Rate: 2.6%
    - CPI YoY: 3%
    - Core CPI: 3%
  - New library: `src/lib/estat.ts` - Japan e-Stat API wrapper
  - Balances Western-centric economic data with Asian economic indicators
- Canada Category Expansion
  - Added 7 new Canada government news feeds via api.io.canada.ca:
    - National News (all federal departments)
    - Business News
    - Aboriginal Peoples News
    - Ontario News
    - British Columbia News
    - Quebec News
    - Alberta News
  - Existing feeds retained: StatCan Daily, Global News, Globe & Mail, Bank of Canada Press
  - Created `/api/canada/search.json` endpoint for CKAN open data queries
  - Supports preset queries: budget, immigration, energy
  - CANADA category now has 11 feeds configured, 9 returning content
- United Kingdom Category Expansion
  - Added 8 new UK government department feeds (gov.uk Atom):
    - HM Treasury
    - HM Revenue & Customs
    - Cabinet Office
    - Business & Trade
    - Foreign Commonwealth & Development Office (FCDO)
    - Energy Security & Net Zero
    - Office for National Statistics (ONS)
    - National Audit Office
  - UK category now has 11 feeds configured, 9 returning content
  - Note: data.gov.uk CKAN API available at `/api/ukdata/search.json` for dataset queries
- US Congress Category
  - Renamed LEGISLATION category to US CONGRESS
  - Added 6 new Congress.gov feeds:
    - Congress.gov Notifications
    - Bills Presented to President
    - Most-Viewed Bills
    - House Floor Today
    - Senate Floor Today
    - LOC Law Librarians Blog (blocked by 403)
  - Existing GovInfo feeds (Congressional Bills, Public Laws) retained
  - US CONGRESS category now has 8 feeds configured, 5 returning content
- Crypto Feeds Expansion
  - Added 14 new low-opinion, fact-focused crypto feeds to CRYPTO category
  - **Protocol/Official:** Bitcoin Core Announcements, Bitcoin Core Blog
  - **Exchange Blogs:** Kraken Blog
  - **Hardware/Security:** Trezor Blog
  - **Professional Newsrooms:** CryptoSlate, Brave New Coin, News.Bitcoin, DCForecasts, CryptoBriefing, CryptoPotato
  - **Education:** 99Bitcoins
  - Removed unavailable feeds: Coinbase Blog (403), CoinATMRadar (403), CryptocurrencyFacts (404)
  - CRYPTO category now has 20 total feeds
- Cache Architecture Fix
  - Fixed KV TTL: increased from 10 minutes to 1 hour for category data persistence
  - Fixed edge cache TTL: increased from 1 minute to 5 minutes (`s-maxage=300`)
  - Added KV-to-memory cache restoration on worker restart
  - ALL endpoint now properly aggregates feeds from KV when in-memory cache is empty
  - Coordinator rotation confirmed working (categories refresh sequentially)
- Feed Loading Performance Optimization
  - Reduced feed loading time from 20+ seconds to ~4 seconds (80% improvement)
  - **Client-side fix:** FeedLoader now uses single `category=ALL` request instead of 20 parallel category requests
  - **Server-side fix:** Added KV binding to `wrangler.jsonc` (was only in `wrangler.toml`, not picked up by Pages)
  - KV namespace now properly caches category data as fallback
  - New script: `scripts/warm-feeds.mjs` - warms all 21 categories into KV
  - New npm scripts: `npm run warm` and `npm run deploy`
  - ClickUp task: 86dyu085d
- Data Windows Enhancement
  - Added new data panels to homepage displaying real-time market metrics
  - **Market Indices Panel** - S&P 500, DOW, NASDAQ, VIX with price and % change
  - **Yield Curve Panel** - Treasury rates (3M, 2Y, 5Y, 10Y, 30Y) with 10Y-2Y spread and inversion indicator
  - **Crypto Panel** - BTC, ETH, SOL prices with 24h change
  - **Commodities Panel** - Gold, Silver, Crude Oil, Natural Gas prices
  - New API endpoint: `/api/market.json` aggregating Yahoo Finance data
  - All panels auto-refresh every 60 seconds
  - Panels follow "no fake data" policy (render nothing when no data)
- CSP Fix Applied
  - Updated Cloudflare CSP to include `'unsafe-inline'` for `script-src`
  - React islands now hydrate correctly on production
  - Fixes feed loading and treasury data display issues
- ClickUp Integration
  - Epic created: Homepage Data Windows Enhancement (CU-ID: 86dytzq5v)
  - Related tasks marked complete: LiveWire Loading Issue, CSP Header Review

## 2025-12-10
- Security & CSP
  - Updated Terraform defaults (`csp_prod`, `csp_staging`) so `script-src` explicitly allows `'unsafe-inline'`. Astro’s client islands inject inline bootstrap code; without this allowance, hydration was blocked in production and pages stayed stuck in the static “syncing” shell.
  - Documented the trade-offs in the README security section and reminded operators to keep data fetches flowing through `/api/*` so `connect-src` can remain `'self'`. If you override `csp`, carry forward the inline allowance or add a nonce/hash through Cloudflare transform rules before tightening.
- Verification
  - `npm run smoke` still fails against `https://stacknews.org` until the new CSP is applied in Cloudflare (current live headers still use the older script policy). Re-run the script after applying Terraform to confirm feeds and treasury endpoints respond with `_cache` metadata again.

## 2025-12-09
- Config & Deployability
  - Moved Cloudflare Pages bindings management to `wrangler.toml` because the dashboard reported: "Bindings for this project are being managed through wrangler.toml." This ensures reproducible, source‑controlled deployments and prevents drift.
  - Added Service Binding in code: `COORDINATOR -> stacknews-coordinator` (environment: production).
  - Added KV binding in code: `STACKNEWS_KV -> 8f9f004bf39a4e92ac3c21ebf1545d68`.
  - Redeployed production (Pages) so Functions pick up the bindings.
  - Aligned Wrangler compatibility date across files to `2024-12-01` (avoid runtime drift). Kept `wrangler.toml:name = "stacknews"` and Pages project `wrangler.jsonc:name = "stacknews-astro"` (documented in README).
  - Removed environment pin from COORDINATOR service binding in `wrangler.toml` to use the Worker's default environment and avoid mismatches when named envs aren’t configured.
- Rationale
  - Remove reliance on manual dashboard configuration, reduce misconfig risk, and keep infra changes reviewed via PR.
  - Replace the old `COORDINATOR_URL` public fallback with a private Service Binding for lower latency and no public attack surface.
    - Security & Headers
  - Confirmed Response Header Transform rules via Terraform and re‑captured the live ruleset in `scripts/security-headers.live.json`.
  - Introduced canonical Terraform ruleset for zone‑level headers under `infrastructure/terraform/cloudflare/` with HSTS, Referrer‑Policy, X‑Frame‑Options, X‑Content‑Type‑Options, and Permissions‑Policy. Optional CSP controlled via variables.
  - Added `scripts/fetch-security-headers-live.mjs` and `npm run headers:snapshot` to fetch the latest applied ruleset into `scripts/security-headers.live.json` for drift detection.
  - Tightened CSP defaults and made them environment‑aware:
    - Variables: `environment` (production|staging|development), `csp_mode` (enforce|report-only|disabled), `enable_csp` toggle, and explicit `csp` override.
        - Defaults: strict `csp_prod` (enforce), near‑prod `csp_staging` (report‑sample), permissive `csp_dev` (dev tooling).
    - Coordinator & Feeds Reliability
      - Pages Functions now include `X-Stacknews-Warm` when calling the coordinator via the `COORDINATOR` service binding (auth alignment with Worker).
      - When the coordinator is unavailable, `/api/feeds.json?category=ALL` now refreshes at least one category (fallback to the first in rotation) to avoid empty payloads.
    - Treasury Yield Curve Resilience
      - Added retry/backoff (3 attempts, exponential) for upstream FiscalData calls.
      - Increased KV TTL for snapshots to 24h and added `Cache-Control` on KV fallbacks; KV-backed responses are also written into the HTTP cache.
    - UI Behavior (No Fake Data)
      - Removed all loading/placeholder texts (e.g., “SYNCING…”, “LOADING…”, “NO DATA”). Panels and widgets only render when real data is available.
      - Sidebar “National Debt” renders only with a non‑zero value; feed panels render only with actual items.
- Feeds & Categories
  - Added US Civil Air Patrol feeds (News, Cadet Blogs, Learning Videos, STEM Lessons) under `MILITARY`.
  - Added country/region categories: `BULGARIA`, `CHINA`, `AFRICA` and wired into rotation.
  - Added feeds: Bulgarian Military (RSS), China Defense Blog (RSS), Africa Defense News (RSS).
  - Not added due to missing/uncertain RSS endpoints: China Military Aviation (incomplete URL), China Military Official (site URL provided without RSS). Provide valid RSS/Atom URLs to include.
 - Dev Ergonomics & Docs
   - Added `.nvmrc` (Node v20.18.0) and `"engines"` in `package.json` for reproducible builds.
   - Added `.dev.vars.example` (FRED_API_KEY, NASA_API_KEY, EIA_API_KEY, WARM_SECRET) and ignored `.dev.vars` in VCS.
   - Added `scripts/verify-env.mjs` + `npm run env:verify` (checks required secrets and Wrangler config: COORDINATOR, STACKNEWS_KV, nodejs_compat).
   - Added `scripts/smoke.mjs` + `npm run smoke` to validate key endpoints and security headers. Supports `SMOKE_ORIGIN` override.
   - Clarified README: local dev quickstart, KV namespace discovery command, Wrangler names/compatibility dates, coordinator noted as Cloudflare‑managed, rollback guidance.

## 2025-12-08
- Deployment
  - Deployed coordinator Worker (Durable Object) to workers.dev and set WARM_SECRET.
  - Set Pages secrets: NASA_API_KEY, EIA_API_KEY, WARM_SECRET (FRED_API_KEY already present).
  - Resolved Pages deployment error (MessageChannel not defined) by pinning React/React-DOM to 18.3.x.
  - Added nodejs_compat for Pages in wrangler.jsonc.
- Security & Caching
  - Added Cloudflare Cache API read/write for `/api/feeds.json` and `/api/treasury.json` with SWR + `stale-if-error`.
  - Introduced KV read-through/write-through for feed items, category aggregates, and treasury fallback.
  - Added HMAC protection (`WARM_SECRET`) for scheduled warm requests.
- Coordination & Warmups
  - Added Durable Object coordinator Worker and Service Binding in Pages.
  - Implemented scheduled warmers (feeds rotation + JSON APIs) with jitter.
- Feeds
  - Added TreasuryDirect auctions/offerings, EIA RSS, World Nuclear News, CleanTechnica, Hydrogen Central.
  - Added Mortgage & Real Estate sources (MND, Fannie, Freddie, Redfin, Realtor.com, Connect CRE, NAR).
  - Added international central bank feeds (BoE news, BoC press, CBR press) and research feeds (arXiv, LLNL, ORNL, MIT Energy).
- JSON APIs
  - New endpoints: `/api/treasury-fiscal.json`, `/api/eia.json`, `/api/census/housing.json`, `/api/nasa/solar.json`, `/api/gdelt/events.json`, `/api/ukdata/search.json`.
  - Added `/api/treasury/yield-curve.json` (FiscalData Daily Yield Curve) with Cache API + KV fallback.
- Performance & Reliability
  - Implemented per-host concurrency limiter and backoff (429 Retry-After, 5xx exponential) for feed fetching.
  - Removed public proxy fallbacks from Yahoo market data; route via internal edge proxy only.
- Secrets & Config
  - Removed hardcoded `FRED_API_KEY`; read from Pages secrets.
  - Added env usage for `NASA_API_KEY` and `EIA_API_KEY`.
  - Removed `COORDINATOR_URL` fallback; Pages must bind `COORDINATOR` service to `stacknews-coordinator` Worker.
- Security Headers
  - Prepared Transform Rules script and ruleset for HSTS, CSP, nosniff, referrer-policy, frame-ancestors, permissions-policy.
  - See transcript for step-by-step: docs/transcripts/stacknews-session-2025-12-08.md
  - Captured live Cloudflare ruleset schema after applying via Dashboard: scripts/security-headers.live.json (source of truth for future API updates).
