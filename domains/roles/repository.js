const db = require("../../models").roles;

module.exports = {
  addUserId: async (id) => {
    const result = await db.findByPk(id);
    return result;
  },
  getById: async (id) => {
    const result = await db.findByPk(id, {
      include: [
        {
          model: db,
          attributes: ["id", "name"],
        }
      ],
    });
    return result;
  },
  create: async (payload) => {
    const result = await db.create(payload);
    return result;
  },
  get: async () => {
    const result = await db.findAll({
      include: [
        {
          model: db,
          attributes: ["id", "name"],
        },
      ],
    });

    return result;
  },
  delete: async (id) => {
    const result = await db.destroy({ where: { id } });
    if (result) return true;
    return false;
  },
  edit: async (id, payload) => {
    const result = await db.update(payload, { where: { id } });
    if (result) return result;
    return null;
  },
};
