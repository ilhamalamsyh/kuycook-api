'use strict';

const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");

// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Recipes extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   Recipes.init({
//     title: DataTypes.STRING,
//     description: DataTypes.TEXT,
//     isFavorite: DataTypes.BOOLEAN,
//     deletedAt: DataTypes.DATE,
//     userId: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'Recipes',
//   });
//   return Recipes;
// };

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
        type: Sequelize.TEXT,
        allowNull:false
      },
      isFavorite: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
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
        field: 'created_at'
      },
      deletedAt: {
        type: Sequelize.DATE,
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