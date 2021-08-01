const {
  Article,
  ArticleMedia,
  sequelize,
} = require("../../../database/models");
const { Op } = require("sequelize");
const recipe = require("../../recipe/resolvers/recipe");

let t;

module.exports = {
  Query: {
    articleList: async (root, args, context) => {
      try {
        const articles = await Article.findAll({
          where: { deletedAt: { [Op.is]: null } },
          include: [{ model: ArticleMedia, as: "image", required: true }],
        });
        return articles;
      } catch (err) {
        throw new Error(err);
      }
    },

    articleDetail: async (_, { id }, context) => {
      try {
        const article = await Article.findByPk(id, {
          include: [{ model: ArticleMedia, as: "image", required: true }],
        });

        if (article === null || article.deletedAt !== null) {
          throw new Error("Article found");
        }

        return article;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    articleCreate: async (root, args, context) => {
      t = await sequelize.transaction();
      const { title, description, image } = args.input;
      let article;

      try {
        article = await Article.create(
          { title, description },
          { transaction: t }
        );
        const articleId = article.id;

        await ArticleMedia.create(
          {
            url: image,
            articleId,
          },
          { transaction: t }
        );

        await t.commit();
        return await Article.findByPk(articleId, {
          include: [{ model: ArticleMedia, as: "image", required: true }],
        });
      } catch (err) {
        if (t) {
          await t.rollback();
        }
        throw new Error("Failed Create Article: ", err);
      }
    },

    articleUpdate: async (_, { id, input }, context) => {
      t = await sequelize.transaction();
      const { title, description, image } = input;

      const article = await Article.findByPk(id, {
        include: [{ model: ArticleMedia, as: "image", required: true }],
      });

      if (article === null || article.deletedAt !== null) {
        throw new Error("Article not found");
      }

      try {
        await article.update(
          { title, description },
          { where: { id: id }, transaction: t }
        );

        await ArticleMedia.update(
          { url: image },
          { where: { id: article.image.id }, transaction: t }
        );

        await t.commit();
        return article;
      } catch (err) {
        if (t) {
          await t.rollback();
        }
        throw new Error("Failed Update Article", err);
      }
    },

    articleDelete: async (root, { id }, context) => {
      const article = await Article.findByPk(id, {
        include: [{ model: ArticleMedia, as: "image", required: true }],
      });

      if (article === null || article.deletedAt !== null) {
        throw new Error("Error: Article Not Found");
      }

      try {
        await article.update(
          { deletedAt: Date.now() },
          { returning: true, plain: true }
        );
        return article;
      } catch (err) {
        throw new Error("Failed Delete Article");
      }
    },
  },
};
