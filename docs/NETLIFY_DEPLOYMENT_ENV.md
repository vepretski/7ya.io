# Netlify deployment environment

Set these values in Netlify environment variables.

Do not paste secret values into chat or commit them to Git.

Required for strict origin control:

```text
SEVENYA_ALLOWED_ORIGIN=https://7ya.io
```

Required for real intake delivery:

```text
SEVENYA_INTAKE_WEBHOOK_URL=<private owned webhook>
```

Without the webhook, the intake API still validates requests and returns a request ID, but it reports `received_not_delivered`.
