"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "participants_points", //Nama Tabel Tujuan yang mau di tambahkan
      {
        participantId: {
          type: Sequelize.INTEGER,
          references: {
            model: "participants",
            key: "id",
          },
          allowNull: false,
          foreignKey: true,
        },
        eventId: {
          type: Sequelize.INTEGER,
          references: {
            model: "events",
            key: "id",
          },
          allowNull: false,
          foreignKey: true,
        },
        weight: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        point: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: "users",
            key: "id",
          },
          allowNull: false,
          foreignKey: true,
        },
        createdAt: {
          type: Sequelize.DATE,
        },
        updatedAt: {
          type: Sequelize.DATE,
        },
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    // remove Order belongsTo Customer
    return queryInterface.removeTable(
      "participants_points" // name of Source model
    );
  },
};
