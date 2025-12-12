// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// ArXiv Scientific Research API
// Latest preprints from arXiv.org in finance, AI, physics, and quantum computing

import type { APIRoute } from 'astro';
import {
  getArxivByPreset,
  getArxivByCategories,
  searchArxiv,
  getArxivSnapshot,
  ARXIV_QUERY_PRESETS
} from '../../lib/arxiv';
import { getKV, kvGetJSON, kvPutJSON } from '../../lib/kv';

export const prerender = false;

const VALID_PRESETS = Object.keys(ARXIV_QUERY_PRESETS);

export const GET: APIRoute = async ({ request, url, locals }) => {
  const preset = url.searchParams.get('preset')?.toUpperCase();
  const categories = url.searchParams.get('categories')?.split(',');
  const search = url.searchParams.get('search');
  const maxResults = Math.max(5, Math.min(100, Number(url.searchParams.get('max') || 25)));
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

  // Return usage info if no params
  if (!preset && !categories && !search) {
    return new Response(JSON.stringify({
      availablePresets: VALID_PRESETS,
      presetDescriptions: Object.fromEntries(
        Object.entries(ARXIV_QUERY_PRESETS).map(([key, val]) => [key, val.description])
      ),
      usage: {
        byPreset: '/api/arxiv.json?preset=FINANCE_QUANT - Get papers by preset category',
        byCategories: '/api/arxiv.json?categories=q-fin.ST,econ.EM - Get papers by specific categories',
        bySearch: '/api/arxiv.json?search=neural+network - Search papers by keyword',
        snapshot: '/api/arxiv.json?preset=SNAPSHOT - Get latest across all major categories',
        combined: '/api/arxiv.json?search=crypto&categories=cs.CR - Search within categories'
      },
      parameters: {
        max: 'Maximum results (5-100, default 25)',
        refresh: 'Force cache refresh (true/false)'
      },
      categoryCodes: {
        'q-fin.*': 'Quantitative Finance (ST=Statistical, RM=Risk, PM=Portfolio, MF=Mathematical)',
        'econ.*': 'Economics (EM=Econometrics, GN=General, TH=Theoretical)',
        'cs.AI': 'Artificial Intelligence',
        'cs.LG': 'Machine Learning',
        'cs.CR': 'Cryptography & Security',
        'cs.CL': 'Computational Linguistics / NLP',
        'nucl-th': 'Nuclear Theory',
        'quant-ph': 'Quantum Physics',
        'astro-ph': 'Astrophysics'
      },
      note: 'ArXiv papers are preprints (not yet peer-reviewed). Use for cutting-edge research intelligence.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=3600' }
    });
  }

  // Determine KV key
  let kvKey: string;
  if (preset === 'SNAPSHOT') {
    kvKey = 'arxiv:snapshot:v1';
  } else if (preset) {
    kvKey = `arxiv:preset:${preset}:${maxResults}:v1`;
  } else if (categories) {
    kvKey = `arxiv:cats:${categories.join('-')}:${maxResults}:v1`;
  } else {
    kvKey = `arxiv:search:${encodeURIComponent(search || '')}:${maxResults}:v1`;
  }

  const cacheTTL = 1800; // 30 minutes for research papers

  try {
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    let data: any;

    if (preset === 'SNAPSHOT') {
      // Return snapshot across all categories
      data = await getArxivSnapshot();
      data.dataset = 'snapshot';
    } else if (preset) {
      if (!VALID_PRESETS.includes(preset)) {
        return new Response(JSON.stringify({
          error: `Invalid preset. Use one of: ${VALID_PRESETS.join(', ')}`
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const papers = await getArxivByPreset(preset as keyof typeof ARXIV_QUERY_PRESETS, maxResults);
      const config = ARXIV_QUERY_PRESETS[preset as keyof typeof ARXIV_QUERY_PRESETS];
      data = {
        preset,
        description: config.description,
        categories: config.categories,
        papers,
        count: papers.length,
        dataset: 'preset'
      };
    } else if (categories && categories.length > 0) {
      const papers = await getArxivByCategories(categories, maxResults);
      data = {
        categories,
        papers,
        count: papers.length,
        dataset: 'categories'
      };
    } else if (search) {
      const papers = await searchArxiv(search, categories, maxResults);
      data = {
        query: search,
        categories: categories || [],
        papers,
        count: papers.length,
        dataset: 'search'
      };
    } else {
      // Fallback: return finance preset
      const papers = await getArxivByPreset('FINANCE_QUANT', maxResults);
      data = {
        preset: 'FINANCE_QUANT',
        description: ARXIV_QUERY_PRESETS.FINANCE_QUANT.description,
        papers,
        count: papers.length,
        dataset: 'default'
      };
    }

    const res = new Response(
      JSON.stringify({ ...data, _cache: { hit: false }, timestamp: new Date().toISOString() }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, s-maxage=${cacheTTL}, stale-while-revalidate=${cacheTTL * 2}, stale-if-error=86400`,
          'X-Cache': 'MISS'
        }
      }
    );

    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
    locals?.runtime?.ctx?.waitUntil(kvPutJSON(kv, kvKey, { data, ts: Date.now() }, cacheTTL * 2));
    return res;
  } catch (error: any) {
    const kvData = await kvGetJSON<{ data: any }>(kv, kvKey);
    if (kvData?.data) {
      return new Response(
        JSON.stringify({ ...kvData.data, _cache: { hit: true, stale: true, error: true, source: 'kv' }, timestamp: new Date().toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE-KV' } }
      );
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch ArXiv papers', message: error?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
