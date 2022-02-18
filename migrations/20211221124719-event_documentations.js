"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("event_documentations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      documentation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        updatedAt: Sequelize.NOW
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("event_documentations");
  },
};
