/* eslint-disable lines-around-directive */
// eslint-disable-next-line strict
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'birth_date', {
            type: Sequelize.DATE,
            allowNull: false
        })
    },

    down: async (queryInterface) => {
        await Promise.all([
            queryInterface.removeColumn('users', 'birth_date')
        ]);
    }
};
