# 7YA Content Operations

`script/7ya-content-engine.ts` is the controlled content-to-conversion loop for 7YA.

## What it does

1. Accepts one or more verified source files (notes, transcripts, published posts, or research packets).
2. Produces Hebrew and English Telegram copy, an evidence-led article, and short-form follow-ups.
3. Adds unique UTM parameters to every Telegram CTA.
4. Stops at `draft`; nothing is sent publicly until a reviewed package is explicitly approved.
5. Publishes the approved Telegram package only when `--confirm` is supplied and the channel credentials are configured.
6. Records reach, clicks, leads, and conversions, then uses the strongest measured prior pattern to guide the next draft.

## Commands

```bash
# Build a bilingual, approval-required package from verified source material.
bun run content:prepare --source content/inbox/source.md --source content/research/context.md --goal "Move readers into the 7YA guide"

# Review files under outputs/content-ops/campaigns/<campaign-id>/, then approve.
bun run content:approve --id <campaign-id>

# Intentionally publish the approved Telegram messages. No automatic publishing exists.
TELEGRAM_BOT_TOKEN=... TELEGRAM_CHANNEL_ID=@vepretski bun run content:publish --id <campaign-id> --confirm

# Import measured data from a JSON file.
bun run content:feedback --id <campaign-id> --metrics content/metrics/<campaign-id>.json

# Create a portfolio-level learning report.
bun run content:report
```

Metrics input accepts:

```json
{
  "impressions": 38622,
  "clicks": 824,
  "leads": 76,
  "conversions": 21
}
```

## Safety and evidence rules

- The engine treats source packets as the only factual record. It does not invent people, claims, dates, metrics, legal conclusions, or research citations.
- Optional AI editing is enabled only when `OPENAI_API_KEY` is present. Its prompt is source-bounded, and the resulting package still has to clear the validation gate and human approval.
- Political, reputational, fundraising, or sensitive content stays approval-gated. The automation can prepare, measure, and recommend; it never chooses to publish.
- Keep bot credentials in deployment/CI secrets, never in source files or campaign packets.

## Measurement contract for 7ya.io

Every Telegram CTA contains `utm_source=telegram`, `utm_medium=community`, `utm_campaign`, and `utm_content`. The site should record these events with the same campaign ID:

| Event | When | Minimum fields |
| --- | --- | --- |
| `campaign_landing_view` | Landing page loaded | campaign, content, locale, referrer |
| `campaign_engaged` | 45 seconds, 50% scroll, or meaningful interaction | campaign, content, engagement_type |
| `campaign_lead` | Email, Telegram join, form, or guide request completed | campaign, content, lead_type |
| `campaign_conversion` | The defined action is completed | campaign, content, conversion_type, value if applicable |

Use consent-aware analytics and avoid storing message text, identifiers, or sensitive audience data unless it is necessary for the action and covered by an appropriate privacy notice.

## Operating rhythm

One source packet → one reviewed campaign → Telegram anchor → site article/guide → two follow-up posts → metric import after 48–72 hours → one variable tested in the next campaign.

The result is a compounding editorial system, not an uncontrolled content machine.
