const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const userRepository = require("../domains/users/repository");

module.exports = {
  name: "common",
  before: async (ctx) => {
    // verify auth
    if (ctx.action.authentication === true) {
      let token = null;
      try {
        token = ctx.headers.authorization.split(" ")[1];
      } catch (error) {
        throw new Error("token not found");
      }
      if (!token) {
        throw new Error("token not found");
      }
      try {
        const decodedJwt = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        ctx.user = await userRepository.getById(decodedJwt.sub);
      } catch (error) {
        throw new Error("token invalid");
      }
    }

    // authorization roles
     if (ctx.action.authentication === true && Object.keys(ctx.user).length && Array.isArray(ctx.action.authorization) && ctx.action.authorization.length > 0) { 
      const userRoles = ctx.user.roles.map((o) => o.name);
      const isRoleExist = ['superadmin', ...ctx.action.authorization].filter((value) => userRoles.includes(value)); 
      if (!isRoleExist.length) {
        throw new Error("user is not suppose to do this action because the role have no authorization for that");
      }
    }

    // validator
    if (ctx.action.validator && typeof ctx.action.validator === "object") {
      const validate = new Validator().compile(ctx.action.validator);
      const isValid = validate(ctx.payload);
      if (isValid !== true) {
        ctx.status = 400;
        throw new Error(JSON.stringify(isValid));
      }
    }
  },
  after: (ctx, response) => {
    ctx.response = {
      message: ctx.action.responseMessage,
      result: response,
    };
  },
  onError: (ctx, err) => {
    console.error(err);
    let message = err.message;
    try {
      message = JSON.parse(err.message);
    } catch (error) {
      // do nothing
    }
    return {
      message: `failed to ${ctx.action.name} ${ctx.service.name}`,
      status: ctx.status,
      actionName: `${ctx.service.name}.${ctx.action.name}`,
      result: message,
    };
  },
};
