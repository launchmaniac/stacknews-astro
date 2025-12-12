// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// GDELT 2.0 Document API (simplified wrapper)

import type { GdeltDoc } from './types';

const GDELT_DOC = 'https://api.gdeltproject.org/v2/doc/doc';

function buildUrl(params: Record<string, string | number | undefined>): string {
  const url = new URL(GDELT_DOC);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  // Prefer JSON output when available
  if (!url.searchParams.has('format')) url.searchParams.set('format', 'JSON');
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

export interface GdeltQueryOptions {
  query: string; // e.g., conflict OR protest
  startdatetime?: string; // YYYYMMDDHHMMSS
  enddatetime?: string; // YYYYMMDDHHMMSS
  maxrecords?: number; // limit results
}

export async function getGdeltDocs(opts: GdeltQueryOptions): Promise<GdeltDoc[]> {
  const url = buildUrl({
    query: opts.query,
    startdatetime: opts.startdatetime,
    enddatetime: opts.enddatetime,
    maxrecords: opts.maxrecords || 50,
    format: 'JSON'
  });
  const json = await fetchJson(url);
  const arr = Array.isArray(json?.articles)
    ? json.articles
    : Array.isArray(json?.docs) ? json.docs : Array.isArray(json) ? json : [];

  return arr.map((d: any) => ({
    url: d.url || d.sourceUrl || '',
    title: d.title || d.seendate || undefined,
    language: d.language || d.lang,
    domain: d.domain || d.sourceDomain,
    timestamp: d.seendate || d.timestamp,
    country: d.country || d.sourceCountry
  })).filter((d: GdeltDoc) => !!d.url);
}

