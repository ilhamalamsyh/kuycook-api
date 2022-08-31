require('dotenv').config({ silent: process.env.NODE_ENV === 'production' })

const server = require('./api/server');

const port = process.env.PORT || 8080;

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error(`${new Date().toUTCString()} uncaughtException: ${err}`);
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error(`${new Date().toUTCString()} unhandledRejection: ${err}`);
});

server.listen({ port }, () =>
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:${port}/api/v1`)
);
