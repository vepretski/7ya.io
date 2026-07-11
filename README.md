# 7YA production site

Static multi-page production rebuild for `7ya.io`.

## Pages
- `index.html`
- `about.html`
- `media.html`
- `archive.html`

## Deploy on GitHub Pages
1. Create a GitHub repo.
2. Upload all files from this folder to the repo root.
3. In GitHub, enable **Pages** with **GitHub Actions**.
4. Set custom domain to `7ya.io`.
5. Point DNS to GitHub Pages.
6. Enable HTTPS.

## Notes
- `CNAME` is included for `7ya.io`.
- Source-backed records live in `data/content.json`.
- The site is static and deploys without a build step.