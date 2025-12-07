// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Treasury API data fetching for dashboard metrics

import type { TreasuryData } from './types';
import { EDGE_PROXY_URL } from './constants';

const TREASURY_URLS = {
  debt: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&format=json&page[size]=30',
  cash: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/dts/operating_cash_balance?sort=-record_date&page[size]=60',
  gold: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/status_of_treasury_owned_gold?sort=-record_date&page[size]=20',
  rates: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?sort=-record_date&page[size]=13'
};

async function fetchWithFallback(url: string): Promise<any> {
  // Try direct fetch first
  try {
    console.log(`[Treasury] Fetching: ${url.substring(0, 80)}...`);
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      console.log(`[Treasury] Success: ${url.substring(0, 50)}`);
      return await response.json();
    }
    console.log(`[Treasury] HTTP ${response.status}: ${url.substring(0, 50)}`);
  } catch (err: any) {
    console.error(`[Treasury] Error: ${err?.message || 'Unknown'}`);
  }

  // Try CORS proxy as fallback
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, {
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      console.log(`[Treasury] Proxy success: ${url.substring(0, 50)}`);
      return await response.json();
    }
  } catch {}

  return null;
}

export async function getTreasuryData(): Promise<TreasuryData> {
  const [debtJson, cashJson, goldJson, ratesJson] = await Promise.all([
    fetchWithFallback(TREASURY_URLS.debt),
    fetchWithFallback(TREASURY_URLS.cash),
    fetchWithFallback(TREASURY_URLS.gold),
    fetchWithFallback(TREASURY_URLS.rates)
  ]);

  const result: TreasuryData = {
    debt: 0,
    debtHistory: [],
    cash: 0,
    gold: 0,
    interestRate: 0,
    ratesHistory: []
  };

  // Parse debt data
  if (debtJson?.data) {
    const validEntry = debtJson.data.find((d: any) =>
      d.tot_pub_debt_out_amt && parseFloat(d.tot_pub_debt_out_amt) > 0
    );
    if (validEntry) {
      result.debt = parseFloat(validEntry.tot_pub_debt_out_amt);
    }
    result.debtHistory = debtJson.data
      .map((d: any) => ({ value: parseFloat(d.tot_pub_debt_out_amt) }))
      .filter((d: any) => !isNaN(d.value) && d.value > 0)
      .reverse();
  }

  // Parse cash data
  if (cashJson?.data?.[0]) {
    const totalCash = parseFloat(cashJson.data[0].open_today_bal) || 0;
    result.cash = totalCash * 1000000; // Convert to actual value
  }

  // Parse gold data
  if (goldJson?.data?.[0]) {
    result.gold = parseFloat(goldJson.data[0].book_value_amt) || 0;
  }

  // Parse rates data
  if (ratesJson?.data?.[0]) {
    result.interestRate = parseFloat(ratesJson.data[0].avg_interest_rate_amt);
    result.ratesHistory = ratesJson.data
      .map((d: any) => ({ value: parseFloat(d.avg_interest_rate_amt) }))
      .reverse();
  }

  return result;
}
