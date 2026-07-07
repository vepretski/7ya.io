# Safe intake test payload

Use this only after Netlify deploys the functions.

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "topic": "7YA API test",
  "message": "This is a safe test message for the 7YA intake API.",
  "source": "manual-test"
}
```

Expected behavior:

- with webhook configured: `accepted`;
- without webhook configured: `received_not_delivered`.
