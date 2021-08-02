const { Banner } = require("../../../database/models");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    bannerList: async (root, args, context) => {
      try {
        const banners = await Banner.findAll({
          where: {
            deletedAt: {
              [Op.is]: null,
            },
          },
        });
        return banners;
      } catch (err) {
        throw new Error(err);
      }
    },

    bannerDetail: async (_, { id }, context) => {
      try {
        const banner = await Banner.findByPk(id);

        if (banner === null || banner.deletedAt !== null) {
          throw new Error("Banner not found");
        }
        return banner;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    bannerCreate: async (root, args, context) => {
      const { title, image } = args.input;

      try {
        const banner = await Banner.create({ title, image });

        const bannerId = banner.id;

        return await Banner.findByPk(bannerId);
      } catch (err) {
        throw new Error("Failed Create Banner", err);
      }
    },

    bannerUpdate: async (root, { id, input }, context) => {
      const { title, image } = input;
      const banner = await Banner.findByPk(id);

      if (banner === null || banner.deletedAt !== null) {
        throw new Error("Banner not found");
      }

      try {
        await banner.update({ title, image }, { where: { id: id } });
        return banner;
      } catch (err) {
        throw new Error("Failed Update Article: ", err);
      }
    },

    bannerDelete: async (root, { id }, context) => {
      const banner = await Banner.findByPk(id);

      if (banner === null || banner.deletedAt !== null) {
        throw new Error("Banner not found");
      }

      try {
        await banner.update({ deletedAt: Date.now() }, { where: { id: id } });
        return banner;
      } catch (err) {
        throw new Error("Failed Delete Banner", err);
      }
    },
  },
};
