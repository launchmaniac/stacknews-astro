// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com
// Thin proxy to Hetzner RSS service
// Replaces direct feed fetching with cached Hetzner backend

import type { APIRoute } from 'astro';

export const prerender = false;

const HETZNER_TIMEOUT = 15000; // 15 seconds
const HETZNER_URL = 'https://rss.stacknews.launchmaniac.com';

export const GET: APIRoute = async ({ request, url, locals }) => {
  const env = (locals as any)?.runtime?.env;
  const ctx = (locals as any)?.runtime?.ctx;
  const cache = (caches as any)?.default;

  const category = url.searchParams.get('category') || 'ALL';
  const refresh = url.searchParams.get('refresh') === 'true';
  const limit = url.searchParams.get('limit') || '200';

  // Build cache key
  const cacheKey = new Request(
    `${url.origin}/api/feeds.json?category=${category}&limit=${limit}`,
    { method: 'GET' }
  );

  // Check edge cache first (skip if force refresh)
  if (cache && !refresh) {
    try {
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        const response = new Response(cachedResponse.body, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            'Cache-Control': cachedResponse.headers.get('Cache-Control') || 'public, s-maxage=300',
          },
        });
        return response;
      }
    } catch (err) {
      console.error('[Proxy] Cache read error:', err);
    }
  }

  try {
    // Get API key from environment
    const apiKey = env?.HETZNER_API_KEY;
    if (!apiKey) {
      console.error('[Proxy] HETZNER_API_KEY not configured');
      return new Response(
        JSON.stringify({
          feeds: {},
          stream: [],
          errors: ['Backend configuration error'],
          _meta: {
            category,
            cached: false,
            cacheAge: 0,
            totalFeeds: 0,
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Build Hetzner request URL
    const hetznerUrl = new URL('/api/feeds', HETZNER_URL);
    hetznerUrl.searchParams.set('category', category);
    hetznerUrl.searchParams.set('limit', limit);
    if (refresh) hetznerUrl.searchParams.set('refresh', 'true');

    // Fetch from Hetzner with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HETZNER_TIMEOUT);

    const response = await fetch(hetznerUrl.toString(), {
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Request-ID': crypto.randomUUID(),
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Hetzner returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Build response with cache headers
    const res = new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
        'X-Upstream': 'hetzner',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, stale-if-error=86400',
      },
    });

    // Store in edge cache (non-blocking)
    if (cache && ctx?.waitUntil) {
      ctx.waitUntil(
        cache.put(cacheKey, res.clone()).catch((err: Error) => {
          console.error('[Proxy] Cache write error:', err);
        })
      );
    }

    return res;
  } catch (error: any) {
    console.error('[Proxy] Hetzner fetch failed:', error.message);

    // Try to return stale cached data
    if (cache) {
      try {
        const staleResponse = await cache.match(cacheKey);
        if (staleResponse) {
          return new Response(staleResponse.body, {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'X-Cache': 'STALE',
              'X-Error': error.message,
            },
          });
        }
      } catch (cacheErr) {
        console.error('[Proxy] Stale cache read error:', cacheErr);
      }
    }

    // Last resort: Return error response
    return new Response(
      JSON.stringify({
        feeds: {},
        stream: [],
        errors: ['Feed service temporarily unavailable'],
        _meta: {
          category,
          cached: false,
          cacheAge: 0,
          totalFeeds: 0,
          timestamp: new Date().toISOString(),
          error: error.message,
        },
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      }
    );
  }
};
