# 7YA Zero-Cost Publishing Plan

## Goal

Run the public 7YA site without paid hosting.

The public rescue release is a static site in `packages/app/public`. It can be published without Replit paid hosting, Vercel paid setup, server-side rendering, a database, API keys, or external backend services.

## Current static output

The deployed artifact must use this directory:

```text
packages/app/public
```

Required public routes:

```text
/
/igor-vepretski/
/talk/
/social/
/pass/
/evidence/
/starton/
/contact/
/radar/
```

The root homepage must remain semantic HTML with crawlable text. It must not be replaced by an image-only landing page or demo tool.

## Primary free route: GitHub Pages

The workflow `.github/workflows/pages.yml` validates the static release and deploys `packages/app/public` with official GitHub Pages Actions.

One-time GitHub setting, if the workflow fails at `Configure Pages`:

1. Open repository Settings.
2. Open Pages.
3. Set Source to GitHub Actions.
4. Run the workflow named `Publish 7YA Static Site` again.

The repository default branch is `dev`. The file `packages/app/public/CNAME` sets the intended custom domain to `7ya.io` inside the published artifact.

## DNS lock for 7ya.io

Until DNS and Pages settings are correct, the repository can be healthy while `https://7ya.io/` still shows an older host or a blocked Vercel deployment.

For GitHub Pages, the apex domain `7ya.io` must point to GitHub Pages, not Vercel.

Use these DNS records at the DNS provider:

```text
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   vepretski.github.io
```

Remove old production DNS targets that point the apex or `www` host to Vercel once GitHub Pages is active.

Do not use wildcard DNS records such as `*.7ya.io` for this rescue release.

After DNS is changed, verify:

```bash
dig 7ya.io +noall +answer -t A
dig www.7ya.io +nostats +nocomments +nocmd
```

Expected result:

- `7ya.io` resolves to the four GitHub Pages A records above.
- `www.7ya.io` is a CNAME to `vepretski.github.io`.
- GitHub Pages can enforce HTTPS.
- `https://7ya.io/` no longer redirects to a `vercel.app` URL.

## Emergency diagnosis rule

If production fails again, classify the failure before editing code:

1. If the response contains `402`, `Payment required`, `DEPLOYMENT_DISABLED`, or a failed `Vercel` status, treat it as a hosting/billing/DNS problem, not an app-code problem.
2. If GitHub Pages is configured and DNS points to GitHub Pages, inspect the Pages workflow run.
3. If the static workflow passes but the domain is wrong, inspect DNS and Pages custom-domain settings.
4. Only edit the site code after the domain and publishing source are confirmed healthy.

## Backup free route: Cloudflare Pages

Use this only if GitHub Pages cannot be enabled.

Settings:

- Repository: `vepretski/7ya.io`
- Branch: `dev`
- Build command: none
- Output directory: `packages/app/public`
- Custom domain: `7ya.io`

## Optional existing free route: Vercel

Vercel can be used only if the existing project remains free and already connected. It is not required for this rescue release.

If Vercel is used, the public output must still be the static files under `packages/app/public`, and `/` must serve the crawlable homepage rather than redirecting to a demo route.

Vercel must not be the only production path for 7YA. A failed Vercel billing state must not be able to take the canonical domain offline.

## Cost discipline

Pause paid services until the site is stable:

- Replit paid hosting is not required for this static site.
- Vercel paid deployment is not required for this static site.
- Shopify is not required for the public 7YA rescue release.
- GitHub Copilot Pro is useful for coding, but not required for GitHub Pages.

## Public rule

No unsupported metrics. No inflated claims. No false endorsements. No fake institutional approval. Use source-gated wording only.

If a claim is not fully sourced, label it as draft, user-supplied, pending verification, or placeholder before publication.

## Publish trigger log

- 2026-07-08: Reconfirmed GitHub Pages as the zero-cost rescue path and triggered the static publishing workflow path.
