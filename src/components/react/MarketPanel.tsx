// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Market indices panel - displays S&P 500, DOW, NASDAQ, VIX with real-time updates

import React, { useState, useEffect } from 'react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  type: string;
}

interface MarketResponse {
  indices: MarketData[];
  timestamp: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

function formatChange(change: number, percent: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
}

const INDEX_TOOLTIPS: Record<string, string> = {
  'S&P 500': '500 large-cap US companies - primary market indicator',
  'DOW JONES': '30 blue-chip companies, price-weighted index',
  'NASDAQ': 'Tech-heavy index of 3000+ stocks',
  'VIX': 'Volatility Index - expected 30-day market volatility'
};

export default function MarketPanel() {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const response = await fetch('/api/market.json?section=indices');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result: MarketResponse = await response.json();
      if (result.indices && result.indices.length > 0) {
        setData(result.indices);
      }
    } catch (err) {
      console.error('[MarketPanel] Failed to fetch data:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // 60s refresh
    return () => clearInterval(interval);
  }, []);

  // No data, no render (no fake data policy)
  if (loading && data.length === 0) return null;
  if (data.length === 0) return null;

  // Filter to main indices
  const mainIndices = data.filter(d =>
    ['S&P 500', 'DOW JONES', 'NASDAQ', 'VIX'].includes(d.name)
  );

  if (mainIndices.length === 0) return null;

  return (
    <div className="glass-panel p-4 rounded-xl font-mono">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-4 rounded-full bg-blue-400" />
        <h3 className="text-[11px] font-thin uppercase tracking-widest text-cyan-400/80" title="Major U.S. equity market indices tracking broad market performance">
          Market Indices
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {mainIndices.map((item) => {
          const isPositive = item.change >= 0;
          const isVix = item.name === 'VIX';

          return (
            <div
              key={item.symbol}
              className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50"
              title={INDEX_TOOLTIPS[item.name] || item.name}
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                {item.name}
              </div>
              <div className="text-lg font-medium text-white">
                {formatPrice(item.price)}
              </div>
              <div className={`text-xs mt-1 ${
                isVix
                  ? (isPositive ? 'text-red-400' : 'text-green-400')
                  : (isPositive ? 'text-green-400' : 'text-red-400')
              }`}>
                {formatChange(item.change, item.percentChange)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
