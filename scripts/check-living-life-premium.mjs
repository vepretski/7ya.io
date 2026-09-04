import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync('packages/app/public/index.html','utf8');
const css=fs.readFileSync('packages/app/public/assets/living-life.css','utf8');
const js=fs.readFileSync('packages/app/public/assets/living-life.js','utf8');

for(const token of ['7YA / LIFE','1990 → NOW','THEN / NOW','VOICE','EVIDENCE','PEOPLE','ASK THE ARCHIVE']) assert.ok(html.includes(token),`missing ${token}`);
assert.ok(html.includes('data-evidence'), 'evidence controls missing');
assert.ok(html.includes('data-year'), 'timeline controls missing');
assert.ok(css.includes('@media(max-width:720px)'), 'mobile composition gate missing');
assert.ok(css.includes('prefers-reduced-motion'), 'reduced-motion gate missing');
assert.ok(js.includes('source_alignment'), 'source alignment status missing');
assert.ok(js.includes('evidence'), 'evidence interaction missing');
console.log('PASS living-life-premium contract');
