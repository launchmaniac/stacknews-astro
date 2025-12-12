// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Server-side Treasury data API with caching
// Uses FRED API as primary source (more reliable with Cloudflare Workers)

import type { APIRoute } from 'astro';
import type { TreasuryData } from '../../lib/types';
// FRED API key is provided via Cloudflare environment bindings
import {
  getTreasuryCache,
  setTreasuryCache,
  isTreasuryCacheStale,
  getTreasuryCacheAge
} from '../../lib/cache';
import { getKV, kvGetJSON, kvPutJSON } from '../../lib/kv';

export const prerender = false;

const MAX_RETRIES = 2;

// FRED API endpoints (more reliable than Treasury direct API from Cloudflare)
const FRED_SERIES = {
  debt: 'GFDEBTN',          // Federal Debt: Total Public Debt (Quarterly, Billions)
  fedfunds: 'DFF',          // Effective Federal Funds Rate
  t10y2y: 'T10Y2Y',         // 10-Year minus 2-Year Treasury Spread
  dgs10: 'DGS10',           // 10-Year Treasury Constant Maturity Rate
  dgs2: 'DGS2',             // 2-Year Treasury Constant Maturity Rate
};

async function fetchFredSeries(seriesId: string, apiKey: string, limit: number = 10): Promise<any> {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`[FRED ${seriesId}] OK - got ${data?.observations?.length || 0} records`);
        return data.observations || [];
      }

      console.log(`[FRED ${seriesId}] HTTP ${response.status}`);
    } catch (error: any) {
      console.log(`[FRED ${seriesId}] Error: ${error?.message || 'Unknown'}`);
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 500));
      }
    }
  }

  return [];
}

async function fetchTreasuryData(apiKey: string): Promise<TreasuryData> {
  console.log('[Treasury] Fetching data from FRED API...');

  const [debtData, rateData, spreadData] = await Promise.all([
    fetchFredSeries(FRED_SERIES.debt, apiKey, 20),
    fetchFredSeries(FRED_SERIES.dgs10, apiKey, 15),
    fetchFredSeries(FRED_SERIES.t10y2y, apiKey, 15)
  ]);

  const result: TreasuryData = {
    debt: 0,
    debtHistory: [],
    cash: 0,  // Not available from FRED
    gold: 0,  // Not available from FRED
    interestRate: 0,
    ratesHistory: []
  };

  // Parse debt data (FRED GFDEBTN is in millions, we need actual value)
  if (debtData && debtData.length > 0) {
    const validData = debtData.filter((d: any) => d.value !== '.' && parseFloat(d.value) > 0);
    if (validData.length > 0) {
      result.debt = parseFloat(validData[0].value) * 1000000; // Convert millions to actual
    }
    result.debtHistory = validData
      .map((d: any) => ({ value: parseFloat(d.value) * 1000000 }))
      .reverse();
  }

  // Parse 10-Year Treasury rate
  if (rateData && rateData.length > 0) {
    const validRates = rateData.filter((d: any) => d.value !== '.');
    if (validRates.length > 0) {
      result.interestRate = parseFloat(validRates[0].value);
    }
    result.ratesHistory = validRates
      .map((d: any) => ({ value: parseFloat(d.value) }))
      .filter((d: { value: number }) => !isNaN(d.value))
      .reverse();
  }

  console.log(`[Treasury] Data loaded: debt=${result.debt > 0}, rate=${result.interestRate > 0}`);

  return result;
}

export const GET: APIRoute = async ({ request, url, locals }) => {
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isWarm = url.searchParams.get('warm') === 'true';
  const apiKey = (locals as any)?.runtime?.env?.FRED_API_KEY as string | undefined;

  if (!apiKey) {
    console.error('[Treasury] Missing FRED_API_KEY binding');
  }

  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const kv = getKV(locals);

  // If this is a coordinator warm request, require warm secret header
  if (isWarm) {
    const secret = (locals as any)?.runtime?.env?.WARM_SECRET || (typeof process !== 'undefined' ? (process.env as any)?.WARM_SECRET : undefined);
    const token = request.headers.get('X-Stacknews-Warm') || '';
    if (!secret || token !== String(secret)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
  }

  try {
    // Edge cache fast path (skip when forceRefresh is requested)
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }
    // Check cache first
    const cached = getTreasuryCache();
    const isStale = isTreasuryCacheStale();

    if (cached && !forceRefresh) {
      const cacheAge = Math.round(getTreasuryCacheAge() / 1000);

      // If stale, trigger background refresh
      if (isStale) {
        console.log('[Treasury] Cache stale, refreshing in background');
        if (apiKey) {
          fetchTreasuryData(apiKey).then(data => {
            setTreasuryCache(data);
          }).catch(err => {
            console.error('[Treasury] Background refresh failed:', err);
          });
        }
      }

      const res = new Response(
        JSON.stringify({
          ...cached,
          _cache: {
            hit: true,
            age: cacheAge,
            stale: isStale
          },
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, stale-if-error=86400',
            'X-Cache': 'HIT',
            'X-Cache-Age': String(cacheAge)
          }
        }
      );
      locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
      return res;
    }

    // Cache miss or force refresh
    console.log(`[Treasury] Cache ${cached ? 'force refresh' : 'miss'}`);
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing FRED_API_KEY', message: 'Configure FRED_API_KEY as a Cloudflare secret/binding.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await fetchTreasuryData(apiKey);

    // Store in cache
    setTreasuryCache(data);
    // Store in KV as durable fallback
    await kvPutJSON(kv, 'treasury:v1', { data, ts: Date.now() }, 60 * 60); // 1h TTL

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
    return res;
  } catch (error: any) {
    console.error('[Treasury] Fatal error:', error);

    // Try to return stale cache from memory, then KV
    const cached = getTreasuryCache();
    if (cached) {
      return new Response(
        JSON.stringify({
          ...cached,
          _cache: { hit: true, stale: true, error: true },
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'STALE-ERROR'
          }
        }
      );
    }

    const kvData = await kvGetJSON<{ data: TreasuryData }>(kv, 'treasury:v1');
    if (kvData?.data) {
      return new Response(
        JSON.stringify({
          ...kvData.data,
          _cache: { hit: true, stale: true, error: true, source: 'kv' },
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE-KV' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to fetch treasury data', message: error?.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
