import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const evidenceUrl = new URL('../public/api/evidence.json', import.meta.url);
const evidencePath = fileURLToPath(evidenceUrl);
const rawData = fs.readFileSync(evidencePath, 'utf8');

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exit(1);
};

let data;
try {
  data = JSON.parse(rawData);
} catch (error) {
  fail(`evidence.json is not valid JSON: ${error.message}`);
}

if (/[\u2018\u2019\u201c\u201d]/.test(rawData)) {
  fail('Smart quotes found in raw evidence.json. Use straight ASCII quotes only.');
}

if (!Array.isArray(data.items)) {
  fail('Top-level items must be an array.');
}

if (data.count !== data.items.length) {
  fail(`Top-level count mismatch: count=${data.count}, items.length=${data.items.length}.`);
}

const rendererSafeFields = [
  'claimId',
  'publicWording',
  'status',
  'sourceTier',
  'canonicalSource',
  'context',
  'lastReviewed',
];

const metricRequiredFields = [
  'asset_id',
  'platform',
  'publisher_account',
  'title_post_shorthand',
  'source_url',
  'metric_label',
  'metric_value',
  'verification_status',
  'screenshot_required',
  'evidence',
];

const forbiddenDerivedExposurePattern = /(?:cumulative|aggregate|combined|total|derived|estimated)[_-]?exposure|(?:cumulative|aggregate|combined|derived|estimated)[_-]?(?:reach|impressions|views)/i;
const metricRows = [];

for (const [index, item] of data.items.entries()) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    fail(`Item at index ${index} must be an object.`);
  }

  for (const field of rendererSafeFields) {
    if (!(field in item)) {
      fail(`Item at index ${index} is missing renderer-safe field: ${field}.`);
    }
  }

  if ('asset_id' in item) {
    metricRows.push(item);

    for (const field of metricRequiredFields) {
      if (!(field in item)) {
        fail(`Metric row ${item.asset_id ?? `(index ${index})`} is missing field: ${field}.`);
      }
    }

    const metricLabel = String(item.metric_label ?? '');
    if (forbiddenDerivedExposurePattern.test(metricLabel)) {
      fail(`Metric row ${item.asset_id} uses a forbidden derived or aggregate metric_label: ${item.metric_label}.`);
    }

    for (const key of Object.keys(item)) {
      if (forbiddenDerivedExposurePattern.test(key)) {
        fail(`Metric row ${item.asset_id} contains forbidden derived or aggregate field: ${key}.`);
      }
    }
  }
}

const findMetricRow = (assetId) => metricRows.filter((row) => row.asset_id === assetId);
const videoRows = findMetricRow('youtube_pzOlz8kGmeU');
const profileRows = findMetricRow('youtube_profile_igor_vepretski_7ya');

if (videoRows.length !== 1) {
  fail(`Expected exactly one youtube_pzOlz8kGmeU metric row, found ${videoRows.length}.`);
}

if (profileRows.length !== 1) {
  fail(`Expected exactly one youtube_profile_igor_vepretski_7ya metric row, found ${profileRows.length}.`);
}

const [ytVideo] = videoRows;
const [ytProfile] = profileRows;

if (ytVideo.metric_label !== 'views' || ytVideo.metric_value !== 25) {
  fail('youtube_pzOlz8kGmeU must remain metric_label "views" and metric_value 25.');
}

if (ytProfile.metric_label !== 'subscribers' || ytProfile.metric_value !== 2570) {
  fail('youtube_profile_igor_vepretski_7ya must remain metric_label "subscribers" and metric_value 2570.');
}

if (ytVideo.asset_id === ytProfile.asset_id) {
  fail('YouTube video and profile metric rows must remain separate asset IDs.');
}

if (ytVideo.metric_label === ytProfile.metric_label) {
  fail('YouTube views and subscribers must remain separate metric labels.');
}

console.log('PASS: Evidence ledger JSON valid. Package-local invariants maintained; YouTube views and subscribers remain separate and non-aggregated.');
