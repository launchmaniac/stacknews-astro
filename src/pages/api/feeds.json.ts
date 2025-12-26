// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Server-side feed API with category-based caching
// Handles Cloudflare Workers 50 subrequest limit by fetching one category at a time

import type { APIRoute } from 'astro';
import type { RSSItem, FeedConfig } from '../../lib/types';
import { FEEDS } from '../../lib/constants';
import {
  getFeedCache,
  setFeedCache,
  isFeedCacheStale,
  getFeedCacheAge,
  FEED_CATEGORIES
} from '../../lib/cache';
import { getKV, kvGetJSON, kvPutJSON } from '../../lib/kv';

// Coordinator client (Durable Object-backed via external Worker URL)
async function claimNextCategory(locals: any, ttlSeconds: number = 60): Promise<{ category: string | null; lockId?: string } | null> {
  try {
    const svc = (locals?.runtime?.env as any)?.COORDINATOR;
    if (!svc?.fetch) return null; // Service Binding required; no public fallback
    const secret = (locals as any)?.runtime?.env?.WARM_SECRET || (typeof process !== 'undefined' ? (process.env as any)?.WARM_SECRET : undefined);
    const res = await svc.fetch('https://do.internal/claim-next', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-Stacknews-Warm': String(secret) } : {})
      },
      body: JSON.stringify({ ttlSeconds })
    });
    if (!res.ok) {
      console.log(`[Coordinator] claim-next failed: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}

async function markCategoryRefreshed(locals: any, category: string): Promise<void> {
  try {
    const svc = (locals?.runtime?.env as any)?.COORDINATOR;
    if (!svc?.fetch) return; // Service Binding required; no public fallback
    const secret = (locals as any)?.runtime?.env?.WARM_SECRET || (typeof process !== 'undefined' ? (process.env as any)?.WARM_SECRET : undefined);
    const res = await svc.fetch('https://do.internal/mark-refreshed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-Stacknews-Warm': String(secret) } : {})
      },
      body: JSON.stringify({ category })
    });
    if (!res?.ok) {
      console.log(`[Coordinator] mark-refreshed failed: ${res?.status}`);
    }
  } catch {}
}

export const prerender = false;

const FETCH_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 1; // Reduce retries to stay under limits

// Parse RSS/Atom XML content
// Lightweight XML parsing helpers (no external deps)
function decodeEntities(text: string): string {
  if (!text) return text;
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xml.match(re);
  if (!m) return '';
  const inner = m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  return decodeEntities(inner.trim());
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*${attr}=["']([^"']*)["']`, 'i');
  const m = xml.match(re);
  return m ? decodeEntities(m[1]) : '';
}

function extractAll(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const vals: string[] = [];
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = re.exec(xml)) !== null) {
    const inner = match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
    vals.push(decodeEntities(inner.trim()));
  }
  return vals;
}

function normalizeUrl(url: string): string {
  try {
    if (!url) return url;
    const u = new URL(url, 'https://dummy.base');
    u.hash = '';
    // strip common tracking params
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','gclid','fbclid'].forEach(p => u.searchParams.delete(p));
    return u.href.replace('https://dummy.base', '');
  } catch {
    return url;
  }
}

function parseRSSContent(contents: string, feedName: string, feedColor: string): RSSItem[] {
  const items: RSSItem[] = [];

  const itemRegex = /<item\b[\s\S]*?<\/item>/gi; // RSS
  const entryRegex = /<entry\b[\s\S]*?<\/entry>/gi; // Atom
  const matches = [
    ...(contents.match(itemRegex) || []),
    ...(contents.match(entryRegex) || [])
  ];

  for (const itemXml of matches) {
    const title = extractTag(itemXml, 'title') || 'Untitled';

    // Atom link preference: rel="alternate" href, then any href, else inner text
    let link = extractAttr(itemXml, 'link', 'href');
    if (!link) {
      // try rel alternate
      const relAlt = itemXml.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)/i);
      link = relAlt ? decodeEntities(relAlt[1]) : '';
    }
    if (!link) link = extractTag(itemXml, 'link');
    link = normalizeUrl(link);

    const pubDate = extractTag(itemXml, 'pubDate')
      || extractTag(itemXml, 'updated')
      || extractTag(itemXml, 'published')
      || extractTag(itemXml, 'dc:date')
      || new Date().toISOString();

    const description = extractTag(itemXml, 'description') || extractTag(itemXml, 'summary');

    const content = extractTag(itemXml, 'content:encoded')
      || extractTag(itemXml, 'content')
      || description;

    const thumbnail = extractAttr(itemXml, 'media:content', 'url')
      || extractAttr(itemXml, 'media:thumbnail', 'url')
      || extractAttr(itemXml, 'enclosure', 'url');

    // Authors: Atom <author><name>, RSS <author>, Dublin Core
    const authorName = extractTag(itemXml, 'author')
      || extractTag(itemXml, 'dc:creator')
      || extractTag(itemXml, 'name')
      || feedName;

    // Categories (collect both text and term attribute)
    const catTexts = extractAll(itemXml, 'category');
    const catTerms = Array.from(itemXml.matchAll(/<category[^>]*term=["']([^"']+)["'][^>]*\/?>(?:<\/category>)?/gi)).map(m => decodeEntities(m[1]));

    const guid = extractTag(itemXml, 'guid') || extractTag(itemXml, 'id') || link || Math.random().toString();

    items.push({
      title,
      link,
      pubDate,
      description,
      guid,
      author: authorName,
      thumbnail,
      content,
      enclosure: {},
      categories: [...new Set([...catTexts, ...catTerms].filter(Boolean))],
      sourceName: feedName,
      color: feedColor
    });
  }

  return items;
}

// Check if a feed URL is an internal API endpoint
function isInternalApiUrl(url: string): boolean {
  return url.startsWith('/api/') || url.startsWith('./api/');
}

// Fetch items from internal API endpoint (like EDIS)
async function fetchInternalApiFeed(
  config: FeedConfig
): Promise<{ feedId: string; items: RSSItem[]; error: boolean; errorMsg?: string }> {
  try {
    // Use full URL for internal API calls
    const response = await fetch(new URL(config.url, 'https://stacknews.org').href, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      return { feedId: config.id, items: [], error: true, errorMsg: `HTTP ${response.status}` };
    }

    const data = await response.json();

    // API feeds return items in a specific format
    if (data.items && Array.isArray(data.items)) {
      const items: RSSItem[] = data.items.map((item: any) => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate || new Date().toISOString(),
        description: item.description || '',
        guid: item.id || item.link || Math.random().toString(),
        author: item.sourceName || config.name,
        thumbnail: '',
        content: item.description || '',
        enclosure: {},
        categories: [item.category || config.category],
        sourceName: config.name,
        color: config.color
      }));
      return { feedId: config.id, items, error: false };
    }

    return { feedId: config.id, items: [], error: true, errorMsg: 'Invalid API response format' };
  } catch (error: any) {
    return { feedId: config.id, items: [], error: true, errorMsg: error?.message || 'Unknown error' };
  }
}

// Fetch single feed with retry logic
async function fetchSingleFeed(
  config: FeedConfig,
  locals?: any
): Promise<{ feedId: string; items: RSSItem[]; error: boolean; errorMsg?: string }> {
  // Handle internal API feeds differently
  if (isInternalApiUrl(config.url)) {
    return fetchInternalApiFeed(config);
  }

  const kv = getKV(locals);
  let lastError = '';
  const metaKey = `feedmeta:${config.id}`;
  const dataKey = `feeddata:${config.id}`;

  // Load conditional headers from KV (mutable so we can clear on 304 with missing data)
  let meta = await kvGetJSON<{ etag?: string; lastModified?: string }>(kv, metaKey);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      const headers: Record<string, string> = {
        'User-Agent': 'StackNews/2.0 (+https://stacknews.org)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
      };
      if (meta?.etag) headers['If-None-Match'] = meta.etag;
      if (meta?.lastModified) headers['If-Modified-Since'] = meta.lastModified;

      const response = await fetch(config.url, {
        signal: controller.signal,
        headers
      });

      clearTimeout(timeout);

      // Reuse previous parsed items on 304
      if (response.status === 304) {
        const cached = await kvGetJSON<RSSItem[]>(kv, dataKey);
        if (cached && cached.length > 0) {
          return { feedId: config.id, items: cached, error: false };
        }
        // No stored items - clear conditional headers so next attempt fetches fresh
        // This can happen when KV data expired but meta headers remain valid
        await kvPutJSON(kv, metaKey, {}, 1); // Clear meta in KV with 1s TTL
        meta = null; // Clear local reference so next retry doesn't send conditional headers
        lastError = 'Not Modified, no cached data';
        continue;
      }

      if (!response.ok) {
        lastError = `HTTP ${response.status}`;
        if (response.status === 403 || response.status === 401 || response.status === 404) {
          break; // Don't retry client errors
        }
        // Respect Retry-After when 429
        if (response.status === 429) {
          const ra = response.headers.get('retry-after');
          let waitMs = 1000;
          if (ra) {
            const s = Number(ra);
            if (!isNaN(s)) waitMs = Math.min(5000, Math.max(1000, s * 1000));
          }
          await new Promise(r => setTimeout(r, waitMs));
        } else if (response.status >= 500) {
          // Exponential backoff for 5xx
          const backoff = Math.min(5000, Math.pow(2, attempt) * 500 + Math.floor(Math.random() * 250));
          await new Promise(r => setTimeout(r, backoff));
        }
        continue;
      }

      const contents = await response.text();
      const items = parseRSSContent(contents, config.name, config.color);

      if (items.length > 0) {
        // Persist response metadata and parsed items to KV
        const etag = response.headers.get('etag') || undefined;
        const lastModified = response.headers.get('last-modified') || undefined;
        await kvPutJSON(kv, dataKey, items, 60 * 10); // 10m TTL per feed content
        await kvPutJSON(kv, metaKey, { etag, lastModified }, 60 * 60 * 12); // 12h TTL for meta
        return { feedId: config.id, items, error: false };
      } else {
        // Fallback to previous KV items if any
        const cached = await kvGetJSON<RSSItem[]>(kv, dataKey);
        if (cached && cached.length > 0) {
          return { feedId: config.id, items: cached, error: false };
        }
        lastError = 'No items parsed';
      }
    } catch (error: any) {
      clearTimeout(timeout);
      lastError = error?.name === 'AbortError' ? 'Timeout' : (error?.message || 'Unknown');
    }
  }

  console.error(`[Feed ${config.id}] FAILED: ${lastError}`);
  return { feedId: config.id, items: [], error: true, errorMsg: lastError };
}

// Fetch feeds for a single category (stays under 50 subrequest limit)
async function fetchCategoryFeeds(category: string, locals: any): Promise<{
  feeds: Record<string, RSSItem[]>;
  errors: string[];
}> {
  const feedsToFetch = FEEDS.filter(f => f.category === category);

  console.log(`[API] Fetching ${feedsToFetch.length} feeds for category: ${category}`);

  // Per-host concurrency limiter
  const HOST_LIMIT = 3;
  const queue = feedsToFetch.map(feed => ({ feed, host: (() => { try { return new URL(feed.url).host; } catch { return 'unknown'; } })() }));
  const running = new Set<Promise<{ idx: number; result: Awaited<ReturnType<typeof fetchSingleFeed>> }>>();
  const inFlightPerHost = new Map<string, number>();
  const results: Array<{ feedId: string; items: RSSItem[]; error: boolean; errorMsg?: string }> = [];

  async function startNext(): Promise<boolean> {
    for (let i = 0; i < queue.length; i++) {
      const { feed, host } = queue[i];
      const n = inFlightPerHost.get(host) || 0;
      if (n < HOST_LIMIT) {
        queue.splice(i, 1);
        inFlightPerHost.set(host, n + 1);
        const p = (async () => {
          const r = await fetchSingleFeed(feed, locals);
          return { idx: results.length, result: r };
        })();
        running.add(p);
        p.finally(() => {
          running.delete(p);
          inFlightPerHost.set(host, (inFlightPerHost.get(host) || 1) - 1);
        });
        return true;
      }
    }
    return false;
  }

  // Prime initial tasks
  while (await startNext()) {}

  while (running.size > 0 || queue.length > 0) {
    if (running.size === 0) {
      // No running tasks but items remain; try to start more
      await startNext();
      continue;
    }
    const settled = await Promise.race(Array.from(running));
    results.push(settled.result);
    // Try to start more after one completes
    await startNext();
  }

  const feeds: Record<string, RSSItem[]> = {};
  const errors: string[] = [];

  for (const r of results) {
    if (!r.error) {
      feeds[r.feedId] = r.items;
    } else {
      errors.push(`${r.feedId}: ${r.errorMsg}`);
    }
  }

  console.log(`[API] Category ${category}: ${Object.keys(feeds).length}/${feedsToFetch.length} feeds OK`);

  return { feeds, errors };
}

// Build global stream from feeds
function buildStream(feeds: Record<string, RSSItem[]>, limit: number = 400): RSSItem[] {
  const allItems: RSSItem[] = [];

  for (const items of Object.values(feeds)) {
    allItems.push(...items);
  }

  const unique = Array.from(
    new Map(allItems.map(item => [item.link || item.guid, item])).values()
  );

  return unique
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit);
}

export const GET: APIRoute = async ({ request, url, locals }) => {
  const requestedCategory = url.searchParams.get('category') || 'ALL';
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isWarm = url.searchParams.get('warm') === 'true';
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);

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
    // Single category request - simple case
    if (requestedCategory !== 'ALL') {
      const cached = getFeedCache(requestedCategory);
      const isStale = isFeedCacheStale(requestedCategory);

      if (cached && !forceRefresh && !isStale) {
        const res = new Response(
          JSON.stringify({
            ...cached,
            _cache: { hit: true, age: Math.round(getFeedCacheAge(requestedCategory) / 1000), category: requestedCategory },
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'X-Cache': 'HIT',
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, stale-if-error=86400'
            }
          }
        );
        locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
        return res;
      }

      // Fetch this category
      const data = await fetchCategoryFeeds(requestedCategory, locals);
      const stream = buildStream(data.feeds);

      setFeedCache(requestedCategory, { feeds: data.feeds, stream });
      // Persist category aggregate to KV as fallback (1 hour TTL for persistent storage)
      const kv = getKV(locals);
      await kvPutJSON(kv, `categorydata:${requestedCategory}`, { feeds: data.feeds, stream, ts: Date.now() }, 60 * 60);

      const res = new Response(
        JSON.stringify({
          feeds: data.feeds,
          stream,
          errors: data.errors.length > 0 ? data.errors : undefined,
          _cache: { hit: false, category: requestedCategory },
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'MISS',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, stale-if-error=86400'
          }
        }
      );
      locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
      return res;
    }

    // ALL categories request - aggregate from cache, refresh one category
    const allFeeds: Record<string, RSSItem[]> = {};
    const allErrors: string[] = [];
    let refreshedCategory: string | null = null;

    // Find which category needs refresh via Coordinator (fallback to local order)
        let categoryToRefresh: string | null = null;
        if (forceRefresh) {
          categoryToRefresh = FEED_CATEGORIES[0];
        } else {
          const claimed = await claimNextCategory(locals, 60);
          // Fallback: ensure at least one category refreshes when coordinator is unavailable
          categoryToRefresh = claimed?.category || FEED_CATEGORIES[0];
        }

    // Get KV reference for category storage
    const kv = getKV(locals);

    // Refresh one category (stays under subrequest limit)
    if (categoryToRefresh) {
      console.log(`[API] Refreshing category: ${categoryToRefresh}`);
      const data = await fetchCategoryFeeds(categoryToRefresh, locals);
      setFeedCache(categoryToRefresh, { feeds: data.feeds, stream: buildStream(data.feeds) });
      // 1 hour TTL for KV storage (persistent fallback after worker restart)
      await kvPutJSON(kv, `categorydata:${categoryToRefresh}`, { feeds: data.feeds, ts: Date.now() }, 60 * 60);
      refreshedCategory = categoryToRefresh;
      // notify coordinator (non-blocking)
      markCategoryRefreshed(locals, categoryToRefresh).catch(() => {});

      Object.assign(allFeeds, data.feeds);
      allErrors.push(...data.errors);
    }

    // Aggregate all cached categories (fallback to KV if memory empty)
    for (const cat of FEED_CATEGORIES) {
      if (cat === categoryToRefresh) continue; // Already added above

      const cached = getFeedCache(cat);
      if (cached) {
        Object.assign(allFeeds, cached.feeds);
      } else {
        // Fallback to KV when in-memory cache is empty (e.g., after worker restart)
        const kvCat = await kvGetJSON<{ feeds: Record<string, RSSItem[]> }>(kv, `categorydata:${cat}`);
        if (kvCat?.feeds) {
          Object.assign(allFeeds, kvCat.feeds);
          // Restore to in-memory cache for subsequent requests
          setFeedCache(cat, { feeds: kvCat.feeds, stream: buildStream(kvCat.feeds) });
        }
      }
    }

    const stream = buildStream(allFeeds);

    const res = new Response(
      JSON.stringify({
        feeds: allFeeds,
        stream,
        errors: allErrors.length > 0 ? allErrors : undefined,
        _cache: {
          hit: !refreshedCategory,
          refreshed: refreshedCategory,
          totalFeeds: Object.keys(allFeeds).length
        },
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': refreshedCategory ? 'PARTIAL' : 'HIT',
          // 5 minute edge cache with 10 minute stale-while-revalidate
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, stale-if-error=86400'
        }
      }
    );
    locals?.runtime?.ctx?.waitUntil(cache.put(cacheKey, res.clone()));
    return res;

  } catch (error: any) {
    console.error(`[API] Fatal error:`, error);

    return new Response(
      JSON.stringify({ error: 'Failed to fetch feeds', message: error?.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
