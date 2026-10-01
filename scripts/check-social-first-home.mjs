import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync('packages/app/public/index.html','utf8');
const marker=html.indexOf('data-social-first-home');
const timeline=html.indexOf('id="throughline"');

assert.ok(marker>=0,'IGOR LIVE social-first section is missing');
assert.ok(timeline>=0,'Life Throughline marker is missing');
assert.ok(marker<timeline,'IGOR LIVE must appear before the chronological Life Throughline');

const cards=(html.match(/data-social-card=/g)||[]).length;
const facebookEmbeds=(html.match(/data-facebook-embed=/g)||[]).length;
const realMedia=(html.match(/data-real-media=/g)||[]).length;

assert.ok(cards>=10,`expected at least 10 source-linked social cards, found ${cards}`);
assert.ok(realMedia>=10,`expected at least 10 visible real-media moments, found ${realMedia}`);
assert.ok(facebookEmbeds>=4,`expected at least 4 real Facebook embeds, found ${facebookEmbeds}`);
assert.ok(!html.includes('social-source-frame'),'generic social source-frame placeholders are forbidden on the homepage');

for(const token of ['Instagram','TikTok','YouTube','Facebook','Telegram','Threads','LinkedIn']) assert.ok(html.includes(token),`missing early social platform: ${token}`);
for(const url of ['instagram.com/igor.vepretski','tiktok.com/@igor.vepretski','youtube.com/@IgorVepretski','facebook.com/vepretski7','t.me/vepretski','threads.net/@igor.vepretski','linkedin.com/in/vepretski']) assert.ok(html.includes(url),`missing canonical social link: ${url}`);
assert.ok(html.includes('5.13M views'),'verified Nawan source-local metric is missing');
assert.ok(html.includes('750K views'),'verified owned YouTube source-local metric is missing');
assert.ok(!html.includes('SYNTHETIC SOCIAL METRIC'),'synthetic social metrics are forbidden');

const imageUrls=[...html.matchAll(/data-real-media[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
const duplicates=imageUrls.filter((url,i)=>imageUrls.indexOf(url)!==i);
assert.equal(new Set(duplicates).size,0,`duplicate real-media image URLs are forbidden: ${[...new Set(duplicates)].join(', ')}`);

console.log(`Social-first homepage contract satisfied: ${cards} cards, ${facebookEmbeds} Facebook embeds, ${realMedia} real-media moments.`);
