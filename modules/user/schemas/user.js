const {gql} = require('apollo-server-express');

module.exports = gql`
  scalar Date
  scalar DateTime

  type User {
    id: Int!
    fullname: String!
    gender: String!
    email: String!
    birthDate: Date!
    image: String
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
  }

  extend type Mutation {
    register(input: UserRegisterInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    userUpdate(id: ID!, input: UserUpdate!): User
    regeneratePasswordResetLink(email: String!): String!
    passwordReset(input: ResetPasswordInput!): String!
  }

  extend type Query {
    currentUser: User
  }

  input ResetPasswordInput {
    link: String!
    password: String!
  }

  input UserRegisterInput {
    fullname: String!
    email: String!
    password: String!
    gender: String!
    birthDate: Date!
    image: String
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
    image: String
    birthDate: Date!
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
