const { MongoDAO: ViewsDAO } = require('./mongo');

const createDAO = async () => {
    const dao = new ViewsDAO();
    await dao.init();
    return dao;
};

module.exports = { createDAO };
