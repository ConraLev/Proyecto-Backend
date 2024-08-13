const { MongoDAO } = require('./mongo');
const ProductModel = require('../models/products.model');

class ViewsDAO extends MongoDAO {
    async findAllProducts() {
        try {
            return await ProductModel.find();
        } catch (error) {
            throw new Error('Error al obtener productos: ' + error.message);
        }
    }
}

const createDAO = async () => {
    const dao = new ViewsDAO();
    await dao.init();
    return dao;
};

module.exports = { createDAO, ViewsDAO };

