// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED_KEYS = [
  'FRED_API_KEY',
  'NASA_API_KEY',
  'EIA_API_KEY',
  'WARM_SECRET',
];

function loadDevVars(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  /** Very small parser: KEY=VALUE, ignores comments and blank lines */
  const vars = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const raw = trimmed.slice(eq + 1).trim();
    const val = raw.replace(/^['\"]|['\"]$/g, '');
    vars[key] = val;
  }
  return vars;
}

function checkWranglerToml(filePath) {
  if (!fs.existsSync(filePath)) return { exists: false, coordinator: false, kv: false, kvId: null };
  const text = fs.readFileSync(filePath, 'utf8');
  const coordinator = /\[\[services\]\][\s\S]*?binding\s*=\s*"COORDINATOR"[\s\S]*?service\s*=\s*"stacknews-coordinator"/m.test(text);
  const kvBlock = /\[\[kv_namespaces\]\][\s\S]*?binding\s*=\s*"STACKNEWS_KV"[\s\S]*?id\s*=\s*"([^"]+)"/m.exec(text);
  return {
    exists: true,
    coordinator,
    kv: !!kvBlock,
    kvId: kvBlock ? kvBlock[1] : null,
  };
}

function checkWranglerJsonc(filePath) {
  if (!fs.existsSync(filePath)) return { exists: false };
  const text = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { exists: true, parseError: String(e) };
  }
  return {
    exists: true,
    name: data.name,
    compatDate: data.compatibility_date,
    nodeCompat: Array.isArray(data.compatibility_flags) && data.compatibility_flags.includes('nodejs_compat'),
  };
}

const root = process.cwd();
const devVarsPath = path.join(root, '.dev.vars');
const wranglerTomlPath = path.join(root, 'wrangler.toml');
const wranglerJsoncPath = path.join(root, 'wrangler.jsonc');

const devVars = loadDevVars(devVarsPath);
const env = { ...devVars, ...process.env };

let missing = [];
for (const key of REQUIRED_KEYS) {
  if (!env[key]) missing.push(key);
}

const toml = checkWranglerToml(wranglerTomlPath);
const jsonc = checkWranglerJsonc(wranglerJsoncPath);

console.log('Environment verification');
console.log('------------------------');
console.log(`.dev.vars file: ${fs.existsSync(devVarsPath) ? 'FOUND' : 'MISSING'}`);
console.log(`Required keys present: ${REQUIRED_KEYS.filter(k => !!env[k]).length}/${REQUIRED_KEYS.length}`);
if (missing.length) {
  console.log(`Missing keys: ${missing.join(', ')}`);
}

console.log('\nWrangler configuration');
console.log('----------------------');
if (!toml.exists) {
  console.log('wrangler.toml: MISSING');
} else {
  console.log(`wrangler.toml: FOUND | COORDINATOR binding: ${toml.coordinator ? 'OK' : 'MISSING'} | STACKNEWS_KV: ${toml.kv ? 'OK' : 'MISSING'}${toml.kvId ? ` (id=${toml.kvId})` : ''}`);
}
if (!jsonc.exists) {
  console.log('wrangler.jsonc: MISSING');
} else {
  console.log(`wrangler.jsonc: FOUND | project=${jsonc.name} | compat_date=${jsonc.compatDate} | nodejs_compat=${jsonc.nodeCompat}`);
}

const ok = missing.length === 0 && toml.exists && toml.coordinator && toml.kv && jsonc.exists && jsonc.nodeCompat;
if (!ok) {
  console.error('\nERROR: Environment not fully configured. See messages above.');
  process.exit(1);
}
console.log('\nOK: Environment looks ready.');
