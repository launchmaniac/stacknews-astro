// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Hero Metrics Bar - 8 key economic indicators displayed at top of dashboard

import React, { useState, useEffect } from 'react';
import DebtCounter from './DebtCounter';

interface MetricValue {
  value: number;
  change: number;
}

interface TreasuryResponse {
  debt: number;
  interestRate: number;
  macro?: {
    fedFundsRate?: MetricValue | null;
  };
}

interface BLSDataPoint {
  seriesId: string;
  name: string;
  value: number | null;
  change?: number;
}

interface BLSResponse {
  series: BLSDataPoint[];
}

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
}

interface MarketResponse {
  indices: MarketData[];
}

interface YieldCurveResponse {
  points: Array<{
    date: string;
    bc_2year?: number;
    bc_10year?: number;
    spread_10y2y?: number;
  }>;
}

interface HeroMetric {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  change?: number;
  color: string;
  loaded: boolean;
}

function formatDebt(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  return `$${(value / 1e9).toFixed(1)}B`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatIndex(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export default function HeroMetrics() {
  const [metrics, setMetrics] = useState<HeroMetric[]>([
    { id: 'debt', label: 'National Debt', tooltip: 'Total outstanding U.S. government debt across all Treasury securities', value: '--', color: 'red', loaded: false },
    { id: 'fedrate', label: 'Fed Rate', tooltip: 'Federal Funds Rate - overnight lending rate set by the Federal Reserve', value: '--', color: 'red', loaded: false },
    { id: '10y', label: '10Y Treasury', tooltip: '10-Year Treasury yield - indicates long-term rate expectations', value: '--', color: 'cyan', loaded: false },
    { id: '2y', label: '2Y Treasury', tooltip: '2-Year Treasury yield - indicates short-term rate expectations', value: '--', color: 'cyan', loaded: false },
    { id: 'unemployment', label: 'Unemployment', tooltip: 'Civilian unemployment rate (BLS U-3) - percent of labor force seeking work', value: '--', color: 'purple', loaded: false },
    { id: 'cpi', label: 'CPI Index', tooltip: 'Consumer Price Index - measures inflation via consumer goods prices', value: '--', color: 'orange', loaded: false },
    { id: 'sp500', label: 'S&P 500', tooltip: 'S&P 500 Index - 500 large-cap US companies, primary market indicator', value: '--', color: 'green', loaded: false },
    { id: 'vix', label: 'VIX', tooltip: 'Volatility Index - expected 30-day market volatility, fear gauge', value: '--', color: 'yellow', loaded: false },
  ]);

  const loadData = async () => {
    try {
      // Fetch all data sources in parallel
      const [treasuryRes, blsRes, marketRes, yieldRes] = await Promise.all([
        fetch('/api/treasury.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/bls.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/market.json?section=indices').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/treasury/yield-curve.json?days=5').then(r => r.ok ? r.json() : null).catch(() => null),
      ]);

      const newMetrics = [...metrics];

      // 1. National Debt (from treasury.json)
      if (treasuryRes?.debt) {
        const idx = newMetrics.findIndex(m => m.id === 'debt');
        if (idx >= 0) {
          newMetrics[idx] = {
            ...newMetrics[idx],
            value: formatDebt(treasuryRes.debt),
            loaded: true
          };
        }
      }

      // 2. Fed Funds Rate (from treasury.json macro)
      if (treasuryRes?.macro?.fedFundsRate) {
        const idx = newMetrics.findIndex(m => m.id === 'fedrate');
        if (idx >= 0) {
          newMetrics[idx] = {
            ...newMetrics[idx],
            value: formatPercent(treasuryRes.macro.fedFundsRate.value),
            change: treasuryRes.macro.fedFundsRate.change,
            loaded: true
          };
        }
      }

      // 3 & 4. 10Y and 2Y Treasury (from yield-curve.json)
      if (yieldRes?.points && yieldRes.points.length > 0) {
        // Find most recent point with complete data (has bc_10year and bc_2year)
        const completePoints = yieldRes.points.filter(
          (p: any) => p.bc_10year !== undefined && p.bc_2year !== undefined
        );
        const latest = completePoints.length > 0
          ? completePoints[completePoints.length - 1]
          : yieldRes.points[yieldRes.points.length - 1];

        if (latest.bc_10year !== undefined) {
          const idx = newMetrics.findIndex(m => m.id === '10y');
          if (idx >= 0) {
            newMetrics[idx] = {
              ...newMetrics[idx],
              value: formatPercent(latest.bc_10year),
              loaded: true
            };
          }
        }

        if (latest.bc_2year !== undefined) {
          const idx = newMetrics.findIndex(m => m.id === '2y');
          if (idx >= 0) {
            newMetrics[idx] = {
              ...newMetrics[idx],
              value: formatPercent(latest.bc_2year),
              loaded: true
            };
          }
        }
      }

      // 5. Unemployment Rate (from bls.json - LNS14000000)
      if (blsRes?.series) {
        const unemployment = (blsRes as BLSResponse).series.find(s => s.seriesId === 'LNS14000000');
        if (unemployment?.value !== null && unemployment?.value !== undefined) {
          const idx = newMetrics.findIndex(m => m.id === 'unemployment');
          if (idx >= 0) {
            newMetrics[idx] = {
              ...newMetrics[idx],
              value: formatPercent(unemployment.value),
              change: unemployment.change,
              loaded: true
            };
          }
        }

        // 6. CPI Index (from bls.json - CUUR0000SA0)
        const cpi = (blsRes as BLSResponse).series.find(s => s.seriesId === 'CUUR0000SA0');
        if (cpi?.value !== null && cpi?.value !== undefined) {
          const idx = newMetrics.findIndex(m => m.id === 'cpi');
          if (idx >= 0) {
            newMetrics[idx] = {
              ...newMetrics[idx],
              value: cpi.value.toFixed(1),
              change: cpi.change,
              loaded: true
            };
          }
        }
      }

      // 7 & 8. S&P 500 and VIX (from market.json)
      if (marketRes?.indices) {
        const sp500 = (marketRes as MarketResponse).indices.find(i => i.name === 'S&P 500');
        if (sp500) {
          const idx = newMetrics.findIndex(m => m.id === 'sp500');
          if (idx >= 0) {
            newMetrics[idx] = {
              ...newMetrics[idx],
              value: formatIndex(sp500.price),
              change: sp500.percentChange,
              loaded: true
            };
          }
        }

        const vix = (marketRes as MarketResponse).indices.find(i => i.name === 'VIX');
        if (vix) {
          const idx = newMetrics.findIndex(m => m.id === 'vix');
          if (idx >= 0) {
            newMetrics[idx] = {
              ...newMetrics[idx],
              value: formatIndex(vix.price),
              change: vix.percentChange,
              loaded: true
            };
          }
        }
      }

      setMetrics(newMetrics);
    } catch (err) {
      console.error('[HeroMetrics] Failed to load data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Check if any metrics have loaded
  const hasData = metrics.some(m => m.loaded);
  if (!hasData) return null;

  const getColorClasses = (color: string, change?: number) => {
    const baseColors: Record<string, string> = {
      red: 'border-red-500/30 text-red-400',
      cyan: 'border-cyan-500/30 text-cyan-400',
      purple: 'border-purple-500/30 text-purple-400',
      orange: 'border-orange-500/30 text-orange-400',
      green: 'border-green-500/30 text-green-400',
      yellow: 'border-yellow-500/30 text-yellow-400',
    };
    return baseColors[color] || baseColors.cyan;
  };

  const getChangeColor = (id: string, change?: number) => {
    if (change === undefined || change === 0) return 'text-gray-500';
    // VIX is inverted - high VIX is bad
    if (id === 'vix') {
      return change > 0 ? 'text-red-400' : 'text-green-400';
    }
    // Unemployment - lower is better
    if (id === 'unemployment') {
      return change > 0 ? 'text-red-400' : 'text-green-400';
    }
    // Everything else - positive is good
    return change > 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-lg border-b border-white/10 px-4 py-2">
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`bg-white/5 hover:bg-white/10 border rounded-lg px-2 py-1.5 transition-colors ${getColorClasses(metric.color)}`}
            title={metric.tooltip}
          >
            <div className="text-[8px] text-gray-500 uppercase tracking-wider truncate">
              {metric.label}
            </div>
            <div className="flex items-baseline gap-1">
              {metric.id === 'debt' ? (
                <DebtCounter compact={true} showRate={false} className="text-sm font-medium text-white" />
              ) : (
                <>
                  <span className="text-sm font-medium text-white truncate">
                    {metric.value}
                  </span>
                  {metric.change !== undefined && metric.change !== 0 && (
                    <span className={`text-[9px] ${getChangeColor(metric.id, metric.change)}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
