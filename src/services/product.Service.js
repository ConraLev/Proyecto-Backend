const { CustomError } = require('../services/errors/customError');
const { ErrorCodes } = require('../services/errors/errorCodes');

class ProductService {
    constructor(storage) {
        this.storage = storage;
    }

    async getAll() {
        return this.storage.getAll();
    }

    async getById(id) {
        try {
            const objectId = this.toObjectId(id);
            if (!objectId) {
                throw new CustomError(ErrorCodes.INVALID_TYPES_ERROR, 'ID inválido');
            }
            const product = await this.storage.getById(objectId);
            if (!product) {
                throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND, 'Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    async deleteById(productId) {
        if (!isNaN(productId)) {
            return await this.storage.deleteById(parseInt(productId));
        } else {
            throw new CustomError(ErrorCodes.INVALID_TYPES_ERROR, 'ID de producto inválido');
        }
    }
    
    async createOne({ title, description, price, thumbnail, code, stock, category }) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                throw new CustomError(ErrorCodes.MISSING_REQUIRED_FIELDS, 'Faltan campos requeridos');
            }
            return await this.storage.createOne({ title, description, price, thumbnail, code, stock, category });
        } catch (error) {
            throw error;
        }
    }

    async updateById(productId, updatedFields) {
        try {
            const objectId = this.toObjectId(productId);
            if (!objectId || !updatedFields) {
                throw new CustomError(ErrorCodes.INVALID_TYPES_ERROR, 'ID o campos de actualización inválidos');
            }
            const updatedProduct = await this.storage.updateById(objectId, updatedFields);
            if (!updatedProduct) {
                throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND, 'Producto no encontrado para actualizar');
            }
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }

    async countDocuments(match) {
        return this.storage.countDocuments(match);
    }

    async find(match, { sort, skip, limit }) {
        try {
            const products = await this.storage.find(match);
            if (sort) {
                products.sort((a, b) => {
                    if (a.price < b.price) return -sort;
                    if (a.price > b.price) return sort;
                    return 0;
                });
            }
            return products.slice(skip, skip + limit);
        } catch (error) {
            throw error;
        }
    }

    toObjectId(id) {
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(id)) {
            return mongoose.Types.ObjectId(id);
        }
        return null;
    }
}

module.exports = { ProductService };

