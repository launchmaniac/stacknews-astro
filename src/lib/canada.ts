// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Canada open.canada.ca CKAN package_search wrapper

import type { CanadaDataset } from './types';

const CANADA_DATA = 'https://open.canada.ca/data/api/3/action/package_search';

function buildUrl(params: Record<string, string | number | undefined>): string {
  const url = new URL(CANADA_DATA);
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

export interface CanadaDataSearchOptions {
  q: string;
  rows?: number;
  start?: number;
  fq?: string; // Filter query for specific organizations or tags
}

export async function searchCanadaData(opts: CanadaDataSearchOptions): Promise<{ count: number; results: CanadaDataset[] }> {
  const url = buildUrl({ q: opts.q, rows: opts.rows || 20, start: opts.start || 0, fq: opts.fq });
  const json = await fetchJson(url);
  const res = json?.result;
  if (!res) return { count: 0, results: [] };
  const results: CanadaDataset[] = Array.isArray(res.results)
    ? res.results.map((r: any) => ({
        id: r.id,
        title: r.title,
        notes: r.notes,
        organization: r.organization?.title,
        metadata_created: r.metadata_created,
        metadata_modified: r.metadata_modified,
        resources: Array.isArray(r.resources)
          ? r.resources.map((x: any) => ({ format: x.format, url: x.url, name: x.name }))
          : []
      }))
    : [];
  return { count: Number(res.count || results.length), results };
}

// Predefined searches for common Canadian government data
export async function searchBudgetData(rows: number = 10): Promise<{ count: number; results: CanadaDataset[] }> {
  return searchCanadaData({ q: 'budget OR spending OR expenditure', rows, fq: 'organization:tbs-sct OR organization:fin' });
}

export async function searchImmigrationData(rows: number = 10): Promise<{ count: number; results: CanadaDataset[] }> {
  return searchCanadaData({ q: 'immigration OR refugee OR citizenship', rows, fq: 'organization:cic' });
}

export async function searchEnergyData(rows: number = 10): Promise<{ count: number; results: CanadaDataset[] }> {
  return searchCanadaData({ q: 'energy OR petroleum OR electricity', rows, fq: 'organization:nrcan-rncan' });
}
