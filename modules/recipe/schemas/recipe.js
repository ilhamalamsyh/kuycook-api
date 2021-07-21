const { gql } = require('apollo-server-express');

module.exports = gql`
    type Recipe {
        id: ID!
        title: String
        description: String
        isFavorite: Boolean
        instructions: [RecipeInstruction]!
        ingredients: [RecipeIngredient]!
        image: RecipeMedia!
        createdAt: Date
        updatedAt: Date
        deletedAt: Date
    }

    extend type Mutation {
        recipeCreate(input: RecipeInput!): Recipe
        recipeUpdate(id: ID!, input: RecipeInput!): Recipe
        recipeDelete(id: ID!): Recipe
    }

    extend type Query {
        recipeList: [Recipe]
        recipeDetail(id: ID!): Recipe
    }

    type RecipeInstruction {
        id: ID!
        instruction: String
        createdAt: Date
        updatedAt: Date
        deletedAt: Date
        recipeId: Int!
    }

    type RecipeIngredient {
        id: ID!
        ingredient: String
        createdAt: Date
        updatedAt: Date
        deletedAt: Date
        recipeId: Int!
    }

    type RecipeMedia {
        id: ID!
        url: String
        recipeId: Int!
    }

    type FavoriteRecipe {
        id: ID!
        userId: Int!
        recipeId: Int!
    }

    input RecipeInput {
        title: String!
        description: String!
        ingredient: [RecipeIngredientInput!]!
        instruction: [RecipeInstructionInput!]!
        image: RecipeMediaInput
    }

    input RecipeInstructionInput {
        instruction: String!
    }

    input RecipeIngredientInput {
        ingredient: String!
    }

    input RecipeMediaInput {
        url: String!
    }
` 