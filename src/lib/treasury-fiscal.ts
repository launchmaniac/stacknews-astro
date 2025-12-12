// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Treasury Fiscal Data (Debt to the Penny, Avg Interest Rates, DTS Cash)

import type { TreasuryFiscalSnapshot } from './types';

const TFD = {
  debt: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny',
  avgRates: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates',
  cash: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/dts/operating_cash_balance'
};

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getTreasuryFiscalSnapshot(limitDebt: number = 30, limitRates: number = 13, limitCash: number = 60): Promise<TreasuryFiscalSnapshot> {
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
    debtHistory: [],
    avgInterestRate: 0,
    rateHistory: [],
    cash: 0,
    cashHistory: []
  };

  if (Array.isArray(debtJson?.data)) {
    const series = debtJson.data
      .map((d: any) => ({ date: d.record_date, value: parseFloat(d.tot_pub_debt_out_amt) }))
      .filter((p: any) => p.date && !isNaN(p.value) && p.value > 0);
    snapshot.debtHistory = series.slice().reverse();
    if (series[0]) snapshot.debt = series[0].value;
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

