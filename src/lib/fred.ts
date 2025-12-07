// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// FRED API wrapper for macroeconomic data

import type { MacroData, CentralBankRate, FredObservation } from './types';
import { FRED_API_KEY, FRED_BASE_URL, EDGE_PROXY_URL } from './constants';

async function getFredSeries(seriesId: string, limit: number = 1): Promise<FredObservation[] | null> {
  const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limit}`;

  try {
    // Try direct fetch first
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.observations || null;
    }
  } catch {}

  // Try edge proxy as fallback
  try {
    const proxyUrl = `${EDGE_PROXY_URL}?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const data = await response.json();
      return data.observations || null;
    }
  } catch {}

  return null;
}

export async function getMacroData(): Promise<MacroData> {
  const [fundsData, spreadData, cpiData] = await Promise.all([
    getFredSeries('DFF', 30),        // Daily Federal Funds Rate
    getFredSeries('T10Y2Y', 30),     // 10Y-2Y Treasury Spread
    getFredSeries('CPIAUCSL_PC1', 13) // CPI YoY
  ]);

  const result: MacroData = {
    fedFunds: [],
    yieldSpread: null,
    spreadHistory: [],
    cpiYOY: null,
    cpiHistory: [],
    cpiTrend: 'neutral'
  };

  // Fed Funds Rate
  if (fundsData) {
    result.fedFunds = [...fundsData].reverse().map(obs => ({
      value: parseFloat(obs.value),
      date: obs.date
    }));
  }

  // Yield Spread
  if (spreadData && spreadData.length > 0) {
    result.yieldSpread = parseFloat(spreadData[0].value);
    result.spreadHistory = spreadData.map(d => ({ value: parseFloat(d.value) })).reverse();
  }

  // CPI
  if (cpiData && cpiData.length > 0) {
    const current = parseFloat(cpiData[0].value);
    result.cpiYOY = current;

    if (cpiData.length > 1) {
      const prev = parseFloat(cpiData[1].value);
      result.cpiTrend = current > prev ? 'up' : current < prev ? 'down' : 'neutral';
    }

    result.cpiHistory = cpiData.map(d => ({ value: parseFloat(d.value) })).reverse();
  }

  return result;
}

export async function getCentralBankRates(): Promise<CentralBankRate[]> {
  const series = [
    { id: 'DFF', country: 'USA', bank: 'FED' },
    { id: 'ECBMRRFR', country: 'EUR', bank: 'ECB' },
    { id: 'BOERUKM', country: 'GBR', bank: 'BOE' },
    { id: 'IRSTCI01CAM156N', country: 'CAN', bank: 'BOC' },
    { id: 'IRSTCI01AUM156N', country: 'AUS', bank: 'RBA' },
    { id: 'IRSTCI01CHM156N', country: 'CHE', bank: 'SNB' },
    { id: 'IRSTCI01JPM156N', country: 'JPN', bank: 'BOJ' },
    { id: 'IRSTCI01CNM156N', country: 'CHN', bank: 'PBOC' },
    { id: 'IRSTCI01INM156N', country: 'IND', bank: 'RBI' },
    { id: 'IRSTCI01BRM156N', country: 'BRA', bank: 'BCB' },
    { id: 'IRSTCI01MXM156N', country: 'MEX', bank: 'BMX' },
    { id: 'IRSTCI01KRM156N', country: 'KOR', bank: 'BOK' },
    { id: 'IRSTCI01ZAM156N', country: 'ZAF', bank: 'SARB' },
    { id: 'IRSTCI01TRM156N', country: 'TUR', bank: 'CBRT' }
  ];

  const results = await Promise.all(
    series.map(async ({ id, country, bank }) => {
      const data = await getFredSeries(id);
      if (data && data.length > 0) {
        return { country, bank, rate: parseFloat(data[0].value) };
      }
      return null;
    })
  );

  return results.filter((r): r is CentralBankRate => r !== null);
}
