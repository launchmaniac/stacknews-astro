// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com
import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = { zoneId: process.env.CF_ZONE_ID || process.env.ZONE_ID, out: 'scripts/security-headers.live.json' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if ((a === '--zone-id' || a === '-z') && argv[i + 1]) {
      args.zoneId = argv[++i];
    } else if ((a === '--out' || a === '-o') && argv[i + 1]) {
      args.out = argv[++i];
    }
  }
  return args;
}

async function main() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const { zoneId, out } = parseArgs(process.argv);

  if (!token) {
    console.error('ERROR: CLOUDFLARE_API_TOKEN is required');
    process.exit(1);
  }
  if (!zoneId) {
    console.error('ERROR: --zone-id <ZONE_ID> is required (or set CF_ZONE_ID)');
    process.exit(1);
  }

  const base = `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets`;
  const headers = { Authorization: `Bearer ${token}` };

  const listRes = await fetch(`${base}?per_page=50`, { headers });
  if (!listRes.ok) {
    console.error('ERROR: Failed to list rulesets', listRes.status, await listRes.text());
    process.exit(1);
  }
  const list = await listRes.json();
  const ruleset = (list.result || []).find((r) => r.phase === 'http_response_headers_transform');
  if (!ruleset) {
    console.error('ERROR: No http_response_headers_transform ruleset found');
    process.exit(1);
  }

  const verRes = await fetch(`${base}/${ruleset.id}/versions/latest`, { headers });
  if (!verRes.ok) {
    console.error('ERROR: Failed to fetch latest ruleset version', verRes.status, await verRes.text());
    process.exit(1);
  }
  const latest = await verRes.json();

  const outPath = path.resolve(out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(latest, null, 2));
  console.log(`Wrote live ruleset snapshot to ${outPath}`);
}

main().catch((e) => {
  console.error('ERROR:', e);
  process.exit(1);
});

