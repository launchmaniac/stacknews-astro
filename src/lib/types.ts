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
  | 'GLOBAL_MACRO';

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
