// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com

export interface RSSItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure?: Record<string, any>;
  categories: string[];
  sourceName?: string;
  color?: string;
}

export type CategoryType =
  | 'TREASURY'
  | 'FEDERAL RESERVE'
  | 'MORTGAGE'
  | 'REAL ESTATE'
  | 'LEGISLATION'
  | 'REGULATION'
  | 'EXECUTIVE'
  | 'NEWS'
  | 'CANADA'
  | 'STATE_DEPT'
  | 'RESEARCH'
  | 'CRYPTO'
  | 'UK'
  | 'MILITARY'
  | 'ENERGY'
  | 'ASIA_PACIFIC'
  | 'EUROZONE'
  | 'GLOBAL_MACRO'
  | 'JAPAN';

export interface FeedConfig {
  id: string;
  url: string;
  name: string;
  color: string;
  category: CategoryType;
}

export interface FeedState {
  items: RSSItem[];
  loading: boolean;
  error: boolean;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  type: 'MARKET' | 'CRYPTO' | 'BOND' | 'COMM' | 'FX';
}

export interface FredObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
}

export interface TreasuryData {
  debt: number;
  debtHistory: { value: number }[];
  cash: number;
  gold: number;
  interestRate: number;
  ratesHistory: { value: number }[];
}

export interface MacroData {
  fedFunds: { value: number; date: string }[];
  yieldSpread: number | null;
  spreadHistory: { value: number }[];
  cpiYOY: number | null;
  cpiHistory: { value: number }[];
  cpiTrend: 'up' | 'down' | 'neutral';
}

export interface CentralBankRate {
  country: string;
  bank: string;
  rate: number;
}

// JSON API Types (new)

// Treasury Fiscal Data (Debt, Avg Interest Rates, Cash)
export interface TreasuryFiscalSnapshot {
  debt: number; // latest total debt
  debtHistory: { date: string; value: number }[];
  avgInterestRate: number; // latest average interest rate
  rateHistory: { date: string; value: number }[];
  cash: number; // latest operating cash balance
  cashHistory: { date: string; value: number }[];
}

// EIA v2 Series
export interface EiaPoint { date: string; value: number }
export interface EiaSeries {
  series: EiaPoint[];
  dataset: 'petroleum' | 'natgas';
  unit?: string;
}

// EIA Crude Oil Imports by Country
export interface EiaImportsByCountry {
  byCountry: Record<string, EiaPoint[]>;
  latestTotals: { country: string; value: number; percentage: number }[];
  totalImports: number;
  unit: string;
  period: string;
}

// EIA Generation Mix by Fuel Type
export interface EiaGenerationMix {
  byFuel: Record<string, EiaPoint[]>;
  latestMix: { fuel: string; name: string; generation: number; percentage: number }[];
  totalGeneration: number;
  unit: string;
  period: string;
}

// EIA Nuclear Outage Event
export interface EiaNuclearOutage {
  period: string;
  plantName: string;
  unitName: string;
  capacity: number;
  outageType: string;
  status: string;
  region: string;
}

// EIA Aggregated Snapshot
export interface EiaSnapshot {
  petroleum: {
    latestStocks: number;
    weekOverWeekChange: number;
    yearOverYearChange: number;
    history: EiaPoint[];
  };
  naturalGas: {
    latestStorage: number;
    weekOverWeekChange: number;
    history: EiaPoint[];
  };
  generationMix: {
    latest: { fuel: string; name: string; generation: number; percentage: number }[];
    totalGeneration: number;
    period: string;
  };
  imports: {
    topSources: { country: string; value: number; percentage: number }[];
    totalImports: number;
    period: string;
  };
  timestamp: string;
}

// Census EITS Housing
export interface HousingStats {
  starts: { date: string; value: number }[];
  permits: { date: string; value: number }[];
  latestStarts?: number;
  latestPermits?: number;
}

// NASA DONKI (Solar Flares)
export interface SolarFlareEvent {
  flareID: string;
  classType?: string;
  sourceLocation?: string;
  beginTime?: string;
  peakTime?: string;
  endTime?: string;
}

// GDELT Documents
export interface GdeltDoc {
  url: string;
  title?: string;
  language?: string;
  domain?: string;
  timestamp?: string;
  country?: string;
}

// UK data.gov.uk (CKAN)
export interface UkDataset {
  id: string;
  title: string;
  notes?: string;
  organization?: string;
  resources?: Array<{ format?: string; url?: string; name?: string }>;
}

// Canada open.canada.ca (CKAN)
export interface CanadaDataset {
  id: string;
  title: string;
  notes?: string;
  organization?: string;
  metadata_created?: string;
  metadata_modified?: string;
  resources?: Array<{ format?: string; url?: string; name?: string }>;
}

// Japan e-Stat Statistics Dashboard
export interface EStatIndicator {
  code: string;
  name: string;
  classes: Array<{
    name: string;
    shortName?: string;
    fromDate?: string;
    toDate?: string;
    cycle?: string;
    unit?: string;
    statName?: string;
  }>;
}

export interface EStatDataPoint {
  time: string;
  value: number | null;
  unit: string;
  indicator: string;
  annotation?: string;
}
