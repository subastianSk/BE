const db = require("../../models");
const sequelize = require("sequelize");

module.exports = {
  create: async (payload) => {
    const result = await db.participants.create(payload);
    return result;
  },

  getById: async (id) => {
    const result = await db.participants.findByPk(id);
    return result;
  },

  createPoints: async (payload) => {
    const result = await db.participants_points.create(payload);
    return result;
  },

  getParticipantTotalPoints: async (participantId) => {
    const participant = await db.participants.findByPk(participantId);
    const totalPoint = await db.participants_points.sum("point", {
      where: { participantId: participantId },
    });
    const result = {
      participant: {
        id: participant.id,
        email: participant.email,
      },
      point: totalPoint,
    };
    return result;
  },

  getParticipantTotalPointsInEvent: async (participantId, eventId) => {
    const participant = await db.participants.findByPk(participantId);
    const event = await db.events.findByPk(eventId);
    const eventPoint = await db.participants_points.sum("point", {
      where: { participantId: participantId, eventId: eventId },
    });
    const result = {
      participant: {
        id: participant.id,
        email: participant.email,
      },
      event: {
        id: event.id,
        name: event.name,
      },
      point: eventPoint,
    };
    return result;
  },

  delete: async (id) => {
    const result = await db.participants.destroy({ where: { id } });
    return result;
  },

  isParticipantAlreadyInEvent: async (participantId, eventId) => {
    const eventPoint = await db.participants_points.findAll({
      where: { participantId: participantId, eventId: eventId },
    });
    console.log(eventPoint);
    if (eventPoint.length) {
      return true;
    }
    return false;
  },

  get: async () => {
    const [result,metadata] = await db.sequelize.query("SELECT * FROM participants;");
    return result;
  },
};
