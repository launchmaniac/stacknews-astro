// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// GDELT events/documents proxy with Cache API + KV fallback

import type { APIRoute } from 'astro';
import { getGdeltDocs } from '../../../lib/gdelt';
import type { GdeltDoc } from '../../../lib/types';
import { getKV, kvGetJSON, kvPutJSON } from '../../../lib/kv';

export const prerender = false;

function parseTimespan(span: string): { startdatetime?: string; enddatetime?: string } {
  // Accept formats like 24h, 48h, 7d
  const now = new Date();
  const m = span.match(/^(\d+)([hd])$/i);
  if (!m) return {};
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  const deltaMs = unit === 'h' ? n * 3600000 : n * 24 * 3600000;
  const start = new Date(now.getTime() - deltaMs);
  const fmt = (d: Date) => `${d.getUTCFullYear()}${String(d.getUTCMonth()+1).padStart(2,'0')}${String(d.getUTCDate()).padStart(2,'0')}${String(d.getUTCHours()).padStart(2,'0')}${String(d.getUTCMinutes()).padStart(2,'0')}${String(d.getUTCSeconds()).padStart(2,'0')}`;
  return { startdatetime: fmt(start), enddatetime: fmt(now) };
}

export const GET: APIRoute = async ({ request, url, locals }) => {
  const q = url.searchParams.get('query') || '';
  const timespan = url.searchParams.get('timespan') || '24h';
  const maxrecords = Math.max(1, Math.min(200, Number(url.searchParams.get('maxrecords') || 50)));
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
    return new Response(JSON.stringify({ error: 'Missing query parameter' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const window = parseTimespan(timespan);
  const kvKey = `gdelt:${encodeURIComponent(q)}:${window.startdatetime || 'na'}:${window.enddatetime || 'na'}:${maxrecords}`;

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    const docs: GdeltDoc[] = await getGdeltDocs({ query: q, ...window, maxrecords });
    const res = new Response(
      JSON.stringify({ docs, _cache: { hit: false }, timestamp: new Date().toISOString() }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600, stale-if-error=86400', 'X-Cache': 'MISS' } }
    );
    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, kvKey, { data: docs, ts: Date.now() }, 60 * 60));
    return res;
  } catch (error: any) {
    const kvData = await kvGetJSON<{ data: GdeltDoc[] }>(kv, kvKey);
    if (kvData?.data) {
      return new Response(
        JSON.stringify({ docs: kvData.data, _cache: { hit: true, stale: true, error: true, source: 'kv' }, timestamp: new Date().toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE-KV' } }
      );
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch GDELT docs', message: error?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

