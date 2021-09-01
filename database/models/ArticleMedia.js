/* eslint-disable strict */
// eslint-disable-next-line lines-around-directive
// eslint-disable-next-line strict
// eslint-disable-next-line lines-around-directive
'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ArticleMedia = sequelize.define(
    'ArticleMedia',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER.UNSIGNED,
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
      tableName: 'article_medias',
    }
  );
  ArticleMedia.associate = function (models) {
    ArticleMedia.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article',
    });
  };
  return ArticleMedia;
};
