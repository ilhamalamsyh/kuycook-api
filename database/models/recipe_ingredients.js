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
        type: DataTypes.INTEGER.UNSIGNED
      },
      ingredient: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'deleted_at'
      },
    },
    {
      tableName: 'recipe_ingredients'
    }
  )
  return RecipeIngredient;
}