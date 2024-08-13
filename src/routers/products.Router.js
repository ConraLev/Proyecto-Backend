const express = require('express');
const router = express.Router();
const generateMockProducts = require('../mocks/products.mocking');
const logger = require('../utils/logger');
const { userIsAdmin } = require('../middlewares/auth.middleware');

const configure = (app) => {
    const productController = app.get('productController');
    const viewController = app.get('viewsController');

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

    router.get('/admin', userIsAdmin, viewController.renderProdAdminPage.bind(viewController));
    router.post('/create', productController.createOne.bind(productController));
    router.get('/:id', productController.getById.bind(productController));
    router.put('/:id', productController.updateOne.bind(productController));
    router.delete('/:id', productController.deleteById.bind(productController));

    app.use('/products', router);
};

module.exports = { configure };
