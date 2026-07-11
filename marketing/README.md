# 7YA Viral Memory Marketing OS

## Mission

Turn Igor Vepretski's **documented historic public resonance** into a repeatable, multilingual campaign system without inventing metrics, fabricating authority, copying media without rights, or automating inauthentic engagement.

The engine treats the existing `publication-index.json` as the source of truth. It ranks source records, assigns a narrative pillar, creates a seven-day review queue, and sends uncertain records to a verification backlog.

## Research baseline

The strongest recurring lanes in the current evidence set are:

1. **Origin → service → rebuilding** — documented adversity, meaningful service, public safety, and transition to social impact.
2. **Fatherhood and presence** — first-person family narratives that were reused by external publishers.
3. **Immigrant identity** — multilingual, Israeli-Ukrainian, generation-1.5 and belonging narratives.
4. **Protection and trust** — fraud, vulnerable populations, public responsibility, and evidence-aware communication.
5. **StartOn** — returning to the neighborhood and building a safe technology home for youth at risk.
6. **Creator archive** — interviews, podcasts, music, TikTok/YouTube history, and long-form public storytelling.
7. **Civic voice** — political and public-safety communication, always subject to an additional review gate.

This is not a claim that every item was viral or that exact historical reach is known. Priority bonuses reflect visible reuse, reposting, external publication, interviews, or canonical owned evidence.

## Pipeline

```text
PUBLIC INDEX
  → source verification gate
  → historic resonance scoring
  → narrative pillar classification
  → HE / RU / EN campaign brief
  → rights + political/safety review
  → human approval
  → approved platform publishing
  → metric snapshot + learning loop
```

## What is automated now

- Reads `packages/app/public/data/publication-index.json`.
- Excludes `VERIFY` records from publish-ready planning.
- Scores sources by verification, relationship, platform, and documented resonance signal.
- Generates 21 review briefs: 7 days × 3 slots.
- Rotates Hebrew, Russian, and English.
- Produces JSON and Markdown artifacts.
- Runs in GitHub Actions on demand, on relevant changes, and daily.

## What remains deliberately gated

The current release does **not** publish directly to social accounts. Direct publishing requires platform app approval, OAuth authorization, token storage, media-rights validation, and final approval.

The first connector target is TikTok's official Content Posting flow. It can upload a draft for the authorized user to review and finish in TikTok. YouTube upload, Meta publishing, LinkedIn publishing, newsletters, and other channels should be added only through their official APIs and permission models.

The system must never automate likes, follows, comments, mass replies, follower acquisition, or other simulated engagement.

## Run locally

```bash
python3 scripts/build_marketing_os.py
```

Outputs:

```text
artifacts/marketing/marketing-queue.json
artifacts/marketing/marketing-brief.md
```

Custom paths:

```bash
python3 scripts/build_marketing_os.py \
  --index path/to/publication-index.json \
  --config marketing/viral-archetypes.json \
  --output-dir artifacts/marketing
```

## Approval contract

A brief can move from queue to publishing only when all are true:

- The source URL or export is accessible.
- The source relationship is stated correctly: original, reposted, interviewed, distributed, reused, or mentioned.
- Any metric has a screenshot/export and capture date.
- Media rights permit the planned reuse.
- Political, safety, family, and vulnerable-population content receives the appropriate review.
- Final wording is approved by Igor Vepretski.

## Next implementation layer

1. Add a private metrics ledger keyed by source ID and capture date.
2. Add draft generation with citation locking and multilingual editorial review.
3. Add official OAuth connectors in draft-only mode.
4. Store post IDs and outcome snapshots without merging unlike metric types.
5. Feed observed performance back into source scoring while preserving historic evidence.
