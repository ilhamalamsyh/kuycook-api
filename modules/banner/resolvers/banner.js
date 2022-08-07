// eslint-disable-next-line import/no-extraneous-dependencies
const { UserInputError, ApolloError } = require('apollo-server-errors');
const { Op } = require('sequelize');
const models = require('../../../database/models');
const {
  bannerFormValidate,
} = require('../../../middleware/fields/bannerInputFieldsValidation');
const {
  maxPageSizeValidation,
  setPage,
} = require('../../../middleware/pagination/pageSizeValidation');

module.exports = {
  Query: {
    bannerList: async (_, { page = 0, pageSize = 10 }) => {
      maxPageSizeValidation(pageSize);
      const offset = setPage(page, pageSize);
      try {
        const banners = await models.Banner.findAll({
          where: {
            deletedAt: {
              [Op.is]: null,
            },
          },
          order: [['created_at', 'DESC']],
          limit: pageSize,
          offset,
        });
        return banners;
      } catch (err) {
        throw new ApolloError(err);
      }
    },

    bannerDetail: async (_, { id }) => {
      try {
        const banner = await models.Banner.findByPk(id);

        if (banner === null || banner.deletedAt !== null) {
          throw new UserInputError('Banner not found');
        }
        return banner;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
  },

  Mutation: {
    bannerCreate: async (_, { input }) => {
      const { title, image } = input;
      const { error } = bannerFormValidate(input);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

      try {
        const banner = await models.Banner.create({ title, image });

        const bannerId = banner.id;

        return await models.Banner.findByPk(bannerId);
      } catch (err) {
        throw new ApolloError('Failed Create Banner', err);
      }
    },

    bannerUpdate: async (_, { id, input }) => {
      const { title, image } = input;
      const { error } = bannerFormValidate(input);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

      const banner = await models.Banner.findByPk(id);

      if (banner === null || banner.deletedAt !== null) {
        throw new UserInputError('Banner not found');
      }

      try {
        await banner.update({ title, image }, { where: { id } });
        return banner;
      } catch (err) {
        throw new ApolloError('Failed Update Article: ', err);
      }
    },

    bannerDelete: async (_, { id }) => {
      const banner = await models.Banner.findByPk(id);

      if (banner === null || banner.deletedAt !== null) {
        throw new UserInputError('Banner not found');
      }

      try {
        await banner.update({ deletedAt: Date.now() }, { where: { id } });
        return banner;
      } catch (err) {
        throw new ApolloError('Failed Delete Banner', err);
      }
    },
  },
};
