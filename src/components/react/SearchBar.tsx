// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// React island - Search bar with URL state sync

import React, { useState, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
  feedCount?: number;
  isLoading?: boolean;
  loadProgress?: number;
  onRefresh?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  feedCount = 0,
  isLoading = false,
  loadProgress = 0,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Update URL state for SSR-friendly search
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set('q', value);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());

    // Dispatch custom event for other islands to listen
    window.dispatchEvent(new CustomEvent('searchChange', { detail: value }));
  }, []);

  return (
    <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-white/[0.02] relative">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
        <input
          type="text"
          placeholder="SEARCH DATA STREAMS..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full bg-black/40 border border-white/10 rounded-md py-2 pl-10 pr-4 text-xs font-normal font-mono text-white focus:outline-none focus:border-cyan-500/50 focus:border-opacity-50 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all placeholder-gray-600 caret-cyan-500 selection:bg-cyan-500/30 tracking-wide font-thin"
        />
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded border transition-all ${
            isLoading
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400'
          }`}
          title="Refresh all feeds"
        >
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? `${loadProgress}%` : 'REFRESH'}
        </button>
      )}

      <div className="text-xs font-thin text-gray-500 hidden md:block tracking-wide">
        SHOWING <span className="text-white font-medium">{feedCount}</span> FEEDS
      </div>

      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300 ease-out shadow-[0_0_10px_#06b6d4]"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
