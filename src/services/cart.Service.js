const { CustomError } = require('../services/errors/customError');
const { ErrorCodes } = require('../services/errors/errorCodes');
const CartModel = require('../dao/models/carts.model');
const Product = require('../dao/models/products.model')

class CartService {
    constructor(storage) {
        this.storage = storage;
    }

    async getCartById(cartId) {
        const cart = await this.storage.getById(cartId);
    
        if (!cart) {
            return null;
        }
    
        const productIds = [...new Set(cart.products.map(item => item.productId))];
        const productIdsAsNumbers = productIds.map(id => Number(id));
        const products = await Product.find({ id: { $in: productIdsAsNumbers } }).lean();
    
        const productMap = new Map(products.map(product => [product.id.toString(), product]));
    
        const cartItems = cart.products.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            title: productMap.get(item.productId.toString())?.title || 'Desconocido',
            price: productMap.get(item.productId.toString())?.price || 0,
        }));
    
        return {
            ...cart.toObject(),
            products: cartItems
        };
    }
    
    async addItemToCart(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND, 'Carrito no encontrado');
            }
    
            const existingItemIndex = cart.products.findIndex(item => item.productId === productId);
            
            if (existingItemIndex > -1) {
                cart.products[existingItemIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
    
            return await cart.save();
        } catch (error) {
            throw new CustomError(ErrorCodes.CART_UPDATE_FAILED, 'Error al añadir producto al carrito');
        }
    }
    
    async removeItemFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw { statusCode: 404, message: 'Carrito no encontrado' };
    
            if (!cart.products) throw { statusCode: 500, message: 'El carrito no tiene un campo de items' };
    
            const productIndex = cart.products.findIndex(item => item.productId.toString() === productId.toString());
            if (productIndex === -1) throw { statusCode: 404, message: 'Producto no encontrado en el carrito' };
    
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity -= 1;
            } else {
                cart.products.splice(productIndex, 1);
            }
            
            await cart.save();
            return true;
        } catch (error) {
            console.error('Error en removeItemFromCart:', error); 
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new CustomError(404, 'Carrito no encontrado');
            }
    
            cart.products = [];
            return await cart.save();
        } catch (error) {
            throw new CustomError(500, 'Error al limpiar el carrito');
        }
    }

    async purchase(cartId, userId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                throw new CustomError(404, 'Carrito no encontrado');
            }
            
            const products = cart.products.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));
            
            const amount = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);
    
            await this.clearCart(cartId);
    
            return { products, amount };
        } catch (error) {
            throw new CustomError(500, 'Error al procesar la compra');
        }
    }
    
}

module.exports = { CartService };


