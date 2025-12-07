// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// React island - Refresh button with loading state

import React from 'react';
import { RefreshCw } from 'lucide-react';

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
      <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
      {isLoading ? `${loadProgress}%` : 'REFRESH'}
    </button>
  );
};

export default RefreshButton;
