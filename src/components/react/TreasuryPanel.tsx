// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Client-side Treasury data display - fetches from server API (no CORS proxies)

import React, { useState, useEffect } from 'react';

interface TreasuryData {
  debt: number;
  debtHistory: { value: number }[];
  cash: number;
  gold: number;
  interestRate: number;
  ratesHistory: { value: number }[];
}

function Sparkline({ data, color, height = 40 }: { data: { value: number }[]; color: string; height?: number }) {
  if (!data || data.length < 2) return null;

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 100;
  const padding = 4;

  const points = values.map((val, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' L ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="absolute bottom-2 right-2 w-24 h-10 opacity-30">
      <path
        d={`M ${points}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({ label, value, prefix, subValue, trend, color, children, tooltip }: {
  label: string;
  value: string;
  prefix?: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  children?: React.ReactNode;
  tooltip?: string;
}) {
  const accentColor = color || '#22d3ee';

  return (
    <div className="glass-panel p-4 rounded-xl relative overflow-hidden group font-mono flex flex-col justify-between h-full min-h-[140px]">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
          <h4 className="text-[11px] font-thin uppercase tracking-widest text-cyan-400/80">
            {label}
          </h4>
        </div>

        <div
          className="text-2xl md:text-3xl font-medium mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ color: 'white', textShadow: `0 0 20px ${accentColor}40` }}
        >
          {prefix && <span className="text-[0.7em] opacity-60 mr-1 align-top font-normal">{prefix}</span>}
          {value}
        </div>

        {(subValue || trend) && (
          <div className="flex items-center gap-2 text-sm mt-auto pt-1">
            {trend === 'up' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 shrink-0">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            )}
            {trend === 'down' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0">
                <line x1="7" y1="7" x2="17" y2="17" />
                <polyline points="17 7 17 17 7 17" />
              </svg>
            )}
            <span className="text-gray-400 font-thin text-xs opacity-80 truncate">{subValue}</span>
          </div>
        )}
      </div>

      {children}

      <div
        className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}

export default function TreasuryPanel() {
  const [data, setData] = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async (forceRefresh = false) => {
    setLoading(true);
    setError(false);

    try {
      const params = forceRefresh ? '?refresh=true' : '';
      const response = await fetch(`/api/treasury.json${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('[TreasuryPanel] Failed to fetch treasury data:', err);
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Auto-refresh every 30 minutes
    const interval = setInterval(() => {
      loadData();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDebt = (value: number) => {
    if (value === 0) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCash = (value: number) => {
    if (value === 0) return '';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  // No placeholders: show nothing when there is no real data
  if ((error && !data) || (loading && !data)) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
      <div className="md:col-span-2">
            <StatCard
              label="Total Public Debt"
              value={data ? formatDebt(data.debt) : ''}
              trend="up"
              color="#ef4444"
              tooltip="The total money the U.S. government owes."
            >
              {data && data.debtHistory.length > 0 && (
                <Sparkline data={data.debtHistory} color="#ef4444" />
              )}
            </StatCard>
      </div>

          <StatCard
            label="Operating Cash"
            value={data ? formatCash(data.cash) : ''}
            prefix="$"
            subValue="LIQUID ASSETS"
            trend="neutral"
            color="#22c55e"
          />

      <StatCard
        label="Avg Interest Rate"
        value={data?.interestRate ? data.interestRate.toFixed(3) : '--'}
        prefix="%"
        subValue="COST OF DEBT"
        trend="neutral"
        color="#38bdf8"
      >
        {data && data.ratesHistory.length > 0 && (
          <Sparkline data={data.ratesHistory} color="#38bdf8" />
        )}
      </StatCard>
    </div>
  );
}
