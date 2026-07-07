# 7YA Netlify Functions API

This is the production-safe serverless API layer for the static 7YA rescue release.

## Public routes

- `GET /api/health` — runtime health check.
- `GET /api/intake` — returns intake schema and webhook configuration status.
- `POST /api/intake` — validates and receives contact/intake submissions.

## Environment variables

Set these in Netlify project environment variables only. Do not commit secret values.

```text
SEVENYA_ALLOWED_ORIGIN=https://7ya.io
SEVENYA_INTAKE_WEBHOOK_URL=<private webhook URL>
```

`SEVENYA_INTAKE_WEBHOOK_URL` is optional for deployment, but required for real delivery to a private automation endpoint such as Make, Zapier, Slack workflow, or another owned webhook.

## Behavior

The API is intentionally dependency-free and database-free:

- rejects unsupported HTTP methods;
- returns JSON only;
- uses no-store cache headers;
- validates name, email, and message;
- caps request body size;
- truncates submitted fields;
- rejects honeypot spam fields;
- never logs full message bodies or secrets;
- returns a request ID for operational follow-up;
- degrades safely when no webhook is configured.

## Static site safety

The static public site remains served from:

```text
packages/app/public
```

The Netlify layer must not replace the GitHub Pages rescue flow. It is an optional API/deployment path for forms and serverless actions.
