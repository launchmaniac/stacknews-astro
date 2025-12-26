// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// State Unemployment Panel - displays all 50 states + DC + territories with heat map visualization

import React, { useState, useEffect, useMemo } from 'react';

interface StateData {
  name: string;
  value: number | null;
  change?: number;
  abbrev: string;
}

interface BLSDataPoint {
  seriesId: string;
  name: string;
  category: string;
  value: number | null;
  period: string;
  periodName: string;
  year: string;
  change?: number;
}

interface BLSResponse {
  grouped: Record<string, BLSDataPoint[]>;
  timestamp: string;
}

// State abbreviations mapping
const STATE_ABBREVS: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'District of Columbia': 'DC', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI',
  'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME',
  'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN',
  'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE',
  'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM',
  'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI',
  'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX',
  'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA',
  'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'Puerto Rico': 'PR', 'Virgin Islands': 'VI'
};

// Get color based on unemployment rate (lower = greener, higher = redder)
function getRateColor(rate: number | null): string {
  if (rate === null) return 'bg-gray-700';
  if (rate <= 2.5) return 'bg-emerald-600';
  if (rate <= 3.5) return 'bg-emerald-500';
  if (rate <= 4.0) return 'bg-lime-500';
  if (rate <= 4.5) return 'bg-yellow-500';
  if (rate <= 5.0) return 'bg-orange-500';
  if (rate <= 5.5) return 'bg-orange-600';
  return 'bg-red-500';
}

function getRateTextColor(rate: number | null): string {
  if (rate === null) return 'text-gray-400';
  if (rate <= 3.5) return 'text-emerald-400';
  if (rate <= 4.5) return 'text-yellow-400';
  return 'text-red-400';
}

type SortMode = 'alpha' | 'rate-asc' | 'rate-desc';

export default function StateUnemploymentPanel() {
  const [data, setData] = useState<BLSResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('rate-desc');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/bls.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('[StateUnemploymentPanel] Failed to fetch:', err);
      }
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const states = useMemo(() => {
    if (!data?.grouped?.states) return [];

    return data.grouped.states
      .map((point): StateData => ({
        name: point.name,
        value: point.value,
        change: point.change,
        abbrev: STATE_ABBREVS[point.name] || point.name.slice(0, 2).toUpperCase()
      }))
      .filter(s => s.value !== null);
  }, [data]);

  const sortedStates = useMemo(() => {
    const sorted = [...states];
    switch (sortMode) {
      case 'alpha':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'rate-asc':
        return sorted.sort((a, b) => (a.value || 0) - (b.value || 0));
      case 'rate-desc':
        return sorted.sort((a, b) => (b.value || 0) - (a.value || 0));
      default:
        return sorted;
    }
  }, [states, sortMode]);

  const { lowest, highest, average } = useMemo(() => {
    if (states.length === 0) return { lowest: null, highest: null, average: 0 };

    const validStates = states.filter(s => s.value !== null);
    const sorted = [...validStates].sort((a, b) => (a.value || 0) - (b.value || 0));
    const sum = validStates.reduce((acc, s) => acc + (s.value || 0), 0);

    return {
      lowest: sorted[0],
      highest: sorted[sorted.length - 1],
      average: sum / validStates.length
    };
  }, [states]);

  if (loading && !data) return null;
  if (!data?.grouped?.states || states.length === 0) return null;

  const displayStates = showAll ? sortedStates : sortedStates.slice(0, 20);
  const periodInfo = data.grouped.states[0];

  return (
    <div className="glass-panel p-4 rounded-xl font-mono mb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-blue-400" />
          <h3 className="text-[11px] font-thin uppercase tracking-widest text-cyan-400/80" title="Unemployment rates for all 50 states, D.C., and U.S. territories (seasonally adjusted)">
            State Unemployment Rates
          </h3>
        </div>
        <span className="text-[9px] text-gray-500">
          {periodInfo?.periodName} {periodInfo?.year}
        </span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 text-center" title="State with the lowest (best) unemployment rate">
          <div className="text-[9px] text-gray-400 uppercase mb-1">Lowest</div>
          <div className="text-lg font-medium text-emerald-400">{lowest?.value?.toFixed(1)}%</div>
          <div className="text-[10px] text-gray-500">{lowest?.name}</div>
        </div>
        <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-2 text-center" title="Weighted average unemployment rate across all states">
          <div className="text-[9px] text-gray-400 uppercase mb-1">National Avg</div>
          <div className="text-lg font-medium text-white">{average.toFixed(1)}%</div>
          <div className="text-[10px] text-gray-500">{states.length} States</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center" title="State with the highest (worst) unemployment rate">
          <div className="text-[9px] text-gray-400 uppercase mb-1">Highest</div>
          <div className="text-lg font-medium text-red-400">{highest?.value?.toFixed(1)}%</div>
          <div className="text-[10px] text-gray-500">{highest?.name}</div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] text-gray-500 uppercase">Sort:</span>
        <button
          onClick={() => setSortMode('rate-desc')}
          className={`text-[9px] px-2 py-0.5 rounded ${
            sortMode === 'rate-desc' ? 'bg-blue-500/30 text-blue-300' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Highest First
        </button>
        <button
          onClick={() => setSortMode('rate-asc')}
          className={`text-[9px] px-2 py-0.5 rounded ${
            sortMode === 'rate-asc' ? 'bg-blue-500/30 text-blue-300' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Lowest First
        </button>
        <button
          onClick={() => setSortMode('alpha')}
          className={`text-[9px] px-2 py-0.5 rounded ${
            sortMode === 'alpha' ? 'bg-blue-500/30 text-blue-300' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          A-Z
        </button>
      </div>

      {/* State Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-1">
        {displayStates.map((state) => (
          <div
            key={state.abbrev}
            className={`relative group p-1.5 rounded text-center cursor-default transition-all hover:scale-105 ${getRateColor(state.value)}`}
            title={`${state.name}: ${state.value?.toFixed(1)}%${state.change ? ` (${state.change > 0 ? '+' : ''}${state.change.toFixed(1)}%)` : ''}`}
          >
            <div className="text-[10px] font-bold text-white/90">{state.abbrev}</div>
            <div className="text-[8px] text-white/70">{state.value?.toFixed(1)}%</div>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg border border-gray-700">
              <div className="font-medium">{state.name}</div>
              <div className={getRateTextColor(state.value)}>{state.value?.toFixed(1)}%</div>
              {state.change !== undefined && state.change !== 0 && (
                <div className={state.change > 0 ? 'text-red-400' : 'text-green-400'}>
                  {state.change > 0 ? '+' : ''}{state.change.toFixed(1)}% MoM
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less */}
      {states.length > 20 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-1.5 text-[10px] text-gray-400 hover:text-cyan-400 transition-colors border border-gray-700/50 rounded hover:border-cyan-500/30"
        >
          {showAll ? 'Show Less' : `Show All ${states.length} States`}
        </button>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 mt-3 text-[8px] text-gray-500">
        <span>Low</span>
        <div className="flex gap-0.5">
          <div className="w-4 h-2 rounded-sm bg-emerald-600" />
          <div className="w-4 h-2 rounded-sm bg-emerald-500" />
          <div className="w-4 h-2 rounded-sm bg-lime-500" />
          <div className="w-4 h-2 rounded-sm bg-yellow-500" />
          <div className="w-4 h-2 rounded-sm bg-orange-500" />
          <div className="w-4 h-2 rounded-sm bg-orange-600" />
          <div className="w-4 h-2 rounded-sm bg-red-500" />
        </div>
        <span>High</span>
      </div>
    </div>
  );
}
