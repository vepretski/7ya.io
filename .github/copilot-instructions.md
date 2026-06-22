# Copilot / Agent Instructions

Follow `AI_AGENT_PROTOCOL.md` before reporting readiness.

## Execution rules

1. Do not claim readiness without exact command output.
2. Do not use narrative QA as a substitute for terminal evidence.
3. Do not mark a draft or unmerged pull request as live.
4. Do not mask failing commands with permissive shell bypasses.
5. If you cannot access the terminal or repository, end with `UNSAFE`.

## Required final format

The last line of every readiness response must be exactly one of:

- `SAFE_TO_TEST`
- `NEEDS_FIX`
- `UNSAFE`

## Required evidence before `SAFE_TO_TEST`

Paste exact output for:

```bash
pwd
git status --short
git branch --show-current
git diff --stat
find . -maxdepth 4 -type f | sort | grep -E 'AI_AGENT_PROTOCOL|copilot-instructions|workflows|evidence|ledger|claims|package.json' || true
npm --prefix packages/7ya-site run validate:evidence
```

If the scope includes database persistence, authentication, admin routes, or domain-language refactors, also provide exact output for the relevant migrations, auth checks, endpoint checks, and repository searches.
