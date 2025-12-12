// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// GDELT Global Stability Index API
// Returns statistical abstraction of global cooperation vs conflict events

import type { APIRoute } from 'astro';
import { getGlobalStabilitySnapshot, getThematicEvents, THEMATIC_QUERIES } from '../../../lib/gdelt';
import { getKV, kvGetJSON, kvPutJSON } from '../../../lib/kv';

export const prerender = false;

const VALID_THEMES = Object.keys(THEMATIC_QUERIES);

export const GET: APIRoute = async ({ request, url, locals }) => {
  const dataset = (url.searchParams.get('dataset') || 'stability').toLowerCase();
  const theme = url.searchParams.get('theme')?.toUpperCase();
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

  // Return usage info if no dataset or help requested
  if (url.searchParams.get('help') === 'true') {
    return new Response(JSON.stringify({
      endpoints: {
        stability: '/api/gdelt/stability.json - Global Stability Index (cooperation vs conflict ratio)',
        thematic: '/api/gdelt/stability.json?dataset=thematic&theme=THEME - Events by theme'
      },
      availableThemes: VALID_THEMES,
      themeDescriptions: {
        MILITARY_CONFLICT: 'Military and conflict events from US, Russia, China',
        DIPLOMATIC_TENSIONS: 'Diplomatic disputes, sanctions, trade disputes',
        PROTEST_CIVIL_UNREST: 'Protests, demonstrations, civil unrest',
        CENTRAL_BANKS: 'Central bank policy and announcements',
        TRADE_SANCTIONS: 'Sanctions, tariffs, trade restrictions',
        ENERGY_GEOPOLITICS: 'Oil, gas, OPEC-related geopolitics',
        AI_REGULATION: 'AI policy and regulation news',
        CYBER_SECURITY: 'Cyber attacks, hacking, data breaches',
        SPACE_TECH: 'Space technology and satellite news',
        CLIMATE_POLICY: 'Climate summits and carbon policy',
        NATURAL_DISASTERS: 'Earthquakes, hurricanes, wildfires',
        ASIA_PACIFIC: 'China, Japan, Korea, Taiwan regional events',
        MIDDLE_EAST: 'Israel, Iran, Saudi Arabia regional events',
        EUROPE: 'Ukraine, Russia, Germany regional events'
      },
      stabilityIndex: {
        description: '0-100 scale where 100 = most stable',
        calculation: 'Based on cooperation events (+) vs verbal conflict (-0.3) vs material conflict (-1.5)',
        interpretation: {
          '80-100': 'High stability - cooperation dominates',
          '60-80': 'Moderate stability - balanced events',
          '40-60': 'Neutral - equal cooperation and conflict',
          '20-40': 'Elevated tensions - conflict dominates',
          '0-20': 'Crisis level - severe material conflicts'
        }
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=3600' }
    });
  }

  const KV_KEY = dataset === 'thematic' && theme
    ? `gdelt:thematic:${theme}:v1`
    : 'gdelt:stability:v1';

  const cacheTTL = 300; // 5 minutes for near-real-time stability data

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    let data: any;

    if (dataset === 'thematic' && theme) {
      if (!VALID_THEMES.includes(theme)) {
        return new Response(JSON.stringify({
          error: `Invalid theme. Use one of: ${VALID_THEMES.join(', ')}`
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const docs = await getThematicEvents(theme as keyof typeof THEMATIC_QUERIES, 50);
      data = {
        theme,
        query: THEMATIC_QUERIES[theme as keyof typeof THEMATIC_QUERIES],
        docs,
        count: docs.length
      };
    } else {
      // Default: Global Stability snapshot
      data = await getGlobalStabilitySnapshot();
    }

    const res = new Response(
      JSON.stringify({ ...data, dataset, _cache: { hit: false }, timestamp: new Date().toISOString() }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, s-maxage=${cacheTTL}, stale-while-revalidate=${cacheTTL * 2}, stale-if-error=3600`,
          'X-Cache': 'MISS'
        }
      }
    );

    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, KV_KEY, { data, ts: Date.now() }, cacheTTL * 4));
    return res;
  } catch (error: any) {
    const kvData = await kvGetJSON<{ data: any }>(kv, KV_KEY);
    if (kvData?.data) {
      return new Response(
        JSON.stringify({ ...kvData.data, dataset, _cache: { hit: true, stale: true, error: true, source: 'kv' }, timestamp: new Date().toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE-KV' } }
      );
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch GDELT stability data', message: error?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
