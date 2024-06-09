const mongoose = require('mongoose');
const { dbName, mongoUrl } = require('../../config/dbConfig');
const CartModel = require('../models/carts.model');

class MongoDAO {
    async init() {
        await mongoose.connect(mongoUrl, { dbName });
    }

    async getById(cartId) {
        return CartModel.findById(cartId);
    }

    async addItem(cartId, item) {
        const cart = await CartModel.findById(cartId);
        if (cart) {
            cart.items.push(item);
            await cart.save();
        }
        return cart;
    }

    async removeItem(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (cart) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            await cart.save();
        }
        return cart;
    }

    async clearCart(cartId) {
        const cart = await CartModel.findById(cartId);
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        return cart;
    }
}

module.exports = { MongoDAO };
