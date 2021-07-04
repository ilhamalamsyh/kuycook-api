'use strict';

const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");

module.exports=(DataTypes, sequelize) => {
  const RecipeInstruction = sequelize.define(
    'RecipeInstruction',
    {
      id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      instruction: {
        type: Sequelize.STRING,
        allowNull:false
      },
      recipeId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: 'deleted_at'
      },
    },
    {
      tableName: 'recipe_instructions'
    }
  )
  return RecipeInstruction;
}