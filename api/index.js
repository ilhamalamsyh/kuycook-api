const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const { graphqlUploadExpress } = require('graphql-upload');
const typeDefs = require('../graphql/schemas');
const resolvers = require('../graphql/resolvers');
const context = require('../graphql/context');

const app = express();

app.use(cors());
app.use(graphqlUploadExpress());

const apolloServer = new ApolloServer({
  uploads: false,
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
