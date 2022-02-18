"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.users, {foreignKey: "id"});
      this.hasOne(models.roles, {foreignKey: "id"});
    }
  }
  UserRole.init(
    {
      adminId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        foreignKey: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: "roles",
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
      modelName: "users_roles",
    }
  );
  return UserRole;
};
