// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com
// Treasury Yield Curve data via FRED API
// Replaces deprecated FiscalData endpoint (returned 404 as of Dec 2025)

export type YieldCurvePoint = {
  date: string;
  bc_1month?: number;
  bc_3month?: number;
  bc_6month?: number;
  bc_1year?: number;
  bc_2year?: number;
  bc_5year?: number;
  bc_10year?: number;
  bc_30year?: number;
  spread_10y2y?: number;
};

// FRED series IDs for Treasury Constant Maturity rates
const FRED_SERIES = {
  bc_1month: 'DGS1MO',
  bc_3month: 'DGS3MO',
  bc_6month: 'DGS6MO',
  bc_1year: 'DGS1',
  bc_2year: 'DGS2',
  bc_5year: 'DGS5',
  bc_10year: 'DGS10',
  bc_30year: 'DGS30',
  spread_10y2y: 'T10Y2Y'
} as const;

const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 300;

async function fetchFredSeries(
  seriesId: string,
  apiKey: string,
  limit: number
): Promise<{ date: string; value: number }[]> {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`;

  let lastErr: any;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const json = await res.json();
        const observations: any[] = json?.observations || [];
        return observations
          .filter((o: any) => o.value !== '.' && !isNaN(parseFloat(o.value)))
          .map((o: any) => ({
            date: o.date,
            value: parseFloat(o.value)
          }));
      }
      if (res.status === 429 || (res.status >= 500 && res.status <= 599)) {
        throw new Error(`HTTP ${res.status}`);
      }
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
  console.error(`[FRED ${seriesId}] Failed: ${lastErr?.message || lastErr}`);
  return [];
}

export async function fetchYieldCurve(
  days: number = 60,
  apiKey?: string
): Promise<YieldCurvePoint[]> {
  // apiKey should be passed from the API route via locals.runtime.env.FRED_API_KEY
  if (!apiKey) {
    throw new Error('FRED_API_KEY required for yield curve data');
  }

  const limit = Math.max(1, Math.min(days, 365));

  // Fetch all series in parallel
  const [
    m1Data,
    m3Data,
    m6Data,
    y1Data,
    y2Data,
    y5Data,
    y10Data,
    y30Data,
    spreadData
  ] = await Promise.all([
    fetchFredSeries(FRED_SERIES.bc_1month, apiKey, limit),
    fetchFredSeries(FRED_SERIES.bc_3month, apiKey, limit),
    fetchFredSeries(FRED_SERIES.bc_6month, apiKey, limit),
    fetchFredSeries(FRED_SERIES.bc_1year, apiKey, limit),
    fetchFredSeries(FRED_SERIES.bc_2year, apiKey, limit),
    fetchFredSeries(FRED_SERIES.bc_5year, apiKey, limit),
    fetchFredSeries(FRED_SERIES.bc_10year, apiKey, limit),
    fetchFredSeries(FRED_SERIES.bc_30year, apiKey, limit),
    fetchFredSeries(FRED_SERIES.spread_10y2y, apiKey, limit)
  ]);

  // Build lookup maps by date
  const toMap = (arr: { date: string; value: number }[]) =>
    new Map(arr.map((d) => [d.date, d.value]));

  const m1Map = toMap(m1Data);
  const m3Map = toMap(m3Data);
  const m6Map = toMap(m6Data);
  const y1Map = toMap(y1Data);
  const y2Map = toMap(y2Data);
  const y5Map = toMap(y5Data);
  const y10Map = toMap(y10Data);
  const y30Map = toMap(y30Data);
  const spreadMap = toMap(spreadData);

  // Collect all unique dates
  const allDates = new Set<string>();
  [m1Data, m3Data, m6Data, y1Data, y2Data, y5Data, y10Data, y30Data, spreadData].forEach(
    (arr) => arr.forEach((d) => allDates.add(d.date))
  );

  // Sort dates descending then take limit
  const sortedDates = Array.from(allDates)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, limit);

  // Build yield curve points
  const points: YieldCurvePoint[] = sortedDates.map((date) => ({
    date,
    bc_1month: m1Map.get(date),
    bc_3month: m3Map.get(date),
    bc_6month: m6Map.get(date),
    bc_1year: y1Map.get(date),
    bc_2year: y2Map.get(date),
    bc_5year: y5Map.get(date),
    bc_10year: y10Map.get(date),
    bc_30year: y30Map.get(date),
    spread_10y2y: spreadMap.get(date)
  }));

  // Filter out points that have no actual yield data (e.g., holidays where only spread is available)
  const validPoints = points.filter(p =>
    p.bc_2year !== undefined || p.bc_10year !== undefined
  );

  // Return in chronological order (oldest first) for sparklines
  return validPoints.reverse();
}

// Get latest yield curve snapshot (single day)
export async function getLatestYieldCurve(apiKey?: string): Promise<YieldCurvePoint | null> {
  const data = await fetchYieldCurve(1, apiKey);
  return data.length > 0 ? data[0] : null;
}
