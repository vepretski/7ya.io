#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/data
base64 -d .ledger/master.gz.b64 | gzip -dc > public/data/7ya-master-public-system.json
base64 -d .ledger/audit.gz.b64 | gzip -dc > public/data/7ya-public-web-audit.json
node <<'NODE'
const fs = require('fs');
const master = JSON.parse(fs.readFileSync('public/data/7ya-master-public-system.json', 'utf8'));
const audit = JSON.parse(fs.readFileSync('public/data/7ya-public-web-audit.json', 'utf8'));
const duplicates = master.sources.map(x => x.id).filter((id, i, all) => all.indexOf(id) !== i);
if (master.sources.length !== 83) throw new Error(`master sources=${master.sources.length}`);
if (audit.urls.length !== 83) throw new Error(`audit urls=${audit.urls.length}`);
if (master.moments.length !== 7) throw new Error(`moments=${master.moments.length}`);
if (master.open_verification.length !== 8) throw new Error(`open verification=${master.open_verification.length}`);
if (master.resolutions_and_discoveries.length !== 11) throw new Error(`resolutions/discoveries=${master.resolutions_and_discoveries.length}`);
if (duplicates.length) throw new Error(`duplicate source ids=${duplicates.join(',')}`);
console.log('7YA ledger validated: sources=83 audit=83 moments=7 pending=8 discoveries=11 duplicates=0');
NODE
