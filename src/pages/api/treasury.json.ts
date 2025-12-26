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
  // Core Treasury
  debt: 'GFDEBTN',          // Federal Debt: Total Public Debt (Quarterly, Millions)
  cash: 'WDTGAL',           // Treasury General Account - Wednesday Level (Weekly, Millions)
  fedfunds: 'DFF',          // Effective Federal Funds Rate (Daily)
  t10y2y: 'T10Y2Y',         // 10-Year minus 2-Year Treasury Spread
  dgs10: 'DGS10',           // 10-Year Treasury Constant Maturity Rate
  dgs2: 'DGS2',             // 2-Year Treasury Constant Maturity Rate

  // Macro Indicators (Full Economic Suite)
  mortgage30: 'MORTGAGE30US',  // 30-Year Fixed Mortgage Rate (Weekly)
  consumerSent: 'UMCSENT',     // Consumer Sentiment Index (Monthly)
  housingStarts: 'HOUST',      // Housing Starts (Monthly, Thousands)
  indProd: 'INDPRO',           // Industrial Production Index (Monthly)
  retailSales: 'RSAFS',        // Retail Sales (Monthly, Millions)
  gdp: 'GDPC1',                // Real GDP (Quarterly, Billions)
  tradeBalance: 'BOPGSTB',     // Trade Balance (Monthly, Millions)
  m2: 'M2SL',                  // M2 Money Supply (Weekly, Billions)
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

// Helper to parse FRED observation with change calculation
function parseFredValue(data: any[], multiplier: number = 1): { value: number; change: number } | null {
  if (!data || data.length === 0) return null;
  const valid = data.filter((d: any) => d.value !== '.' && !isNaN(parseFloat(d.value)));
  if (valid.length === 0) return null;

  const current = parseFloat(valid[0].value) * multiplier;
  let change = 0;

  if (valid.length > 1) {
    const prev = parseFloat(valid[1].value) * multiplier;
    if (prev !== 0) {
      change = ((current - prev) / Math.abs(prev)) * 100;
    }
  }

  return { value: current, change: Math.round(change * 100) / 100 };
}

interface MacroIndicators {
  fedFundsRate: { value: number; change: number } | null;
  mortgageRate: { value: number; change: number } | null;
  consumerSentiment: { value: number; change: number } | null;
  housingStarts: { value: number; change: number } | null;
  industrialProduction: { value: number; change: number } | null;
  retailSales: { value: number; change: number } | null;
  gdp: { value: number; change: number } | null;
  tradeBalance: { value: number; change: number } | null;
  m2MoneySupply: { value: number; change: number } | null;
}

async function fetchMacroIndicators(apiKey: string): Promise<MacroIndicators> {
  console.log('[Treasury] Fetching macro indicators from FRED...');

  const [
    fedFundsData,
    mortgageData,
    sentimentData,
    housingData,
    indProdData,
    retailData,
    gdpData,
    tradeData,
    m2Data
  ] = await Promise.all([
    fetchFredSeries(FRED_SERIES.fedfunds, apiKey, 5),
    fetchFredSeries(FRED_SERIES.mortgage30, apiKey, 5),
    fetchFredSeries(FRED_SERIES.consumerSent, apiKey, 3),
    fetchFredSeries(FRED_SERIES.housingStarts, apiKey, 3),
    fetchFredSeries(FRED_SERIES.indProd, apiKey, 3),
    fetchFredSeries(FRED_SERIES.retailSales, apiKey, 3),
    fetchFredSeries(FRED_SERIES.gdp, apiKey, 3),
    fetchFredSeries(FRED_SERIES.tradeBalance, apiKey, 3),
    fetchFredSeries(FRED_SERIES.m2, apiKey, 5)
  ]);

  return {
    fedFundsRate: parseFredValue(fedFundsData),
    mortgageRate: parseFredValue(mortgageData),
    consumerSentiment: parseFredValue(sentimentData),
    housingStarts: parseFredValue(housingData),  // Thousands of units
    industrialProduction: parseFredValue(indProdData),  // Index
    retailSales: parseFredValue(retailData, 0.001),  // Convert millions to billions
    gdp: parseFredValue(gdpData),  // Already in billions
    tradeBalance: parseFredValue(tradeData, 0.001),  // Convert millions to billions
    m2MoneySupply: parseFredValue(m2Data)  // Already in billions
  };
}

async function fetchTreasuryData(apiKey: string): Promise<TreasuryData & { macro: MacroIndicators; cashHistoricalAvg?: number }> {
  console.log('[Treasury] Fetching data from FRED API...');

  // Fetch core treasury data and macro indicators in parallel
  // Get 52 weeks of cash data for 1-year historical average
  const [debtData, cashData, rateData, spreadData, macro] = await Promise.all([
    fetchFredSeries(FRED_SERIES.debt, apiKey, 20),
    fetchFredSeries(FRED_SERIES.cash, apiKey, 52),
    fetchFredSeries(FRED_SERIES.dgs10, apiKey, 15),
    fetchFredSeries(FRED_SERIES.t10y2y, apiKey, 15),
    fetchMacroIndicators(apiKey)
  ]);

  const result: TreasuryData & { macro: MacroIndicators; cashHistoricalAvg?: number } = {
    debt: 0,
    debtHistory: [],
    cash: 0,
    gold: 0,  // Not available from FRED
    interestRate: 0,
    ratesHistory: [],
    macro,
    cashHistoricalAvg: undefined
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

  // Parse Treasury General Account (TGA) cash balance
  // FRED WDTGAL is in millions, convert to actual dollars
  if (cashData && cashData.length > 0) {
    const validCash = cashData.filter((d: any) => d.value !== '.' && parseFloat(d.value) > 0);
    if (validCash.length > 0) {
      result.cash = parseFloat(validCash[0].value) * 1000000; // Convert millions to actual

      // Calculate 52-week historical average
      const cashValues = validCash.map((d: any) => parseFloat(d.value) * 1000000);
      const sum = cashValues.reduce((a: number, b: number) => a + b, 0);
      result.cashHistoricalAvg = Math.round(sum / cashValues.length);
    }
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

  console.log(`[Treasury] Data loaded: debt=${result.debt > 0}, cash=${result.cash > 0}, rate=${result.interestRate > 0}, macro=${Object.keys(macro).filter(k => (macro as any)[k] !== null).length} indicators`);

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
