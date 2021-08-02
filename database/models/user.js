"use strict";

const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "updated_at",
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: "deleted_at",
      },
    },
    {
      tableName: "users",
      defaultScope: {
        rawAttributes: { exclude: ["password"] },
      },
    }
  );

  // Added beforeCreate hook which automatically hashes the password using bcrypt.js under the hood
  User.beforeCreate(async user => {
    user = await user.generatedPasswordHash();
  });

  User.prototype.generatedPasswordHash = function () {
    if (this.password) {
      return bcrypt.hash(this.password, 10);
    }
  };

  // define relationship a user has many recipes
  User.associate = function (models) {
    User.hasMany(models.Recipe, {
      foreignKey: "userId",
      as: "recipe",
    });
  };
  return User;
};
