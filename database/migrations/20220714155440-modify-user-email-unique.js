/* eslint-disable lines-around-directive */
// eslint-disable-next-line strict
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('users', 'email', {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        })
    },

    down: async (queryInterface, Sequelize) => {
        await Promise.all([
            queryInterface.changeColumn('users', 'email', {
                type: Sequelize.TEXT,
                allowNull: false,
            })
        ]);
    }
};
