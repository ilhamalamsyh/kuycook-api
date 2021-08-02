"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("banners", "image", {
      type: Sequelize.STRING,
      allowNull: false,
      after: "title",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("banners", "image");
  },
};
