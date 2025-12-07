// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Server-side feed fetching utilities (no CORS proxy needed)

import type { FeedConfig, RSSItem } from './types';
import { FEEDS, EDGE_PROXY_URL, RSS_PROXIES } from './constants';

const FETCH_TIMEOUT = 5000; // Shorter timeout for Cloudflare Workers

function parseRSSContent(contents: string, feedName: string, feedColor: string): RSSItem[] {
  // Simple XML parsing for server-side (no DOMParser in Node)
  const items: RSSItem[] = [];

  // Match RSS items
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

    // Handle different link formats (RSS vs Atom)
    let link = getTag('link') || getAttr('link', 'href');

    // Handle date formats
    const pubDate = getTag('pubDate') || getTag('updated') || getTag('published') || new Date().toISOString();

    // Handle description/summary
    const description = getTag('description') || getTag('summary');

    // Handle content
    const content = getTag('content:encoded') || getTag('content') || description;

    // Handle thumbnail
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

async function fetchSingleFeed(config: FeedConfig): Promise<{ feedId: string; items: RSSItem[]; error: boolean }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    // Try direct fetch first (server-side has no CORS restrictions)
    const response = await fetch(config.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'StackNews/2.0 (+https://stacknews.org)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`[Feed ${config.id}] HTTP ${response.status}`);
      throw new Error(`HTTP ${response.status}`);
    }

    const contents = await response.text();
    const items = parseRSSContent(contents, config.name, config.color);
    console.log(`[Feed ${config.id}] Fetched ${items.length} items`);

    return { feedId: config.id, items, error: false };
  } catch (error: any) {
    clearTimeout(timeout);
    console.error(`[Feed ${config.id}] Error: ${error?.message || 'Unknown'}`);

    // Try CORS proxy as fallback for browser environments
    try {
      const proxyUrl = `${RSS_PROXIES[0]}${encodeURIComponent(config.url)}`;
      const response = await fetch(proxyUrl, {
        headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, */*' }
      });

      if (response.ok) {
        const contents = await response.text();
        const items = parseRSSContent(contents, config.name, config.color);
        console.log(`[Feed ${config.id}] Proxy fetched ${items.length} items`);
        return { feedId: config.id, items, error: false };
      }
    } catch {}

    return { feedId: config.id, items: [], error: true };
  }
}

const BATCH_SIZE = 10; // Fetch feeds in batches to avoid overwhelming Workers

async function batchFetchFeeds(feeds: FeedConfig[]): Promise<{ feedId: string; items: RSSItem[]; error: boolean }[]> {
  const results: { feedId: string; items: RSSItem[]; error: boolean }[] = [];

  for (let i = 0; i < feeds.length; i += BATCH_SIZE) {
    const batch = feeds.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(feed => fetchSingleFeed(feed))
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    }
  }

  return results;
}

export async function getFeeds(category?: string): Promise<Map<string, RSSItem[]>> {
  const feedsToFetch = category && category !== 'ALL'
    ? FEEDS.filter(f => f.category === category)
    : FEEDS;

  console.log(`[Feeds] Fetching ${feedsToFetch.length} feeds in batches of ${BATCH_SIZE}`);

  const results = await batchFetchFeeds(feedsToFetch);
  const feedMap = new Map<string, RSSItem[]>();

  let successCount = 0;
  for (const result of results) {
    if (!result.error && result.items.length > 0) {
      feedMap.set(result.feedId, result.items);
      successCount++;
    }
  }

  console.log(`[Feeds] Successfully fetched ${successCount}/${feedsToFetch.length} feeds`);
  return feedMap;
}

export function getGlobalStream(feedMap: Map<string, RSSItem[]>, limit: number = 400): RSSItem[] {
  const allItems: RSSItem[] = [];

  for (const items of feedMap.values()) {
    allItems.push(...items);
  }

  // Deduplicate and sort
  const unique = Array.from(
    new Map(allItems.map(item => [item.link || item.guid, item])).values()
  );

  return unique
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit);
}

export { FEEDS };
