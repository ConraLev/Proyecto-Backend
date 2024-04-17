const express = require('express');
const router = express.Router();
const CartManager = require('../../dao/FileSystem/CartsManager');
const cartManager = new CartManager();



// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart(req.body.products);
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error creando carrito:', error);
        res.status(500).json({ error: 'Error creando carrito' });
    }
});

// Obtener objetos de un carrito 
/* router.get('/:id', (req, res) => {
    const cartId = parseInt(req.params.id);
    const cart = cartManager.getCartById(cartId);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
}); */

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.productId');
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
    }
});


// Agregar producto a un carrito especifico
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1; 

        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});



router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        await Cart.findByIdAndUpdate(cartId, { products: [] });
        res.json({ status: 'success', message: 'Se eliminaron todos los productos del carrito' });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
    }
});


router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { products } = req.body;
        const cart = await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
        res.json(cart);
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
    }
});


router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        const cart = await Cart.findById(cartId);
        const productIndex = cart.products.findIndex(product => product._id == productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});


router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        await Cart.findByIdAndUpdate(cartId, { products: [] });
        res.json({ status: 'success', message: 'Se eliminaron todos los productos del carrito' });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
    }
});


module.exports = router;