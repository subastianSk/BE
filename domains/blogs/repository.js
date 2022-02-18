const db = require("../../models");

module.exports = {
    get: async () => {
        const result = await db.blogs.findAll();
        return result;
    },
    create: async (payload) => {
        const result = await db.blogs.create(payload);
        return result;
    },

    update: async (payload, id) => {
        await db.blogs.update(payload, {
            where: {
                id: id
            }
        });
        const updateBerita = await db.blogs.findByPk(id);
        return updateBerita;
    },

    delete: async (id) => {
        await db.blogs.destroy({
            where: {
                id
            }
        });
        return true;
    },
    getById: async (id) => {
        const result = await db.blogs.findByPk(id);
        return result;
    },

};