// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com
// Treasury: Daily Yield Curve (FiscalData) – lightweight fetch helper

export type YieldCurvePoint = {
  date: string;
  bc_1month?: number;
  bc_2month?: number;
  bc_3month?: number;
  bc_6month?: number;
  bc_1year?: number;
  bc_2year?: number;
  bc_3year?: number;
  bc_5year?: number;
  bc_7year?: number;
  bc_10year?: number;
  bc_20year?: number;
  bc_30year?: number;
};

const BASE = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/daily_treasury_yield_curve_rates';

function qs(params: Record<string, string | number>) {
  return (
    '?' +
    Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&')
  );
}

export async function fetchYieldCurve(days: number = 60): Promise<YieldCurvePoint[]> {
  const url = BASE + qs({ sort: '-record_date', format: 'json', 'page[size]': Math.max(1, Math.min(days, 365)) });

  // Simple resilience: retry on transient errors (5xx, 429, network)
  const MAX_ATTEMPTS = 3;
  const BASE_DELAY_MS = 300;
  let lastErr: any;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const json = await res.json();
        const rows: any[] = Array.isArray(json?.data) ? json.data : [];
        return rows
          .map((r: any) => ({
            date: r.record_date,
            bc_1month: num(r.bc_1month),
            bc_2month: num(r.bc_2month),
            bc_3month: num(r.bc_3month),
            bc_6month: num(r.bc_6month),
            bc_1year: num(r.bc_1year),
            bc_2year: num(r.bc_2year),
            bc_3year: num(r.bc_3year),
            bc_5year: num(r.bc_5year),
            bc_7year: num(r.bc_7year),
            bc_10year: num(r.bc_10year),
            bc_20year: num(r.bc_20year),
            bc_30year: num(r.bc_30year)
          }))
          .filter((p: YieldCurvePoint) => !!p.date)
          .reverse();
      }
      // Retry on 429/5xx
      if (res.status === 429 || (res.status >= 500 && res.status <= 599)) {
        throw new Error(`HTTP ${res.status}`);
      }
      // Non-retryable (4xx except 429)
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_ATTEMPTS) {
        const wait = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      break;
    }
  }
  throw new Error(String(lastErr?.message || lastErr || 'fetch failed'));
}

function num(v: any): number | undefined {
  const n = parseFloat(v);
  return isNaN(n) ? undefined : n;
}
