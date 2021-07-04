'use strict';

const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");
const recipeinstructions = require("./recipeinstructions");

module.exports = (DataTypes, sequelize) => {
  const RecipeIngredient = sequelize.define(
    'RecipeIngredient',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      ingredient: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recipeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        
      },
    },
    {
      tableName: 'recipe_ingredients'
    }
  )
  return RecipeIngredient;
}