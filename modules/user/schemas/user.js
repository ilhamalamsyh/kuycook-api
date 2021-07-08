const { gql } = require('apollo-server-express');

module.exports = gql`

    type User{
        id: Int!
        name: String!
        gender: String!
        email: String!
        password: String!
        createdAt: Date!
        updatedAt: Date!
        deletedAt: Date
        recipes: [Recipe!]
        favoriteRecipe: [FavoriteRecipe!]
    }

    extend type Mutation{
        register(input: UserRegisterInput!):UserRegisterResponse
        login(input: UserLoginInput!):UserLoginResponse

        updateUser(input: UpdateUser!):User
    }

    input UserRegisterInput{
        name: String!
        email: String!
        password: String!
        gender: String!
    }

    type UserRegisterResponse{
        name: String!
        email: String!
        gender: String!
    }

    input UserLoginInput{
        email: String!
        password: String!
    } 

    type UserLoginResponse{
        id: Int!
        name: String!
        email: String!
        gender: String!
    }

    input UpdateUser{
        id:ID!
        name: String
        email: String
        password: String
        gender: String
        createdAt: Date!
        updatedAt: Date!
        deletedAt: Date
    }
`;