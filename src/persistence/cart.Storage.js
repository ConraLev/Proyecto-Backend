/* const Cart = require('../dao/models/carts.model');

class CartStorage {
    getCartById(cartId) {
        return Cart.findById(cartId).lean();
    }

    async addItemToCart(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.items[productIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        
        await cart.save();
        return cart;
    }

    async removeItemFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();
        return cart;
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.items = [];
        await cart.save();
        return cart;
    }
}

module.exports = { CartStorage }; */


const Cart = require('../dao/models/carts.model');

class CartStorage {
    getCartById(cartId) {
        return Cart.findById(cartId).lean();
    }

    async addItemToCart(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        
        await cart.save();
        return cart;
    }

    async removeItemFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(item => item.productId.toString() !== productId);

        await cart.save();
        return cart;
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.products = [];
        await cart.save();
        return cart;
    }
}

module.exports = { CartStorage };
