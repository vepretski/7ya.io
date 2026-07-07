# API ready

Ready checks:

- Netlify uses packages/app/public;
- Netlify uses netlify/functions;
- allowed origin is https://7ya.io;
- private delivery endpoint is stored only in Netlify settings;
- health route returns ok;
- intake route returns schema;
- intake submit returns accepted or received_not_delivered.
