"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ParticipantPoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.participants, {foreignKey: "id"});
      this.hasOne(models.events, {foreignKey: "id"});
    }
  }
  ParticipantPoint.init(
    {
      participantId: {
        type: DataTypes.INTEGER,
        references: {
          model: "participants",
          key: "id",
        },
        allowNull: false,
        foreignKey: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        references: {
          model: "events",
          key: "id",
        },
        allowNull: false,
        foreignKey: true,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        foreignKey: true,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "participants_points",
    }
  );
  return ParticipantPoint;
};
