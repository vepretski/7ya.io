# codex implement production ready netlify functions api

Implementation status: landed on `dev`.

Scope:

- Netlify build configuration.
- Serverless health endpoint.
- Serverless intake endpoint.
- Contact endpoint alias.
- API documentation.
- CI validation workflow.

Required Netlify environment variables:

```text
SEVENYA_ALLOWED_ORIGIN=https://7ya.io
SEVENYA_INTAKE_WEBHOOK_URL=<private webhook URL>
```

Do not commit secret values.
