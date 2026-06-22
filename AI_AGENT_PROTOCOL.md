# AI Agent Protocol

This repository uses an evidence-first execution gate.

## Status vocabulary

Every agent run that reports readiness must end with exactly one final status line:

- `SAFE_TO_TEST`
- `NEEDS_FIX`
- `UNSAFE`

No other final status is valid.

## Truth gate

An agent must not claim `SAFE_TO_TEST` unless it actually ran the required commands in the real repository and pasted the exact terminal output.

A test that did not run is not a test.
A build that did not run is not a build.
A feature that exists only in snippets is not a live system.
A green status without terminal evidence is invalid.

## Required evidence block

Before any `SAFE_TO_TEST` claim, the agent must paste exact output for:

```bash
pwd
git status --short
git branch --show-current
git diff --stat
find . -maxdepth 4 -type f | sort | grep -E 'AI_AGENT_PROTOCOL|copilot-instructions|workflows|evidence|ledger|claims|package.json' || true
npm --prefix packages/7ya-site run validate:evidence
```

If any command cannot be run, the final status must be `UNSAFE` or `NEEDS_FIX`.

## Forbidden simulation

Do not write summaries that imply tests passed unless the exact command output proves it.
Do not use invented QA results.
Do not replace repository evidence with narrative explanation.

## Domain language boundary

If a task defines forbidden domain terminology, the agent must run a repository search and paste exact output proving removal from application code. Documentation and this protocol may mention terms only for policy enforcement.

## Pull request gate

A pull request that is open, draft, or not merged must not be described as live in production.
