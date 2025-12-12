// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com
import { setTimeout as delay } from 'node:timers/promises';

const ORIGIN = process.env.SMOKE_ORIGIN || 'https://stacknews.org';

function withTimeout(ms, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms).unref?.();
  return { signal: ctrl.signal, cancel: () => clearTimeout(t) };
}

async function check(url, { expectJson = false, expectHeaders = [], method = 'GET' } = {}) {
  const { signal, cancel } = withTimeout(10000);
  try {
    const res = await fetch(url, { method, signal });
    const statusOk = res.status >= 200 && res.status < 400;
    let headersOk = true;
    for (const h of expectHeaders) {
      if (!res.headers.has(h)) headersOk = false;
    }
    let jsonOk = true;
    if (expectJson) {
      const data = await res.json().catch(() => null);
      jsonOk = data && Object.prototype.hasOwnProperty.call(data, '_cache');
    }
    return statusOk && headersOk && jsonOk;
  } catch (e) {
    return false;
  } finally {
    cancel();
  }
}

async function run() {
  const checks = [];

  // Treasury yield curve endpoint: expect caching headers
  checks.push({
    name: 'treasury/yield-curve.json cache headers',
    ok: await check(`${ORIGIN}/api/treasury/yield-curve.json?days=60`, {
      expectHeaders: ['cache-control'],
    }),
  });

  // Feeds endpoint: expect _cache in body
  await delay(200); // small jitter
  checks.push({
    name: 'feeds.json returns _cache',
    ok: await check(`${ORIGIN}/api/feeds.json?category=ALL`, {
      expectJson: true,
    }),
  });

  // Root: expect security headers
  await delay(200);
  checks.push({
    name: 'root security headers',
    ok: await check(`${ORIGIN}/`, {
      expectHeaders: [
        'strict-transport-security',
        'content-security-policy',
        'referrer-policy',
        'permissions-policy',
        'x-frame-options',
        'x-content-type-options',
      ],
    }),
  });

  let allOk = true;
  for (const c of checks) {
    if (c.ok) console.log(`PASS: ${c.name}`);
    else {
      console.log(`FAIL: ${c.name}`);
      allOk = false;
    }
  }

  if (!allOk) {
    console.error('Smoke tests failed.');
    process.exit(1);
  } else {
    console.log('All smoke tests passed.');
  }
}

run();
