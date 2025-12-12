// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Japan e-Stat Statistics Dashboard API wrapper (no registration required)
// API Docs: https://dashboard.e-stat.go.jp/en/static/api

import type { EStatIndicator, EStatDataPoint } from './types';

const ESTAT_BASE = 'https://dashboard.e-stat.go.jp/api/1.0/Json';

// Key economic indicators for Japan
export const INDICATORS = {
  // Demographics
  POPULATION: '0201010000000010000',           // Total population
  BIRTH_RATE: '0202020000000010010',           // Birth rate

  // Labor
  UNEMPLOYMENT_RATE: '0301010000020020010',    // Unemployment rate (both sexes)
  LABOR_FORCE: '0301010000010010010',          // Labor force

  // Economy/GDP
  GDP_DEFLATOR: '0705010404010010010',         // GDP deflator (2015 base)
  NET_EXPORTS: '0705010401000010050',          // Net exports (2015 base)

  // Prices
  CPI_YOY: '0703010501010030000',              // CPI YoY change (2020 base)
  CPI_CORE: '0703010501010030010',             // CPI Core YoY (less fresh food)
} as const;

// Regional rank codes
export const REGIONAL_RANK = {
  COUNTRY: '1',      // Country
  JAPAN: '2',        // Nationwide (Japan)
  PREFECTURE: '3',   // Prefecture
  CITY: '4',         // City
} as const;

// Cycle codes
export const CYCLE = {
  MONTHLY: '1',
  QUARTERLY: '2',
  CALENDAR_YEAR: '3',
  FISCAL_YEAR: '4',
} as const;

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export interface SearchIndicatorsOptions {
  keyword: string;
  lang?: 'EN' | 'JP';
}

export async function searchIndicators(opts: SearchIndicatorsOptions): Promise<EStatIndicator[]> {
  const lang = opts.lang || 'EN';
  const url = `${ESTAT_BASE}/getIndicatorInfo?Lang=${lang}&SearchIndicatorWord=${encodeURIComponent(opts.keyword)}`;
  const json = await fetchJson(url);

  const classObjs = json?.GET_META_INDICATOR_INF?.METADATA_INF?.CLASS_INF?.CLASS_OBJ;
  if (!Array.isArray(classObjs)) return [];

  return classObjs.map((obj: any) => ({
    code: obj['@code'],
    name: obj['@name'],
    classes: Array.isArray(obj.CLASS) ? obj.CLASS.map((c: any) => ({
      name: c['@name'],
      shortName: c['@sname'],
      fromDate: c['@fromDate'],
      toDate: c['@toDate'],
      cycle: c.cycle?.['@name'],
      unit: c['@unit'],
      statName: c['@statName'],
    })) : [],
  }));
}

export interface GetDataOptions {
  indicatorCode: string;
  regionalRank?: string;   // '2' for nationwide Japan
  cycle?: string;          // '1'=Monthly, '2'=Quarterly, '3'=Calendar Year
  isSeasonalAdjustment?: string; // '1'=Original, '2'=Seasonally Adjusted
  lang?: 'EN' | 'JP';
}

export async function getData(opts: GetDataOptions): Promise<EStatDataPoint[]> {
  const params = new URLSearchParams({
    Lang: opts.lang || 'EN',
    IndicatorCode: opts.indicatorCode,
    RegionalRank: opts.regionalRank || REGIONAL_RANK.JAPAN,
    Cycle: opts.cycle || CYCLE.CALENDAR_YEAR,
    IsSeasonalAdjustment: opts.isSeasonalAdjustment || '1',
  });

  const url = `${ESTAT_BASE}/getData?${params.toString()}`;
  const json = await fetchJson(url);

  const dataObjs = json?.GET_STATS?.STATISTICAL_DATA?.DATA_INF?.DATA_OBJ;
  if (!Array.isArray(dataObjs)) return [];

  return dataObjs.map((obj: any) => {
    const v = obj.VALUE;
    return {
      time: v?.['@time'] || '',
      value: v?.['$'] ? parseFloat(v['$']) : null,
      unit: v?.['@unit'] || '',
      indicator: v?.['@indicator'] || '',
      annotation: obj.CELL_ANNOTATIONS?.['$'] || '',
    };
  }).filter((d: EStatDataPoint) => d.value !== null);
}

// Preset data fetchers for common economic indicators

export async function getUnemploymentRate(): Promise<EStatDataPoint[]> {
  return getData({
    indicatorCode: INDICATORS.UNEMPLOYMENT_RATE,
    cycle: CYCLE.MONTHLY,
    regionalRank: REGIONAL_RANK.JAPAN,
  });
}

export async function getPopulation(): Promise<EStatDataPoint[]> {
  return getData({
    indicatorCode: INDICATORS.POPULATION,
    cycle: CYCLE.CALENDAR_YEAR,
    regionalRank: REGIONAL_RANK.JAPAN,
  });
}

export async function getCPIChange(): Promise<EStatDataPoint[]> {
  return getData({
    indicatorCode: INDICATORS.CPI_YOY,
    cycle: CYCLE.MONTHLY,
    regionalRank: REGIONAL_RANK.JAPAN,
  });
}

export async function getCoreCPI(): Promise<EStatDataPoint[]> {
  return getData({
    indicatorCode: INDICATORS.CPI_CORE,
    cycle: CYCLE.MONTHLY,
    regionalRank: REGIONAL_RANK.JAPAN,
  });
}

// Get a snapshot of key Japan economic indicators
export interface JapanEconomicSnapshot {
  population?: { value: number; date: string };
  unemploymentRate?: { value: number; date: string };
  cpiYoY?: { value: number; date: string };
  coreCPI?: { value: number; date: string };
}

export async function getJapanSnapshot(): Promise<JapanEconomicSnapshot> {
  const [popData, unempData, cpiData, coreCpiData] = await Promise.all([
    getPopulation(),
    getUnemploymentRate(),
    getCPIChange(),
    getCoreCPI(),
  ]);

  const latest = (arr: EStatDataPoint[]) => {
    if (!arr.length) return undefined;
    const sorted = [...arr].sort((a, b) => b.time.localeCompare(a.time));
    const l = sorted[0];
    return l.value !== null ? { value: l.value, date: l.time } : undefined;
  };

  return {
    population: latest(popData),
    unemploymentRate: latest(unempData),
    cpiYoY: latest(cpiData),
    coreCPI: latest(coreCpiData),
  };
}
