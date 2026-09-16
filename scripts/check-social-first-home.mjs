import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync('packages/app/public/index.html','utf8');
const marker=html.indexOf('data-social-first-home');
const timeline=html.indexOf('id="throughline"');

assert.ok(marker>=0,'IGOR LIVE social-first section is missing');
assert.ok(timeline>=0,'Life Throughline marker is missing');
assert.ok(marker<timeline,'IGOR LIVE must appear before the chronological Life Throughline');
const cards=(html.match(/data-social-card=/g)||[]).length;
assert.ok(cards>=6,`expected at least 6 source-linked social cards, found ${cards}`);
for(const token of ['Instagram','TikTok','YouTube','Facebook','Telegram','Threads','LinkedIn']) assert.ok(html.includes(token),`missing early social platform: ${token}`);
for(const url of ['instagram.com/igor.vepretski','tiktok.com/@igor.vepretski','youtube.com/@IgorVepretski','facebook.com/vepretski7','t.me/vepretski','threads.net/@igor.vepretski','linkedin.com/in/vepretski']) assert.ok(html.includes(url),`missing canonical social link: ${url}`);
assert.ok(html.includes('5.13M views'),'verified Nawan source-local metric is missing');
assert.ok(html.includes('750K views'),'verified owned YouTube source-local metric is missing');
assert.ok(!html.includes('SYNTHETIC SOCIAL METRIC'),'synthetic social metrics are forbidden');
console.log(`Social-first homepage contract satisfied: ${cards} cards before Life Throughline.`);
