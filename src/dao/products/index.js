const { MongoDAO: ProductDAO } = require('./mongo');

const createDAO = async () => {
    const dao = new ProductDAO();
    await dao.init();
    return dao;
};

module.exports = { createDAO };