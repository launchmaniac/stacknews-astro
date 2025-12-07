// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Server-side category-based cache manager with TTL tracking and staggered refresh

import type { RSSItem, TreasuryData } from './types';

const CATEGORY_TTL = 5 * 60 * 1000; // 5 minutes per category
const TREASURY_TTL = 30 * 60 * 1000; // 30 minutes for treasury data

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  category: string;
}

interface FeedCacheData {
  feeds: Record<string, RSSItem[]>;
  stream: RSSItem[];
}

// In-memory cache stores
const feedCache = new Map<string, CacheEntry<FeedCacheData>>();
let treasuryCache: CacheEntry<TreasuryData> | null = null;

// Track last refresh time per category for rotation
const categoryRefreshTimes = new Map<string, number>();

// All feed categories for rotation
export const FEED_CATEGORIES = [
  'TREASURY',
  'FEDERAL RESERVE',
  'ENERGY',
  'EUROZONE',
  'ASIA_PACIFIC',
  'GLOBAL_MACRO',
  'CRYPTO',
  'STATE_DEPT',
  'MILITARY',
  'UK',
  'RESEARCH',
  'MORTGAGE',
  'REAL ESTATE',
  'LEGISLATION',
  'REGULATION',
  'EXECUTIVE',
  'NEWS',
  'CANADA'
] as const;

// Feed cache operations
export function getFeedCache(category: string = 'ALL'): FeedCacheData | null {
  const entry = feedCache.get(category);
  if (!entry) return null;
  return entry.data;
}

export function setFeedCache(category: string, data: FeedCacheData): void {
  const now = Date.now();
  feedCache.set(category, {
    data,
    timestamp: now,
    category
  });
  categoryRefreshTimes.set(category, now);
}

export function isFeedCacheStale(category: string): boolean {
  const entry = feedCache.get(category);
  if (!entry) return true;
  return Date.now() - entry.timestamp > CATEGORY_TTL;
}

export function getFeedCacheAge(category: string): number {
  const entry = feedCache.get(category);
  if (!entry) return Infinity;
  return Date.now() - entry.timestamp;
}

// Get the next category that needs refreshing (oldest first)
export function getNextCategoryToRefresh(): string | null {
  let oldestCategory: string | null = null;
  let oldestTime = Infinity;

  for (const cat of FEED_CATEGORIES) {
    const lastRefresh = categoryRefreshTimes.get(cat) || 0;
    if (lastRefresh < oldestTime) {
      oldestTime = lastRefresh;
      oldestCategory = cat;
    }
  }

  // Only return if it's been more than TTL since last refresh
  if (oldestCategory && Date.now() - oldestTime > CATEGORY_TTL) {
    return oldestCategory;
  }

  return null;
}

// Get all categories that are stale
export function getStaleFeedCategories(): string[] {
  const now = Date.now();
  return FEED_CATEGORIES.filter(cat => {
    const lastRefresh = categoryRefreshTimes.get(cat) || 0;
    return now - lastRefresh > CATEGORY_TTL;
  });
}

// Treasury cache operations
export function getTreasuryCache(): TreasuryData | null {
  if (!treasuryCache) return null;
  return treasuryCache.data;
}

export function setTreasuryCache(data: TreasuryData): void {
  treasuryCache = {
    data,
    timestamp: Date.now(),
    category: 'treasury'
  };
}

export function isTreasuryCacheStale(): boolean {
  if (!treasuryCache) return true;
  return Date.now() - treasuryCache.timestamp > TREASURY_TTL;
}

export function getTreasuryCacheAge(): number {
  if (!treasuryCache) return Infinity;
  return Date.now() - treasuryCache.timestamp;
}

// Cache stats for debugging
export function getCacheStats(): {
  feedCategories: { category: string; age: number; stale: boolean }[];
  treasury: { age: number; stale: boolean };
} {
  const now = Date.now();

  return {
    feedCategories: FEED_CATEGORIES.map(cat => ({
      category: cat,
      age: Math.round((now - (categoryRefreshTimes.get(cat) || 0)) / 1000),
      stale: isFeedCacheStale(cat)
    })),
    treasury: {
      age: Math.round(getTreasuryCacheAge() / 1000),
      stale: isTreasuryCacheStale()
    }
  };
}

// Clear all caches (for testing/debugging)
export function clearAllCaches(): void {
  feedCache.clear();
  categoryRefreshTimes.clear();
  treasuryCache = null;
}
