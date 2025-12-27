// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com
// Treasury Yield Curve JSON endpoint - Thin proxy to Hetzner backend

import type { APIRoute } from 'astro';
import { getKV, kvGetJSON, kvPutJSON } from '../../../lib/kv';

export const prerender = false;

const HETZNER_URL = 'https://rss.stacknews.launchmaniac.com';
const KV_KEY = (days: number) => `yieldcurve:v2:${days}`;

export const GET: APIRoute = async ({ request, url, locals }) => {
  const days = Math.max(1, Math.min(parseInt(url.searchParams.get('days') || '60', 10) || 60, 365));
  const forceRefresh = url.searchParams.get('refresh') === 'true';

  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const kv = getKV(locals);

  // Check edge cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      const cloned = new Response(cached.body, cached);
      cloned.headers.set('X-Cache', 'HIT');
      return cloned;
    }
  }

  try {
    // Get API key from environment
    const apiKey = (locals as any)?.runtime?.env?.HETZNER_API_KEY as string | undefined;
    if (!apiKey) {
      console.error('[YieldCurve] Missing HETZNER_API_KEY');
      throw new Error('Missing HETZNER_API_KEY');
    }

    // Forward to Hetzner
    const upstream = await fetch(`${HETZNER_URL}/api/treasury/yield-curve?days=${days}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'User-Agent': 'StackNews-Cloudflare/1.0'
      },
      cf: { cacheTtl: 0 }
    });

    if (!upstream.ok) {
      throw new Error(`Hetzner returned ${upstream.status}`);
    }

    const upstreamData = await upstream.json() as { data: any[]; _cache?: unknown; timestamp?: string };

    // Build response - map `data` to `points` for backwards compatibility
    const res = new Response(
      JSON.stringify({
        days,
        data: upstreamData.data,
        _cache: { hit: false, source: 'hetzner' },
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200, stale-if-error=86400',
          'X-Cache': 'MISS',
          'X-Upstream': 'hetzner'
        }
      }
    );

    // Cache in edge and KV
    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, KV_KEY(days), { data: upstreamData.data, ts: Date.now() }, 24 * 60 * 60));

    return res;

  } catch (error: any) {
    console.error('[YieldCurve] Upstream error:', error?.message);

    // Try stale edge cache
    const stale = await cache.match(cacheKey);
    if (stale) {
      const cloned = new Response(stale.body, stale);
      cloned.headers.set('X-Cache', 'STALE');
      return cloned;
    }

    // Try KV fallback
    const kvData = await kvGetJSON<{ data: any[] }>(kv, KV_KEY(days));
    if (kvData?.data) {
      const res = new Response(
        JSON.stringify({
          days,
          data: kvData.data,
          _cache: { hit: true, stale: true, source: 'kv' },
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'STALE-KV'
          }
        }
      );
      locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
      return res;
    }

    // All fallbacks failed
    return new Response(
      JSON.stringify({ error: 'Failed to load yield curve', message: error?.message }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
