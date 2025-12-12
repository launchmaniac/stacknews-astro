#!/usr/bin/env node
// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Warm all feed categories into KV cache

const ORIGIN = process.env.SMOKE_ORIGIN || 'https://stacknews.org';

const CATEGORIES = [
  'TREASURY',
  'FEDERAL RESERVE',
  'ENERGY',
  'EUROZONE',
  'ASIA_PACIFIC',
  'CHINA',
  'GLOBAL_MACRO',
  'CRYPTO',
  'STATE_DEPT',
  'MILITARY',
  'UK',
  'BULGARIA',
  'AFRICA',
  'RESEARCH',
  'MORTGAGE',
  'REAL ESTATE',
  'US CONGRESS',
  'REGULATION',
  'EXECUTIVE',
  'NEWS',
  'CANADA',
  'JAPAN'
];

async function warmCategory(category) {
  const start = Date.now();
  try {
    const url = `${ORIGIN}/api/feeds.json?category=${encodeURIComponent(category)}&refresh=true`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'StackNews-Warmer/1.0' },
      signal: AbortSignal.timeout(30000)
    });
    const elapsed = Date.now() - start;

    if (!res.ok) {
      console.log(`[FAIL] ${category}: HTTP ${res.status} (${elapsed}ms)`);
      return false;
    }

    const data = await res.json();
    const feedCount = Object.keys(data.feeds || {}).length;
    console.log(`[OK] ${category}: ${feedCount} feeds (${elapsed}ms)`);
    return true;
  } catch (err) {
    const elapsed = Date.now() - start;
    console.log(`[ERROR] ${category}: ${err.message} (${elapsed}ms)`);
    return false;
  }
}

async function main() {
  console.log(`Warming ${CATEGORIES.length} categories at ${ORIGIN}\n`);

  let success = 0;
  let failed = 0;

  // Warm categories sequentially to avoid overwhelming the server
  for (const cat of CATEGORIES) {
    const ok = await warmCategory(cat);
    if (ok) success++;
    else failed++;

    // Small delay between categories
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nComplete: ${success} success, ${failed} failed`);

  // Test ALL endpoint after warming
  console.log('\nTesting ALL endpoint...');
  const start = Date.now();
  const res = await fetch(`${ORIGIN}/api/feeds.json?category=ALL`);
  const data = await res.json();
  const elapsed = Date.now() - start;

  console.log(`ALL: ${Object.keys(data.feeds || {}).length} feeds, ${elapsed}ms`);
  console.log(`Cache: ${JSON.stringify(data._cache)}`);
}

main().catch(console.error);
