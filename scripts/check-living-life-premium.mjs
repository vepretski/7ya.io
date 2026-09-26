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

// Canonical homepage contract: Igor is the experience; system machinery stays behind the story.
assert.ok(homeHtml.includes('data-documentary-home="v2"'), 'canonical homepage is missing the documentary-home cutover marker');
assert.ok(homeHtml.includes('id="life-film"'), 'canonical homepage is missing the Life Film narrative spine');
const documentaryMoments=(homeHtml.match(/data-documentary-moment=/g)||[]).length;
assert.ok(documentaryMoments>=8,`expected at least 8 documentary life moments, found ${documentaryMoments}`);
for(const token of ['CHILDHOOD','SERVICE','POLICE','FATHERHOOD','STARTON','CREATE','PUBLIC VOICE','NOW']) {
  assert.ok(homeHtml.includes(token),`documentary life story missing ${token}`);
}
assert.ok(homeHtml.includes('IGOR VEPRETSKI · KHARKIV 1990 → ISRAEL → NOW'), 'identity and chronology must lead the first screen');
assert.ok(homeHtml.includes('FACE → MOMENT → STORY → MEDIA → CONSEQUENCE → NEXT'), 'human narrative hierarchy marker missing');
assert.ok(homeHtml.includes('#7YA🥷'), 'canonical brand hashtag missing ninja mark');
assert.ok(homeHtml.includes('REAL SOURCE'), 'authentic-media disclosure missing');
assert.ok(!homeHtml.includes('<div class="life-wall"'), 'legacy dashboard-like life wall must not lead the homepage');
assert.ok(launchCss.includes('.life-film'), 'Life Film styling missing');
assert.ok(launchCss.includes('.documentary-moment'), 'documentary moment styling missing');
assert.ok(launchCss.includes('@media(max-width:720px)'), 'canonical mobile composition gate missing');
assert.ok(launchCss.includes('prefers-reduced-motion'), 'canonical reduced-motion gate missing');

console.log('PASS living-life-premium documentary contract');
