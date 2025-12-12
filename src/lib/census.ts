// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Census EITS (Economic Indicators) - Residential Construction & Permits (timeseries)

import type { HousingStats } from './types';

const CENSUS_BASE = 'https://api.census.gov/data/timeseries/eits';

function buildUrl(path: string, params: Record<string, string | number | undefined>): string {
  const url = new URL(CENSUS_BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  return url.toString();
}

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Helper to parse the "value" column as number and construct date
function parseSeries(rows: any[], dateKey: string, valueKey: string): { date: string; value: number }[] {
  return rows
    .map((d: any) => {
      const date = d[dateKey];
      const val = Number(d[valueKey]);
      return date && !isNaN(val) ? { date, value: val } : null;
    })
    .filter((x: any): x is { date: string; value: number } => !!x)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getHousingStats(limit: number = 24): Promise<HousingStats> {
  // New Residential Construction (resconst)
  // Try total housing starts SAAR (seasonally adjusted annual rate) if available
  const startsUrl = buildUrl('/resconst', {
    time: `from ${limit}`,
    get: 'cell_value,time',
    // Default fields can vary; using generic columns
  });
  // Building Permits (permits)
  const permitsUrl = buildUrl('/permits', {
    time: `from ${limit}`,
    get: 'cell_value,time',
  });

  const [startsJson, permitsJson] = await Promise.all([
    fetchJson(startsUrl),
    fetchJson(permitsUrl)
  ]);

  // Both endpoints commonly return arrays with header row as first element if using CSV-like style.
  // Fall back to generic detection.
  const startsRows = Array.isArray(startsJson) && Array.isArray(startsJson[1])
    ? startsJson.slice(1).map((r: any[]) => ({ time: r[1], cell_value: r[0] }))
    : Array.isArray(startsJson?.data) ? startsJson.data : [];

  const permitsRows = Array.isArray(permitsJson) && Array.isArray(permitsJson[1])
    ? permitsJson.slice(1).map((r: any[]) => ({ time: r[1], cell_value: r[0] }))
    : Array.isArray(permitsJson?.data) ? permitsJson.data : [];

  const starts = parseSeries(startsRows, 'time', 'cell_value');
  const permits = parseSeries(permitsRows, 'time', 'cell_value');

  return {
    starts,
    permits,
    latestStarts: starts.length ? starts[starts.length - 1].value : undefined,
    latestPermits: permits.length ? permits[permits.length - 1].value : undefined
  };
}

