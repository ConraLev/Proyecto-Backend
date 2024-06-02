class CartController {
    constructor(CartService) {
        this.service = CartService;
    }

    #handleError(res, err) {
        if (err.message === 'not found') {
            return res.status(404).json({ error: 'Not found' });
        }

        if (err.message === 'invalid parameters') {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        return res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
    }

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
}

module.exports = { CartController };
