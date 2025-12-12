// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// API endpoint for Japan e-Stat Statistics Dashboard

import type { APIRoute } from 'astro';
import {
  getJapanSnapshot,
  searchIndicators,
  getData,
  getUnemploymentRate,
  getPopulation,
  getCPIChange,
  getCoreCPI,
  INDICATORS,
  CYCLE,
  REGIONAL_RANK,
} from '../../../lib/estat';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const preset = url.searchParams.get('preset'); // snapshot, unemployment, population, cpi
  const search = url.searchParams.get('search'); // search for indicators by keyword
  const indicator = url.searchParams.get('indicator'); // custom indicator code
  const cycle = url.searchParams.get('cycle') || CYCLE.CALENDAR_YEAR;

  try {
    let result;

    if (preset === 'snapshot') {
      // Get a snapshot of key Japan economic indicators
      result = await getJapanSnapshot();
    } else if (preset === 'unemployment') {
      const data = await getUnemploymentRate();
      result = { indicator: 'Unemployment Rate', data: data.slice(-24) }; // Last 24 months
    } else if (preset === 'population') {
      const data = await getPopulation();
      result = { indicator: 'Total Population', data: data.slice(-20) }; // Last 20 years
    } else if (preset === 'cpi') {
      const data = await getCPIChange();
      result = { indicator: 'CPI YoY Change', data: data.slice(-24) }; // Last 24 months
    } else if (preset === 'core_cpi') {
      const data = await getCoreCPI();
      result = { indicator: 'Core CPI YoY', data: data.slice(-24) }; // Last 24 months
    } else if (search) {
      // Search for indicators by keyword
      const indicators = await searchIndicators({ keyword: search });
      result = { count: indicators.length, indicators: indicators.slice(0, 20) };
    } else if (indicator) {
      // Get data for a custom indicator code
      const data = await getData({
        indicatorCode: indicator,
        cycle,
        regionalRank: REGIONAL_RANK.JAPAN,
      });
      result = { indicator, data: data.slice(-50) }; // Last 50 data points
    } else {
      // Return available presets and indicator codes
      result = {
        availablePresets: ['snapshot', 'unemployment', 'population', 'cpi', 'core_cpi'],
        availableIndicators: INDICATORS,
        usage: {
          preset: '/api/japan/stats.json?preset=snapshot',
          search: '/api/japan/stats.json?search=GDP',
          custom: '/api/japan/stats.json?indicator=0301010000020020010&cycle=1',
        },
      };
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Japan statistics', message: error?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
