// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Crypto panel - displays BTC, ETH, SOL prices with 24h change

import React, { useState, useEffect } from 'react';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  type: string;
}

interface MarketResponse {
  crypto: CryptoData[];
  timestamp: string;
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

export default function CryptoPanel() {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const response = await fetch('/api/market.json?section=crypto');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result: MarketResponse = await response.json();
      if (result.crypto && result.crypto.length > 0) {
        setData(result.crypto);
      }
    } catch (err) {
      console.error('[CryptoPanel] Failed to fetch data:', err);
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

  // Filter to main cryptos
  const mainCrypto = data.filter(d =>
    ['BITCOIN', 'ETHEREUM', 'SOLANA'].includes(d.name)
  );

  if (mainCrypto.length === 0) return null;

  return (
    <div className="glass-panel p-4 rounded-xl font-mono">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-4 rounded-full bg-orange-400" />
        <h3 className="text-[11px] font-thin uppercase tracking-widest text-cyan-400/80">
          Crypto
        </h3>
      </div>

      <div className="space-y-2">
        {mainCrypto.map((item) => {
          const isPositive = item.change >= 0;
          const shortName = item.name === 'BITCOIN' ? 'BTC' :
                           item.name === 'ETHEREUM' ? 'ETH' :
                           item.name === 'SOLANA' ? 'SOL' : item.name;

          return (
            <div
              key={item.symbol}
              className="flex items-center justify-between bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700/50"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  shortName === 'BTC' ? 'bg-orange-400' :
                  shortName === 'ETH' ? 'bg-blue-400' :
                  'bg-purple-400'
                }`} />
                <span className="text-xs text-gray-400 font-medium">{shortName}</span>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {formatPrice(item.price)}
                </div>
                <div className={`text-[10px] ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{item.percentChange.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
