'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    'Recipe',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement:true,
        allowNull:false
      },
      title: {
        type: DataTypes.STRING,
        allowNull:false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull:false
      },
      isFavorite: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: false
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at'
      },
    },
    {
      tableName: 'recipes'
    }
  );
  Recipe.associate = function (models) {
    Recipe.belongsTo(models.User, {foreignKey: 'userId', as:'author'}),
    Recipe.hasMany(models.RecipeIngredient, {foreignKey: 'recipeId', as:'recipe_ingredient'}),
    Recipe.hasMany(models.RecipeInstruction, {foreignKey: 'recipeId', as:'recipe_instruction'}),
    Recipe.hasOne(models.FavoriteRecipe, {foreignKey: 'recipeId', as: 'favorite_recipe'})
    Recipe.hasOne(models.RecipeMedia, {foreignKey: 'recipeId', as: 'recipe_media'})
  }
  return Recipe;
}