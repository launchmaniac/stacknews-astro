// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Treasury Fiscal Data (Debt to the Penny, Avg Interest Rates, DTS Cash)

import type { TreasuryFiscalSnapshot, DebtGrowthRate } from './types';

const TFD = {
  debt: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny',
  avgRates: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates',
  cash: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/dts/operating_cash_balance'
};

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'StackNews/1.0 (https://stacknews.org)'
      }
    });
    if (!res.ok) {
      console.log(`[TreasuryFiscal] Fetch failed: ${res.status} ${res.statusText} for ${url.split('?')[0]}`);
      return null;
    }
    return await res.json();
  } catch (err: any) {
    console.log(`[TreasuryFiscal] Fetch error: ${err?.message || 'Unknown'} for ${url.split('?')[0]}`);
    return null;
  }
}

// Calculate growth rate from debt history for animated counter
function calculateDebtGrowthRate(debtHistory: { date: string; value: number }[]): DebtGrowthRate | undefined {
  if (debtHistory.length < 2) return undefined;

  // Sort by date ascending (oldest first)
  const sorted = [...debtHistory].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Find oldest and newest points
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];

  // Calculate days between oldest and newest
  const oldestDate = new Date(oldest.date);
  const newestDate = new Date(newest.date);
  const daysDiff = (newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff < 1) return undefined;

  const totalGrowth = newest.value - oldest.value;
  const dailyAverage = totalGrowth / daysDiff;
  const perSecond = dailyAverage / 86400; // 86400 seconds per day

  return {
    dailyAverage: Math.round(dailyAverage),
    perSecond: Math.round(perSecond * 100) / 100, // Round to 2 decimal places
    periodStart: oldest.date,
    periodEnd: newest.date,
    totalGrowth: Math.round(totalGrowth),
    daysInPeriod: Math.round(daysDiff)
  };
}

export async function getTreasuryFiscalSnapshot(limitDebt: number = 100, limitRates: number = 13, limitCash: number = 60): Promise<TreasuryFiscalSnapshot> {
  const qs = (p: Record<string, string | number>) =>
    '?' + Object.entries(p).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');

  const debtUrl = TFD.debt + qs({ sort: '-record_date', format: 'json', 'page[size]': limitDebt });
  const rateUrl = TFD.avgRates + qs({ sort: '-record_date', format: 'json', 'page[size]': limitRates });
  const cashUrl = TFD.cash + qs({ sort: '-record_date', format: 'json', 'page[size]': limitCash });

  const [debtJson, rateJson, cashJson] = await Promise.all([
    fetchJson(debtUrl),
    fetchJson(rateUrl),
    fetchJson(cashUrl)
  ]);

  const snapshot: TreasuryFiscalSnapshot = {
    debt: 0,
    debtTimestamp: undefined,
    debtHistory: [],
    debtGrowthRate: undefined,
    avgInterestRate: 0,
    rateHistory: [],
    cash: 0,
    cashHistory: []
  };

  if (Array.isArray(debtJson?.data)) {
    const series = debtJson.data
      .map((d: any) => ({ date: d.record_date, value: parseFloat(d.tot_pub_debt_out_amt) }))
      .filter((p: any) => p.date && !isNaN(p.value) && p.value > 0);
    snapshot.debtHistory = series.slice().reverse(); // oldest to newest
    if (series[0]) {
      snapshot.debt = series[0].value;
      snapshot.debtTimestamp = series[0].date + 'T00:00:00Z'; // ISO timestamp
    }
    // Calculate 90-day growth rate for animated counter
    snapshot.debtGrowthRate = calculateDebtGrowthRate(snapshot.debtHistory);
  }

  if (Array.isArray(rateJson?.data)) {
    const series = rateJson.data
      .map((d: any) => ({ date: d.record_date, value: parseFloat(d.avg_interest_rate_amt) }))
      .filter((p: any) => p.date && !isNaN(p.value));
    snapshot.rateHistory = series.slice().reverse();
    if (series[0]) snapshot.avgInterestRate = series[0].value;
  }

  if (Array.isArray(cashJson?.data)) {
    const series = cashJson.data
      .map((d: any) => ({ date: d.record_date || d.transaction_dt, value: parseFloat(d.open_today_bal) }))
      .filter((p: any) => p.date && !isNaN(p.value));
    snapshot.cashHistory = series.slice().reverse().map(p => ({ date: p.date, value: p.value * 1_000_000 }));
    if (series[0]) snapshot.cash = series[0].value * 1_000_000;
  }

  return snapshot;
}

