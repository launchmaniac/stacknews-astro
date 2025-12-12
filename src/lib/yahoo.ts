// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Yahoo Finance API wrapper for market data

import type { MarketData } from './types';
import { EDGE_PROXY_URL } from './constants';

interface YahooChartResult {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice: number;
        previousClose: number;
      }
    }>
  }
}

const MARKET_SYMBOLS = [
  { id: '%5EGSPC', name: 'S&P 500', type: 'MARKET' as const },
  { id: '%5EDJI', name: 'DOW JONES', type: 'MARKET' as const },
  { id: '%5EIXIC', name: 'NASDAQ', type: 'MARKET' as const },
  { id: '%5ERUT', name: 'RUSSELL 2K', type: 'MARKET' as const },
  { id: '%5EVIX', name: 'VIX', type: 'MARKET' as const },
  { id: 'DX-Y.NYB', name: 'DXY', type: 'MARKET' as const },
  { id: '%5EFTSE', name: 'FTSE 100', type: 'MARKET' as const },
  { id: '%5EN225', name: 'NIKKEI 225', type: 'MARKET' as const },
  { id: '%5EGDAXI', name: 'DAX', type: 'MARKET' as const }
];

const CRYPTO_SYMBOLS = [
  { id: 'BTC-USD', name: 'BITCOIN', type: 'CRYPTO' as const },
  { id: 'ETH-USD', name: 'ETHEREUM', type: 'CRYPTO' as const },
  { id: 'SOL-USD', name: 'SOLANA', type: 'CRYPTO' as const },
  { id: 'XRP-USD', name: 'RIPPLE', type: 'CRYPTO' as const },
  { id: 'BNB-USD', name: 'BNB', type: 'CRYPTO' as const },
  { id: 'DOGE-USD', name: 'DOGECOIN', type: 'CRYPTO' as const },
  { id: 'ADA-USD', name: 'CARDANO', type: 'CRYPTO' as const }
];

const TICKER_SYMBOLS = [
  // Bonds
  { id: '%5ETNX', name: 'US 10Y', type: 'BOND' as const },
  { id: '%5ETYX', name: 'US 30Y', type: 'BOND' as const },
  { id: '%5EFVX', name: 'US 05Y', type: 'BOND' as const },
  // Metals
  { id: 'GC%3DF', name: 'GOLD', type: 'COMM' as const },
  { id: 'SI%3DF', name: 'SILVER', type: 'COMM' as const },
  // Energy
  { id: 'CL%3DF', name: 'CRUDE OIL', type: 'COMM' as const },
  { id: 'NG%3DF', name: 'NAT GAS', type: 'COMM' as const },
  // FX
  { id: 'EURUSD%3DX', name: 'EUR/USD', type: 'FX' as const },
  { id: 'JPY%3DX', name: 'USD/JPY', type: 'FX' as const },
  { id: 'GBPUSD%3DX', name: 'GBP/USD', type: 'FX' as const }
];

async function fetchSymbol(symbol: { id: string; name: string; type: MarketData['type'] }): Promise<MarketData | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.id}?interval=1d&range=1d`;

  // Route only through our edge proxy
  try {
    const proxyUrl = `${EDGE_PROXY_URL}?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const data: YahooChartResult = await response.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (meta) {
        const change = meta.regularMarketPrice - meta.previousClose;
        const percentChange = (change / meta.previousClose) * 100;
        return {
          symbol: symbol.id,
          name: symbol.name,
          price: meta.regularMarketPrice,
          change,
          percentChange,
          type: symbol.type
        };
      }
    }
  } catch {}

  return null;
}

export async function getMarketData(): Promise<MarketData[]> {
  const results = await Promise.all(MARKET_SYMBOLS.map(fetchSymbol));
  return results.filter((r): r is MarketData => r !== null);
}

export async function getCryptoData(): Promise<MarketData[]> {
  const results = await Promise.all(CRYPTO_SYMBOLS.map(fetchSymbol));
  return results.filter((r): r is MarketData => r !== null);
}

export async function getTickerData(): Promise<MarketData[]> {
  const results = await Promise.all(TICKER_SYMBOLS.map(fetchSymbol));
  return results.filter((r): r is MarketData => r !== null);
}
