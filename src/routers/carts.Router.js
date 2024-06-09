const express = require('express');
const router = express.Router();

const configure = (app) => {
    const cartController = app.get('cartController');

    if (!cartController) {
        throw new Error('CartController is not defined');
    }

    router.get('/:id', cartController.getCartById.bind(cartController));
    router.post('/:cartId/item', cartController.addItemToCart.bind(cartController));
    router.delete('/:cartId/item/:productId', cartController.removeItemFromCart.bind(cartController));
    router.delete('/:cartId', cartController.clearCart.bind(cartController));

    app.use('/carts', router);
};

module.exports = { configure };

