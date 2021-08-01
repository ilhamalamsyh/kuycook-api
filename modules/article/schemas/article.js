const { gql } = require("apollo-server-express");

module.exports = gql`
  type Article {
    id: ID!
    title: String!
    description: String!
    image: ArticleMedia!
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }

  extend type Query {
    articleList: [Article]
    articleDetail(id: ID!): Article
  }

  extend type Mutation {
    articleCreate(input: ArticleInput!): Article
    articleUpdate(id: ID!, input: ArticleInput!): Article
    articleDelete(id: ID!): Article
  }

  input ArticleInput {
    title: String!
    description: String!
    image: String
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }

  type ArticleMedia {
    id: ID
    url: String
    articleId: ID
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }
`;
