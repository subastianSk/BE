const bcrypt = require("bcryptjs");
const db = require("../../models");

module.exports = {
  create: async (payload) => {
    const result = await db.users.create(payload);
    return result;
  },
  getById: async (id) => {
    const result = await db.users.findByPk(id, {
      include: [
        {
          model: db.roles,
          attributes: ["id", "name"],
        },
      ],
    });
    return result;
  },
  login: async (payload) => {
    const result = await db.users.findOne({
      where: {
        email: payload.email,
      },
    });
    if (!result) {
      return null;
    }
    const passwordValid = bcrypt.compareSync(payload.password, result.password);
    return passwordValid ? result : null;
  },
  edit: async (id, payload) => {
    const result = await db.users.update(payload, { where: { id } });
    if (result) return result;
    return null;
  },
  delete: async (id) => {
    const event = await db.events.findAll({
      where: {
        userId: id,
      },
    });
    if (event) return "this user manage an event";
    const deleteRole = await db.users_roles.destroy({
      where: {
        adminId: id,
      },
    });
    const result = await db.users.destroy({ where: { id } });
    if (result) return "deleted";
    return false;
  },
  get: async () => {
    const result = await db.users.findAll();

    return result;
  },
};
