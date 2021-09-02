const { gql } = require('apollo-server-express');

module.exports = gql`
  type Banner {
    id: ID!
    title: String!
    image: String!
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }

  extend type Query {
    bannerList(page: Int, pageSize: Int): [Banner]
    bannerDetail(id: ID!): Banner
  }

  extend type Mutation {
    bannerCreate(input: BannerInput!): Banner
    bannerUpdate(id: ID!, input: BannerInput!): Banner
    bannerDelete(id: ID!): Banner
  }

  input BannerInput {
    title: String!
    image: String!
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }
`;
