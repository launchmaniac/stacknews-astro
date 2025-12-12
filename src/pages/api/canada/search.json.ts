// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// API endpoint for Canada open.canada.ca CKAN package_search

import type { APIRoute } from 'astro';
import { searchCanadaData, searchBudgetData, searchImmigrationData, searchEnergyData } from '../../../lib/canada';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get('q') || '';
  const rows = parseInt(url.searchParams.get('rows') || '20', 10);
  const start = parseInt(url.searchParams.get('start') || '0', 10);
  const preset = url.searchParams.get('preset'); // budget, immigration, energy

  try {
    let result;

    if (preset === 'budget') {
      result = await searchBudgetData(rows);
    } else if (preset === 'immigration') {
      result = await searchImmigrationData(rows);
    } else if (preset === 'energy') {
      result = await searchEnergyData(rows);
    } else if (q) {
      result = await searchCanadaData({ q, rows, start });
    } else {
      return new Response(
        JSON.stringify({ error: 'Missing q or preset parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Canada data', message: error?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
