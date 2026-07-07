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

The file `packages/app/public/CNAME` sets the intended custom domain to `7ya.io` inside the published artifact.

DNS must also point to GitHub Pages before the apex domain can serve the new static release. Until DNS and Pages settings are correct, the repository can be healthy while `https://7ya.io/` still shows an older host.

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

## Cost discipline

Pause paid services until the site is stable:

- Replit paid hosting is not required for this static site.
- Vercel paid deployment is not required for this static site.
- Shopify is not required for the public 7YA rescue release.
- GitHub Copilot Pro is useful for coding, but not required for GitHub Pages.

## Public rule

No unsupported metrics. No inflated claims. No false endorsements. No fake institutional approval. Use source-gated wording only.

If a claim is not fully sourced, label it as draft, user-supplied, pending verification, or placeholder before publication.
