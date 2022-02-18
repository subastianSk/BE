const {
    buildService
} = require("../../libs/nawaste");

module.exports = {
    service: buildService({
        schema: require("./service"),
    }),
};