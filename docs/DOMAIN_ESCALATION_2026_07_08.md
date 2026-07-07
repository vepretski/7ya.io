# 7YA domain escalation — 2026-07-08

## Confirmed custody

Replit Support confirmed that `7ya.io` is a Replit-purchased domain registered through Name.com on Replit's backend. This explains why the domain is not visible in Igor's personal Name.com account.

## Immediate recovery choice

Use the fastest control path first: ask Replit to change the nameservers to the Cloudflare zone already prepared for `7ya.io`.

Cloudflare nameservers requested:

```text
anahi.ns.cloudflare.com
dakota.ns.cloudflare.com
```

## After Cloudflare receives authority

Set the production records for GitHub Pages:

```text
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   vepretski.github.io
```

Then verify that `https://7ya.io/` no longer redirects to a `vercel.app` URL.

## Permanent-control follow-up

After the site is stable, request transfer of the domain into Igor's own registrar account so future DNS changes do not require Replit support.
