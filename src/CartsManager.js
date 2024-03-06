const fs = require('fs');

class CartManager {
    constructor(path = './carrito.json') {
        this.path = path;
        this.carts = [];
        this.loadCarts();
        this.counterId = 1;
    }


    // Guardar carrito
    async saveCarts() {
        try {
            const data = JSON.stringify(this.carts, null, '\t');
            await fs.promises.writeFile(this.path, data);
            console.log('Carrito guardado exitosamente');
        } catch (error) {
            console.log('Error al guardar carrito:', error);
        }
    }

    // Cargar carrito
    async loadCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            if (data.trim() !== '') {
                this.carts = JSON.parse(data);
            }
        } catch (error) {
            console.log('Error al cargar carrito:', error);
        }
    }

    // Generar ID de carrito
    generateUniqueId() {
        const maxId = this.carts.reduce((max, product) => {
            return product.id > max ? product.id : max;
        }, 0);
        return maxId + 1;
    }

    // Crear carrito
    async createCart(products = []) {
        const cartId = this.generateUniqueId();
        const newCart = {
            id: cartId,
            products: products
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    // Obtener carrito por ID
    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    // Agregar producto al carrito por ID de carrito y producto
    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            throw new Error(`Carrito con ID ${cartId} no encontrado`);
        }

        const productIndex = cart.products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity: quantity });
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;