/* eslint-disable lines-around-directive */
// eslint-disable-next-line strict
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('users', 'birth_date', {
          type: Sequelize.DATEONLY,
          allowNull: false,
        })
    },

    down: async (queryInterface, Sequelize) => {
        await Promise.all([
            queryInterface.changeColumn('users', 'birth_date', {
                type: Sequelize.DATE,
                allowNull: false,
            })
        ]);
    }
};
