'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'users_roles', //Nama Tabel Tujuan yang mau di tambahkan
      {
        roleId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'roles',
            key: 'id'
          },
          allowNull: false,
          foreignKey: true
        },
        adminId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          allowNull: false,
          foreignKey: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      })
  },

  down: (queryInterface, Sequelize) => {
    // remove Order belongsTo Customer
    return queryInterface.removeTable(
      'users_roles', // name of Source model
    )
  }
};