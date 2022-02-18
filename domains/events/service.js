const common = require("../../mixins/common");
const repository = require("./repository");
const userRepository = require("../users/repository");

function compare(a, b) {
  if (a.point > b.point) return -1;
  return 0;
}

module.exports = {
  name: "events",
  mixins: [common],
  actions: {
    getAllLeaderboard: {
      method: "get",
      path: "/leaderboard",
      responseMessage: "success get leaderboard",
      handler: async (ctx) => {
        console.log("<<<<<<<<<<<<<<><><><>>>>>>>\n,,,,,,,,.,.,.,.,")
        const result = await repository.getLeaderboard();
        console.log(result);
        return result[0];
      },
    },
    getLeaderboardEvent: {
      method: "get",
      path: "/:id/leaderboard",
      responseMessage: "success get leaderboard",
      handler: async (ctx) => {
        const result = await repository.getEventLeaderboard(
          Number(ctx.payload.params.id)
        );
        console.log(result);
        return result[0];
      },
    },
    add: {
      method: "post",
      path: "/",
      authentication: true,
      authorization: ["admin", "superadmin"],
      responseMessage: "success create events",
      handler: async (ctx) => {
        const user = ctx.user;
        // user.dataValues.id
        const payload = ctx.payload.body;
        const newPayload = {
          ...payload,
          userId: user.dataValues.id,
        };
        console.log(newPayload);
        const result = await repository.create(newPayload);
        return result;
      },
    },
    delete: {
      responseMessage: "success delete event",
      method: "delete",
      path: "/:id",
      authentication: true,
      authorization: ["admin", "superadmin"],
      handler: async (ctx) => {
        const result = await repository.delete(Number(ctx.payload.params.id));
        if (!result) {
          throw new Error("id not exist");
        }
        return result;
      },
    },
    edit: {
      responseMessage: "success edit event",
      method: "put",
      path: "/:id",
      authentication: true,
      authorization: ["admin", "superadmin"],
      handler: async (ctx) => {
        const payload = ctx.payload.body;
        const result = await repository.edit(
          Number(ctx.payload.params.id),
          payload
        );
        if (result == null) {
          throw new Error("id not exist");
        }
        // return result;
      },
    },
    getById: {
      responseMessage: "success get data event",
      method: "get",
      path: "/:id",
      handler: async (ctx) => {
        const event = await repository.getById(Number(ctx.payload.params.id));
        if (!event) {
          throw new Error("id not exist");
        }

        console.log(event.userId);

        const participants = event.participants.map((o) => ({
          id: o.id,
          email: o.email,
          point: o.participants_points.point,
        }));

        participants.sort(compare);

        const user = await userRepository.getById(event.userId);

        console.log(user);

        const result = {
          id: event.id,
          name: event.name,
          date: event.date,
          creted_by: {
            email: user.email,
            name: user.name,
          },
          leaderboard: participants,
        };

        return result;
      },
    },
    getAll: {
      responseMessage: "success get data event",
      method: "get",
      path: "/",
      handler: async (ctx) => {
        const payload = ctx.payload.body;
        const event = await repository.get(payload);

        const users = await userRepository.get();
        const result = event.map((o) => ({
          id: o.id,
          name: o.name,
          date: o.date,
          creted_by: {
            email: users[o.userId].email,
            name: users[o.userId].name,
          }
        }));

        return result;
      },
    },
    getDocumentation: {
      responseMessage: "success get documentation",
      method: "get",
      path: "/:id/documentation",
      handler: async (ctx) => {
        const result = await repository.getDocumentation(
          Number(ctx.payload.params.id)
        );
        if (!result) {
          throw new Error("id not exist");
        }

        console.log(result);

        return result[0];
      },
    },
    addDoc: {
      method: "post",
      path: "/:id/documentation",
      authentication: true,
      authorization: ["admin", "superadmin", "moderator"],
      responseMessage: "success add event documentation",
      handler: async (ctx) => {
        const payload = ctx.payload.body;
        const result = await repository.createDocumentation(payload,Number(ctx.payload.params.id));
        return result;
      },
    },
  },
};
