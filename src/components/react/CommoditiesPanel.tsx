// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Commodities panel - displays Gold, Silver, Crude Oil, Natural Gas prices

import React, { useState, useEffect } from 'react';

interface CommodityData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  type: string;
}

interface MarketResponse {
  commodities: CommodityData[];
  timestamp: string;
}

const COMMODITY_TOOLTIPS: Record<string, string> = {
  'GOLD': 'Gold - precious metal used as inflation hedge and safe-haven asset',
  'SILVER': 'Silver - industrial and precious metal, inflation hedge',
  'CRUDE OIL': 'WTI Crude Oil - benchmark oil price, key energy commodity',
  'NAT GAS': 'Natural Gas - energy commodity for heating and power generation'
};

function formatPrice(price: number, name: string): string {
  // Gold and Silver in dollars
  if (name === 'GOLD' || name === 'SILVER') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }
  // Oil and Gas with 2 decimals
  return `$${price.toFixed(2)}`;
}

export default function CommoditiesPanel() {
  const [data, setData] = useState<CommodityData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const response = await fetch('/api/market.json?section=commodities');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result: MarketResponse = await response.json();
      if (result.commodities && result.commodities.length > 0) {
        setData(result.commodities);
      }
    } catch (err) {
      console.error('[CommoditiesPanel] Failed to fetch data:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // 60s refresh
    return () => clearInterval(interval);
  }, []);

  // No data, no render
  if (loading && data.length === 0) return null;
  if (data.length === 0) return null;

  // Filter to commodities (COMM type)
  const commodities = data.filter(d => d.type === 'COMM');

  if (commodities.length === 0) return null;

  const getColor = (name: string): string => {
    switch (name) {
      case 'GOLD': return 'bg-yellow-400';
      case 'SILVER': return 'bg-gray-400';
      case 'CRUDE OIL': return 'bg-amber-600';
      case 'NAT GAS': return 'bg-blue-400';
      default: return 'bg-cyan-400';
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl font-mono">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-4 rounded-full bg-yellow-400" />
        <h3 className="text-[11px] font-thin uppercase tracking-widest text-cyan-400/80" title="Key commodity prices including precious metals and energy">
          Commodities
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {commodities.map((item) => {
          const isPositive = item.change >= 0;

          return (
            <div
              key={item.symbol}
              className="bg-slate-900/50 rounded-lg p-2 border border-slate-700/50"
              title={COMMODITY_TOOLTIPS[item.name] || item.name}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${getColor(item.name)}`} />
                <span className="text-[9px] text-gray-500 uppercase tracking-wider truncate">
                  {item.name}
                </span>
              </div>
              <div className="text-sm font-medium text-white">
                {formatPrice(item.price, item.name)}
              </div>
              <div className={`text-[10px] ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{item.percentChange.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
