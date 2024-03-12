const express = require('express');
const router = express.Router();
const CartManager = require('../CartsManager');
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
router.get('/:id', (req, res) => {
    const cartId = parseInt(req.params.id);
    const cart = cartManager.getCartById(cartId);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
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



module.exports = router;