const repository = require("./repository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const common = require("../../mixins/common");
const roleRepository = require("../roles/repository");

// add auth to edit

module.exports = {
  name: "users",
  mixins: [common],
  actions: {
    add: {
      method: "post",
      path: "/",
      authentication: true,
      authorization: ["superadmin"],
      responseMessage: "success create users",
      handler: async (ctx) => {
        const payload = {
          email: ctx.payload.body.email,
          password: bcrypt.hashSync(ctx.payload.body.password, 8),
          name: ctx.payload.body.name,
        };
        const { roles: roleIds } = ctx.payload.body;
        const roles = [];

        // check if roles exist
        for (const roleId of roleIds) {
          const role = await roleRepository.addUserId(roleId);
          if (!role) {
            throw new Error(`role with id ${roleId} doesn't exist`);
          }
          roles.push(role);
        }

        const result = await repository.create(payload);
        await result.addRole(roles);

        // parse response
        return { id: result.id, email: result.email, roles, name: result.name };
      },
    },
    login: {
      method: "post",
      path: "/login",
      responseMessage: "success user login",
      handler: async (ctx) => {
        const payload = ctx.payload.body;
        const result = await repository.login(payload);

        if (result === null) {
          throw new Error(`user with email ${payload.email} not exist`);
        }

        const jwtPayload = {
          sub: result.id,
          iss: "nawaste",
          iat: new Date().getTime() / 1000,
          exp: new Date().getTime() / 1000 + 3600, // 1 hour
        };

        const token = jwt.sign(jwtPayload, process.env.JWT_TOKEN_SECRET);

        return {
          token,
        };
      },
    },
    edit: {
      responseMessage: "success edit user",
      method: "put",
      path: "/:id",
      authentication: true,
      authorization: ["superadmin"],
      handler: async (ctx) => {
        let payload = ctx.payload.body;
        const user = ctx.user;
        if (payload.password) {
          payload.password = bcrypt.hashSync(ctx.payload.body.password, 8);
        }
        console.log(user);

        if (ctx.payload.params.id != user.dataValues.id) {
          throw new Error("Cant edit other people permission");
        }
        const result = await repository.edit(user.dataValues.id, payload);
        if (result == null) {
          throw new Error("id not exist");
        }
        // return result;
      },
    },
    delete: {
      responseMessage: "success delete user",
      method: "delete",
      path: "/:id",
      authentication: true,
      authorization: ["superadmin"],
      handler: async (ctx) => {
        const result = await repository.delete(Number(ctx.payload.params.id));
        if (!result) {
          throw new Error("id not exist");
        }
        return result;
      },
    },
    getAll: {
      responseMessage: "success get user event",
      method: "get",
      path: "/",
      authentication: true,
      authorization: ["superadmin"],
      handler: async (ctx) => {
        const payload = ctx.payload.body;
        const event = await repository.get(payload);

        const result = event.map((o) => ({
          id: o.id,
          email: o.email,
          name: o.name,
        }));

        return result;
      },
    },
    getById: {
      responseMessage: "success get data event",
      method: "get",
      path: "/:id",
      authentication: true,
      authorization: ["superadmin"],
      handler: async (ctx) => {
        const getUser = await repository.getById(Number(ctx.payload.params.id));

        const result = {
          id: getUser.id,
          email: getUser.email,
          name: getUser.name,
        };

        return result;
      },
    },
  },
};
