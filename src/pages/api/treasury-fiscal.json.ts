// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Treasury Fiscal Data snapshot API (Debt, Avg Interest Rate, Cash) with Cache API + KV fallback

import type { APIRoute } from 'astro';
import { getTreasuryFiscalSnapshot } from '../../lib/treasury-fiscal';
import type { TreasuryFiscalSnapshot } from '../../lib/types';
import { getKV, kvGetJSON, kvPutJSON } from '../../lib/kv';

export const prerender = false;

export const GET: APIRoute = async ({ request, url, locals }) => {
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isWarm = url.searchParams.get('warm') === 'true';
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const kv = getKV(locals);
  const KV_KEY = 'tfiscal:v1';

  // Protect warm requests
  if (isWarm) {
    const secret = (locals as any)?.runtime?.env?.WARM_SECRET || (typeof process !== 'undefined' ? (process.env as any)?.WARM_SECRET : undefined);
    const token = request.headers.get('X-Stacknews-Warm') || '';
    if (!secret || token !== String(secret)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
  }

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    const data: TreasuryFiscalSnapshot = await getTreasuryFiscalSnapshot();
    const res = new Response(
      JSON.stringify({
        ...data,
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
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, KV_KEY, { data, ts: Date.now() }, 60 * 60));
    return res;
  } catch (error: any) {
    // Try KV fallback
    const kvData = await kvGetJSON<{ data: TreasuryFiscalSnapshot }>(kv, KV_KEY);
    if (kvData?.data) {
      return new Response(
        JSON.stringify({ ...kvData.data, _cache: { hit: true, stale: true, error: true, source: 'kv' }, timestamp: new Date().toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE-KV' } }
      );
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch Treasury Fiscal data', message: error?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

