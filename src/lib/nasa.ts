// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// NASA DONKI (Solar Flares)

import type { SolarFlareEvent } from './types';

const DONKI_BASE = 'https://api.nasa.gov/DONKI';

function buildUrl(path: string, params: Record<string, string | number | undefined>): string {
  const url = new URL(DONKI_BASE + path);
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

export async function getSolarFlares(apiKey: string, startDate: string, endDate: string): Promise<SolarFlareEvent[]> {
  const url = buildUrl('/FLR', { startDate, endDate, api_key: apiKey });
  const json = await fetchJson(url);
  if (!Array.isArray(json)) return [];
  return json.map((e: any) => ({
    flareID: e.flrID || e.flareID || e.activityID || '',
    classType: e.classType,
    sourceLocation: e.sourceLocation,
    beginTime: e.beginTime,
    peakTime: e.peakTime,
    endTime: e.endTime
  }));
}

