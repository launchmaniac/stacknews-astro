// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// EIA v2 API proxy - comprehensive energy data for petroleum, natural gas, electricity, and nuclear
// Datasets: petroleum, natgas, imports, generation, nuclear, snapshot

import type { APIRoute } from 'astro';
import {
  getEiaPetroleumWeeklyStocks,
  getEiaNatGasWeeklyStorage,
  getEiaCrudeImports,
  getEiaGenerationMix,
  getEiaNuclearOutages,
  getEiaSnapshot
} from '../../lib/eia';
import { getKV, kvGetJSON, kvPutJSON } from '../../lib/kv';

export const prerender = false;

const VALID_DATASETS = ['petroleum', 'natgas', 'imports', 'generation', 'nuclear', 'snapshot'];

export const GET: APIRoute = async ({ request, url, locals }) => {
  const dataset = (url.searchParams.get('dataset') || '').toLowerCase();
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isWarm = url.searchParams.get('warm') === 'true';
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const kv = getKV(locals);
  const apiKey = (locals as any)?.runtime?.env?.EIA_API_KEY as string | undefined;

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
        petroleum: '/api/eia.json?dataset=petroleum - Weekly crude oil stocks',
        natgas: '/api/eia.json?dataset=natgas - Weekly natural gas storage',
        imports: '/api/eia.json?dataset=imports - Crude oil imports by country',
        generation: '/api/eia.json?dataset=generation - Electricity generation mix by fuel type',
        nuclear: '/api/eia.json?dataset=nuclear - Nuclear facility outages',
        snapshot: '/api/eia.json?dataset=snapshot - Aggregated energy metrics for dashboard'
      },
      note: 'All datasets require EIA_API_KEY environment variable'
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

  const KV_KEY = `eia:${dataset}:v2`;

  // Different cache TTLs based on data update frequency
  const cacheTTL: Record<string, number> = {
    petroleum: 3600,    // 1 hour (weekly data)
    natgas: 3600,       // 1 hour (weekly data)
    imports: 86400,     // 24 hours (monthly data)
    generation: 86400,  // 24 hours (monthly data)
    nuclear: 3600,      // 1 hour (daily data)
    snapshot: 1800      // 30 minutes (aggregated)
  };

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    let data: any;
    switch (dataset) {
      case 'petroleum':
        data = await getEiaPetroleumWeeklyStocks(apiKey);
        break;
      case 'natgas':
        data = await getEiaNatGasWeeklyStorage(apiKey);
        break;
      case 'imports':
        data = await getEiaCrudeImports(apiKey);
        break;
      case 'generation':
        data = await getEiaGenerationMix(apiKey);
        break;
      case 'nuclear':
        data = { outages: await getEiaNuclearOutages(apiKey) };
        break;
      case 'snapshot':
        data = await getEiaSnapshot(apiKey);
        break;
    }

    const ttl = cacheTTL[dataset] || 3600;
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
    return new Response(JSON.stringify({ error: 'Failed to fetch EIA data', message: error?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

