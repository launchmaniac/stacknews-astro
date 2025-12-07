// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Client-side feed display component - fetches from server API (no CORS proxies)

import React, { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface RSSItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  description: string;
  sourceName?: string;
  color?: string;
}

interface FeedConfig {
  id: string;
  url: string;
  name: string;
  color: string;
  category: string;
}

interface FeedState {
  items: RSSItem[];
  loading: boolean;
  error: boolean;
}

interface APIResponse {
  feeds: Record<string, RSSItem[]>;
  stream: RSSItem[];
  timestamp: string;
  _cache?: {
    hit: boolean;
    age?: number;
    stale?: boolean;
  };
}

// Feed Panel Component
function FeedPanel({ title, color, items, loading, error }: {
  title: string;
  color: string;
  items: RSSItem[];
  loading: boolean;
  error: boolean;
}) {
  return (
    <div
      className="glass-panel rounded-lg flex flex-col overflow-hidden h-64 font-mono group"
      style={{ borderColor: `${color}20` }}
    >
      <div className="h-0.5 w-full opacity-50" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
      <div className="flex-none p-2.5 flex justify-between items-center border-b border-white/5 bg-white/5">
        <h3 className="text-[10px] font-extrabold tracking-widest uppercase flex items-center gap-2 text-gray-200">
          <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'animate-pulse' : ''}`} style={{ backgroundColor: color }} />
          {title}
        </h3>
        {error ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400/60">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading && items.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs animate-pulse" style={{ color }}>SYNCING...</span>
          </div>
        )}
        {error && items.length === 0 && (
          <div className="flex items-center justify-center h-full text-red-400/80 text-[10px]">
            CONNECTION LOST
          </div>
        )}
        {items.slice(0, 10).map((item, idx) => (
          <a
            key={item.guid || idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 border-b border-white/5 hover:bg-white/5 transition-colors group/item"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-200 line-clamp-2 group-hover/item:text-cyan-300 transition-colors">
                  {item.title}
                </p>
                <p className="text-[9px] text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(item.pubDate), { addSuffix: true })}
                </p>
              </div>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 mt-1">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// Main Feed Loader Component
export default function FeedLoader({ feeds, category }: { feeds: FeedConfig[]; category: string }) {
  const [feedStates, setFeedStates] = useState<Record<string, FeedState>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [cacheInfo, setCacheInfo] = useState<{ hit: boolean; age?: number } | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadFeeds = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);

    // Initialize all feeds as loading
    const initial: Record<string, FeedState> = {};
    feeds.forEach(f => {
      initial[f.id] = { items: [], loading: true, error: false };
    });
    setFeedStates(initial);

    try {
      if (category !== 'ALL') {
        // Single category - simple fetch
        const params = new URLSearchParams({ category });
        if (forceRefresh) params.set('refresh', 'true');

        const response = await fetch(`/api/feeds.json?${params.toString()}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data: APIResponse = await response.json();
        updateStatesFromData(data);
      } else {
        // ALL categories - fetch each category to populate cache
        // Get unique categories from feeds
        const categories = [...new Set(feeds.map(f => f.category))];

        // Fetch categories in parallel (each stays under subrequest limit)
        const responses = await Promise.allSettled(
          categories.map(cat =>
            fetch(`/api/feeds.json?category=${encodeURIComponent(cat)}${forceRefresh ? '&refresh=true' : ''}`)
              .then(r => r.ok ? r.json() : null)
          )
        );

        // Aggregate all responses
        const aggregatedFeeds: Record<string, RSSItem[]> = {};
        let latestTimestamp = new Date().toISOString();

        for (const result of responses) {
          if (result.status === 'fulfilled' && result.value) {
            Object.assign(aggregatedFeeds, result.value.feeds || {});
            if (result.value.timestamp) {
              latestTimestamp = result.value.timestamp;
            }
          }
        }

        updateStatesFromData({
          feeds: aggregatedFeeds,
          stream: [],
          timestamp: latestTimestamp,
          _cache: { hit: false }
        });
      }
    } catch (error) {
      console.error('[FeedLoader] Failed to fetch feeds:', error);

      // Mark all feeds as errored
      const errorStates: Record<string, FeedState> = {};
      feeds.forEach(f => {
        errorStates[f.id] = { items: [], loading: false, error: true };
      });
      setFeedStates(errorStates);
    }

    setIsLoading(false);
  }, [feeds, category]);

  const updateStatesFromData = (data: APIResponse) => {
    const newStates: Record<string, FeedState> = {};
    for (const feed of feeds) {
      const items = data.feeds[feed.id] || [];
      newStates[feed.id] = {
        items: items.map(item => ({ ...item, color: feed.color })),
        loading: false,
        error: items.length === 0
      };
    }
    setFeedStates(newStates);
    setCacheInfo(data._cache || null);
    setLastUpdate(new Date(data.timestamp));
  };

  useEffect(() => {
    loadFeeds();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadFeeds();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadFeeds]);

  // Group feeds by category
  const categories = [...new Set(feeds.map(f => f.category))];
  const filteredCategories = category === 'ALL'
    ? categories
    : categories.filter(c => c === category);

  return (
    <div className="space-y-8">
      {/* Status Bar */}
      <div className="flex items-center gap-4 mb-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-cyan-400 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            <span>SYNCING FEEDS...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            {cacheInfo?.hit && (
              <span className="text-green-400/60">
                CACHED {cacheInfo.age ? `(${cacheInfo.age}s)` : ''}
              </span>
            )}
            {lastUpdate && (
              <span className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {formatDistanceToNow(lastUpdate, { addSuffix: true })}
              </span>
            )}
          </div>
        )}

        <div className="flex-1" />

        <button
          onClick={() => loadFeeds(true)}
          className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors"
          disabled={isLoading}
          title="Force refresh"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLoading ? 'animate-spin' : ''}>
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>

      {/* Feed Panels by Category */}
      {filteredCategories.map(cat => {
        const categoryFeeds = feeds.filter(f => f.category === cat);
        return (
          <div key={cat} className="animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <h2 className="text-xs font-bold tracking-[0.3em] text-cyan-400/80">{cat.replace('_', ' ')}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryFeeds.map(feed => {
                const state = feedStates[feed.id] || { items: [], loading: true, error: false };
                return (
                  <FeedPanel
                    key={feed.id}
                    title={feed.name}
                    color={feed.color}
                    items={state.items}
                    loading={state.loading}
                    error={state.error}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
