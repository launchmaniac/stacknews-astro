// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// React island - Live feed stream sidebar with client:idle hydration

import React, { useState, useMemo, useCallback } from 'react';
import { format, isValid } from 'date-fns';
import type { RSSItem } from '../../lib/types';

interface LiveWireProps {
  items: RSSItem[];
  onItemClick?: (item: RSSItem) => void;
}

const LiveWire: React.FC<LiveWireProps> = ({ items, onItemClick }) => {
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const uniqueSources = useMemo(() => {
    return Array.from(new Set(items.map(i => i.sourceName || 'Unknown'))).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (sourceFilter === 'ALL') return items;
    return items.filter(i => i.sourceName === sourceFilter);
  }, [items, sourceFilter]);

  const handleCopy = useCallback((e: React.MouseEvent, item: RSSItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.link);
    setCopiedId(item.guid);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const safeDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    return isValid(d) ? d : new Date();
  };

  return (
    <aside className="w-80 flex-none bg-black/20 backdrop-blur-md border-l border-white/5 flex flex-col hidden 2xl:flex">
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
            Live Wire
            <span className="inline-block w-1.5 h-3 bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]" />
          </span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <svg className="absolute left-2 top-2 text-cyan-500/50" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded text-[10px] font-medium py-1.5 pl-7 pr-2 text-gray-300 focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer hover:bg-white/5 tracking-wide font-thin"
          >
            <option value="ALL">ALL SOURCES</option>
            {uniqueSources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stream */}
      <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
        {filteredItems.slice(0, 100).map((item, idx) => (
          <div
            key={`${item.link}-${idx}`}
            onClick={() => onItemClick?.(item)}
            className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group relative"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-3 rounded-full" style={{ backgroundColor: item.color || '#fff' }} />
              <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-gray-400 tracking-wider">
                {item.sourceName}
              </span>
            </div>
            <h4 className="text-[11px] font-medium text-gray-300 group-hover:text-cyan-400 transition-colors leading-snug mb-1 tracking-tight pr-6">
              {item.title}
            </h4>
            <div className="text-[10px] font-medium text-gray-600">
              {format(safeDate(item.pubDate), 'HH:mm:ss')}
            </div>

            {/* Copy Button */}
            <button
              onClick={(e) => handleCopy(e, item)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded text-gray-500 hover:text-cyan-400 transition-all"
              title="Copy Link"
            >
              {copiedId === item.guid ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LiveWire;
