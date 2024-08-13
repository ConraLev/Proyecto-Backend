const mongoose = require('mongoose');
const { validateProduct } = require('../test/product.validator');
const { createError } = require('../services/errors/errorHandler');
const { CustomError } = require('../services/errors/customError');
const { ErrorCodes } = require('../services/errors/errorCodes');
const  Product  = require('../dao/models/products.model');
const  User  = require('../dao/models/user.model');
const sendMail = require('../utils/mailer');
const logger = require('../utils/logger'); 

class ProductController {
    constructor(ProductService) {
        this.service = ProductService;
    }


    async adminView(req, res, next) {
        try {
            const products = await this.service.getAllProducts();
            res.render('productAdmin', { products });
        } catch (error) {
            logger.error(`Error en adminView: ${error.message}`);
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const products = await this.service.getAllProducts();
            res.json(products);
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

            if (userRole === 'admin' || (userRole === 'premium' && product.owner === user.email)) {
                await this.service.deleteById(productId);

                if (userRole === 'premium' && product.owner === user.email) {
                    await sendMail(
                        user.email,
                        'Producto Eliminado',
                        `El producto ${product.title} con ID ${productId} ha sido eliminado.`
                    );
                }

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
    
            if (!user || (user.role !== 'premium' && user.role !== 'admin')) {
                return res.status(403).json({ error: 'Solo los usuarios premium o administradores pueden crear productos' });
            }

            const priceNumber = Number(price);
    
            const validationErrors = validateProduct({ 
                title, 
                description, 
                price: priceNumber, 
                thumbnail, 
                code, 
                stock, 
                category 
            });
    
            if (validationErrors.length > 0) {
                console.log('Errores de validación:', validationErrors);
                logger.warn(`Validación fallida al crear producto: ${JSON.stringify(validationErrors)}`);
                throw createError('MISSING_REQUIRED_FIELDS', validationErrors);
            }
    
            const lastProduct = await Product.findOne().sort({ id: -1 }).exec();
            const nextId = lastProduct ? lastProduct.id + 1 : 1;
    
            const newProduct = new Product({
                id: nextId,
                title,
                description,
                price: priceNumber,
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
