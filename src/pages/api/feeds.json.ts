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
  getNextCategoryToRefresh,
  FEED_CATEGORIES
} from '../../lib/cache';

export const prerender = false;

const FETCH_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 1; // Reduce retries to stay under limits

// Parse RSS/Atom XML content
function parseRSSContent(contents: string, feedName: string, feedColor: string): RSSItem[] {
  const items: RSSItem[] = [];

  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;

  const matches = [...contents.matchAll(itemRegex), ...contents.matchAll(entryRegex)];

  for (const match of matches) {
    const itemXml = match[1];

    const getTag = (tag: string): string => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const m = itemXml.match(regex);
      return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
    };

    const getAttr = (tag: string, attr: string): string => {
      const regex = new RegExp(`<${tag}[^>]*${attr}=["']([^"']*)["']`, 'i');
      const m = itemXml.match(regex);
      return m ? m[1] : '';
    };

    let link = getTag('link') || getAttr('link', 'href');
    const pubDate = getTag('pubDate') || getTag('updated') || getTag('published') || new Date().toISOString();
    const description = getTag('description') || getTag('summary');
    const content = getTag('content:encoded') || getTag('content') || description;
    const thumbnail = getAttr('media:content', 'url') || getAttr('media:thumbnail', 'url') || getAttr('enclosure', 'url');

    items.push({
      title: getTag('title') || 'Untitled',
      link,
      pubDate,
      description,
      guid: getTag('guid') || getTag('id') || link || Math.random().toString(),
      author: getTag('author') || getTag('dc:creator') || feedName,
      thumbnail,
      content,
      enclosure: {},
      categories: [],
      sourceName: feedName,
      color: feedColor
    });
  }

  return items;
}

// Fetch single feed with retry logic
async function fetchSingleFeed(
  config: FeedConfig
): Promise<{ feedId: string; items: RSSItem[]; error: boolean; errorMsg?: string }> {
  let lastError = '';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      const response = await fetch(config.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'StackNews/2.0 (+https://stacknews.org)',
          'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
        }
      });

      clearTimeout(timeout);

      if (!response.ok) {
        lastError = `HTTP ${response.status}`;
        if (response.status === 403 || response.status === 401 || response.status === 404) {
          break; // Don't retry client errors
        }
        continue;
      }

      const contents = await response.text();
      const items = parseRSSContent(contents, config.name, config.color);

      if (items.length > 0) {
        return { feedId: config.id, items, error: false };
      } else {
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
async function fetchCategoryFeeds(category: string): Promise<{
  feeds: Record<string, RSSItem[]>;
  errors: string[];
}> {
  const feedsToFetch = FEEDS.filter(f => f.category === category);

  console.log(`[API] Fetching ${feedsToFetch.length} feeds for category: ${category}`);

  const results = await Promise.allSettled(
    feedsToFetch.map(feed => fetchSingleFeed(feed))
  );

  const feeds: Record<string, RSSItem[]> = {};
  const errors: string[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      if (!result.value.error) {
        feeds[result.value.feedId] = result.value.items;
      } else {
        errors.push(`${result.value.feedId}: ${result.value.errorMsg}`);
      }
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

export const GET: APIRoute = async ({ url }) => {
  const requestedCategory = url.searchParams.get('category') || 'ALL';
  const forceRefresh = url.searchParams.get('refresh') === 'true';

  try {
    // Single category request - simple case
    if (requestedCategory !== 'ALL') {
      const cached = getFeedCache(requestedCategory);
      const isStale = isFeedCacheStale(requestedCategory);

      if (cached && !forceRefresh && !isStale) {
        return new Response(
          JSON.stringify({
            ...cached,
            _cache: { hit: true, age: Math.round(getFeedCacheAge(requestedCategory) / 1000), category: requestedCategory },
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
          }
        );
      }

      // Fetch this category
      const data = await fetchCategoryFeeds(requestedCategory);
      const stream = buildStream(data.feeds);

      setFeedCache(requestedCategory, { feeds: data.feeds, stream });

      return new Response(
        JSON.stringify({
          feeds: data.feeds,
          stream,
          errors: data.errors.length > 0 ? data.errors : undefined,
          _cache: { hit: false, category: requestedCategory },
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
        }
      );
    }

    // ALL categories request - aggregate from cache, refresh one category
    const allFeeds: Record<string, RSSItem[]> = {};
    const allErrors: string[] = [];
    let refreshedCategory: string | null = null;

    // Find which category needs refresh
    const categoryToRefresh = forceRefresh ? FEED_CATEGORIES[0] : getNextCategoryToRefresh();

    // Refresh one category (stays under subrequest limit)
    if (categoryToRefresh) {
      console.log(`[API] Refreshing category: ${categoryToRefresh}`);
      const data = await fetchCategoryFeeds(categoryToRefresh);
      setFeedCache(categoryToRefresh, { feeds: data.feeds, stream: buildStream(data.feeds) });
      refreshedCategory = categoryToRefresh;

      Object.assign(allFeeds, data.feeds);
      allErrors.push(...data.errors);
    }

    // Aggregate all cached categories
    for (const cat of FEED_CATEGORIES) {
      if (cat === categoryToRefresh) continue; // Already added above

      const cached = getFeedCache(cat);
      if (cached) {
        Object.assign(allFeeds, cached.feeds);
      }
    }

    const stream = buildStream(allFeeds);

    return new Response(
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
        headers: { 'Content-Type': 'application/json', 'X-Cache': refreshedCategory ? 'PARTIAL' : 'HIT' }
      }
    );

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
