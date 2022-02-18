const db = require("../../models");

module.exports = {
  getById: async (id) => {
    const result = await db.events.findByPk(id, {
      include: [
        {
          model: db.participants,
          attributes: ["id", "email"],
        },
        // {
        //   model: db.users,
        //   foreignKey: "userId",
        //   attributes: ["id", "email"],
        // },
      ],
    });
    return result;
  },
  getDocumentation: async (id) => {
    tmp = "SELECT * FROM event_documentations WHERE eventId = " + id;
    const result = await db.sequelize.query(tmp);
    return result;
  },
  getLeaderboard: async () => {
    tmp =
      "SELECT p.id as id,p.email as email,SUM(pp.point) AS point FROM participants p INNER JOIN participants_points pp ON pp.participantId = p.id GROUP BY participantId ORDER BY Point desc";
    const result = await db.sequelize.query(tmp);
    return result;
  },
  getEventLeaderboard: async (id) => {
    tmp = `SELECT p.id as id,p.email as email,SUM(pp.point) AS point FROM participants p INNER JOIN (SELECT * FROM participants_points WHERE eventId=${id}) pp ON pp.participantId = p.id GROUP BY participantId ORDER BY Point desc`;
    const result = await db.sequelize.query(tmp);
    return result;
  },
  createDocumentation: async (payload, id) => {
    const newPayload = {
      ...payload,
      eventId: id,
    };
    console.log(newPayload);
    const result = await db.event_documentations.create(newPayload);
    return result;
  },
  create: async (payload) => {
    const result = await db.events.create(payload);
    return result;
  },
  get: async () => {
    const result = await db.events.findAll();

    return result;
  },
  delete: async (id) => {
    const result = await db.events.destroy({ where: { id } });
    if (result) return true;
    return false;
  },
  edit: async (id, payload) => {
    const result = await db.events.update(payload, { where: { id } });
    if (result) return result;
    return null;
  },
};
