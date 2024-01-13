require('dotenv').config();

const server = require('./api/index');

const port = process.env.PORT || 8080;

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error(`${new Date().toLocaleString()} uncaughtException: ${err}`);
  // process.exit(1);
});

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error(`${new Date().toLocaleString()} unhandledRejection: ${err}`);
});

server.listen({ port }, () =>
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:${port}/api/v1`)
);
