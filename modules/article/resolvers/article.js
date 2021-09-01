// eslint-disable-next-line import/no-extraneous-dependencies
const { UserInputError } = require('apollo-server-errors');
const { Op } = require('sequelize');
const { sequelize } = require('../../../database/models');
const models = require('../../../database/models');
const {
  articleFormValidate,
} = require('../../../middleware/fields/articleInputFieldsValidation');
const {
  maxPageSizeValidation,
  setPage,
} = require('../../../middleware/pagination/pageSizeValidation');

let t;

module.exports = {
  Query: {
    articleList: async (_, { page = 0, pageSize = 10 }) => {
      maxPageSizeValidation(pageSize);
      const offset = setPage(page, pageSize);
      try {
        const articles = await models.Article.findAll({
          where: { deletedAt: { [Op.is]: null } },
          order: [['created_at', 'DESC']],
          limit: pageSize,
          offset,
          include: [
            { model: models.ArticleMedia, as: 'image', required: true },
          ],
        });
        return articles;
      } catch (err) {
        throw new Error(err);
      }
    },

    articleDetail: async (_, { id }) => {
      try {
        const article = await models.Article.findByPk(id, {
          include: [
            { model: models.ArticleMedia, as: 'image', required: true },
          ],
        });

        if (article === null || article.deletedAt !== null) {
          throw new Error('Article found');
        }

        return article;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    articleCreate: async (_, { input }) => {
      const { title, description, image } = input;
      const { error } = articleFormValidate(input);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }
      let article;

      try {
        t = await sequelize.transaction();
        article = await models.Article.create(
          { title, description },
          { transaction: t }
        );
        const articleId = article.id;

        await models.ArticleMedia.create(
          {
            url: image,
            articleId,
          },
          { transaction: t }
        );

        await t.commit();
        return await models.Article.findByPk(articleId, {
          include: [
            { model: models.ArticleMedia, as: 'image', required: true },
          ],
        });
      } catch (err) {
        if (t) {
          await t.rollback();
        }
        throw new Error('Failed Create Article: ', err);
      }
    },

    articleUpdate: async (_, { id, input }) => {
      const { title, description, image } = input;
      const { error } = articleFormValidate(input);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

      const article = await models.Article.findByPk(id, {
        include: [{ model: models.ArticleMedia, as: 'image', required: true }],
      });

      if (article === null || article.deletedAt !== null) {
        throw new Error('Article not found');
      }

      try {
        t = await sequelize.transaction();

        await article.update(
          { title, description },
          { where: { id }, transaction: t }
        );

        await models.ArticleMedia.update(
          { url: image },
          { where: { id: article.image.id }, transaction: t }
        );

        await t.commit();

        return await models.Article.findByPk(id, {
          include: [
            { model: models.ArticleMedia, as: 'image', required: true },
          ],
        });
      } catch (err) {
        if (t) {
          await t.rollback();
        }
        throw new Error('Failed Update Article', err);
      }
    },

    articleDelete: async (_, { id }) => {
      const article = await models.Article.findByPk(id, {
        include: [{ model: models.ArticleMedia, as: 'image', required: true }],
      });

      if (article === null || article.deletedAt !== null) {
        throw new Error('Error: Article Not Found');
      }

      try {
        await article.update(
          { deletedAt: Date.now() },
          { returning: true, plain: true }
        );
        return article;
      } catch (err) {
        throw new Error('Failed Delete Article');
      }
    },
  },
};
