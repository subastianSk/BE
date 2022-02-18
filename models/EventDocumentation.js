"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventDocumentation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.events, { foreignKey: "id" });
    }
  }
  EventDocumentation.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      documentation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        updatedAt: DataTypes.NOW
      },
    },
    {
      sequelize,
      modelName: "event_documentations",
    }
  );
  return EventDocumentation;
};
