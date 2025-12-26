// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com
// Bureau of Labor Statistics (BLS) Public Data API v2
// Provides unemployment, CPI, JOLTS, PPI, productivity and state employment data

export type BLSObservation = {
  year: string;
  period: string;
  periodName: string;
  value: string;
  footnotes?: { code?: string; text?: string }[];
  latest?: string;
};

export type BLSSeries = {
  seriesID: string;
  data: BLSObservation[];
};

export type BLSResponse = {
  status: string;
  responseTime: number;
  message: string[];
  Results: {
    series: BLSSeries[];
  };
};

export type BLSDataPoint = {
  seriesId: string;
  name: string;
  category: string;
  value: number | null;
  period: string;
  periodName: string;
  year: string;
  change?: number;
  footnote?: string;
};

// BLS Series Configuration - 25 feeds
export const BLS_SERIES = {
  // Labor Market (8)
  unemployment: { id: 'LNS14000000', name: 'Unemployment Rate', category: 'labor', unit: '%' },
  laborForce: { id: 'LNS11000000', name: 'Civilian Labor Force', category: 'labor', unit: 'K' },
  employment: { id: 'LNS12000000', name: 'Employment Level', category: 'labor', unit: 'K' },
  unemploymentLevel: { id: 'LNS13000000', name: 'Unemployment Level', category: 'labor', unit: 'K' },
  nonfarmPayrolls: { id: 'CES0000000001', name: 'Nonfarm Payrolls', category: 'labor', unit: 'K' },
  hourlyEarnings: { id: 'CES0500000003', name: 'Avg Hourly Earnings', category: 'labor', unit: '$' },
  privateJobs: { id: 'CEU0500000001', name: 'Private Sector Jobs', category: 'labor', unit: 'K' },
  goodsJobs: { id: 'CEU0600000001', name: 'Goods-Producing Jobs', category: 'labor', unit: 'K' },

  // JOLTS (4)
  jobOpenings: { id: 'JTS000000000000000JOR', name: 'Job Openings Rate', category: 'jolts', unit: '%' },
  quitsRate: { id: 'JTS000000000000000QUR', name: 'Quits Rate', category: 'jolts', unit: '%' },
  hiresRate: { id: 'JTS000000000000000HIR', name: 'Hires Rate', category: 'jolts', unit: '%' },
  retailJobs: { id: 'CEU4142000001', name: 'Retail Trade Jobs', category: 'jolts', unit: 'K' },

  // Inflation - CPI (4)
  cpiAll: { id: 'CUUR0000SA0', name: 'CPI All Items', category: 'inflation', unit: 'index' },
  cpiCore: { id: 'CUSR0000SA0L1E', name: 'CPI Core', category: 'inflation', unit: 'index' },
  importPrices: { id: 'EIUIR', name: 'Import Price Index', category: 'inflation', unit: 'index' },
  exportPrices: { id: 'EIUIQ', name: 'Export Price Index', category: 'inflation', unit: 'index' },

  // Producer Prices (3)
  ppiAll: { id: 'WPU00000000', name: 'PPI All Commodities', category: 'ppi', unit: 'index' },
  ppiEnergy: { id: 'WPU0571', name: 'PPI Energy', category: 'ppi', unit: 'index' },
  ppiFood: { id: 'WPU0131', name: 'PPI Food', category: 'ppi', unit: 'index' },

  // Productivity (3)
  productivity: { id: 'PRS85006092', name: 'Nonfarm Productivity', category: 'productivity', unit: '%' },
  unitLaborCosts: { id: 'PRS85006112', name: 'Unit Labor Costs', category: 'productivity', unit: '%' },
  eciWages: { id: 'CIU1010000000000A', name: 'ECI Wages', category: 'productivity', unit: '%' },

  // State Unemployment - All 50 States + DC + Territories (53)
  alabamaUE: { id: 'LASST010000000000003', name: 'Alabama', category: 'states', unit: '%' },
  alaskaUE: { id: 'LASST020000000000003', name: 'Alaska', category: 'states', unit: '%' },
  arizonaUE: { id: 'LASST040000000000003', name: 'Arizona', category: 'states', unit: '%' },
  arkansasUE: { id: 'LASST050000000000003', name: 'Arkansas', category: 'states', unit: '%' },
  californiaUE: { id: 'LASST060000000000003', name: 'California', category: 'states', unit: '%' },
  coloradoUE: { id: 'LASST080000000000003', name: 'Colorado', category: 'states', unit: '%' },
  connecticutUE: { id: 'LASST090000000000003', name: 'Connecticut', category: 'states', unit: '%' },
  delawareUE: { id: 'LASST100000000000003', name: 'Delaware', category: 'states', unit: '%' },
  dcUE: { id: 'LASST110000000000003', name: 'District of Columbia', category: 'states', unit: '%' },
  floridaUE: { id: 'LASST120000000000003', name: 'Florida', category: 'states', unit: '%' },
  georgiaUE: { id: 'LASST130000000000003', name: 'Georgia', category: 'states', unit: '%' },
  hawaiiUE: { id: 'LASST150000000000003', name: 'Hawaii', category: 'states', unit: '%' },
  idahoUE: { id: 'LASST160000000000003', name: 'Idaho', category: 'states', unit: '%' },
  illinoisUE: { id: 'LASST170000000000003', name: 'Illinois', category: 'states', unit: '%' },
  indianaUE: { id: 'LASST180000000000003', name: 'Indiana', category: 'states', unit: '%' },
  iowaUE: { id: 'LASST190000000000003', name: 'Iowa', category: 'states', unit: '%' },
  kansasUE: { id: 'LASST200000000000003', name: 'Kansas', category: 'states', unit: '%' },
  kentuckyUE: { id: 'LASST210000000000003', name: 'Kentucky', category: 'states', unit: '%' },
  louisianaUE: { id: 'LASST220000000000003', name: 'Louisiana', category: 'states', unit: '%' },
  maineUE: { id: 'LASST230000000000003', name: 'Maine', category: 'states', unit: '%' },
  marylandUE: { id: 'LASST240000000000003', name: 'Maryland', category: 'states', unit: '%' },
  massachusettsUE: { id: 'LASST250000000000003', name: 'Massachusetts', category: 'states', unit: '%' },
  michiganUE: { id: 'LASST260000000000003', name: 'Michigan', category: 'states', unit: '%' },
  minnesotaUE: { id: 'LASST270000000000003', name: 'Minnesota', category: 'states', unit: '%' },
  mississippiUE: { id: 'LASST280000000000003', name: 'Mississippi', category: 'states', unit: '%' },
  missouriUE: { id: 'LASST290000000000003', name: 'Missouri', category: 'states', unit: '%' },
  montanaUE: { id: 'LASST300000000000003', name: 'Montana', category: 'states', unit: '%' },
  nebraskaUE: { id: 'LASST310000000000003', name: 'Nebraska', category: 'states', unit: '%' },
  nevadaUE: { id: 'LASST320000000000003', name: 'Nevada', category: 'states', unit: '%' },
  newHampshireUE: { id: 'LASST330000000000003', name: 'New Hampshire', category: 'states', unit: '%' },
  newJerseyUE: { id: 'LASST340000000000003', name: 'New Jersey', category: 'states', unit: '%' },
  newMexicoUE: { id: 'LASST350000000000003', name: 'New Mexico', category: 'states', unit: '%' },
  newYorkUE: { id: 'LASST360000000000003', name: 'New York', category: 'states', unit: '%' },
  northCarolinaUE: { id: 'LASST370000000000003', name: 'North Carolina', category: 'states', unit: '%' },
  northDakotaUE: { id: 'LASST380000000000003', name: 'North Dakota', category: 'states', unit: '%' },
  ohioUE: { id: 'LASST390000000000003', name: 'Ohio', category: 'states', unit: '%' },
  oklahomaUE: { id: 'LASST400000000000003', name: 'Oklahoma', category: 'states', unit: '%' },
  oregonUE: { id: 'LASST410000000000003', name: 'Oregon', category: 'states', unit: '%' },
  pennsylvaniaUE: { id: 'LASST420000000000003', name: 'Pennsylvania', category: 'states', unit: '%' },
  rhodeIslandUE: { id: 'LASST440000000000003', name: 'Rhode Island', category: 'states', unit: '%' },
  southCarolinaUE: { id: 'LASST450000000000003', name: 'South Carolina', category: 'states', unit: '%' },
  southDakotaUE: { id: 'LASST460000000000003', name: 'South Dakota', category: 'states', unit: '%' },
  tennesseeUE: { id: 'LASST470000000000003', name: 'Tennessee', category: 'states', unit: '%' },
  texasUE: { id: 'LASST480000000000003', name: 'Texas', category: 'states', unit: '%' },
  utahUE: { id: 'LASST490000000000003', name: 'Utah', category: 'states', unit: '%' },
  vermontUE: { id: 'LASST500000000000003', name: 'Vermont', category: 'states', unit: '%' },
  virginiaUE: { id: 'LASST510000000000003', name: 'Virginia', category: 'states', unit: '%' },
  washingtonUE: { id: 'LASST530000000000003', name: 'Washington', category: 'states', unit: '%' },
  westVirginiaUE: { id: 'LASST540000000000003', name: 'West Virginia', category: 'states', unit: '%' },
  wisconsinUE: { id: 'LASST550000000000003', name: 'Wisconsin', category: 'states', unit: '%' },
  wyomingUE: { id: 'LASST560000000000003', name: 'Wyoming', category: 'states', unit: '%' },
  puertoRicoUE: { id: 'LASST720000000000003', name: 'Puerto Rico', category: 'states', unit: '%' },
  virginIslandsUE: { id: 'LASST780000000000003', name: 'Virgin Islands', category: 'states', unit: '%' }
} as const;

const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 500;
const BLS_BATCH_SIZE = 50; // BLS API v2 limit per request

// Fetch a single batch of series from BLS
async function fetchBLSBatch(
  apiKey: string,
  seriesIds: string[],
  startYear: number,
  endYear: number
): Promise<BLSSeries[]> {
  const url = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';
  const body = JSON.stringify({
    seriesid: seriesIds,
    startyear: String(startYear),
    endyear: String(endYear),
    registrationkey: apiKey
  });

  let lastErr: any;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body
      });

      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) {
          throw new Error(`HTTP ${res.status}`);
        }
        throw new Error(`BLS API error: ${res.status}`);
      }

      const json: BLSResponse = await res.json();

      if (json.status !== 'REQUEST_SUCCEEDED') {
        throw new Error(`BLS API status: ${json.status} - ${json.message.join(', ')}`);
      }

      return json.Results.series || [];
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_ATTEMPTS) {
        const wait = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      break;
    }
  }

  console.error(`[BLS] Batch failed after ${MAX_ATTEMPTS} attempts: ${lastErr?.message || lastErr}`);
  return []; // Return empty array on failure to allow other batches to succeed
}

export async function fetchBLSData(
  apiKey: string,
  seriesIds?: string[],
  startYear?: number,
  endYear?: number
): Promise<BLSDataPoint[]> {
  const currentYear = new Date().getFullYear();
  const start = startYear || currentYear - 1;
  const end = endYear || currentYear;

  // Use all series if none specified
  const ids = seriesIds || Object.values(BLS_SERIES).map(s => s.id);

  // Split into batches of 50 (BLS API limit)
  const batches: string[][] = [];
  for (let i = 0; i < ids.length; i += BLS_BATCH_SIZE) {
    batches.push(ids.slice(i, i + BLS_BATCH_SIZE));
  }

  console.log(`[BLS] Fetching ${ids.length} series in ${batches.length} batch(es)`);

  // Fetch all batches in parallel
  const batchResults = await Promise.all(
    batches.map(batch => fetchBLSBatch(apiKey, batch, start, end))
  );

  // Combine all series from all batches
  const allSeries = batchResults.flat();

  // Transform to data points
  const points: BLSDataPoint[] = [];
  const seriesLookup = new Map(
    Object.entries(BLS_SERIES).map(([key, val]) => [val.id, { key, ...val }])
  );

  for (const series of allSeries) {
    const config = seriesLookup.get(series.seriesID);
    if (!config || !series.data || series.data.length === 0) continue;

    const latest = series.data[0];
    const value = latest.value === '-' || latest.value === '.' ? null : parseFloat(latest.value);

    // Calculate change from previous period if available
    let change: number | undefined;
    if (series.data.length > 1 && value !== null) {
      const prev = series.data[1];
      const prevValue = prev.value === '-' || prev.value === '.' ? null : parseFloat(prev.value);
      if (prevValue !== null && prevValue !== 0) {
        change = ((value - prevValue) / prevValue) * 100;
      }
    }

    points.push({
      seriesId: series.seriesID,
      name: config.name,
      category: config.category,
      value,
      period: latest.period,
      periodName: latest.periodName,
      year: latest.year,
      change,
      footnote: latest.footnotes?.[0]?.text
    });
  }

  console.log(`[BLS] Successfully fetched ${points.length} data points`);
  return points;
}

// Get series IDs by category
export function getSeriesByCategory(category: keyof typeof BLS_SERIES | 'all'): string[] {
  if (category === 'all') {
    return Object.values(BLS_SERIES).map(s => s.id);
  }
  return Object.values(BLS_SERIES)
    .filter(s => s.category === category)
    .map(s => s.id);
}

// Format value with appropriate unit
export function formatBLSValue(value: number | null, seriesId: string): string {
  if (value === null) return 'N/A';

  const config = Object.values(BLS_SERIES).find(s => s.id === seriesId);
  if (!config) return value.toString();

  switch (config.unit) {
    case '%':
      return `${value.toFixed(1)}%`;
    case '$':
      return `$${value.toFixed(2)}`;
    case 'K':
      return value >= 1000 ? `${(value / 1000).toFixed(1)}M` : `${value.toFixed(0)}K`;
    case 'index':
      return value.toFixed(1);
    default:
      return value.toString();
  }
}
