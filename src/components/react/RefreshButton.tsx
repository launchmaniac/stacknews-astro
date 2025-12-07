// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// React island - Refresh button with loading state

import React from 'react';

interface RefreshButtonProps {
  isLoading?: boolean;
  loadProgress?: number;
  onClick?: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  isLoading = false,
  loadProgress = 0,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded border transition-all ${
        isLoading
          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400'
      }`}
      title="Refresh all feeds"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLoading ? 'animate-spin' : ''}>
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
      {isLoading ? `${loadProgress}%` : 'REFRESH'}
    </button>
  );
};

export default RefreshButton;
