/* eslint-disable lines-around-directive */
// eslint-disable-next-line strict
'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const RecipeInstruction = sequelize.define(
    'RecipeInstruction',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      instruction: {
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
        defaultValue: Sequelize.NOW,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_at',
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
    },
    {
      tableName: 'recipe_instructions',
    }
  );
  RecipeInstruction.association = function (models) {
    RecipeInstruction.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe',
    });
  };
  return RecipeInstruction;
};
