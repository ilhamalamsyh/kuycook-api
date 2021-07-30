const userResolver = require('../../modules/user/resolvers/user');
const recipeResolver = require('../../modules/recipe/resolvers/recipe');

module.exports = [userResolver, recipeResolver];