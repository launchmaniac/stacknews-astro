// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com
// Treasury Yield Curve JSON endpoint (FRED API - CMT Rates)
// - Cache API with SWR + stale-if-error
// - KV durable fallback
// - Optional warm-mode via X-Stacknews-Warm
// Note: Migrated from FiscalData to FRED API (Dec 2025) after FiscalData endpoint deprecated

import type { APIRoute } from 'astro';
import { fetchYieldCurve } from '../../../lib/yield-curve';
import { getKV, kvGetJSON, kvPutJSON } from '../../../lib/kv';

export const prerender = false;

const KV_KEY = (days: number) => `yieldcurve:${days}`;

export const GET: APIRoute = async ({ request, url, locals }) => {
  const days = Math.max(1, Math.min(parseInt(url.searchParams.get('days') || '60', 10) || 60, 365));
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isWarm = url.searchParams.get('warm') === 'true';
  const apiKey = (locals as any)?.runtime?.env?.FRED_API_KEY as string | undefined;

  if (!apiKey) {
    console.error('[YieldCurve] Missing FRED_API_KEY binding');
    return new Response(
      JSON.stringify({ error: 'Missing FRED_API_KEY', message: 'Configure FRED_API_KEY as a Cloudflare secret/binding.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Warm-mode protection
  if (isWarm) {
    const secret = (locals as any)?.runtime?.env?.WARM_SECRET || (typeof process !== 'undefined' ? (process.env as any)?.WARM_SECRET : undefined);
    const token = request.headers.get('X-Stacknews-Warm') || '';
    if (!secret || token !== String(secret)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
  }

  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const kv = getKV(locals);

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    // Fetch fresh from FRED API
    const data = await fetchYieldCurve(days, apiKey);

    const res = new Response(
      JSON.stringify({
        days,
        points: data,
        _cache: { hit: false },
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, stale-if-error=86400',
          'X-Cache': 'MISS'
        }
      }
    );
    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
        // Extend KV TTL to align with stale-if-error window for better resilience
        locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, KV_KEY(days), { data, ts: Date.now() }, 24 * 60 * 60));
        return res;
      } catch (error: any) {
        // KV fallback
        const kvData = await kvGetJSON<{ data: any[] }>(kv, KV_KEY(days));
        if (kvData?.data) {
          const res = new Response(
            JSON.stringify({
              days,
              points: kvData.data,
              _cache: { hit: true, stale: true, error: true, source: 'kv' },
              timestamp: new Date().toISOString()
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600, stale-if-error=86400',
                'X-Cache': 'STALE-KV'
              }
            }
          );
          // Fill the HTTP cache with KV-backed response to improve subsequent hits
          locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
          return res;
        }
        return new Response(JSON.stringify({ error: 'Failed to load yield curve', message: error?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    };
