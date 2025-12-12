// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Yield Curve panel - displays Treasury rates with inversion indicator

import React, { useState, useEffect } from 'react';

interface YieldCurvePoint {
  date: string;
  bc_1month?: number;
  bc_2month?: number;
  bc_3month?: number;
  bc_6month?: number;
  bc_1year?: number;
  bc_2year?: number;
  bc_3year?: number;
  bc_5year?: number;
  bc_7year?: number;
  bc_10year?: number;
  bc_20year?: number;
  bc_30year?: number;
}

interface YieldCurveResponse {
  days: number;
  points: YieldCurvePoint[];
  timestamp: string;
}

const MATURITIES = [
  { key: 'bc_3month', label: '3M' },
  { key: 'bc_2year', label: '2Y' },
  { key: 'bc_5year', label: '5Y' },
  { key: 'bc_10year', label: '10Y' },
  { key: 'bc_30year', label: '30Y' },
] as const;

export default function YieldCurvePanel() {
  const [data, setData] = useState<YieldCurvePoint | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const response = await fetch('/api/treasury/yield-curve.json?days=1');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result: YieldCurveResponse = await response.json();
      if (result.points && result.points.length > 0) {
        // Get the most recent point
        setData(result.points[result.points.length - 1]);
      }
    } catch (err) {
      console.error('[YieldCurvePanel] Failed to fetch data:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // 60s refresh
    return () => clearInterval(interval);
  }, []);

  // No data, no render
  if (loading && !data) return null;
  if (!data) return null;

  // Calculate 10Y-2Y spread for inversion detection
  const twoYear = data.bc_2year;
  const tenYear = data.bc_10year;
  const spread = twoYear && tenYear ? tenYear - twoYear : null;
  const isInverted = spread !== null && spread < 0;

  return (
    <div className="glass-panel p-4 rounded-xl font-mono">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-cyan-400" />
          <h3 className="text-[11px] font-thin uppercase tracking-widest text-cyan-400/80">
            Yield Curve
          </h3>
        </div>
        {isInverted && (
          <span className="text-[9px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded uppercase tracking-wider">
            Inverted
          </span>
        )}
      </div>

      <div className="flex justify-between gap-1 mb-3">
        {MATURITIES.map(({ key, label }) => {
          const value = data[key as keyof YieldCurvePoint] as number | undefined;
          return (
            <div key={key} className="text-center flex-1">
              <div className="text-[9px] text-gray-500 uppercase mb-1">{label}</div>
              <div className="text-sm font-medium text-white">
                {value !== undefined ? `${value.toFixed(2)}%` : '--'}
              </div>
            </div>
          );
        })}
      </div>

      {spread !== null && (
        <div className={`text-center py-2 rounded-lg ${
          isInverted ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-900/50 border border-slate-700/50'
        }`}>
          <div className="text-[9px] text-gray-500 uppercase mb-0.5">10Y-2Y Spread</div>
          <div className={`text-lg font-medium ${isInverted ? 'text-red-400' : 'text-green-400'}`}>
            {spread >= 0 ? '+' : ''}{spread.toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
}
