/* eslint-disable lines-around-directive */
// eslint-disable-next-line strict
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('recipes', 'servings', {
      type: Sequelize.STRING,
      allowNull: true
    }),
    queryInterface.addColumn('recipes', 'cooking_time', {
      type: Sequelize.STRING,
    })
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('recipes', 'servings'),
    queryInterface.removeColumn('recipes', 'cooking_time'),
  ])
};
