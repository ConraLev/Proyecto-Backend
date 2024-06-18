const mongoose = require('mongoose');
const { validateProduct } = require('../test/product.validator');
const { createError } = require('../services/errors/errorHandler');
const { CustomError } = require('../services/errors/customError');
const { ErrorCodes } = require('../services/errors/errorCodes');
const logger = require('../utils/logger'); 

class ProductController {
    constructor(ProductService) {
        this.service = ProductService;
    }

    async getAll(req, res, next) {
        try {
            const isLoggedIn = ![null, undefined].includes(req.session.user);
            const user = req.session.user;

            const cartId = req.session.cartId;

            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const sort = req.query.sort === 'desc' ? -1 : 1;
            const query = req.query.query || '';
            const category = req.query.category || '';
            const availability = req.query.availability || '';

            const match = {};
            if (query) {
                match.$or = [
                    { category: { $regex: query, $options: 'i' } },
                    { availability: { $regex: query, $options: 'i' } }
                ];
            }
            if (category) {
                match.category = { $regex: category, $options: 'i' };
            }
            if (availability) {
                match.availability = { $regex: availability, $options: 'i' };
            }

            const totalProducts = await this.service.countDocuments(match);
            const totalPages = Math.ceil(totalProducts / limit);

            const skip = (page - 1) * limit;

            const products = await this.service.find(match, { sort, skip, limit });

            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;

            const prevPage = hasPrevPage ? page - 1 : null;
            const nextPage = hasNextPage ? page + 1 : null;

            const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&availability=${availability}` : null;
            const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&availability=${availability}` : null;

            res.render('home', {
                title: 'Lista Productos',
                products,
                user: user,
                cartId: user.cartId,
                styles: ['style'],
                useWS: false,
                scripts: ['index'],
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
                isLoggedIn,
                isNotLoggedIn: !isLoggedIn
            });
        } catch (error) {
            logger.error(`Error en getAll: ${error.message}`);
            next(error);
        }
    }

    async getById(req, res, next) {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            logger.warn(`ID de producto inválido recibido: ${productId}`);
            return next(new CustomError(ErrorCodes.INVALID_TYPES_ERROR, 'ID de producto inválido'));
        }

        try {
            const product = await this.service.getById(productId);
            if (!product) {
                logger.warn(`Producto no encontrado para ID: ${productId}`);
                return next(new CustomError(ErrorCodes.PRODUCT_NOT_FOUND, 'Producto no encontrado'));
            }
            res.json(product);
        } catch (error) {
            logger.error(`Error en getById: ${error.message}`);
            next(error);
        }
    }

    async deleteById(req, res, next) {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            logger.warn(`ID de producto inválido recibido: ${productId}`);
            return next(new CustomError(ErrorCodes.INVALID_TYPES_ERROR, 'ID de producto inválido'));
        }

        try {
            await this.service.deleteById(productId);
            res.json({ message: `Producto con ID ${productId} eliminado correctamente` });
        } catch (error) {
            logger.error(`Error en deleteById: ${error.message}`);
            next(error);
        }
    }

    async createOne(req, res, next) {
        const { title, description, price, thumbnail, code, stock, category } = req.body;

        try {
            const validationErrors = validateProduct({ title, description, price, thumbnail, code, stock, category });

            if (validationErrors.length > 0) {
                logger.warn(`Validación fallida al crear producto: ${validationErrors}`);
                throw createError('MISSING_REQUIRED_FIELDS', validationErrors);
            }

            const producto = await this.service.createOne({ title, description, price, thumbnail, code, stock, category });
            res.json(producto);
        } catch (error) {
            logger.error(`Error en createOne: ${error.message}`);
            next(error);
        }
    }

    async updateOne(req, res, next) {
        const productId = req.params.id;
        const updatedFields = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            logger.warn(`ID de producto inválido recibido: ${productId}`);
            return next(new CustomError(ErrorCodes.INVALID_TYPES_ERROR, 'ID de producto inválido'));
        }

        try {
            const updatedProduct = await this.service.updateById(productId, updatedFields);

            if (!updatedProduct) {
                logger.warn(`Producto no encontrado para ID: ${productId}`);
                return next(new CustomError(ErrorCodes.PRODUCT_NOT_FOUND, 'Producto no encontrado'));
            }

            res.json(updatedProduct);
        } catch (error) {
            logger.error(`Error en updateOne: ${error.message}`);
            next(error);
        }
    }
}

module.exports = { ProductController };
