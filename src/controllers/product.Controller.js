const mongoose = require('mongoose');
const { validateProduct } = require('../test/product.validator');
const { createError } = require('../services/errors/errorHandler');
const { CustomError } = require('../services/errors/customError');
const { ErrorCodes } = require('../services/errors/errorCodes');
const  Product  = require('../dao/models/products.model');
const  User  = require('../dao/models/user.model');
const logger = require('../utils/logger'); 

class ProductController {
    constructor(ProductService) {
        this.service = ProductService;
    }

    async getAll(req, res, next) {
        try {
            const isLoggedIn = !!req.session.user;
            const user = req.session.user || {};
            const cartId = req.session.user ? req.session.user.cartId : null;
    
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
                cartId: cartId,
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

        try {
            let product;
            if (!isNaN(productId)) {
                product = await Product.findOne({ id: parseInt(productId) });
            } else if (mongoose.Types.ObjectId.isValid(productId)) {
                product = await this.service.getById(productId);
            } else {
                logger.warn(`ID de producto inválido recibido GETBYID: ${productId}`);
                return next(new CustomError(ErrorCodes.INVALID_TYPES_ERROR, 'ID de producto inválido'));
            }

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
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const userId = user._id;
        const userRole = user.role;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            logger.warn(`ID de producto inválido recibido DELETEBYID: ${productId}`);
            return next(new CustomError(ErrorCodes.INVALID_TYPES_ERROR, 'ID de producto inválido'));
        }

        try {
            const product = await Product.findById(productId);

            if (!product) {
                logger.warn(`Producto no encontrado para ID: ${productId}`);
                return next(new CustomError(ErrorCodes.PRODUCT_NOT_FOUND, 'Producto no encontrado'));
            }

            if (userRole === 'admin' || (userRole === 'premium' && product.owner === userId)) {
                await this.service.deleteById(productId);
                res.json({ message: `Producto con ID ${productId} eliminado correctamente` });
            } else {
                logger.warn(`Usuario no autorizado para eliminar producto con ID: ${productId}`);
                return next(new CustomError(ErrorCodes.UNAUTHORIZED, 'No tienes permiso para eliminar este producto'));
            }
        } catch (error) {
            logger.error(`Error en deleteById: ${error.message}`);
            next(error);
        }
    }

    async createOne(req, res, next) {
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const { title, description, price, thumbnail, code, stock, category } = req.body;
        const userId = user._id;

        try {
            const user = await User.findById(userId);

            if (!user || user.role !== 'premium') {
                return res.status(403).json({ error: 'Solo los usuarios premium pueden crear productos' });
            }

            const validationErrors = validateProduct({ title, description, price, thumbnail, code, stock, category });

            if (validationErrors.length > 0) {
                logger.warn(`Validación fallida al crear producto: ${validationErrors}`);
                throw createError('MISSING_REQUIRED_FIELDS', validationErrors);
            }

            const newProduct = new Product({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                owner: user.email
            });

            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error) {
            logger.error(`Error en createOne: ${error.message}`);
            next(error);
        }
    }

    async createProduct(req, res, next) {
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const { name, price, description } = req.body;
        const userId = user._id;

        try {
            const user = await User.findById(userId);

            if (!user || user.role !== 'premium') {
                return res.status(403).json({ error: 'Solo los usuarios premium pueden crear productos' });
            }

            const newProduct = new Product({
                name,
                price,
                description,
                owner: user.email
            });

            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error) {
            logger.error('Error en createProduct:', error.message);
            next(error);
        }
    }

    async updateOne(req, res, next) {
        const productId = req.params.id;
        const updatedFields = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            logger.warn(`ID de producto inválido recibido UPDATE: ${productId}`);
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
