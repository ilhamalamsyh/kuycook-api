const userResolver = require('../../modules/user/resolvers/user');
const recipeResolver = require('../../modules/recipe/resolvers/recipe');
const articleResolver = require('../../modules/article/resolvers/article');
const bannerResolver = require('../../modules/banner/resolvers/banner');
const uploadFileResolver = require('../../modules/upload-file/resolvers/upload');

module.exports = [
  userResolver,
  recipeResolver,
  articleResolver,
  bannerResolver,
  uploadFileResolver
];
