
const { CustomError } = require('../services/errors/customError');

class CartController {
    constructor(service) {
        this.service = service;
    }

    #handleError(res, err) {
        if (err instanceof CustomError) {
            return res.status(err.code).json({ error: err.message, details: err.details });
        }

        return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }

    async getCartById(req, res) {
        const cartId = req.params.id;
        try {
            const cart = await this.service.getCartById(cartId);
            res.json(cart);
        } catch (error) {
            this.#handleError(res, error);
        }
    }

    async addItemToCart(req, res) {
        const cartId = req.params.cartId;
        const { productId, quantity } = req.body;
        try {
            const updatedCart = await this.service.addItemToCart(cartId, productId, quantity);
            res.json(updatedCart);
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

module.exports = { CartController };
