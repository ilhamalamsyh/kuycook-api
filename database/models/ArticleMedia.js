'use strict';

const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const ArticleMedia = sequelize.define(
    'ArticleMedia',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'articles'
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
      tableName: 'article_medias'
    }
  );
  ArticleMedia.association = function (models) {
    ArticleMedia.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article'
    });
  }
  return ArticleMedia;
}