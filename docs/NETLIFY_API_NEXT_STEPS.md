# Netlify API next steps

1. Connect the repository to Netlify.
2. Set publish directory to `packages/app/public`.
3. Set functions directory to `netlify/functions`.
4. Add `SEVENYA_ALLOWED_ORIGIN=https://7ya.io`.
5. Add `SEVENYA_INTAKE_WEBHOOK_URL` only inside Netlify environment variables.
6. Deploy.
7. Test `GET /api/health`.
8. Test `GET /api/intake`.
9. Test `POST /api/intake` with a safe sample payload.
