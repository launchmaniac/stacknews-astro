// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com
// Bureau of Labor Statistics (BLS) API endpoint
// - Cache API with SWR + stale-if-error
// - KV durable fallback
// - 25 economic data series: unemployment, CPI, JOLTS, PPI, productivity

import type { APIRoute } from 'astro';
import { fetchBLSData, BLS_SERIES, type BLSDataPoint } from '../../lib/bls';
import { getKV, kvGetJSON, kvPutJSON } from '../../lib/kv';

export const prerender = false;

const KV_KEY = 'bls:data';

export const GET: APIRoute = async ({ request, url, locals }) => {
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const category = url.searchParams.get('category') || 'all';
  const apiKey = (locals as any)?.runtime?.env?.BLS_API_KEY as string | undefined;

  if (!apiKey) {
    console.error('[BLS] Missing BLS_API_KEY binding');
    return new Response(
      JSON.stringify({ error: 'Missing BLS_API_KEY', message: 'Configure BLS_API_KEY as a Cloudflare secret/binding.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const kv = getKV(locals);

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    // Fetch all 25 series from BLS API
    const data = await fetchBLSData(apiKey);

    // Group by category for easier frontend consumption
    const grouped = groupByCategory(data);

    const res = new Response(
      JSON.stringify({
        series: data,
        grouped,
        count: data.length,
        totalAvailable: Object.keys(BLS_SERIES).length,
        _cache: { hit: false },
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600, stale-if-error=86400',
          'X-Cache': 'MISS'
        }
      }
    );

    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, KV_KEY, { data, grouped, ts: Date.now() }, 24 * 60 * 60));
    return res;
  } catch (error: any) {
    console.error('[BLS] API error:', error?.message);

    // KV fallback
    const kvData = await kvGetJSON<{ data: BLSDataPoint[]; grouped: any }>(kv, KV_KEY);
    if (kvData?.data) {
      const res = new Response(
        JSON.stringify({
          series: kvData.data,
          grouped: kvData.grouped,
          count: kvData.data.length,
          totalAvailable: Object.keys(BLS_SERIES).length,
          _cache: { hit: true, stale: true, error: true, source: 'kv' },
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800, stale-if-error=86400',
            'X-Cache': 'STALE-KV'
          }
        }
      );
      locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
      return res;
    }

    return new Response(
      JSON.stringify({ error: 'Failed to load BLS data', message: error?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

function groupByCategory(data: BLSDataPoint[]): Record<string, BLSDataPoint[]> {
  const grouped: Record<string, BLSDataPoint[]> = {
    labor: [],
    jolts: [],
    inflation: [],
    ppi: [],
    productivity: [],
    states: []
  };

  for (const point of data) {
    if (grouped[point.category]) {
      grouped[point.category].push(point);
    }
  }

  return grouped;
}
