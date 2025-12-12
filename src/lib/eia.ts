// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// EIA v2 series wrappers - comprehensive energy data for petroleum, natural gas, electricity, and nuclear
// API Docs: https://www.eia.gov/opendata/documentation.php

import type { EiaSeries, EiaImportsByCountry, EiaGenerationMix, EiaNuclearOutage, EiaSnapshot } from './types';

const EIA_BASE = 'https://api.eia.gov/v2';

// Key dataset routes
export const EIA_ROUTES = {
  // Petroleum
  CRUDE_STOCKS: '/petroleum/sum/sndw/data/',     // Weekly US Ending Stocks of Crude Oil
  CRUDE_IMPORTS: '/petroleum/move/imp/data/',    // Crude Oil Imports by Country of Origin
  // Natural Gas
  NATGAS_STORAGE: '/natural-gas/stor/wkly/data/', // Weekly Natural Gas Storage
  // Electricity
  GENERATION_MIX: '/electricity/electric-power-operational-data/data/', // Generation by Source
  HOURLY_DEMAND: '/electricity/rto/daily-region-sub-ba-data/data/',     // Hourly Grid Demand
  // Nuclear
  NUCLEAR_OUTAGES: '/nuclear-outages/facility-nuclear-outages/data/',   // Daily Nuclear Outages
} as const;

// Major crude oil import source countries
export const IMPORT_COUNTRIES = ['CA', 'MX', 'SA', 'IQ', 'CO', 'EC', 'NI', 'BR', 'UK', 'RU'] as const;

// Fuel types for generation mix
export const FUEL_TYPES = {
  ALL: 'ALL',
  COW: 'COW', // Coal
  NG: 'NG',   // Natural Gas
  NUC: 'NUC', // Nuclear
  HYC: 'HYC', // Hydroelectric
  WND: 'WND', // Wind
  SUN: 'SUN', // Solar
  PEL: 'PEL', // Petroleum
  OTH: 'OTH', // Other
} as const;

function buildUrl(path: string, params: Record<string, string | number | undefined>): string {
  const url = new URL(EIA_BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  return url.toString();
}

// Build URL with array-style facet parameters (EIA v2 requires this format)
function buildUrlWithFacets(
  path: string,
  baseParams: Record<string, string | number | undefined>,
  facets: Record<string, string[]> = {}
): string {
  const url = new URL(EIA_BASE + path);

  // Add base params
  Object.entries(baseParams).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  // Add array-style facets: facets[key][]=value
  Object.entries(facets).forEach(([facetKey, values]) => {
    values.forEach(val => {
      url.searchParams.append(`facets[${facetKey}][]`, val);
    });
  });

  // Add data array parameter
  url.searchParams.append('data[0]', 'value');

  // Add sort
  url.searchParams.append('sort[0][column]', 'period');
  url.searchParams.append('sort[0][direction]', 'desc');

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

// =============================================================================
// PETROLEUM: Weekly Crude Oil Stocks
// =============================================================================
export async function getEiaPetroleumWeeklyStocks(apiKey?: string, limit: number = 26): Promise<EiaSeries> {
  const url = buildUrlWithFacets(
    EIA_ROUTES.CRUDE_STOCKS,
    { api_key: apiKey, frequency: 'weekly', offset: 0, length: limit },
    { duoarea: ['NUS'], product: ['EPC0'] } // National US, Crude Oil
  );
  const json = await fetchJson(url);

  const series = Array.isArray(json?.response?.data)
    ? json.response.data
        .map((d: any) => ({ date: d.period, value: Number(d.value) }))
        .filter((p: any) => p.date && !isNaN(p.value))
        .reverse()
    : [];

  return { series, dataset: 'petroleum', unit: 'thousand barrels' };
}

// =============================================================================
// PETROLEUM: Crude Oil Imports by Country of Origin
// =============================================================================
export async function getEiaCrudeImports(apiKey?: string, limit: number = 24): Promise<EiaImportsByCountry> {
  // Fetch imports for top source countries (monthly data)
  const results: Record<string, { date: string; value: number }[]> = {};

  for (const country of IMPORT_COUNTRIES) {
    const url = buildUrlWithFacets(
      EIA_ROUTES.CRUDE_IMPORTS,
      { api_key: apiKey, frequency: 'monthly', offset: 0, length: limit },
      { originId: [country], productName: ['Crude Oil'] }
    );
    const json = await fetchJson(url);

    if (Array.isArray(json?.response?.data)) {
      results[country] = json.response.data
        .map((d: any) => ({ date: d.period, value: Number(d.value) || 0 }))
        .filter((p: any) => p.date)
        .reverse();
    }
  }

  // Calculate totals and percentages for latest period
  const latestTotals: { country: string; value: number; percentage: number }[] = [];
  let totalImports = 0;

  Object.entries(results).forEach(([country, series]) => {
    if (series.length > 0) {
      const latest = series[series.length - 1].value;
      totalImports += latest;
      latestTotals.push({ country, value: latest, percentage: 0 });
    }
  });

  // Calculate percentages
  latestTotals.forEach(item => {
    item.percentage = totalImports > 0 ? (item.value / totalImports) * 100 : 0;
  });

  // Sort by value descending
  latestTotals.sort((a, b) => b.value - a.value);

  return {
    byCountry: results,
    latestTotals,
    totalImports,
    unit: 'thousand barrels',
    period: Object.values(results)[0]?.[Object.values(results)[0]?.length - 1]?.date || ''
  };
}

// =============================================================================
// NATURAL GAS: Weekly Storage
// =============================================================================
export async function getEiaNatGasWeeklyStorage(apiKey?: string, limit: number = 26): Promise<EiaSeries> {
  const url = buildUrlWithFacets(
    EIA_ROUTES.NATGAS_STORAGE,
    { api_key: apiKey, frequency: 'weekly', offset: 0, length: limit },
    { process: ['SAL'] } // Salt dome storage (most volatile)
  );
  const json = await fetchJson(url);

  const series = Array.isArray(json?.response?.data)
    ? json.response.data
        .map((d: any) => ({ date: d.period, value: Number(d.value) }))
        .filter((p: any) => p.date && !isNaN(p.value))
        .reverse()
    : [];

  return { series, dataset: 'natgas', unit: 'billion cubic feet' };
}

// =============================================================================
// ELECTRICITY: Generation Mix by Fuel Type
// =============================================================================
export async function getEiaGenerationMix(apiKey?: string, limit: number = 12): Promise<EiaGenerationMix> {
  // Fetch monthly generation data for all fuel types
  const results: Record<string, { date: string; value: number }[]> = {};
  const fuelTypes = ['COW', 'NG', 'NUC', 'HYC', 'WND', 'SUN', 'PEL'];

  for (const fuel of fuelTypes) {
    const url = buildUrlWithFacets(
      EIA_ROUTES.GENERATION_MIX,
      { api_key: apiKey, frequency: 'monthly', offset: 0, length: limit },
      { sectorid: ['99'], fueltypeid: [fuel], location: ['US'] }
    );
    // Override the data field for this endpoint
    const urlObj = new URL(url);
    urlObj.searchParams.delete('data[0]');
    urlObj.searchParams.append('data[0]', 'generation');

    const json = await fetchJson(urlObj.toString());

    if (Array.isArray(json?.response?.data)) {
      results[fuel] = json.response.data
        .map((d: any) => ({ date: d.period, value: Number(d.generation) || 0 }))
        .filter((p: any) => p.date)
        .reverse();
    } else {
      results[fuel] = [];
    }
  }

  // Calculate latest mix percentages
  const latestMix: { fuel: string; name: string; generation: number; percentage: number }[] = [];
  let totalGeneration = 0;

  const fuelNames: Record<string, string> = {
    COW: 'Coal',
    NG: 'Natural Gas',
    NUC: 'Nuclear',
    HYC: 'Hydroelectric',
    WND: 'Wind',
    SUN: 'Solar',
    PEL: 'Petroleum'
  };

  Object.entries(results).forEach(([fuel, series]) => {
    if (series.length > 0) {
      const latest = series[series.length - 1].value;
      totalGeneration += latest;
      latestMix.push({ fuel, name: fuelNames[fuel] || fuel, generation: latest, percentage: 0 });
    }
  });

  // Calculate percentages
  latestMix.forEach(item => {
    item.percentage = totalGeneration > 0 ? (item.generation / totalGeneration) * 100 : 0;
  });

  // Sort by generation descending
  latestMix.sort((a, b) => b.generation - a.generation);

  return {
    byFuel: results,
    latestMix,
    totalGeneration,
    unit: 'thousand megawatthours',
    period: Object.values(results)[0]?.[Object.values(results)[0]?.length - 1]?.date || ''
  };
}

// =============================================================================
// NUCLEAR: Facility Outages
// =============================================================================
export async function getEiaNuclearOutages(apiKey?: string, limit: number = 100): Promise<EiaNuclearOutage[]> {
  const url = buildUrlWithFacets(
    EIA_ROUTES.NUCLEAR_OUTAGES,
    { api_key: apiKey, frequency: 'daily', offset: 0, length: limit },
    {}
  );
  const json = await fetchJson(url);

  if (!Array.isArray(json?.response?.data)) return [];

  return json.response.data.map((d: any) => ({
    period: d.period,
    plantName: d['plantName'] || d['facility-name'] || 'Unknown',
    unitName: d['unitName'] || d['unit-name'] || '',
    capacity: Number(d['netCapacity'] || d['net-capacity'] || d['value']) || 0,
    outageType: d['outageType'] || d['outage-type'] || '',
    status: d['status'] || 'outage',
    region: d['region'] || ''
  }));
}

// =============================================================================
// AGGREGATED SNAPSHOT: Key energy metrics for dashboard
// =============================================================================
export async function getEiaSnapshot(apiKey?: string): Promise<EiaSnapshot> {
  // Fetch all key metrics in parallel
  const [petroleum, natgas, generationMix, imports] = await Promise.all([
    getEiaPetroleumWeeklyStocks(apiKey, 52),  // 1 year of weekly data
    getEiaNatGasWeeklyStorage(apiKey, 52),
    getEiaGenerationMix(apiKey, 12),          // 1 year of monthly data
    getEiaCrudeImports(apiKey, 12)
  ]);

  // Calculate week-over-week and year-over-year changes for petroleum
  const petroSeries = petroleum.series;
  const latestPetro = petroSeries[petroSeries.length - 1]?.value || 0;
  const weekAgoPetro = petroSeries[petroSeries.length - 2]?.value || latestPetro;
  const yearAgoPetro = petroSeries[0]?.value || latestPetro;

  const natgasSeries = natgas.series;
  const latestNatgas = natgasSeries[natgasSeries.length - 1]?.value || 0;
  const weekAgoNatgas = natgasSeries[natgasSeries.length - 2]?.value || latestNatgas;

  return {
    petroleum: {
      latestStocks: latestPetro,
      weekOverWeekChange: latestPetro - weekAgoPetro,
      yearOverYearChange: latestPetro - yearAgoPetro,
      history: petroSeries.slice(-26) // Last 6 months
    },
    naturalGas: {
      latestStorage: latestNatgas,
      weekOverWeekChange: latestNatgas - weekAgoNatgas,
      history: natgasSeries.slice(-26)
    },
    generationMix: {
      latest: generationMix.latestMix,
      totalGeneration: generationMix.totalGeneration,
      period: generationMix.period
    },
    imports: {
      topSources: imports.latestTotals.slice(0, 5),
      totalImports: imports.totalImports,
      period: imports.period
    },
    timestamp: new Date().toISOString()
  };
}

