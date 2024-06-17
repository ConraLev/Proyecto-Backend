class CartService {
    constructor(cartDao) {
        this.cartDao = cartDao;
    }

    async getCartById(cartId) {
        return await this.cartDao.getCartById(cartId);
    }

    async addItemToCart(cartId, productId, quantity) {
        return await this.cartDao.addItemToCart(cartId, productId, quantity);
    }

    async removeItemFromCart(cartId, productId) {
        return await this.cartDao.removeItemFromCart(cartId, productId);
    }

    async clearCart(cartId) {
        return await this.cartDao.clearCart(cartId);
    }

    async purchase(cartId, userId) {
        const cart = await this.cartDao.getCartById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const products = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        const amount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        return { products, amount };
    }
}

module.exports = { CartService };
