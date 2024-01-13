const { gql } = require('apollo-server-express');
const userType = require('../../modules/user/schemas/user');
const recipeType = require('../../modules/recipe/schemas/recipe');
const articleType = require('../../modules/article/schemas/article');
const bannerType = require('../../modules/banner/schemas/banner');
const uploadFileType  = require('../../modules/upload-file/schemas/upload')

const rootType = gql`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`;

module.exports = [rootType, userType, recipeType, articleType, bannerType, uploadFileType];
