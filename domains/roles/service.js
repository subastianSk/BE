const common = require("../../mixins/common");
const repository = require("./repository");


module.exports = {
  name: "roles",
  mixins: [common],
  actions: {
    add: {
      method: "post",
      path: "/",
      authentication: true,
      authorization: ["admin"],
      responseMessage: "success create role",
      handler: async (ctx) => {
        const payload = ctx.payload.body;
        const result = await repository.create(payload);
        return result;
      },
    },
    delete: {
      responseMessage: "success delete role",
      method: "delete",
      path: "/:id",
      authentication: true,
      authorization: ["admin"],
      handler: async (ctx) => {
        const result = await repository.delete(Number(ctx.payload.params.id));
        if(!result){
          throw new Error("id not exist");
        }
        return result;
      }
    },
    edit: {
      responseMessage: "success edit role",
      method: "put",
      path: "/:id",
      authentication: true,
      authorization: ["admin"],
      responseMessage: "success create role",
      handler: async (ctx) => {
        const payload = ctx.payload.body;
        const result = await repository.edit(Number(ctx.payload.params.id),payload);
        if(result == null){
          throw new Error("id not exist");
        }
        return result;
      }
    },
    getById: {
      responseMessage: "success get data role by id",
      method: "get",
      path: "/:id",
      handler: async (ctx) => {
        const role = await repository.getById(Number(ctx.payload.params.id));
        if (!role) {
          throw new Error("id not exist");
        }

        console.log(role);
        const {id, name} = role

        const result = {
          id: id,
          name: name
        };

        return result;
      },
    },
    get: {
      responseMessage: "success get data roles",
      method: "get",
      path: "/",
      handler: async (ctx) => {
        const payload = ctx.payload.body;
        const roles = await repository.get(payload);

        const result = roles.map((o) => ({
          id: o.id,
          name: o.name
        }));

        return result;
      },
    },
  },
};
