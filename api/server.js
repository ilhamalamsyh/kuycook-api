const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const typeDefs = require('../graphql/schemas');
const resolvers = require('../graphql/resolvers');
const context = require('../graphql/context');

const app = express();

app.use(cors());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: {
    settings: {
      'schema.polling.enable': false,
    },
  },
});

apolloServer.applyMiddleware({ app, path: '/api/v1' });

const server = createServer(app);

module.exports = server;
