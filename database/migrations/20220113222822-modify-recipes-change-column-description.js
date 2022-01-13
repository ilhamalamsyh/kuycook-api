/* eslint-disable lines-around-directive */
// eslint-disable-next-line strict
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('recipes', 'description', {
            type: Sequelize.TEXT,
            allowNull: true,
        })
    },

    down: async (queryInterface, Sequelize) => {
        await Promise.all([
            queryInterface.changeColumn('recipes', 'birth_date', {
                type: Sequelize.TEXT,
                allowNull: false,
            })
        ]);
    }
};
