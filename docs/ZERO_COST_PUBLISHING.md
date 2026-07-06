# 7YA Zero-Cost Publishing Plan

## Goal

Run the public 7YA site without paid hosting.

The site in `packages/app/public` is static. It can be published without Vercel, Replit, Shopify, or a running server.

## Primary route

Use GitHub Pages.

This branch adds `.github/workflows/pages.yml`. The workflow publishes `packages/app/public` as the site artifact.

One-time GitHub setting:

1. Repository Settings.
2. Pages.
3. Source: GitHub Actions.
4. Run the workflow named `Publish 7YA Static Site`.

The file `packages/app/public/CNAME` sets the custom domain to `7ya.io`.

## Backup route

Use Cloudflare Pages free static hosting.

Settings:

- Repository: `vepretski/7ya.io`
- Branch: `dev`
- Build command: none
- Output directory: `packages/app/public`
- Custom domain: `7ya.io`

## Cost discipline

Pause paid services until the site is stable:

- Vercel paid deployment is not required for this static site.
- Replit paid hosting is not required for this static site.
- Shopify should stay only if there is active store revenue.
- GitHub Copilot Pro is useful but not required for GitHub Pages.

## Public rule

No unsupported metrics. No inflated claims. Use source-gated wording only.
