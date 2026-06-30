# 7YA Domain Control + Replit Exit Runbook

Date: 2026-06-30
Owner: Igor Vepretski / 7YA
Status: operational recovery plan

## Executive decision

7ya.io should not depend on Replit Agent for production publishing.

The stable control model is:

1. GitHub repo `vepretski/7ya.io` is the source of truth.
2. Vercel project `7ya-io-app` is the deployment layer.
3. DNS for `7ya.io` and `www.7ya.io` points to Vercel, not Replit.
4. Replit remains only a temporary workshop/sandbox and should not own the domain route.
5. Microsoft/NVIDIA references remain technology-direction labels unless verified partner/funding evidence is attached.

## Evidence found from mailbox and platform checks

- Replit sent repeated payment-failed notices between 2026-06-20 and 2026-06-29.
- Replit also sent a publishing-success notice on 2026-06-20 showing `https://7-yaio-igor-vepretski.replit.app` and `https://7ya.io`.
- GitHub sent a Pages-domain-unverified notice on 2026-06-29 because the `7ya.io` TXT verification record was missing.
- Vercel has a team named `igor vepretski's projects` and a project named `7ya-io-app`.
- Vercel project `7ya-io-app` is framework `vite` and its latest production deployment is READY.
- The same Vercel project currently lists only Vercel-managed domains, not `7ya.io`.

## Current risk

The domain is the weak point, not the site code.

Production is split between:

- Replit publishing history,
- Vercel working deployment,
- GitHub Pages verification warning,
- GitHub billing/workflow noise.

This creates operational confusion and public-site fragility.

## Required DNS target

For Vercel production ownership:

```txt
A      @      76.76.21.21
CNAME  www    cname.vercel-dns.com
```

Remove old Replit DNS records for root or `www` after confirming the Vercel domain add flow.

Keep or restore the GitHub Pages verification TXT only if GitHub Pages remains enabled anywhere for this account/domain. If GitHub Pages is not the production host, still keep the TXT verification where possible because it reduces domain takeover warnings.

## Vercel checklist

1. Open Vercel team: `igor vepretski's projects`.
2. Open project: `7ya-io-app`.
3. Add domain: `7ya.io`.
4. Add domain: `www.7ya.io`.
5. Set redirect: `www.7ya.io` -> `7ya.io`.
6. Apply DNS records at Name.com or current DNS manager.
7. Wait for SSL status to become valid.
8. Verify:
   - `https://7ya.io/` returns the Vercel app.
   - `https://www.7ya.io/` redirects cleanly.
   - `https://7ya.io/sitemap.xml` returns 200.
   - `https://7ya.io/robots.txt` returns 200.
   - `https://7ya.io/talk/` returns 200.

## Replit containment rules

Until costs are under control:

- No agent runs unless a task is already scoped.
- No full rebuild from Replit.
- No production DNS ownership from Replit.
- No long-running dev server unless actively testing.
- No deletion of existing site without GitHub copy.
- Replit may be used only to export, inspect, or prototype.

## Site architecture after recovery

Public routes should be static-first:

- `/` — public command lobby.
- `/igor-vepretski/` — founder root.
- `/talk/` — direct contact/intake.
- `/social/` — public signal wall.
- `/labs/visual-ai/` — research/lab layer.
- `/sovereign/` — new fallback route proving the brand can exist without Replit runtime.

Use APIs only for features that actually need runtime behavior.

## Partnership language policy

Allowed:

- "Built in the Microsoft/Azure developer ecosystem."
- "Uses NVIDIA developer ecosystem research direction."
- "Technology direction: Microsoft, NVIDIA, StartOn, 7YA."

Not allowed without proof:

- "Official Microsoft partner."
- "NVIDIA funded."
- "Certified by Microsoft/NVIDIA."
- "Sponsored by Microsoft/NVIDIA."

## Recovery priority

1. Connect `7ya.io` to Vercel.
2. Restore GitHub domain verification TXT.
3. Keep Replit offline or sandboxed until billing is controlled.
4. Merge only static-safe public improvements first.
5. Move expensive agent/oracle/backend ideas behind feature flags.

## Definition of done

7YA is considered under control when:

- GitHub `vepretski/7ya.io` remains source of truth.
- Vercel owns production deployment.
- DNS points to Vercel.
- Replit is no longer authoritative for the domain.
- Public claims remain evidence-labeled.
- A non-Replit fallback route is live.
