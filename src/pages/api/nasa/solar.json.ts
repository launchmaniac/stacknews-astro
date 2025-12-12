// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// NASA DONKI Solar Flares API proxy with Cache API + KV fallback

import type { APIRoute } from 'astro';
import { getSolarFlares } from '../../../lib/nasa';
import type { SolarFlareEvent } from '../../../lib/types';
import { getKV, kvGetJSON, kvPutJSON } from '../../../lib/kv';

export const prerender = false;

function fmtDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export const GET: APIRoute = async ({ request, url, locals }) => {
  const days = Math.max(1, Math.min(30, Number(url.searchParams.get('days') || 7)));
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isWarm = url.searchParams.get('warm') === 'true';
  const apiKey = (locals as any)?.runtime?.env?.NASA_API_KEY as string | undefined;
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const kv = getKV(locals);
  const KV_KEY = `nasa:solar:days:${days}`;

  if (isWarm) {
    const secret = (locals as any)?.runtime?.env?.WARM_SECRET || (typeof process !== 'undefined' ? (process.env as any)?.WARM_SECRET : undefined);
    const token = request.headers.get('X-Stacknews-Warm') || '';
    if (!secret || token !== String(secret)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
  }

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing NASA_API_KEY' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const data: SolarFlareEvent[] = await getSolarFlares(apiKey, fmtDate(start), fmtDate(end));
    const res = new Response(
      JSON.stringify({ events: data, _cache: { hit: false }, timestamp: new Date().toISOString() }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600, stale-if-error=86400', 'X-Cache': 'MISS' } }
    );
    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, KV_KEY, { data, ts: Date.now() }, 60 * 60));
    return res;
  } catch (error: any) {
    const kvData = await kvGetJSON<{ data: SolarFlareEvent[] }>(kv, KV_KEY);
    if (kvData?.data) {
      return new Response(
        JSON.stringify({ events: kvData.data, _cache: { hit: true, stale: true, error: true, source: 'kv' }, timestamp: new Date().toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE-KV' } }
      );
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch NASA solar data', message: error?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

