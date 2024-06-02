const express = require('express');
const router = express.Router();

const { CartController } = require('../controllers/cart.Controller');
const { CartService } = require('../services/cart.Service');
const { CartStorage } = require('../persistence/cart.Storage');

const withController = callback => {
    return (req, res) => {
        const service = new CartService(new CartStorage());
        const controller = new CartController(service);
        return callback(controller, req, res);
    };
};

router.get('/:id', withController((controller, req, res) => controller.getCartById(req, res)));

router.post('/:cartId/item', withController((controller, req, res) => controller.addItemToCart(req, res)));

router.delete('/:cartId/item/:productId', withController((controller, req, res) => controller.removeItemFromCart(req, res)));

router.delete('/:cartId', withController((controller, req, res) => controller.clearCart(req, res)));

module.exports = {
    configure: app => app.use('/carts', router)
};


