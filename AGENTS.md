# StackNews Astro – Project Agent Guide

Scope: This file applies to `stacknews-astro/` only and overrides the global AGENTS.md where conflicts arise. It documents conventions, deployment, secrets, and platform usage for this app.

## Architecture & Platform
- Astro SSR deployed on Cloudflare Pages + Functions.
- Cloudflare Workers Durable Object coordinator warms cache and coordinates category refreshes.
- Edge caching via Cloudflare Cache API + KV durable fallback.
- React islands for dynamic panels; Tailwind v4 for styling.

## Build & Run
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Deploy (Pages): `wrangler pages deploy --project-name stacknews-astro`

## Required Bindings & Secrets (Pages)
- Service Binding: `COORDINATOR` → service `stacknews-coordinator` (Durable Object worker)
- KV Binding: `STACKNEWS_KV` (durable read‑through/write‑through cache)
- Secrets:
  - `FRED_API_KEY` (Treasury/FRED)
  - `WARM_SECRET` (HMAC for scheduled warm requests)
  - `NASA_API_KEY` (DONKI solar flares)
  - `EIA_API_KEY` (EIA v2; optional but recommended)

## Coordinator Worker (stacknews-coordinator)
- Env vars: `TARGET_ORIGIN` → production origin (e.g., https://stacknews.org), `WARM_SECRET` (same as Pages)
- Cron: every 5 minutes; jitter added; warms one feed category + JSON endpoints on cadence.

## Caching Policy
- All API endpoints use Cache API with SWR and stale‑if‑error; write‑through to KV.
- Standard headers: `Cache-Control: public, s-maxage=120–300, stale-while-revalidate=600, stale-if-error=86400`.
- Responses expose `X-Cache` markers (HIT|MISS|PARTIAL|STALE-ERROR|STALE-KV).

## Feeds & Categories
- RSS/Atom sources live in `src/lib/constants.ts` under `FEEDS`.
- To add a new category: update `CATEGORIES` (for UI), `CategoryType` (types), and `FEED_CATEGORIES` (cache rotation).
- Do not add public CORS proxies. Route external calls through the internal edge proxy when needed.

## Security & Headers
- Security headers are applied via Cloudflare Transform Rules (HSTS, CSP, nosniff, referrer‑policy, frame‑ancestors, permissions‑policy).
- No secrets in source. All credentials via Pages secrets and bindings.

## Code Attribution
- Never add comments or credits attributing code generation to any AI assistant. Keep code clean and professional without AI attribution comments.
- Mark all code as "Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com".

## Deployment Checklist
1) Ensure Service Binding `COORDINATOR` is set on Pages.
2) Ensure `STACKNEWS_KV` is bound.
3) Set secrets: `FRED_API_KEY`, `WARM_SECRET`, `NASA_API_KEY`, `EIA_API_KEY`.
4) Build + deploy: `npm run build` → `wrangler pages deploy --project-name stacknews-astro`.

## Observability
- Tail deployments: `wrangler pages deployment tail --project-name stacknews-astro --deployment-id <id>`.
- Monitor cache hit ratios and 5xx; investigate regressions promptly.

## Coding Conventions (Project‑Specific)
- TypeScript strict patterns; prefer module‑level utilities in `src/lib/`.
- Keep API routes self‑contained: input validation, Cache API, KV fallback, error envelope.
- Respect upstreams: conditional requests (ETag/Last-Modified), per-host concurrency + backoff.

## Changelog
- See `CHANGELOG.md` in this directory for dated entries of notable changes and operational updates.
