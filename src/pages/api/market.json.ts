// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Market data API endpoint - aggregates Yahoo Finance data for indices, crypto, and commodities

import type { APIContext } from 'astro';
import { getMarketData, getCryptoData, getTickerData } from '../../lib/yahoo';

export const prerender = false;

interface MarketResponse {
  indices: Awaited<ReturnType<typeof getMarketData>>;
  crypto: Awaited<ReturnType<typeof getCryptoData>>;
  commodities: Awaited<ReturnType<typeof getTickerData>>;
  timestamp: string;
  _cache?: {
    hit: boolean;
    source?: string;
  };
}

export async function GET({ request }: APIContext): Promise<Response> {
  const url = new URL(request.url);
  const section = url.searchParams.get('section'); // Optional: 'indices', 'crypto', 'commodities', or all

  try {
    let response: Partial<MarketResponse> = {
      timestamp: new Date().toISOString(),
      _cache: { hit: false }
    };

    // Fetch requested sections in parallel
    if (!section || section === 'all') {
      const [indices, crypto, commodities] = await Promise.all([
        getMarketData(),
        getCryptoData(),
        getTickerData()
      ]);
      response.indices = indices;
      response.crypto = crypto;
      response.commodities = commodities;
    } else if (section === 'indices') {
      response.indices = await getMarketData();
    } else if (section === 'crypto') {
      response.crypto = await getCryptoData();
    } else if (section === 'commodities') {
      response.commodities = await getTickerData();
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300, stale-if-error=3600'
      }
    });
  } catch (error) {
    console.error('[market.json] Error fetching market data:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch market data',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }
}
