'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('roles', [{
                id: 1,
                name: 'superadmin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                name: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                name: 'moderator',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]);
        return
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return queryInterface.bulkDelete('roles', null, {});
    }
};
