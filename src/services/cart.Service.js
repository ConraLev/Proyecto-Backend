class CartService {
    constructor(storage) {
        this.storage = storage;
    }

    getCartById(cartId) {
        return this.storage.getCartById(cartId);
    }

    addItemToCart(cartId, productId, quantity) {
        if (!cartId || !productId || !quantity) {
            throw new Error('invalid parameters');
        }
        return this.storage.addItemToCart(cartId, productId, quantity);
    }

    removeItemFromCart(cartId, productId) {
        if (!cartId || !productId) {
            throw new Error('invalid parameters');
        }
        return this.storage.removeItemFromCart(cartId, productId);
    }

    clearCart(cartId) {
        if (!cartId) {
            throw new Error('invalid parameters');
        }
        return this.storage.clearCart(cartId);
    }
}

module.exports = { CartService };
