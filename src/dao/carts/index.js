const { MongoDAO: CartDAO } = require('./mongo');

const createDAO = async () => {
    const dao = new CartDAO();
    await dao.init();
    return dao;
};

module.exports = { createDAO };
