// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// NASA Open APIs: Planetary Intelligence
// DONKI (Space Weather Database): Solar Flares, CME, Geomagnetic Storms
// EONET: Earth Observatory Natural Event Tracker
// API Docs: https://api.nasa.gov/

import type {
  SolarFlareEvent,
  CoronalMassEjection,
  GeomagneticStorm,
  SpaceWeatherSnapshot,
  EonetEvent,
  EonetSnapshot
} from './types';

const DONKI_BASE = 'https://api.nasa.gov/DONKI';
const EONET_BASE = 'https://eonet.gsfc.nasa.gov/api/v3';

// =============================================================================
// DONKI SPACE WEATHER - Critical for Energy Sector Infrastructure
// Solar events can disrupt power grids, satellites, and communications
// =============================================================================

function buildDonkiUrl(path: string, params: Record<string, string | number | undefined>): string {
  const url = new URL(DONKI_BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  return url.toString();
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
      console.error(`NASA API fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`NASA API fetch error:`, err);
    return null;
  }
}

// Solar Flare Classification (for interpretation):
// A, B, C: Minor - no significant impact
// M: Moderate - can cause brief radio blackouts
// X: Major - can cause widespread radio blackouts, radiation storms
// X10+: Extreme - potential for grid damage

export async function getSolarFlares(
  apiKey: string,
  startDate: string,
  endDate: string
): Promise<SolarFlareEvent[]> {
  const url = buildDonkiUrl('/FLR', { startDate, endDate, api_key: apiKey });
  const json = await fetchJson(url);
  if (!Array.isArray(json)) return [];

  return json.map((e: any) => ({
    flareID: e.flrID || e.flareID || e.activityID || '',
    classType: e.classType,
    sourceLocation: e.sourceLocation,
    beginTime: e.beginTime,
    peakTime: e.peakTime,
    endTime: e.endTime,
    linkedEvents: e.linkedEvents || []
  }));
}

// Coronal Mass Ejection (CME)
// Large expulsions of plasma and magnetic field from the Sun
// Can cause geomagnetic storms if Earth-directed

export async function getCoronalMassEjections(
  apiKey: string,
  startDate: string,
  endDate: string
): Promise<CoronalMassEjection[]> {
  const url = buildDonkiUrl('/CME', { startDate, endDate, api_key: apiKey });
  const json = await fetchJson(url);
  if (!Array.isArray(json)) return [];

  return json.map((e: any) => ({
    activityID: e.activityID || '',
    startTime: e.startTime,
    sourceLocation: e.sourceLocation,
    note: e.note,
    instruments: e.instruments?.map((i: any) => i.displayName) || [],
    cmeAnalyses: e.cmeAnalyses?.map((a: any) => ({
      speed: a.speed,
      type: a.type,
      latitude: a.latitude,
      longitude: a.longitude,
      halfAngle: a.halfAngle,
      isMostAccurate: a.isMostAccurate,
      time21_5: a.time21_5 // Time to reach 21.5 solar radii
    })) || [],
    linkedEvents: e.linkedEvents || []
  }));
}

// Geomagnetic Storm (GST)
// Disturbances in Earth's magnetosphere caused by solar wind/CME
// Kp Index Scale:
// 0-4: Quiet to Minor - minimal impact
// 5: G1 Minor - weak power grid fluctuations
// 6: G2 Moderate - high-latitude power systems may need voltage corrections
// 7: G3 Strong - voltage corrections needed, transformer damage possible
// 8: G4 Severe - widespread voltage control problems
// 9: G5 Extreme - widespread grid collapse possible

export async function getGeomagneticStorms(
  apiKey: string,
  startDate: string,
  endDate: string
): Promise<GeomagneticStorm[]> {
  const url = buildDonkiUrl('/GST', { startDate, endDate, api_key: apiKey });
  const json = await fetchJson(url);
  if (!Array.isArray(json)) return [];

  return json.map((e: any) => ({
    gstID: e.gstID || '',
    startTime: e.startTime,
    allKpIndex: e.allKpIndex?.map((k: any) => ({
      observedTime: k.observedTime,
      kpIndex: k.kpIndex,
      source: k.source
    })) || [],
    linkedEvents: e.linkedEvents || []
  }));
}

// Solar Energetic Particle (SEP) Events
// High-energy particles from solar flares that can damage spacecraft and endanger astronauts

export async function getSolarEnergeticParticles(
  apiKey: string,
  startDate: string,
  endDate: string
): Promise<any[]> {
  const url = buildDonkiUrl('/SEP', { startDate, endDate, api_key: apiKey });
  const json = await fetchJson(url);
  if (!Array.isArray(json)) return [];

  return json.map((e: any) => ({
    sepID: e.sepID || '',
    eventTime: e.eventTime,
    instruments: e.instruments?.map((i: any) => i.displayName) || [],
    linkedEvents: e.linkedEvents || []
  }));
}

// Interplanetary Shock (IPS)
// Shock waves in the solar wind, often preceding CME arrival

export async function getInterplanetaryShocks(
  apiKey: string,
  startDate: string,
  endDate: string
): Promise<any[]> {
  const url = buildDonkiUrl('/IPS', { startDate, endDate, api_key: apiKey });
  const json = await fetchJson(url);
  if (!Array.isArray(json)) return [];

  return json.map((e: any) => ({
    ipsID: e.ipsID || '',
    catalog: e.catalog,
    activityID: e.activityID,
    location: e.location,
    eventTime: e.eventTime,
    instruments: e.instruments?.map((i: any) => i.displayName) || []
  }));
}

// High-Speed Stream (HSS)
// Streams of fast solar wind from coronal holes

export async function getHighSpeedStreams(
  apiKey: string,
  startDate: string,
  endDate: string
): Promise<any[]> {
  const url = buildDonkiUrl('/HSS', { startDate, endDate, api_key: apiKey });
  const json = await fetchJson(url);
  if (!Array.isArray(json)) return [];

  return json.map((e: any) => ({
    hssID: e.hssID || '',
    eventTime: e.eventTime,
    instruments: e.instruments?.map((i: any) => i.displayName) || [],
    linkedEvents: e.linkedEvents || []
  }));
}

// Comprehensive Space Weather Snapshot
// Aggregates all DONKI data into a single intelligence briefing

export async function getSpaceWeatherSnapshot(
  apiKey: string,
  days: number = 7
): Promise<SpaceWeatherSnapshot> {
  const end = new Date();
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const startDate = formatDate(start);
  const endDate = formatDate(end);

  const [flares, cmes, storms, seps, ips, hss] = await Promise.all([
    getSolarFlares(apiKey, startDate, endDate),
    getCoronalMassEjections(apiKey, startDate, endDate),
    getGeomagneticStorms(apiKey, startDate, endDate),
    getSolarEnergeticParticles(apiKey, startDate, endDate),
    getInterplanetaryShocks(apiKey, startDate, endDate),
    getHighSpeedStreams(apiKey, startDate, endDate)
  ]);

  // Calculate threat level based on recent activity
  const xFlares = flares.filter(f => f.classType?.startsWith('X')).length;
  const mFlares = flares.filter(f => f.classType?.startsWith('M')).length;
  const severeStorms = storms.filter(s =>
    s.allKpIndex?.some(k => k.kpIndex >= 7)
  ).length;
  const moderateStorms = storms.filter(s =>
    s.allKpIndex?.some(k => k.kpIndex >= 5 && k.kpIndex < 7)
  ).length;

  // Threat scoring: X flares and severe storms are high impact
  const threatScore = (xFlares * 10) + (mFlares * 3) + (severeStorms * 8) + (moderateStorms * 2) + (cmes.length * 1);

  let threatLevel: 'low' | 'moderate' | 'elevated' | 'high' | 'extreme';
  if (threatScore >= 30) threatLevel = 'extreme';
  else if (threatScore >= 20) threatLevel = 'high';
  else if (threatScore >= 10) threatLevel = 'elevated';
  else if (threatScore >= 5) threatLevel = 'moderate';
  else threatLevel = 'low';

  // Get maximum Kp index from recent storms
  const maxKp = storms.reduce((max, s) => {
    const stormMax = s.allKpIndex?.reduce((m, k) => Math.max(m, k.kpIndex || 0), 0) || 0;
    return Math.max(max, stormMax);
  }, 0);

  return {
    timestamp: new Date().toISOString(),
    period: { start: startDate, end: endDate, days },
    summary: {
      totalEvents: flares.length + cmes.length + storms.length + seps.length + ips.length + hss.length,
      solarFlares: flares.length,
      xClassFlares: xFlares,
      mClassFlares: mFlares,
      coronalMassEjections: cmes.length,
      geomagneticStorms: storms.length,
      solarEnergeticParticles: seps.length,
      interplanetaryShocks: ips.length,
      highSpeedStreams: hss.length
    },
    threatAssessment: {
      level: threatLevel,
      score: threatScore,
      maxKpIndex: maxKp,
      gridRisk: maxKp >= 7 ? 'high' : maxKp >= 5 ? 'moderate' : 'low',
      satelliteRisk: xFlares > 0 || seps.length > 0 ? 'elevated' : 'low',
      radioBlackoutRisk: xFlares > 0 ? 'high' : mFlares > 0 ? 'moderate' : 'low'
    },
    recentFlares: flares.slice(0, 10),
    recentCMEs: cmes.slice(0, 5),
    recentStorms: storms.slice(0, 5)
  };
}

// =============================================================================
// EONET - Earth Observatory Natural Event Tracker
// Real-time tracking of natural events: wildfires, volcanoes, severe storms, etc.
// =============================================================================

// EONET Category IDs
export const EONET_CATEGORIES = {
  DROUGHT: 'drought',
  DUST_HAZE: 'dustHaze',
  EARTHQUAKES: 'earthquakes',
  FLOODS: 'floods',
  LANDSLIDES: 'landslides',
  MANMADE: 'manmade',
  SEA_LAKE_ICE: 'seaLakeIce',
  SEVERE_STORMS: 'severeStorms',
  SNOW: 'snow',
  TEMPERATURE_EXTREMES: 'tempExtremes',
  VOLCANOES: 'volcanoes',
  WATER_COLOR: 'waterColor',
  WILDFIRES: 'wildfires'
} as const;

export async function getEonetEvents(
  days?: number,
  status: 'open' | 'closed' | 'all' = 'open',
  category?: string,
  limit?: number
): Promise<EonetEvent[]> {
  const params = new URLSearchParams();
  if (days) params.set('days', String(days));
  if (status !== 'all') params.set('status', status);
  if (category) params.set('category', category);
  if (limit) params.set('limit', String(limit));

  const url = `${EONET_BASE}/events?${params.toString()}`;
  const json = await fetchJson(url);
  if (!json?.events || !Array.isArray(json.events)) return [];

  return json.events.map((e: any) => ({
    id: e.id || '',
    title: e.title,
    description: e.description,
    link: e.link,
    closed: e.closed,
    categories: e.categories?.map((c: any) => ({
      id: c.id,
      title: c.title
    })) || [],
    sources: e.sources?.map((s: any) => ({
      id: s.id,
      url: s.url
    })) || [],
    geometry: e.geometry?.map((g: any) => ({
      date: g.date,
      type: g.type,
      coordinates: g.coordinates,
      magnitudeValue: g.magnitudeValue,
      magnitudeUnit: g.magnitudeUnit
    })) || []
  }));
}

// Get EONET categories with counts
export async function getEonetCategories(): Promise<Array<{ id: string; title: string; description: string }>> {
  const url = `${EONET_BASE}/categories`;
  const json = await fetchJson(url);
  if (!json?.categories || !Array.isArray(json.categories)) return [];

  return json.categories.map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description
  }));
}

// Get comprehensive Earth events snapshot
export async function getEonetSnapshot(days: number = 30): Promise<EonetSnapshot> {
  const [allEvents, categories] = await Promise.all([
    getEonetEvents(days, 'open', undefined, 100),
    getEonetCategories()
  ]);

  // Count by category
  const byCategory: Record<string, number> = {};
  allEvents.forEach(event => {
    event.categories.forEach(cat => {
      byCategory[cat.id] = (byCategory[cat.id] || 0) + 1;
    });
  });

  // Get recent events by type for dashboard
  const wildfires = allEvents.filter(e => e.categories.some(c => c.id === 'wildfires'));
  const volcanoes = allEvents.filter(e => e.categories.some(c => c.id === 'volcanoes'));
  const severeStorms = allEvents.filter(e => e.categories.some(c => c.id === 'severeStorms'));
  const seaIce = allEvents.filter(e => e.categories.some(c => c.id === 'seaLakeIce'));

  return {
    timestamp: new Date().toISOString(),
    period: { days },
    summary: {
      totalActiveEvents: allEvents.length,
      byCategory
    },
    highlights: {
      activeWildfires: wildfires.length,
      activeVolcanoes: volcanoes.length,
      severeStorms: severeStorms.length,
      seaIceEvents: seaIce.length
    },
    recentEvents: allEvents.slice(0, 20),
    categories
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
