'use strict';

const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");

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
        allowNull:false
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
        field: 'created_at'
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

  return Recipe;
}