const express = require('express');
const router = express.Router();

const configure = (app) => {
    const productController = app.get('productController');

    if (!productController) {
        throw new Error('ProductController is not defined');
    }

    router.get('/', productController.getAll.bind(productController));
    router.get('/:id', productController.getById.bind(productController));
    router.post('/', productController.createOne.bind(productController));
    router.put('/:id', productController.updateOne.bind(productController));
    router.delete('/:id', productController.deleteById.bind(productController));

    app.use('/products', router);
};

module.exports = { configure };
