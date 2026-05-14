# Personal Brand Booster MVP Spec

## Purpose

Build a deterministic, local-only automation slice that turns one source item into a personal-brand promotion package for Igor Vepretski / 7ya.io.

The booster preserves the existing CTA policy:

```text
Manage 7ya.io
https://7ya.io
```

## Command

```bash
bun run personal-brand:boost --source ./input/example.md --lang both --out ./outputs/personal-brand-booster
```

## Scope

In scope:

- Read one markdown or text source file.
- Extract a reusable campaign brief.
- Generate deterministic platform assets for six channels.
- Generate English and/or Hebrew outputs according to `--lang`.
- Generate a 7-day posting plan, hook bank, CTA bank, and repurposing map.
- Validate generated platform markdown files.

Out of scope:

- UI
- database
- auth
- external model calls
- scheduler integration
- platform publishing APIs
- platform refactors

## Supported languages

- `en`
- `he`
- `both`

`both` expands to English and Hebrew outputs.

## Supported channels

- X / Twitter
- LinkedIn
- Instagram
- TikTok / Shorts
- Newsletter
- Blog draft

## Required output files

- `brief.json`
- `campaign-plan.json`
- `validation.json`
- `README.md`
- `{lang}-x-post.md`
- `{lang}-linkedin-post.md`
- `{lang}-instagram-caption.md`
- `{lang}-tiktok-shorts-script.md`
- `{lang}-newsletter-summary.md`
- `{lang}-blog-draft.md`
- `daily-posting-plan.md`
- `hook-bank.md`
- `cta-bank.md`
- `repurposing-map.md`

For `--lang both`, all English and Hebrew platform files are generated.

## Platform markdown contract

Every generated platform markdown file must include:

- `channel`
- `language`
- `title/hook`
- `body`
- `CTA`
- `source reference`

## Validation rules

Validation fails a platform file when:

- file is empty
- CTA phrase is missing
- CTA link is missing
- channel is missing
- language is missing
- language is not `en` or `he`

Validation results are written to `validation.json` with per-file pass/fail status and check details.

## Determinism

The MVP avoids timestamps, random IDs, remote calls, and model calls. The same input and arguments produce the same output content.
