// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// NASA Planetary Intelligence API
// Space Weather (DONKI) + Earth Events (EONET)
// Critical infrastructure intelligence for energy sector

import type { APIRoute } from 'astro';
import {
  getSolarFlares,
  getCoronalMassEjections,
  getGeomagneticStorms,
  getSpaceWeatherSnapshot,
  getEonetEvents,
  getEonetSnapshot,
  EONET_CATEGORIES
} from '../../../lib/nasa';
import { getKV, kvGetJSON, kvPutJSON } from '../../../lib/kv';

export const prerender = false;

function fmtDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

const VALID_DATASETS = ['space-weather', 'flares', 'cme', 'storms', 'earth-events', 'wildfires', 'volcanoes', 'snapshot'];
const VALID_EONET_CATEGORIES = Object.values(EONET_CATEGORIES);

export const GET: APIRoute = async ({ request, url, locals }) => {
  const dataset = (url.searchParams.get('dataset') || 'snapshot').toLowerCase();
  const days = Math.max(1, Math.min(30, Number(url.searchParams.get('days') || 7)));
  const category = url.searchParams.get('category')?.toLowerCase();
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isWarm = url.searchParams.get('warm') === 'true';
  const apiKey = (locals as any)?.runtime?.env?.NASA_API_KEY as string | undefined;
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

  // Return usage info if help requested
  if (url.searchParams.get('help') === 'true') {
    return new Response(JSON.stringify({
      description: 'NASA Planetary Intelligence API - Space Weather & Earth Events',
      datasets: {
        snapshot: '/api/nasa/planetary.json - Combined space weather + earth events dashboard',
        'space-weather': '/api/nasa/planetary.json?dataset=space-weather&days=7 - DONKI space weather snapshot',
        flares: '/api/nasa/planetary.json?dataset=flares&days=7 - Solar flares only',
        cme: '/api/nasa/planetary.json?dataset=cme&days=7 - Coronal mass ejections only',
        storms: '/api/nasa/planetary.json?dataset=storms&days=7 - Geomagnetic storms only',
        'earth-events': '/api/nasa/planetary.json?dataset=earth-events&days=30 - EONET natural events',
        wildfires: '/api/nasa/planetary.json?dataset=wildfires&days=30 - Active wildfires',
        volcanoes: '/api/nasa/planetary.json?dataset=volcanoes&days=30 - Active volcanoes'
      },
      parameters: {
        days: 'Lookback period (1-30 days, default 7)',
        category: `EONET category filter for earth-events: ${VALID_EONET_CATEGORIES.join(', ')}`,
        refresh: 'Force cache refresh (true/false)'
      },
      threatLevels: {
        description: 'Space weather threat assessment',
        levels: ['low', 'moderate', 'elevated', 'high', 'extreme'],
        gridRiskFactors: {
          'Kp 0-4': 'Minimal impact',
          'Kp 5-6': 'G1-G2: Power grid fluctuations possible',
          'Kp 7-8': 'G3-G4: Transformer damage possible',
          'Kp 9': 'G5: Widespread grid collapse possible'
        },
        flareClassification: {
          'A/B/C': 'Minor - no significant impact',
          'M': 'Moderate - brief radio blackouts',
          'X': 'Major - widespread radio blackouts',
          'X10+': 'Extreme - potential grid damage'
        }
      },
      eonetCategories: VALID_EONET_CATEGORIES,
      energySectorRelevance: {
        spaceweather: 'Solar events can damage power grids, transformers, and satellite communications',
        wildfires: 'Threaten power lines and infrastructure',
        volcanoes: 'Ash clouds disrupt aviation, geothermal impacts',
        severeStorms: 'Grid damage, offshore platform risks'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=3600' }
    });
  }

  // Determine cache keys
  const kvKey = `nasa:planetary:${dataset}:${days}:${category || 'all'}:v1`;
  const cacheTTL = dataset.includes('flare') || dataset.includes('storm') || dataset === 'space-weather'
    ? 300  // 5 minutes for space weather (near real-time)
    : 900; // 15 minutes for earth events

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    let data: any;

    switch (dataset) {
      case 'space-weather':
        // Full space weather snapshot (requires API key)
        if (!apiKey) {
          return new Response(JSON.stringify({ error: 'Missing NASA_API_KEY for DONKI endpoints' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        data = await getSpaceWeatherSnapshot(apiKey, days);
        break;

      case 'flares':
        if (!apiKey) {
          return new Response(JSON.stringify({ error: 'Missing NASA_API_KEY' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const end = new Date();
        const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const flares = await getSolarFlares(apiKey, fmtDate(start), fmtDate(end));
        data = {
          events: flares,
          count: flares.length,
          xClass: flares.filter(f => f.classType?.startsWith('X')).length,
          mClass: flares.filter(f => f.classType?.startsWith('M')).length,
          period: { start: fmtDate(start), end: fmtDate(end), days }
        };
        break;

      case 'cme':
        if (!apiKey) {
          return new Response(JSON.stringify({ error: 'Missing NASA_API_KEY' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const cmeEnd = new Date();
        const cmeStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const cmes = await getCoronalMassEjections(apiKey, fmtDate(cmeStart), fmtDate(cmeEnd));
        data = {
          events: cmes,
          count: cmes.length,
          period: { start: fmtDate(cmeStart), end: fmtDate(cmeEnd), days }
        };
        break;

      case 'storms':
        if (!apiKey) {
          return new Response(JSON.stringify({ error: 'Missing NASA_API_KEY' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const stormEnd = new Date();
        const stormStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const storms = await getGeomagneticStorms(apiKey, fmtDate(stormStart), fmtDate(stormEnd));
        // Calculate max Kp
        const maxKp = storms.reduce((max, s) => {
          const stormMax = s.allKpIndex?.reduce((m, k) => Math.max(m, k.kpIndex || 0), 0) || 0;
          return Math.max(max, stormMax);
        }, 0);
        data = {
          events: storms,
          count: storms.length,
          maxKpIndex: maxKp,
          gridRisk: maxKp >= 7 ? 'high' : maxKp >= 5 ? 'moderate' : 'low',
          period: { start: fmtDate(stormStart), end: fmtDate(stormEnd), days }
        };
        break;

      case 'earth-events':
        // EONET events (no API key required)
        const events = await getEonetEvents(days, 'open', category, 100);
        data = {
          events,
          count: events.length,
          category: category || 'all',
          period: { days }
        };
        break;

      case 'wildfires':
        const fires = await getEonetEvents(days, 'open', 'wildfires', 100);
        data = {
          events: fires,
          count: fires.length,
          period: { days }
        };
        break;

      case 'volcanoes':
        const volcanoes = await getEonetEvents(days, 'open', 'volcanoes', 100);
        data = {
          events: volcanoes,
          count: volcanoes.length,
          period: { days }
        };
        break;

      case 'snapshot':
      default:
        // Combined planetary intelligence dashboard
        const [earthSnapshot, spaceWeather] = await Promise.all([
          getEonetSnapshot(days),
          apiKey ? getSpaceWeatherSnapshot(apiKey, days) : null
        ]);

        data = {
          spaceWeather: spaceWeather || { error: 'NASA_API_KEY required for space weather data' },
          earthEvents: earthSnapshot,
          combined: {
            spaceWeatherThreat: spaceWeather?.threatAssessment?.level || 'unknown',
            activeNaturalEvents: earthSnapshot.summary.totalActiveEvents,
            activeWildfires: earthSnapshot.highlights.activeWildfires,
            activeVolcanoes: earthSnapshot.highlights.activeVolcanoes,
            gridRiskFactors: {
              solarActivity: spaceWeather?.threatAssessment?.gridRisk || 'unknown',
              naturalDisasters: earthSnapshot.highlights.severeStorms > 5 ? 'elevated' : 'low'
            }
          }
        };
        break;
    }

    const res = new Response(
      JSON.stringify({
        ...data,
        dataset,
        _cache: { hit: false },
        timestamp: new Date().toISOString()
      }),
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
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, kvKey, { data, ts: Date.now() }, cacheTTL * 4));
    return res;

  } catch (error: any) {
    const kvData = await kvGetJSON<{ data: any }>(kv, kvKey);
    if (kvData?.data) {
      return new Response(
        JSON.stringify({
          ...kvData.data,
          dataset,
          _cache: { hit: true, stale: true, error: true, source: 'kv' },
          timestamp: new Date().toISOString()
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE-KV' } }
      );
    }
    return new Response(
      JSON.stringify({ error: 'Failed to fetch NASA planetary data', message: error?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
