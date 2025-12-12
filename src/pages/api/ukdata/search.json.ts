// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// UK data.gov.uk CKAN search proxy with Cache API + KV fallback

import type { APIRoute } from 'astro';
import { searchUkData } from '../../../lib/ukdata';
import type { UkDataset } from '../../../lib/types';
import { getKV, kvGetJSON, kvPutJSON } from '../../../lib/kv';

export const prerender = false;

export const GET: APIRoute = async ({ request, url, locals }) => {
  const q = url.searchParams.get('q') || '';
  const rows = Math.max(1, Math.min(100, Number(url.searchParams.get('rows') || 20)));
  const start = Math.max(0, Number(url.searchParams.get('start') || 0));
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isWarm = url.searchParams.get('warm') === 'true';
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const kv = getKV(locals);

  if (isWarm) {
    const secret = (locals as any)?.runtime?.env?.WARM_SECRET || (typeof process !== 'undefined' ? (process.env as any)?.WARM_SECRET : undefined);
    const token = request.headers.get('X-Stacknews-Warm') || '';
    if (!secret || token !== String(secret)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
  }

  if (!q) {
    return new Response(JSON.stringify({ error: 'Missing q parameter' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const KV_KEY = `ukdata:${encodeURIComponent(q)}:${rows}:${start}`;

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }
    const { count, results } = await searchUkData({ q, rows, start });
    const res = new Response(
      JSON.stringify({ count, results, _cache: { hit: false }, timestamp: new Date().toISOString() }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600, stale-if-error=86400', 'X-Cache': 'MISS' } }
    );
    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, KV_KEY, { data: { count, results }, ts: Date.now() }, 60 * 60));
    return res;
  } catch (error: any) {
    const kvData = await kvGetJSON<{ data: { count: number; results: UkDataset[] } }>(kv, KV_KEY);
    if (kvData?.data) {
      return new Response(
        JSON.stringify({ ...kvData.data, _cache: { hit: true, stale: true, error: true, source: 'kv' }, timestamp: new Date().toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE-KV' } }
      );
    }
    return new Response(JSON.stringify({ error: 'Failed to search UK data', message: error?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

