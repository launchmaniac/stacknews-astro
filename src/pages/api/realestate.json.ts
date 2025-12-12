// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Real Estate and Construction Data API
// Datasets: pipeline, fmr, commercial, affordability, caseshiller, snapshot

import type { APIRoute } from 'astro';
import {
  getConstructionPipeline,
  getConstructionByType,
  getFairMarketRents,
  getMultiMetroFMR,
  getCommercialRealEstateIndex,
  getHousingAffordabilityIndex,
  getCaseShillerIndex,
  getRealEstateSnapshot
} from '../../lib/realestate';
import { getKV, kvGetJSON, kvPutJSON } from '../../lib/kv';

export const prerender = false;

const VALID_DATASETS = ['pipeline', 'pipeline-type', 'fmr', 'fmr-metros', 'commercial', 'affordability', 'caseshiller', 'snapshot'];

export const GET: APIRoute = async ({ request, url, locals }) => {
  const dataset = (url.searchParams.get('dataset') || '').toLowerCase();
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isWarm = url.searchParams.get('warm') === 'true';
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const kv = getKV(locals);
  const fredApiKey = (locals as any)?.runtime?.env?.FRED_API_KEY as string | undefined;

  if (isWarm) {
    const secret = (locals as any)?.runtime?.env?.WARM_SECRET || (typeof process !== 'undefined' ? (process.env as any)?.WARM_SECRET : undefined);
    const token = request.headers.get('X-Stacknews-Warm') || '';
    if (!secret || token !== String(secret)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // Return usage info if no dataset specified
  if (!dataset) {
    return new Response(JSON.stringify({
      availableDatasets: VALID_DATASETS,
      usage: {
        pipeline: '/api/realestate.json?dataset=pipeline - Construction pipeline (Permits, Starts, Completions)',
        'pipeline-type': '/api/realestate.json?dataset=pipeline-type - Single-family vs Multi-family breakdown',
        fmr: '/api/realestate.json?dataset=fmr&entity=METRO35620M35620 - Fair Market Rents for specific metro',
        'fmr-metros': '/api/realestate.json?dataset=fmr-metros - FMR for top 10 metros',
        commercial: '/api/realestate.json?dataset=commercial - Commercial Real Estate Price Index (FRED)',
        affordability: '/api/realestate.json?dataset=affordability - Housing Affordability Index (FRED)',
        caseshiller: '/api/realestate.json?dataset=caseshiller - Case-Shiller Home Price Index (FRED)',
        snapshot: '/api/realestate.json?dataset=snapshot - Aggregated dashboard metrics'
      },
      sources: {
        construction: 'FRED (PERMIT, HOUST, COMPUTSA series from Census Bureau)',
        fmr: 'HUD Fair Market Rents API (requires HUD API token)',
        pricing: 'FRED (requires FRED_API_KEY for all datasets)'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=3600' }
    });
  }

  if (!VALID_DATASETS.includes(dataset)) {
    return new Response(JSON.stringify({
      error: `Invalid dataset; use one of: ${VALID_DATASETS.join(', ')}`
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const KV_KEY = `realestate:${dataset}:v1`;

  // Different cache TTLs based on data update frequency
  const cacheTTL: Record<string, number> = {
    pipeline: 86400,       // 24 hours (monthly data)
    'pipeline-type': 86400,
    fmr: 604800,           // 1 week (annual data)
    'fmr-metros': 604800,
    commercial: 86400,     // 24 hours (quarterly data)
    affordability: 86400,
    caseshiller: 86400,
    snapshot: 43200        // 12 hours (aggregated)
  };

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    let data: any;
    switch (dataset) {
      case 'pipeline':
        data = await getConstructionPipeline(fredApiKey, 24);
        break;
      case 'pipeline-type':
        data = await getConstructionByType(fredApiKey, 24);
        break;
      case 'fmr': {
        const entityId = url.searchParams.get('entity') || 'METRO35620M35620'; // Default: NY Metro
        const year = parseInt(url.searchParams.get('year') || '') || new Date().getFullYear();
        data = await getFairMarketRents(entityId, year);
        if (!data) {
          return new Response(JSON.stringify({ error: 'FMR data not found for entity' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        break;
      }
      case 'fmr-metros':
        data = { metros: await getMultiMetroFMR() };
        break;
      case 'commercial':
        data = await getCommercialRealEstateIndex(fredApiKey, 20);
        break;
      case 'affordability':
        data = await getHousingAffordabilityIndex(fredApiKey);
        break;
      case 'caseshiller':
        data = await getCaseShillerIndex(fredApiKey);
        break;
      case 'snapshot':
        data = await getRealEstateSnapshot(fredApiKey);
        break;
    }

    const ttl = cacheTTL[dataset] || 86400;
    const res = new Response(
      JSON.stringify({ ...data, dataset, _cache: { hit: false }, timestamp: new Date().toISOString() }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 2}, stale-if-error=86400`,
          'X-Cache': 'MISS'
        }
      }
    );
    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, KV_KEY, { data, ts: Date.now() }, ttl * 2));
    return res;
  } catch (error: any) {
    const kvData = await kvGetJSON<{ data: any }>(kv, KV_KEY);
    if (kvData?.data) {
      return new Response(
        JSON.stringify({ ...kvData.data, dataset, _cache: { hit: true, stale: true, error: true, source: 'kv' }, timestamp: new Date().toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE-KV' } }
      );
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch real estate data', message: error?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
