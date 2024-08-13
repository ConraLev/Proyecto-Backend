const express = require('express');
const router = express.Router();
const {  userIsLoggedIn, ensureAuthenticated } = require('../middlewares/auth.middleware');
const { CartController } = require('../controllers/cart.Controller'); 

const configure = (app) => {
    const service = app.get('cartService'); 
    const cartController = new CartController(service); 

    if (!cartController) {
        throw new Error('CartController is not defined');
    }

    router.get('/:id', userIsLoggedIn, cartController.getCartById.bind(cartController)); 
    router.get('/:id/json', userIsLoggedIn, cartController.getCartAsJson.bind(cartController));
    router.post('/:cartId/purchase', ensureAuthenticated, cartController.purchase.bind(cartController));
    router.post('/:cartId/item', ensureAuthenticated, cartController.addItemToCart.bind(cartController));
    router.delete('/:cartId/item/:productId', cartController.deleteItemFromCart.bind(cartController));
    router.delete('/:cartId', cartController.clearCart.bind(cartController));



    app.use('/carts', router);
};

module.exports = { configure };
