// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// GDELT 2.0 Document API with CAMEO Event Coding
// GDELT: Global Database of Events, Language, and Tone
// API Docs: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/

import type { GdeltDoc } from './types';

const GDELT_DOC = 'https://api.gdeltproject.org/v2/doc/doc';
const GDELT_GEO = 'https://api.gdeltproject.org/v2/geo/geo';

// =============================================================================
// CAMEO EVENT TAXONOMY (Conflict and Mediation Event Observations)
// Full list: http://data.gdeltproject.org/documentation/CAMEO.Manual.1.1b3.pdf
// =============================================================================

export const CAMEO_CODES = {
  // Cooperation (Positive Events)
  COOPERATION: {
    APPEAL: '01',              // Make public statement
    APPEAL_AID: '020',         // Appeal for aid
    EXPRESS_INTENT: '03',      // Express intent to cooperate
    CONSULT: '04',             // Consult
    DIPLOMATIC_COOP: '05',     // Engage in diplomatic cooperation
    MATERIAL_COOP: '06',       // Engage in material cooperation
    PROVIDE_AID: '07',         // Provide aid
    YIELD: '08',               // Yield
  },

  // Conflict (Negative Events)
  CONFLICT: {
    INVESTIGATE: '09',         // Investigate
    DEMAND: '10',              // Demand
    DISAPPROVE: '11',          // Disapprove
    REJECT: '12',              // Reject
    THREATEN: '13',            // Threaten
    PROTEST: '14',             // Protest
    EXHIBIT_FORCE: '15',       // Exhibit military posture
    REDUCE_RELATIONS: '16',    // Reduce relations
    COERCE: '17',              // Coerce
    ASSAULT: '18',             // Assault
    FIGHT: '19',               // Fight
    MASS_VIOLENCE: '20',       // Engage in unconventional mass violence
  }
} as const;

// CAMEO code ranges for categorization
export const CAMEO_RANGES = {
  COOPERATION: { min: 1, max: 8 },      // Codes 01-08: Cooperative events
  VERBAL_CONFLICT: { min: 9, max: 14 }, // Codes 09-14: Verbal conflict
  MATERIAL_CONFLICT: { min: 15, max: 20 } // Codes 15-20: Material conflict/violence
} as const;

// Country codes for geopolitical analysis
export const GEOPOLITICAL_REGIONS = {
  NATO: ['US', 'GB', 'FR', 'DE', 'CA', 'IT', 'PL', 'ES', 'NL', 'BE', 'NO', 'TR'],
  BRICS: ['BR', 'RU', 'IN', 'CN', 'ZA'],
  G7: ['US', 'JP', 'DE', 'GB', 'FR', 'IT', 'CA'],
  MIDDLE_EAST: ['SA', 'IR', 'IQ', 'SY', 'IL', 'AE', 'QA', 'KW', 'EG', 'JO'],
  EAST_ASIA: ['CN', 'JP', 'KR', 'KP', 'TW'],
  SOUTHEAST_ASIA: ['VN', 'TH', 'MY', 'ID', 'PH', 'SG', 'MM'],
} as const;

function buildUrl(params: Record<string, string | number | undefined>): string {
  // Build URL manually to preserve literal + signs in queries (GDELT requires +OR+ format)
  const queryParts: string[] = [];
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      // Replace spaces with + for GDELT OR queries
      const value = String(v).replace(/ OR /g, '+OR+').replace(/ /g, '+');
      queryParts.push(`${k}=${value}`);
    }
  });
  // Prefer JSON output when available
  if (!queryParts.some(p => p.startsWith('format='))) {
    queryParts.push('format=JSON');
  }
  return `${GDELT_DOC}?${queryParts.join('&')}`;
}

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'StackNews/1.0'
      }
    });
    if (!res.ok) {
      console.error(`GDELT fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    const text = await res.text();
    // Handle potential non-JSON responses
    if (!text || text.startsWith('<') || text.startsWith('The')) {
      console.error(`GDELT returned non-JSON: ${text.substring(0, 100)}`);
      return null;
    }
    return JSON.parse(text);
  } catch (err) {
    console.error(`GDELT fetch error:`, err);
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
    country: d.country || d.sourceCountry,
    tone: d.tone ? parseFloat(d.tone) : undefined
  })).filter((d: GdeltDoc) => !!d.url);
}

// =============================================================================
// THEMATIC QUERIES - Pre-built queries for specific intelligence domains
// =============================================================================

export const THEMATIC_QUERIES = {
  // Geopolitical Conflict - simple keyword queries work best with GDELT
  MILITARY_CONFLICT: 'military conflict',
  DIPLOMATIC_TENSIONS: 'diplomatic sanctions',
  PROTEST_CIVIL_UNREST: 'protest demonstration',

  // Economic Intelligence
  CENTRAL_BANKS: 'Federal Reserve central bank',
  TRADE_SANCTIONS: 'sanctions tariff',
  ENERGY_GEOPOLITICS: 'OPEC oil price',

  // Technology & Science
  AI_REGULATION: 'artificial intelligence regulation',
  CYBER_SECURITY: 'cyberattack ransomware',
  SPACE_TECH: 'NASA SpaceX satellite',

  // Climate & Environment
  CLIMATE_POLICY: 'climate summit carbon',
  NATURAL_DISASTERS: 'earthquake hurricane wildfire',

  // Regional Focus
  ASIA_PACIFIC: 'China Taiwan trade',
  MIDDLE_EAST: 'Israel Iran conflict',
  EUROPE: 'Ukraine Russia NATO',
} as const;

// =============================================================================
// GLOBAL STABILITY INDEX - Statistical abstraction of event tone
// =============================================================================

export interface GlobalStabilitySnapshot {
  timestamp: string;
  overallTone: number;  // Weighted average tone (-10 to +10)
  eventCounts: {
    total: number;
    cooperation: number;
    verbalConflict: number;
    materialConflict: number;
  };
  stabilityIndex: number;  // 0-100 scale (100 = most stable)
  regionalTones: Record<string, { tone: number; eventCount: number }>;
  topThemes: Array<{ theme: string; count: number; avgTone: number }>;
  hotspots: Array<{ country: string; tone: number; eventCount: number }>;
}

// Query GDELT GEO API for geographic event distribution
async function fetchGeoData(query: string, timespan: string = '24h'): Promise<any> {
  try {
    const url = new URL(GDELT_GEO);
    url.searchParams.set('query', query);
    url.searchParams.set('format', 'GeoJSON');
    url.searchParams.set('timespan', timespan);

    const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Calculate stability index from cooperation/conflict ratio
function calculateStabilityIndex(cooperation: number, verbalConflict: number, materialConflict: number): number {
  const total = cooperation + verbalConflict + materialConflict;
  if (total === 0) return 50; // Neutral when no data

  // Weight: cooperation positive, verbal conflict mild negative, material conflict severe negative
  const score = (cooperation * 1.0) - (verbalConflict * 0.3) - (materialConflict * 1.5);
  const normalized = Math.max(0, Math.min(100, 50 + (score / total) * 50));
  return Math.round(normalized * 10) / 10;
}

// Get Global Stability snapshot from GDELT
export async function getGlobalStabilitySnapshot(): Promise<GlobalStabilitySnapshot> {
  // Query for cooperation and conflict events - simple keywords work best
  const [coopDocs, conflictDocs, protestDocs] = await Promise.all([
    getGdeltDocs({ query: 'cooperation diplomatic treaty', maxrecords: 100 }),
    getGdeltDocs({ query: 'military conflict attack', maxrecords: 100 }),
    getGdeltDocs({ query: 'protest demonstration', maxrecords: 50 })
  ]);

  // Count by country
  const countryStats: Record<string, { tones: number[]; count: number }> = {};

  const processDocs = (docs: GdeltDoc[], category: 'coop' | 'conflict' | 'protest') => {
    docs.forEach(doc => {
      const country = doc.country || 'UNKNOWN';
      if (!countryStats[country]) {
        countryStats[country] = { tones: [], count: 0 };
      }
      countryStats[country].count++;
      if (doc.tone !== undefined) {
        countryStats[country].tones.push(doc.tone);
      }
    });
  };

  processDocs(coopDocs, 'coop');
  processDocs(conflictDocs, 'conflict');
  processDocs(protestDocs, 'protest');

  // Calculate average tones by country
  const regionalTones: Record<string, { tone: number; eventCount: number }> = {};
  Object.entries(countryStats).forEach(([country, stats]) => {
    const avgTone = stats.tones.length > 0
      ? stats.tones.reduce((a, b) => a + b, 0) / stats.tones.length
      : 0;
    regionalTones[country] = { tone: Math.round(avgTone * 100) / 100, eventCount: stats.count };
  });

  // Find hotspots (countries with negative tone and high event count)
  const hotspots = Object.entries(regionalTones)
    .filter(([_, data]) => data.tone < -2 && data.eventCount >= 3)
    .map(([country, data]) => ({ country, tone: data.tone, eventCount: data.eventCount }))
    .sort((a, b) => a.tone - b.tone)
    .slice(0, 10);

  // Calculate overall stability
  const totalEvents = coopDocs.length + conflictDocs.length + protestDocs.length;
  const stabilityIndex = calculateStabilityIndex(
    coopDocs.length,
    protestDocs.length,
    conflictDocs.length
  );

  // Calculate overall tone
  const allTones = [
    ...coopDocs.map(d => d.tone).filter((t): t is number => t !== undefined),
    ...conflictDocs.map(d => d.tone).filter((t): t is number => t !== undefined),
    ...protestDocs.map(d => d.tone).filter((t): t is number => t !== undefined)
  ];
  const overallTone = allTones.length > 0
    ? Math.round((allTones.reduce((a, b) => a + b, 0) / allTones.length) * 100) / 100
    : 0;

  return {
    timestamp: new Date().toISOString(),
    overallTone,
    eventCounts: {
      total: totalEvents,
      cooperation: coopDocs.length,
      verbalConflict: protestDocs.length,
      materialConflict: conflictDocs.length
    },
    stabilityIndex,
    regionalTones,
    topThemes: [], // Would require more complex query parsing
    hotspots
  };
}

// Get events by thematic category
export async function getThematicEvents(
  theme: keyof typeof THEMATIC_QUERIES,
  maxrecords: number = 50
): Promise<GdeltDoc[]> {
  const query = THEMATIC_QUERIES[theme];
  return getGdeltDocs({ query, maxrecords });
}

