"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("participants_points", "participants_points_ibfk_1");
    return await queryInterface.addConstraint("participants_points", {
      fields: ["participantId"],
      type: "foreign key",
      name: "participants_points_ibfk_1",
      references: {
        table: "participants",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("participants_points", "participants_points_ibfk_1");
    return await queryInterface.addConstraint("participants_points", {
      fields: ["participantId"],
      type: "foreign key",
      name: "participants_points_ibfk_1",
      references: {
        table: "participants",
        field: "id",
      },
    });
  },
};
