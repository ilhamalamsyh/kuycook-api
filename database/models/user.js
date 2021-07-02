'use strict';

const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");
const bcrypt = require('bcryptjs');

// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   User.init({
//     fullname: DataTypes.STRING,
//     gender: DataTypes.STRING,
//     password: DataTypes.STRING,
//     email: DataTypes.STRING,
//     deletedAt: DataTypes.DATE
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id:{
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement:true,
        allowNull:false
      },
      fullname:{
        type: DataTypes.STRING,
        allowNull:false
      },
      gender: {
        type: Sequelize.STRING,
        allowNull:false
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false
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
        allowNull:true,
        type: Sequelize.DATE
      }
    },
    {
      tableName: 'Users',
      defaultScope:{
        rawAttributes:{exclude: ['password']},
      }
    }
  );

  // Added beforeCreate hook which automatically hashes the password using bcrypt.js under the hood
  User.beforeCreate(async (user) => {
    user = await user.generatedPasswordHash();
  });

  User.prototype.generatedPasswordHash = function () {
    if (this.password) {
      return bcrypt.hash(this.password, 10);
    }
  };

  // define relationship a user has many recipes
  // User.associate = function (models) {
  //   User.hasMany(models.Recipe, {})
  // }
}