'use strict';

const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");
const Recipe = require("./Recipe");

module.exports = (sequelize, DataTypes) => {
  const FavoriteRecipe = sequelize.define(
    'FavoriteRecipe',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        }
      },
      recipeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'recipes'
          },
          key: 'id'
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at'
      },
    },
    {
      tableName: 'favorite_recipes'
    }
  );
  FavoriteRecipe.association = function (models) {
    FavoriteRecipe.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe'
    });
  }
  return FavoriteRecipe;
}