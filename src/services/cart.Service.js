const { CustomError } = require('../services/errors/customError');
const { ErrorCodes } = require('../services/errors/errorCodes');

class CartService {
    constructor(cartDao) {
        this.cartDao = cartDao;
    }

    async getCartById(cartId) {
        const cart = await this.cartDao.getCartById(cartId);
        if (!cart) {
            throw new CustomError(ErrorCodes.CART_NOT_FOUND, 'Carrito no encontrado');
        }
        return cart;
    }

    async addItemToCart(cartId, productId, quantity) {
        const updatedCart = await this.cartDao.addItemToCart(cartId, productId, quantity);
        if (!updatedCart) {
            throw new CustomError(ErrorCodes.CART_NOT_FOUND, 'Carrito no encontrado');
        }
        return updatedCart;
    }

    async removeItemFromCart(cartId, productId) {
        const updatedCart = await this.cartDao.removeItemFromCart(cartId, productId);
        if (!updatedCart) {
            throw new CustomError(ErrorCodes.CART_NOT_FOUND, 'Carrito o producto no encontrado');
        }
        return updatedCart;
    }

    async clearCart(cartId) {
        const updatedCart = await this.cartDao.clearCart(cartId);
        if (!updatedCart) {
            throw new CustomError(ErrorCodes.CART_NOT_FOUND, 'Carrito no encontrado');
        }
        return updatedCart;
    }

    async purchase(cartId, userId) {
        try {
            const cart = await this.getCartById(cartId);
            const products = cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));
            const amount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

            return { products, amount };
        } catch (error) {
            throw new CustomError(ErrorCodes.CART_NOT_FOUND, 'Carrito no encontrado');
        }
    }
}

module.exports = { CartService };
