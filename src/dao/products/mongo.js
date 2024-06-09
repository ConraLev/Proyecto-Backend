
// const mongoose = require('mongoose');
// const { dbName, mongoUrl } = require('../../config/dbConfig');
// const ProductModel = require('../models/products.model');

// class MongoDAO {

//     async init(){
//         await mongoose.connect(mongoUrl, { dbName });
//     }

//     async getAll(){
//         return ProductModel.find().lean();
//     }

//     async getById(id){
//         return ProductModel.findById(id).lean();
//     }

//     async createOne(product){
//         const newProduct = new ProductModel(product);
//         return newProduct.save();
//     }

//     async updateById(id, updatedFields){
//         return ProductModel.findByIdAndUpdate(id, updatedFields, { new: true }).lean();
//     }

//     async deleteById(id){
//         return ProductModel.findByIdAndDelete(id).lean();
//     }
// }

// module.exports = { MongoDAO };

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
        return ProductModel.findById(mongoose.Types.ObjectId(id)).lean();
    }

    async createOne(product) {
        const newProduct = new ProductModel(product);
        return newProduct.save();
    }

    async updateById(id, updatedFields) {
        return ProductModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), updatedFields, { new: true }).lean();
    }

    async deleteById(id) {
        return ProductModel.findByIdAndDelete(mongoose.Types.ObjectId(id)).lean();
    }

    async countDocuments(match) {
        return ProductModel.countDocuments(match);
    }

    async find(match) {
        return ProductModel.find(match).lean();
    }
}

module.exports = { MongoDAO };


