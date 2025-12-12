// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Real Estate and Construction Data Library
// Sources: Census Bureau EITS (Construction), HUD (Fair Market Rents), FRED (Commercial RE Index)

import type {
  ConstructionPipeline,
  ConstructionSeries,
  HudFairMarketRent,
  CommercialRealEstateIndex,
  RealEstateSnapshot
} from './types';

// =============================================================================
// FRED: Construction Pipeline (Permits → Starts → Completions)
// Uses FRED API which mirrors Census data but with more reliable access
// =============================================================================

const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';

// FRED series codes for residential construction (mirrors Census data)
export const CONSTRUCTION_SERIES = {
  // Building Permits (leading indicator)
  PERMITS_TOTAL: 'PERMIT',          // New Privately-Owned Housing Units Authorized (thousands, SAAR)
  PERMITS_SINGLE: 'PERMITS1',       // Single-family permits
  PERMITS_MULTI: 'PERMIT5',         // Multi-family (5+ units) permits

  // Housing Starts (construction begins)
  STARTS_TOTAL: 'HOUST',            // Housing Starts: Total (thousands, SAAR)
  STARTS_SINGLE: 'HOUST1F',         // Single-family starts
  STARTS_MULTI: 'HOUST5F',          // Multi-family starts

  // Housing Completions (supply delivered)
  COMPLETIONS_TOTAL: 'COMPUTSA',    // Housing Completions: Total (thousands, SAAR)

  // Under Construction
  UNDER_CONSTRUCTION: 'UNDCONTNSA', // Housing Units Under Construction: Total
} as const;

async function fetchFredSeries(
  seriesId: string,
  apiKey?: string,
  observations: number = 24
): Promise<{ date: string; value: number }[]> {
  // Use fallback if no API key - FRED still returns limited data
  if (!apiKey) return [];

  try {
    const url = new URL(FRED_BASE);
    url.searchParams.set('series_id', seriesId);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('file_type', 'json');
    url.searchParams.set('sort_order', 'desc');
    url.searchParams.set('limit', observations.toString());

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' }
    });

    if (!res.ok) return [];

    const data = await res.json();

    const results: { date: string; value: number }[] = [];

    if (Array.isArray(data?.observations)) {
      for (const obs of data.observations) {
        const value = parseFloat(obs.value);
        if (!isNaN(value) && obs.date) {
          results.push({ date: obs.date, value });
        }
      }
    }

    // Reverse to chronological order (FRED returns desc)
    return results.reverse();
  } catch {
    return [];
  }
}

export async function getConstructionPipeline(apiKey?: string, months: number = 24): Promise<ConstructionPipeline> {
  // Fetch all three stages in parallel from FRED
  const [permits, starts, completions, underConstruction] = await Promise.all([
    fetchFredSeries(CONSTRUCTION_SERIES.PERMITS_TOTAL, apiKey, months),
    fetchFredSeries(CONSTRUCTION_SERIES.STARTS_TOTAL, apiKey, months),
    fetchFredSeries(CONSTRUCTION_SERIES.COMPLETIONS_TOTAL, apiKey, months),
    fetchFredSeries(CONSTRUCTION_SERIES.UNDER_CONSTRUCTION, apiKey, months)
  ]);

  // Calculate latest values and month-over-month changes
  const getLatestWithChange = (series: { date: string; value: number }[]) => {
    if (series.length === 0) return { latest: 0, previous: 0, change: 0, changePercent: 0 };
    const latest = series[series.length - 1]?.value || 0;
    const previous = series[series.length - 2]?.value || latest;
    const change = latest - previous;
    const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
    return { latest, previous, change, changePercent };
  };

  const permitsStats = getLatestWithChange(permits);
  const startsStats = getLatestWithChange(starts);
  const completionsStats = getLatestWithChange(completions);
  const underConstructionStats = getLatestWithChange(underConstruction);

  return {
    permits: {
      series: permits,
      latest: permitsStats.latest,
      monthOverMonth: permitsStats.changePercent,
      unit: 'thousands of units'
    },
    starts: {
      series: starts,
      latest: startsStats.latest,
      monthOverMonth: startsStats.changePercent,
      unit: 'thousands of units'
    },
    completions: {
      series: completions,
      latest: completionsStats.latest,
      monthOverMonth: completionsStats.changePercent,
      unit: 'thousands of units'
    },
    underConstruction: {
      series: underConstruction,
      latest: underConstructionStats.latest,
      monthOverMonth: underConstructionStats.changePercent,
      unit: 'thousands of units'
    },
    pipelineRatio: {
      permitsToStarts: startsStats.latest !== 0 ? permitsStats.latest / startsStats.latest : 0,
      startsToCompletions: completionsStats.latest !== 0 ? startsStats.latest / completionsStats.latest : 0,
      description: 'Ratio > 1 indicates pipeline expansion, < 1 indicates contraction'
    },
    latestPeriod: permits[permits.length - 1]?.date || ''
  };
}

// Single-family vs Multi-family breakdown
export async function getConstructionByType(apiKey?: string, months: number = 24): Promise<{
  singleFamily: ConstructionSeries;
  multiFamily: ConstructionSeries;
}> {
  const [permitsSingle, permitsMulti, startsSingle, startsMulti] = await Promise.all([
    fetchFredSeries(CONSTRUCTION_SERIES.PERMITS_SINGLE, apiKey, months),
    fetchFredSeries(CONSTRUCTION_SERIES.PERMITS_MULTI, apiKey, months),
    fetchFredSeries(CONSTRUCTION_SERIES.STARTS_SINGLE, apiKey, months),
    fetchFredSeries(CONSTRUCTION_SERIES.STARTS_MULTI, apiKey, months)
  ]);

  return {
    singleFamily: {
      permits: permitsSingle,
      starts: startsSingle
    },
    multiFamily: {
      permits: permitsMulti,
      starts: startsMulti
    }
  };
}

// =============================================================================
// HUD: Fair Market Rents (FMR)
// API Docs: https://www.huduser.gov/portal/dataset/fmr-api.html
// =============================================================================

const HUD_BASE = 'https://www.huduser.gov/hudapi/public/fmr';

export async function getFairMarketRents(
  entityId: string = 'METRO32820M32820', // Default: Memphis MSA
  year: number = new Date().getFullYear()
): Promise<HudFairMarketRent | null> {
  try {
    const url = `${HUD_BASE}/data/${entityId}?year=${year}`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json' }
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (!data?.data?.basicdata) return null;

    const basic = data.data.basicdata;

    return {
      entityId,
      areaName: basic.areaname || 'Unknown',
      year,
      efficiency: parseFloat(basic.Efficiency) || 0,
      oneBedroom: parseFloat(basic.One_Bedroom) || 0,
      twoBedroom: parseFloat(basic.Two_Bedroom) || 0,
      threeBedroom: parseFloat(basic.Three_Bedroom) || 0,
      fourBedroom: parseFloat(basic.Four_Bedroom) || 0,
      medianIncome: parseFloat(basic.median_income) || 0,
      smallAreaFmr: basic.smallarea_status === '1'
    };
  } catch {
    return null;
  }
}

// Get FMR for multiple major metros
export async function getMultiMetroFMR(year?: number): Promise<HudFairMarketRent[]> {
  const metros = [
    { id: 'METRO35620M35620', name: 'New York-Newark-Jersey City' },
    { id: 'METRO31080M31080', name: 'Los Angeles-Long Beach-Anaheim' },
    { id: 'METRO16980M16980', name: 'Chicago-Naperville-Elgin' },
    { id: 'METRO19100M19100', name: 'Dallas-Fort Worth-Arlington' },
    { id: 'METRO26420M26420', name: 'Houston-The Woodlands-Sugar Land' },
    { id: 'METRO47900M47900', name: 'Washington-Arlington-Alexandria' },
    { id: 'METRO33100M33100', name: 'Miami-Fort Lauderdale-Pompano Beach' },
    { id: 'METRO37980M37980', name: 'Philadelphia-Camden-Wilmington' },
    { id: 'METRO12060M12060', name: 'Atlanta-Sandy Springs-Alpharetta' },
    { id: 'METRO38060M38060', name: 'Phoenix-Mesa-Chandler' }
  ];

  const currentYear = year || new Date().getFullYear();

  const results = await Promise.all(
    metros.map(m => getFairMarketRents(m.id, currentYear))
  );

  return results.filter((r): r is HudFairMarketRent => r !== null);
}

// =============================================================================
// FRED: Commercial Real Estate Price Index
// Series: COMREPUSQ159N (quarterly, percentage change from year ago)
// =============================================================================

export async function getCommercialRealEstateIndex(
  apiKey?: string,
  observations: number = 20
): Promise<CommercialRealEstateIndex> {
  const series: { date: string; value: number }[] = [];

  if (!apiKey) {
    return { series, latestValue: 0, latestDate: '', yearOverYear: 0 };
  }

  try {
    const url = new URL(FRED_BASE);
    url.searchParams.set('series_id', 'COMREPUSQ159N');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('file_type', 'json');
    url.searchParams.set('sort_order', 'desc');
    url.searchParams.set('limit', observations.toString());

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' }
    });

    if (!res.ok) return { series, latestValue: 0, latestDate: '', yearOverYear: 0 };

    const data = await res.json();

    if (Array.isArray(data?.observations)) {
      for (const obs of data.observations) {
        const value = parseFloat(obs.value);
        if (!isNaN(value) && obs.date) {
          series.push({ date: obs.date, value });
        }
      }
    }

    // Reverse to chronological order
    series.reverse();

    const latestValue = series[series.length - 1]?.value || 0;
    const latestDate = series[series.length - 1]?.date || '';
    const yearAgoValue = series[series.length - 5]?.value || 0; // ~4 quarters ago
    const yearOverYear = latestValue - yearAgoValue;

    return {
      series,
      latestValue,
      latestDate,
      yearOverYear,
      description: 'Commercial Real Estate Price Index (YoY % Change)'
    };
  } catch {
    return { series, latestValue: 0, latestDate: '', yearOverYear: 0 };
  }
}

// Additional FRED housing series
export async function getHousingAffordabilityIndex(
  apiKey?: string
): Promise<{ series: { date: string; value: number }[]; latest: number }> {
  const series: { date: string; value: number }[] = [];

  if (!apiKey) return { series, latest: 0 };

  try {
    const url = new URL(FRED_BASE);
    url.searchParams.set('series_id', 'FIXHAI'); // Housing Affordability Index
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('file_type', 'json');
    url.searchParams.set('sort_order', 'desc');
    url.searchParams.set('limit', '24');

    const res = await fetch(url.toString());
    if (!res.ok) return { series, latest: 0 };

    const data = await res.json();

    if (Array.isArray(data?.observations)) {
      for (const obs of data.observations) {
        const value = parseFloat(obs.value);
        if (!isNaN(value)) {
          series.push({ date: obs.date, value });
        }
      }
    }

    series.reverse();
    return { series, latest: series[series.length - 1]?.value || 0 };
  } catch {
    return { series, latest: 0 };
  }
}

// Case-Shiller Home Price Index
export async function getCaseShillerIndex(
  apiKey?: string
): Promise<{ series: { date: string; value: number }[]; latest: number; yearOverYear: number }> {
  const series: { date: string; value: number }[] = [];

  if (!apiKey) return { series, latest: 0, yearOverYear: 0 };

  try {
    const url = new URL(FRED_BASE);
    url.searchParams.set('series_id', 'CSUSHPINSA'); // S&P/Case-Shiller U.S. National Home Price Index
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('file_type', 'json');
    url.searchParams.set('sort_order', 'desc');
    url.searchParams.set('limit', '24');

    const res = await fetch(url.toString());
    if (!res.ok) return { series, latest: 0, yearOverYear: 0 };

    const data = await res.json();

    if (Array.isArray(data?.observations)) {
      for (const obs of data.observations) {
        const value = parseFloat(obs.value);
        if (!isNaN(value)) {
          series.push({ date: obs.date, value });
        }
      }
    }

    series.reverse();
    const latest = series[series.length - 1]?.value || 0;
    const yearAgo = series[series.length - 13]?.value || latest; // 12 months ago
    const yearOverYear = yearAgo !== 0 ? ((latest - yearAgo) / yearAgo) * 100 : 0;

    return { series, latest, yearOverYear };
  } catch {
    return { series, latest: 0, yearOverYear: 0 };
  }
}

// =============================================================================
// AGGREGATED SNAPSHOT: All real estate metrics for dashboard
// =============================================================================

export async function getRealEstateSnapshot(fredApiKey?: string): Promise<RealEstateSnapshot> {
  const [pipeline, commercialIndex, caseShiller, affordability] = await Promise.all([
    getConstructionPipeline(fredApiKey, 24),
    getCommercialRealEstateIndex(fredApiKey, 20),
    getCaseShillerIndex(fredApiKey),
    getHousingAffordabilityIndex(fredApiKey)
  ]);

  return {
    construction: {
      permits: pipeline.permits.latest,
      permitsChange: pipeline.permits.monthOverMonth,
      starts: pipeline.starts.latest,
      startsChange: pipeline.starts.monthOverMonth,
      completions: pipeline.completions.latest,
      completionsChange: pipeline.completions.monthOverMonth,
      underConstruction: pipeline.underConstruction.latest,
      period: pipeline.latestPeriod,
      pipelineHealth: pipeline.pipelineRatio.permitsToStarts > 1 ? 'expanding' : 'contracting'
    },
    pricing: {
      caseShillerIndex: caseShiller.latest,
      caseShillerYoY: caseShiller.yearOverYear,
      commercialIndex: commercialIndex.latestValue,
      commercialYoY: commercialIndex.yearOverYear
    },
    affordability: {
      index: affordability.latest,
      description: 'Index > 100 means median family can afford median home'
    },
    timestamp: new Date().toISOString()
  };
}
