# Personal Brand Booster Prompt Templates

These templates document the deterministic local generation patterns used by the MVP. They are not sent to an external model.

## Brief extraction template

```text
Source title: <first markdown H1, first non-empty line, or source filename>
One-line thesis: <first meaningful claim from source>
Key claims: <bullets and sentence-level claims from source>
Personal-brand angle: Igor Vepretski turns scattered platform activity into a managed 7ya.io content system.
Audience: founders, creators, operators, personal-brand builders, bilingual audiences
Proof points: <source lines with numbers, links, proof/result terms, or top claims>
Reusable hooks: <deterministic hook templates using source title and thesis>
Source reference: <source path passed to CLI>
```

## Platform markdown template

```text
channel: <channel name>
language: <en|he>
title/hook: <deterministic hook>

body:
<platform-specific body generated from brief thesis, claims, proof points, and language copy>

CTA:
<CTA intro>
Manage 7ya.io
https://7ya.io

source reference: <source path>
```

## CTA template

Every CTA variant must preserve the exact CTA phrase and link:

```text
<short contextual intro>
Manage 7ya.io
https://7ya.io
```

## Channel intent templates

| Channel | Intent |
| --- | --- |
| X / Twitter | short thesis and fast hook |
| LinkedIn | authority post with claims and business angle |
| Instagram | caption with visual/social framing |
| TikTok / Shorts | hook, body, proof, close script |
| Newsletter | owned-audience summary and takeaway |
| Blog draft | long-form authority draft |

## 7-day campaign template

```text
Day 1: Anchor thesis -> LinkedIn
Day 2: Short hook -> X / Twitter
Day 3: Visual caption -> Instagram
Day 4: Video script -> TikTok / Shorts
Day 5: Owned audience -> Newsletter
Day 6: Long-form authority -> Blog draft
Day 7: Recap and CTA reinforcement -> X / Twitter + LinkedIn
```
