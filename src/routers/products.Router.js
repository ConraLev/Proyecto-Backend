const express = require('express');
const router = express.Router();
const generateMockProducts = require('../mocks/products.mocking');
const logger = require('../utils/logger');
const ProductController = require('../controllers/product.Controller');

const configure = (app) => {
    const productController = app.get('productController');

    if (!productController) {
        throw new Error('ProductController is not defined');
    }

    
    router.get('/mockingproducts', (req, res) => {
        const products = generateMockProducts();
        res.json(products);
    });

    router.get('/loggerTest', (req, res) => {
        logger.debug('Mensaje de debug');
        logger.info('Mensaje de info');
        logger.warn('Mensaje de advertencia');
        logger.error('Mensaje de error');
        res.send('Prueba de logs realizada');
    });

   
    router.post('/', productController.createOne.bind(productController));
    router.post('/create', productController.createProduct.bind(ProductController));
    router.get('/:id', productController.getById.bind(productController));
    router.put('/:id', productController.updateOne.bind(productController));
    router.delete('/:id', productController.deleteById.bind(productController));

    app.use('/products', router);
};

module.exports = { configure };
