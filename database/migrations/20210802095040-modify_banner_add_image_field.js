/* eslint-disable strict */
// eslint-disable-next-line lines-around-directive
// eslint-disable-next-line strict
// eslint-disable-next-line lines-around-directive
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('banners', 'image', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'title',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('banners', 'image');
  },
};
