// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Debt Counter Component - Animated national debt display with growth rate

import React, { useState, useEffect } from 'react';
import AnimatedCounter from './AnimatedCounter';

const STORAGE_KEY = 'stacknews:debt';

interface DebtCounterProps {
  compact?: boolean;        // true = "$36.21T", false = full number
  showRate?: boolean;       // Show "+$67,129/sec" below counter
  className?: string;
}

interface DebtData {
  debt: number;
  debtTimestamp: string;
  debtGrowthRate?: {
    dailyAverage: number;
    perSecond: number;
    periodStart: string;
    periodEnd: string;
    totalGrowth: number;
    daysInPeriod: number;
  };
}

// Format large numbers compactly (e.g., $36.21T)
function formatCompact(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  return `$${(value / 1e6).toFixed(0)}M`;
}

// Format full currency number
function formatFull(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.round(value));
}

// Format rate per second
function formatRate(perSecond: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.round(perSecond));
}

export default function DebtCounter({
  compact = false,
  showRate = false,
  className = ''
}: DebtCounterProps) {
  const [data, setData] = useState<DebtData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Load from localStorage first for instant display
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.debt > 0) {
          setData(parsed);
          setLoading(false);
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    const fetchData = async () => {
      try {
        // Try treasury-fiscal.json first (daily FiscalData)
        const fiscalRes = await fetch('/api/treasury-fiscal.json');
        if (fiscalRes.ok) {
          const json = await fiscalRes.json();
          if (json.debt && json.debt > 0) {
            const debtData = {
              debt: json.debt,
              debtTimestamp: json.debtTimestamp || new Date().toISOString(),
              debtGrowthRate: json.debtGrowthRate
            };
            setData(debtData);
            setError(false);
            setLoading(false);
            // Cache to localStorage for instant display on next visit
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(debtData));
            } catch {}
            return;
          }
        }

        // Fallback to treasury.json (quarterly FRED data)
        const treasuryRes = await fetch('/api/treasury.json');
        if (!treasuryRes.ok) throw new Error('Both APIs failed');
        const json = await treasuryRes.json();

        // Calculate growth rate from quarterly FRED data
        let growthRate = undefined;
        if (json.debtHistory && json.debtHistory.length >= 2) {
          const newest = json.debtHistory[json.debtHistory.length - 1]?.value || json.debt;
          const oldest = json.debtHistory[0]?.value;
          if (oldest && newest && oldest > 0) {
            // Assume quarterly data spans roughly 5 years (20 quarters)
            const totalGrowth = newest - oldest;
            const daysEstimate = json.debtHistory.length * 90; // ~90 days per quarter
            const dailyAvg = totalGrowth / daysEstimate;
            const perSecond = dailyAvg / 86400;
            if (perSecond > 0) {
              growthRate = {
                dailyAverage: Math.round(dailyAvg),
                perSecond: Math.round(perSecond * 100) / 100,
                periodStart: 'FRED quarterly',
                periodEnd: 'estimated',
                totalGrowth: Math.round(totalGrowth),
                daysInPeriod: daysEstimate
              };
            }
          }
        }

        const debtData = {
          debt: json.debt,
          debtTimestamp: new Date().toISOString(),
          debtGrowthRate: growthRate
        };
        setData(debtData);
        setError(false);
        // Cache to localStorage for instant display on next visit
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(debtData));
        } catch {}
      } catch (err) {
        console.error('[DebtCounter] Fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 30 minutes to get updated base value
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className={`bg-white/10 rounded ${compact ? 'h-5 w-20' : 'h-8 w-48'}`} />
        {showRate && <div className="bg-white/10 rounded h-3 w-24 mt-1" />}
      </div>
    );
  }

  // Error state - show static placeholder
  if (error || !data) {
    return (
      <div className={className}>
        <span className="text-gray-500">--</span>
      </div>
    );
  }

  const { debt, debtTimestamp, debtGrowthRate } = data;
  const startTimestamp = new Date(debtTimestamp).getTime();
  const perSecond = debtGrowthRate?.perSecond || 0;

  // If no growth rate available, show static value
  if (!debtGrowthRate || perSecond <= 0) {
    return (
      <div className={className}>
        <span className="tabular-nums">
          {compact ? formatCompact(debt) : formatFull(debt)}
        </span>
        {showRate && (
          <div className="text-[10px] text-gray-500 mt-0.5">
            Rate data unavailable
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <AnimatedCounter
        baseValue={debt}
        ratePerSecond={perSecond}
        startTimestamp={startTimestamp}
        formatFn={compact ? formatCompact : formatFull}
        className={className}
      />
      {showRate && (
        <div className="text-[10px] text-gray-500 mt-0.5">
          +{formatRate(perSecond)}/sec | {debtGrowthRate.daysInPeriod}-day avg
        </div>
      )}
    </div>
  );
}
