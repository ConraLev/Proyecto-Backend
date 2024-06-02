const express = require('express');
const router = express.Router();

const { ProductController } = require('../controllers/product.Controller');
const { ProductService } = require('../services/product.Service');
const { ProductStorage } = require('../persistence/product.Storage');

const withController = callback => {
    return (req, res) => {
        const service = new ProductService(new ProductStorage());
        const controller = new ProductController(service);
        return callback(controller, req, res);
    };
};

router.get('/', withController((controller, req, res) => controller.getAll(req, res)));

router.get('/:id', withController((controller, req, res) => controller.getById(req, res)));

router.post('/', withController((controller, req, res) => controller.createOne(req, res)));

router.delete('/:id', withController((controller, req, res) => controller.deleteById(req, res)));

router.put('/:id', withController((controller, req, res) => controller.updateOne(req, res)));

module.exports = {
    configure: app => app.use('/products', router)
}