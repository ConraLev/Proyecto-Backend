const Carts = require('../models/carts.model')

class MemoryDAO {
    constructor() {
        this.carts = [];
    }

    async init() {const mongoDAO = new MongoDAO();
        await mongoDAO.init();
        this.carts = await mongoDAO.getAll();
    }

    async getById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    async addItem(cartId, item) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (cart) {
            cart.items.push(item);
        }
        return cart;
    }

    async removeItem(cartId, productId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (cart) {
            cart.items = cart.items.filter(item => item.productId !== productId);
        }
        return cart;
    }

    async clearCart(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (cart) {
            cart.items = [];
        }
        return cart;
    }
}

module.exports = MemoryDAO;
