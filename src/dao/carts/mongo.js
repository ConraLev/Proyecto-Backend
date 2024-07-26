const mongoose = require('mongoose');
const { dbName, mongoUrl } = require('../../config/dbConfig');
const CartModel = require('../models/carts.model');


class MongoDAO {
    async init() {
        try {
            await mongoose.connect(mongoUrl, { dbName });
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }
    
    async getById(cartId) {
        try {
            return await CartModel.findById(cartId);
        } catch (error) {
            console.error('Error fetching cart by ID:', error);
            throw error;
        }
    }
    
    async addItem(cartId, item) {
        try {
            const cart = await CartModel.findById(cartId);
        if (cart) {
                cart.items.push(item);
                await cart.save();
            }
            return cart;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
    }
    
    
    async removeItem(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (cart) {
                cart.items = cart.items.filter(item => item.productId.toString() !== productId);
                await cart.save();
            }
            return cart;
        } catch (error) {
            console.error('Error removing item from cart:', error);
            throw error;
        }
    }
    
    async clearCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (cart) {
                cart.items = [];
                await cart.save();
            }
            return cart;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
}
    

module.exports = { MongoDAO };
