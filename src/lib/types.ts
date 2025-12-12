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
  | 'JAPAN'
  | 'NASA';

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

// NASA DONKI (Space Weather)
export interface SolarFlareEvent {
  flareID: string;
  classType?: string;
  sourceLocation?: string;
  beginTime?: string;
  peakTime?: string;
  endTime?: string;
  linkedEvents?: any[];
}

// Coronal Mass Ejection (CME)
export interface CoronalMassEjection {
  activityID: string;
  startTime?: string;
  sourceLocation?: string;
  note?: string;
  instruments?: string[];
  cmeAnalyses?: Array<{
    speed?: number;
    type?: string;
    latitude?: number;
    longitude?: number;
    halfAngle?: number;
    isMostAccurate?: boolean;
    time21_5?: string;
  }>;
  linkedEvents?: any[];
}

// Geomagnetic Storm (GST)
export interface GeomagneticStorm {
  gstID: string;
  startTime?: string;
  allKpIndex?: Array<{
    observedTime?: string;
    kpIndex?: number;
    source?: string;
  }>;
  linkedEvents?: any[];
}

// Space Weather Snapshot
export interface SpaceWeatherSnapshot {
  timestamp: string;
  period: { start: string; end: string; days: number };
  summary: {
    totalEvents: number;
    solarFlares: number;
    xClassFlares: number;
    mClassFlares: number;
    coronalMassEjections: number;
    geomagneticStorms: number;
    solarEnergeticParticles: number;
    interplanetaryShocks: number;
    highSpeedStreams: number;
  };
  threatAssessment: {
    level: 'low' | 'moderate' | 'elevated' | 'high' | 'extreme';
    score: number;
    maxKpIndex: number;
    gridRisk: 'low' | 'moderate' | 'high';
    satelliteRisk: 'low' | 'elevated' | 'high';
    radioBlackoutRisk: 'low' | 'moderate' | 'high';
  };
  recentFlares: SolarFlareEvent[];
  recentCMEs: CoronalMassEjection[];
  recentStorms: GeomagneticStorm[];
}

// EONET Natural Event
export interface EonetEvent {
  id: string;
  title: string;
  description?: string;
  link?: string;
  closed?: string;
  categories: Array<{ id: string; title: string }>;
  sources: Array<{ id: string; url: string }>;
  geometry: Array<{
    date: string;
    type: string;
    coordinates: number[];
    magnitudeValue?: number;
    magnitudeUnit?: string;
  }>;
}

// EONET Snapshot
export interface EonetSnapshot {
  timestamp: string;
  period: { days: number };
  summary: {
    totalActiveEvents: number;
    byCategory: Record<string, number>;
  };
  highlights: {
    activeWildfires: number;
    activeVolcanoes: number;
    severeStorms: number;
    seaIceEvents: number;
  };
  recentEvents: EonetEvent[];
  categories: Array<{ id: string; title: string; description: string }>;
}

// GDELT Documents with CAMEO coding
export interface GdeltDoc {
  url: string;
  title?: string;
  language?: string;
  domain?: string;
  timestamp?: string;
  country?: string;
  tone?: number;  // GDELT tone score (-10 to +10)
}

// GDELT Global Stability Snapshot
export interface GdeltStabilitySnapshot {
  timestamp: string;
  overallTone: number;
  eventCounts: {
    total: number;
    cooperation: number;
    verbalConflict: number;
    materialConflict: number;
  };
  stabilityIndex: number;
  regionalTones: Record<string, { tone: number; eventCount: number }>;
  hotspots: Array<{ country: string; tone: number; eventCount: number }>;
}

// ArXiv Research Paper
export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  updated: string;
  categories: string[];
  primaryCategory: string;
  pdfLink?: string;
  abstractLink?: string;
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

// Real Estate and Construction Types

// Census Bureau Construction Pipeline
export interface ConstructionSeries {
  permits?: { date: string; value: number }[];
  starts?: { date: string; value: number }[];
  completions?: { date: string; value: number }[];
}

export interface ConstructionStage {
  series: { date: string; value: number }[];
  latest: number;
  monthOverMonth: number;
  unit: string;
}

export interface ConstructionPipeline {
  permits: ConstructionStage;
  starts: ConstructionStage;
  completions: ConstructionStage;
  underConstruction: ConstructionStage;
  pipelineRatio: {
    permitsToStarts: number;
    startsToCompletions: number;
    description: string;
  };
  latestPeriod: string;
}

// HUD Fair Market Rents
export interface HudFairMarketRent {
  entityId: string;
  areaName: string;
  year: number;
  efficiency: number;
  oneBedroom: number;
  twoBedroom: number;
  threeBedroom: number;
  fourBedroom: number;
  medianIncome: number;
  smallAreaFmr: boolean;
}

// Commercial Real Estate Index (FRED)
export interface CommercialRealEstateIndex {
  series: { date: string; value: number }[];
  latestValue: number;
  latestDate: string;
  yearOverYear: number;
  description?: string;
}

// Aggregated Real Estate Snapshot
export interface RealEstateSnapshot {
  construction: {
    permits: number;
    permitsChange: number;
    starts: number;
    startsChange: number;
    completions: number;
    completionsChange: number;
    underConstruction: number;
    period: string;
    pipelineHealth: 'expanding' | 'contracting';
  };
  pricing: {
    caseShillerIndex: number;
    caseShillerYoY: number;
    commercialIndex: number;
    commercialYoY: number;
  };
  affordability: {
    index: number;
    description: string;
  };
  timestamp: string;
}
