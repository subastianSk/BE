const beforeOrAfterErrorHandler = async (
  ctx,
  err,
  res,
  { action, service, mixins }
) => {
  let errorResponse = err;
  let thereIsOnErrorHandler = 0;

  if (action.onError && typeof action.onError === "function") {
    errorResponse = await action.onError(ctx, errorResponse);
    thereIsOnErrorHandler++;
  }
  if (service.onError && typeof service.onError === "function") {
    errorResponse = await service.onError(ctx, errorResponse);
    thereIsOnErrorHandler++;
  }
  for (const mixin of mixins) {
    if (mixin.onError && typeof mixin.onError === "function") {
      errorResponse = await mixin.onError(ctx, errorResponse);
      thereIsOnErrorHandler++;
    }
  }
  if (thereIsOnErrorHandler > 0) {
    res.status(errorResponse.status || 500).send(errorResponse);
    return;
  }
  res.status(ctx.status || 500).send({ error: err.message });
  return;
};

const middlewareDefault = (req, res, next) => next();

const middlewareBeforeAfter =
  (services, serviceType, middlewareType) => async (req, res, next) => {
    const { ctx, response } = res.locals;
    try {
      const obj = services[serviceType];
      if (Array.isArray(obj)) {
        for (const o of obj) {
          if (o[middlewareType]) {
            if (middlewareType === "after") {
              await o.after(ctx, response);
            } else {
              await o.before(ctx);
            }
            res.locals.ctx = ctx;
            res.locals.response = ctx.response;
          }
        }
      } else if (obj[middlewareType]) {
        if (middlewareType === "after") {
          await obj.after(ctx, response);
        } else {
          await obj.before(ctx);
        }
        res.locals.ctx = ctx;
        res.locals.response = ctx.response;
      }
      next();
    } catch (error) {
      await beforeOrAfterErrorHandler(ctx, error, res, services);
      return;
    }
  };

const middlewareMain = (types) => async (req, res, next) => {
  const { ctx } = res.locals;
  try {
    const response = await types.action.handler(ctx);
    ctx.response = response;
    res.locals.ctx = ctx;
    res.locals.response = response;
    next();
  } catch (error) {
    await beforeOrAfterErrorHandler(ctx, error, res, types);
    return;
  }
};

const middlewareAuth = (ctx) => {
  // get jwt from req.headers.authentication
  // check jwt
  next();
};

const buildService = ({ schema: service }) => {
  const router = require("express").Router();
  const handlerNames = Object.keys(service.actions);
  handlerNames.forEach((actionName) => {
    const action = { name: actionName, ...service.actions[actionName] };

    // mixin builder
    const mixinBefores =
      service.mixins && Array.isArray(service.mixins)
        ? service.mixins.map((_) =>
            middlewareBeforeAfter(
              { action, service, mixins: service.mixins || [] },
              "mixins",
              "before"
            )
          )
        : [middlewareDefault];
    const mixinAfters =
      service.mixins && Array.isArray(service.mixins)
        ? service.mixins.map((_) =>
            middlewareBeforeAfter(
              { action, service, mixins: service.mixins || [] },
              "mixins",
              "after"
            )
          )
        : [middlewareDefault];

    // actions registration
    router[action.method](
      action.path,

      // START
      (req, res, next) => {
        const ctx = {
          user: {},
          service,
          action,
          payload: {
            query: req.query,
            params: req.params,
            body: req.body,
          },
          headers: req.headers
        };
        res.locals.ctx = ctx;
        next();
      },

      // CREATED
      // created && typeof service.before === 'function'
      //     ? async (req, res, next) => {

      //     } : middlewareDefault,

      // AUTH [SOON]
      // action.secure === false ? defaultAction : authAction,

      // BEFORES
      ...mixinBefores,
      service.before && typeof service.before === "function"
        ? middlewareBeforeAfter(
            { action, service, mixins: service.mixins || [] },
            "service",
            "before"
          )
        : middlewareDefault,
      action.before && typeof action.before === "function"
        ? middlewareBeforeAfter(
            { action, service, mixins: service.mixins || [] },
            "action",
            "before"
          )
        : middlewareDefault,

      // == MAIN ==
      middlewareMain({ action, service, mixins: service.mixins || [] }),

      // AFTERS
      action.after && typeof action.after === "function"
        ? middlewareBeforeAfter(
            { action, service, mixins: service.mixins || [] },
            "action",
            "after"
          )
        : middlewareDefault,
      service.after && typeof service.after === "function"
        ? middlewareBeforeAfter(
            { action, service, mixins: service.mixins || [] },
            "service",
            "after"
          )
        : middlewareDefault,
      ...mixinAfters,

      // DONE
      (req, res) => {
        const { response } = res.locals;
        res.status(200).send(response);
      }
    );
  });
  return router;
};

module.exports = {
  middlewareDefault,
  middlewareBeforeAfter,
  middlewareMain,
  middlewareAuth,
  buildService
};
