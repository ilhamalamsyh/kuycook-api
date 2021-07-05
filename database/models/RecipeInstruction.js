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
        type: DataTypes.INTEGER.UNSIGNED
      },
      instruction: {
        type: DataTypes.STRING,
        allowNull:false
      },
      recipeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull:false,
        references: {
          model: {
            tableName: 'recipes'
          },
          key: 'id'
        }
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
      tableName: 'recipe_instructions'
    }
  );
  RecipeInstruction.association = function(models) {
    RecipeInstruction.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe'
    });
  }
  return RecipeInstruction;
}