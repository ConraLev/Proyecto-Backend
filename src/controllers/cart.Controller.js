const { CustomError } = require('../services/errors/customError');
const Product = require('../dao/models/products.model');  

class CartController {
    constructor(service) {
        this.service = service;
    }

    #handleError(res, err) {
        console.error('Error:', err); 
        if (err instanceof CustomError) {
            return res.status(err.code).json({ error: err.message, details: err.details });
        }

        return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }

    async getCartById(req, res) {
        try {
            const cartId = req.params.id;
            const cart = await this.service.getCartById(cartId);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error in getCartById:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async addItemToCart(req, res) {
        const cartId = req.params.cartId;
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            if (userRole === 'premium' && product.owner.toString() === userId.toString()) {
                throw new CustomError(403, 'No puedes agregar tu propio producto premium al carrito');
            }

            const updatedCart = await this.service.addItemToCart(cartId, productId, quantity);
            res.status(200).json(updatedCart);
        } catch (error) {
            this.#handleError(res, error);
        }
    }

    async removeItemFromCart(req, res) {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        try {
            const updatedCart = await this.service.removeItemFromCart(cartId, productId);
            res.json(updatedCart);
        } catch (error) {
            this.#handleError(res, error);
        }
    }

    async clearCart(req, res) {
        const cartId = req.params.cartId;
        try {
            const updatedCart = await this.service.clearCart(cartId);
            res.json(updatedCart);
        } catch (error) {
            this.#handleError(res, error);
        }
    }

    async purchase(req, res) {
        const cartId = req.params.cid;
        const userId = req.user.id;

        try {
            const result = await this.service.purchase(cartId, userId);

            const ticket = new TicketModel({
                user: userId,
                products: result.products,
                amount: result.amount,
                purchaseDate: new Date()
            });

            await ticket.save();

            res.status(200).json({ message: 'Compra realizada con éxito', ticket });
        } catch (error) {
            this.#handleError(res, error);
        }
    }
}

module.exports =  { CartController };
