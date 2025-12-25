// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Client-side Labor/Employment data display - fetches from BLS API endpoint

import React, { useState, useEffect } from 'react';

interface BLSDataPoint {
  seriesId: string;
  name: string;
  category: string;
  value: number | null;
  period: string;
  periodName: string;
  year: string;
  change?: number;
  footnote?: string;
}

interface BLSResponse {
  series: BLSDataPoint[];
  grouped: Record<string, BLSDataPoint[]>;
  count: number;
  timestamp: string;
}

function StatCard({ label, value, subValue, trend, change, color, footnote }: {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
  color?: string;
  footnote?: string;
}) {
  const accentColor = color || '#22d3ee';

  return (
    <div className="glass-panel p-3 rounded-lg relative overflow-hidden group font-mono">
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-0.5 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
          <h4 className="text-[10px] font-thin uppercase tracking-wider text-cyan-400/80 truncate">
            {label}
          </h4>
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className="text-lg font-medium whitespace-nowrap"
            style={{ color: 'white', textShadow: `0 0 15px ${accentColor}30` }}
          >
            {value}
          </span>
          {change !== undefined && change !== 0 && (
            <span className={`text-[10px] font-mono ${change > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          )}
        </div>

        {subValue && (
          <div className="text-[9px] text-gray-500 mt-0.5 truncate">{subValue}</div>
        )}

        {footnote && (
          <div className="text-[8px] text-amber-500/70 mt-1 truncate" title={footnote}>
            {footnote}
          </div>
        )}
      </div>

      <div
        className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full blur-[30px] opacity-15 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
      <div className="w-1 h-4 rounded-full" style={{ backgroundColor: color }} />
      <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">{title}</h3>
      <div className="flex-1 h-px bg-gray-800" />
    </div>
  );
}

export default function LaborPanel() {
  const [data, setData] = useState<BLSResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async (forceRefresh = false) => {
    setLoading(true);
    setError(false);

    try {
      const params = forceRefresh ? '?refresh=true' : '';
      const response = await fetch(`/api/bls.json${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('[LaborPanel] Failed to fetch BLS data:', err);
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

  const formatValue = (point: BLSDataPoint): string => {
    if (point.value === null) return 'N/A';
    const v = point.value;

    // Percentage values
    if (['LNS14000000', 'JTS000000000000000JOR', 'JTS000000000000000QUR', 'JTS000000000000000HIR',
         'PRS85006092', 'PRS85006112', 'CIU1010000000000A',
         'LASST060000000000003', 'LASST480000000000003', 'LASST360000000000003'].includes(point.seriesId)) {
      return `${v.toFixed(1)}%`;
    }

    // Dollar values (hourly earnings)
    if (point.seriesId === 'CES0500000003') {
      return `$${v.toFixed(2)}`;
    }

    // Large numbers (thousands)
    if (['LNS11000000', 'LNS12000000', 'LNS13000000', 'CES0000000001',
         'CEU0500000001', 'CEU0600000001', 'CEU4142000001'].includes(point.seriesId)) {
      return v >= 1000 ? `${(v / 1000).toFixed(1)}M` : `${v.toFixed(0)}K`;
    }

    // Index values
    return v.toFixed(1);
  };

  const getColor = (category: string): string => {
    switch (category) {
      case 'labor': return '#22d3ee';
      case 'jolts': return '#a78bfa';
      case 'inflation': return '#f87171';
      case 'ppi': return '#fb923c';
      case 'productivity': return '#4ade80';
      case 'states': return '#60a5fa';
      default: return '#94a3b8';
    }
  };

  // Don't show anything until we have data
  if ((error && !data) || (loading && !data)) return null;

  const { grouped } = data!;

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Labor & Employment
        </h2>
        <span className="text-[9px] text-gray-500 font-mono">
          {data?.series[0]?.periodName} {data?.series[0]?.year}
        </span>
      </div>

      {/* Labor Market */}
      {grouped.labor && grouped.labor.length > 0 && (
        <>
          <SectionHeader title="Labor Market" color="#22d3ee" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {grouped.labor.slice(0, 4).map((point) => (
              <StatCard
                key={point.seriesId}
                label={point.name}
                value={formatValue(point)}
                change={point.change}
                color={getColor(point.category)}
                footnote={point.footnote}
              />
            ))}
          </div>
        </>
      )}

      {/* JOLTS */}
      {grouped.jolts && grouped.jolts.length > 0 && (
        <>
          <SectionHeader title="Job Openings (JOLTS)" color="#a78bfa" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {grouped.jolts.map((point) => (
              <StatCard
                key={point.seriesId}
                label={point.name}
                value={formatValue(point)}
                change={point.change}
                color={getColor(point.category)}
                footnote={point.footnote}
              />
            ))}
          </div>
        </>
      )}

      {/* Inflation */}
      {grouped.inflation && grouped.inflation.length > 0 && (
        <>
          <SectionHeader title="Inflation (CPI)" color="#f87171" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {grouped.inflation.map((point) => (
              <StatCard
                key={point.seriesId}
                label={point.name}
                value={formatValue(point)}
                change={point.change}
                color={getColor(point.category)}
                subValue={point.seriesId.includes('CUUR') ? 'All Urban' : undefined}
                footnote={point.footnote}
              />
            ))}
          </div>
        </>
      )}

      {/* Producer Prices */}
      {grouped.ppi && grouped.ppi.length > 0 && (
        <>
          <SectionHeader title="Producer Prices (PPI)" color="#fb923c" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {grouped.ppi.map((point) => (
              <StatCard
                key={point.seriesId}
                label={point.name}
                value={formatValue(point)}
                change={point.change}
                color={getColor(point.category)}
                footnote={point.footnote}
              />
            ))}
          </div>
        </>
      )}

      {/* Productivity */}
      {grouped.productivity && grouped.productivity.length > 0 && (
        <>
          <SectionHeader title="Productivity" color="#4ade80" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {grouped.productivity.map((point) => (
              <StatCard
                key={point.seriesId}
                label={point.name}
                value={formatValue(point)}
                change={point.change}
                color={getColor(point.category)}
                subValue="Quarterly"
                footnote={point.footnote}
              />
            ))}
          </div>
        </>
      )}

      {/* State Unemployment */}
      {grouped.states && grouped.states.length > 0 && (
        <>
          <SectionHeader title="State Unemployment" color="#60a5fa" />
          <div className="grid grid-cols-3 gap-2">
            {grouped.states.map((point) => (
              <StatCard
                key={point.seriesId}
                label={point.name.replace(' Unemployment', '')}
                value={formatValue(point)}
                change={point.change}
                color={getColor(point.category)}
                footnote={point.footnote}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
