#!/usr/bin/env bash
set -euo pipefail

# Apply Cloudflare Transform Rules for security headers.
# Requirements:
#  - env CF_API_TOKEN (with Rulesets:Write and Zone:Read permissions)
#  - env CF_ZONE_ID (zone ID for stacknews.org)
# Usage:
#  CF_API_TOKEN=... CF_ZONE_ID=... ./scripts/apply-security-headers.sh

HERE=$(cd "$(dirname "$0")" && pwd)
JSON_PAYLOAD="$HERE/security-headers.json"

if [[ -z "${CF_API_TOKEN:-}" || -z "${CF_ZONE_ID:-}" ]]; then
  echo "CF_API_TOKEN and CF_ZONE_ID must be set" >&2
  exit 1
fi

API="https://api.cloudflare.com/client/v4"

echo "Backing up current response header ruleset entrypoint..."
curl -fsSL -H "Authorization: Bearer $CF_API_TOKEN" \
  "$API/zones/$CF_ZONE_ID/rulesets/phases/http_response_headers_transform/entrypoint" \
  -o "$HERE/backup-http_response_headers_transform-entrypoint.json"

echo "Applying security headers ruleset..."
curl -fsSL -X PUT -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d @"$JSON_PAYLOAD" \
  "$API/zones/$CF_ZONE_ID/rulesets/phases/http_response_headers_transform/entrypoint" \
  -o "$HERE/apply-http_response_headers_transform-entrypoint.json"

echo "Done. Verify headers with: curl -sI https://stacknews.org/ | rg -i 'strict|content-security|referrer|frame|permissions|nosniff'"

