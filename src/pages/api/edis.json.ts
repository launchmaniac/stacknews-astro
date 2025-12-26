// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// EDIS API Endpoint - US International Trade Commission Documents
// Serves trade investigation data from EDIS (Electronic Document Information System)

import type { APIRoute } from 'astro';
import {
  fetchEdisSnapshot,
  fetchInvestigations,
  fetchRecentDocuments,
  documentsToFeedItems,
  investigationsToFeedItems,
  type EdisInvestigationType,
  type EdisSnapshot
} from '../../lib/edis';

export const prerender = false;

// In-memory cache
let edisCache: { data: EdisSnapshot | null; timestamp: number } = {
  data: null,
  timestamp: 0
};

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes (EDIS updates less frequently)

function isCacheValid(): boolean {
  return edisCache.data !== null && (Date.now() - edisCache.timestamp) < CACHE_TTL;
}

export const GET: APIRoute = async ({ url, locals }) => {
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const feedType = url.searchParams.get('feed') as 'section337' | 'import-injury' | 'documents' | 'all' | null;
  const investigationType = url.searchParams.get('type') as EdisInvestigationType | null;
  const days = parseInt(url.searchParams.get('days') || '7', 10);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);

  const cache = caches.default;
  const cacheKey = new Request(url.href);

  try {
    // Check edge cache first (skip on force refresh)
    if (!forceRefresh) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    // Check memory cache for full snapshot
    if (!forceRefresh && isCacheValid() && !feedType && !investigationType) {
      const response = new Response(
        JSON.stringify({
          ...edisCache.data,
          _cache: {
            hit: true,
            age: Math.round((Date.now() - edisCache.timestamp) / 1000)
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
            'X-Cache': 'HIT'
          }
        }
      );
      (locals as any)?.runtime?.ctx?.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    let responseData: any;

    // Handle specific feed types
    if (feedType === 'section337') {
      const result = await fetchInvestigations('337', 'active', limit);
      const feedItems = investigationsToFeedItems(result.data, 'USITC SECTION 337', '#f97316');
      responseData = {
        success: result.success,
        feed: 'section337',
        items: feedItems,
        totalCount: result.totalCount,
        timestamp: result.timestamp,
        error: result.error
      };
    } else if (feedType === 'import-injury') {
      // Fetch AD, CVD, and combined investigations
      const [adResult, cvdResult] = await Promise.all([
        fetchInvestigations('AD', 'active', Math.ceil(limit / 2)),
        fetchInvestigations('CVD', 'active', Math.ceil(limit / 2))
      ]);

      const combinedInvestigations = [...adResult.data, ...cvdResult.data]
        .sort((a, b) => {
          const dateA = a.latestActionDate || a.dateInstituted || '';
          const dateB = b.latestActionDate || b.dateInstituted || '';
          return dateB.localeCompare(dateA);
        })
        .slice(0, limit);

      const feedItems = investigationsToFeedItems(combinedInvestigations, 'USITC IMPORT INJURY', '#3b82f6');
      responseData = {
        success: adResult.success || cvdResult.success,
        feed: 'import-injury',
        items: feedItems,
        totalCount: combinedInvestigations.length,
        timestamp: new Date().toISOString(),
        error: adResult.error || cvdResult.error
      };
    } else if (feedType === 'documents') {
      const result = await fetchRecentDocuments(investigationType || undefined, days, limit);
      const feedItems = documentsToFeedItems(result.data, 'USITC DOCUMENTS', '#10b981');
      responseData = {
        success: result.success,
        feed: 'documents',
        items: feedItems,
        totalCount: result.totalCount,
        timestamp: result.timestamp,
        error: result.error
      };
    } else {
      // Full snapshot (default)
      const snapshot = await fetchEdisSnapshot();

      // Update memory cache
      edisCache = {
        data: snapshot,
        timestamp: Date.now()
      };

      responseData = {
        ...snapshot,
        _cache: { hit: false }
      };
    }

    const response = new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800, stale-if-error=86400',
          'X-Cache': 'MISS'
        }
      }
    );

    (locals as any)?.runtime?.ctx?.waitUntil(cache.put(cacheKey, response.clone()));
    return response;

  } catch (error: any) {
    console.error('[EDIS API] Error:', error);

    // Try to return stale cache on error
    if (edisCache.data) {
      return new Response(
        JSON.stringify({
          ...edisCache.data,
          _cache: { hit: true, stale: true, error: true }
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

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch EDIS data',
        message: error?.message || 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
