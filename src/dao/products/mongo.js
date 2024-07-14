const mongoose = require('mongoose');
const { dbName, mongoUrl } = require('../../config/dbConfig');
const ProductModel = require('../models/products.model');

class MongoDAO {
    async init() {
        await mongoose.connect(mongoUrl, { dbName });
    }

    async getAll() {
        return ProductModel.find().lean();
    }

    async getById(id) {
        return ProductModel.findOne({ id }).lean();
    }

    async createOne(product) {
        const newProduct = new ProductModel(product);
        return newProduct.save();
    }

    async updateById(id, updatedFields) {
        return ProductModel.findOneAndUpdate({ id }, updatedFields, { new: true }).lean();
    }

    async deleteById(id) {
        return ProductModel.findOneAndDelete({ id }).lean();
    }

    async countDocuments(match) {
        return ProductModel.countDocuments(match);
    }

    async find(match) {
        return ProductModel.find(match).lean();
    }
}

module.exports = { MongoDAO };


