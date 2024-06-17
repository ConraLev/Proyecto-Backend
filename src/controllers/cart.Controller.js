const TicketModel = require('../dao/models/ticket.model');

class CartController {
    constructor(service) {
        this.service = service;
    }

    // Método para manejar errores
    #handleError(res, err) {
        if (err.message === 'not found') {
            return res.status(404).json({ error: 'Not found' });
        }

        if (err.message === 'invalid parameters') {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        return res.status(500).json({ status: 'error', message: 'Error al procesar la solicitud' });
    }

    // Obtener carrito por ID
    async getCartById(req, res) {
        const cartId = req.params.id;
        try {
            const cart = await this.service.getCartById(cartId);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(cart);
        } catch (error) {
            this.#handleError(res, error);
        }
    }

    // Agregar ítem al carrito
    async addItemToCart(req, res) {
        const cartId = req.params.cartId;
        const { productId, quantity } = req.body;
        try {
            const updatedCart = await this.service.addItemToCart(cartId, productId, quantity);
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(updatedCart);
        } catch (error) {
            this.#handleError(res, error);
        }
    }

    // Eliminar ítem del carrito
    async removeItemFromCart(req, res) {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        try {
            const updatedCart = await this.service.removeItemFromCart(cartId, productId);
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito o producto no encontrado' });
            }
            res.json(updatedCart);
        } catch (error) {
            this.#handleError(res, error);
        }
    }

    // Limpiar carrito
    async clearCart(req, res) {
        const cartId = req.params.cartId;
        try {
            const updatedCart = await this.service.clearCart(cartId);
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(updatedCart);
        } catch (error) {
            this.#handleError(res, error);
        }
    }

    // Comprar carrito
    async purchase(req, res) {
        const cartId = req.params.cid;
        const userId = req.user.id;

        try {
            const result = await this.service.purchase(cartId, userId);
            if (!result) {
                return res.status(404).json({ error: 'No se pudo realizar la compra' });
            }

            // Crear un ticket con los detalles de la compra
            const ticket = new TicketModel({
                user: userId,
                products: result.products,
                amount: result.amount,
                purchaseDate: new Date()
            });

            // Guardar el ticket en la base de datos
            await ticket.save();

            res.status(200).json({ message: 'Compra realizada con éxito', ticket });
        } catch (error) {
            this.#handleError(res, error);
        }
    }
}

module.exports = { CartController };
