const userResolver = require("../../modules/user/resolvers/user");
const recipeResolver = require("../../modules/recipe/resolvers/recipe");
const articleResolver = require("../../modules/article/resolvers/article");

module.exports = [userResolver, recipeResolver, articleResolver];
