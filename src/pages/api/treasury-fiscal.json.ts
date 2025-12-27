// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Treasury Fiscal Data snapshot API - Thin proxy to Hetzner backend

import type { APIRoute } from 'astro';
import type { TreasuryFiscalSnapshot } from '../../lib/types';
import { getKV, kvGetJSON, kvPutJSON } from '../../lib/kv';

export const prerender = false;

const HETZNER_URL = 'https://rss.stacknews.launchmaniac.com';

export const GET: APIRoute = async ({ request, url, locals }) => {
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const kv = getKV(locals);
  const KV_KEY = 'tfiscal:v2';

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
      console.error('[TreasuryFiscal] Missing HETZNER_API_KEY');
      throw new Error('Missing HETZNER_API_KEY');
    }

    // Forward to Hetzner
    const upstream = await fetch(`${HETZNER_URL}/api/treasury/fiscal`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'User-Agent': 'StackNews-Cloudflare/1.0'
      },
      cf: { cacheTtl: 0 } // Don't use Cloudflare's automatic caching for upstream
    });

    if (!upstream.ok) {
      throw new Error(`Hetzner returned ${upstream.status}`);
    }

    const data = await upstream.json() as TreasuryFiscalSnapshot & { _cache?: unknown; timestamp?: string };

    // Build response with edge caching headers
    const res = new Response(
      JSON.stringify({
        ...data,
        _cache: { hit: false, source: 'hetzner' },
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600, stale-if-error=86400',
          'X-Cache': 'MISS',
          'X-Upstream': 'hetzner'
        }
      }
    );

    // Cache in edge and KV (fire and forget)
    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, KV_KEY, { data, ts: Date.now() }, 60 * 60));

    return res;

  } catch (error: any) {
    console.error('[TreasuryFiscal] Upstream error:', error?.message);

    // Try stale edge cache
    const stale = await cache.match(cacheKey);
    if (stale) {
      const cloned = new Response(stale.body, stale);
      cloned.headers.set('X-Cache', 'STALE');
      return cloned;
    }

    // Try KV fallback
    const kvData = await kvGetJSON<{ data: TreasuryFiscalSnapshot }>(kv, KV_KEY);
    if (kvData?.data) {
      return new Response(
        JSON.stringify({
          ...kvData.data,
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
    }

    // All fallbacks failed
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Treasury Fiscal data', message: error?.message }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
