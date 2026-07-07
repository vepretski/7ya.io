# API final state

Current state:

- static publishing path remains packages/app/public;
- health API returns JSON and rejects unsupported methods;
- intake API validates JSON requests before parsing;
- request IDs use explicit runtime import;
- contact page posts to the intake API and keeps email fallback;
- validation script checks API files and contact UI wiring.
