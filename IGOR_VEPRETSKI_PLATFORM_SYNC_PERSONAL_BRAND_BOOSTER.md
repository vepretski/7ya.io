# Igor Vepretski Platform Sync — Personal Brand Booster Addendum

This addendum documents the first automated Personal Brand Booster MVP for Igor Vepretski / 7ya.io.

## Command

```bash
bun run personal-brand:boost --source ./input/example.md --lang both --out ./outputs/personal-brand-booster
```

## Operational role

The booster turns one source item into a deterministic, local-only promotion package that keeps the platform sync plan executable.

It supports:

- English and Hebrew generation
- six platform channels
- a 7-day campaign plan
- hook and CTA banks
- a repurposing map
- validation of required CTA, channel, language, and non-empty markdown fields

## CTA enforcement

Every generated platform asset and CTA variant must include:

```text
Manage 7ya.io
https://7ya.io
```

## Platform sync relationship

This automation converts the platform sync plan from a manual content workflow into a repeatable local campaign artifact generator. The MVP does not publish to platforms; it produces validated assets that can be reviewed, scheduled, and posted through existing operational workflows.
