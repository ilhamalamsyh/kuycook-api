const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  type User {
    id: Int!
    fullname: String!
    gender: String!
    email: String!
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
    recipes: String #[Recipe!]
    favoriteRecipe: String #[FavoriteRecipe!]
  }

  extend type Mutation {
    register(input: UserRegisterInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    userUpdate(id: ID!, input: UserUpdate!): User
  }

  input UserRegisterInput {
    fullname: String!
    email: String!
    password: String!
    gender: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input UserUpdate {
    fullname: String
    email: String
    password: String
    gender: String
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }

  type UserDetail {
    id: Int!
    fullname: String
    gender: String
    email: String
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    recipes: String #[Recipe!]
    favoriteRecipe: String #[FavoriteRecipe!]
  }
`;
