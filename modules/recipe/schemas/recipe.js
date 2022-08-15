const {gql} = require('apollo-server-express');

module.exports = gql`
  type Recipe {
    id: ID!
    title: String
    description: String
    isFavorite: Boolean
    servings: String
    cookingTime: String
    instructions: [RecipeInstruction]!
    ingredients: [RecipeIngredient]!
    image: RecipeMedia!
    author: User
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }
  
  extend type Mutation {
    recipeCreate(input: RecipeInput!): Recipe!
    recipeUpdate(id: ID!, input: RecipeInput!): Recipe
    recipeDelete(id: ID!): Recipe
    addRemoveFavoriteRecipe(id: ID!): String
  }

  extend type Query {
    recipeList(pageSize: Int, page: Int): [Recipe]
    myRecipeList(pageSize: Int, page: Int): [Recipe]
    recipeDetail(id: ID!): Recipe
    favoriteRecipeList(pageSize: Int, page: Int): [Recipe]
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
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    recipeId: Int!
  }

  type FavoriteRecipe {
    id: ID!
    userId: Int!
    recipeId: Int!
  }

  input RecipeInput {
    title: String!
    description: String
    ingredients: [String]!
    instructions: [String]!
    image: String
    servings: String
    cookingTime: String
  }

  input RecipeIngredientInput {
    id: ID!
    ingredient: String!
    recipeId: ID!
  }

  input RecipeInstructionInput {
    id: ID!
    instruction: String!
    recipeId: ID!
  }

  input RecipeUpdateInput {
    title: String!
    description: String
    ingredients: [RecipeIngredientInput]!
    instructions: [RecipeInstructionInput]!
    image: String
    servings: String
    cookingTime: String
  }
`;
