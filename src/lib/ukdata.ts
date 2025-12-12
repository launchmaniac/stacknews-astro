// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// UK data.gov.uk CKAN package_search wrapper

import type { UkDataset } from './types';

const UKDATA = 'https://data.gov.uk/api/action/package_search';

function buildUrl(params: Record<string, string | number | undefined>): string {
  const url = new URL(UKDATA);
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

export interface UkDataSearchOptions {
  q: string;
  rows?: number;
  start?: number;
}

export async function searchUkData(opts: UkDataSearchOptions): Promise<{ count: number; results: UkDataset[] }> {
  const url = buildUrl({ q: opts.q, rows: opts.rows || 20, start: opts.start || 0 });
  const json = await fetchJson(url);
  const res = json?.result;
  if (!res) return { count: 0, results: [] };
  const results: UkDataset[] = Array.isArray(res.results)
    ? res.results.map((r: any) => ({
        id: r.id,
        title: r.title,
        notes: r.notes,
        organization: r.organization?.title,
        resources: Array.isArray(r.resources)
          ? r.resources.map((x: any) => ({ format: x.format, url: x.url, name: x.name }))
          : []
      }))
    : [];
  return { count: Number(res.count || results.length), results };
}

