# Netlify API security notes

The API avoids storing or exposing sensitive data.

Current guardrails:

- no committed secrets;
- no database dependency;
- no full message-body logging;
- request ID for operational tracing;
- payload size cap;
- field truncation;
- email validation;
- honeypot rejection;
- method allowlisting;
- no-store response caching;
- JSON-only responses.

Before public use, configure a private owned webhook in Netlify as `SEVENYA_INTAKE_WEBHOOK_URL`.
