import fs from 'node:fs';
import assert from 'node:assert/strict';

const lifeHtml=fs.readFileSync('packages/app/public/life-v2/index.html','utf8');
const homeHtml=fs.readFileSync('packages/app/public/index.html','utf8');
const css=fs.readFileSync('packages/app/public/assets/living-life.css','utf8');
const launchCss=fs.readFileSync('packages/app/public/assets/launch.css','utf8');
const js=fs.readFileSync('packages/app/public/assets/living-life.js','utf8');

for(const token of ['7YA / LIFE','1990 → NOW','THEN / NOW','VOICE','EVIDENCE','PEOPLE','ASK THE ARCHIVE']) assert.ok(lifeHtml.includes(token),`missing ${token}`);
assert.ok(lifeHtml.includes('data-evidence'), 'evidence controls missing');
assert.ok(lifeHtml.includes('data-year'), 'timeline controls missing');
assert.ok(css.includes('@media(max-width:720px)'), 'mobile composition gate missing');
assert.ok(css.includes('prefers-reduced-motion'), 'reduced-motion gate missing');
assert.ok(js.includes('source_alignment'), 'source alignment status missing');
assert.ok(js.includes('evidence'), 'evidence interaction missing');

// Recovery contract: the canonical Vercel homepage must feel personal within the first viewport.
assert.ok(homeHtml.includes('data-first-fold-life'), 'canonical homepage is missing the first-fold life wall');
const firstFoldMoments=(homeHtml.match(/data-life-moment=/g)||[]).length;
assert.ok(firstFoldMoments>=8,`expected at least 8 first-fold life moments, found ${firstFoldMoments}`);
for(const token of ['CHILDHOOD','SERVICE','POLICE','FATHERHOOD','STARTON','CREATE','PUBLIC VOICE','NOW']) {
  assert.ok(homeHtml.includes(token),`first-fold life wall missing ${token}`);
}
assert.ok(homeHtml.includes('#7YA🥷'), 'canonical brand hashtag missing ninja mark');
assert.ok(homeHtml.includes('REAL SOURCE'), 'first-fold authentic-media disclosure missing');
assert.ok(launchCss.includes('.life-wall'), 'first-fold life wall styling missing');
assert.ok(launchCss.includes('@media(max-width:720px)'), 'canonical mobile composition gate missing');

console.log('PASS living-life-premium contract');
